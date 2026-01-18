import { useEffect, useState } from "react";
import { getPriceSnapshots } from "../../services/priceSnapshotService";

export default function AssetDrawer({ asset, onClose }) {
  // ✅ Hooks MUST always be on top
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Load price snapshots when asset changes
  useEffect(() => {
    if (!asset || !asset.assetSymbol) return;

    const loadPrices = async () => {
      try {
        setLoading(true);
        setError("");
        setPrices([]);

        console.log(
          "📈 Fetching price snapshots for:",
          asset.assetSymbol
        );

        const res = await getPriceSnapshots(asset.assetSymbol);

        // ✅ Backend response: { message, data }
        const snapshotData = res?.data?.data || [];
        setPrices(snapshotData);
      } catch (err) {
        console.error("❌ Price snapshot error:", err);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to load price data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, [asset]);

  // 🚪 Drawer closed → render nothing (AFTER hooks)
  if (!asset) return null;

  // 🧮 Calculations
  const quantity = Number(asset.quantity || 0);
  const avgCost = Number(asset.avgCost || 0);

  const currentPrice =
    prices.length > 0
      ? Number(prices[prices.length - 1].priceUsd)
      : null;

  const investedValue = quantity * avgCost;
  const currentValue =
    currentPrice !== null
      ? quantity * currentPrice
      : null;

  const profitLoss =
    currentValue !== null
      ? currentValue - investedValue
      : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
      <div className="w-full max-w-md bg-slate-900 h-full p-6 border-l border-slate-700 overflow-y-auto">
        {/* 🔹 Header */}
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

        {/* 🔹 Asset Info */}
        <div className="space-y-2 text-sm mb-6">
          <p>
            <span className="text-slate-400">Quantity:</span>{" "}
            {quantity}
          </p>
          <p>
            <span className="text-slate-400">Avg Cost:</span>{" "}
            ${avgCost}
          </p>
          <p>
            <span className="text-slate-400">Source:</span>{" "}
            {asset.source || "MANUAL"}
          </p>
        </div>

        <hr className="border-slate-700 my-4" />

        {/* 🔹 Price Section */}
        {loading && (
          <p className="text-slate-400">
            Loading price history...
          </p>
        )}

        {!loading && error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && !error && prices.length === 0 && (
          <p className="text-slate-400">
            No price data available
          </p>
        )}

        {!loading && !error && prices.length > 0 && (
          <>
            <div className="space-y-2 mb-4">
              <p>
                <span className="text-slate-400">
                  Current Price:
                </span>{" "}
                ${currentPrice.toFixed(2)}
              </p>

              <p>
                <span className="text-slate-400">
                  Profit / Loss:
                </span>{" "}
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

            {/* 🔹 Price History */}
            <div className="mt-4">
              <h3 className="text-sm mb-2 text-slate-300">
                Price History
              </h3>
              <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
                {prices.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between"
                  >
                    <span>
                      {new Date(
                        p.capturedAt
                      ).toLocaleDateString()}
                    </span>
                    <span>${p.priceUsd}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* 🔹 Footer */}
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
