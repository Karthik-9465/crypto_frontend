import StatCard from "../components/ui/StatCard";
import PortfolioValueChart from "../components/charts/PortfolioValueChart";
import LivePrices from "../components/pricing/LivePrices";
import HealthScoreCard from "../components/ui/HealthScoreCard";
import QuickActions from "../components/ui/QuickActions";
import CriticalAlertsPreview from "../components/risk/CriticalAlertsPreview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio Value"
          value="$12,450"
          sub="Across 3 exchanges"
          highlight
        />
        <StatCard
          title="24h P&L"
          value="+$320 (2.6%)"
          sub="Since yesterday"
        />
        <StatCard
          title="Open Risk Alerts"
          value="2"
          sub="1 high · 1 medium"
        />
        <StatCard
          title="Tax Reports"
          value="Ready"
          sub="Last export 3 days ago"
        />
      </div>

      {/* Health + Actions + Risk Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthScoreCard score={72} />
        <QuickActions />
        <CriticalAlertsPreview />
      </div>

      {/* Chart + Live Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortfolioValueChart />
        <LivePrices />
      </div>
    </div>
  );
}
