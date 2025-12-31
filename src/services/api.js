import axios from "axios";
import { API_BASE_URL, AUTH_ROUTE } from "../utils/constants.util.js";

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
    const msg = error.response?.data?.message;
    if (
      error.response?.status === 401 ||
      msg === "Session Not Found Please login" ||
      (typeof msg === "string" && msg.includes("Session Not Found"))
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("otpVerified");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register
  register: async (userData) => {
    const response = await api.post(AUTH_ROUTE.REGISTER, userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post(AUTH_ROUTE.LOGIN, credentials);
    return response.data;
  },

  // Enable 2FA
  enable2FA: async () => {
    const response = await api.post(AUTH_ROUTE.ENABLE_2FA);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post(AUTH_ROUTE.VERIFY_OTP, otpData);
    return response.data;
  },

  // Google Auth
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}${AUTH_ROUTE.GOOGLE}?redirectUrl=${window.location.origin}/auth-callback`;
  },

  // Google Callback
  googleCallback: async () => {
    const response = await api.get(AUTH_ROUTE.GOOGLE_CALLBACK);
    return response.data;
  },

  // Dashboard/Home
  getDashboard: async () => {
    const response = await api.get(AUTH_ROUTE.GET_DASHBOARD);
    return response.data;
  },

  // GET All Login Account
  getLoginAccount: async () => {
    const response = await api.get(AUTH_ROUTE.GET_LOGIN_ACCOUNTS);
    return response.data;
  },

  // logout
  logout: async () => {
    const response = await api.post(AUTH_ROUTE.LOGOUT);
    return response.data;
  },

  // logout-all
  logoutAll: async () => {
    const response = await api.post(AUTH_ROUTE.LOGOUT_ALL_ACCOUNT);
    return response.data;
  },
};

export default api;
