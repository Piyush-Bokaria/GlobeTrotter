import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useActivityTracker } from "../../hooks/useActivityTracker";

const ActivitySearch = ({ onAddActivity, selectedCity, tripId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [costRange, setCostRange] = useState("");
  const [durationRange, setDurationRange] = useState({ min: "", max: "" });
  const [difficulty, setDifficulty] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);

  // Activity tracking
  const {
    trackSearch,
    trackClick,
    trackActivityAction,
    trackError,
    trackFeatureUsage,
    trackFilterChange,
    trackSortChange,
    trackModalAction
  } = useActivityTracker();

  // Debounce search to avoid too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Fetch activities with filters
  const fetchActivities = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCity) params.append("city", selectedCity);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedType) params.append("type", selectedType);
      if (costRange) params.append("costRange", costRange);
      if (durationRange.min) params.append("minDuration", durationRange.min);
      if (durationRange.max) params.append("maxDuration", durationRange.max);
      if (difficulty) params.append("difficulty", difficulty);
      if (ageGroup) params.append("ageGroup", ageGroup);
      if (sortBy) params.append("sortBy", sortBy);
      params.append("page", page);
      params.append("limit", "12");

      const response = await axios.get(`http://localhost:5000/apis/activities?${params}`);
      setActivities(response.data.activities || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalActivities(response.data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('Fetch activities error:', err);
      setError(err.response?.data?.message || "Failed to fetch activities");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/apis/activities/categories");
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch cities with activities
  const fetchCities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/apis/activities/cities");
      setCities(response.data.cities || []);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(() => {
      fetchActivities(1);
    }, 800),
    [searchTerm, selectedCategory, selectedType, costRange, durationRange, difficulty, ageGroup, sortBy, selectedCity]
  );

  // Effect for search
  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, selectedCategory, selectedType, costRange, durationRange, difficulty, ageGroup, sortBy, selectedCity]);

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchCities();
    fetchActivities();
  }, []);

  const handleAddActivity = async (activity) => {
    try {
      if (onAddActivity) {
        await onAddActivity(activity);
      }
    } catch (err) {
      setError("Failed to add activity to trip");
    }
  };

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const closeActivityModal = () => {
    setShowActivityModal(false);
    setSelectedActivity(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
    setCostRange("");
    setDurationRange({ min: "", max: "" });
    setDifficulty("");
    setAgeGroup("");
    setSortBy("rating");
  };

  const getCostRangeLabel = (range) => {
    const labels = {
      free: "Free",
      budget: "Budget ($)",
      moderate: "Moderate ($$)",
      expensive: "Expensive ($$$)",
      luxury: "Luxury ($$$$)"
    };
    return labels[range] || range;
  };

  const getDifficultyColor = (diff) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      moderate: "bg-yellow-100 text-yellow-800",
      challenging: "bg-orange-100 text-orange-800",
      extreme: "bg-red-100 text-red-800"
    };
    return colors[diff] || "bg-gray-100 text-gray-800";
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours === 1) return "1 hour";
    if (hours < 24) return `${hours} hours`;
    return `${Math.round(hours / 24)} day${hours > 24 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Discover Activities</h2>
          {selectedCity && (
            <p className="text-gray-600 mt-1">Activities in {selectedCity}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search activities by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Cost Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Range</label>
              <select
                value={costRange}
                onChange={(e) => setCostRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="budget">Budget ($)</option>
                <option value="moderate">Moderate ($$)</option>
                <option value="expensive">Expensive ($$$)</option>
                <option value="luxury">Luxury ($$$$)</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="duration-short">Duration (Short)</option>
                <option value="duration-long">Duration (Long)</option>
                <option value="cost-low">Cost (Low)</option>
                <option value="cost-high">Cost (High)</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0.5"
                  step="0.5"
                  value={durationRange.min}
                  onChange={(e) => setDurationRange({ ...durationRange, min: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0.5"
                  step="0.5"
                  value={durationRange.max}
                  onChange={(e) => setDurationRange({ ...durationRange, max: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading activities...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Results Info */}
      {!loading && activities.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Showing {activities.length} of {totalActivities} activities
            {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && activities.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No activities found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {activities.map((activity) => (
          <div key={activity._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Activity Image */}
            <div className="h-48 bg-gray-200 relative">
              {activity.images && activity.images.length > 0 ? (
                <img
                  src={activity.images[0].url}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/200';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Featured Badge */}
              {activity.featured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}
              
              {/* Rating */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                <span className="text-sm">★ {activity.rating.average.toFixed(1)}</span>
              </div>
            </div>

            <div className="p-4">
              {/* Activity Header */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{activity.name}</h3>
                <p className="text-sm text-gray-600">{activity.location.city}, {activity.location.country}</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {activity.description}
              </p>

              {/* Activity Details */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {activity.category.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {formatDuration(activity.duration.hours)}
                </span>
              </div>

              {/* Cost and Duration */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Cost:</span>
                  <div className="text-sm text-gray-600">
                    {getCostRangeLabel(activity.cost.range)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <div className="text-sm text-gray-600 capitalize">
                    {activity.type}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewActivity(activity)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddActivity(activity)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Add to Trip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => fetchActivities(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => fetchActivities(page)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => fetchActivities(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Activity Details Modal */}
      {showActivityModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedActivity.name}
              </h3>
              <button
                onClick={closeActivityModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Activity Image */}
              {selectedActivity.images && selectedActivity.images.length > 0 && (
                <div className="mb-6">
                  <img
                    src={selectedActivity.images[0].url}
                    alt={selectedActivity.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/800/300';
                    }}
                  />
                </div>
              )}

              {/* Activity Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Description</h4>
                  <p className="text-gray-600 mb-4">{selectedActivity.description}</p>
                  
                  <h4 className="text-lg font-semibold mb-3">Details</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Category:</span> {selectedActivity.category.replace('-', ' ')}</p>
                    <p><span className="font-medium">Type:</span> {selectedActivity.type}</p>
                    <p><span className="font-medium">Duration:</span> {selectedActivity.duration.description || formatDuration(selectedActivity.duration.hours)}</p>
                    <p><span className="font-medium">Difficulty:</span> {selectedActivity.difficulty}</p>
                    <p><span className="font-medium">Age Group:</span> {selectedActivity.ageGroup.replace('-', ' ')}</p>
                    <p><span className="font-medium">Cost:</span> {getCostRangeLabel(selectedActivity.cost.range)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Location</h4>
                  <div className="space-y-2 mb-4">
                    <p><span className="font-medium">City:</span> {selectedActivity.location.city}</p>
                    <p><span className="font-medium">Country:</span> {selectedActivity.location.country}</p>
                    {selectedActivity.location.address && (
                      <p><span className="font-medium">Address:</span> {selectedActivity.location.address}</p>
                    )}
                  </div>
                  
                  {selectedActivity.tags && selectedActivity.tags.length > 0 && (
                    <>
                      <h4 className="text-lg font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedActivity.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleAddActivity(selectedActivity);
                        closeActivityModal();
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Add to Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;