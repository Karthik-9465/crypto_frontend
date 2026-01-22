import { Link, useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  // Load profile data
  const profile =
    JSON.parse(localStorage.getItem("user_profile")) || {};

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .topbar-container {
          height: 4rem;
          background: linear-gradient(90deg, #0a0e27 0%, #020617 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: slideInDown 0.5s ease-out;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .topbar-branding {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.6s ease-out;
        }

        .topbar-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.3px;
        }

        .logo-highlight {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: fadeIn 0.8s ease-out;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .user-profile:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .user-avatar {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(16, 185, 129, 0.3);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
          transition: all 0.3s ease;
        }

        .user-profile:hover .user-avatar {
          border-color: rgba(16, 185, 129, 0.6);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .settings-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.875rem;
          font-weight: 600;
          color: #cbd5e1;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          font-size: 0.875rem;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 768px) {
          .topbar-container {
            padding: 0 1rem;
          }

          .topbar-logo {
            font-size: 1rem;
          }

          .user-name {
            display: none;
          }

          .settings-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }

          .logout-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .topbar-actions {
            gap: 0.5rem;
          }

          .user-profile {
            padding: 0.5rem;
          }
        }
      `}</style>

      <header className="topbar-container">
        {/* LEFT: App Branding */}
        <div className="topbar-branding">
          <span className="topbar-logo">
            Crypto<span className="logo-highlight">Guard</span>
          </span>
        </div>

        {/* RIGHT: User Actions */}
        <div className="topbar-actions">
          {/* User profile */}
          <div className="user-profile">
            <img
              src={
                profile.avatar ||
                "https://ui-avatars.com/api/?background=10b981&color=fff"
              }
              alt="User"
              className="user-avatar"
            />
            <span className="user-name">
              {profile.name || "User"}
            </span>
          </div>

          {/* Settings */}
          <Link to="/settings" className="settings-btn">
            Settings
          </Link>

          {/* Logout */}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
    </>
  );
}