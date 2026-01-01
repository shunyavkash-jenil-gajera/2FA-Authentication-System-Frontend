import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api.service.js";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (isAuthenticated && user?.enabled_2fa) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthenticated && !user?.enabled_2fa) {
    return <Navigate to="/setup-2fa" replace />;
  }

  useEffect(() => {
    const extractAndStoreToken = async () => {
      try {
        const tokenFromUrl = searchParams.get("token");
        const userDataFromUrl = searchParams.get("user");

        if (tokenFromUrl) {
          localStorage.setItem("accessToken", tokenFromUrl);

          if (userDataFromUrl) {
            try {
              const decode = decodeURIComponent(userDataFromUrl);
              let parsed;
              try {
                parsed = JSON.parse(decode);
              } catch (e) {
                let s = decode;
                s = s.replace(/new ObjectId\('\s*([^']+)\s*'\)/g, '"$1"');
                s = s.replace(/([,{\s])([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
                s = s.replace(/'([^']*)'/g, '"$1"');
                s = s.replace(
                  /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)/g,
                  '"$1"'
                );
                s = s.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
                parsed = JSON.parse(s);
              }

              if (
                parsed &&
                parsed._id &&
                typeof parsed._id === "object" &&
                parsed._id.$oid
              ) {
                parsed._id = parsed._id.$oid;
              }

              localStorage.setItem("user", JSON.stringify(parsed));

              if (parsed?.enabled_2fa) {
                localStorage.setItem("otpVerified", "false");
              } else {
                localStorage.setItem("otpVerified", "true");
              }
            } catch (e) {
              console.warn("Could not parse user data from URL", e);
            }
          }

          setTimeout(() => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (storedUser?.enabled_2fa) {
              navigate("/verify-otp", { replace: true });
            } else {
              navigate("/setup-2fa", { replace: true });
            }
          }, 100);
        } else {
          const response = await authAPI.googleCallback();

          if (!response.ok) {
            throw new Error(`Backend response error: ${response.status}`);
          }

          const data = await response.json();

          if (data.success && data.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.data.user));
            if (data.data.user?.enabled_2fa) {
              localStorage.setItem("otpVerified", "false");
              setTimeout(() => {
                navigate("/verify-otp", { replace: true });
              }, 100);
            } else {
              localStorage.setItem("otpVerified", "true");
              setTimeout(() => {
                navigate("/setup-2fa", { replace: true });
              }, 100);
            }
          } else {
            setError("Authentication failed. Please try again.");
            setTimeout(() => navigate("/login", { replace: true }), 2000);
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(
          error.message || "Authentication error. Redirecting to login..."
        );
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } finally {
        setLoading(false);
      }
    };

    extractAndStoreToken();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Authentication Error</h2>
          </div>
          <div className="auth-error">{error}</div>
          <p style={{ marginTop: "1rem", textAlign: "center", color: "#666" }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="text-center">
        <div className="spinner"></div>
        <p className="loading-text">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
