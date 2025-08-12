import UserActivity from "../models/UserActivity.js";
import mongoose from "mongoose";

// Log user activity
export const logActivity = async (req, res) => {
  try {
    const {
      activityType,
      activityData = {},
      deviceInfo = {},
      location = {}
    } = req.body;

    const userId = req.user?.id || req.body.userId;
    const sessionId = req.sessionID || req.body.sessionId || `session_${Date.now()}_${Math.random()}`;

    if (!activityType) {
      return res.status(400).json({
        success: false,
        message: 'Activity type is required'
      });
    }

    const activity = new UserActivity({
      userId,
      sessionId,
      activityType,
      activityData,
      deviceInfo,
      location,
      timestamp: new Date()
    });

    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      activityId: activity._id
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging activity',
      error: error.message
    });
  }
};

// Batch log multiple activities
export const logBatchActivities = async (req, res) => {
  try {
    const { activities } = req.body;
    const userId = req.user?.id || req.body.userId;
    const sessionId = req.sessionID || req.body.sessionId || `session_${Date.now()}_${Math.random()}`;

    if (!Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Activities array is required'
      });
    }

    const activityDocs = activities.map(activity => ({
      userId,
      sessionId,
      activityType: activity.activityType,
      activityData: activity.activityData || {},
      deviceInfo: activity.deviceInfo || {},
      location: activity.location || {},
      timestamp: activity.timestamp || new Date()
    }));

    const savedActivities = await UserActivity.insertMany(activityDocs);

    res.status(201).json({
      success: true,
      message: `${savedActivities.length} activities logged successfully`,
      count: savedActivities.length
    });
  } catch (error) {
    console.error('Error logging batch activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging batch activities',
      error: error.message
    });
  }
};

// Get user activities with filtering and pagination
export const getUserActivities = async (req, res) => {
  try {
    const {
      userId,
      activityType,
      startDate,
      endDate,
      sessionId,
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Build query
    if (userId) {
      query.userId = userId;
    }
    if (activityType) {
      query.activityType = activityType;
    }
    if (sessionId) {
      query.sessionId = sessionId;
    }
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activities, total] = await Promise.all([
      UserActivity.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email')
        .populate('activityData.tripId', 'name description')
        .populate('activityData.cityId', 'name country')
        .populate('activityData.activityId', 'name category'),
      UserActivity.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activities',
      error: error.message
    });
  }
};

