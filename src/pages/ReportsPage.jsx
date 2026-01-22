import { useEffect, useRef, useState } from "react";
import {
  fetchPortfolioPnL,
  fetchRealizedPnL,
  fetchAssetPnL,
  exportPnLCsv,
} from "../services/pnlService";

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

  /* ================= LOAD PORTFOLIO + REALIZED ================= */
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
    // ✅ Prevent double API call in React 18 StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadReports();
  }, []);

  /* ================= LOAD ASSET PnL ================= */
  const handleAssetPnL = async () => {
    if (!assetInput.trim()) return;

    const symbol = assetInput.trim().toUpperCase();

    try {
      setAssetLoading(true);
      setAssetPnL(null);

      const res = await fetchAssetPnL(symbol);
      setAssetPnL(res?.data?.data || null);
    } catch (e) {
      console.error("Asset PnL failed", e);
      setAssetPnL(null);
    } finally {
      setAssetLoading(false);
    }
  };

  /* ================= CSV EXPORT ================= */
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

  if (loading) return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }

        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
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

        .loading-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          color: #ffffff;
          text-align: center;
          padding-top: 10rem;
        }
      `}</style>
      <p className="loading-container">Loading reports...</p>
    </>
  );
  
  if (error) return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }

        body {
          background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
          min-height: 100vh;
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

        .error-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          color: #f87171;
          text-align: center;
          padding-top: 10rem;
        }
      `}</style>
      <p className="error-container">{error}</p>
    </>
  );

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

        .reports-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          max-width: 80rem;
          margin: 0 auto;
        }

        .reports-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .reports-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .reports-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .summary-card {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease-out;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .summary-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .value-positive { color: #34d399; }
        .value-negative { color: #f87171; }
        .value-neutral { color: #ffffff; }

        .asset-search-section {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.3px;
        }

        .search-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-input {
          flex: 1;
          padding: 0.875rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid #334155;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #475569;
        }

        .search-input:focus {
          border-color: #3b82f6;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .asset-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .result-card {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .result-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
        }

        .loading-text {
          color: #64748b;
          text-align: center;
          padding: 2rem 0;
        }

        .no-data-text {
          color: #475569;
          text-align: center;
          font-size: 0.875rem;
          padding: 1rem 0;
        }

        .export-section {
          display: flex;
          justify-content: flex-end;
        }

        .export-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        @media (max-width: 768px) {
          .reports-container {
            padding: 1.5rem;
          }

          .reports-title {
            font-size: 1.5rem;
          }

          .summary-grid,
          .asset-results {
            grid-template-columns: 1fr;
          }

          .search-row {
            flex-direction: column;
          }

          .search-btn,
          .export-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          body::before,
          body::after {
            display: none;
          }

          .asset-search-section {
            padding: 1.5rem;
          }

          .summary-value {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="reports-container">
        <div className="reports-header">
          <h1 className="reports-title">Reports</h1>
          <p className="reports-subtitle">
            Profit, loss and tax summaries
          </p>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Realized P&L</p>
            <p className={`summary-value ${realizedPnL.realizedPnL >= 0 ? 'value-positive' : 'value-negative'}`}>
              ${realizedPnL.realizedPnL.toFixed(2)}
            </p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Unrealized P&L</p>
            <p className={`summary-value ${portfolioPnL.unrealizedPnL >= 0 ? 'value-positive' : 'value-negative'}`}>
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

        {/* ================= ASSET WISE PnL ================= */}
        <div className="asset-search-section">
          <h2 className="section-title">Asset-wise P&L</h2>

          <div className="search-row">
            <input
              type="text"
              placeholder="Enter asset (BTC, ETH, ADA...)"
              value={assetInput}
              onChange={(e) => setAssetInput(e.target.value)}
              className="search-input"
            />
            <button onClick={handleAssetPnL} className="search-btn">
              Get P&L
            </button>
          </div>

          {assetLoading && (
            <p className="loading-text">Calculating asset P&L...</p>
          )}

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
                <p className={`result-value ${assetPnL.unrealizedPnL >= 0 ? 'value-positive' : 'value-negative'}`}>
                  ${assetPnL.unrealizedPnL.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {!assetLoading && assetInput && !assetPnL && (
            <p className="no-data-text">
              No data available for this asset
            </p>
          )}
        </div>

        {/* ================= EXPORT ================= */}
        <div className="export-section">
          <button onClick={downloadCsv} className="export-btn">
            Export CSV
          </button>
        </div>
      </div>
    </>
  );
}