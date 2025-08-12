import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import VerifyOTP from "./components/Auth/VerifyOTP";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./components/Dashboard"; // Public now
import CreateTrip from "./components/Trips/CreateTrip";
import ItineraryBuilder from "./components/Itinerary/ItineraryBuilder";
import TripListScreen from "./components/Trips/TripListScreen";
import EditTrip from  "./components/Trips/EditTrip";
import Profile from  "./components/Profile/Profile";
import ChangePassword from  "./components/Profile/ChangePassword";

import "./App.css";

// Protected Route Component (still available for future use)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Authentication Routes */}
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
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Public Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createtrip" element={<CreateTrip />} />
          <Route path="/ItineraryBuilder" element={<ItineraryBuilder />} />
          <Route path="/TripListScreen" element={<TripListScreen />} />
          <Route path="/EditTrip" element={<EditTrip />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          
           
             <Route path="VerifyOTP" element={<VerifyOTP />} />
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
