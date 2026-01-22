import { createPortal } from "react-dom";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationPanel() {
  const { notifications, markAsRead, clearAll } = useNotifications();

  const getColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes("high")) return "#f87171";   // 🔴 High
    if (t.includes("medium")) return "#facc15"; // 🟡 Medium
    return "#34d399";                            // 🟢 Low
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: "72px",          // topbar height
        right: "24px",
        width: "360px",
        maxHeight: "420px",
        background: "#0b1220",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        zIndex: 2147483647,   // 🔥 always on top
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 600 }}>Notifications</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            clearAll();
          }}
          style={{
            color: "#f87171",
            fontSize: "14px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          padding: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {notifications.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              padding: "24px 0",
              fontSize: "14px",
            }}
          >
            No notifications
          </p>
        )}

        {notifications.map((n) => {
          const color = getColor(n.title);

          return (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              style={{
                background: n.read ? "#1f2937" : "#243144",
                padding: "12px",
                borderRadius: "12px",
                cursor: "pointer",
                borderLeft: `4px solid ${color}`,
              }}
            >
              {/* TITLE */}
              <p
                style={{
                  fontWeight: 700,
                  color,
                  marginBottom: "4px",
                }}
              >
                {n.title}
              </p>

              {/* MESSAGE */}
              <p
                style={{
                  fontSize: "13px",
                  color: "#cbd5e1",
                  marginBottom: "4px",
                }}
              >
                {n.message}
              </p>

              {/* TIME */}
              <p
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {n.time}
              </p>
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
