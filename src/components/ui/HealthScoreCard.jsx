export default function HealthScoreCard({ score }) {
  let status = "Good";
  let message = "Your portfolio is well balanced.";
  let color = "text-emerald-400";

  if (score < 70) {
    status = "Warning";
    message = "High exposure to volatile assets.";
    color = "text-yellow-400";
  }

  if (score < 40) {
    status = "Risky";
    message = "Multiple high-risk or scam tokens detected.";
    color = "text-red-400";
  }

  return (
    <div className="p-5 rounded-2xl bg-[#0b1220] border border-white/5">
      <p className="text-sm text-slate-400 mb-1">
        Portfolio Health
      </p>

      <div className="flex items-center gap-4">
        <h2 className={`text-4xl font-bold ${color}`}>
          {score}
        </h2>
        <span className="text-slate-400 text-lg">/ 100</span>
      </div>

      <p className={`mt-2 font-medium ${color}`}>
        {status}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {message}
      </p>
    </div>
  );
}
