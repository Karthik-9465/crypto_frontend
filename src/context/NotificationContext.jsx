import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔔 ADD
  const notify = (notification) => {
    setNotifications((prev) => {
      const updated = [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          read: false,
          ...notification,
        },
        ...prev,
      ];

      localStorage.setItem(
        "notifications",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // ✅ MARK READ
  const markAsRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );

      localStorage.setItem(
        "notifications",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // ❌ CLEAR (THIS IS KEY FIX)
  const clearAll = () => {
    setNotifications([]); // UI clear
    localStorage.removeItem("notifications"); // STORAGE clear
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, notify, markAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
