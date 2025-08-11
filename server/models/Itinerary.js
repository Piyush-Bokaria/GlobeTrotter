import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: String, // Format: "09:00"
    required: true
  },
  endTime: {
    type: String, // Format: "11:00"
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'shopping', 'entertainment', 'transport', 'accommodation', 'other'],
    default: 'other'
  },
  notes: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  accommodation: {
    name: String,
    address: String,
    checkIn: String,
    checkOut: String,
    cost: { type: Number, default: 0 },
    notes: String
  },
  activities: [activitySchema],
  totalBudget: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  days: [daySchema],
  totalDays: {
    type: Number,
    default: 0
  },
  totalBudget: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'finalized', 'in-progress', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Calculate total budget before saving
itinerarySchema.pre('save', function(next) {
  let totalBudget = 0;
  
  this.days.forEach(day => {
    let dayBudget = 0;
    
    // Add accommodation cost
    if (day.accommodation && day.accommodation.cost) {
      dayBudget += day.accommodation.cost;
    }
    
    // Add activities cost
    day.activities.forEach(activity => {
      if (activity.cost) {
        dayBudget += activity.cost;
      }
    });
    
    day.totalBudget = dayBudget;
    totalBudget += dayBudget;
  });
  
  this.totalBudget = totalBudget;
  this.totalDays = this.days.length;
  next();
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;