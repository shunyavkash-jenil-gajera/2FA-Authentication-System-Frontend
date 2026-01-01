import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOTP, token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    if (!token) {
      setError("Please login first.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(otp, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Verify Two-Factor Authentication</h2>
          <p className="auth-subtitle">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="otp" className="sr-only">
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength="6"
              required
              className="auth-input otp-input"
              placeholder="000000"
              value={otp}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="auth-button"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="auth-back-link"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
