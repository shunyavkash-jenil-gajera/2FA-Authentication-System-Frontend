import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api.js";
import Loading from "./Loading.jsx";
import Disable2FA from "./Disable2FA.jsx";

const Dashboard = () => {
  const { user, logout, token, logoutAll, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAccounts, setLoginAccounts] = useState(null);
  const [loggingOutDeviceId, setLoggingOutDeviceId] = useState(null);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log(isAuthenticated);
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

  const handleLogoutFromDevice = async (sessionId, deviceName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to logout from "${deviceName}"?`
    );

    if (!isConfirmed) {
      return;
    }

    setLoggingOutDeviceId(sessionId);

    try {
      const response = await authAPI.logoutFromDevice(sessionId);
      if (response.success) {
        const accounts = await authAPI.getLoginAccount();
        setLoginAccounts(accounts.data);
        alert(`Successfully logged out from ${deviceName}`);
      }
    } catch (error) {
      console.error("Failed to logout from device:", error);
      alert("Failed to logout from device. Please try again.");
    } finally {
      setLoggingOutDeviceId(null);
    }
  };

  const handleEnable2FA = () => {
    navigate("/setup-2fa");
  };

  if (loading) {
    return <Loading />;
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
            {" "}
            <div className="dashboard-card-content">
              {" "}
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
                      <div>
                        <div className="success-box">
                          <p>
                            <strong>✓ 2FA is enabled</strong>
                            <br />
                            Your account is protected with two-factor
                            authentication.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDisable2FAModal(true)}
                          className="disable-2fa-button"
                          style={{ marginTop: "10px" }}
                        >
                          Disable Two-Factor Authentication
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="card-section">
                  <h3 className="card-section-title">User Logged in Devices</h3>
                  {loginAccounts && loginAccounts.length > 0 ? (
                    <>
                      {loginAccounts.map((acc) => {
                        const loginDate = new Date(
                          acc.loginDate
                        ).toLocaleString();
                        return (
                          <div key={acc.sessionId} className="device-item">
                            <div className="device-info">
                              <div className="device-header">
                                <span className="device-name">
                                  {acc?.deviceName || "Unknown Device"}
                                </span>
                                {acc.isTrustedDevice && (
                                  <span className="trusted-badge">Trusted</span>
                                )}
                                {acc.is2FaExpired && (
                                  <span className="expired-badge">
                                    2FA Expired
                                  </span>
                                )}
                              </div>
                              <p className="device-detail">
                                <strong>OS:</strong> {acc?.os || "Unknown"}
                              </p>
                              <p className="device-detail">
                                <strong>IP Address:</strong>{" "}
                                {acc?.ip || "Unknown"}
                              </p>
                              <p className="device-detail">
                                <strong>Login Date:</strong> {loginDate}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleLogoutFromDevice(
                                  acc.sessionId,
                                  acc?.deviceName || "Device"
                                )
                              }
                              disabled={loggingOutDeviceId === acc.sessionId}
                              className="logout-device-button"
                            >
                              {loggingOutDeviceId === acc.sessionId
                                ? "Logging out..."
                                : "Logout from Device"}
                            </button>
                          </div>
                        );
                      })}
                      <button
                        onClick={handleAllLogout}
                        className="logout-all-button"
                      >
                        Logout All Account
                      </button>
                    </>
                  ) : (
                    <p className="device-text">No devices logged in</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showDisable2FAModal && (
        <Disable2FA
          onSuccess={() => {
            setShowDisable2FAModal(false);
            alert("2FA has been successfully disabled");
            window.location.reload();
          }}
          onCancel={() => setShowDisable2FAModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
