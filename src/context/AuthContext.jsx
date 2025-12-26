import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

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
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        if (response.data.require2FA) {
          return { require2FA: true, userId: response.data.UserId };
        } else {
          const { accessToken, user: userData } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(userData));
          setToken(accessToken);
          setUser(userData);
          return { success: true, user: userData };
        }
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userName, email, password) => {
    try {
      const response = await authAPI.register({ userName, email, password });

      if (response.success) {
        const { token: accessToken, user: userData } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error(response.message || "Registration failed");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const response = await authAPI.logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
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
        // Update user data after successful 2FA verification
        if (response.data.session?.accessToken) {
          localStorage.setItem(
            "accessToken",
            response.data.session.accessToken
          );
          setToken(response.data.session.accessToken);
        }
        // Refresh user data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.enabled_2fa = true;
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
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
    login,
    register,
    logout,
    enable2FA,
    verifyOTP,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
