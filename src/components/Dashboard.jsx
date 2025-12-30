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
                <div className="card-section">
                  <h3 className="card-section-title">User Logged in Devices</h3>
                  {loginAccounts.map((acc) => {
                    return (
                      <div key={acc._id} className="device-list">
                        <p className="device-text">
                          <strong>Device:</strong> {acc?.deviceName || "N/A"}
                        </p>
                        <p className="device-text">
                          <strong>Device Ip:</strong> {acc?.ip || "N/A"}
                        </p>
                      </div>
                    );
                  })}
                  <button onClick={handleAllLogout} className="logout-button">
                    Logout All Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
