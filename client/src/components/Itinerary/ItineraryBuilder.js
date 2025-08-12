import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// removed unused CitySearch import

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddDay, setShowAddDay] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState({
    show: false,
    dayId: null,
  });
  const [editingActivity, setEditingActivity] = useState({
    show: false,
    dayId: null,
    activityId: null,
    data: {},
  });

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/itinerary/${tripId}`
      );

      if (response.status === 404) {
        // Itinerary doesn't exist, we'll show create option
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

  const createItinerary = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/apis/itinerary/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tripId: tripId,
            title: `${trip.name} Itinerary`,
            description: `Detailed itinerary for ${trip.name}`,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItinerary(data.itinerary);
      } else {
        throw new Error("Failed to create itinerary");
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
      setError("Failed to create itinerary");
    }
  };

  const addDay = async (dayData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/itinerary/${tripId}/days`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dayData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItinerary(data.itinerary);
        setShowAddDay(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add day");
      }
    } catch (error) {
      console.error("Error adding day:", error);
      setError("Failed to add day");
    }
  };

  const addActivity = async (dayId, activityData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/itinerary/${tripId}/days/${dayId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activityData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItinerary(data.itinerary);
        setShowAddActivity({ show: false, dayId: null });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add activity");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      setError("Failed to add activity");
    }
  };

  const updateActivity = async (dayId, activityId, activityData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/itinerary/${tripId}/days/${dayId}/activities/${activityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activityData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItinerary(data.itinerary);
        setEditingActivity({
          show: false,
          dayId: null,
          activityId: null,
          data: {},
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      setError("Failed to update activity");
    }
  };

  const deleteActivity = async (dayId, activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/apis/itinerary/${tripId}/days/${dayId}/activities/${activityId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItinerary(data.itinerary);
      } else {
        throw new Error("Failed to delete activity");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      setError("Failed to delete activity");
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

  const getCategoryIcon = (category) => {
    const icons = {
      sightseeing: "🏛️",
      food: "🍽️",
      shopping: "🛍️",
      entertainment: "🎭",
      transport: "🚗",
      accommodation: "🏨",
      other: "📍",
    };
    return icons[category] || icons.other;
  };

  const getCategoryColor = (category) => {
    const colors = {
      sightseeing: "bg-blue-100 text-blue-800",
      food: "bg-orange-100 text-orange-800",
      shopping: "bg-purple-100 text-purple-800",
      entertainment: "bg-pink-100 text-pink-800",
      transport: "bg-green-100 text-green-800",
      accommodation: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  // removed unused handleAddCity

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
                to="/trips"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Trips
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <svg
                  className="w-4 h-4 mr-1"
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
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {trip?.name} - Itinerary Builder
                </h1>
                <p className="mt-2 text-gray-600">
                  Plan your trip day by day with detailed activities and
                  schedules
                </p>
              </div>
              {itinerary && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Total Days: {itinerary.totalDays}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Budget: ${itinerary.totalBudget}
                  </p>
                </div>
              )}
            </div>
          </div>

          {!itinerary ? (
            // Create Itinerary
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
                No itinerary yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a detailed itinerary for your trip.
              </p>
              <div className="mt-6">
                <button
                  onClick={createItinerary}
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
                </button>
              </div>
            </div>
          ) : (
            // Display Itinerary
            <div className="space-y-6">
              {/* Add Day Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Daily Schedule
                </h2>
                <button
                  onClick={() => setShowAddDay(true)}
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
                  Add Day
                </button>
              </div>

              {/* Days List */}
              {itinerary.days.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">
                    No days added yet. Click "Add Day" to start planning!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {itinerary.days.map((day, dayIndex) => (
                    <div
                      key={day._id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      {/* Day Header */}
                      <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Day {dayIndex + 1} - {day.city}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(day.date)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Budget: ${day.totalBudget || 0}
                            </span>
                            <button
                              onClick={() =>
                                setShowAddActivity({
                                  show: true,
                                  dayId: day._id,
                                })
                              }
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            >
                              <svg
                                className="-ml-0.5 mr-1 h-4 w-4"
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
                              Add Activity
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="p-6">
                        {day.activities.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">
                            No activities planned for this day
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {day.activities.map((activity) => (
                              <div
                                key={activity._id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="text-lg">
                                        {getCategoryIcon(activity.category)}
                                      </span>
                                      <h4 className="font-semibold text-gray-900">
                                        {activity.name}
                                      </h4>
                                      <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                                          activity.category
                                        )}`}
                                      >
                                        {activity.category}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                      <div>
                                        <p>
                                          <strong>Time:</strong>{" "}
                                          {activity.startTime} -{" "}
                                          {activity.endTime}
                                        </p>
                                        {activity.location && (
                                          <p>
                                            <strong>Location:</strong>{" "}
                                            {activity.location}
                                          </p>
                                        )}
                                        {activity.cost > 0 && (
                                          <p>
                                            <strong>Cost:</strong> $
                                            {activity.cost}
                                          </p>
                                        )}
                                      </div>
                                      <div>
                                        {activity.description && (
                                          <p>
                                            <strong>Description:</strong>{" "}
                                            {activity.description}
                                          </p>
                                        )}
                                        {activity.notes && (
                                          <p>
                                            <strong>Notes:</strong>{" "}
                                            {activity.notes}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() =>
                                        setEditingActivity({
                                          show: true,
                                          dayId: day._id,
                                          activityId: activity._id,
                                          data: activity,
                                        })
                                      }
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      <svg
                                        className="w-4 h-4"
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
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteActivity(day._id, activity._id)
                                      }
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <svg
                                        className="w-4 h-4"
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
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Day Modal */}
      {showAddDay && (
        <AddDayModal onClose={() => setShowAddDay(false)} onAdd={addDay} />
      )}

      {/* Add Activity Modal */}
      {showAddActivity.show && (
        <AddActivityModal
          onClose={() => setShowAddActivity({ show: false, dayId: null })}
          onAdd={(data) => addActivity(showAddActivity.dayId, data)}
        />
      )}

      {/* Edit Activity Modal */}
      {editingActivity.show && (
        <EditActivityModal
          activity={editingActivity.data}
          onClose={() =>
            setEditingActivity({
              show: false,
              dayId: null,
              activityId: null,
              data: {},
            })
          }
          onUpdate={(data) =>
            updateActivity(
              editingActivity.dayId,
              editingActivity.activityId,
              data
            )
          }
        />
      )}
    </div>
  );
};

// Add Day Modal Component
const AddDayModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: "",
    city: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Day
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Enter city name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any notes for this day..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Add Day
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add Activity Modal Component
const AddActivityModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    cost: "",
    category: "other",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Activity
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Visit Eiffel Tower"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="sightseeing">🏛️ Sightseeing</option>
                  <option value="food">🍽️ Food</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="entertainment">🎭 Entertainment</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="accommodation">🏨 Accommodation</option>
                  <option value="other">📍 Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Champ de Mars, Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the activity..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional notes, tips, or reminders..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Add Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Activity Modal Component
const EditActivityModal = ({ activity, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: activity.name || "",
    description: activity.description || "",
    startTime: activity.startTime || "",
    endTime: activity.endTime || "",
    location: activity.location || "",
    cost: activity.cost || "",
    category: activity.category || "other",
    notes: activity.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Activity
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="sightseeing">🏛️ Sightseeing</option>
                  <option value="food">🍽️ Food</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="entertainment">🎭 Entertainment</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="accommodation">🏨 Accommodation</option>
                  <option value="other">📍 Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Update Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
