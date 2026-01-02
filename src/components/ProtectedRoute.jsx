import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Setup2FA from "./Setup2FA.jsx";
import VerifyOTP from "./VerifyOTP.jsx";
import Loading from "./Loading.jsx";
import Dashboard from "./Dashboard.jsx";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, token, loading, needs2FASetup, is2FARequired, skipTwoFA } =
    useAuth();

  if (loading) return <Loading />;
  if (!user || !token) return <Navigate to="/login" replace />;

  if (skipTwoFA) {
    console.log("skipTwoFA");
    navigate("/dashboard", { replace: true });
    return <Dashboard />;
  }

  if (needs2FASetup) {
    navigate("/setup-2fa", { replace: true });
    return <Setup2FA />;
  }

  if (is2FARequired && !skipTwoFA) {
    navigate("/verify-otp", { replace: true });
    return <VerifyOTP />;
  }

  return children;
};

export default ProtectedRoute;
