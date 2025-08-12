// // // import React, { useState, useEffect, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "bootstrap/dist/css/bootstrap.min.css";
// // // import "bootstrap-icons/font/bootstrap-icons.css";
// // // import "../styles/main.css";

// // // const profileCircleColor = "#191a2e"; // matches the image style

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
// // //   const [user, setUser] = useState(null);
// // //   const [tripStats, setTripStats] = useState({
// // //     upcoming: 0,
// // //     completed: 0,
// // //     total: 0,
// // //   });
// // //   const [statsLoading, setStatsLoading] = useState(true);
// // //   const [dropdownOpen, setDropdownOpen] = useState(false);
// // //   const dropdownRef = useRef(null);

// // //   // Detect click outside for dropdown
// // //   useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// // //         setDropdownOpen(false);
// // //       }
// // //     }
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => document.removeEventListener("mousedown", handleClickOutside);
// // //   }, []);

// // //   useEffect(() => {
// // //     const userData = localStorage.getItem("user");
// // //     if (userData) {
// // //       setUser(JSON.parse(userData));
// // //       fetchTripStats();
// // //     } else {
// // //       // For public access
// // //       setUser({ name: "Guest", email: "guest@example.com" });
// // //       fetchTripStats();
// // //     }
// // //   }, []);

// // //   const fetchTripStats = async () => {
// // //     try {
// // //       const response = await fetch("http://localhost:5000/apis/trips/", {
// // //         method: "GET",
// // //         headers: { "Content-Type": "application/json" },
// // //       });
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         const allTrips = data.trips || [];
// // //         const today = new Date();
// // //         today.setHours(0, 0, 0, 0);
// // //         const upcomingTrips = allTrips.filter((trip) => new Date(trip.startDate) >= today);
// // //         const completedTrips = allTrips.filter((trip) => new Date(trip.endDate) < today);
// // //         setTripStats({
// // //           upcoming: upcomingTrips.length,
// // //           completed: completedTrips.length,
// // //           total: allTrips.length,
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching trip stats:", error);
// // //     } finally {
// // //       setStatsLoading(false);
// // //     }
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem("user");
// // //     localStorage.removeItem("isAuthenticated");
// // //     navigate("/login");
// // //   };

