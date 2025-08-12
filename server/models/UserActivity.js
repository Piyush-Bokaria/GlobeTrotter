import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      // Authentication activities
      'login',
      'logout',
      'signup',
      'password_reset',
      'profile_update',
      
      // Search activities
      'city_search',
      'activity_search',
      'hotel_search',
      'external_city_search',
      'filter_applied',
      'search_result_clicked',
      
      // Trip planning activities
      'trip_created',
      'trip_updated',
      'trip_deleted',
      'trip_viewed',
      'trip_shared',
      'trip_duplicated',
      
      // Itinerary activities
      'itinerary_created',
      'itinerary_updated',
      'itinerary_deleted',
      'itinerary_viewed',
      'itinerary_published',
      'itinerary_exported',
      
      // City and Activity management
      'city_added_to_trip',
      'city_removed_from_trip',
      'activity_added_to_trip',
      'activity_removed_from_trip',
      'activity_viewed',
      'city_viewed',
      'hotel_viewed',
      
      // Navigation and page views
      'page_view',
      'dashboard_view',
      'explore_public',
      'admin_dashboard_view',
      
      // Interaction activities
      'button_clicked',
      'modal_opened',
      'modal_closed',
      'filter_toggled',
      'sort_changed',
      'pagination_used',
      
      // External API usage
      'external_api_called',
      'geonames_api_used',
      'osm_api_used',
      
      // Error tracking
      'error_encountered',
      'api_error',
      'validation_error',
      
      // Feature usage
      'feature_used',
      'help_accessed',
      'feedback_submitted'
    ]
  },
  activityData: {
    // Flexible object to store activity-specific data
    searchQuery: String,
    searchFilters: mongoose.Schema.Types.Mixed,
    searchResults: Number,
    
    // Trip related data
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    tripName: String,
    
    // Itinerary related data
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Itinerary'
    },
    
    // City/Activity related data
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City'
    },
    cityName: String,
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    },
    activityName: String,
    
    // Page/Navigation data
    pagePath: String,
    referrer: String,
    userAgent: String,
    
    // Interaction data
    elementId: String,
    elementType: String,
    clickPosition: {
      x: Number,
      y: Number
    },
    
    // Filter/Sort data
    filterType: String,
    filterValue: String,
    sortBy: String,
    sortOrder: String,
    
    // API data
    apiEndpoint: String,
    apiMethod: String,
    apiResponseTime: Number,
    apiStatusCode: Number,
    
    // Error data
    errorMessage: String,
    errorCode: String,
    errorStack: String,
    
    // Additional metadata
    metadata: mongoose.Schema.Types.Mixed,
    duration: Number, // Activity duration in milliseconds
    success: {
      type: Boolean,
      default: true
    }
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    browser: String,
    browserVersion: String,
    screenResolution: String,
    language: String,
    timezone: String,
    isMobile: Boolean,
    isTablet: Boolean,
    isDesktop: Boolean
  },
  location: {
    ip: String,
    country: String,
    city: String,
    region: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // For session tracking
  sessionStartTime: Date,
  sessionEndTime: Date,
  sessionDuration: Number
}, {
  timestamps: true
});

// Indexes for better query performance
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ activityType: 1, timestamp: -1 });
userActivitySchema.index({ sessionId: 1, timestamp: -1 });
userActivitySchema.index({ 'activityData.tripId': 1 });
userActivitySchema.index({ 'activityData.cityName': 1 });
userActivitySchema.index({ 'activityData.pagePath': 1 });
userActivitySchema.index({ timestamp: -1 }); // For recent activities

// Compound indexes for analytics
userActivitySchema.index({ userId: 1, activityType: 1, timestamp: -1 });
userActivitySchema.index({ activityType: 1, 'activityData.success': 1, timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;