import { useState } from "react";
import { getPriceSnapshots } from "../../services/priceSnapshotService";
import { fetchAssetPnL } from "../../services/pnlService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AssetDrawer({ asset, onClose }) {
  /* ================= STATE ================= */
  const [prices, setPrices] = useState([]);
  const [assetPnL, setAssetPnL] = useState(null);

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingPnL, setLoadingPnL] = useState(false);
  const [error, setError] = useState("");

  if (!asset) return null;

  /* ================= FETCH PRICE SNAPSHOTS ================= */
  const fetchPrices = async () => {
    try {
      setLoadingPrices(true);
      setError("");
      setPrices([]);

      const symbol = asset.assetSymbol.trim().toUpperCase();

      const res = await getPriceSnapshots(symbol);

      // ✅ CORRECT RESPONSE PARSING + ASCENDING SORT
      const data = (res?.data?.data || []).sort(
        (a, b) =>
          new Date(a.capturedAt) - new Date(b.capturedAt)
      );

      setPrices(data);
    } catch (err) {
      console.error("Price snapshot error", err);
      setError("Failed to load price data");
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  /* ================= FETCH ASSET PnL ================= */
  const fetchPnL = async () => {
    try {
      setLoadingPnL(true);
      const res = await fetchAssetPnL(
        asset.assetSymbol.trim().toUpperCase()
      );
      setAssetPnL(res?.data?.data || null);
    } catch {
      setAssetPnL(null);
    } finally {
      setLoadingPnL(false);
    }
  };

  /* ================= CALCULATIONS ================= */
  const quantity = Number(asset.quantity || 0);
  const avgCost = Number(asset.avgCost || 0);

  const currentPrice =
    prices.length > 0
      ? Number(prices[prices.length - 1].priceUsd)
      : null;

  const investedValue = quantity * avgCost;
  const currentValue =
    currentPrice !== null ? quantity * currentPrice : null;

  const profitLoss =
    currentValue !== null ? currentValue - investedValue : null;

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
      <div className="w-full max-w-md bg-slate-900 h-full p-6 border-l border-slate-700 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {asset.assetSymbol} Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* ASSET INFO */}
        <div className="space-y-2 text-sm mb-6">
          <p><span className="text-slate-400">Quantity:</span> {quantity}</p>
          <p><span className="text-slate-400">Avg Cost:</span> ${avgCost}</p>
          <p><span className="text-slate-400">Source:</span> {asset.source || "MANUAL"}</p>
        </div>

        <hr className="border-slate-700 my-4" />

        {/* FETCH BUTTON */}
        <button
          onClick={() => {
            fetchPrices();
            fetchPnL();
          }}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Fetch Last 7 Days Prices
        </button>

        {/* PRICE STATES */}
        {loadingPrices && (
          <p className="text-slate-400">Loading price history...</p>
        )}

        {!loadingPrices && error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loadingPrices && prices.length === 0 && !error && (
          <p className="text-slate-400">
            Click fetch to load price data
          </p>
        )}

        {/* PRICE + GRAPH */}
        {!loadingPrices && prices.length > 0 && (
          <>
            <div className="space-y-2 mb-4">
              <p>
                <span className="text-slate-400">Current Price:</span>{" "}
                ${currentPrice.toFixed(2)}
              </p>

              <p>
                <span className="text-slate-400">Profit / Loss:</span>{" "}
                <span
                  className={
                    profitLoss >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  ${profitLoss.toFixed(2)}
                </span>
              </p>
            </div>

            {/* GRAPH */}
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prices}>
                  <XAxis
                    dataKey="capturedAt"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(v) =>
                      new Date(v).toLocaleDateString()
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="priceUsd"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PRICE HISTORY LIST */}
            <div className="mt-4">
              <h3 className="text-sm mb-2 text-slate-300">
                Price History
              </h3>

              <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {prices.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {new Date(p.capturedAt).toLocaleDateString()}
                    </span>
                    <span>${p.priceUsd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ASSET PNL */}
        <hr className="border-slate-700 my-4" />

        <h3 className="text-sm mb-2 text-slate-300">
          Asset P&L Summary
        </h3>

        {loadingPnL && (
          <p className="text-slate-400">Calculating P&L...</p>
        )}

        {!loadingPnL && assetPnL && (
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-400">Invested:</span> ${assetPnL.invested.toFixed(2)}</p>
            <p><span className="text-slate-400">Current Value:</span> ${assetPnL.currentValue.toFixed(2)}</p>
            <p>
              <span className="text-slate-400">Unrealized P&L:</span>{" "}
              <span
                className={
                  assetPnL.unrealizedPnL >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ${assetPnL.unrealizedPnL.toFixed(2)}
              </span>
            </p>
          </div>
        )}

        {!loadingPnL && !assetPnL && (
          <p className="text-slate-500 text-sm">
            Asset P&L not available
          </p>
        )}

        {/* FOOTER */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
