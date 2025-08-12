import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/App.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Mock API call for password reset
    setTimeout(() => {
      if (email === "fail@example.com") {
        setError("This email address is not registered.");
      } else {
        setMessage("A password reset link has been sent to your email.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-bg-animation">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
      <div className="login-content">
        <div className="login-illustration">
          <div className="illustration-container">
            <div className="travel-icons">
              <i className="bi bi-key"></i>
              <i className="bi bi-unlock"></i>
              <i className="bi bi-envelope-check"></i>
            </div>
            <h1>Forgot Your Password?</h1>
            <p>No worries! Enter your email below to reset it.</p>
          </div>
        </div>
        <div className="login-form-container">
          <div className="login-form-card">
            <div className="form-header">
              <div className="logo">
                <i className="bi bi-globe2"></i>
                <span>GlobalTrotter</span>
              </div>
              <h2>Reset Password</h2>
              <p>We'll send a recovery link to your email</p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                    Sending...
                  </>
                ) : (
                  "Send Recovery Link"
                )}
              </button>
              <div className="signup-link">
                Remembered your password?{" "}
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

export default ForgotPassword;