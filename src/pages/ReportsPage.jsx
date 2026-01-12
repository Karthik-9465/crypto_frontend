import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* Summary cards data */
const summary = [
  {
    title: "Realized P&L (YTD)",
    value: "+$2,100",
    note: "Closed positions"
  },
  {
    title: "Unrealized P&L",
    value: "+$1,800",
    note: "Open positions"
  },
  {
    title: "Tax Status",
    value: "Ready",
    note: "Last export 3 days ago"
  }
];

/* Chart data */
const pnlData = [
  { month: "Jan", pnl: 200 },
  { month: "Feb", pnl: 420 },
  { month: "Mar", pnl: 610 },
  { month: "Apr", pnl: 580 },
  { month: "May", pnl: 890 },
  { month: "Jun", pnl: 1200 }
];

/* Table data */
const reports = [
  {
    period: "Jan–Mar 2025",
    realized: "+$450",
    unrealized: "+$1,200",
    status: "Ready"
  },
  {
    period: "FY 2024",
    realized: "+$2,100",
    unrealized: "+$800",
    status: "Pending"
  }
];

export default function ReportsPage() {

  /* ✅ EXPORT CSV FUNCTION */
  const exportCSV = () => {
    const headers = ["Period", "Realized P&L", "Unrealized P&L", "Status"];

    const rows = reports.map((row) => [
      row.period,
      row.realized,
      row.unrealized,
      row.status
    ]);

    const csvContent =
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "crypto_pnl_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map((item) => (
          <div
            key={item.title}
            className="bg-[#0b1220] border border-white/5 rounded-xl p-4"
          >
            <p className="text-sm text-slate-400">{item.title}</p>
            <p className="text-2xl font-bold mt-1">
              {item.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {item.note}
            </p>
          </div>
        ))}
      </div>

      {/* P&L Chart */}
      <div className="bg-[#0b1220] border border-white/5 rounded-2xl p-4">
        <p className="font-semibold mb-3">
          P&L Over Time
        </p>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pnlData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tax Period Table */}
      <div className="bg-[#0b1220] border border-white/5 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold">
            P&L / Tax Periods
          </p>
          {/* ✅ WORKING EXPORT BUTTON */}
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition"
          >
            Export CSV
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-white/5">
            <tr>
              <th className="text-left py-2">Period</th>
              <th classt className="text-right py-2">Realized</th>
              <th className="text-right py-2">Unrealized</th>
              <th className="text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((row) => (
              <tr
                key={row.period}
                className="border-b border-white/5"
              >
                <td className="py-3">{row.period}</td>
                <td className="py-3 text-right">
                  {row.realized}
                </td>
                <td className="py-3 text-right">
                  {row.unrealized}
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      row.status === "Ready"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
