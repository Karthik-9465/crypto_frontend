import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const hasLoaded = useRef(false);

  /* ✅ LOAD FROM LOCAL STORAGE (ONLY ONCE) */
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications([]);
      }
    }
  }, []);

  /* 🔔 ADD NOTIFICATION */
  const notify = (notification) => {
    setNotifications((prev) => {
      const updated = [
        {
          id: Date.now() + Math.random(), // unique id
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

  /* ✅ MARK SINGLE AS READ */
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

  /* ✅ MARK ALL AS READ (THIS IS THE MAIN ACTION) */
  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({
        ...n,
        read: true,
      }));

      localStorage.setItem(
        "notifications",
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notify,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
