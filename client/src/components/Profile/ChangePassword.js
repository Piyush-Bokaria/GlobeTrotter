import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/changepassword.css";

const profileCircleColor = "#191a2e"; // matches the image

const ChangePassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ firstName: "Guest", email: "guest@example.com" });
    }
  }, []);

  // Detect click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/apis/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || "Failed to change password");
        return;
      }
      const data = await response.json();
      setMessage(data.message + " You will be logged out for security reasons.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        navigate("/login?message=Password changed successfully.");
      }, 3000);
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="changepass-bg min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
            <i className="bi bi-globe me-2"></i> GlobalTrotter
          </Link>
          <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
            <div
              className="profile-img-wrapper"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <div
                className="profile-circle"
                style={{
                  background: profileCircleColor,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  fontSize: "1.9rem",
                  border: "3px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  overflow: "hidden"
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || user?.firstName || "User"}
                    className="profile-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  (user?.name?.[0] || user?.firstName?.[0] || "A").toUpperCase()
                )}
              </div>
            </div>
            {dropdownOpen && (
              <div className="custom-profile-dropdown animate__animated animate__fadeIn">
                <div className="profile-menu-header d-flex flex-column align-items-center">
                  <div
                    className="profile-circle mb-2"
                    style={{
                      background: profileCircleColor,
                      width: 60, height: 60,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%",
                      overflow: "hidden"
                    }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || user?.firstName || "User"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      (user?.name?.[0] || user?.firstName?.[0] || "A").toUpperCase()
                    )}
                  </div>
                  <div className="fw-bold fs-6 mb-1" style={{ color: "#23243b" }}>
                    {user?.name || user?.firstName || user?.email}
                  </div>
                  <div className="text-muted fs-7" style={{ fontSize: "0.93em" }}>
                    {user?.email}
                  </div>
                </div>
                <div className="mt-3 pb-1 text-center">
                  <button
                    className="btn btn-link profile-view-btn"
                    style={{
                      color: "#3267d3",
                      textDecoration: "underline",
                      fontWeight: 600,
                      fontSize: "1.01em",
                      letterSpacing: ".01em"
                    }}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    View Profile
                  </button>
                </div>
                <div
                  className="nav-signout-link"
                  style={{ marginLeft: 22, fontWeight: 550, fontSize: "1rem" }}
                >
                  <a
                    className="text-decoration-none text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={logout}
                  >
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="container flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="card shadow-lg p-4 rounded-3 changepass-card">
          <h3 className="fw-bold text-dark mb-4 text-center">
            <i className="bi bi-key-fill me-2 text-primary"></i>Change Password
          </h3>
          <form onSubmit={handleSubmit}>
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label fw-semibold text-secondary">
                  {field === "currentPassword"
                    ? "Current Password"
                    : field === "newPassword"
                    ? "New Password"
                    : "Confirm New Password"}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock-fill text-primary"></i>
                  </span>
                  <input
                    type="password"
                    name={field}
                    className="form-control"
                    placeholder={
                      field === "currentPassword"
                        ? "Enter current password"
                        : field === "newPassword"
                        ? "Enter new password"
                        : "Re-enter new password"
                    }
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </div>
                {field === "newPassword" && (
                  <small className="text-muted">Must be at least 6 characters long.</small>
                )}
              </div>
            ))}
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && <div className="alert alert-success py-2">{message}</div>}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/profile" className="btn btn-outline-secondary px-4">
                <i className="bi bi-x-circle me-1"></i>Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? "Updating..." : (<><i className="bi bi-check-circle me-1"></i>Save Changes</>)}
              </button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="alert alert-info mt-4">
            <h6 className="fw-bold mb-2">
              <i className="bi bi-shield-lock-fill me-2"></i>Password Tips
            </h6>
            <ul className="mb-0 ps-3 small">
              <li>Use a mix of letters, numbers & symbols</li>
              <li>Minimum length: 8 characters</li>
              <li>Don't reuse old passwords</li>
              <li>Consider a password manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
