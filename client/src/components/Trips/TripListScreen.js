// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "../../styles/triplist.css";

// const TripListScreen = () => {
//   const navigate = useNavigate();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("isAuthenticated");
//     navigate("/login");
//   };

//   const planTrip = () => {
//     navigate("/createtrip");
//   };

//   // Trip data for easier management
//   const trips = [
//     {
//       id: 1,
//       title: "Exploring Paris: Food, Art & Adventure",
//       type: "Cultural",
//       location: "Paris, France",
//       price: 1200,
//       rating: 4.8,
//       image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
//       status: "ongoing"
//     },
//     {
//       id: 2,
//       title: "Tokyo Tech Conference Journey",
//       type: "Business",
//       location: "Tokyo, Japan",
//       price: 2100,
//       rating: 4.9,
//       image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
//       status: "upcoming"
//     },
//     {
//       id: 3,
//       title: "Hackathon in Berlin - Blockchain Frenzy",
//       type: "Adventure",
//       location: "Berlin, Germany",
//       price: 850,
//       rating: 4.7,
//       image: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
//       status: "completed"
//     },
//     {
//       id: 4,
//       title: "NYC Museum Marathon",
//       type: "Cultural",
//       location: "New York, USA",
//       price: 1350,
//       rating: 4.8,
//       image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f",
//       status: "completed"
//     }
//   ];

//   const TripCard = ({ trip }) => (
//     <div className="col-12 col-md-4 mb-4">
//       <div className="trip-card position-relative animate__animated animate__fadeInUp">
//         <span className={`trip-tag ${trip.type.toLowerCase()}`}>{trip.type}</span>
//         <img
//           src={trip.image}
//           alt={trip.title}
//           className="trip-image"
//         />
//         <div className="card-body">
//           <div className="fw-bold">{trip.title}</div>
//           <div className="d-flex align-items-center">
//             <span className="rating-star">
//               <i className="bi bi-star-fill"></i> {trip.rating}
//             </span>
//             <span className="ms-2 price">${trip.price.toLocaleString()}</span>
//           </div>
//           <small className="location">{trip.location}</small>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="dashboard-container">
//       {/* Navbar with scroll effect */}
//       <nav className={`navbar navbar-expand-lg ${isScrolled ? 'navbar-scrolled' : ''}`}>
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             <i className="bi bi-globe"></i> GlobalTrotter
//           </a>
//           <div className="ms-auto d-flex align-items-center">
//             <div className="dropdown">
//               <img
//                 src="https://randomuser.me/api/portraits/men/32.jpg"
//                 alt="Profile"
//                 className="profile-img dropdown-toggle"
//                 data-bs-toggle="dropdown"
//               />
//               <ul className="dropdown-menu dropdown-menu-end">
//                 <li>
//                   <span className="dropdown-item-text">
//                     <b>User:</b> Alex
//                   </span>
//                 </li>
//                 <li>
//                   <span className="dropdown-item-text">
//                     <b>Email:</b> alex@email.com
//                   </span>
//                 </li>
//                 <li><hr className="dropdown-divider" /></li>
//                 <li>
//                   <button className="dropdown-item" onClick={() => navigate("/itinerary")}>
//                     <i className="bi bi-map me-2"></i>Itinerary Builder
//                   </button>
//                 </li>
//                 <li>
//                   <button className="dropdown-item" onClick={logout}>
//                     <i className="bi bi-box-arrow-right me-2"></i>Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="container mt-3">
//         {/* Welcome Banner & Stats */}
//         <div className="welcome-banner animate__animated animate__fadeIn">
//           <h1>Welcome back, <span className="username">Alex</span>!</h1>
//           <div className="stats-container">
//             {[
//               { icon: "bi-geo-alt", value: "12 Trips" },
//               { icon: "bi-globe2", value: "8 Countries" },
//               { icon: "bi-cash", value: "$5,240 Spent" },
//               { icon: "bi-graph-up-arrow", value: "$1,830 Saved" }
//             ].map((stat, index) => (
//               <div key={index} className="stats-box animate__animated animate__fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
//                 <i className={`bi ${stat.icon}`}></i> {stat.value}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Trip Filter Tabs */}
//         <div className="trip-tabs mb-4">
//           <button
//             className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Trips
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
//             onClick={() => setActiveTab('ongoing')}
//           >
//             Ongoing
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
//             onClick={() => setActiveTab('upcoming')}
//           >
//             Upcoming
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
//             onClick={() => setActiveTab('completed')}
//           >
//             Completed
//           </button>
//         </div>

