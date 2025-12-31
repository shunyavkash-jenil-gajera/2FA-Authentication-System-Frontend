import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";
import { getDeviceFingerprint } from "../services/fingerprint.service.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState(null);
  const [skipTwoFA, setSkipTwoFA] = useState(false);

  const safeParse = (jsonString, fallback = null) => {
    if (!jsonString) return fallback;
    try {
      return JSON.parse(jsonString);
    } catch {
      console.error("Invalid user data in localStorage, clearing...");
      localStorage.removeItem("user");
      return fallback;
    }
  };

  // Check if 2FA has expired
  const checkTwoFAExpiry = () => {
    const twoFaExpiryStr = localStorage.getItem("twoFaExpiry");
    if (!twoFaExpiryStr) return false;

    const expiryDate = new Date(twoFaExpiryStr);
    const now = new Date();

    if (expiryDate < now) {
      // 2FA expired - clear it
      localStorage.removeItem("otpVerified");
      localStorage.removeItem("twoFaExpiry");
      return true;
    }
    return false;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const fingerprint = await getDeviceFingerprint();
        setDeviceFingerprint(fingerprint);

        const storedToken = localStorage.getItem("accessToken");
        const storedUserRaw = localStorage.getItem("user");
        let storedOtpVerified = localStorage.getItem("otpVerified") === "true";

        // Check 2FA expiry
        if (storedOtpVerified && checkTwoFAExpiry()) {
          storedOtpVerified = false;
        }

        if (storedToken && storedUserRaw) {
          const parsedUser = safeParse(storedUserRaw);
          if (parsedUser) {
            setToken(storedToken);
            setUser(parsedUser);
            if (parsedUser.enabled_2fa) {
              setOtpVerified(storedOtpVerified);
            } else {
              setOtpVerified(false);
            }
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const fingerprint = deviceFingerprint || (await getDeviceFingerprint());
      const response = await authAPI.login({
        email,
        password,
        deviceFingerprint: fingerprint,
      });

      if (response.success) {
        const { accessToken, user: userData, skipTwoFA: skip2FA, session } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);

        // Store 2FA expiry time
        if (session?.twoFaExpiry) {
          localStorage.setItem("twoFaExpiry", session.twoFaExpiry);
        }

        if (skip2FA) {
          setSkipTwoFA(true);
          setOtpVerified(true);
          localStorage.setItem("otpVerified", "true");
        } else {
          setSkipTwoFA(false);
          if (userData.enabled_2fa) {
            setOtpVerified(false);
            localStorage.setItem("otpVerified", "false");
          } else {
            setOtpVerified(true);
            localStorage.setItem("otpVerified", "true");
          }
        }
        return { success: true, user: userData, skipTwoFA: skip2FA };
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userName, email, password) => {
    try {
      const fingerprint = deviceFingerprint || (await getDeviceFingerprint());
      const response = await authAPI.register({
        userName,
        email,
        password,
        deviceFingerprint: fingerprint,
      });

      if (response.success) {
        const { token: accessToken, user: userData, session } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);

        // Store 2FA expiry time
        if (session?.twoFaExpiry) {
          localStorage.setItem("twoFaExpiry", session.twoFaExpiry);
        }

        if (userData.enabled_2fa) {
          setOtpVerified(false);
          localStorage.setItem("otpVerified", "false");
        } else {
          setOtpVerified(true);
          localStorage.setItem("otpVerified", "true");
        }
        return { success: true, user: userData };
      }
      throw new Error(response.message || "Registration failed");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("otpVerified");
      localStorage.removeItem("twoFaExpiry");
      setToken(null);
      setUser(null);
      setOtpVerified(false);
      setSkipTwoFA(false);
    }
  };

  const logoutAll = async (accessToken) => {
    try {
      await authAPI.logoutAll({ accessToken });
    } catch (error) {
      console.error("Logout all error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("otpVerified");
      localStorage.removeItem("twoFaExpiry");
      setToken(null);
      setUser(null);
      setOtpVerified(false);
      setSkipTwoFA(false);
    }
  };

  const enable2FA = async () => {
    try {
      const response = await authAPI.enable2FA();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || "Failed to enable 2FA");
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (otp, accessToken) => {
    try {
      const response = await authAPI.verifyOTP({ otp, accessToken });
      if (response.success) {
        if (response.data.session?.accessToken) {
          localStorage.setItem("accessToken", response.data.session.accessToken);
          setToken(response.data.session.accessToken);
        }

        // Store 2FA expiry time
        if (response.data.session?.twoFaExpiry) {
          localStorage.setItem("twoFaExpiry", response.data.session.twoFaExpiry);
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.enabled_2fa = true;
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
        setOtpVerified(true);
        localStorage.setItem("otpVerified", "true");
        return { success: true, data: response.data };
      }
      throw new Error(response.message || "OTP verification failed");
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    otpVerified,
    skipTwoFA,
    deviceFingerprint,
    login,
    register,
    logout,
    logoutAll,
    enable2FA,
    verifyOTP,
    needs2FASetup: !!user && !user?.enabled_2fa && !!token,
    is2FARequired: !!user?.enabled_2fa && !!token && !otpVerified && !skipTwoFA,
    isAuthenticated: !!user && !!token && user?.enabled_2fa && otpVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
