import React from 'react';

const ActivityBlock = ({ activity, showTime = true, showCost = true }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Sightseeing': '🏛️',
      'Dining': '🍽️',
      'Culture': '🎨',
      'Adventure': '🏔️',
      'Shopping': '🛍️',
      'Transportation': '🚗',
      'Accommodation': '🏨',
      'Entertainment': '🎭'
    };
    return icons[category] || '📍';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Sightseeing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Dining': 'bg-orange-100 text-orange-800 border-orange-200',
      'Culture': 'bg-purple-100 text-purple-800 border-purple-200',
      'Adventure': 'bg-green-100 text-green-800 border-green-200',
      'Shopping': 'bg-pink-100 text-pink-800 border-pink-200',
      'Transportation': 'bg-gray-100 text-gray-800 border-gray-200',
      'Accommodation': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Entertainment': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getConfirmationStatus = (status) => {
    const statusConfig = {
      'confirmed': { color: 'text-green-600', icon: '✓', text: 'Confirmed' },
      'pending': { color: 'text-yellow-600', icon: '⏳', text: 'Pending' },
      'cancelled': { color: 'text-red-600', icon: '✗', text: 'Cancelled' }
    };
    return statusConfig[status] || statusConfig['pending'];
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const confirmationStatus = getConfirmationStatus(activity.confirmationStatus);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Activity Header */}
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg">{getCategoryIcon(activity.category)}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{activity.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </span>
                <span className={`inline-flex items-center text-xs font-medium ${confirmationStatus.color}`}>
                  <span className="mr-1">{confirmationStatus.icon}</span>
                  {confirmationStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Description */}
          {activity.description && (
            <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
          )}

          {/* Time and Duration */}
          {showTime && (activity.startTime || activity.duration) && (
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              {activity.startTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {formatTime(activity.startTime)}
                    {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                  </span>
                </div>
              )}
              {activity.duration && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {activity.location && activity.location.address && (
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{activity.location.address}</span>
            </div>
          )}

          {/* Notes */}
          {activity.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-800 text-sm">{activity.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cost Information */}
        {showCost && activity.cost && activity.cost.amount > 0 && (
          <div className="ml-4 text-right">
            <div className="text-lg font-semibold text-gray-900">
              ${activity.cost.amount}
            </div>
            <div className="text-xs text-gray-500">
              {activity.cost.currency || 'USD'}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          View Details
        </button>
        {activity.confirmationStatus === 'pending' && (
          <button className="text-sm text-green-600 hover:text-green-800 font-medium">
            Confirm
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityBlock;