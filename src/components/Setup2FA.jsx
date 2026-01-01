import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { enable2FA, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Call enable2FA only once when component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        const data = await enable2FA();
        setQrCode(data.qrCodeDataURL);
        setSecret(data.secret);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, []);

  const handleContinue = () => {
    navigate("/verify-otp");
  };

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="loading-text">Generating QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-error">{error}</div>
          <button onClick={() => navigate("/login")} className="auth-button">
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Set up Two-Factor Authentication</h2>
          <p className="auth-subtitle">Scan this QR code with your authenticator app</p>
        </div>

        <div className="auth-form">
          <div className="qr-container">
            {qrCode && (
              <div className="qr-box">
                <img src={qrCode} alt="QR Code" className="qr-image" />
              </div>
            )}
          </div>

          <div className="secret-box">
            <p className="secret-label">Can't scan? Use this secret key:</p>
            <code className="secret-code">{secret}</code>
          </div>

          <div className="instructions-box">
            <div style={{ display: "flex" }}>
              <div className="flex-shrink-0">
                <svg className="instructions-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="instructions-content">
                <strong>Instructions:</strong>
                1. Open Google Authenticator or any 2FA app
                <br />
                2. Scan the QR code above
                <br />
                3. Enter the 6-digit code from the app to verify
              </div>
            </div>
          </div>

          <div>
            <button onClick={handleContinue} className="auth-button">
              I've scanned the QR code, continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;
