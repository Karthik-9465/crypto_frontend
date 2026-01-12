export default function StatCard({
  title,
  value,
  sub,
  icon,
  highlight = false
}) {
  return (
    <div
      className={`relative p-5 rounded-2xl border border-white/5
        ${
          highlight
            ? "bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent"
            : "bg-[#0b1220]"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        {icon && (
          <div className="text-emerald-400 opacity-80">
            {icon}
          </div>
        )}
      </div>

      {/* Main Value */}
      <h3 className="mt-2 text-3xl font-bold tracking-tight">
        {value}
      </h3>

      {/* Sub Text */}
      {sub && (
        <p className="mt-1 text-xs text-slate-400">
          {sub}
        </p>
      )}
    </div>
  );
}
