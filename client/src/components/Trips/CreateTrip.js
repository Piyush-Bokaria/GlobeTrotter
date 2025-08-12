import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/trip.css";

const user = {
  name: "Demo Admin",
  email: "adminn@gmail.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const profileCircleColor = "#191a2e"; // matches the image

const CreateTripScreen = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [trip, setTrip] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    coverPhoto: null,
  });

  // Detect click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    setTrip({ ...trip, coverPhoto: e.target.files[0] });
  };

  const handleSave = () => {
    console.log("Trip saved:", trip);
  };

  return (
    <div className="trip-background min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <i className="bi bi-globe me-2"></i> GlobalTrotter
          </a>
          <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
            <div
              className="profile-img-wrapper"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
              style={{cursor:"pointer"}}
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
                  fontSize: 1.9 + "rem",
                  border: "3px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  overflow: "hidden"
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="profile-img"
                    style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}
                  />
                ) : (
                  (user.name[0] || "A").toUpperCase()
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
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%"}}
                      />
                    ) : (
                      (user.name[0] || "A").toUpperCase()
                    )}
                  </div>
                  <div className="fw-bold fs-6 mb-1" style={{color: "#23243b"}}>
                    {user.name || user.email}
                  </div>
                  <div className="text-muted fs-7" style={{fontSize:"0.93em"}}>
                    {user.email}
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
              style={{marginLeft: 22, fontWeight: 550, fontSize: "1rem"}}
            >
              <a
                className="text-decoration-none text-muted"
                style={{cursor: "pointer",}}
                
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
      {/* End Navbar */}

      {/* Main Content */}
      <div className="container mt-5">
        <div className="card trip-card mx-auto">
          <div className="card-header text-center fs-4 fw-bold">
            Create a New Trip
          </div>
          <div className="card-body">
            <form>
              <div className="mb-4">
                <label className="form-label">Trip Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={trip.name}
                  onChange={handleChange}
                  placeholder="Enter trip name"
                />
              </div>
              <div className="row">
                <div className="mb-4 col-md-6">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={trip.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={trip.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Trip Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={trip.description}
                  onChange={handleChange}
                  placeholder="Add a description of your trip"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Cover Photo (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  name="coverPhoto"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
              <button
                type="button"
                className="btn btn-success w-100 mb-3"
                onClick={handleSave}
              >
                Save Trip
              </button>
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => navigate("/itinerary")}
              >
                <i className="bi bi-map me-2"></i>Build Itinerary
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* New Suggestions Section */}
      <div className="suggestion-section container-fluid">
        <div className="suggestion-panel card mx-auto mb-0">
          <div className="suggestion-header">
            Suggestions for Places to Visit / Activities to Perform
          </div>
          <div className="suggestion-cards-wrapper row g-3 px-3 pb-4">
            {[
              { title: "Beach Paradise", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", desc: "Relax on sunny beaches" },
              { title: "Mountain Hike", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", desc: "Explore scenic mountain trails" },
              { title: "City Tour", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b", desc: "Experience vibrant city life" },
              { title: "Cultural Heritage", img: "https://images.unsplash.com/photo-1549893079-842e6e94a9a0", desc: "Discover ancient landmarks" },
              { title: "Adventure Sports", img: "https://images.unsplash.com/photo-1500048993959-dc0e0a1f9d77", desc: "Thrilling outdoor activities" },
              { title: "Nature Escape", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", desc: "Reconnect with nature" }
            ].map((item, idx) => (
              <div key={idx} className="col-6 col-md-4">
                <div className="suggestion-card new">
                  <img src={item.img} alt={item.title} className="suggestion-img" />
                  <div className="suggestion-info">
                    <h6>{item.title}</h6>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTripScreen;
