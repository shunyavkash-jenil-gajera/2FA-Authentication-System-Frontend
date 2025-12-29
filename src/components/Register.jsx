import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    if (user?.enabled_2fa) return <Navigate to="/verify-otp" replace />;
    return <Navigate to="/setup-2fa" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.userName || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(formData.userName, formData.email, formData.password);
      navigate("/setup-2fa");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Or{" "}
            <Link to="/login" className="auth-link">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="auth-input-wrapper">
            <div>
              <label htmlFor="userName" className="sr-only">
                User Name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="auth-input auth-input-first"
                placeholder="User Name"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="auth-input auth-input-middle"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="auth-input auth-input-last"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
