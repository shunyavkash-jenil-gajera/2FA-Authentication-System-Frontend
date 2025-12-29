import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
              const userData = userDataFromUrl;
              console.log(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            } catch (e) {
              console.warn("Could not parse user data from URL");
            }
          }

          setTimeout(() => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (storedUser?.enabled_2fa) {
              navigate("/dashboard", { replace: true });
            } else {
              navigate("/setup-2fa", { replace: true });
            }
          }, 100);
        } else {
          const response = await fetch(
            "https://55g7h3d4-4001.inc1.devtunnels.ms/api/v1/auth/google/callback",
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error(`Backend response error: ${response.status}`);
          }

          const data = await response.json();

          if (data.success && data.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.data.user));

            setTimeout(() => {
              if (data.data.user?.enabled_2fa) {
                navigate("/dashboard", { replace: true });
              } else {
                navigate("/setup-2fa", { replace: true });
              }
            }, 100);
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
