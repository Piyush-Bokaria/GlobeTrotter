import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/edittrip.css";

const user = {
  name: "Demo Admin",
  email: "adminn@gmail.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const profileCircleColor = "#191a2e"; // matches the image

const EditTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    destination: "",
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

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

  const fetchTrip = async () => {
    try {
      const response = await fetch(`http://localhost:5000/apis/trips/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        const trip = data.trip;
        setFormData({
          name: trip.name || "",
          description: trip.description || "",
          startDate: trip.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "",
          endDate: trip.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "",
          budget: trip.budget || "",
          destination: trip.destination || "",
        });
        if (trip.coverPhoto) setCurrentCoverPhoto(trip.coverPhoto);
      } else {
        setError("Failed to load trip details");
      }
    } catch (error) {
      setError("Failed to load trip details");
    } finally {
      setFetchLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // Form Handlers
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    setError("");
    setCoverPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };
  const removePhoto = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
    setCurrentCoverPhoto(null);
    const fileInput = document.getElementById("coverPhoto");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (endDate <= startDate) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
      let photoData = currentCoverPhoto;
      if (coverPhoto) {
        const reader = new FileReader();
        photoData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(coverPhoto);
        });
      }
      const tripData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        destination: formData.destination.trim(),
        coverPhoto: photoData,
      };
      const response = await fetch(`http://localhost:5000/apis/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.message || "Failed to update trip");
        } catch {
          setError(`Server error: ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => {
        navigate("/trips");
      }, 2000);
    } catch (error) {
      setError(`Network error: ${error.message}. Make sure the server is running.`);
    } finally {
      setLoading(false);
    }
  };

  // Loader
  if (fetchLoading) {
    return (
      <div className="edittrip-loader-bg d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
      </div>
    );
  }

  return (
    <div className="edittrip-bg min-vh-100 d-flex flex-column">
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

      {/* Main Content */}
      <div className="container py-5 flex-grow-1">
        <div className="edittrip-panel card mx-auto">
          <div className="panel-header d-flex align-items-center mb-4">
            <Link to="/trips" className="back-btn text-muted me-3">
              <i className="bi bi-arrow-left fs-4"></i>
            </Link>
            <span className="fs-3 fw-bold text-dark">Edit Trip</span>
          </div>
          <form onSubmit={handleSubmit} className="edittrip-form">
            {/* Trip Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Trip Name <span className="text-danger">*</span></label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-control"
                placeholder="e.g., Summer Europe Adventure"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {/* Destination */}
            <div className="mb-3">
              <label htmlFor="destination" className="form-label">Destination</label>
              <input
                id="destination"
                name="destination"
                type="text"
                className="form-control"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={handleChange}
              />
            </div>
            {/* Dates */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="startDate" className="form-label">Start Date <span className="text-danger">*</span></label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="endDate" className="form-label">End Date <span className="text-danger">*</span></label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Budget */}
            <div className="mb-3">
              <label htmlFor="budget" className="form-label">Budget (Optional)</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Description */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Trip Description <span className="text-danger">*</span></label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="form-control"
                placeholder="Describe your trip plans, activities, or any special notes..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            {/* Cover Photo Upload */}
            <div className="mb-3">
              <label className="form-label">Cover Photo (Optional)</label>
              <div>
                {coverPhotoPreview || currentCoverPhoto ? (
                  <div className="position-relative">
                    <img
                      src={coverPhotoPreview || currentCoverPhoto}
                      alt="Cover preview"
                      className="img-fluid rounded edittrip-coverphoto"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="btn btn-danger position-absolute top-0 end-0 m-2 btn-sm"
                      title="Remove Photo"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ) : (
                  <div className="edittrip-dropzone mb-2">
                    <label htmlFor="coverPhoto" className="text-primary fw-medium cursor-pointer">
                      <i className="bi bi-image me-2"></i>Upload or Drag Photo Here
                    </label>
                    <input
                      id="coverPhoto"
                      name="coverPhoto"
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <div className="text-muted small mt-2">PNG, JPG, GIF up to 5MB</div>
                  </div>
                )}
              </div>
            </div>
            {error && (
              <div className="alert alert-danger mt-2">{error}</div>
            )}
            {message && (
              <div className="alert alert-success mt-2">{message}</div>
            )}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Link
                to="/trips"
                className="btn btn-outline-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Updating Trip..." : "Update Trip"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrip;
