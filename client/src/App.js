import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import AdminSignUp from "./components/Auth/AdminSignUp";
import VerifyOTP from "./components/Auth/VerifyOTP";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Dashboard from "./components/Dashboard";
import CreateTrip from "./components/Trips/CreateTrip";
import TripsList from "./components/Trips/TripsList";
import EditTrip from "./components/Trips/EditTrip";
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/Profile/ChangePassword";
import ItineraryBuilder from "./components/Itinerary/ItineraryBuilder";
import ItineraryVisualization from "./components/ItineraryVisualization/ItineraryVisualization";
import CitySearch from "./components/Search/CitySearch";
import ActivitySearch from "./components/Search/ActivitySearch";
import AnalyticsDashboard from "./components/Analytics/AnalyticsDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PublicItineraryView from "./components/PublicItinarary";
import ExplorePublic from "./components/ExplorePublic";
import "./App.css";

// Protected Route Component with admin role check
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const hasSession =
    localStorage.getItem("isAuthenticated") === "true" &&
    !!localStorage.getItem("user");
  const userRole = localStorage.getItem("userRole"); // expected: "admin" or "user"

  if (!hasSession) {
    // Not logged in or stale flag without user
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== "admin") {
    // Logged in but not admin, redirect to dashboard or somewhere else
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized
  return children;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const hasSession =
    localStorage.getItem("isAuthenticated") === "true" &&
    !!localStorage.getItem("user");
  return !hasSession ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin-signup"
            element={
              <PublicRoute>
                <AdminSignUp />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <TripsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:tripId/edit"
            element={
              <ProtectedRoute>
                <EditTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary/:tripId"
            element={
              <ProtectedRoute>
                <ItineraryBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary/:tripId/view"
            element={
              <ProtectedRoute>
                <ItineraryVisualization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-cities"
            element={
              <ProtectedRoute>
                <CitySearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-activities"
            element={
              <ProtectedRoute>
                <ActivitySearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute adminOnly={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          {/* Explore Public Itineraries */}
          <Route
            path="/explore-public"
            element={
              <ProtectedRoute>
                <ExplorePublic />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={<Navigate to="/admin" replace />}
          />

        <Route path="/public/itinerary/:tripId" element={<PublicItineraryView />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
