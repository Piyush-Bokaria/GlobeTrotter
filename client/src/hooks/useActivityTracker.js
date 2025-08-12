import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import activityTracker from '../utils/activityTracker';

export const useActivityTracker = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    activityTracker.trackPageView(location.pathname);
  }, [location.pathname]);

  // Tracking methods
  const trackSearch = useCallback((searchType, query, filters = {}, results = 0) => {
    activityTracker.trackSearch(searchType, query, filters, results);
  }, []);

  const trackClick = useCallback((elementId, elementType, event) => {
    const position = event ? { x: event.clientX, y: event.clientY } : {};
    activityTracker.trackClick(elementId, elementType, position);
  }, []);

  const trackTripAction = useCallback((action, tripId, tripName, additionalData = {}) => {
    activityTracker.trackTripAction(action, tripId, tripName, additionalData);
  }, []);

  const trackItineraryAction = useCallback((action, itineraryId, additionalData = {}) => {
    activityTracker.trackItineraryAction(action, itineraryId, additionalData);
  }, []);

  const trackCityAction = useCallback((action, cityId, cityName, additionalData = {}) => {
    activityTracker.trackCityAction(action, cityId, cityName, additionalData);
  }, []);

  const trackActivityAction = useCallback((action, activityId, activityName, additionalData = {}) => {
    activityTracker.trackActivityAction(action, activityId, activityName, additionalData);
  }, []);

  const trackError = useCallback((errorType, errorMessage, errorCode = null, additionalData = {}) => {
    activityTracker.trackError(errorType, errorMessage, errorCode, additionalData);
  }, []);

  const trackFeatureUsage = useCallback((featureName, additionalData = {}) => {
    activityTracker.trackFeatureUsage(featureName, additionalData);
  }, []);

  const trackFilterChange = useCallback((filterType, filterValue, additionalData = {}) => {
    activityTracker.trackFilterChange(filterType, filterValue, additionalData);
  }, []);

  const trackSortChange = useCallback((sortBy, sortOrder, additionalData = {}) => {
    activityTracker.trackSortChange(sortBy, sortOrder, additionalData);
  }, []);

  const trackModalAction = useCallback((action, modalType, additionalData = {}) => {
    activityTracker.trackModalAction(action, modalType, additionalData);
  }, []);

  const trackCustom = useCallback((activityType, activityData = {}, options = {}) => {
    activityTracker.track(activityType, activityData, options);
  }, []);

  return {
    trackSearch,
    trackClick,
    trackTripAction,
    trackItineraryAction,
    trackCityAction,
    trackActivityAction,
    trackError,
    trackFeatureUsage,
    trackFilterChange,
    trackSortChange,
    trackModalAction,
    trackCustom
  };
};

export default useActivityTracker;