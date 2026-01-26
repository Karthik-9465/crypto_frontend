import { Eye, Edit2, Trash2 } from "lucide-react";

export default function HoldingsTable({
  data,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <style>{`
        .holdings-table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .holdings-table {
          width: 100%;
          border-collapse: collapse;
          background: #1e293b;
        }

        .holdings-table thead {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
        }

        .holdings-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #475569;
        }

        .holdings-table td {
          padding: 1rem;
          color: #e2e8f0;
          border-bottom: 1px solid #334155;
        }

        .holdings-table tbody tr {
          transition: all 0.2s ease;
        }

        .holdings-table tbody tr:hover {
          background: rgba(51, 65, 85, 0.5);
          transform: translateX(2px);
        }

        .holdings-table tbody tr:last-child td {
          border-bottom: none;
        }

        .asset-symbol {
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .action-btn {
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          cursor: pointer;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.05);
        }

        .action-btn.view {
          color: #60a5fa;
        }

        .action-btn.edit {
          color: #34d399;
        }

        .action-btn.delete {
          color: #f87171;
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        }
      `}</style>

      <div className="holdings-table-wrapper">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Quantity</th>
              <th>Avg Cost (USD)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((h, i) => {
              const isManual =
                !h.walletType || h.walletType === "MANUAL";

              return (
                <tr key={h.assetSymbol}>
                  <td>
                    <span className="asset-symbol">{h.assetSymbol}</span>
                  </td>

                  <td>{Number(h.quantity)}</td>

                  <td>
                    $
                    {Number(h.avgCost).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    <div className="action-buttons">
                      {/* VIEW */}
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(h)}
                          className="action-btn view"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                      )}

                      {/* EDIT */}
                      {onEdit && isManual && (
                        <button
                          type="button"
                          onClick={() => onEdit(h)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}

                      {/* DELETE */}
                      {onDelete && isManual && (
                        <button
                          type="button"   
                          onClick={() => onDelete(h)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">
                  No holdings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
