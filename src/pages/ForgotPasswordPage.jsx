import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgetPassword, resetPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [email, setEmail] = useState("");

  const [serverOtp, setServerOtp] = useState(""); // 🔥 API OTP
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= STEP 1 : EMAIL ================= */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await forgetPassword(email);

      // ✅ OTP from backend response
      const otpFromApi = res?.data?.otp;

      if (!otpFromApi) {
        setError("OTP not received from server");
        return;
      }

      setServerOtp(String(otpFromApi)); // 🔥 store OTP
      setMessage("OTP sent to your email");
      setStep(2);
    } catch {
      setError("Email not found");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2 : OTP VERIFY ================= */
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp !== serverOtp) {
      setError("Invalid OTP");
      return;
    }

    setMessage("OTP verified successfully");
    setStep(3);
  };

  /* ================= STEP 3 : RESET PASSWORD ================= */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, password, otp);

      setMessage("Password reset successful");

      // 🔁 redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SKIP RESET ================= */
  const skipReset = () => {
    // ✅ skip only after OTP verified
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        .forgot-password-container {
          min-height: 100vh;
          background: #0a0e27;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(20, 184, 166, 0.03);
          border: 1px solid rgba(20, 184, 166, 0.08);
        }

        .circle-1 {
          width: 500px;
          height: 500px;
          top: -150px;
          left: -150px;
          animation: float 20s infinite ease-in-out;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          right: -100px;
          animation: float 15s infinite ease-in-out reverse;
        }

        .circle-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          right: 10%;
          animation: float 18s infinite ease-in-out;
        }

        .forgot-password-card {
          width: 100%;
          max-width: 480px;
          background: #151b2e;
          border: 1px solid rgba(20, 184, 166, 0.1);
          border-radius: 24px;
          padding: 50px 45px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .forgot-password-title {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #5eead4 0%, #14b8a6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 auto 10px auto;
          border-bottom: 3px solid #14b8a6;
          width: fit-content;
          padding-bottom: 5px;
        }

        .forgot-password-subtitle {
          color: #9ca3af;
          font-size: 15px;
          margin-bottom: 35px;
          line-height: 1.6;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .success-message {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .forgot-password-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          font-size: 18px;
          z-index: 1;
        }

        .forgot-password-input {
          width: 100%;
          padding: 18px 18px 18px 52px;
          background: #0a0e27;
          border: 2px solid #1f2937;
          border-radius: 12px;
          color: #e5e7eb;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }

        .forgot-password-input::placeholder {
          color: #6b7280;
        }

        .forgot-password-input:focus {
          border-color: #14b8a6;
          background: #0f1419;
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 5px 10px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .submit-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 10px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(20, 184, 166, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .skip-button {
          width: 100%;
          padding: 14px;
          margin-top: 16px;
          background: transparent;
          border: 2px solid #4b5563;
          border-radius: 12px;
          color: #9ca3af;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .skip-button:hover {
          background: rgba(75, 85, 99, 0.1);
          border-color: #6b7280;
          color: #d1d5db;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #374151, transparent);
          margin: 30px 0 25px;
        }

        .back-to-login {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .back-to-login a {
          color: #14b8a6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .back-to-login a:hover {
          color: #5eead4;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .forgot-password-card {
            padding: 40px 30px;
          }

          .forgot-password-title {
            font-size: 32px;
          }

          .forgot-password-subtitle {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="forgot-password-container">
        {/* Animated Background Circles */}
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>

        {/* Forgot Password Card */}
        <div className="forgot-password-card">
          <h2 className="forgot-password-title">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="forgot-password-subtitle">
            {step === 1 && "Enter your email address to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new password for your account"}
          </p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="forgot-password-form">
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="forgot-password-input"
                />
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="forgot-password-form">
              <div className="input-group">
                <span className="input-icon">🔑</span>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="forgot-password-input"
                />
              </div>
              <button type="submit" className="submit-button">
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <>
              <form onSubmit={handleResetSubmit} className="forgot-password-form">
                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="forgot-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="forgot-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="password-toggle"
                  >
                    {showConfirm ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <button onClick={skipReset} className="skip-button">
                Skip reset & Go to Dashboard
              </button>
            </>
          )}

          <div className="divider"></div>

          <div className="back-to-login">
            Remember password? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </>
  );
}