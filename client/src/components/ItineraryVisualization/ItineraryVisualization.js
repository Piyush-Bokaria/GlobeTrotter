import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ViewToggle from "./components/ViewToggle";
import DaySection from "./components/DaySection";
import CityHeader from "./components/CityHeader";
import NavigationControls from "./components/NavigationControls";
import ItineraryCalendar from "./components/ItineraryCalendar";

const ItineraryVisualization = () => {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [trip, setTrip] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItinerary();
    // Load saved view mode preference
    const savedViewMode = localStorage.getItem("itinerary-view-mode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/itinerary/${tripId}`
      );

      if (response.status === 404) {
        // Itinerary doesn't exist, fetch trip data instead
        setItinerary(null);
        await fetchTrip();
      } else if (response.ok) {
        const data = await response.json();
        setItinerary(data.itinerary);
        setTrip(data.itinerary.tripId);
      } else {
        throw new Error("Failed to fetch itinerary");
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      setError("Failed to load itinerary");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrip = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/trips/${tripId}`
      );
      if (response.ok) {
        const data = await response.json();
        setTrip(data.trip);
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalDays = () => {
    if (!trip?.startDate || !trip?.endDate) return 0;

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(1, daysDiff + 1); // Include both start and end dates
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("itinerary-view-mode", mode);
  };

  const handleDayNavigation = (dayNumber) => {
    setSelectedDay(dayNumber);
    // Smooth scroll to day section
    const dayElement = document.getElementById(`day-${dayNumber}`);
    if (dayElement) {
      dayElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleActivityClick = (activity) => {
    // Handle activity interactions (view-only for visualization)
    console.log("Activity clicked:", activity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading itinerary...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">
              Error loading itinerary
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchItinerary}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-600 text-lg mb-4">No trip found</div>
            <Link
              to="/trips"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Back to Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalDays = calculateTotalDays();
  const totalBudget = itinerary?.totalBudget || 0;

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
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/trips" className="text-gray-600 hover:text-gray-900">
                Trips
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{trip.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
          <p className="text-gray-600">
            {new Date(trip.startDate).toLocaleDateString()} -{" "}
            {new Date(trip.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totalDays} days • Total Budget: ${totalBudget.toFixed(2)}
            {!itinerary && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                No Detailed Itinerary
              </span>
            )}
          </p>
        </div>

        {!itinerary ? (
          // No itinerary exists
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No detailed itinerary available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This trip doesn't have a detailed day-by-day itinerary yet.
            </p>
            <div className="mt-6">
              <Link
                to={`/itinerary/${tripId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                Create Itinerary
              </Link>
            </div>
          </div>
        ) : (
          // Display existing itinerary
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
              <NavigationControls
                days={itinerary.days}
                selectedDay={selectedDay}
                onDaySelect={handleDayNavigation}
              />
            </div>

            {/* Itinerary Content */}
            <div className="space-y-8">
              {viewMode === "calendar" ? (
                <ItineraryCalendar
                  tripData={{
                    ...trip,
                    days: itinerary.days,
                    cities: [...new Set(itinerary.days.map((d) => d.city))],
                    totalCost: totalBudget,
                    currency: "USD",
                  }}
                  selectedDay={selectedDay}
                  onActivityClick={handleActivityClick}
                />
              ) : (
                <div className="space-y-6">
                  {itinerary.days.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg shadow">
                      <p className="text-gray-500">
                        No days added to this itinerary yet.
                      </p>
                    </div>
                  ) : (
                    itinerary.days.map((day, index) => (
                      <div key={day._id} id={`day-${index + 1}`}>
                        {/* City Header (show when city changes) */}
                        {(index === 0 ||
                          itinerary.days[index - 1].city !== day.city) && (
                          <CityHeader
                            city={day.city}
                            duration={
                              itinerary.days.filter((d) => d.city === day.city)
                                .length
                            }
                            activities={day.activities}
                          />
                        )}

                        <DaySection
                          day={{
                            ...day,
                            dayNumber: index + 1,
                            date: new Date(day.date),
                          }}
                          viewMode={viewMode}
                          isActive={selectedDay === index + 1}
                          onActivityClick={handleActivityClick}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ItineraryVisualization;
