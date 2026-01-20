import { useEffect, useState } from "react";
import { getPriceSnapshots } from "../../services/priceSnapshotService";

export default function AssetPriceSection({ asset }) {
  const [symbol, setSymbol] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (asset?.assetSymbol) {
      setSymbol(asset.assetSymbol);
      setPrices([]);
      setError("");
    }
  }, [asset]);

  const fetchPrices = async () => {
    if (!symbol) return;

    try {
      setLoading(true);
      setError("");

      const res = await getPriceSnapshots(symbol);
      setPrices(res.data || []);
    } catch {
      setError("Failed to fetch price data");
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  if (!asset) return null;

  const currentPrice =
    prices.length > 0 ? prices[prices.length - 1].priceUsd : 0;

  const invested = asset.quantity * asset.avgCost;
  const currentValue = asset.quantity * currentPrice;
  const pnl = currentValue - invested;

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
      <h3 className="text-lg mb-4">
        {symbol} Price Details
      </h3>

      {/* Asset Symbol (locked) */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={symbol}
          disabled
          className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white opacity-70"
        />
        <button
          onClick={fetchPrices}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading price data...</p>}

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {prices.length > 0 && (
        <>
          <p>
            Current Price: <b>${currentPrice}</b>
          </p>

          <p
            className={`mt-1 ${
              pnl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            P/L: ${pnl.toFixed(2)}
          </p>

          <hr className="my-3 border-slate-700" />

          <div className="max-h-52 overflow-y-auto text-sm">
            {prices.map((p, i) => (
              <div
                key={i}
                className="flex justify-between py-1"
              >
                <span>
                  {new Date(p.capturedAt).toLocaleDateString()}
                </span>
                <span>${p.priceUsd}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && prices.length === 0 && (
        <p className="text-sm text-slate-400">
          Click Fetch to load last 7 days price data
        </p>
      )}
    </div>
  );
}
