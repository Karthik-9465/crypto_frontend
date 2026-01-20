import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  // ✅ fallback from localStorage
  const email = localStorage.getItem("resetEmail");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <p className="p-8 text-center text-red-400">
        Invalid access. Please retry forgot password.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // backend currently checks only email + password
      await resetPassword(email, password);

      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err) {
      setError("Invalid OTP or reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <button
            disabled={loading}
            className="w-full bg-emerald-500 py-3 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
