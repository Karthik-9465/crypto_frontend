import { X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* Coin symbol → full name mapping */
const COIN_NAMES = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  ADA: "Cardano",
  SOL: "Solana",
  DOGE: "Dogecoin"
};

const formatUSD = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);

/* Generate mock chart data */
const generateChartData = (basePrice, points, labelFn) =>
  Array.from({ length: points }, (_, i) => ({
    time: labelFn(i),
    price:
      basePrice +
      (Math.random() - 0.5) * basePrice * 0.08
  }));

export default function AssetDrawer({ asset, onClose }) {
  if (!asset) return null;

  const fullName = COIN_NAMES[asset.asset] || asset.asset;

  const [timeframe, setTimeframe] = useState("1D");
  const [livePrice, setLivePrice] = useState(asset.price);
  const [change, setChange] = useState(0);
  const [chartData, setChartData] = useState([]);

  /* Initialize chart based on timeframe */
  useEffect(() => {
    if (timeframe === "1D") {
      setChartData(
        generateChartData(
          asset.price,
          24,
          (i) => `${i}:00`
        )
      );
    } else if (timeframe === "7D") {
      setChartData(
        generateChartData(
          asset.price,
          7,
          (i) => `Day ${i + 1}`
        )
      );
    } else if (timeframe === "1Y") {
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];
      setChartData(
        generateChartData(
          asset.price,
          12,
          (i) => months[i]
        )
      );
    }
  }, [asset, timeframe]);

  /* Simulate live price */
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice((prev) => {
        const next =
          prev + (Math.random() - 0.5) * 50;
        setChange(
          ((next - asset.price) / asset.price) * 100
        );
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [asset]);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-[420px] bg-[#020617] border-l border-white/5 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {fullName}{" "}
            <span className="text-slate-400 text-sm">
              ({asset.asset})
            </span>
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Asset Info */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-slate-400">
            Source: {asset.exchange}
          </p>
          <p className="text-sm">
            Quantity: <b>{asset.qty}</b>
          </p>
          <p className="text-sm">
            Price:{" "}
            <b>{formatUSD(livePrice)}</b>
            <span
              className={`ml-2 ${
                change >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </p>
          <p className="text-sm">
            Value:{" "}
            <b>{formatUSD(livePrice * asset.qty)}</b>
          </p>
          <p className="text-sm">
            Risk:{" "}
            <span
              className={
                asset.risk === "HIGH"
                  ? "text-red-400"
                  : asset.risk === "MEDIUM"
                  ? "text-yellow-400"
                  : "text-emerald-400"
              }
            >
              {asset.risk}
            </span>
          </p>

          {asset.risk === "HIGH" && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle size={16} />
              High risk asset detected
            </div>
          )}
        </div>

        {/* Timeframe Tabs */}
        <div className="flex gap-2 mb-3">
          {["1D", "7D", "1Y"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === tf
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[240px] bg-white/5 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(v) => `$${v.toFixed(0)}`}
              />
              <Tooltip
                formatter={(v) => formatUSD(v)}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="mt-6">
          <p className="text-sm font-semibold mb-1">
            Active Alerts
          </p>
          <p className="text-xs text-slate-400">
            No alerts configured
          </p>
        </div>
      </div>
    </div>
  );
}
