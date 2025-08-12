import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/itinerary.css";

const user = {
  name: "Demo Admin",
  email: "adminn@gmail.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const profileCircleColor = "#191a2e"; // matches the image

const defaultStops = [
  {
    city: "",
    startDate: "",
    endDate: "",
    activities: [""]
  }
];

const cityOptions = [
  "Paris", "Tokyo", "New York", "London", "Sydney", "Berlin", "Rome"
];
const activityOptions = [
  "Sightseeing",
  "Museum Visit",
  "Food Tour",
  "Hiking",
  "Shopping",
  "Beach Day",
  "Nightlife"
];

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const [stops, setStops] = useState(defaultStops);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Budget state
  const [budgetItems, setBudgetItems] = useState([{ name: "", cost: "" }]);

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

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const addStop = () => {
    setStops([...stops, { city: "", startDate: "", endDate: "", activities: [""] }]);
  };

  const updateStop = (index, key, value) => {
    const newStops = [...stops];
    newStops[index][key] = value;
    setStops(newStops);
  };

  const addActivity = (index) => {
    const newStops = [...stops];
    newStops[index].activities.push("");
    setStops(newStops);
  };

  const updateActivity = (stopIdx, actIdx, value) => {
    const newStops = [...stops];
    newStops[stopIdx].activities[actIdx] = value;
    setStops(newStops);
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const moveStop = (fromIdx, toIdx) => {
    const newStops = [...stops];
    const moved = newStops.splice(fromIdx, 1)[0];
    newStops.splice(toIdx, 0, moved);
    setStops(newStops);
  };

  // Budget functions
  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { name: "", cost: "" }]);
  };

  const updateBudgetItem = (index, field, value) => {
    const newBudgetItems = [...budgetItems];
    newBudgetItems[index][field] = value;
    setBudgetItems(newBudgetItems);
  };

  const removeBudgetItem = (index) => {
    const newBudgetItems = budgetItems.filter((_, i) => i !== index);
    setBudgetItems(newBudgetItems);
  };

  const totalBudget = budgetItems.reduce((sum, item) => {
    const cost = parseFloat(item.cost);
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);

  return (
    <div className="itinerary-background min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
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

      {/* Main Itinerary Section */}
      <div className="container mt-4 mb-5 flex-grow-1">
        <div className="itinerary-builder card mx-auto">
          <div className="card-header bg-white border-0 text-center fs-4 fw-bold">
            Build Your Interactive Trip Itinerary
          </div>
          <div className="card-body">
            {/* Stops Section */}
            <div>
              {stops.map((stop, idx) => (
                <div key={idx} className="stop-card mb-4">
                  <div className="stop-header d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">Step {idx + 1}</h5>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        disabled={idx === 0}
                        onClick={() => moveStop(idx, idx - 1)}
                        aria-label="Move Up"
                      >
                        <i className="bi bi-arrow-up"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        disabled={idx === stops.length - 1}
                        onClick={() => moveStop(idx, idx + 1)}
                        aria-label="Move Down"
                      >
                        <i className="bi bi-arrow-down"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeStop(idx)}
                        aria-label="Remove"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-5 mb-2">
                      <label className="form-label">City</label>
                      <select
                        className="form-select"
                        value={stop.city}
                        onChange={e => updateStop(idx, "city", e.target.value)}
                      >
                        <option value="">Select City</option>
                        {cityOptions.map(city => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={stop.startDate}
                        onChange={e => updateStop(idx, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={stop.endDate}
                        onChange={e => updateStop(idx, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="form-label">Activities</label>
                    {stop.activities.map((activity, actIdx) => (
                      <div key={actIdx} className="input-group mb-2">
                        <select
                          className="form-select"
                          value={activity}
                          onChange={e =>
                            updateActivity(idx, actIdx, e.target.value)
                          }
                        >
                          <option value="">Select Activity</option>
                          {activityOptions.map(act => (
                            <option key={act}>{act}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => addActivity(idx)}
                          aria-label="Add Activity"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Budget Section */}
            <div className="budget-section mt-4">
              <h5 className="mb-3 text-primary fw-bold">
                <i className="bi bi-cash-stack me-2"></i> Trip Budget
              </h5>
              {budgetItems.map((item, idx) => (
                <div key={idx} className="row g-2 mb-2 align-items-center">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Expense Name"
                      value={item.name}
                      onChange={e =>
                        updateBudgetItem(idx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Cost"
                      value={item.cost}
                      onChange={e =>
                        updateBudgetItem(idx, "cost", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-2 text-end">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeBudgetItem(idx)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary mt-2"
                onClick={addBudgetItem}
              >
                <i className="bi bi-plus-circle"></i> Add Expense
              </button>
              <div className="mt-3 fw-bold">
                Total Budget: <span className="text-success">${totalBudget}</span>
              </div>
            </div>

            {/* Add Stop Button - Now Below Budget Section */}
            <button
              type="button"
              className="btn btn-primary w-100 add-stop-btn mt-4"
              onClick={addStop}
            >
              <i className="bi bi-node-plus"></i> Add Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
