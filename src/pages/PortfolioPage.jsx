import { useEffect, useState } from "react";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import ManualHoldingDrawer from "../components/portfolio/ManualHoldingDrawer";
import AssetDrawer from "../components/portfolio/AssetDrawer";
import {
  refreshExchangeHoldings,
  refreshManualHoldings,
} from "../services/holdingService";

export default function PortfolioPage() {
  const [exchangeHoldings, setExchangeHoldings] = useState([]);
  const [manualHoldings, setManualHoldings] = useState([]);

  const [viewAsset, setViewAsset] = useState(null); // 🔥 View
  const [editAsset, setEditAsset] = useState(null); // ✏️ Edit
  const [loading, setLoading] = useState(true);

  const loadHoldings = async () => {
    try {
      setLoading(true);
      const [exRes, manRes] = await Promise.all([
        refreshExchangeHoldings(),
        refreshManualHoldings(),
      ]);

      setExchangeHoldings(exRes.data || []);
      setManualHoldings(manRes.data || []);
    } catch (e) {
      console.error("Failed to load holdings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* ================= Exchange Holdings ================= */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-xl mb-4">Exchange Holdings</h2>

        {loading ? (
          <p>Loading...</p>
        ) : exchangeHoldings.length === 0 ? (
          <p className="text-slate-400">No exchange holdings</p>
        ) : (
          <HoldingsTable
            data={exchangeHoldings}
            onView={setViewAsset}
          />
        )}
      </div>

      {/* ================= Manual Holdings ================= */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Manual Holdings</h2>
          <button
            onClick={() => setEditAsset({})}
            className="bg-green-600 px-4 py-2 rounded"
          >
            + Add Asset
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : manualHoldings.length === 0 ? (
          <p className="text-slate-400">No manual holdings</p>
        ) : (
          <HoldingsTable
            data={manualHoldings}
            onView={setViewAsset}
            onEdit={setEditAsset}
          />
        )}
      </div>

      {/* ================= VIEW DRAWER ================= */}
      <AssetDrawer
        asset={viewAsset}
        onClose={() => setViewAsset(null)}
      />

      {/* ================= EDIT DRAWER ================= */}
      <ManualHoldingDrawer
        asset={editAsset}
        onClose={() => setEditAsset(null)}
        onSaved={loadHoldings}
      />
    </div>
  );
}
