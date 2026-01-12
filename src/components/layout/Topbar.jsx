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
    <header className="h-16 bg-[#020617] border-b border-white/5 px-6 flex items-center justify-between">
      
      {/* LEFT: App Branding */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-slate-100">
          Crypto
          <span className="text-emerald-400">Guard</span>
        </span>
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-4">

        {/* User profile */}
        <div className="flex items-center gap-2">
          <img
            src={
              profile.avatar ||
              "https://ui-avatars.com/api/?background=0D8ABC&color=fff"
            }
            alt="User"
            className="w-9 h-9 rounded-full object-cover border border-white/10"
          />
          <span className="text-sm font-medium text-slate-200">
            {profile.name || "User"}
          </span>
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-200 transition"
        >
          Settings
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-sm font-semibold text-black transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
