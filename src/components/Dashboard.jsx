import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Dashboard = () => {
  const { user, logout, token, logoutAll, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAccounts, setLoginAccounts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await authAPI.getDashboard();
        const accounts = await authAPI.getLoginAccount();
        setDashboardData(response);
        setLoginAccounts(accounts.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleAllLogout = () => {
    logoutAll(token);
    navigate("/login");
  };

  const handleEnable2FA = () => {
    navigate("/setup-2fa");
  };

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          <div className="navbar-title">2FA Authentication System</div>
          <div className="navbar-user-section">
            <span className="navbar-username">
              {user?.userName || user?.email}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <h2 className="dashboard-heading">Welcome to Dashboard</h2>

              <div className="info-box">
                <div style={{ display: "flex" }}>
                  <div className="flex-shrink-0">
                    <svg
                      className="info-icon"
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
                  <div className="info-content">
                    <p className="info-text">
                      {dashboardData?.data?.message || "Welcome home page"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid-layout">
                <div className="card-section">
                  <h3 className="card-section-title">User Information</h3>
                  <div className="card-section-content">
                    <p className="section-text">
                      <strong>Name:</strong> {user?.userName || "N/A"}
                    </p>
                    <p className="section-text">
                      <strong>Email:</strong> {user?.email || "N/A"}
                    </p>
                    <p className="section-text">
                      <strong>2FA Enabled:</strong>{" "}
                      {user?.enabled_2fa ? (
                        <span className="status-success">Yes</span>
                      ) : (
                        <span className="status-error">No</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="card-section">
                  <h3 className="card-section-title">Security</h3>
                  <div className="card-section-content">
                    {!user?.enabled_2fa && (
                      <button
                        onClick={handleEnable2FA}
                        className="enable-2fa-button"
                      >
                        Enable Two-Factor Authentication
                      </button>
                    )}
                    {user?.enabled_2fa && (
                      <div className="success-box">
                        <p>
                          <strong>✓ 2FA is enabled</strong>
                          <br />
                          Your account is protected with two-factor
                          authentication.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                {loginAccounts.map((acc) => {
                  return (
                    <div className="bg-gray-50 text-gray-600" key={acc.ip}>
                      {acc.ip}
                    </div>
                  );
                })}
              </div>
              <button onClick={handleAllLogout} className="logout-button">
                Logout All Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
