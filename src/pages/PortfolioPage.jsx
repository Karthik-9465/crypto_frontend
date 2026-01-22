import { useEffect, useRef, useState } from "react";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import ManualHoldingDrawer from "../components/portfolio/ManualHoldingDrawer";
import AssetDrawer from "../components/portfolio/AssetDrawer";
import {
  refreshExchangeHoldings,
  refreshManualHoldings,
  deleteManualHolding,
} from "../services/holdingService";

export default function PortfolioPage() {
  const [exchangeHoldings, setExchangeHoldings] = useState([]);
  const [manualHoldings, setManualHoldings] = useState([]);
  const [viewAsset, setViewAsset] = useState(null);
  const [editAsset, setEditAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 STRICT MODE GUARD (KEY FIX)
  const hasLoadedRef = useRef(false);

  const loadHoldings = async () => {
    try {
      setLoading(true);

      const [exRes, manRes] = await Promise.all([
        refreshExchangeHoldings(),
        refreshManualHoldings(),
      ]);

      setExchangeHoldings(exRes?.data || []);
      setManualHoldings(manRes?.data || []);
    } catch (err) {
      console.error("Failed to load holdings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Prevent double API call in React 18 StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadHoldings();
  }, []);

  /* ✅ BACKEND DELETE + SAFE REFRESH */
  const handleDeleteManual = async (asset) => {
    const ok = window.confirm(
      `Delete ${asset.assetSymbol}?`
    );
    if (!ok) return;

    await deleteManualHolding(asset.assetSymbol);
    loadHoldings(); // single controlled refresh
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        body::before, body::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
          z-index: 0;
        }

        body::before {
          width: 500px;
          height: 500px;
          top: -150px;
          left: -150px;
          animation: float 20s infinite ease-in-out;
        }

        body::after {
          width: 400px;
          height: 400px;
          bottom: -100px;
          right: -100px;
          animation: float 15s infinite ease-in-out reverse;
        }

        .portfolio-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          max-width: 80rem;
          margin: 0 auto;
        }

        .holdings-section {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          margin-bottom: 2rem;
          animation: fadeIn 0.5s ease-out;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .add-asset-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .add-asset-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        @media (max-width: 768px) {
          .portfolio-container {
            padding: 1.5rem;
          }

          .holdings-section {
            padding: 1.5rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .add-asset-btn {
            width: 100%;
          }

          .section-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          body::before,
          body::after {
            display: none;
          }

          .portfolio-container {
            padding: 1rem;
          }

          .holdings-section {
            padding: 1rem;
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="portfolio-container">
        {/* Exchange Holdings */}
        <div className="holdings-section">
          <div className="section-header">
            <h2 className="section-title">Exchange Holdings</h2>
          </div>
          <HoldingsTable
            data={exchangeHoldings}
            loading={loading}
            onView={setViewAsset}
          />
        </div>

        {/* Manual Holdings */}
        <div className="holdings-section">
          <div className="section-header">
            <h2 className="section-title">Manual Holdings</h2>
            <button
              onClick={() => setEditAsset({})}
              className="add-asset-btn"
            >
              + Add Asset
            </button>
          </div>

          <HoldingsTable
            data={manualHoldings}
            loading={loading}
            onView={setViewAsset}
            onEdit={setEditAsset}
            onDelete={handleDeleteManual}
          />
        </div>

        {viewAsset && (
          <AssetDrawer
            asset={viewAsset}
            onClose={() => setViewAsset(null)}
          />
        )}

        <ManualHoldingDrawer
          asset={editAsset}
          onClose={() => setEditAsset(null)}
          onSaved={loadHoldings}
        />
      </div>
    </>
  );
}