import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CriticalAlertsPreview() {
  const navigate = useNavigate();

  const alerts = [
    {
      level: "HIGH",
      title: "Potential Rug Pull Detected",
      description: "Token listed in CryptoScamDB",
    },
    {
      level: "MEDIUM",
      title: "High Volatility Asset",
      description: "Price changed 28% in last 24h",
    },
  ];

  const styles = {
    HIGH: "border-red-500/50 bg-red-500/10 text-red-400",
    MEDIUM: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0b1220] border border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-red-400" />
        <h3 className="font-semibold">Critical Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border-l-4 ${styles[alert.level]}`}
          >
            <p className="font-medium">{alert.title}</p>
            <p className="text-xs text-slate-400">
              {alert.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/alerts")}
        className="mt-4 text-sm text-emerald-400 hover:underline"
      >
        View all alerts →
      </button>
    </div>
  );
}
