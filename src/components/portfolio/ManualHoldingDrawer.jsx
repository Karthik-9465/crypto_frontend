import { useEffect, useState } from "react";
import { manualAddEditHolding } from "../../services/holdingService";

export default function ManualHoldingDrawer({
  asset,
  onClose,
  onSaved,
}) {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [avgCost, setAvgCost] = useState("");

  useEffect(() => {
    if (asset) {
      setSymbol(asset.assetSymbol || "");
      setQty(asset.quantity || "");
      setAvgCost(asset.avgCost || "");
    }
  }, [asset]);

  if (!asset) return null;

  const save = async () => {
    await manualAddEditHolding({
      assetSymbol: symbol.toUpperCase(),
      quantity: Number(qty),
      avgCost: Number(avgCost),
    });
    onSaved(); // 🔥 reload from backend
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-end">
      <div className="w-96 bg-slate-900 p-6">
        <h2 className="text-xl mb-4">
          {asset.assetSymbol ? "Edit Holding" : "Add Holding"}
        </h2>

        <input
          className="w-full p-2 mb-3 bg-slate-800 rounded"
          placeholder="Asset Symbol (BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-2 mb-3 bg-slate-800 rounded"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-2 mb-4 bg-slate-800 rounded"
          placeholder="Average Cost"
          value={avgCost}
          onChange={(e) => setAvgCost(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={save}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
