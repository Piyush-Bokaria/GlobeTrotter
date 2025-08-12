import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useActivityTracker } from "../../hooks/useActivityTracker";

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Activity tracking
  const { trackTripAction, trackError, trackFeatureUsage } = useActivityTracker();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please log in to view your trips.");
        setLoading(false);
        return;
      }

      console.log('Fetching trips with authentication token');

      const response = await fetch("http://localhost:5000/apis/trips/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send JWT token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received trips:', data.trips?.length || 0);
      setTrips(data.trips || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categorizeTrips = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = trips
      .filter((trip) => {
        const startDate = new Date(trip.startDate);
        startDate.setHours(0, 0, 0, 0);
        return startDate > today;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const ongoing = trips
      .filter((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return startDate <= today && endDate >= today;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const completed = trips
      .filter((trip) => {
        const endDate = new Date(trip.endDate);
        endDate.setHours(23, 59, 59, 999);
        return endDate < today;
      })
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    return { upcoming, ongoing, completed };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  };

  const deleteTrip = async (tripId, tripName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${tripName}"? This action cannot be undone.`
      )
    ) {
      // Track cancelled deletion
      trackTripAction("delete_cancelled", tripId, tripName);
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in to delete trips.");
      trackError("auth_error", "No token found for trip deletion", null, { tripId, tripName });
      return;
    }

    setDeleteLoading(tripId);
    try {
      // Track deletion attempt
      trackTripAction("delete_attempt", tripId, tripName);
      
      const response = await fetch(
        `http://localhost:5000/apis/trips/${tripId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Send JWT token
          },
        }
      );

      if (response.ok) {
        // Remove the trip from the local state
        setTrips(trips.filter((trip) => trip._id !== tripId));
        // You could also show a success message here
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      setError("Failed to delete trip. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // removed unused getStatusColor

  const getTripStatus = (trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (startDate > today) {
      return {
        status: "upcoming",
        color: "bg-blue-100 text-blue-800",
        icon: "🚀",
      };
    } else if (startDate <= today && endDate >= today) {
      return {
        status: "ongoing",
        color: "bg-green-100 text-green-800",
        icon: "✈️",
      };
    } else {
      return {
        status: "completed",
        color: "bg-gray-100 text-gray-800",
        icon: "✅",
      };
    }
  };

  if (loading) {
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
                className="text-lg sm:text-xl font-semibold text-gray-900"
              >
                GlobeTrotter
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/dashboard"
                className="hidden sm:block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
              >
                <svg
                  className="w-4 h-4 sm:mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <Link
                to="/create-trip"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium"
              >
                <span className="sm:hidden">+</span>
                <span className="hidden sm:inline">Create Trip</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Manage and view all your travel plans in one place.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          {trips.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No trips yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first trip.
              </p>
              <div className="mt-6">
                <Link
                  to="/create-trip"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create New Trip
                </Link>
              </div>
            </div>
          ) : (
            <TripsCategories
              trips={categorizeTrips()}
              formatDate={formatDate}
              getDuration={getDuration}
              getTripStatus={getTripStatus}
              deleteTrip={deleteTrip}
              deleteLoading={deleteLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Trips Categories Component
const TripsCategories = ({
  trips,
  formatDate,
  getDuration,
  getTripStatus,
  deleteTrip,
  deleteLoading,
}) => {
  const { upcoming, ongoing, completed } = trips;

  const [publishLoading, setPublishLoading] = React.useState(null);

  const makePublic = async (trip) => {
    try {
      setPublishLoading(trip._id);
      // Check if itinerary exists
      let itineraryExists = false;
      const itRes = await fetch(
        `http://localhost:5000/apis/itinerary/${trip._id}`
      );
      if (itRes.ok) {
        itineraryExists = true;
      }

      if (!itineraryExists) {
        // Create itinerary first
        const createRes = await fetch(
          "http://localhost:5000/apis/itinerary/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tripId: trip._id,
              title: `${trip.name} Itinerary`,
              description: trip.description || "",
            }),
          }
        );
        if (!createRes.ok) {
          const txt = await createRes.text();
          throw new Error(txt || "Failed to create itinerary");
        }
      }

      // Update itinerary status to finalized (public)
      const updateRes = await fetch(
        `http://localhost:5000/apis/itinerary/${trip._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "finalized" }),
        }
      );
      if (!updateRes.ok) {
        const txt = await updateRes.text();
        throw new Error(txt || "Failed to set itinerary public");
      }
      alert("Itinerary marked as public (finalized)");
    } catch (err) {
      console.error("Make public error:", err);
      alert("Failed to make public: " + (err.message || "Unknown error"));
    } finally {
      setPublishLoading(null);
    }
  };

  const TripCard = ({ trip }) => {
    const tripStatus = getTripStatus(trip);

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {trip.coverPhoto && (
          <div className="h-40 sm:h-48 bg-gray-200">
            <img
              src={trip.coverPhoto}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {trip.name}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${tripStatus.color}`}
            >
              {tripStatus.icon} {tripStatus.status}
            </span>
          </div>

          {trip.destination && (
            <p className="text-sm text-gray-600 mb-2">📍 {trip.destination}</p>
          )}

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {trip.description}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
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
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </div>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {getDuration(trip.startDate, trip.endDate)}
            </div>

            {trip.budget > 0 && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                ${trip.budget.toLocaleString()}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {tripStatus.status === "completed" ? (
                <Link
                  to={`/itinerary/${trip._id}/view`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="hidden sm:inline">View Itinerary</span>
                  <span className="sm:hidden">View</span>
                </Link>
              ) : (
                <Link
                  to={`/itinerary/${trip._id}`}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Build Itinerary</span>
                  <span className="sm:hidden">Build</span>
                </Link>
              )}
              <button
                onClick={() => makePublic(trip)}
                disabled={publishLoading === trip._id}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-center py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
              >
                {publishLoading === trip._id ? "Publishing..." : (
                  <>
                    <span className="hidden sm:inline">Make Public</span>
                    <span className="sm:hidden">Public</span>
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                to={`/trips/${trip._id}/edit`}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-center py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Link>
              <Link
                to={`/trip/${trip._id}/budget`}
                className="bg-green-100 hover:bg-green-200 text-green-700 text-center py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1"
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
                Budget
              </Link>
              <button
                onClick={() => deleteTrip(trip._id, trip.name)}
                disabled={deleteLoading === trip._id}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-center py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading === trip._id ? (
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CategorySection = ({ title, trips, icon, emptyMessage }) => (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="ml-3 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {trips.length}
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 italic">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <CategorySection
        title="Ongoing Trips"
        trips={ongoing}
        icon="✈️"
        emptyMessage="No trips currently in progress"
      />

      <CategorySection
        title="Upcoming Trips"
        trips={upcoming}
        icon="🚀"
        emptyMessage="No upcoming trips planned"
      />

      <CategorySection
        title="Completed Trips"
        trips={completed}
        icon="✅"
        emptyMessage="No completed trips yet"
      />
    </div>
  );
};

export default TripsList;
