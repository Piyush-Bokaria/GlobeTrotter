import React from 'react';

const CityHeader = ({ city, duration, activities }) => {
  const getTotalCost = () => {
    return activities.reduce((total, activity) => {
      return total + (activity.cost?.amount || 0);
    }, 0);
  };

  // removed unused getTotalCount

  const getCityIcon = (cityName) => {
    // You could implement a more sophisticated city icon mapping
    const cityIcons = {
      'Paris': '🗼',
      'London': '🏰',
      'Tokyo': '🏯',
      'New York': '🗽',
      'Rome': '🏛️',
      'Barcelona': '🏖️',
      'Amsterdam': '🌷',
      'Sydney': '🏄‍♂️'
    };
    return cityIcons[cityName] || '🏙️';
  };

  const totalCost = getTotalCost();

  return (
    <div className="relative mb-6">
      {/* City Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg text-white overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">
                {getCityIcon(city)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{city}</h2>
                <div className="flex items-center space-x-4 text-indigo-100">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {duration} {duration === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{activities.length} activities</span>
                  </div>
                </div>
              </div>
            </div>

            {/* City Stats */}
            <div className="text-right">
              {totalCost > 0 && (
                <div className="mb-2">
                  <div className="text-2xl font-bold">
                    ${totalCost.toFixed(2)}
                  </div>
                  <div className="text-sm text-indigo-100">
                    Total Budget
                  </div>
                </div>
              )}
              
              {/* Activity Categories */}
              <div className="flex flex-wrap gap-1 justify-end">
                {[...new Set(activities.map(a => a.category))].slice(0, 3).map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white"
                  >
                    {category}
                  </span>
                ))}
                {[...new Set(activities.map(a => a.category))].length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                    +{[...new Set(activities.map(a => a.category))].length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* City Description or Highlights */}
          <div className="mt-4 pt-4 border-t border-indigo-400 border-opacity-30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-indigo-100">
                  {activities.filter(a => a.confirmationStatus === 'confirmed').length} confirmed bookings
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-indigo-100">
                  {activities.filter(a => a.startTime).length} scheduled activities
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-indigo-100">
                  {activities.filter(a => a.notes).length} with special notes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-16 h-16 bg-white bg-opacity-5 rounded-full"></div>
      </div>

      {/* Travel Transition Indicator */}
      <div className="flex justify-center mt-4 mb-2">
        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="text-sm text-gray-600 font-medium">Exploring {city}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CityHeader;