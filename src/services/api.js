import axios from "axios";

const API_BASE_URL = "https://55g7h3d4-4001.inc1.devtunnels.ms/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Enable 2FA (Generate QR Code)
  enable2FA: async () => {
    const response = await api.post("/auth/enable-2fa");
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post("/auth/verifyOtp", otpData);
    return response.data;
  },

  // Google Auth
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Dashboard/Home
  getDashboard: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  // GET All Login Account
  getLoginAccount: async () => {
    const response = await api.get("/dashboard/login-accounts");
    return response.data;
  },

  // logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // logout-all
  logout: async () => {
    const response = await api.post("/auth/logout-all");
    return response.data;
  },
};

export default api;
