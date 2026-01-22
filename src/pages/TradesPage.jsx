import { useEffect, useState, useMemo, useRef } from "react";
import {
  fetchAllTrades,
  fetchIncrementalTrades,
} from "../services/tradeService";

/* ================= COST BASIS + P/L ================= */
function calculateSummary(trades) {
  let totalBuy = 0;
  let totalSell = 0;

  trades.forEach((t) => {
    const value = t.price * t.quantity;
    if (t.side === "BUY") totalBuy += value;
    if (t.side === "SELL") totalSell += value;
  });

  return {
    invested: totalBuy,
    returned: totalSell,
    pnl: totalSell - totalBuy,
  };
}

/* ================= PAGE ================= */
export default function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 STRICT MODE GUARD
  const hasLoadedRef = useRef(false);

  /* ================= PAGE LOAD → INCREMENTAL ONLY ================= */
  const loadIncrementalTrades = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetchIncrementalTrades();
      const data = res?.data?.data || [];

      setTrades(data);

      if (data.length === 0) {
        setMessage("No trades found");
      }
    } catch (e) {
      console.error(e);
      setMessage("Unable to load trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Prevent double call in React 18 StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadIncrementalTrades();
  }, []);

  /* ================= MANUAL INCREMENTAL SYNC ================= */
  const syncTrades = async () => {
    if (syncing) return;

    try {
      setSyncing(true);
      setMessage("");

      const res = await fetchIncrementalTrades();
      const newTrades = res?.data?.data || [];

      if (newTrades.length === 0) {
        setMessage("No new trades found");
        return;
      }

      setTrades((prev) => {
        const ids = new Set(prev.map((t) => t.tradeId));
        const filtered = newTrades.filter(
          (t) => !ids.has(t.tradeId)
        );
        return [...filtered, ...prev];
      });

      setMessage(`${newTrades.length} new trades synced`);
    } catch (e) {
      if (e.response?.status === 503) {
        setMessage(
          "Trade sync temporarily unavailable. Please try later."
        );
      } else {
        setMessage("Failed to sync trades");
      }
    } finally {
      setSyncing(false);
    }
  };

  /* ================= FETCH ALL (WARNING) ================= */
  const fetchAllWithWarning = async () => {
    const ok = window.confirm(
      "⚠️ Fetching ALL previous trades may take 20–30 minutes and may hit exchange rate limits.\n\nDo you want to continue?"
    );

    if (!ok) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await fetchAllTrades();
      const data = res?.data?.data || [];

      setTrades(data);
      setMessage("All historical trades loaded");
    } catch (e) {
      setMessage("Failed to fetch all trades");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUMMARY ================= */
  const summary = useMemo(
    () => calculateSummary(trades),
    [trades]
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

        .trades-container {
          padding: 2rem;
          position: relative;
          z-index: 1;
          max-width: 80rem;
          margin: 0 auto;
        }

        .trades-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .trades-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-sync {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #000000;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-sync:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-sync:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-fetch {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .btn-fetch:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
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
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
        }

        .value-positive { color: #34d399; }
        .value-negative { color: #f87171; }

        .message-box {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          animation: fadeIn 0.3s ease-out;
        }

        .trades-table-wrapper {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .trades-table {
          width: 100%;
          border-collapse: collapse;
        }

        .trades-table thead {
          background: rgba(15, 23, 42, 0.6);
        }

        .trades-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .trades-table td {
          padding: 1rem;
          color: #e2e8f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .trades-table tbody tr {
          transition: all 0.2s ease;
        }

        .trades-table tbody tr:hover {
          background: rgba(51, 65, 85, 0.3);
          transform: translateX(2px);
        }

        .asset-symbol {
          font-weight: 600;
          color: #ffffff;
        }

        .side-buy {
          color: #34d399;
          font-weight: 600;
        }

        .side-sell {
          color: #f87171;
          font-weight: 600;
        }

        .trade-date {
          color: #64748b;
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 0;
          color: #64748b;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .trades-container {
            padding: 1.5rem;
          }

          .trades-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .action-buttons {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .trades-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          body::before,
          body::after {
            display: none;
          }

          .trades-table-wrapper {
            padding: 1rem;
          }

          .trades-table th,
          .trades-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>

      <div className="trades-container">
        {/* ================= HEADER ================= */}
        <div className="trades-header">
          <h1 className="trades-title">Trades</h1>

          <div className="action-buttons">
            <button
              onClick={syncTrades}
              disabled={syncing}
              className="btn btn-sync"
            >
              {syncing ? "Syncing..." : "Sync Trades"}
            </button>

            <button
              onClick={fetchAllWithWarning}
              className="btn btn-fetch"
            >
              Fetch All Previous Trades
            </button>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Invested</p>
            <p className="summary-value">${summary.invested.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Returned</p>
            <p className="summary-value">${summary.returned.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <p className="summary-label">Profit / Loss</p>
            <p className={`summary-value ${summary.pnl >= 0 ? 'value-positive' : 'value-negative'}`}>
              ${summary.pnl.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ================= MESSAGE ================= */}
        {!loading && message && (
          <div className="message-box">{message}</div>
        )}

        {/* ================= TABLE ================= */}
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : trades.length === 0 ? (
          <p className="empty-state">No trades found</p>
        ) : (
          <div className="trades-table-wrapper">
            <table className="trades-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Side</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t, i) => (
                  <tr key={i}>
                    <td className="asset-symbol">{t.assetSymbol}</td>
                    <td className={t.side === "BUY" ? "side-buy" : "side-sell"}>
                      {t.side}
                    </td>
                    <td>{t.quantity}</td>
                    <td>${t.price.toFixed(2)}</td>
                    <td className="trade-date">
                      {new Date(t.tradeTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}