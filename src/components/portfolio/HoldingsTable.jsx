export default function HoldingsTable({
  data,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-slate-700 rounded-lg">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3 text-left">Asset</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Avg Cost (USD)</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((h, i) => {
            // 👉 Treat as MANUAL by default if walletType not present
            const isManual =
              !h.walletType || h.walletType === "MANUAL";

            return (
              <tr
                key={i}
                className="border-t border-slate-700 hover:bg-slate-800/50"
              >
                <td className="p-3 font-semibold">
                  {h.assetSymbol}
                </td>

                <td className="p-3">
                  {Number(h.quantity)}
                </td>

                <td className="p-3">
                  $
                  {Number(h.avgCost).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="p-3 space-x-4">
                  {/* VIEW – always */}
                  {onView && (
                    <button
                      onClick={() => onView(h)}
                      className="text-blue-400 hover:underline"
                    >
                      View
                    </button>
                  )}

                  {/* EDIT – manual only */}
                  {onEdit && isManual && (
                    <button
                      onClick={() => onEdit(h)}
                      className="text-green-400 hover:underline"
                    >
                      Edit
                    </button>
                  )}

                  {/* DELETE – manual only */}
                  {onDelete && isManual && (
                    <button
                      onClick={() => onDelete(h)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {data.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="p-4 text-center text-slate-400"
              >
                No holdings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
