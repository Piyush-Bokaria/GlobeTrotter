import Activity from "../models/Activity.js";
import fetch from 'node-fetch';

// Get all activities with search and filter functionality
export const getActivities = async (req, res) => {
  try {
    const { 
      search, 
      city, 
      country, 
      category, 
      type, 
      costRange, 
      minDuration, 
      maxDuration, 
      difficulty,
      ageGroup,
      sortBy = 'rating',
      limit = 50,
      page = 1
    } = req.query;
    
    let query = { isActive: true };
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Location filters
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    if (country) {
      query['location.country'] = { $regex: country, $options: 'i' };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Type filter
    if (type) {
      query.type = type;
    }
    
    // Cost range filter
    if (costRange) {
      query['cost.range'] = costRange;
    }
    
    // Duration filters
    if (minDuration || maxDuration) {
      query['duration.hours'] = {};
      if (minDuration) query['duration.hours'].$gte = parseFloat(minDuration);
      if (maxDuration) query['duration.hours'].$lte = parseFloat(maxDuration);
    }
    
    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Age group filter
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }
    
    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'duration-short':
        sort = { 'duration.hours': 1 };
        break;
      case 'duration-long':
        sort = { 'duration.hours': -1 };
        break;
      case 'cost-low':
        sort = { 'cost.amount.min': 1 };
        break;
      case 'cost-high':
        sort = { 'cost.amount.max': -1 };
        break;
      case 'featured':
        sort = { featured: -1, 'rating.average': -1 };
        break;
      default:
        sort = { 'rating.average': -1, featured: -1 };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [activities, total] = await Promise.all([
      Activity.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Activity.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// Get activity by ID
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findById(id).select('-__v');
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
};

// Get activities by city
export const getActivitiesByCity = async (req, res) => {
  try {
    const { city, country } = req.query;
    const { limit = 20 } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }
    
    let query = { 
      'location.city': { $regex: city, $options: 'i' },
      isActive: true 
    };
    
    if (country) {
      query['location.country'] = { $regex: country, $options: 'i' };
    }
    
    const activities = await Activity.find(query)
      .sort({ featured: -1, 'rating.average': -1 })
      .limit(parseInt(limit))
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: activities.length,
      city,
      country,
      activities
    });
  } catch (error) {
    console.error('Error fetching activities by city:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities by city',
      error: error.message
    });
  }
};

