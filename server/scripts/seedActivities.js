import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/Users');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleActivities = [
  {
    name: "Eiffel Tower Visit",
    description: "Visit the iconic Eiffel Tower, one of the most recognizable landmarks in the world. Take the elevator to the top for breathtaking views of Paris.",
    category: "sightseeing",
    type: "outdoor",
    duration: { hours: 2, description: "2-3 hours" },
    cost: { range: "moderate", amount: { min: 25, max: 35, currency: "EUR" } },
    location: { 
      city: "Paris", 
      country: "France", 
      address: "Champ de Mars, 5 Avenue Anatole France",
      coordinates: { latitude: 48.8584, longitude: 2.2945 }
    },
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
    location: { 
      city: "Paris", 
      country: "France",
      coordinates: { latitude: 48.8566, longitude: 2.3522 }
    },
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
    location: { 
      city: "Tokyo", 
      country: "Japan",
      coordinates: { latitude: 35.6762, longitude: 139.6503 }
    },
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
    location: { 
      city: "Fujiyoshida", 
      country: "Japan",
      coordinates: { latitude: 35.4606, longitude: 138.7274 }
    },
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
    location: { 
      city: "New York", 
      country: "United States",
      coordinates: { latitude: 40.7829, longitude: -73.9654 }
    },
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
    location: { 
      city: "New York", 
      country: "United States",
      coordinates: { latitude: 40.7590, longitude: -73.9845 }
    },
    images: [{ url: "/images/broadway.jpg", caption: "Broadway Theater", isPrimary: true }],
    rating: { average: 4.7, count: 12340 },
    tags: ["entertainment", "culture", "music", "theater"],
    bestTimeToVisit: { timeOfDay: ["evening"] },
    difficulty: "easy",
    ageGroup: "all-ages",
    requirements: { bookingRequired: true }
  },
  {
    name: "Colosseum Tour",
    description: "Step back in time and explore the ancient Roman Colosseum with skip-the-line access and expert guide.",
    category: "historical",
    type: "outdoor",
    duration: { hours: 2.5, description: "2-3 hours" },
    cost: { range: "moderate", amount: { min: 35, max: 50, currency: "EUR" } },
    location: { 
      city: "Rome", 
      country: "Italy",
      address: "Piazza del Colosseo, 1",
      coordinates: { latitude: 41.8902, longitude: 12.4922 }
    },
    images: [{ url: "/images/colosseum.jpg", caption: "Roman Colosseum", isPrimary: true }],
    rating: { average: 4.6, count: 18750 },
    tags: ["ancient", "history", "architecture", "guided-tour"],
    bestTimeToVisit: { seasons: ["spring", "autumn"], timeOfDay: ["morning", "afternoon"] },
    difficulty: "easy",
    ageGroup: "all-ages",
    requirements: { bookingRequired: true },
    featured: true
  },
  {
    name: "Vatican Museums Tour",
    description: "Explore the world's greatest art collection including the Sistine Chapel and Raphael Rooms.",
    category: "museums",
    type: "indoor",
    duration: { hours: 3, description: "3-4 hours" },
    cost: { range: "expensive", amount: { min: 60, max: 85, currency: "EUR" } },
    location: { 
      city: "Rome", 
      country: "Italy",
      address: "Viale Vaticano",
      coordinates: { latitude: 41.9029, longitude: 12.4534 }
    },
    images: [{ url: "/images/vatican.jpg", caption: "Vatican Museums", isPrimary: true }],
    rating: { average: 4.8, count: 22100 },
    tags: ["art", "religious", "culture", "renaissance"],
    bestTimeToVisit: { timeOfDay: ["morning"] },
    difficulty: "moderate",
    ageGroup: "all-ages",
    requirements: { bookingRequired: true, minimumPeople: 1 }
  },
  {
    name: "Thai Cooking Class",
    description: "Learn to cook authentic Thai dishes in a hands-on cooking class with market tour and recipe book.",
    category: "food-tours",
    type: "indoor",
    duration: { hours: 4, description: "Half day" },
    cost: { range: "moderate", amount: { min: 40, max: 60, currency: "USD" } },
    location: { 
      city: "Bangkok", 
      country: "Thailand",
      coordinates: { latitude: 13.7563, longitude: 100.5018 }
    },
    images: [{ url: "/images/thai-cooking.jpg", caption: "Thai Cooking Class", isPrimary: true }],
    rating: { average: 4.7, count: 3420 },
    tags: ["cooking", "cultural", "hands-on", "authentic"],
    bestTimeToVisit: { timeOfDay: ["morning", "afternoon"] },
    difficulty: "easy",
    ageGroup: "all-ages",
    requirements: { bookingRequired: true, minimumPeople: 2 }
  },
  {
    name: "Floating Market Tour",
    description: "Experience the vibrant floating markets of Bangkok with boat tour and local food tasting.",
    category: "cultural",
    type: "outdoor",
    duration: { hours: 5, description: "Half day" },
    cost: { range: "budget", amount: { min: 25, max: 40, currency: "USD" } },
    location: { 
      city: "Bangkok", 
      country: "Thailand",
      coordinates: { latitude: 13.7563, longitude: 100.5018 }
    },
    images: [{ url: "/images/floating-market.jpg", caption: "Bangkok Floating Market", isPrimary: true }],
    rating: { average: 4.4, count: 5680 },
    tags: ["cultural", "boat-tour", "local-experience", "photography"],
    bestTimeToVisit: { timeOfDay: ["morning"] },
    difficulty: "easy",
    ageGroup: "all-ages",
    requirements: { bookingRequired: true }
  }
];

const seedActivities = async () => {
  try {
    await connectDB();
    
    // Clear existing activities (optional)
    console.log('Clearing existing activities...');
    await Activity.deleteMany({});
    
    // Insert sample activities
    console.log('Inserting sample activities...');
    const activities = await Activity.insertMany(sampleActivities);
    
    console.log(`✅ Successfully seeded ${activities.length} activities`);
    
    // Display summary
    const categoryCounts = {};
    activities.forEach(activity => {
      categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
    });
    
    console.log('\n📊 Activities by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    process.exit(1);
  }
};

// Run the seeding
seedActivities();