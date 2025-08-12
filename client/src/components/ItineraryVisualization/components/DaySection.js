import React from 'react';
import ActivityBlock from './ActivityBlock';

const DaySection = ({ day, viewMode, isActive, onActivityClick }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const sortActivitiesByTime = (activities) => {
    return [...activities].sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const calculateDayTotal = (activities) => {
    return activities.reduce((total, activity) => {
      return total + (activity.cost?.amount || 0);
    }, 0);
  };

  const sortedActivities = sortActivitiesByTime(day.activities);
  const dayTotal = calculateDayTotal(day.activities);

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
      isActive ? 'border-indigo-300 shadow-md' : 'border-gray-200'
    }`}>
      {/* Day Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {day.dayNumber}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Day {day.dayNumber}
                </h2>
                <p className="text-sm text-gray-600">
                  {formatDate(day.date)}
                </p>
              </div>
            </div>
            
            {/* Day Stats */}
            <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{day.activities.length} activities</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{day.city}</span>
              </div>
            </div>
          </div>

          {/* Day Total Cost */}
          {dayTotal > 0 && (
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                ${dayTotal.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                Daily Total
              </div>
            </div>
          )}
        </div>

        {/* Mobile Stats */}
        <div className="sm:hidden mt-3 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{day.activities.length} activities</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{day.city}</span>
          </div>
        </div>

        {/* Day Notes */}
        {day.notes && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">{day.notes}</p>
          </div>
        )}
      </div>

      {/* Activities List */}
      <div className="p-6">
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No activities planned for this day</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Add Activity
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline connector */}
                {index < sortedActivities.length - 1 && viewMode === 'list' && (
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-200 z-0"></div>
                )}
                
                <div 
                  className="relative z-10 cursor-pointer"
                  onClick={() => onActivityClick(activity)}
                >
                  <ActivityBlock
                    activity={activity}
                    showTime={true}
                    showCost={true}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day Summary Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-600">
            <span>
              {sortedActivities.filter(a => a.startTime).length} scheduled activities
            </span>
            <span>•</span>
            <span>
              {sortedActivities.filter(a => a.confirmationStatus === 'confirmed').length} confirmed
            </span>
          </div>
          
          {sortedActivities.some(a => a.confirmationStatus === 'pending') && (
            <div className="flex items-center text-yellow-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium">
                {sortedActivities.filter(a => a.confirmationStatus === 'pending').length} pending confirmation
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaySection;