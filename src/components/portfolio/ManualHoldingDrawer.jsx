import { useEffect, useState } from "react";
import { manualAddEditHolding } from "../../services/holdingService";

/* 🔑 BACKEND ENUM MAPPING */
const CHAIN_MAP = {
  BINANCE: "BINANCE_SMART_CHAIN",
  BSC: "BINANCE_SMART_CHAIN",
  BINANCE_SMART_CHAIN: "BINANCE_SMART_CHAIN",

  ETH: "ETHEREUM",
  ETHEREUM: "ETHEREUM",

  MATIC: "POLYGON",
  POLYGON: "POLYGON",

  AVAX: "AVALANCHE",
  AVALANCHE: "AVALANCHE",

  ARB: "ARBITRUM",
  ARBITRUM: "ARBITRUM",

  OP: "OPTIMISM",
  OPTIMISM: "OPTIMISM",

  BASE: "BASE",
  SEPOLIA: "SEPOLIA",
};

export default function ManualHoldingDrawer({ asset, onClose, onSaved }) {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [chain, setChain] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset) {
      setSymbol(asset.assetSymbol || "");
      setQty(asset.quantity || "");
      setAvgCost(asset.avgCost || "");
      setChain(asset.chain || "");
      setAddress(asset.address || "");
    }
  }, [asset]);

  // 🔒 stop background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!asset) return null;

  const validate = () => {
    const newErrors = {};

    // mandatory
    if (!symbol.trim()) newErrors.symbol = "Asset is required";
    if (!qty || Number(qty) <= 0) newErrors.qty = "Quantity is required";
    if (!avgCost || Number(avgCost) <= 0)
      newErrors.avgCost = "Average cost is required";

    // conditional rule
    if (address.trim() && !chain.trim()) {
      newErrors.chain = "Chain is required when address is provided";
    }

    if (chain.trim() && !address.trim()) {
      newErrors.address = "Address is required when chain is provided";
    }

    // enum validation
    if (
      chain.trim() &&
      !CHAIN_MAP[chain.trim().toUpperCase()]
    ) {
      newErrors.chain = "Unsupported chain";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    setApiError("");

    if (!validate()) return;

    const normalizedChain = chain.trim()
      ? CHAIN_MAP[chain.trim().toUpperCase()]
      : null;

    try {
      setLoading(true);

      const res = await manualAddEditHolding({
  assetSymbol: symbol.toUpperCase(),
  quantity: Number(qty),
  avgCost: Number(avgCost),
  chain: normalizedChain,
  address: address.trim() ? address.trim() : null,
});

// 🔥 TELL PARENT TO UPDATE STATE
onSaved(res?.data || {
  assetSymbol: symbol.toUpperCase(),
  quantity: Number(qty),
  avgCost: Number(avgCost),
  chain: normalizedChain,
  address: address.trim() ? address.trim() : null,
});

onClose();

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      setApiError(msg);

      if (msg.toLowerCase().includes("address")) {
        setErrors((prev) => ({
          ...prev,
          address: msg,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .manual-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-end;
          z-index: 9999;
          animation: fadeIn 0.3s ease-out;
        }

        .manual-drawer-panel {
          width: 28rem;
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          padding: 2.5rem;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease-out;
          overflow-y: auto;
        }

        .manual-drawer-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }

        .manual-drawer-input {
          width: 100%;
          padding: 0.875rem 1rem;
          margin-bottom: 0.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid #334155;
          border-radius: 12px;
          color: #ffffff;
        }

        .manual-drawer-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .manual-drawer-btn {
          flex: 1;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .manual-drawer-btn-save {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .manual-drawer-btn-cancel {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
      `}</style>

      <div className="manual-drawer-overlay">
        <div className="manual-drawer-panel">
          <h2 className="manual-drawer-title">
            {asset.assetSymbol ? "Edit Holding" : "Add Holding"}
          </h2>

          <input
            className="manual-drawer-input"
            placeholder="Asset Symbol (BTC)"
            value={symbol}
            onChange={(e) => {
  const value = e.target.value.toUpperCase();

  // allow ONLY letters
  if (/^[A-Z]*$/.test(value)) {
    setSymbol(value);
  }
}}

          />
          {errors.symbol && <p style={{ color: "red" }}>{errors.symbol}</p>}

          <input
            className="manual-drawer-input"
            placeholder="Chain (optional)"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
          />
          {errors.chain && <p style={{ color: "red" }}>{errors.chain}</p>}

          <input
            className="manual-drawer-input"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

          <input
            type="number"
            className="manual-drawer-input"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          {errors.qty && <p style={{ color: "red" }}>{errors.qty}</p>}

          <input
            type="number"
            className="manual-drawer-input"
            placeholder="Average Cost"
            value={avgCost}
            onChange={(e) => setAvgCost(e.target.value)}
          />
          {errors.avgCost && <p style={{ color: "red" }}>{errors.avgCost}</p>}

          {apiError && <p style={{ color: "red" }}>{apiError}</p>}

          <div className="manual-drawer-buttons">
            <button
              onClick={save}
              disabled={loading}
              className="manual-drawer-btn manual-drawer-btn-save"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="manual-drawer-btn manual-drawer-btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
