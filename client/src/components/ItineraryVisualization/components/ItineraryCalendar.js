import React from 'react';
import ActivityBlock from './ActivityBlock';

const ItineraryCalendar = ({ tripData, selectedDay, onActivityClick }) => {
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getActivityPosition = (activity) => {
    if (!activity.startTime) return null;
    
    const [hours, minutes] = activity.startTime.split(':');
    const startHour = parseInt(hours);
    const startMinutes = parseInt(minutes);
    
    // Calculate position based on 6 AM start (index 0)
    const hourIndex = startHour - 6;
    if (hourIndex < 0 || hourIndex >= timeSlots.length) return null;
    
    const minuteOffset = (startMinutes / 60) * 100; // Convert to percentage of hour
    
    return {
      top: `${(hourIndex * 100) + (minuteOffset / 60 * 100)}px`,
      height: activity.duration ? `${(activity.duration / 60) * 100}px` : '100px'
    };
  };

  const getActivitiesForTimeSlot = (timeSlot, day) => {
    return day.activities.filter(activity => {
      if (!activity.startTime) return false;
      const activityHour = parseInt(activity.startTime.split(':')[0]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return activityHour === slotHour;
    });
  };

  const getUnscheduledActivities = (day) => {
    return day.activities.filter(activity => !activity.startTime);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Calendar View</h2>
        <p className="text-sm text-gray-600 mt-1">
          Timeline view of your daily activities
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {tripData.days.map((day) => (
            <div
              key={day.dayNumber}
              className={`border rounded-lg ${
                selectedDay === day.dayNumber
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Day Header */}
              <div className={`px-4 py-3 border-b ${
                selectedDay === day.dayNumber
                  ? 'border-indigo-200 bg-indigo-100'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    Day {day.dayNumber}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {day.city}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="relative h-96 overflow-y-auto">
                {/* Time Grid */}
                <div className="absolute inset-0">
                  {timeSlots.map((timeSlot, index) => (
                    <div
                      key={timeSlot}
                      className="relative border-b border-gray-100"
                      style={{ height: '100px' }}
                    >
                      <div className="absolute left-2 top-1 text-xs text-gray-500 font-medium">
                        {formatTime(timeSlot)}
                      </div>
                      
                      {/* Activities in this time slot */}
                      <div className="ml-12 mr-2 mt-1">
                        {getActivitiesForTimeSlot(timeSlot, day).map((activity) => (
                          <div
                            key={activity.id}
                            className="mb-1 cursor-pointer"
                            onClick={() => onActivityClick(activity)}
                          >
                            <div className="bg-indigo-100 border border-indigo-200 rounded p-2 text-xs hover:bg-indigo-200 transition-colors">
                              <div className="font-medium text-indigo-900 truncate">
                                {activity.name}
                              </div>
                              <div className="text-indigo-700 mt-1">
                                {activity.startTime} - {activity.endTime}
                              </div>
                              {activity.cost?.amount > 0 && (
                                <div className="text-indigo-600 font-medium">
                                  ${activity.cost.amount}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unscheduled Activities */}
              {getUnscheduledActivities(day).length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-yellow-50">
                  <div className="text-xs font-medium text-yellow-800 mb-2">
                    Unscheduled ({getUnscheduledActivities(day).length})
                  </div>
                  <div className="space-y-1">
                    {getUnscheduledActivities(day).map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-yellow-100 border border-yellow-200 rounded p-2 text-xs cursor-pointer hover:bg-yellow-200 transition-colors"
                        onClick={() => onActivityClick(activity)}
                      >
                        <div className="font-medium text-yellow-900 truncate">
                          {activity.name}
                        </div>
                        {activity.cost?.amount > 0 && (
                          <div className="text-yellow-700 font-medium">
                            ${activity.cost.amount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Calendar View */}
        <div className="lg:hidden mt-8">
          <div className="space-y-6">
            {tripData.days.map((day) => (
              <div key={day.dayNumber} className="bg-white border border-gray-200 rounded-lg">
                {/* Mobile Day Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Day {day.dayNumber} - {day.city}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {day.activities.length} activities
                    </div>
                  </div>
                </div>

                {/* Mobile Activities */}
                <div className="p-4 space-y-3">
                  {day.activities.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No activities planned
                    </div>
                  ) : (
                    day.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="cursor-pointer"
                        onClick={() => onActivityClick(activity)}
                      >
                        <ActivityBlock
                          activity={activity}
                          showTime={true}
                          showCost={true}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-200 rounded mr-2"></div>
              <span className="text-gray-600">Scheduled Activities</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-200 rounded mr-2"></div>
              <span className="text-gray-600">Unscheduled Activities</span>
            </div>
          </div>
          <div className="text-gray-500">
            Times shown in local timezone
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCalendar;