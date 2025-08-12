import React, { useState, useEffect } from "react";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [popularContent, setPopularContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7"); // days
  const [groupBy, setGroupBy] = useState("day");
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchAnalytics();
    fetchUserActivities();
    fetchPopularContent();
  }, [timeRange, groupBy]);

  const fetchAnalytics = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const response = await axios.get("http://localhost:5000/apis/user-activity/analytics", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          groupBy
        }
      });

      setAnalytics(response.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to fetch analytics data");
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/apis/user-activity/", {
        params: {
          limit: 50,
          sortBy: "timestamp",
          sortOrder: "desc",
          ...(selectedUserId && { userId: selectedUserId })
        }
      });

      setUserActivities(response.data.activities || []);
    } catch (err) {
      console.error("Error fetching user activities:", err);
    }
  };

  const fetchPopularContent = async () => {
    try {
      const response = await axios.get("http://localhost:5000/apis/user-activity/popular", {
        params: {
          days: timeRange,
          limit: 10
        }
      });

      setPopularContent(response.data.popularContent);
    } catch (err) {
      console.error("Error fetching popular content:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      login: "bg-green-100 text-green-800",
      logout: "bg-red-100 text-red-800",
      city_search: "bg-blue-100 text-blue-800",
      activity_search: "bg-purple-100 text-purple-800",
      trip_created: "bg-indigo-100 text-indigo-800",
      trip_updated: "bg-yellow-100 text-yellow-800",
      error_encountered: "bg-red-100 text-red-800",
      page_view: "bg-gray-100 text-gray-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">User activity and behavior insights</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="activityType">Activity Type</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID (Optional)
            </label>
            <input
              type="text"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="Filter by user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      {analytics?.overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Activities</h3>
            <p className="text-3xl font-bold text-blue-600">
              {analytics.overallStats.totalActivities?.toLocaleString() || 0}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Users</h3>
            <p className="text-3xl font-bold text-green-600">
              {analytics.overallStats.uniqueUsers || 0}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">
              {analytics.overallStats.uniqueSessions || 0}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {analytics.overallStats.successRate?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Popular Cities */}
        {popularContent?.popularCities && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Cities</h3>
            <div className="space-y-3">
              {popularContent.popularCities.slice(0, 10).map((city, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{city.cityName || 'Unknown'}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{city.views} views</span>
                    <span className="text-xs text-gray-500 ml-2">({city.uniqueUsers} users)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Activities */}
        {popularContent?.popularActivities && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Activities</h3>
            <div className="space-y-3">
              {popularContent.popularActivities.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{activity.activityName || 'Unknown'}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{activity.views} views</span>
                    <span className="text-xs text-gray-500 ml-2">({activity.uniqueUsers} users)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
        {analytics?.analytics && analytics.analytics.length > 0 ? (
          <div className="space-y-4">
            {analytics.analytics.slice(0, 20).map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {groupBy === 'activityType' ? formatActivityType(item._id) : 
                       typeof item._id === 'object' ? 
                       `${item._id.year}-${String(item._id.month || item._id.week || item._id.day).padStart(2, '0')}${item._id.day ? `-${String(item._id.day).padStart(2, '0')}` : ''}` :
                       item._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.count} activities • {item.uniqueUsers} users • {item.uniqueSessions} sessions
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No activity data available for the selected time range.</p>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userActivities.slice(0, 20).map((activity) => (
                <tr key={activity._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getActivityTypeColor(activity.activityType)}`}>
                      {formatActivityType(activity.activityType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.userId?.name || activity.userId || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {activity.activityData?.searchQuery && (
                      <span>Query: "{activity.activityData.searchQuery}"</span>
                    )}
                    {activity.activityData?.cityName && (
                      <span>City: {activity.activityData.cityName}</span>
                    )}
                    {activity.activityData?.tripName && (
                      <span>Trip: {activity.activityData.tripName}</span>
                    )}
                    {activity.activityData?.pagePath && (
                      <span>Page: {activity.activityData.pagePath}</span>
                    )}
                    {activity.activityData?.errorMessage && (
                      <span className="text-red-600">Error: {activity.activityData.errorMessage}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;