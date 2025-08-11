import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tripStats, setTripStats] = useState({
    upcoming: 0,
    completed: 0,
    total: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchTripStats();
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, []);

  const fetchTripStats = async () => {
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

        // Calculate trip statistics
        const upcomingTrips = allTrips.filter(
          (trip) => new Date(trip.startDate) >= today
        );
        const completedTrips = allTrips.filter(
          (trip) => new Date(trip.endDate) < today
        );

        setTripStats({
          upcoming: upcomingTrips.length,
          completed: completedTrips.length,
          total: allTrips.length,
        });
      }
    } catch (error) {
      console.error("Error fetching trip stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
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
              <h1 className="text-xl font-semibold text-gray-900">
                GlobeTrotter
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <a
                href="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <svg
                  className="w-5 h-5 mr-1"
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
              </a>
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to GlobeTrotter Dashboard!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your travel planning journey starts here.
              </p>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Trip Statistics
                </h3>
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {tripStats.upcoming}
                      </p>
                      <p className="text-sm text-gray-500">Upcoming</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {tripStats.completed}
                      </p>
                      <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">
                        {tripStats.total}
                      </p>
                      <p className="text-sm text-gray-500">Total</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Plan a Trip
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Start planning your next adventure
                  </p>
                  <a
                    href="/create-trip"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Create New Trip
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    My Trips
                  </h4>
                  <p className="text-gray-600 mb-4">
                    View your saved trips and itineraries
                  </p>
                  <a
                    href="/trips"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    View Trips
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Explore
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Discover new destinations and experiences
                  </p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
