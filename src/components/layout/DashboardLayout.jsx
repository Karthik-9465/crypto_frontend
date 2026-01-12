import { useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Page metadata – real product pattern
 */
const PAGE_META = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of portfolio performance and risk"
  },
  "/portfolio": {
    title: "Portfolio",
    subtitle: "Your crypto holdings and allocations"
  },
  "/alerts": {
    title: "Risk & Alerts",
    subtitle: "Security warnings and risk signals"
  },
  "/reports": {
    title: "Reports",
    subtitle: "Profit, loss and tax summaries"
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage account and preferences"
  }
};

export default function DashboardLayout({ children, actions }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 🔐 Auth Guard
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  const meta = PAGE_META[location.pathname] || PAGE_META["/"];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Sidebar – fixed navigation */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Global Topbar (notifications, profile, logout) */}
        <Topbar title={meta.title} />

        {/* Page Context Header (FEATURE) */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{meta.title}</h1>
            <p className="text-sm text-slate-400">{meta.subtitle}</p>
          </div>

          {/* Page Actions Slot (FEATURE) */}
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Page Content – scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
