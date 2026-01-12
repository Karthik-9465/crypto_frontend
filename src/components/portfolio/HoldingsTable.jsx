import { useState, Fragment, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Star,
  Plus,
  Eye,
  Trash2
} from "lucide-react";

/* Initial real holdings */
const initialHoldings = [
  {
    asset: "BTC",
    exchange: "Binance",
    qty: 0.15,
    price: 41000,
    value: 6150,
    risk: "LOW",
    notes: "Blue-chip asset, low volatility"
  },
  {
    asset: "ETH",
    exchange: "Coinbase",
    qty: 1.8,
    price: 2200,
    value: 3960,
    risk: "MEDIUM",
    notes: "High gas fees during peak usage"
  }
];

/* Coins available to add as favourites */
const AVAILABLE_COINS = [
  { asset: "SOL", price: 98 },
  { asset: "ADA", price: 0.52 },
  { asset: "DOGE", price: 0.08 }
];

const riskColor = {
  LOW: "text-emerald-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400"
};

export default function HoldingsTable({ onViewAsset }) {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [favourites, setFavourites] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  /* Load favourites */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(stored);
  }, []);

  /* Persist favourites */
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleRow = (asset) => {
    setOpenRow(openRow === asset ? null : asset);
  };

  const toggleFavourite = (coin) => {
    const exists = favourites.find((f) => f.asset === coin.asset);

    if (exists) {
      setFavourites(favourites.filter((f) => f.asset !== coin.asset));
    } else {
      setFavourites([
        ...favourites,
        {
          asset: coin.asset,
          exchange: "Watchlist",
          qty: 0,
          price: coin.price,
          value: 0,
          risk: "MEDIUM",
          notes: "Favourite / Watchlist coin"
        }
      ]);
    }
  };

  /* Convert watchlist → holding */
  const addQuantity = (coin) => {
    const qty = Number(prompt(`Enter quantity for ${coin.asset}`));
    if (!qty || qty <= 0) return;

    const newHolding = {
      ...coin,
      exchange: "Manual",
      qty,
      value: qty * coin.price,
      notes: "Converted from watchlist to holding"
    };

    setHoldings((prev) => [...prev, newHolding]);
    setFavourites((prev) =>
      prev.filter((f) => f.asset !== coin.asset)
    );
    setOpenRow(null);
  };

  /* 🗑 DELETE ASSET */
  const deleteAsset = (row) => {
    const confirmDelete = window.confirm(
      `Delete ${row.asset} from portfolio?`
    );
    if (!confirmDelete) return;

    if (row.exchange === "Watchlist") {
      setFavourites((prev) =>
        prev.filter((f) => f.asset !== row.asset)
      );
    } else {
      setHoldings((prev) =>
        prev.filter((h) => h.asset !== row.asset)
      );
    }

    setOpenRow(null);
  };

  const portfolio = [...holdings, ...favourites];

  return (
    <div className="bg-[#0b1220] rounded-2xl border border-white/5 overflow-hidden">
      {/* ADD FAVOURITES */}
      <div className="p-4 border-b border-white/5">
        <p className="text-sm text-slate-400 mb-2">
          Add favourite coins
        </p>
        <div className="flex gap-2 flex-wrap">
          {AVAILABLE_COINS.map((coin) => {
            const active = favourites.some(
              (f) => f.asset === coin.asset
            );
            return (
              <button
                key={coin.asset}
                onClick={() => toggleFavourite(coin)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2
                  ${
                    active
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
              >
                <Star size={14} />
                {coin.asset}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Asset</th>
            <th className="px-4 py-3 text-left">Source</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Value</th>
            <th className="px-4 py-3 text-center">Risk</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {portfolio.map((row) => (
            <Fragment key={row.asset}>
              <tr
                onClick={() => toggleRow(row.asset)}
                className="cursor-pointer hover:bg-white/5"
              >
                <td className="px-4 py-3 font-medium">{row.asset}</td>
                <td className="px-4 py-3">{row.exchange}</td>
                <td className="px-4 py-3 text-right">{row.qty}</td>
                <td className="px-4 py-3 text-right">${row.price}</td>
                <td className="px-4 py-3 text-right">${row.value}</td>
                <td className={`px-4 py-3 text-center ${riskColor[row.risk]}`}>
                  {row.risk}
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAsset(row);
                    }}
                    className="text-red-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                  {openRow === row.asset ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </td>
              </tr>

              {openRow === row.asset && (
                <tr className="bg-black/30">
                  <td colSpan="7" className="px-6 py-4">
                    <p className="text-sm mb-3">{row.notes}</p>

                    <div className="flex gap-3 flex-wrap">
                      {/* VIEW DRAWER */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewAsset(row);
                        }}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm flex items-center gap-2"
                      >
                        <Eye size={14} />
                        View Details
                      </button>

                      {/* ADD QTY (WATCHLIST) */}
                      {row.qty === 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addQuantity(row);
                          }}
                          className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Add Quantity
                        </button>
                      )}
                    </div>

                    {row.risk === "HIGH" && (
                      <div className="flex items-center gap-2 text-red-400 mt-3">
                        <AlertTriangle size={16} />
                        High risk detected
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
