import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: "",
    additionalInfo: "",
    profilePicture: "",
  });
  const [trips, setTrips] = useState({ upcoming: [], completed: [] });
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
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
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, []);

  const fetchUserTrips = async () => {
    try {
      const response = await fetch("http://localhost:5000/apis/trips/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const allTrips = data.trips || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Separate upcoming and completed trips
        const upcomingTrips = allTrips
          .filter((trip) => new Date(trip.startDate) >= today)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);

        const completedTrips = allTrips
          .filter((trip) => new Date(trip.endDate) < today)
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          .slice(0, 3);

        setTrips({ upcoming: upcomingTrips, completed: completedTrips });
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setTripsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      city: user.city || "",
      country: user.country || "",
      additionalInfo: user.additionalInfo || "",
      profilePicture: user.profilePicture || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Make API call to update profile
      const response = await fetch(
        "http://localhost:5000/apis/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            ...formData,
          }),
        }
      );

      if (response.ok) {
        const updatedUser = {
          ...user,
          ...formData,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-xl font-semibold text-gray-900"
              >
                GlobeTrotter
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/trips"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Trips
              </Link>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            {/* Profile Header */}
            <div className="px-6 py-8 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">About</h1>
                <div>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 py-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {formData.profilePicture || user.profilePicture ? (
                      <img
                        src={formData.profilePicture || user.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                        <span className="text-3xl font-bold text-indigo-600">
                          {(user.firstName || user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}

                    {isEditing && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* User Information Box */}
                <div className="flex-1 bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">
                          {user.firstName || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">
                          {user.lastName || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">
                          {user.email || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">
                          {user.phoneNumber || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter city"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">
                          {user.city || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter country"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2">
                          {user.country || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      {isEditing ? (
                        <textarea
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Tell us more about yourself..."
                        />
                      ) : (
                        <p className="text-sm text-gray-900 py-2 min-h-[4rem]">
                          {user.additionalInfo ||
                            "No additional information provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trips Overview */}
            <div className="px-6 py-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">My Trips</h2>
                <Link
                  to="/trips"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  View All →
                </Link>
              </div>

              {tripsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Upcoming Trips */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Upcoming Trips
                    </h3>
                    {trips.upcoming.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No upcoming trips
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {trips.upcoming.map((trip) => (
                          <TripCard
                            key={trip._id}
                            trip={trip}
                            type="upcoming"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Completed Trips */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Recent Completed Trips
                    </h3>
                    {trips.completed.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No completed trips
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {trips.completed.map((trip) => (
                          <TripCard
                            key={trip._id}
                            trip={trip}
                            type="completed"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="px-6 py-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Actions
              </h2>

              <div className="space-y-3">
                <Link
                  to="/change-password"
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-sm block"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V7a2 2 0 012-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m0 0v2"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
                        Change Password
                      </p>
                      <p className="text-gray-500">
                        Update your account password
                      </p>
                    </div>
                  </div>
                </Link>

                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
                        Account Settings
                      </p>
                      <p className="text-gray-500">
                        Manage your account preferences
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 border border-red-300 rounded-md hover:bg-red-50 text-sm"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-red-900">Sign Out</p>
                      <p className="text-red-500">Sign out of your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Trip Card Component
const TripCard = ({ trip, type }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysFromNow = (dateString) => {
    const tripDate = new Date(dateString);
    const today = new Date();
    const diffTime = tripDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (type === "upcoming") {
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays > 1) return `In ${diffDays} days`;
    } else {
      const daysSince = Math.abs(diffDays);
      if (daysSince === 0) return "Today";
      if (daysSince === 1) return "1 day ago";
      return `${daysSince} days ago`;
    }
    return "";
  };

  const getStatusColor = () => {
    return type === "upcoming"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = () => {
    return type === "upcoming" ? "🚀" : "✅";
  };

  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getStatusColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm">{getStatusIcon()}</span>
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {trip.name}
            </h4>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>

            {trip.destination && (
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{trip.destination}</span>
              </div>
            )}

            {trip.budget > 0 && (
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span>${trip.budget.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right ml-4">
          <p className="text-xs font-medium text-gray-700">
            {getDaysFromNow(
              type === "upcoming" ? trip.startDate : trip.endDate
            )}
          </p>
          <div className="mt-2 flex space-x-1">
            {type === "completed" ? (
              <Link
                to={`/itinerary/${trip._id}/view`}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
              >
                View Itinerary
              </Link>
            ) : (
              <Link
                to={`/itinerary/${trip._id}`}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Plan
              </Link>
            )}
            <Link
              to={`/trips/${trip._id}`}
              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
