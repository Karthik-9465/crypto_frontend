import { useState } from "react";
import { Link } from "react-router-dom";
import { forgetPassword, resetPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 🔥 1=email, 2=otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1 → EMAIL
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgetPassword(email); // OTP email ki velthundi
      setMessage("OTP sent to your email");
      setStep(2); // 🔥 OTP FORM SHOW
    } catch (err) {
      setError("Email not found");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → OTP + PASSWORD
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, password, otp); // ⬅️ otp pass
      setMessage("Password reset successful");
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Forgot Password
        </h2>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        {message && <p className="text-green-400 text-center mb-3">{message}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded bg-slate-700 text-white"
            />

            <button className="w-full bg-emerald-500 py-3 rounded font-semibold">
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
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

            <button className="w-full bg-emerald-500 py-3 rounded font-semibold">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-slate-400 text-sm mt-6 text-center">
          Remember password?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
