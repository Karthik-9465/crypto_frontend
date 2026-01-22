import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(name, email, password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Email already exists or invalid input"
      );
    } finally {
      setLoading(false);
    }
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

        .login-wrapper {
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
          left: 10%;
          animation: float 18s infinite ease-in-out;
        }

        .welcome-section {
          position: relative;
          z-index: 1;
          flex: 1;
          max-width: 550px;
          padding-right: 60px;
          text-align: left;
        }

        .welcome-badge {
          display: inline-block;
          padding: 10px 28px;
          background: rgba(20, 184, 166, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 50px;
          color: #14b8a6;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 30px;
        }

        .welcome-content h1 {
          font-size: 56px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 2px;
          margin-bottom: 15px;
          line-height: 1.1;
        }

        .welcome-title-underline {
          width: 180px;
          height: 4px;
          background: #14b8a6;
          margin: 0 0 30px 0;
          border-radius: 2px;
        }

        .welcome-description {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .login-section {
          position: relative;
          z-index: 1;
          flex: 0 0 480px;
          width: 480px;
        }

        .login-card {
          width: 100%;
          background: #151b2e;
          border: 1px solid rgba(20, 184, 166, 0.1);
          border-radius: 24px;
          padding: 45px 45px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .crypto-badge {
          display: block;
          width: fit-content;
          padding: 8px 20px;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          border-radius: 20px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 auto 25px auto;
        }

        .login-title {
          display: block;
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

        .login-subtitle {
          color: #9ca3af;
          font-size: 15px;
          margin-bottom: 30px;
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

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-wrapper {
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

        .login-input {
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

        .login-input::placeholder {
          color: #6b7280;
        }

        .login-input:focus {
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

        .login-button {
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

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(20, 184, 166, 0.4);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #374151, transparent);
          margin: 30px 0 25px;
        }

        .register-link {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .register-link a {
          color: #14b8a6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .register-link a:hover {
          color: #5eead4;
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .login-wrapper {
            flex-direction: column;
            padding: 40px 20px;
          }
          
          .welcome-section {
            max-width: 100%;
            padding-right: 0;
            text-align: center;
            margin-bottom: 40px;
          }
          
          .welcome-title-underline {
            margin: 0 auto 30px;
          }
          
          .welcome-content h1 {
            font-size: 42px;
          }

          .welcome-description {
            font-size: 14px;
            padding: 0 20px;
          }
          
          .login-section {
            flex: none;
            width: 100%;
            max-width: 480px;
          }

          .login-card {
            padding: 40px 30px;
          }

          .login-title {
            font-size: 36px;
          }
        }

        @media (max-width: 480px) {
          .welcome-content h1 {
            font-size: 32px;
          }

          .login-card {
            padding: 30px 20px;
          }

          .login-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="login-wrapper">
        {/* Animated Background Circles */}
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>

        {/* Welcome Section (Left Side) */}
        <div className="welcome-section">
          <span className="welcome-badge">🚀 Crypto Portfolio Tracker</span>
          <div className="welcome-content">
            <h1>JOIN US TODAY</h1>
            <div className="welcome-title-underline"></div>
            <p className="welcome-description">
              Start your cryptocurrency investment journey with us. Create your free account 
              to access powerful portfolio tracking tools, real-time market analytics, and 
              expert insights. Take control of your crypto investments and make smarter 
              financial decisions.
            </p>
          </div>
        </div>

        {/* Register Card Section (Right Side) */}
        <div className="login-section">
          <div className="login-card">
            <span className="crypto-badge">Create Account</span>
            <h2 className="login-title">Sign Up</h2>
            <p className="login-subtitle">Fill in your details to get started</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="login-form">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <div className="divider"></div>

            <div className="register-link">
              Already have an account?{" "}
              <Link to="/login">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}