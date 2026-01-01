import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Disable2FA = ({ onSuccess, onCancel }) => {
  const { disable2FA } = useAuth();
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Step 1: Password, Step 2: OTP

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim().length === 0) {
      setError("Password is required");
      return;
    }
    setError("");
    setStep(2); // Move to OTP verification
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.trim().length === 0) {
      setError("OTP is required");
      return;
    }

    setLoading(true);

    try {
      const result = await disable2FA(password, otp);
      if (result.success) {
        alert("2FA disabled successfully!");
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Disable Two-Factor Authentication</h2>
          <button className="modal-close" onClick={onCancel} disabled={loading}>
            ✕
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="modal-body">
              <p className="modal-info">To disable 2FA, please enter your password first.</p>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleDisable2FA}>
            <div className="modal-body">
              <p className="modal-info">
                Now, please enter the OTP from your authenticator app to confirm.
              </p>
              <div className="form-group">
                <label htmlFor="otp">OTP Code</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  disabled={loading}
                  className="form-input"
                  maxLength="6"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPassword("");
                  setOtp("");
                  setError("");
                }}
                disabled={loading}
                className="btn-secondary"
              >
                Back
              </button>
              <button type="submit" disabled={loading} className="btn-danger">
                {loading ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Disable2FA;
