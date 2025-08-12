import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/profile.css";

const profileCircleColor = "#191a2e"; // matches the image

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "",
    email: "", phoneNumber: "",
    city: "", country: "",
    additionalInfo: "", profilePicture: "",
  });

  const [trips, setTrips] = useState({ upcoming: [], completed: [] });
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        phoneNumber: parsedUser.phoneNumber || "",
        city: parsedUser.city || "",
        country: parsedUser.country || "",
        additionalInfo: parsedUser.additionalInfo || "",
        profilePicture: parsedUser.profilePicture || "",
      });
      fetchUserTrips();
    } else {
      // Public as Guest
      setUser({ firstName: "Guest", email: "guest@example.com" });
      fetchUserTrips();
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

  const fetchUserTrips = async () => {
    try {
      const res = await fetch("http://localhost:5000/apis/trips/");
      if (res.ok) {
        const data = await res.json();
        const allTrips = data.trips || [];
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const upcomingTrips = allTrips.filter(t => new Date(t.startDate) >= today).slice(0, 3);
        const completedTrips = allTrips.filter(t => new Date(t.endDate) < today).slice(0, 3);
        setTrips({ upcoming: upcomingTrips, completed: completedTrips });
      }
    } catch (err) {
      console.log("Error fetching", err);
    } finally {
      setTripsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfilePictureChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData({ ...formData, profilePicture: reader.result });
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="profile-bg min-vh-100 d-flex flex-column">
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
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="profile-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%"
                    }}
                  />
                ) : (
                  (user.name?.[0] || "A").toUpperCase()
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
                      width: 60,
                      height: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      overflow: "hidden"
                    }}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%"
                        }}
                      />
                    ) : (
                      (user.name?.[0] || "A").toUpperCase()
                    )}
                  </div>
                  <div className="fw-bold fs-6 mb-1" style={{ color: "#23243b" }}>
                    {user.name || user.email}
                  </div>
                  <div
                    className="text-muted fs-7"
                    style={{ fontSize: "0.93em" }}
                  >
                    {user.email}
                  </div>
                </div>
                <div className="mt-3 pb-1 text-center">
                  <button
                    className="btn btn-link profile-view-btn"
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

      {/* Profile Main */}
      <div className="container py-4 flex-grow-1">
        <div className="card shadow-sm p-4 rounded-3">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
            <h2 className="fw-bold text-dark mb-0">My Profile</h2>
            <div className="d-flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <Link
                    to="/ChangePassword"
                    className="btn btn-warning btn-sm d-flex align-items-center text-white"
                  >
                    <i className="bi bi-key-fill me-1"></i>Change Password
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-success btn-sm d-flex align-items-center"
                    onClick={() => setIsEditing(false)}
                  >
                    <i className="bi bi-check-circle me-1"></i>Save
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                    onClick={() => setIsEditing(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Picture + info */}
          <div className="row g-4 align-items-start">
            <div className="col-md-4 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={formData.profilePicture || user.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="rounded-circle border profile-photo"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="form-control form-control-sm mt-2"
                  />
                )}
              </div>
            </div>
            <div className="col-md-8">
              <div className="row g-3">
                {["firstName", "lastName", "email", "phoneNumber", "city", "country"].map(field => (
                  <div key={field} className="col-md-6">
                    <label className="form-label text-muted">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <div className="bg-light rounded px-2 py-1">
                        {user[field] || "Not Provided"}
                      </div>
                    )}
                  </div>
                ))}
                <div className="col-12">
                  <label className="form-label text-muted">
                    Additional Info
                  </label>
                  {isEditing ? (
                    <textarea
                      name="additionalInfo"
                      rows="3"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    <div className="bg-light rounded px-2 py-1">
                      {user.additionalInfo || "No Info"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trips Section */}
          <hr className="my-4" />
          <h5 className="fw-bold">My Trips</h5>
          {tripsLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <>
              <h6 className="mt-3">Upcoming</h6>
              {trips.upcoming.length === 0 ? (
                <p className="text-muted">No upcoming trips.</p>
              ) : (
                trips.upcoming.map(t => <TripCard key={t._id} trip={t} />)
              )}
              <h6 className="mt-4">Completed</h6>
              {trips.completed.length === 0 ? (
                <p className="text-muted">No completed trips.</p>
              ) : (
                trips.completed.map(t => <TripCard key={t._id} trip={t} />)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Trip card
const TripCard = ({ trip }) => (
  <div className="tripcard my-2 p-2 rounded border bg-light d-flex justify-content-between align-items-center">
    <div>
      <strong>{trip.name}</strong>
      <small className="d-block text-muted">{trip.destination}</small>
    </div>
    <Link to={`/trips/${trip._id}`} className="btn btn-outline-primary btn-sm">
      View
    </Link>
  </div>
);

export default Profile;
