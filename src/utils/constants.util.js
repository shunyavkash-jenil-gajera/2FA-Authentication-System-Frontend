export const API_BASE_URL = "http://localhost:4001/api/v1";

export const AUTH_ROUTE = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  ENABLE_2FA: "/auth/enable-2fa",
  DISABLE_2FA: "/auth/disable-2fa",
  VERIFY_OTP: "/auth/verifyOtp",
  GOOGLE: "/auth/google",
  GOOGLE_CALLBACK: "/auth/google/callback",
  LOGOUT: "/auth/logout",
  LOGOUT_ALL_ACCOUNT: "/auth/logout-all",
  LOGOUT_DEVICE: "/auth/logout-device",

  GET_DASHBOARD: "/dashboard",
  GET_LOGIN_ACCOUNTS: "/dashboard/login-accounts",
};