// // //   // While user is still null, show loader
// // //   if (!user) {
// // //     return (
// // //       <div className="d-flex justify-content-center align-items-center vh-100">
// // //         <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="dashboard-bg min-vh-100 d-flex flex-column">
// // //       {/* Navbar */}
// // //       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
// // //         <div className="container-fluid">
// // //           <a className="navbar-brand d-flex align-items-center" href="#">
// // //             <i className="bi bi-globe me-2"></i> GlobalTrotter
// // //           </a>
// // //           <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
// // //             <div
// // //               className="profile-img-wrapper"
// // //               onClick={() => setDropdownOpen((open) => !open)}
// // //               tabIndex={0}
// // //               style={{ cursor: "pointer" }}
// // //             >
// // //               <div
// // //                 className="profile-circle"
// // //                 style={{
// // //                   background: profileCircleColor,
// // //                   color: "#fff",
// // //                   display: "flex",
// // //                   alignItems: "center",
// // //                   justifyContent: "center",
// // //                   borderRadius: "50%",
// // //                   width: 48,
// // //                   height: 48,
// // //                   fontWeight: 700,
// // //                   fontSize: "1.9rem",
// // //                   border: "3px solid #fff",
// // //                   boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
// // //                   overflow: "hidden",
// // //                 }}
// // //               >
// // //                 {user?.avatar ? (
// // //                   <img
// // //                     src={user.avatar}
// // //                     alt={user?.name || user?.firstName || "User"}
// // //                     className="profile-img"
// // //                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
// // //                   />
// // //                 ) : (
// // //                   (user?.name?.[0] || user?.firstName?.[0] || "A").toUpperCase()
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {dropdownOpen && (
// // //               <div className="custom-profile-dropdown animate__animated animate__fadeIn">
// // //                 <div className="profile-menu-header d-flex flex-column align-items-center">
// // //                   <div
// // //                     className="profile-circle mb-2"
// // //                     style={{
// // //                       background: profileCircleColor,
// // //                       width: 60, height: 60,
// // //                       display: "flex", alignItems: "center", justifyContent: "center",
// // //                       borderRadius: "50%",
// // //                       overflow: "hidden",
// // //                     }}
// // //                   >
// // //                     {user?.avatar ? (
// // //                       <img
// // //                         src={user.avatar}
// // //                         alt={user?.name || user?.firstName || "User"}
// // //                         style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
// // //                       />
// // //                     ) : (
// // //                       (user?.name?.[0] || user?.firstName?.[0] || "A").toUpperCase()
// // //                     )}
// // //                   </div>
// // //                   <div className="fw-bold fs-6 mb-1" style={{ color: "#23243b" }}>
// // //                     {user?.name || user?.firstName || user?.email}
// // //                   </div>
// // //                   <div className="text-muted fs-7" style={{ fontSize: "0.93em" }}>
// // //                     {user?.email}
// // //                   </div>
// // //                 </div>
// // //                 <div className="mt-3 pb-1 text-center">
// // //                   <button
// // //                     className="btn btn-link profile-view-btn"
// // //                     onClick={() => {
// // //                       setDropdownOpen(false);
// // //                       navigate("/profile");
// // //                     }}
// // //                   >
// // //                     View Profile
// // //                   </button>
// // //                 </div>
// // //                 <div
// // //                   className="nav-signout-link"
// // //                   style={{ marginLeft: 22, fontWeight: 550, fontSize: "1rem" }}
// // //                 >
// // //                   <a
// // //                     className="text-decoration-none text-muted"
// // //                     style={{ cursor: "pointer" }}
// // //                     onClick={logout}
// // //                   >
// // //                     Sign out
// // //                   </a>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </nav>

// // //       {/* Main Dashboard */}
// // //       <div className="container my-5 flex-grow-1">
// // //         <div className="text-center mb-5">
// // //           <h2 className="fw-bold text-dark">Welcome to TripPlanner Dashboard</h2>
// // //           <p className="text-muted fs-5">Your travel planning journey starts here</p>
// // //         </div>

// // //         {/* Stats */}
// // //         <div className="row g-4 mb-5 justify-content-center">
// // //           <div className="col-md-3">
// // //             <div className="card shadow-sm stat-card text-center border-0 rounded-3 bg-light">
// // //               <div className="card-body">
// // //                 <i className="bi bi-calendar-event fs-1 text-primary"></i>
// // //                 <h4 className="fw-bold mt-3">{statsLoading ? "..." : tripStats.upcoming}</h4>
// // //                 <p className="text-muted mb-0">Upcoming Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-3">
// // //             <div className="card shadow-sm stat-card text-center border-0 rounded-3 bg-light">
// // //               <div className="card-body">
// // //                 <i className="bi bi-check-circle fs-1 text-success"></i>
// // //                 <h4 className="fw-bold mt-3">{statsLoading ? "..." : tripStats.completed}</h4>
// // //                 <p className="text-muted mb-0">Completed Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-3">
// // //             <div className="card shadow-sm stat-card text-center border-0 rounded-3 bg-light">
// // //               <div className="card-body">
// // //                 <i className="bi bi-geo-alt fs-1 text-secondary"></i>
// // //                 <h4 className="fw-bold mt-3">{statsLoading ? "..." : tripStats.total}</h4>
// // //                 <p className="text-muted mb-0">Total Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Quick Actions */}
// // //         <div className="row g-4">
// // //           <div className="col-md-4">
// // //             <div className="card action-card shadow-sm border-0 h-100">
// // //               <div className="card-body text-center">
// // //                 <i className="bi bi-plus-circle fs-1 text-primary"></i>
// // //                 <h5 className="fw-bold mt-3">Plan a Trip</h5>
// // //                 <p className="text-muted">Start planning your next adventure</p>
// // //                 <a href="/createtrip" className="btn btn-primary">Create New Trip</a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-4">
// // //             <div className="card action-card shadow-sm border-0 h-100">
// // //               <div className="card-body text-center">
// // //                 <i className="bi bi-journal-text fs-1 text-warning"></i>
// // //                 <h5 className="fw-bold mt-3">My Trips</h5>
// // //                 <p className="text-muted">View your saved trips and itineraries</p>
// // //                 <a href="/trips" className="btn btn-warning text-white">View Trips</a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-4">
// // //             <div className="card action-card shadow-sm border-0 h-100">
// // //               <div className="card-body text-center">
// // //                 <i className="bi bi-binoculars fs-1 text-success"></i>
// // //                 <h5 className="fw-bold mt-3">Explore</h5>
// // //                 <p className="text-muted">Discover new destinations and experiences</p>
// // //                 <a href="/explore" className="btn btn-success">Explore</a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div> 
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;


// // // import React, { useState, useEffect, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "bootstrap/dist/css/bootstrap.min.css";
// // // import "bootstrap-icons/font/bootstrap-icons.css";
// // // import "../styles/main.css";

// // // const profileCircleColor = "#6366f1"; // Modern indigo color

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
// // //   const [user, setUser] = useState(null);
// // //   const [tripStats, setTripStats] = useState({
// // //     upcoming: 0,
// // //     completed: 0,
// // //     total: 0,
// // //     totalBudget: 0,
// // //     savedDestinations: 0
// // //   });
// // //   const [recentTrips, setRecentTrips] = useState([]);
// // //   const [popularDestinations, setPopularDestinations] = useState([
// // //     { name: "Paris", country: "France", image: "🗼", visits: 1247 },
// // //     { name: "Tokyo", country: "Japan", image: "🏯", visits: 1156 },
// // //     { name: "New York", country: "USA", image: "🏙️", visits: 989 },
// // //     { name: "Bali", country: "Indonesia", image: "🌴", visits: 876 }
// // //   ]);
// // //   const [statsLoading, setStatsLoading] = useState(true);
// // //   const [dropdownOpen, setDropdownOpen] = useState(false);
// // //   const dropdownRef = useRef(null);

// // //   // Detect click outside for dropdown
// // //   useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// // //         setDropdownOpen(false);
// // //       }
// // //     }
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => document.removeEventListener("mousedown", handleClickOutside);
// // //   }, []);

// // //   useEffect(() => {
// // //     const userData = localStorage.getItem("user");
// // //     if (userData) {
// // //       setUser(JSON.parse(userData));
// // //       fetchTripStats();
// // //       fetchRecentTrips();
// // //     } else {
// // //       // For public access
// // //       setUser({ name: "Guest Explorer", email: "guest@globetrotter.com" });
// // //       fetchTripStats();
// // //       fetchRecentTrips();
// // //     }
// // //   }, []);

// // //   const fetchTripStats = async () => {
// // //     try {
// // //       const response = await fetch("http://localhost:5000/apis/trips/", {
// // //         method: "GET",
// // //         headers: { "Content-Type": "application/json" },
// // //       });
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         const allTrips = data.trips || [];
// // //         const today = new Date();
// // //         today.setHours(0, 0, 0, 0);
// // //         const upcomingTrips = allTrips.filter((trip) => new Date(trip.startDate) >= today);
// // //         const completedTrips = allTrips.filter((trip) => new Date(trip.endDate) < today);
// // //         const totalBudget = allTrips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
        
// // //         setTripStats({
// // //           upcoming: upcomingTrips.length,
// // //           completed: completedTrips.length,
// // //           total: allTrips.length,
// // //           totalBudget,
// // //           savedDestinations: 12 // Mock data
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching trip stats:", error);
// // //       // Mock data for demo
// // //       setTripStats({
// // //         upcoming: 3,
// // //         completed: 8,
// // //         total: 11,
// // //         totalBudget: 15750,
// // //         savedDestinations: 12
// // //       });
// // //     } finally {
// // //       setStatsLoading(false);
// // //     }
// // //   };

// // //   const fetchRecentTrips = async () => {
// // //     try {
// // //       // Mock recent trips data
// // //       setRecentTrips([
// // //         { id: 1, name: "European Adventure", destinations: 4, startDate: "2024-09-15", budget: 3500, image: "🇪🇺" },
// // //         { id: 2, name: "Tokyo Explorer", destinations: 2, startDate: "2024-10-22", budget: 2800, image: "🇯🇵" },
// // //         { id: 3, name: "Bali Retreat", destinations: 3, startDate: "2024-11-05", budget: 1900, image: "🇮🇩" }
// // //       ]);
// // //     } catch (error) {
// // //       console.error("Error fetching recent trips:", error);
// // //     }
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem("user");
// // //     localStorage.removeItem("isAuthenticated");
// // //     navigate("/login");
// // //   };

// // //   // While user is still null, show loader
// // //   if (!user) {
// // //     return (
// // //       <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
// // //         <div className="text-center">
// // //           <div className="spinner-border text-light mb-3" style={{ width: "3rem", height: "3rem" }} />
// // //           <h5 className="text-light">Loading your travel dashboard...</h5>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
// // //       {/* Modern Navbar */}
// // //       <nav className="navbar navbar-expand-lg shadow-sm" style={{ 
// // //         background: "rgba(255, 255, 255, 0.95)", 
// // //         backdropFilter: "blur(10px)",
// // //         borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
// // //       }}>
// // //         <div className="container-fluid">
// // //           <a className="navbar-brand d-flex align-items-center fw-bold" href="#" style={{ color: "#6366f1" }}>
// // //             <i className="bi bi-globe2 me-2 fs-4"></i> 
// // //             <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>GlobeTrotter</span>
// // //           </a>
          
// // //           {/* Navigation Links */}
// // //           <div className="d-none d-lg-flex me-auto ms-4">
// // //             <a href="/dashboard" className="nav-link me-4 fw-semibold text-dark">Dashboard</a>
// // //             <a href="/trips" className="nav-link me-4 fw-semibold text-muted">My Trips</a>
// // //             <a href="/explore" className="nav-link me-4 fw-semibold text-muted">Explore</a>
// // //             <a href="/budget" className="nav-link fw-semibold text-muted">Budget Tracker</a>
// // //           </div>

// // //           <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
// // //             {/* Notification Bell */}
// // //             <button className="btn btn-link position-relative me-3" style={{ color: "#6366f1" }}>
// // //               <i className="bi bi-bell fs-5"></i>
// // //               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
// // //                 3
// // //               </span>
// // //             </button>

// // //             {/* Profile Dropdown */}
// // //             <div
// // //               className="profile-img-wrapper"
// // //               onClick={() => setDropdownOpen((open) => !open)}
// // //               tabIndex={0}
// // //               style={{ cursor: "pointer" }}
// // //             >
// // //               <div
// // //                 className="profile-circle"
// // //                 style={{
// // //                   background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
// // //                   color: "#fff",
// // //                   display: "flex",
// // //                   alignItems: "center",
// // //                   justifyContent: "center",
// // //                   borderRadius: "50%",
// // //                   width: 48,
// // //                   height: 48,
// // //                   fontWeight: 700,
// // //                   fontSize: "1.2rem",
// // //                   border: "3px solid rgba(255, 255, 255, 0.3)",
// // //                   boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
// // //                   overflow: "hidden",
// // //                   transition: "all 0.3s ease"
// // //                 }}
// // //                 onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
// // //                 onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
// // //               >
// // //                 {user?.avatar ? (
// // //                   <img
// // //                     src={user.avatar}
// // //                     alt={user?.name || user?.firstName || "User"}
// // //                     className="profile-img"
// // //                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
// // //                   />
// // //                 ) : (
// // //                   (user?.name?.[0] || user?.firstName?.[0] || "G").toUpperCase()
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {dropdownOpen && (
// // //               <div className="custom-profile-dropdown animate__animated animate__fadeIn" style={{
// // //                 position: "absolute",
// // //                 top: "100%",
// // //                 right: 0,
// // //                 background: "rgba(255, 255, 255, 0.95)",
// // //                 backdropFilter: "blur(10px)",
// // //                 borderRadius: "12px",
// // //                 padding: "1.5rem",
// // //                 minWidth: "280px",
// // //                 boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
// // //                 border: "1px solid rgba(255, 255, 255, 0.2)",
// // //                 zIndex: 1000
// // //               }}>
// // //                 <div className="profile-menu-header d-flex flex-column align-items-center">
// // //                   <div
// // //                     className="profile-circle mb-3"
// // //                     style={{
// // //                       background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
// // //                       width: 70, height: 70,
// // //                       display: "flex", alignItems: "center", justifyContent: "center",
// // //                       borderRadius: "50%",
// // //                       overflow: "hidden",
// // //                       fontSize: "1.5rem",
// // //                       fontWeight: "700",
// // //                       color: "#fff"
// // //                     }}
// // //                   >
// // //                     {user?.avatar ? (
// // //                       <img
// // //                         src={user.avatar}
// // //                         alt={user?.name || user?.firstName || "User"}
// // //                         style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
// // //                       />
// // //                     ) : (
// // //                       (user?.name?.[0] || user?.firstName?.[0] || "G").toUpperCase()
// // //                     )}
// // //                   </div>
// // //                   <div className="fw-bold fs-5 mb-1" style={{ color: "#1f2937" }}>
// // //                     {user?.name || user?.firstName || "Guest Explorer"}
// // //                   </div>
// // //                   <div className="text-muted" style={{ fontSize: "0.9em" }}>
// // //                     {user?.email}
// // //                   </div>
// // //                 </div>
// // //                 <hr style={{ margin: "1.5rem 0", opacity: 0.1 }} />
// // //                 <div className="d-flex flex-column gap-2">
// // //                   <button
// // //                     className="btn btn-light d-flex align-items-center justify-content-start"
// // //                     onClick={() => {
// // //                       setDropdownOpen(false);
// // //                       navigate("/profile");
// // //                     }}
// // //                     style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
// // //                   >
// // //                     <i className="bi bi-person me-3"></i> View Profile
// // //                   </button>
// // //                   <button
// // //                     className="btn btn-light d-flex align-items-center justify-content-start"
// // //                     onClick={() => {
// // //                       setDropdownOpen(false);
// // //                       navigate("/settings");
// // //                     }}
// // //                     style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
// // //                   >
// // //                     <i className="bi bi-gear me-3"></i> Settings
// // //                   </button>
// // //                   <button
// // //                     className="btn btn-outline-danger d-flex align-items-center justify-content-start"
// // //                     onClick={logout}
// // //                     style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
// // //                   >
// // //                     <i className="bi bi-box-arrow-right me-3"></i> Sign Out
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </nav>

// // //       {/* Hero Section */}
// // //       <div className="container-fluid py-5" style={{ 
// // //         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// // //         color: "white"
// // //       }}>
// // //         <div className="container">
// // //           <div className="row align-items-center">
// // //             <div className="col-lg-8">
// // //               <h1 className="display-4 fw-bold mb-3">
// // //                 Welcome back, {user?.name || user?.firstName || "Explorer"}! 🌍
// // //               </h1>
// // //               <p className="lead mb-4">
// // //                 Your personalized travel dashboard is ready to help you plan your next adventure. 
// // //                 Discover new destinations, track your journeys, and create unforgettable memories.
// // //               </p>
// // //               <div className="d-flex gap-3">
// // //                 <button 
// // //                   className="btn btn-light btn-lg px-4"
// // //                   onClick={() => navigate("/createtrip")}
// // //                   style={{ borderRadius: "12px", fontWeight: "600" }}
// // //                 >
// // //                   <i className="bi bi-plus-circle me-2"></i> Plan New Trip
// // //                 </button>
// // //                 <button 
// // //                   className="btn btn-outline-light btn-lg px-4"
// // //                   onClick={() => navigate("/explore")}
// // //                   style={{ borderRadius: "12px", fontWeight: "600" }}
// // //                 >
// // //                   <i className="bi bi-compass me-2"></i> Explore Destinations
// // //                 </button>
// // //               </div>
// // //             </div>
// // //             <div className="col-lg-4 text-center">
// // //               <div className="position-relative">
// // //                 <div style={{ fontSize: "8rem", opacity: 0.7 }}>✈️</div>
// // //                 <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
// // //                   <div className="bg-white text-primary rounded-circle p-3" style={{ 
// // //                     width: "80px", 
// // //                     height: "80px", 
// // //                     display: "flex", 
// // //                     alignItems: "center", 
// // //                     justifyContent: "center",
// // //                     boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
// // //                   }}>
// // //                     <i className="bi bi-geo-alt fs-1"></i>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Main Dashboard Content */}
// // //       <div className="container my-5">
// // //         {/* Enhanced Stats Cards */}
// // //         <div className="row g-4 mb-5">
// // //           <div className="col-lg-2 col-md-4 col-6">
// // //             <div className="card h-100 border-0 shadow-sm" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// // //               color: "white"
// // //             }}>
// // //               <div className="card-body text-center py-4">
// // //                 <i className="bi bi-calendar-event display-6 mb-3" style={{ opacity: 0.9 }}></i>
// // //                 <h3 className="fw-bold mb-1">{statsLoading ? "..." : tripStats.upcoming}</h3>
// // //                 <p className="mb-0 small">Upcoming Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-lg-2 col-md-4 col-6">
// // //             <div className="card h-100 border-0 shadow-sm" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
// // //               color: "white"
// // //             }}>
// // //               <div className="card-body text-center py-4">
// // //                 <i className="bi bi-check-circle display-6 mb-3" style={{ opacity: 0.9 }}></i>
// // //                 <h3 className="fw-bold mb-1">{statsLoading ? "..." : tripStats.completed}</h3>
// // //                 <p className="mb-0 small">Completed</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-lg-2 col-md-4 col-6">
// // //             <div className="card h-100 border-0 shadow-sm" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
// // //               color: "white"
// // //             }}>
// // //               <div className="card-body text-center py-4">
// // //                 <i className="bi bi-geo-alt display-6 mb-3" style={{ opacity: 0.9 }}></i>
// // //                 <h3 className="fw-bold mb-1">{statsLoading ? "..." : tripStats.total}</h3>
// // //                 <p className="mb-0 small">Total Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-lg-3 col-md-6">
// // //             <div className="card h-100 border-0 shadow-sm" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)",
// // //               color: "white"
// // //             }}>
// // //               <div className="card-body text-center py-4">
// // //                 <i className="bi bi-currency-dollar display-6 mb-3" style={{ opacity: 0.9 }}></i>
// // //                 <h3 className="fw-bold mb-1">${statsLoading ? "..." : tripStats.totalBudget.toLocaleString()}</h3>
// // //                 <p className="mb-0 small">Total Budget</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-lg-3 col-md-6">
// // //             <div className="card h-100 border-0 shadow-sm" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
// // //               color: "white"
// // //             }}>
// // //               <div className="card-body text-center py-4">
// // //                 <i className="bi bi-heart display-6 mb-3" style={{ opacity: 0.9 }}></i>
// // //                 <h3 className="fw-bold mb-1">{statsLoading ? "..." : tripStats.savedDestinations}</h3>
// // //                 <p className="mb-0 small">Saved Places</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Recent Trips and Popular Destinations */}
// // //         <div className="row g-4 mb-5">
// // //           {/* Recent Trips */}
// // //           <div className="col-lg-8">
// // //             <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
// // //               <div className="card-header bg-transparent border-0 py-4">
// // //                 <div className="d-flex justify-content-between align-items-center">
// // //                   <h5 className="fw-bold mb-0">
// // //                     <i className="bi bi-clock-history me-2 text-primary"></i>
// // //                     Recent Trips
// // //                   </h5>
// // //                   <a href="/trips" className="btn btn-sm btn-outline-primary" style={{ borderRadius: "8px" }}>
// // //                     View All <i className="bi bi-arrow-right ms-1"></i>
// // //                   </a>
// // //                 </div>
// // //               </div>
// // //               <div className="card-body pt-0">
// // //                 {recentTrips.length > 0 ? (
// // //                   <div className="row g-3">
// // //                     {recentTrips.map((trip) => (
// // //                       <div key={trip.id} className="col-md-6">
// // //                         <div className="card border-0 bg-light h-100" style={{ borderRadius: "12px" }}>
// // //                           <div className="card-body">
// // //                             <div className="d-flex align-items-start mb-3">
// // //                               <div className="me-3" style={{ fontSize: "2rem" }}>{trip.image}</div>
// // //                               <div className="flex-grow-1">
// // //                                 <h6 className="fw-bold mb-1">{trip.name}</h6>
// // //                                 <p className="text-muted small mb-2">
// // //                                   <i className="bi bi-calendar me-1"></i>
// // //                                   {new Date(trip.startDate).toLocaleDateString()}
// // //                                 </p>
// // //                                 <div className="d-flex justify-content-between align-items-center">
// // //                                   <span className="badge bg-primary rounded-pill">
// // //                                     {trip.destinations} destinations
// // //                                   </span>
// // //                                   <span className="text-success fw-semibold">${trip.budget}</span>
// // //                                 </div>
// // //                               </div>
// // //                             </div>
// // //                             <button className="btn btn-sm btn-primary w-100" style={{ borderRadius: "8px" }}>
// // //                               <i className="bi bi-eye me-1"></i> View Details
// // //                             </button>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 ) : (
// // //                   <div className="text-center py-5">
// // //                     <i className="bi bi-suitcase display-1 text-muted mb-3"></i>
// // //                     <h6 className="text-muted">No trips yet</h6>
// // //                     <p className="text-muted">Start planning your first adventure!</p>
// // //                     <button 
// // //                       className="btn btn-primary"
// // //                       onClick={() => navigate("/createtrip")}
// // //                       style={{ borderRadius: "8px" }}
// // //                     >
// // //                       Create Your First Trip
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Popular Destinations */}
// // //           <div className="col-lg-4">
// // //             <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
// // //               <div className="card-header bg-transparent border-0 py-4">
// // //                 <h5 className="fw-bold mb-0">
// // //                   <i className="bi bi-fire me-2 text-warning"></i>
// // //                   Trending Destinations
// // //                 </h5>
// // //               </div>
// // //               <div className="card-body pt-0">
// // //                 {popularDestinations.map((destination, index) => (
// // //                   <div key={index} className="d-flex align-items-center mb-3 p-2 rounded" style={{ background: "#f8f9fa" }}>
// // //                     <div className="me-3" style={{ fontSize: "1.5rem" }}>{destination.image}</div>
// // //                     <div className="flex-grow-1">
// // //                       <h6 className="fw-semibold mb-0">{destination.name}</h6>
// // //                       <small className="text-muted">{destination.country}</small>
// // //                     </div>
// // //                     <div className="text-end">
// // //                       <small className="text-success fw-semibold">{destination.visits}+ visits</small>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //                 <button className="btn btn-outline-primary w-100 mt-3" style={{ borderRadius: "8px" }}>
// // //                   <i className="bi bi-compass me-1"></i> Explore More
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Quick Actions - Enhanced */}
// // //         <div className="row g-4">
// // //           <div className="col-md-3">
// // //             <div className="card action-card border-0 shadow-sm h-100" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// // //               color: "white",
// // //               transition: "transform 0.3s ease"
// // //             }}
// // //             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
// // //             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
// // //               <div className="card-body text-center py-5">
// // //                 <i className="bi bi-plus-circle display-4 mb-4" style={{ opacity: 0.9 }}></i>
// // //                 <h5 className="fw-bold mb-3">Plan a New Trip</h5>
// // //                 <p className="mb-4 small">Start planning your next adventure with our intuitive trip builder</p>
// // //                 <button 
// // //                   className="btn btn-light btn-lg px-4"
// // //                   onClick={() => navigate("/createtrip")}
// // //                   style={{ borderRadius: "12px", fontWeight: "600" }}
// // //                 >
// // //                   Create Trip
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="col-md-3">
// // //             <div className="card action-card border-0 shadow-sm h-100" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
// // //               color: "white",
// // //               transition: "transform 0.3s ease"
// // //             }}
// // //             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
// // //             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
// // //               <div className="card-body text-center py-5">
// // //                 <i className="bi bi-journal-text display-4 mb-4" style={{ opacity: 0.9 }}></i>
// // //                 <h5 className="fw-bold mb-3">My Itineraries</h5>
// // //                 <p className="mb-4 small">View, edit and manage all your saved trips and itineraries</p>
// // //                 <button 
// // //                   className="btn btn-light btn-lg px-4"
// // //                   onClick={() => navigate("/trips")}
// // //                   style={{ borderRadius: "12px", fontWeight: "600" }}
// // //                 >
// // //                   View Trips
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="col-md-3">
// // //             <div className="card action-card border-0 shadow-sm h-100" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
// // //               color: "white",
// // //               transition: "transform 0.3s ease"
// // //             }}
// // //             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
// // //             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
// // //               <div className="card-body text-center py-5">
// // //                 <i className="bi bi-binoculars display-4 mb-4" style={{ opacity: 0.9 }}></i>
// // //                 <h5 className="fw-bold mb-3">Explore Places</h5>
// // //                 <p className="mb-4 small">Discover new destinations, activities and hidden gems worldwide</p>
// // //                 <button 
// // //                   className="btn btn-light btn-lg px-4"
// // //                   onClick={() => navigate("/explore")}
// // //                   style={{ borderRadius: "12px", fontWeight: "600" }}
// // //                 >
// // //                   Explore
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="col-md-3">
// // //             <div className="card action-card border-0 shadow-sm h-100" style={{ 
// // //               borderRadius: "16px",
// // //               background: "linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)",
// // //               color: "white",
// // //               transition: "transform 0.3s ease"
// // //             }}
// // //             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
// // //             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
// // //               <div className="card-body text-center py-5">
// // //                 <i className="bi bi-calculator display-4 mb-4" style={{ opacity: 0.9 }}></i>
// // //                 <h5 className="fw-bold mb-3">Budget Tracker</h5>
// // //                 <p className="mb-4 small">Track expenses and manage your travel budget efficiently</p>
// // //                 <button 
// // //                   className="btn btn-light btn-lg px-4"
// // //                   onClick={() => navigate("/budget")}
// // //                   style={{ borderRadius: "12px", fontWeight: "600" }}
// // //                 >
// // //                   Track Budget
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Footer */}
// // //       <footer className="mt-5 py-4" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" }}>
// // //         <div className="container">
// // //           <div className="row">
// // //             <div className="col-md-6">
// // //               <div className="d-flex align-items-center">
// // //                 <i className="bi bi-globe2 me-2 text-primary fs-4"></i>
// // //                 <span className="fw-bold text-primary fs-5">GlobeTrotter</span>
// // //               </div>
// // //               <p className="text-muted mt-2 mb-0">Empowering personalized travel planning for adventurers worldwide.</p>
// // //             </div>
// // //             <div className="col-md-6 text-md-end">
// // //               <div className="d-flex justify-content-md-end gap-3 mt-3 mt-md-0">
// // //                 <a href="#" className="text-muted"><i className="bi bi-facebook fs-5"></i></a>
// // //                 <a href="#" className="text-muted"><i className="bi bi-twitter fs-5"></i></a>
// // //                 <a href="#" className="text-muted"><i className="bi bi-instagram fs-5"></i></a>
// // //                 <a href="#" className="text-muted"><i className="bi bi-linkedin fs-5"></i></a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </footer>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;


// // // import React, { useState, useEffect, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "bootstrap/dist/css/bootstrap.min.css";
// // // import "bootstrap-icons/font/bootstrap-icons.css";
// // // import "../styles/main.css";
// // // import chatbot from "./chatbot"

// // // const profileCircleColor = "#191a2e"; // matches the image style

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
// // //   const [user, setUser] = useState(null);
// // //   const [tripStats, setTripStats] = useState({
// // //     upcoming: 0,
// // //     completed: 0,
// // //     total: 0,
// // //   });
// // //   const [statsLoading, setStatsLoading] = useState(true);
// // //   const [dropdownOpen, setDropdownOpen] = useState(false);
// // //   const dropdownRef = useRef(null);

// // //   // Detect click outside for dropdown
// // //   useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// // //         setDropdownOpen(false);
// // //       }
// // //     }
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => document.removeEventListener("mousedown", handleClickOutside);
// // //   }, []);

// // //   useEffect(() => {
// // //     const userData = localStorage.getItem("user");
// // //     if (userData) {
// // //       setUser(JSON.parse(userData));
// // //       fetchTripStats();
// // //     } else {
// // //       // Public access fallback
// // //       setUser({ name: "Guest", email: "guest@example.com" });
// // //       fetchTripStats();
// // //     }
// // //   }, []);

// // //   const fetchTripStats = async () => {
// // //     try {
// // //       const response = await fetch("http://localhost:5000/apis/trips/", {
// // //         method: "GET",
// // //         headers: { "Content-Type": "application/json" },
// // //       });
// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         const allTrips = data.trips || [];
// // //         const today = new Date();
// // //         today.setHours(0, 0, 0, 0);
// // //         const upcomingTrips = allTrips.filter((trip) => new Date(trip.startDate) >= today);
// // //         const completedTrips = allTrips.filter((trip) => new Date(trip.endDate) < today);
// // //         setTripStats({
// // //           upcoming: upcomingTrips.length,
// // //           completed: completedTrips.length,
// // //           total: allTrips.length,
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching trip stats:", error);
// // //     } finally {
// // //       setStatsLoading(false);
// // //     }
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem("user");
// // //     localStorage.removeItem("isAuthenticated");
// // //     navigate("/login");
// // //   };

// // //   // Loader while fetching user
// // //   if (!user) {
// // //     return (
// // //       <div className="d-flex justify-content-center align-items-center vh-100">
// // //         <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="dashboard-bg min-vh-100 d-flex flex-column">
// // //       {/* Navbar */}
// // //       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
// // //         <div className="container-fluid">
// // //           <a className="navbar-brand d-flex align-items-center" href="#">
// // //             <i className="bi bi-globe me-2"></i> GlobalTrotter
// // //           </a>
// // //           <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
// // //             <div
// // //               className="profile-img-wrapper"
// // //               onClick={() => setDropdownOpen((open) => !open)}
// // //               tabIndex={0}
// // //               style={{ cursor: "pointer" }}
// // //             >
// // //               <div
// // //                 className="profile-circle"
// // //                 style={{
// // //                   background: profileCircleColor,
// // //                   color: "#fff",
// // //                   display: "flex",
// // //                   alignItems: "center",
// // //                   justifyContent: "center",
// // //                   borderRadius: "50%",
// // //                   width: 48,
// // //                   height: 48,
// // //                   fontWeight: 700,
// // //                   fontSize: "1.9rem",
// // //                   border: "3px solid #fff",
// // //                   boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
// // //                   overflow: "hidden",
// // //                 }}
// // //               >
// // //                 {user?.avatar ? (
// // //                   <img
// // //                     src={user.avatar}
// // //                     alt={user?.name || user?.firstName || "User"}
// // //                     className="profile-img"
// // //                     style={{
// // //                       width: "100%",
// // //                       height: "100%",
// // //                       objectFit: "cover",
// // //                       borderRadius: "50%",
// // //                     }}
// // //                   />
// // //                 ) : (
// // //                   (user?.name?.[0] || user?.firstName?.[0] || "A").toUpperCase()
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {dropdownOpen && (
// // //               <div className="custom-profile-dropdown animate__animated animate__fadeIn">
// // //                 <div className="profile-menu-header d-flex flex-column align-items-center">
// // //                   <div
// // //                     className="profile-circle mb-2"
// // //                     style={{
// // //                       background: profileCircleColor,
// // //                       width: 60,
// // //                       height: 60,
// // //                       display: "flex",
// // //                       alignItems: "center",
// // //                       justifyContent: "center",
// // //                       borderRadius: "50%",
// // //                       overflow: "hidden",
// // //                     }}
// // //                   >
// // //                     {user?.avatar ? (
// // //                       <img
// // //                         src={user.avatar}
// // //                         alt={user?.name || user?.firstName || "User"}
// // //                         style={{
// // //                           width: "100%",
// // //                           height: "100%",
// // //                           objectFit: "cover",
// // //                           borderRadius: "50%",
// // //                         }}
// // //                       />
// // //                     ) : (
// // //                       (user?.name?.[0] || user?.firstName?.[0] || "A").toUpperCase()
// // //                     )}
// // //                   </div>
// // //                   <div className="fw-bold fs-6 mb-1" style={{ color: "#23243b" }}>
// // //                     {user?.name || user?.firstName || user?.email}
// // //                   </div>
// // //                   <div className="text-muted fs-7" style={{ fontSize: "0.93em" }}>
// // //                     {user?.email}
// // //                   </div>
// // //                 </div>
// // //                 <div className="mt-3 pb-1 text-center">
// // //                   <button
// // //                     className="btn btn-link profile-view-btn"
// // //                     onClick={() => {
// // //                       setDropdownOpen(false);
// // //                       navigate("/profile");
// // //                     }}
// // //                   >
// // //                     View Profile
// // //                   </button>
// // //                 </div>
// // //                 <div
// // //                   className="nav-signout-link"
// // //                   style={{ marginLeft: 22, fontWeight: 550, fontSize: "1rem" }}
// // //                 >
// // //                   <a
// // //                     className="text-decoration-none text-muted"
// // //                     style={{ cursor: "pointer" }}
// // //                     onClick={logout}
// // //                   >
// // //                     Sign out
// // //                   </a>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </nav>

// // //       {/* Main Dashboard */}
// // //       <div className="container my-5 flex-grow-1">
// // //         <div className="text-center mb-5">
// // //           <h2 className="fw-bold text-dark">Welcome to TripPlanner Dashboard</h2>
// // //           <p className="text-muted fs-5">Your travel planning journey starts here</p>
// // //         </div>

// // //         {/* Stats */}
// // //         <div className="row g-4 mb-5 justify-content-center">
// // //           <div className="col-md-3">
// // //             <div className="card shadow-sm stat-card text-center border-0 rounded-3 bg-light">
// // //               <div className="card-body">
// // //                 <i className="bi bi-calendar-event fs-1 text-primary"></i>
// // //                 <h4 className="fw-bold mt-3">
// // //                   {statsLoading ? "..." : tripStats.upcoming}
// // //                 </h4>
// // //                 <p className="text-muted mb-0">Upcoming Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-3">
// // //             <div className="card shadow-sm stat-card text-center border-0 rounded-3 bg-light">
// // //               <div className="card-body">
// // //                 <i className="bi bi-check-circle fs-1 text-success"></i>
// // //                 <h4 className="fw-bold mt-3">
// // //                   {statsLoading ? "..." : tripStats.completed}
// // //                 </h4>
// // //                 <p className="text-muted mb-0">Completed Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-3">
// // //             <div className="card shadow-sm stat-card text-center border-0 rounded-3 bg-light">
// // //               <div className="card-body">
// // //                 <i className="bi bi-geo-alt fs-1 text-secondary"></i>
// // //                 <h4 className="fw-bold mt-3">
// // //                   {statsLoading ? "..." : tripStats.total}
// // //                 </h4>
// // //                 <p className="text-muted mb-0">Total Trips</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Quick Actions */}
// // //         <div className="row g-4">
// // //           <div className="col-md-4">
// // //             <div className="card action-card shadow-sm border-0 h-100">
// // //               <div className="card-body text-center">
// // //                 <i className="bi bi-plus-circle fs-1 text-primary"></i>
// // //                 <h5 className="fw-bold mt-3">Plan a Trip</h5>
// // //                 <p className="text-muted">Start planning your next adventure</p>
// // //                 <a href="/createtrip" className="btn btn-primary">Create New Trip</a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-4">
// // //             <div className="card action-card shadow-sm border-0 h-100">
// // //               <div className="card-body text-center">
// // //                 <i className="bi bi-journal-text fs-1 text-warning"></i>
// // //                 <h5 className="fw-bold mt-3">My Trips</h5>
// // //                 <p className="text-muted">View your saved trips and itineraries</p>
// // //                 <a href="/trips" className="btn btn-warning text-white">View Trips</a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="col-md-4">
// // //             <div className="card action-card shadow-sm border-0 h-100">
// // //               <div className="card-body text-center">
// // //                 <i className="bi bi-binoculars fs-1 text-success"></i>
// // //                 <h5 className="fw-bold mt-3">Explore</h5>
// // //                 <p className="text-muted">Discover new destinations and experiences</p>
// // //                 <a href="/explore" className="btn btn-success">Explore</a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div> 
// // //     </div>
// // //   );
// // // };
  
 
// // // export default Dashboard;
// // import React, { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "bootstrap-icons/font/bootstrap-icons.css";
// // import "../styles/main.css";

// // const profileCircleColor = "#191a2e";

// // /* === Rule-based Chatbot Component === */
// // const Chatbot = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [messages, setMessages] = useState([
// //     { from: "bot", text: "Hi 👋, I'm your travel assistant. How can I help?" },
// //   ]);
// //   const [input, setInput] = useState("");
// //   const messagesEndRef = useRef(null);

// //   const rules = [
// //     { patterns: [/hi/i, /hello/i], responses: ["Hello! How can I assist you with your travel plans today?"] },
// //     { patterns: [/plan/i], responses: ["Click on 'Plan a Trip' to start creating your itinerary."] },
// //     { patterns: [/my trips/i, /view trips/i], responses: ["Click on 'My Trips' to see all your saved trips."] },
// //     { patterns: [/budget/i, /cost/i], responses: ["You can see your budget breakdown in each trip's details."] },
// //     { patterns: [/explore/i], responses: ["Click on 'Explore' to discover destinations and experiences."] },
// //     { patterns: [/.*/], responses: ["I'm not sure about that 🤔. Try asking about 'plan', 'trips', 'budget', or 'explore'."] }
// //   ];

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages, isOpen]);

// //   const getResponse = (text) => {
// //     text = text.toLowerCase();
// //     for (let rule of rules) {
// //       if (rule.patterns.some((p) => p.test(text))) {
// //         return rule.responses[Math.floor(Math.random() * rule.responses.length)];
// //       }
// //     }
// //     return rules[rules.length - 1].responses[0];
// //   };

// //   const sendMessage = () => {
// //     if (!input.trim()) return;
// //     const userMsg = { from: "user", text: input };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setTimeout(() => {
// //       setMessages((prev) => [...prev, { from: "bot", text: getResponse(input) }]);
// //     }, 500);
// //     setInput("");
// //   };

// //   return (
// //     <>
// //       {/* Floating Chat Button */}
// //       <button
// //         className="btn btn-primary rounded-circle"
// //         style={{
// //           position: "fixed", bottom: "20px", right: "20px",
// //           zIndex: 1050, width: "56px", height: "56px"
// //         }}
// //         onClick={() => setIsOpen(!isOpen)}
// //       >
// //         <i className="bi bi-chat-dots-fill fs-4 text-white"></i>
// //       </button>

// //       {/* Chat Window */}
// //       {isOpen && (
// //         <div
// //           className="card shadow"
// //           style={{
// //             position: "fixed", bottom: "90px", right: "20px",
// //             width: "320px", zIndex: 1050,
// //             borderRadius: "10px", overflow: "hidden"
// //           }}
// //         >
// //           <div className="bg-primary text-white p-2 d-flex justify-content-between">
// //             <strong>Travel Assistant</strong>
// //             <button className="btn btn-sm btn-light" onClick={() => setIsOpen(false)}>×</button>
// //           </div>
// //           <div style={{ maxHeight: "300px", overflowY: "auto", background: "#f9f9f9" }} className="p-2">
// //             {messages.map((msg, idx) => (
// //               <div key={idx} className={`mb-2 ${msg.from === "user" ? "text-end" : "text-start"}`}>
// //                 <span
// //                   className={`d-inline-block p-2 rounded ${msg.from === "user" ? "bg-primary text-white" : "bg-light"}`}
// //                   style={{ maxWidth: "80%" }}
// //                 >
// //                   {msg.text}
// //                 </span>
// //               </div>
// //             ))}
// //             <div ref={messagesEndRef} />
// //           </div>
// //           <div className="p-2 border-top">
// //             <div className="input-group">
// //               <input
// //                 type="text"
// //                 className="form-control"
// //                 placeholder="Type a message..."
// //                 value={input}
// //                 onChange={(e) => setInput(e.target.value)}
// //                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //               />
// //               <button className="btn btn-primary" onClick={sendMessage}>Send</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // /* === Main Dashboard === */
// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState(null);
// //   const [tripStats, setTripStats] = useState({ upcoming: 0, completed: 0, total: 0 });
// //   const [statsLoading, setStatsLoading] = useState(true);
// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const dropdownRef = useRef(null);

// //   useEffect(() => {
// //     function handleClickOutside(event) {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setDropdownOpen(false);
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   useEffect(() => {
// //     const userData = localStorage.getItem("user");
// //     if (userData) {
// //       setUser(JSON.parse(userData));
// //       fetchTripStats();
// //     } else {
// //       setUser({ name: "Guest", email: "guest@example.com" });
// //       fetchTripStats();
// //     }
// //   }, []);

// //   const fetchTripStats = async () => {
// //     try {
// //       const response = await fetch("http://localhost:5000/apis/trips/", {
// //         method: "GET",
// //         headers: { "Content-Type": "application/json" },
// //       });
// //       if (response.ok) {
// //         const data = await response.json();
// //         const allTrips = data.trips || [];
// //         const today = new Date();
// //         today.setHours(0, 0, 0, 0);
// //         const upcomingTrips = allTrips.filter((t) => new Date(t.startDate) >= today);
// //         const completedTrips = allTrips.filter((t) => new Date(t.endDate) < today);
// //         setTripStats({ upcoming: upcomingTrips.length, completed: completedTrips.length, total: allTrips.length });
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setStatsLoading(false);
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("isAuthenticated");
// //     navigate("/login");
// //   };

// //   if (!user) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center vh-100">
// //         <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="dashboard-bg min-vh-100 d-flex flex-column">
// //       {/* Navbar */}
// //       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
// //         <div className="container-fluid">
// //           <a className="navbar-brand d-flex align-items-center" href="#">
// //             <i className="bi bi-globe me-2"></i> GlobalTrotter
// //           </a>
// //           <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
// //             <div className="profile-img-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: "pointer" }}>
// //               <div className="profile-circle" style={{
// //                 background: profileCircleColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
// //                 borderRadius: "50%", width: 48, height: 48, fontWeight: 700, fontSize: "1.9rem", overflow: "hidden"
// //               }}>
// //                 {user?.avatar ? (
// //                   <img src={user.avatar} alt={user?.name || "User"} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
// //                 ) : (
// //                   (user?.name?.[0] || "A").toUpperCase()
// //                 )}
// //               </div>
// //             </div>

// //             {dropdownOpen && (
// //               <div className="custom-profile-dropdown animate__animated animate__fadeIn">
// //                 <div className="profile-menu-header d-flex flex-column align-items-center">
// //                   <div className="profile-circle mb-2" style={{ background: profileCircleColor, width: 60, height: 60 }}>
// //                     {user?.avatar ? (
// //                       <img src={user.avatar} alt={user?.name || "User"} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
// //                     ) : (
// //                       (user?.name?.[0] || "A").toUpperCase()
// //                     )}
// //                   </div>
// //                   <div className="fw-bold fs-6 mb-1">{user?.name || user?.email}</div>
// //                   <div className="text-muted fs-7">{user?.email}</div>
// //                 </div>
// //                 <div className="mt-3 pb-1 text-center">
// //                   <button className="btn btn-link profile-view-btn" onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>
// //                     View Profile
// //                   </button>
// //                 </div>
// //                 <div className="nav-signout-link" style={{ marginLeft: 22 }}>
// //                   <a style={{ cursor: "pointer" }} onClick={logout}>Sign out</a>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Dashboard body */}
// //       <div className="container my-5 flex-grow-1">
// //         <div className="text-center mb-5">
// //           <h2 className="fw-bold text-dark">Welcome to TripPlanner Dashboard</h2>
// //           <p className="text-muted fs-5">Your travel planning journey starts here</p>
// //         </div>
// //         {/* Stats cards */}
// //         <div className="row g-4 mb-5 justify-content-center">
// //           <div className="col-md-3"><div className="card shadow-sm text-center bg-light"><div className="card-body">
// //             <i className="bi bi-calendar-event fs-1 text-primary"></i>
// //             <h4 className="fw-bold mt-3">{statsLoading ? "..." : tripStats.upcoming}</h4>
// //             <p className="text-muted mb-0">Upcoming Trips</p></div></div></div>

// //           <div className="col-md-3"><div className="card shadow-sm text-center bg-light"><div className="card-body">
// //             <i className="bi bi-check-circle fs-1 text-success"></i>
// //             <h4 className="fw-bold mt-3">{statsLoading ? "..." : tripStats.completed}</h4>
// //             <p className="text-muted mb-0">Completed Trips</p></div></div></div>

// //           <div className="col-md-3"><div className="card shadow-sm text-center bg-light"><div className="card-body">
// //             <i className="bi bi-geo-alt fs-1 text-secondary"></i>
// //             <h4 className="fw-bold mt-3">{statsLoading ? "..." : tripStats.total}</h4>
// //             <p className="text-muted mb-0">Total Trips</p></div></div></div>
// //         </div>

// //         {/* Quick Actions */}
// //         <div className="row g-4">
// //           <div className="col-md-4"><div className="card shadow-sm h-100"><div className="card-body text-center">
// //             <i className="bi bi-plus-circle fs-1 text-primary"></i>
// //             <h5 className="fw-bold mt-3">Plan a Trip</h5><p className="text-muted">Start your adventure</p>
// //             <a href="/createtrip" className="btn btn-primary">Create New Trip</a></div></div></div>

// //           <div className="col-md-4"><div className="card shadow-sm h-100"><div className="card-body text-center">
// //             <i className="bi bi-journal-text fs-1 text-warning"></i>
// //             <h5 className="fw-bold mt-3">My Trips</h5><p className="text-muted">View your itineraries</p>
// //             <a href="/trips" className="btn btn-warning text-white">View Trips</a></div></div></div>

// //           <div className="col-md-4"><div className="card shadow-sm h-100"><div className="card-body text-center">
// //             <i className="bi bi-binoculars fs-1 text-success"></i>
// //             <h5 className="fw-bold mt-3">Explore</h5><p className="text-muted">Discover new destinations</p>
// //             <a href="/explore" className="btn btn-success">Explore</a></div></div></div>
// //         </div>
// //       </div>

// //       {/* Add Chatbot */}
// //       <Chatbot />
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../styles/main.css";

// /* === Modern Floating Chatbot === */
// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { from: "bot", text: "👋 Hi! I'm your travel assistant. How can I help?" },
//   ]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);

//   const rules = [
//     { patterns: [/hi/i, /hello/i], responses: ["Hello! How can I assist you with your travel plans today?"] },
//     { patterns: [/plan/i], responses: ["Click on 'Plan a Trip' to start creating your itinerary."] },
//     { patterns: [/my trips/i], responses: ["Click on 'My Trips' to see all your saved trips."] },
//     { patterns: [/budget/i, /cost/i], responses: ["You can see your budget breakdown in each trip's details."] },
//     { patterns: [/explore/i], responses: ["Click on 'Explore' to discover destinations and experiences."] },
//     { patterns: [/.*/], responses: ["I'm not sure about that 🤔. Try asking about 'plan', 'trips', 'budget', or 'explore'."] }
//   ];

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isOpen]);

//   const getResponse = (text) => {
//     text = text.toLowerCase();
//     for (let rule of rules) {
//       if (rule.patterns.some((p) => p.test(text))) {
//         return rule.responses[Math.floor(Math.random() * rule.responses.length)];
//       }
//     }
//     return rules[rules.length - 1].responses[0];
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const userMsg = { from: "user", text: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setTimeout(() => {
//       setMessages((prev) => [...prev, { from: "bot", text: getResponse(input) }]);
//     }, 500);
//     setInput("");
//   };

//   return (
//     <>
//       <button
//         className="btn btn-gradient rounded-circle shadow-lg"
//         style={{
//           position: "fixed", bottom: "20px", right: "20px", zIndex: 1050,
//           width: "56px", height: "56px", background: "linear-gradient(135deg, #667eea, #764ba2)"
//         }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <i className="bi bi-chat-dots-fill fs-4 text-white"></i>
//       </button>

//       {isOpen && (
//         <div
//           className="shadow-lg"
//           style={{
//             position: "fixed", bottom: "90px", right: "20px", width: "320px",
//             borderRadius: "12px", overflow: "hidden", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
//             zIndex: 1050
//           }}
//         >
//           <div className="bg-gradient p-2 d-flex justify-content-between align-items-center" style={{
//             background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white"
//           }}>
//             <strong>Travel Assistant</strong>
//             <button className="btn btn-sm btn-light" onClick={() => setIsOpen(false)}>×</button>
//           </div>
//           <div style={{ maxHeight: "300px", overflowY: "auto", background: "#f9f9f9" }} className="p-2">
//             {messages.map((msg, idx) => (
//               <div key={idx} className={`mb-2 ${msg.from === "user" ? "text-end" : "text-start"}`}>
//                 <span
//                   className={`d-inline-block p-2 rounded shadow-sm ${msg.from === "user" ? "bg-primary text-white" : "bg-light"}`}
//                   style={{ maxWidth: "80%" }}
//                 >
//                   {msg.text}
//                 </span>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="p-2 border-top">
//             <div className="input-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Type a message..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <button className="btn btn-primary" onClick={sendMessage}>Send</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// /* === Enhanced Dashboard === */
// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [tripStats, setTripStats] = useState({ upcoming: 0, completed: 0, total: 0 });
//   const [statsLoading, setStatsLoading] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//       fetchTripStats();
//     } else {
//       setUser({ name: "Guest", email: "guest@example.com" });
//       fetchTripStats();
//     }
//   }, []);

//   const fetchTripStats = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/apis/trips/", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         const allTrips = data.trips || [];
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const upcomingTrips = allTrips.filter((t) => new Date(t.startDate) >= today);
//         const completedTrips = allTrips.filter((t) => new Date(t.endDate) < today);
//         setTripStats({ upcoming: upcomingTrips.length, completed: completedTrips.length, total: allTrips.length });
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("isAuthenticated");
//     navigate("/login");
//   };

//   if (!user) {
//     return <div className="d-flex justify-content-center align-items-center vh-100">
//       <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
//     </div>;
//   }

//   return (
//     <div style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg shadow-sm" style={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)" }}>
//         <div className="container-fluid">
//           <a className="navbar-brand fw-bold" style={{ color: "#667eea", fontSize: "1.5rem" }}>🌍 GlobalTrotter</a>
//           <div className="ms-auto d-flex align-items-center" ref={dropdownRef}>
//             <div className="profile-img-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: "pointer" }}>
//               <div className="profile-circle shadow"
//                 style={{
//                   background: "linear-gradient(45deg, #667eea, #764ba2)", color: "#fff",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   borderRadius: "50%", width: 48, height: 48, fontWeight: 700
//                 }}>
//                 {user?.avatar ? <img src={user.avatar} alt="User" style={{ width: "100%", height: "100%", borderRadius: "50%" }} /> :
//                   (user?.name?.[0] || "A").toUpperCase()}
//               </div>
//             </div>
//             {dropdownOpen && (
//               <div className="custom-profile-dropdown p-3 shadow-lg rounded"
//                 style={{ position: "absolute", top: "60px", right: "10px", background: "#fff" }}>
//                 <h6 className="fw-bold mb-1">{user?.name}</h6>
//                 <small className="text-muted">{user?.email}</small>
//                 <hr />
//                 <button className="btn btn-sm btn-outline-primary w-100 mb-2" onClick={() => navigate("/profile")}>Profile</button>
//                 <button className="btn btn-sm btn-outline-danger w-100" onClick={logout}>Sign Out</button>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Dashboard Content */}
//       <div className="container py-5">
//         {/* Welcome Section */}
//         <div className="text-center mb-4">
//           <h2 className="fw-bold">Welcome {user.name}!</h2>
//           <p className="text-muted">Your travel planning journey starts here.</p>
//         </div>

//         {/* Stats cards */}
//         <div className="row g-4 mb-5">
//           {[
//             { icon: "bi-calendar-event", color: "linear-gradient(135deg, #667eea, #764ba2)", label: "Upcoming Trips", stat: tripStats.upcoming },
//             { icon: "bi-check-circle", color: "linear-gradient(135deg, #11998e, #38ef7d)", label: "Completed Trips", stat: tripStats.completed },
//             { icon: "bi-geo-alt", color: "linear-gradient(135deg, #ff512f, #dd2476)", label: "Total Trips", stat: tripStats.total }
//           ].map((card, i) => (
//             <div key={i} className="col-md-4">
//               <div className="card h-100 shadow-lg"
//                 style={{
//                   background: card.color, color: "white", borderRadius: "16px", textAlign: "center",
//                   transition: "transform 0.3s", cursor: "pointer"
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
//               >
//                 <div className="card-body">
//                   <i className={`bi ${card.icon} display-4 mb-3`}></i>
//                   <h3>{statsLoading ? "..." : card.stat}</h3>
//                   <p>{card.label}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Action buttons */}
//         <div className="row g-4">
//           {[
//             { icon: "bi-plus-circle", text: "Plan a Trip", link: "/createtrip", color: "primary" },
//             { icon: "bi-journal-text", text: "My Trips", link: "/trips", color: "warning" },
//             { icon: "bi-binoculars", text: "Explore", link: "/explore", color: "success" }
//           ].map((btn, i) => (
//             <div key={i} className="col-md-4">
//               <div className={`card shadow-sm h-100 text-center border-${btn.color}`}>
//                 <div className="card-body">
//                   <i className={`bi ${btn.icon} fs-1 text-${btn.color}`}></i>
//                   <h5 className="fw-bold mt-2">{btn.text}</h5>
//                   <button onClick={() => navigate(btn.link)} className={`btn btn-${btn.color} mt-2`}>Go</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Chatbot */}
//       <Chatbot />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/main.css";

const profileCircleColor = "#191a2e"; // Old UI style

/* === Chatbot with Navigation Buttons === */
const Chatbot = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋, I'm your travel assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Rules with optional action buttons
  const rules = [
    {
      patterns: [/hi/i, /hello/i, /hey/i],
      responses: ["Hello! 🌍 How can I assist you? You can ask me to 'Plan a Trip', 'View my Trips', 'Check Budget', or 'Explore'."],
    },
    {
      patterns: [/plan/i, /create trip/i],
      responses: [
        { text: "Sure! 🚀 Let's start planning your trip.", button: { label: "Plan a Trip", path: "/createtrip" } }
      ],
    },
    {
      patterns: [/my trips/i, /view trips/i],
      responses: [
        { text: "Here are your trips 📅", button: { label: "View My Trips", path: "/trips" } }
      ],
    },
    {
      patterns: [/budget/i, /cost/i, /expenses/i],
      responses: [
        { text: "💰 You can track your budget here.", button: { label: "Go to Budget Tracker", path: "/budget" } }
      ],
    },
    {
      patterns: [/explore/i, /destinations/i],
      responses: [
        { text: "Discover amazing destinations 🗺️", button: { label: "Explore Now", path: "/explore" } }
      ],
    },
    {
      patterns: [/help/i, /what can you do/i],
      responses: [
        "I can help you with planning a trip, viewing your trips, checking your budget, and exploring new destinations!"
      ],
    },
    {
      patterns: [/.*/],
      responses: [
        "I'm not sure about that 🤔. Try asking about 'Plan a Trip', 'My Trips', 'Budget', or 'Explore'."
      ],
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const getResponse = (text) => {
    const lowerInput = text.toLowerCase();
    for (let rule of rules) {
      if (rule.patterns.some((p) => p.test(lowerInput))) {
        const resp = rule.responses[Math.floor(Math.random() * rule.responses.length)];
        return resp;
      }
    }
    return rules[rules.length - 1].responses[0];
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botResp = getResponse(input);
      if (typeof botResp === "string") {
        setMessages((prev) => [...prev, { from: "bot", text: botResp }]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", ...botResp }]);
      }
    }, 500);

    setInput("");
  };

  const handleButtonClick = (path) => {
    navigate(path);
    setIsOpen(false); // Close chat after navigation
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="btn btn-primary rounded-circle"
        style={{
          position: "fixed", bottom: "20px", right: "20px",
          zIndex: 1050, width: "56px", height: "56px"
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-chat-dots-fill fs-4 text-white"></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="card shadow"
          style={{
            position: "fixed", bottom: "90px", right: "20px",
            width: "320px", zIndex: 1050,
            borderRadius: "10px", overflow: "hidden"
          }}
        >
          <div className="bg-primary text-white p-2 d-flex justify-content-between">
            <strong>Travel Assistant</strong>
            <button className="btn btn-sm btn-light" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto", background: "#f9f9f9" }} className="p-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.from === "user" ? "text-end" : "text-start"}`}>
                {msg.text && (
                  <span
                    className={`d-inline-block p-2 rounded ${msg.from === "user" ? "bg-primary text-white" : "bg-light"}`}
                    style={{ maxWidth: "80%" }}
                  >
                    {msg.text}
                  </span>
                )}
                {msg.button && msg.from === "bot" && (
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleButtonClick(msg.button.path)}
                    >
                      {msg.button.label}
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="btn btn-primary" onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* === Dashboard with Old UI === */
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tripStats, setTripStats] = useState({ upcoming: 0, completed: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchTripStats();
    } else {
      setUser({ name: "Guest", email: "guest@example.com" });
      fetchTripStats();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTripStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/apis/trips/");
      if (response.ok) {
        const data = await response.json();
        const allTrips = data.trips || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingTrips = allTrips.filter((t) => new Date(t.startDate) >= today);
        const completedTrips = allTrips.filter((t) => new Date(t.endDate) < today);
        setTripStats({ upcoming: upcomingTrips.length, completed: completedTrips.length, total: allTrips.length });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <div className="dashboard-bg min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold"><i className="bi bi-globe me-2"></i>  GlobalTrotter</span>
          <div ref={dropdownRef} className="ms-auto position-relative">
            <div
              className="profile-circle"
              style={{
                background: profileCircleColor, color: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "50%", width: 48, height: 48,
                cursor: "pointer"
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {(user.name?.[0] || "A").toUpperCase()}
            </div>
            {dropdownOpen && (
              <div className="position-absolute end-0 mt-2 p-3 bg-white shadow rounded">
                <h6>{user.name}</h6>
                <small className="text-muted">{user.email}</small>
                <hr />
                <button className="btn btn-sm btn-primary w-100 mb-2" onClick={() => navigate("/profile")}>Profile</button>
                <button className="btn btn-sm btn-danger w-100" onClick={logout}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Welcome to TripPlanner Dashboard</h2>
          <p className="text-muted">Your travel planning journey starts here</p>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4"><div className="card p-3"><i className="bi bi-calendar-event fs-1 text-primary"></i><h4>{statsLoading ? "..." : tripStats.upcoming}</h4><p>Upcoming Trips</p></div></div>
          <div className="col-md-4"><div className="card p-3"><i className="bi bi-check-circle fs-1 text-success"></i><h4>{statsLoading ? "..." : tripStats.completed}</h4><p>Completed Trips</p></div></div>
          <div className="col-md-4"><div className="card p-3"><i className="bi bi-geo-alt fs-1 text-secondary"></i><h4>{statsLoading ? "..." : tripStats.total}</h4><p>Total Trips</p></div></div>
        </div>

        {/* Actions */}
        <div className="row g-4 text-center">
          <div className="col-md-4"><div className="card p-3"><i className="bi bi-plus-circle fs-1 text-primary"></i><h5>Plan a Trip</h5><p>Start your adventure</p><button className="btn btn-primary" onClick={() => navigate("/createtrip")}>Go</button></div></div>
          <div className="col-md-4"><div className="card p-3"><i className="bi bi-journal-text fs-1 text-warning"></i><h5>My Trips</h5><p>Your itineraries</p><button className="btn btn-warning text-white" onClick={() => navigate("/trips")}>Go</button></div></div>
          <div className="col-md-4"><div className="card p-3"><i className="bi bi-binoculars fs-1 text-success"></i><h5>Explore</h5><p>Discover places</p><button className="btn btn-success" onClick={() => navigate("/explore")}>Go</button></div></div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot navigate={navigate} />
    </div>
  );
};

export default Dashboard;
