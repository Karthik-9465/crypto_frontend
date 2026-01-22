import { useEffect, useRef, useState } from "react";
import {
  fetchPortfolioPnL,
  fetchRealizedPnL,
  fetchAssetPnL,
  exportPnLCsv,
} from "../services/pnlService";

/* ✅ COLOR HELPER */
const valueClass = (val) =>
  val > 0 ? "value-positive" : val < 0 ? "value-negative" : "value-neutral";

export default function ReportsPage() {
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [portfolioPnL, setPortfolioPnL] = useState(null);
  const [realizedPnL, setRealizedPnL] = useState(null);

  const [assetInput, setAssetInput] = useState("");
  const [assetPnL, setAssetPnL] = useState(null);
  const [assetLoading, setAssetLoading] = useState(false);

  // 🔥 STRICT MODE GUARD
  const hasLoadedRef = useRef(false);

  /* ================= LOAD SUMMARY ================= */
  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [portfolioRes, realizedRes] = await Promise.all([
        fetchPortfolioPnL(),
        fetchRealizedPnL(),
      ]);

      setPortfolioPnL(portfolioRes?.data?.data || null);
      setRealizedPnL(realizedRes?.data?.data || null);
    } catch (e) {
      console.error("Reports load failed", e);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadReports();
  }, []);

  /* ================= ASSET PNL ================= */
  const handleAssetPnL = async () => {
    if (!assetInput.trim()) return;

    const symbol = assetInput.trim().toUpperCase();

    try {
      setAssetLoading(true);
      setAssetPnL(null);

      const res = await fetchAssetPnL(symbol);
      setAssetPnL(res?.data?.data || null);
    } catch {
      setAssetPnL(null);
    } finally {
      setAssetLoading(false);
    }
  };

  /* ================= CSV ================= */
  const downloadCsv = async () => {
    try {
      const res = await exportPnLCsv();
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pnl-report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("CSV export failed");
    }
  };

  if (loading) return <p className="loading-container">Loading reports...</p>;
  if (error) return <p className="error-container">{error}</p>;

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
        }

        .reports-container {
          padding: 2rem;
          max-width: 80rem;
          margin: auto;
          color: white;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .summary-card {
          background: #0f172a;
          border-radius: 16px;
          padding: 1.75rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .summary-label {
          color: #94a3b8;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .value-positive { color: #34d399; }
        .value-negative { color: #f87171; }
        .value-neutral { color: #ffffff; }

        .asset-search-section {
          background: #0f172a;
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .search-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-input {
          flex: 1;
          padding: 0.8rem;
          background: #020617;
          border: 1px solid #334155;
          border-radius: 10px;
          color: white;
        }

        .search-btn, .export-btn {
          background: #10b981;
          color: black;
          font-weight: 700;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }

        .asset-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .result-card {
          background: #020617;
          padding: 1.25rem;
          border-radius: 12px;
        }

        .result-label {
          color: #94a3b8;
          font-size: 0.75rem;
          margin-bottom: 0.4rem;
        }

        .result-value {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .export-section {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>

      <div className="reports-container">
        <h1 className="text-2xl mb-6">Reports</h1>

        {/* ===== SUMMARY ===== */}
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Realized P&L</p>
            <p className={`summary-value ${valueClass(realizedPnL.realizedPnL)}`}>
              ${realizedPnL.realizedPnL.toFixed(2)}
            </p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Unrealized P&L</p>
            <p className={`summary-value ${valueClass(portfolioPnL.unrealizedPnL)}`}>
              ${portfolioPnL.unrealizedPnL.toFixed(2)}
            </p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Tax Status</p>
            <p className="summary-value value-neutral">
              {realizedPnL.taxHint}
            </p>
          </div>
        </div>

        {/* ===== ASSET WISE ===== */}
        <div className="asset-search-section">
          <h2 className="mb-4">Asset-wise P&L</h2>

          <div className="search-row">
            <input
              className="search-input"
              placeholder="BTC, ETH..."
              value={assetInput}
              onChange={(e) => setAssetInput(e.target.value)}
            />
            <button className="search-btn" onClick={handleAssetPnL}>
              Get P&L
            </button>
          </div>

          {assetLoading && <p>Loading...</p>}

          {!assetLoading && assetPnL && (
            <div className="asset-results">
              <div className="result-card">
                <p className="result-label">Invested</p>
                <p className="result-value">
                  ${assetPnL.invested.toFixed(2)}
                </p>
              </div>

              <div className="result-card">
                <p className="result-label">Current Value</p>
                <p className="result-value">
                  ${assetPnL.currentValue.toFixed(2)}
                </p>
              </div>

              <div className="result-card">
                <p className="result-label">Unrealized P&L</p>
                <p className={`result-value ${valueClass(assetPnL.unrealizedPnL)}`}>
                  ${assetPnL.unrealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===== EXPORT ===== */}
        <div className="export-section">
          <button className="export-btn" onClick={downloadCsv}>
            Export CSV
          </button>
        </div>
      </div>
    </>
  );
}
