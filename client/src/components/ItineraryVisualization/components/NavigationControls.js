import React, { useState } from 'react';

const NavigationControls = ({ days, selectedDay, onDaySelect }) => {
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handlePreviousDay = () => {
    if (selectedDay > 1) {
      onDaySelect(selectedDay - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDay < days.length) {
      onDaySelect(selectedDay + 1);
    }
  };

  const handleDayClick = (dayNumber) => {
    onDaySelect(dayNumber);
    setShowMiniCalendar(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Quick Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousDay}
          disabled={selectedDay <= 1}
          className={`p-2 rounded-md transition-colors ${
            selectedDay <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="Previous day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Current Day Display */}
        <div className="relative">
          <button
            onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                Day {selectedDay}
              </div>
              <div className="text-xs text-gray-500">
                {days[selectedDay - 1] && formatDateShort(days[selectedDay - 1].date)}
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mini Calendar Dropdown */}
          {showMiniCalendar && (
            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-80">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Select Day</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {days.map((day) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => handleDayClick(day.dayNumber)}
                    className={`p-3 text-left rounded-md border transition-colors ${
                      selectedDay === day.dayNumber
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          Day {day.dayNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getDayOfWeek(day.date)}, {formatDateShort(day.date)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {day.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {day.activities.length} activities
                        </div>
                        {day.activities.some(a => a.cost?.amount > 0) && (
                          <div className="text-xs font-medium text-gray-700">
                            ${day.activities.reduce((sum, a) => sum + (a.cost?.amount || 0), 0).toFixed(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Close button */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowMiniCalendar(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleNextDay}
          disabled={selectedDay >= days.length}
          className={`p-2 rounded-md transition-colors ${
            selectedDay >= days.length
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="Next day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Trip Progress */}
      <div className="hidden md:flex items-center space-x-3">
        <div className="text-sm text-gray-500">
          {selectedDay} of {days.length} days
        </div>
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(selectedDay / days.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Jump to Today (if applicable) */}
      {days.some(day => {
        const today = new Date();
        const dayDate = new Date(day.date);
        return dayDate.toDateString() === today.toDateString();
      }) && (
        <button
          onClick={() => {
            const todayDay = days.find(day => {
              const today = new Date();
              const dayDate = new Date(day.date);
              return dayDate.toDateString() === today.toDateString();
            });
            if (todayDay) {
              onDaySelect(todayDay.dayNumber);
            }
          }}
          className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-md hover:bg-indigo-50"
        >
          Today
        </button>
      )}

      {/* Overlay to close mini calendar */}
      {showMiniCalendar && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMiniCalendar(false)}
        ></div>
      )}
    </div>
  );
};

export default NavigationControls;