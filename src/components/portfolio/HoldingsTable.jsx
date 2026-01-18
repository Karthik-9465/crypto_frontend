export default function HoldingsTable({ data, onView, onEdit, onDelete }) {
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
          {data.map((h, i) => (
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
                ${Number(h.avgCost).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className="p-3 space-x-4">
                {onView && (
                  <button
                    onClick={() => onView(h)}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => onEdit(h)}
                    className="text-green-400 hover:underline"
                  >
                    Edit
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(h)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
