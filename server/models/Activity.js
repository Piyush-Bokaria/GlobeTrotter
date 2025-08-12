import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'sightseeing',
      'food-tours',
      'adventure',
      'cultural',
      'entertainment',
      'shopping',
      'nightlife',
      'nature',
      'museums',
      'sports',
      'wellness',
      'photography',
      'historical',
      'religious',
      'family-friendly'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['indoor', 'outdoor', 'mixed']
  },
  duration: {
    hours: {
      type: Number,
      required: true,
      min: 0.5,
      max: 24
    },
    description: String // e.g., "2-3 hours", "Half day", "Full day"
  },
  cost: {
    range: {
      type: String,
      required: true,
      enum: ['free', 'budget', 'moderate', 'expensive', 'luxury']
    },
    amount: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    }
  },
  location: {
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  bestTimeToVisit: {
    seasons: [String], // spring, summer, autumn, winter
    timeOfDay: [String], // morning, afternoon, evening, night
    weekdays: [String] // monday, tuesday, etc.
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    default: 'easy'
  },
  ageGroup: {
    type: String,
    enum: ['all-ages', 'adults-only', 'family-friendly', 'seniors', 'young-adults'],
    default: 'all-ages'
  },
  requirements: {
    bookingRequired: {
      type: Boolean,
      default: false
    },
    minimumPeople: {
      type: Number,
      default: 1
    },
    maximumPeople: Number,
    equipment: [String],
    restrictions: [String]
  },
  contact: {
    website: String,
    phone: String,
    email: String
  },
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  source: {
    type: String,
    enum: ['manual', 'api', 'user-generated'],
    default: 'manual'
  },
  externalId: String,
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better search performance
activitySchema.index({ name: 'text', description: 'text', tags: 'text' });
activitySchema.index({ 'location.city': 1, 'location.country': 1 });
activitySchema.index({ category: 1 });
activitySchema.index({ 'cost.range': 1 });
activitySchema.index({ 'duration.hours': 1 });
activitySchema.index({ 'rating.average': -1 });
activitySchema.index({ featured: -1, 'rating.average': -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;