import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ViewToggle from "./components/ViewToggle";
import DaySection from "./components/DaySection";
import CityHeader from "./components/CityHeader";
import NavigationControls from "./components/NavigationControls";
import ItineraryCalendar from "./components/ItineraryCalendar";

const ItineraryVisualization = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [trip, setTrip] = useState(null);
  const [showAddDay, setShowAddDay] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState({ show: false, dayId: null });
  const [editingActivity, setEditingActivity] = useState({ show: false, dayId: null, activityId: null, data: {} });

  useEffect(() => {
    fetchTripData();
    // Load saved view mode preference
    const savedViewMode = localStorage.getItem("itinerary-view-mode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);

      // First, get the trip data to get basic info and dates
      const tripResponse = await fetch(
        `http://localhost:5000/apis/trips/${tripId}`,
        {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!tripResponse.ok) {
        throw new Error("Failed to fetch trip data");
      }

      const tripData = await tripResponse.json();
      const trip = tripData.trip || tripData;


      console.log("Trip data:", trip); // Debug log
      
      // Try to get actual itinerary data
      let itineraryData = null;
      try {
        const itineraryResponse = await fetch(
          `http://localhost:5000/apis/itinerary/${tripId}`,
          {
            cache: "no-cache",
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (itineraryResponse.ok) {
          const itinerary = await itineraryResponse.json();
          itineraryData = itinerary.itinerary || itinerary;
          console.log("Itinerary data found:", itineraryData); // Debug log
        }
      } catch (itineraryError) {
        console.log("No itinerary found, will generate sample data"); // Debug log
      }

      setTripData(await processItineraryData(trip, itineraryData));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processItineraryData = async (tripData, itineraryData = null) => {
    // Process and organize trip data
    let startDate, endDate;

    console.log("Processing trip data:", tripData); // Debug log
    console.log("Processing itinerary data:", itineraryData); // Debug log

    // Get dates from the trip data (always use trip dates as source of truth)
    const startDateValue = tripData.startDate;
    const endDateValue = tripData.endDate;

    console.log("Date values found:", { startDateValue, endDateValue }); // Debug log

    if (startDateValue && endDateValue) {
      startDate = new Date(startDateValue);
      endDate = new Date(endDateValue);

      console.log("Parsed dates:", { startDate, endDate }); // Debug log

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.log("Invalid dates detected"); // Debug log
        throw new Error("Invalid trip dates found");
      }
    } else {
      console.log("No date fields found in trip data"); // Debug log
      throw new Error("Trip dates are missing");
    }

    // Calculate days more accurately
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const totalDays = Math.max(1, daysDiff + 1); // Ensure at least 1 day

    console.log("Date calculation:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timeDiff,
      daysDiff,
      totalDays,
    }); // Debug log

    let days = [];

    console.log("Itinerary data:", itineraryData);
    // If we have actual itinerary data, use it
    if (itineraryData && itineraryData.days && itineraryData.days.length > 0) {
      console.log("Using actual itinerary data"); // Debug log

      // Process actual itinerary days
      days = itineraryData.days.map((day, index) => ({
        date: new Date(day.date),
        dayNumber: index + 1,
        city: day.city,
        activities: day.activities.map((activity) => ({
          id: activity._id,
          name: activity.name,
          description: activity.description,
          category: activity.category,
          startTime: activity.startTime,
          endTime: activity.endTime,
          duration: calculateDuration(activity.startTime, activity.endTime),
          cost: { amount: activity.cost || 0, currency: "INR" },
          location: {
            city: day.city,
            address:
              activity.location || `${activity.name} Location, ${day.city}`,
          },
          notes: activity.notes || "",
          confirmationStatus: "confirmed",
        })),
        totalCost: day.activities.reduce(
          (sum, activity) => sum + (activity.cost || 0),
          0
        ),
        notes: day.notes || "",
      }));

      // Sort days by date
      days.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      console.log("No itineraries present for this trip."); // Debug log
      days = [
        {
          date: null,
          dayNumber: null,
          city: null,
          activities: [],
          totalCost: 0,
          notes: "No itineraries present",
        },
      ];
      
    }

    // Get unique cities
    const uniqueCities = [...new Set(days.map((day) => day.city))];

    return {
      ...tripData,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
      cities: uniqueCities,
      totalCost: days.reduce((sum, day) => sum + day.totalCost, 0),
      currency: "USD",
      hasActualItinerary: !!(
        itineraryData &&
        itineraryData.days &&
        itineraryData.days.length > 0
      ),
    };
  };

  // Helper function to add minutes to time string
  const addMinutesToTime = (timeStr, minutes) => {
    const [hours, mins] = timeStr.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to calculate duration between two times
  const calculateDuration = (startTime, endTime) => {
    const [startHours, startMins] = startTime.split(":").map(Number);
    const [endHours, endMins] = endTime.split(":").map(Number);
    const startTotalMins = startHours * 60 + startMins;
    const endTotalMins = endHours * 60 + endMins;
    return endTotalMins - startTotalMins;
  };

  const generateSampleActivities = async (dayNumber, city) => {
    try {
      // Fetch activity templates from the database
      const response = await fetch(
        `http://localhost:5000/apis/activity-templates/city/${encodeURIComponent(city)}?limit=10`,
        {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      let cityActivities = [];
      
      if (response.ok) {
        const data = await response.json();
        cityActivities = data.templates || [];
        console.log(`Found ${cityActivities.length} activity templates for ${city}`);
      } else {
        console.log(`No activity templates found for ${city}, using fallback`);
      }

      // Fallback to basic activities if no templates found
      if (cityActivities.length === 0) {
        cityActivities = [
          {
            name: `Explore ${city}`,
            description: `Discover the highlights of ${city}`,
            category: "sightseeing",
            defaultDuration: 120,
            estimatedCost: 20,
            suggestedTime: "10:00",
            bookingRequired: false
          },
          {
            name: `Local Dining in ${city}`,
            description: `Experience local cuisine in ${city}`,
            category: "dining",
            defaultDuration: 90,
            estimatedCost: 35,
            suggestedTime: "12:30",
            bookingRequired: false
          },
          {
            name: `Cultural Experience in ${city}`,
            description: `Immerse yourself in the culture of ${city}`,
            category: "culture",
            defaultDuration: 150,
            estimatedCost: 15,
            suggestedTime: "14:00",
            bookingRequired: false
          }
        ];
      }

      // Select 2-4 activities per day, varying by day number
      const numActivities = Math.min(2 + (dayNumber % 3), cityActivities.length);
      const selectedActivities = [];

      // Ensure we get different activities for different days
      const startIndex = (dayNumber - 1) % cityActivities.length;

      for (let i = 0; i < numActivities; i++) {
        const activityIndex = (startIndex + i) % cityActivities.length;
        const template = cityActivities[activityIndex];

        selectedActivities.push({
          id: `activity-${dayNumber}-${i + 1}`,
          name: template.name,
          description: template.description || `Experience ${template.name} in ${city}`,
          category: template.category,
          startTime: template.suggestedTime || "10:00",
          endTime: addMinutesToTime(
            template.suggestedTime || "10:00", 
            template.defaultDuration || 120
          ),
          duration: template.defaultDuration || 120,
          cost: { 
            amount: template.estimatedCost || 0, 
            currency: template.currency || "USD" 
          },
          location: {
            city: city,
            address: template.location?.address || `${template.name} Location, ${city}`,
          },
          notes: template.bookingRequired 
            ? "Book in advance recommended" 
            : template.estimatedCost === 0 
              ? "Free activity!" 
              : "",
          confirmationStatus: (dayNumber + i) % 4 === 0 ? "pending" : "confirmed",
        });
      }

      return selectedActivities;
    } catch (error) {
      console.error('Error fetching activity templates:', error);
      
      // Return basic fallback activities on error
      return [
        {
          id: `activity-${dayNumber}-1`,
          name: `Explore ${city}`,
          description: `Discover the highlights of ${city}`,
          category: "sightseeing",
          startTime: "10:00",
          endTime: "12:00",
          duration: 120,
          cost: { amount: 20, currency: "USD" },
          location: {
            city: city,
            address: `${city} City Center`,
          },
          notes: "Explore at your own pace",
          confirmationStatus: "confirmed",
        }
      ];
    }
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
    // Handle activity interactions
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
              onClick={fetchTripData}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-600 text-lg mb-4">No itinerary found</div>
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
              <span className="text-gray-900">{tripData.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tripData.name}
          </h1>
          <p className="text-gray-600">
            {new Date(tripData.startDate).toLocaleDateString()} -{" "}
            {new Date(tripData.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {tripData.days.length} days • Total Budget: $
            {tripData.totalCost.toFixed(2)}
            {!tripData.hasActualItinerary && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Sample Data
              </span>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
          <NavigationControls
            days={tripData.days}
            selectedDay={selectedDay}
            onDaySelect={handleDayNavigation}
          />
        </div>

        {/* Itinerary Content */}
        <div className="space-y-8">
          {viewMode === "calendar" ? (
            <ItineraryCalendar
              tripData={tripData}
              selectedDay={selectedDay}
              onActivityClick={handleActivityClick}
            />
          ) : (
            <div className="space-y-6">
              {tripData.days.map((day, index) => (
                <div key={day.dayNumber} id={`day-${day.dayNumber}`}>
                  {/* City Header (show when city changes) */}
                  {(index === 0 ||
                    tripData.days[index - 1].city !== day.city) 
                    && (
                    <CityHeader
                      city={day.city}
                      duration={
                        tripData.days.filter((d) => d.city === day.city).length
                      }
                      activities={day.activities}
                    />
                  )
                  }

                  <DaySection
                    day={day}
                    viewMode={viewMode}
                    isActive={selectedDay === day.dayNumber}
                    onActivityClick={handleActivityClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryVisualization;