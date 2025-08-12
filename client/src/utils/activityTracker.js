import axios from 'axios';

class ActivityTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.deviceInfo = this.getDeviceInfo();
    this.location = null;
    this.activityQueue = [];
    this.isOnline = navigator.onLine;
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
    
    this.init();
  }

  init() {
    // Get user ID from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.userId = JSON.parse(user).id;
      } catch (e) {
        console.warn('Failed to parse user data for activity tracking');
      }
    }

    // Set up periodic flushing
    setInterval(() => {
      this.flushActivities();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushActivities(true);
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushActivities();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Track page views automatically
    this.trackPageView();
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden');
      } else {
        this.track('page_visible');
      }
    });
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getDeviceInfo() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Simple device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(ua);
    const isDesktop = !isMobile && !isTablet;

    // Simple browser detection
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (ua.includes('Chrome')) {
      browser = 'Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Safari')) {
      browser = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Edge')) {
      browser = 'Edge';
      browserVersion = ua.match(/Edge\/([0-9.]+)/)?.[1] || 'Unknown';
    }

    return {
      userAgent: ua,
      platform,
      browser,
      browserVersion,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language,
      timezone,
      isMobile,
      isTablet,
      isDesktop
    };
  }

  async getLocation() {
    if (this.location) return this.location;
    
    try {
      // Try to get IP-based location (you can use a service like ipapi.co)
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        this.location = {
          ip: data.ip,
          country: data.country_name,
          city: data.city,
          region: data.region,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude
          }
        };
      }
    } catch (error) {
      console.warn('Failed to get location for activity tracking:', error);
      this.location = {};
    }
    
    return this.location;
  }

  // Main tracking method
  async track(activityType, activityData = {}, options = {}) {
    try {
      const activity = {
        activityType,
        activityData: {
          ...activityData,
          pagePath: window.location.pathname,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        },
        deviceInfo: this.deviceInfo,
        location: await this.getLocation(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      // Add to queue
      this.activityQueue.push(activity);

      // Flush immediately if specified or queue is full
      if (options.immediate || this.activityQueue.length >= this.batchSize) {
        await this.flushActivities();
      }

      return true;
    } catch (error) {
      console.error('Error tracking activity:', error);
      return false;
    }
  }

  // Flush activities to server
  async flushActivities(isUnloading = false) {
    if (this.activityQueue.length === 0 || (!this.isOnline && !isUnloading)) {
      return;
    }

    const activitiesToSend = [...this.activityQueue];
    this.activityQueue = [];

    try {
      if (isUnloading && navigator.sendBeacon) {
        // Use sendBeacon for page unload
        navigator.sendBeacon(
          'http://localhost:5000/apis/user-activity/log-batch',
          JSON.stringify({ activities: activitiesToSend })
        );
      } else {
        await axios.post('http://localhost:5000/apis/user-activity/log-batch', {
          activities: activitiesToSend
        });
      }
    } catch (error) {
      console.error('Error flushing activities:', error);
      // Re-add failed activities to queue if not unloading
      if (!isUnloading) {
        this.activityQueue.unshift(...activitiesToSend);
      }
    }
  }

  // Specific tracking methods for common activities
  trackPageView(pagePath = window.location.pathname) {
    this.track('page_view', {
      pagePath,
      title: document.title,
      referrer: document.referrer
    });
  }

  trackSearch(searchType, query, filters = {}, results = 0) {
    this.track(`${searchType}_search`, {
      searchQuery: query,
      searchFilters: filters,
      searchResults: results
    });
  }

  trackClick(elementId, elementType, position = {}) {
    this.track('button_clicked', {
      elementId,
      elementType,
      clickPosition: position
    });
  }

  trackTripAction(action, tripId, tripName, additionalData = {}) {
    this.track(`trip_${action}`, {
      tripId,
      tripName,
      ...additionalData
    });
  }

  trackItineraryAction(action, itineraryId, additionalData = {}) {
    this.track(`itinerary_${action}`, {
      itineraryId,
      ...additionalData
    });
  }

  trackCityAction(action, cityId, cityName, additionalData = {}) {
    this.track(`city_${action}`, {
      cityId,
      cityName,
      ...additionalData
    });
  }

  trackActivityAction(action, activityId, activityName, additionalData = {}) {
    this.track(`activity_${action}`, {
      activityId,
      activityName,
      ...additionalData
    });
  }

  trackError(errorType, errorMessage, errorCode = null, additionalData = {}) {
    this.track('error_encountered', {
      errorMessage,
      errorCode,
      errorType,
      ...additionalData
    }, { immediate: true });
  }

  trackAPICall(endpoint, method, responseTime, statusCode, success = true) {
    this.track('external_api_called', {
      apiEndpoint: endpoint,
      apiMethod: method,
      apiResponseTime: responseTime,
      apiStatusCode: statusCode,
      success
    });
  }

  trackFeatureUsage(featureName, additionalData = {}) {
    this.track('feature_used', {
      featureName,
      ...additionalData
    });
  }

  trackFilterChange(filterType, filterValue, additionalData = {}) {
    this.track('filter_applied', {
      filterType,
      filterValue,
      ...additionalData
    });
  }

  trackSortChange(sortBy, sortOrder, additionalData = {}) {
    this.track('sort_changed', {
      sortBy,
      sortOrder,
      ...additionalData
    });
  }

  trackModalAction(action, modalType, additionalData = {}) {
    this.track(`modal_${action}`, {
      modalType,
      ...additionalData
    });
  }

  // Update user ID when user logs in/out
  setUserId(userId) {
    this.userId = userId;
  }

  // Get current session statistics
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      queuedActivities: this.activityQueue.length,
      deviceInfo: this.deviceInfo,
      isOnline: this.isOnline
    };
  }
}

// Create singleton instance
const activityTracker = new ActivityTracker();

export default activityTracker;