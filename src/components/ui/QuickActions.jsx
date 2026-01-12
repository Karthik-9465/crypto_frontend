import { Plus, Bell, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="p-5 rounded-2xl bg-[#0b1220] border border-white/5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/portfolio")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition"
        >
          <Plus size={18} />
          Add Holding
        </button>

        <button
          onClick={() => navigate("/alerts")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <Bell size={18} />
          Create Price Alert
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>
    </div>
  );
}
