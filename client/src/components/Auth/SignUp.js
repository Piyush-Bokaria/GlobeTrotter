import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/App.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/apis/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.message || "Registration failed");
        } catch {
          setError(`Server error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setMessage(data.message);

      // Navigate to OTP page after 2s
      setTimeout(() => {
        navigate(`/verify-otp?email=${formData.email}`);
      }, 2000);
    } catch (error) {
      setError(
        `Network error: ${error.message}. Make sure the server is running on port 5000.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
      <div className="login-bg-animation">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Left Side - Illustration */}
        <div className="login-illustration">
          <div className="illustration-container">
            <div className="travel-icons">
              <i className="bi bi-airplane"></i>
              <i className="bi bi-geo-alt"></i>
              <i className="bi bi-suitcase-lg"></i>
              <i className="bi bi-camera"></i>
            </div>
            <h1>Join <span>GlobalTrotter</span></h1>
            <p>Start your journey with us and explore the world like never before.</p>
            <div className="features-list">
              <div className="feature-item">
                <i className="bi bi-check-circle"></i>
                <span>Create your travel profile</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-check-circle"></i>
                <span>Get personalized recommendations</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-check-circle"></i>
                <span>Connect with fellow travelers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="login-form-container">
          <div className="login-form-card animate__animated animate__fadeInRight">
            <div className="form-header">
              <div className="logo">
                <i className="bi bi-globe2"></i>
                <span>GlobalTrotter</span>
              </div>
              <h2>Create Account</h2>
              <p>Fill in the details below to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill"></i> {error}
                </div>
              )}
              {message && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill"></i> {message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? "-slash" : ""}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Sign Up
                  </>
                )}
              </button>

              <div className="signup-link">
                Already have an account?{" "}
                <Link to="/login" className="signup-text">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
