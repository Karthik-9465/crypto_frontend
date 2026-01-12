import { useState } from "react";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import AssetDrawer from "../components/portfolio/AssetDrawer";

const alerts = [
  {
    id: 1,
    level: "HIGH",
    title: "Potential Rug Pull Detected",
    asset: "ADA",
    source: "Wallet",
    time: "5 min ago",
    description:
      "Token appears in CryptoScamDB; suspicious holder distribution detected."
  },
  {
    id: 2,
    level: "MEDIUM",
    title: "High Volatility Token",
    asset: "SOL",
    source: "Binance",
    time: "1 hour ago",
    description:
      "Price changed more than 25% in the last 24 hours."
  },
  {
    id: 3,
    level: "LOW",
    title: "Low Liquidity",
    asset: "DOGE",
    source: "Metamask",
    time: "Yesterday",
    description:
      "Daily trading volume under $10k; may be hard to exit."
  }
];

const badgeStyle = {
  HIGH: "bg-red-500/20 text-red-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  LOW: "bg-emerald-500/20 text-emerald-400"
};

const iconMap = {
  HIGH: AlertTriangle,
  MEDIUM: ShieldAlert,
  LOW: Info
};

export default function RiskAlertsPage() {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const high = alerts.filter((a) => a.level === "HIGH").length;
  const medium = alerts.filter((a) => a.level === "MEDIUM").length;
  const low = alerts.filter((a) => a.level === "LOW").length;

  /* 🔗 Open Asset Drawer */
  const openAsset = (alert) => {
    setSelectedAsset({
      asset: alert.asset,
      exchange: alert.source,
      qty: 0,
      price: 41000, // mock price
      value: 0,
      risk: alert.level,
      notes: alert.description
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* <div>
        <h1 className="text-2xl font-bold">Risk & Alerts</h1>
        <p className="text-slate-400">
          Scam and risk insights based on your holdings (mock data).
        </p>
      </div> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="High Risk" count={high} color="text-red-400" />
        <SummaryCard title="Medium Risk" count={medium} color="text-yellow-400" />
        <SummaryCard title="Low Risk" count={low} color="text-emerald-400" />
      </div>

      {/* Alerts List */}
      <div className="bg-[#0b1220] border border-white/5 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Active Risk & Scam Alerts</h2>
          <span className="text-sm text-slate-400">
            {alerts.length} alerts
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = iconMap[alert.level];
            return (
              <div
                key={alert.id}
                className="border border-white/5 rounded-xl p-4 hover:bg-white/5 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Icon
                      className={
                        alert.level === "HIGH"
                          ? "text-red-400"
                          : alert.level === "MEDIUM"
                          ? "text-yellow-400"
                          : "text-emerald-400"
                      }
                    />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-slate-400">
                        Token {alert.asset} · {alert.source} · {alert.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle[alert.level]}`}
                  >
                    {alert.level}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mt-3">
                  {alert.description}
                </p>

                {/* ✅ WORKING BUTTON */}
                <button
                  onClick={() => openAsset(alert)}
                  className="mt-3 text-sm text-emerald-400 hover:underline"
                >
                  View Asset →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ ASSET DRAWER */}
      <AssetDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}

/* Summary Card */
function SummaryCard({ title, count, color }) {
  return (
    <div className="bg-[#0b1220] border border-white/5 rounded-xl p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  );
}