// Get activity analytics
export const getActivityAnalytics = async (req, res) => {
  try {
    const {
      userId,
      startDate,
      endDate,
      groupBy = 'day' // day, week, month, activityType
    } = req.query;

    let matchQuery = {};
    if (userId) matchQuery.userId = new mongoose.Types.ObjectId(userId);
    if (startDate || endDate) {
      matchQuery.timestamp = {};
      if (startDate) matchQuery.timestamp.$gte = new Date(startDate);
      if (endDate) matchQuery.timestamp.$lte = new Date(endDate);
    }

    let groupByExpression;
    switch (groupBy) {
      case 'hour':
        groupByExpression = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' }
        };
        break;
      case 'day':
        groupByExpression = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
        break;
      case 'week':
        groupByExpression = {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' }
        };
        break;
      case 'month':
        groupByExpression = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' }
        };
        break;
      case 'activityType':
        groupByExpression = '$activityType';
        break;
      default:
        groupByExpression = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
    }

    const analytics = await UserActivity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupByExpression,
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueSessions: { $addToSet: '$sessionId' },
          activities: { $push: '$activityType' }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          uniqueSessions: { $size: '$uniqueSessions' },
          topActivities: {
            $slice: [
              {
                $map: {
                  input: {
                    $setUnion: ['$activities']
                  },
                  as: 'activity',
                  in: {
                    type: '$$activity',
                    count: {
                      $size: {
                        $filter: {
                          input: '$activities',
                          cond: { $eq: ['$$this', '$$activity'] }
                        }
                      }
                    }
                  }
                }
              },
              5
            ]
          }
        }
      },
      { $sort: { '_id': -1 } }
    ]);

    // Get overall statistics
    const overallStats = await UserActivity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueSessions: { $addToSet: '$sessionId' },
          activityTypes: { $addToSet: '$activityType' },
          avgSessionDuration: { $avg: '$sessionDuration' },
          successRate: {
            $avg: {
              $cond: [{ $eq: ['$activityData.success', true] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalActivities: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          uniqueSessions: { $size: '$uniqueSessions' },
          uniqueActivityTypes: { $size: '$activityTypes' },
          avgSessionDuration: { $round: ['$avgSessionDuration', 2] },
          successRate: { $multiply: ['$successRate', 100] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics,
      overallStats: overallStats[0] || {},
      groupBy,
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    console.error('Error fetching activity analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity analytics',
      error: error.message
    });
  }
};

// Get user behavior insights
export const getUserBehaviorInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const insights = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          timestamp: { $gte: startDate }
        }
      },
      {
        $facet: {
          // Most active times
          activeHours: [
            {
              $group: {
                _id: { $hour: '$timestamp' },
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
          
          // Most used features
          topFeatures: [
            {
              $group: {
                _id: '$activityType',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          
          // Search patterns
          searchPatterns: [
            {
              $match: {
                activityType: { $in: ['city_search', 'activity_search'] }
              }
            },
            {
              $group: {
                _id: '$activityData.searchQuery',
                count: { $sum: 1 },
                lastSearched: { $max: '$timestamp' }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          
          // Trip planning activity
          tripActivity: [
            {
              $match: {
                activityType: { $in: ['trip_created', 'trip_updated', 'trip_viewed'] }
              }
            },
            {
              $group: {
                _id: '$activityType',
                count: { $sum: 1 }
              }
            }
          ],
          
          // Device usage
          deviceUsage: [
            {
              $group: {
                _id: '$deviceInfo.isMobile',
                count: { $sum: 1 }
              }
            }
          ],
          
          // Session statistics
          sessionStats: [
            {
              $group: {
                _id: '$sessionId',
                activities: { $sum: 1 },
                duration: { $max: '$sessionDuration' },
                startTime: { $min: '$timestamp' },
                endTime: { $max: '$timestamp' }
              }
            },
            {
              $group: {
                _id: null,
                avgActivitiesPerSession: { $avg: '$activities' },
                avgSessionDuration: { $avg: '$duration' },
                totalSessions: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      insights: insights[0],
      userId,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Error fetching user behavior insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user behavior insights',
      error: error.message
    });
  }
};

// Get popular content/features
export const getPopularContent = async (req, res) => {
  try {
    const { days = 7, limit = 20 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const popularContent = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          activityType: { $in: ['city_viewed', 'activity_viewed', 'trip_viewed'] }
        }
      },
      {
        $facet: {
          popularCities: [
            {
              $match: { activityType: 'city_viewed' }
            },
            {
              $group: {
                _id: '$activityData.cityName',
                views: { $sum: 1 },
                uniqueUsers: { $addToSet: '$userId' }
              }
            },
            {
              $project: {
                cityName: '$_id',
                views: 1,
                uniqueUsers: { $size: '$uniqueUsers' }
              }
            },
            { $sort: { views: -1 } },
            { $limit: parseInt(limit) }
          ],
          
          popularActivities: [
            {
              $match: { activityType: 'activity_viewed' }
            },
            {
              $group: {
                _id: '$activityData.activityName',
                views: { $sum: 1 },
                uniqueUsers: { $addToSet: '$userId' }
              }
            },
            {
              $project: {
                activityName: '$_id',
                views: 1,
                uniqueUsers: { $size: '$uniqueUsers' }
              }
            },
            { $sort: { views: -1 } },
            { $limit: parseInt(limit) }
          ],
          
          popularTrips: [
            {
              $match: { activityType: 'trip_viewed' }
            },
            {
              $group: {
                _id: '$activityData.tripName',
                views: { $sum: 1 },
                uniqueUsers: { $addToSet: '$userId' }
              }
            },
            {
              $project: {
                tripName: '$_id',
                views: 1,
                uniqueUsers: { $size: '$uniqueUsers' }
              }
            },
            { $sort: { views: -1 } },
            { $limit: parseInt(limit) }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      popularContent: popularContent[0],
      period: `${days} days`,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching popular content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular content',
      error: error.message
    });
  }
};

// Delete old activities (cleanup)
export const cleanupOldActivities = async (req, res) => {
  try {
    const { days = 365 } = req.query; // Default: keep 1 year of data
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await UserActivity.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old activities`,
      deletedCount: result.deletedCount,
      cutoffDate
    });
  } catch (error) {
    console.error('Error cleaning up old activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up old activities',
      error: error.message
    });
  }
};