// Get activity categories
export const getActivityCategories = async (req, res) => {
  try {
    const categories = await Activity.distinct('category', { isActive: true });
    
    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Activity.countDocuments({ category, isActive: true });
        return { category, count };
      })
    );
    
    res.status(200).json({
      success: true,
      categories: categoriesWithCount.sort((a, b) => b.count - a.count)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get activity cities
export const getActivityCities = async (req, res) => {
  try {
    const { country } = req.query;
    
    let matchQuery = { isActive: true };
    if (country) {
      matchQuery['location.country'] = { $regex: country, $options: 'i' };
    }
    
    const cities = await Activity.aggregate([
      { $match: matchQuery },
      { 
        $group: { 
          _id: { 
            city: '$location.city', 
            country: '$location.country' 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { 
        $project: { 
          _id: 0, 
          city: '$_id.city', 
          country: '$_id.country', 
          count: 1 
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
};

// Create a new activity (admin function)
export const createActivity = async (req, res) => {
  try {
    const activityData = req.body;
    
    const activity = new Activity(activityData);
    await activity.save();
    
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
};

// Update activity (admin function)
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const activity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
};

// Delete activity (admin function)
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
};

// Seed activities with sample data
export const seedActivities = async (req, res) => {
  try {
    const sampleActivities = [
      {
        name: "Eiffel Tower Visit",
        description: "Visit the iconic Eiffel Tower, one of the most recognizable landmarks in the world. Take the elevator to the top for breathtaking views of Paris.",
        category: "sightseeing",
        type: "outdoor",
        duration: { hours: 2, description: "2-3 hours" },
        cost: { range: "moderate", amount: { min: 25, max: 35, currency: "EUR" } },
        location: { city: "Paris", country: "France", address: "Champ de Mars, 5 Avenue Anatole France" },
        images: [{ url: "/images/eiffel-tower.jpg", caption: "Eiffel Tower", isPrimary: true }],
        rating: { average: 4.5, count: 15420 },
        tags: ["iconic", "views", "photography", "romantic"],
        bestTimeToVisit: { seasons: ["spring", "summer"], timeOfDay: ["morning", "evening"] },
        difficulty: "easy",
        ageGroup: "all-ages",
        requirements: { bookingRequired: true },
        featured: true
      },
      {
        name: "Seine River Cruise",
        description: "Enjoy a relaxing cruise along the Seine River, passing by famous landmarks including Notre-Dame, Louvre, and more.",
        category: "sightseeing",
        type: "outdoor",
        duration: { hours: 1.5, description: "1-2 hours" },
        cost: { range: "moderate", amount: { min: 15, max: 25, currency: "EUR" } },
        location: { city: "Paris", country: "France" },
        images: [{ url: "/images/seine-cruise.jpg", caption: "Seine River Cruise", isPrimary: true }],
        rating: { average: 4.3, count: 8920 },
        tags: ["relaxing", "scenic", "romantic", "photography"],
        bestTimeToVisit: { timeOfDay: ["afternoon", "evening"] },
        difficulty: "easy",
        ageGroup: "all-ages",
        requirements: { bookingRequired: true }
      },
      {
        name: "Tokyo Food Tour",
        description: "Explore Tokyo's incredible food scene with a guided tour through local markets, street food stalls, and traditional restaurants.",
        category: "food-tours",
        type: "mixed",
        duration: { hours: 4, description: "Half day" },
        cost: { range: "expensive", amount: { min: 80, max: 120, currency: "USD" } },
        location: { city: "Tokyo", country: "Japan" },
        images: [{ url: "/images/tokyo-food.jpg", caption: "Tokyo Street Food", isPrimary: true }],
        rating: { average: 4.8, count: 2340 },
        tags: ["authentic", "cultural", "delicious", "local-experience"],
        bestTimeToVisit: { timeOfDay: ["morning", "afternoon"] },
        difficulty: "easy",
        ageGroup: "all-ages",
        requirements: { bookingRequired: true, minimumPeople: 2 }
      },
      {
        name: "Mount Fuji Hiking",
        description: "Challenge yourself with a hike up Japan's most famous mountain. Experience stunning views and spiritual significance.",
        category: "adventure",
        type: "outdoor",
        duration: { hours: 8, description: "Full day" },
        cost: { range: "moderate", amount: { min: 50, max: 80, currency: "USD" } },
        location: { city: "Fujiyoshida", country: "Japan" },
        images: [{ url: "/images/mount-fuji.jpg", caption: "Mount Fuji Trail", isPrimary: true }],
        rating: { average: 4.6, count: 1250 },
        tags: ["challenging", "nature", "spiritual", "photography"],
        bestTimeToVisit: { seasons: ["summer"], timeOfDay: ["morning"] },
        difficulty: "challenging",
        ageGroup: "adults-only",
        requirements: { equipment: ["hiking boots", "warm clothing"], minimumPeople: 1 }
      },
      {
        name: "Central Park Walking Tour",
        description: "Discover the hidden gems and famous spots of Central Park with a knowledgeable local guide.",
        category: "sightseeing",
        type: "outdoor",
        duration: { hours: 2, description: "2 hours" },
        cost: { range: "budget", amount: { min: 20, max: 30, currency: "USD" } },
        location: { city: "New York", country: "United States" },
        images: [{ url: "/images/central-park.jpg", caption: "Central Park", isPrimary: true }],
        rating: { average: 4.4, count: 5670 },
        tags: ["nature", "history", "photography", "relaxing"],
        bestTimeToVisit: { seasons: ["spring", "autumn"], timeOfDay: ["morning", "afternoon"] },
        difficulty: "easy",
        ageGroup: "all-ages"
      },
      {
        name: "Broadway Show",
        description: "Experience the magic of Broadway with world-class performances in the heart of New York's Theater District.",
        category: "entertainment",
        type: "indoor",
        duration: { hours: 2.5, description: "2.5 hours" },
        cost: { range: "expensive", amount: { min: 100, max: 300, currency: "USD" } },
        location: { city: "New York", country: "United States" },
        images: [{ url: "/images/broadway.jpg", caption: "Broadway Theater", isPrimary: true }],
        rating: { average: 4.7, count: 12340 },
        tags: ["entertainment", "culture", "music", "theater"],
        bestTimeToVisit: { timeOfDay: ["evening"] },
        difficulty: "easy",
        ageGroup: "all-ages",
        requirements: { bookingRequired: true }
      }
    ];

    // Insert sample activities
    const activities = await Activity.insertMany(sampleActivities);

    res.status(201).json({
      success: true,
      message: `${activities.length} activities seeded successfully`,
      activities
    });
  } catch (error) {
    console.error('Error seeding activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding activities',
      error: error.message
    });
  }
};

// Search activities using external APIs (placeholder for future integration)
export const searchExternalActivities = async (req, res) => {
  try {
    const { city, category, limit = 10 } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }
    
    // Placeholder for external API integration (TripAdvisor, Viator, etc.)
    // For now, return activities from our database
    let query = { 
      'location.city': { $regex: city, $options: 'i' },
      isActive: true 
    };
    
    if (category) {
      query.category = category;
    }
    
    const activities = await Activity.find(query)
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit))
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
      source: 'database' // Will be 'external' when API is integrated
    });
  } catch (error) {
    console.error('Error searching external activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching external activities',
      error: error.message
    });
  }
};