//         {/* Search and Filter */}
//         <div className="row mb-4 gx-2">
//           <div className="col-12 col-md-6 mb-2 mb-md-0">
//             <div className="search-bar">
//               <i className="bi bi-search"></i>
//               <input
//                 type="text"
//                 placeholder="Search destinations, trips..."
//                 className="search-input"
//               />
//             </div>
//           </div>
//           <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
//             <button className="filter-btn">
//               <i className="bi bi-columns-gap"></i> Group
//             </button>
//             <button className="filter-btn">
//               <i className="bi bi-filter"></i> Filter
//             </button>
//             <button className="filter-btn">
//               <i className="bi bi-sort-alpha-down"></i> Sort
//             </button>
//           </div>
//         </div>

//         {/* Trips */}
//         <div className="row">
//           {(activeTab === 'all' || activeTab === 'ongoing') && (
//             <>
//               <div className="section-title">
//                 <i className="bi bi-geo-alt me-2"></i>Ongoing Trips
//               </div>
//               {trips.filter(t => t.status === 'ongoing').length === 0 ? (
//                 <div className="col-12 text-muted px-4 pb-2">
//                   <em>No ongoing trips found.</em>
//                 </div>
//               ) : (
//                 trips.filter(t => t.status === 'ongoing').map(trip => (
//                   <TripCard key={trip.id} trip={trip} />
//                 ))
//               )}
//             </>
//           )}

//           {(activeTab === 'all' || activeTab === 'upcoming') && (
//             <>
//               <div className="section-title">
//                 <i className="bi bi-calendar-event me-2"></i>Upcoming Trips
//               </div>
//               {trips.filter(t => t.status === 'upcoming').length === 0 ? (
//                 <div className="col-12 text-muted px-4 pb-2">
//                   <em>No upcoming trips found.</em>
//                 </div>
//               ) : (
//                 trips.filter(t => t.status === 'upcoming').map(trip => (
//                   <TripCard key={trip.id} trip={trip} />
//                 ))
//               )}
//             </>
//           )}

//           {(activeTab === 'all' || activeTab === 'completed') && (
//             <>
//               <div className="section-title">
//                 <i className="bi bi-check2-circle me-2"></i>Completed Trips
//               </div>
//               {trips.filter(t => t.status === 'completed').length === 0 ? (
//                 <div className="col-12 text-muted px-4 pb-2">
//                   <em>No completed trips found.</em>
//                 </div>
//               ) : (
//                 trips.filter(t => t.status === 'completed').map(trip => (
//                   <TripCard key={trip.id} trip={trip} />
//                 ))
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Floating Plan Trip Button */}
//       <button
//         className="fab-btn animate__animated animate__pulse animate__infinite"
//         onClick={planTrip}
//       >
//         <i className="bi bi-plus-lg"></i> Plan Trip
//       </button>
//     </div>
//   );
// };

// export default TripListScreen;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/triplist.css";

