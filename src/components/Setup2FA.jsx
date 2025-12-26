import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { enable2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        const data = await enable2FA();
        setQrCode(data.qrCodeDataURL);
        setSecret(data.secret);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to generate QR code"
        );
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [enable2FA]);

  const handleContinue = () => {
    navigate("/verify-otp-setup");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set up Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Scan this QR code with your authenticator app
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            {qrCode && (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Can't scan? Use this secret key:
            </p>
            <code className="text-xs bg-white p-2 rounded border block break-all">
              {secret}
            </code>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Instructions:</strong>
                  <br />
                  1. Open Google Authenticator or any 2FA app
                  <br />
                  2. Scan the QR code above
                  <br />
                  3. Enter the 6-digit code from the app to verify
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleContinue}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              I've scanned the QR code, continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;
