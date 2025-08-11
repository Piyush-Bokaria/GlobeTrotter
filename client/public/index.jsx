import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css"; // We'll put your CSS here

const Dashboard = () => {
  const logout = () => {
    alert("Logout clicked!");
  };

  const planTrip = () => {
    alert("Plan a new trip clicked!");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="bi bi-globe"></i> GlobalTrotter
          </a>
          <div className="ms-auto d-flex align-items-center">
            <div className="dropdown">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="profile-img dropdown-toggle"
                data-bs-toggle="dropdown"
                style={{ cursor: "pointer" }}
              />
              <ul className="dropdown-menu dropdown-menu-end bg-dark">
                <li>
                  <span className="dropdown-item-text text-white">
                    <b>User:</b> Alex
                  </span>
                </li>
                <li>
                  <span className="dropdown-item-text text-white">
                    <b>Email:</b> alex@email.com
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Banner & Stats */}
      <div className="container mt-3">
        <div className="welcome-banner">
          <h1>Welcome back, Alex!</h1>
          <div className="d-flex justify-content-center flex-wrap">
            <div className="stats-box mx-2">
              <i className="bi bi-geo-alt"></i> 12 Trips
            </div>
            <div className="stats-box mx-2">
              <i className="bi bi-globe2"></i> 8 Countries
            </div>
            <div className="stats-box mx-2">
              <i className="bi bi-cash"></i> $5,240 Spent
            </div>
            <div className="stats-box mx-2">
              <i className="bi bi-graph-up-arrow"></i> $1,830 Saved
            </div>
          </div>
        </div>

        {/* Filters/Search/Sort */}
        <div className="row mb-1 gx-2">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <input
              className="form-control bg-dark text-white"
              type="text"
              placeholder="Search destinations, trips..."
              id="searchBar"
            />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <button className="btn btn-outline-light">
              <i className="bi bi-columns-gap"></i> Group by
            </button>
            <button className="btn btn-outline-light">
              <i className="bi bi-filter"></i> Filter
            </button>
            <button className="btn btn-outline-light">
              <i className="bi bi-sort-alpha-down"></i> Sort
            </button>
          </div>
        </div>

        {/* Top Regional Selections */}
        <div className="section-title">Top Regional Selections</div>
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="region-card position-relative mb-4">
              <span className="region-tag">Cultural</span>
              <img
                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
                alt="Tokyo Adventure"
              />
              <span className="visited-badge">Visited</span>
              <div className="card-body">
                <div className="fw-bold">Tokyo Adventure</div>
                <div className="d-flex align-items-center">
                  <span className="rating-star">
                    <i className="bi bi-star-fill"></i> 4.8
                  </span>{" "}
                  &nbsp; $1,200
                </div>
                <small>Tokyo, Japan</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="region-card position-relative mb-4">
              <span className="region-tag">Adventure</span>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Swiss Alps Retreat"
              />
              <span className="visited-badge">Visited</span>
              <div className="card-body">
                <div className="fw-bold">Swiss Alps Retreat</div>
                <div className="d-flex align-items-center">
                  <span className="rating-star">
                    <i className="bi bi-star-fill"></i> 4.9
                  </span>{" "}
                  &nbsp; $2,100
                </div>
                <small>Zermatt, Switzerland</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="region-card position-relative mb-4">
              <span className="region-tag">Beach</span>
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                alt="Bali Paradise"
              />
              <span className="visited-badge">Visited</span>
              <div className="card-body">
                <div className="fw-bold">Bali Paradise</div>
                <div className="d-flex align-items-center">
                  <span className="rating-star">
                    <i className="bi bi-star-fill"></i> 4.7
                  </span>{" "}
                  &nbsp; $850
                </div>
                <small>Ubud, Indonesia</small>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Trips */}
        <div className="section-title">Previous Trips</div>
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="trip-card position-relative mb-4">
              <span className="trip-tag">Beach</span>
              <img
                src="https://images.unsplash.com/photo-1465156799763-2c087c332e94"
                alt="Santorini Sunset"
              />
              <span className="visited-badge">Visited</span>
              <div className="card-body">
                <div className="fw-bold">Santorini Sunset</div>
                <div className="d-flex align-items-center">
                  <span className="rating-star">
                    <i className="bi bi-star-fill"></i> 4.8
                  </span>{" "}
                  &nbsp; $1,350
                </div>
                <small>Santorini, Greece</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="trip-card position-relative mb-4">
              <span className="trip-tag">Urban</span>
              <img
                src="https://images.unsplash.com/photo-1503676382389-4809596d5290"
                alt="New York City"
              />
              <span className="visited-badge">Visited</span>
              <div className="card-body">
                <div className="fw-bold">New York City</div>
                <div className="d-flex align-items-center">
                  <span className="rating-star">
                    <i className="bi bi-star-fill"></i> 4.5
                  </span>{" "}
                  &nbsp; $980
                </div>
                <small>Manhattan, USA</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="trip-card position-relative mb-4">
              <span className="trip-tag">Adventure</span>
              <img
                src="https://images.unsplash.com/photo-1445308394109-4ec2920981b1"
                alt="Amazon Expedition"
              />
              <span className="visited-badge">Visited</span>
              <div className="card-body">
                <div className="fw-bold">Amazon Expedition</div>
                <div className="d-flex align-items-center">
                  <span className="rating-star">
                    <i className="bi bi-star-fill"></i> 4.7
                  </span>{" "}
                  &nbsp; $2,200
                </div>
                <small>Peru</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Plan Trip Button */}
      <button className="btn btn-main btn-lg fab-btn" onClick={planTrip}>
        <i className="bi bi-plus-circle"></i> Plan a New Trip
      </button>
    </div>
  );
};

export default Dashboard;