const user = {
  name: "Demo Admin",
  email: "adminn@gmail.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const profileCircleColor = "#191a2e"; // matches the image

const TripListScreen = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const planTrip = () => {
    navigate("/createtrip");
  };

  // Trip data for easier management
  const trips = [
    {
      id: 1,
      title: "Exploring Paris: Food, Art & Adventure",
      type: "Cultural",
      location: "Paris, France",
      price: 1200,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      status: "ongoing",
    },
    {
      id: 2,
      title: "Tokyo Tech Conference Journey",
      type: "Business",
      location: "Tokyo, Japan",
      price: 2100,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Hackathon in Berlin - Blockchain Frenzy",
      type: "Adventure",
      location: "Berlin, Germany",
      price: 850,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
      status: "completed",
    },
    {
      id: 4,
      title: "NYC Museum Marathon",
      type: "Cultural",
      location: "New York, USA",
      price: 1350,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f",
      status: "completed",
    },
  ];

  const TripCard = ({ trip }) => (
    <div className="col-12 col-md-4 mb-4">
      <div className="trip-card position-relative animate__animated animate__fadeInUp">
        <span className={`trip-tag ${trip.type.toLowerCase()}`}>{trip.type}</span>
        <img src={trip.image} alt={trip.title} className="trip-image" />
        <div className="card-body">
          <div className="fw-bold">{trip.title}</div>
          <div className="d-flex align-items-center">
            <span className="rating-star">
              <i className="bi bi-star-fill"></i> {trip.rating}
            </span>
            <span className="ms-2 price">${trip.price.toLocaleString()}</span>
          </div>
          <small className="location">{trip.location}</small>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Navbar with scroll effect */}
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

      {/* Main Content */}
      <div className="container mt-3">
        {/* Welcome Banner & Stats */}
        <div className="welcome-banner animate__animated animate__fadeIn">
          <h1>
            Welcome back, <span className="username">Alex</span>!
          </h1>
          <div className="stats-container">
            {[
              { icon: "bi-geo-alt", value: "12 Trips" },
              { icon: "bi-globe2", value: "8 Countries" },
              { icon: "bi-cash", value: "$5,240 Spent" },
              { icon: "bi-graph-up-arrow", value: "$1,830 Saved" },
            ].map((stat, index) => (
              <div
                key={index}
                className="stats-box animate__animated animate__fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <i className={`bi ${stat.icon}`}></i> {stat.value}
              </div>
            ))}
          </div>
        </div>

        {/* Trip Filter Tabs */}
        <div className="trip-tabs mb-4">
          {["all", "ongoing", "upcoming", "completed"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Trips
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="row mb-4 gx-2">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <div className="search-bar">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search destinations, trips..."
                className="search-input"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <button className="filter-btn">
              <i className="bi bi-columns-gap"></i> Group
            </button>
            <button className="filter-btn">
              <i className="bi bi-filter"></i> Filter
            </button>
            <button className="filter-btn">
              <i className="bi bi-sort-alpha-down"></i> Sort
            </button>
          </div>
        </div>

        {/* Trips */}
        <div className="row">
          {(activeTab === "all" || activeTab === "ongoing") && (
            <>
              <div className="section-title">
                <i className="bi bi-geo-alt me-2"></i>Ongoing Trips
              </div>
              {trips.filter((t) => t.status === "ongoing").length === 0 ? (
                <div className="col-12 text-muted px-4 pb-2">
                  <em>No ongoing trips found.</em>
                </div>
              ) : (
                trips
                  .filter((t) => t.status === "ongoing")
                  .map((trip) => <TripCard key={trip.id} trip={trip} />)
              )}
            </>
          )}

          {(activeTab === "all" || activeTab === "upcoming") && (
            <>
              <div className="section-title">
                <i className="bi bi-calendar-event me-2"></i>Upcoming Trips
              </div>
              {trips.filter((t) => t.status === "upcoming").length === 0 ? (
                <div className="col-12 text-muted px-4 pb-2">
                  <em>No upcoming trips found.</em>
                </div>
              ) : (
                trips
                  .filter((t) => t.status === "upcoming")
                  .map((trip) => <TripCard key={trip.id} trip={trip} />)
              )}
            </>
          )}

          {(activeTab === "all" || activeTab === "completed") && (
            <>
              <div className="section-title">
                <i className="bi bi-check2-circle me-2"></i>Completed Trips
              </div>
              {trips.filter((t) => t.status === "completed").length === 0 ? (
                <div className="col-12 text-muted px-4 pb-2">
                  <em>No completed trips found.</em>
                </div>
              ) : (
                trips
                  .filter((t) => t.status === "completed")
                  .map((trip) => <TripCard key={trip.id} trip={trip} />)
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Plan Trip Button */}
      <button
        className="fab-btn animate__animated animate__pulse animate__infinite"
        onClick={planTrip}
      >
        <i className="bi bi-plus-lg"></i> Plan Trip
      </button>
    </div>
  );
};

export default TripListScreen;
