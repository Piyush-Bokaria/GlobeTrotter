import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  costIndex: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  popularity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  description: {
    type: String,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  averageTemperature: {
    type: Number
  },
  bestTimeToVisit: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    trim: true
  },
  attractions: [{
    name: String,
    description: String,
    category: String
  }],
  tags: [String],
  externalId: {
    type: String,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
citySchema.index({ name: 'text', country: 'text', region: 'text' });
citySchema.index({ country: 1 });
citySchema.index({ popularity: -1 });
citySchema.index({ costIndex: 1 });

const City = mongoose.model('City', citySchema);

export default City;
