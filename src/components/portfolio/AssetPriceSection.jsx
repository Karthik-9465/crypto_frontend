import { useEffect, useState } from "react";
import { getPriceSnapshots } from "../../services/priceSnapshotService";

export default function AssetPriceSection({ asset }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asset?.assetSymbol) return;

    const loadPrices = async () => {
      setLoading(true);
      const res = await getPriceSnapshots(asset.assetSymbol);
      setPrices(res.data || []);
      setLoading(false);
    };

    loadPrices();
  }, [asset]);

  if (!asset) return null;
  if (loading) return <p>Loading price data...</p>;
  if (prices.length === 0) return <p>No price data</p>;

  // ✅ Current price = last element (ascending order)
  const currentPrice = prices[prices.length - 1].priceUsd;

  // ✅ P/L calculation (SAME API DATA)
  const invested = asset.quantity * asset.avgCost;
  const currentValue = asset.quantity * currentPrice;
  const pnl = currentValue - invested;

  return (
    <div className="mt-6 bg-slate-900 p-4 rounded-xl border border-slate-700">
      <h3 className="text-lg mb-3">
        {asset.assetSymbol} Price Details
      </h3>

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

      {/* Simple price list (can replace with chart later) */}
      <div className="max-h-52 overflow-y-auto text-sm">
        {prices.map((p, i) => (
          <div key={i} className="flex justify-between py-1">
            <span>
              {new Date(p.capturedAt).toLocaleDateString()}
            </span>
            <span>${p.priceUsd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
