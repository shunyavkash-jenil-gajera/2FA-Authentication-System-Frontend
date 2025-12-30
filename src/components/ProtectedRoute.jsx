import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Setup2FA from "./Setup2FA.jsx";
import VerifyOTP from "./VerifyOTP.jsx";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, token, loading, needs2FASetup, is2FARequired } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || !token) return <Navigate to="/login" replace />;

  if (needs2FASetup) {
    navigate("/setup-2fa", { replace: true });
    return <Setup2FA />;
  }

  if (is2FARequired) {
    navigate("/verify-otp", { replace: true });
    return <VerifyOTP />;
  }

  return children;
};

export default ProtectedRoute;
