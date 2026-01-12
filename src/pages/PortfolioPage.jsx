import { useState } from "react";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import AssetDrawer from "../components/portfolio/AssetDrawer";

export default function PortfolioPage() {
  const [selectedAsset, setSelectedAsset] = useState(null);

  return (
    <div className="relative">
      <HoldingsTable onViewAsset={setSelectedAsset} />

      {/* Asset Detail Drawer */}
      <AssetDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}
