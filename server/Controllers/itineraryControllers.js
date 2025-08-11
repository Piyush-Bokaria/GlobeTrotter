import Itinerary from "../models/Itinerary.js";
import Trip from "../models/Trip.js";

const createItinerary = async (req, res) => {
  const { tripId, title, description } = req.body;
  const userId = req.user?.id || '507f1f77bcf86cd799439011';
  
  console.log('Create itinerary request received:', { tripId, title, description, userId });
  
  // Validation
  if (!tripId || !title) {
    return res.status(400).json({ message: 'Trip ID and title are required' });
  }
  
  try {
    // Verify trip exists and belongs to user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if itinerary already exists for this trip
    const existingItinerary = await Itinerary.findOne({ tripId });
    if (existingItinerary) {
      return res.status(400).json({ message: 'Itinerary already exists for this trip' });
    }
    
    const newItinerary = new Itinerary({
      tripId,
      userId,
      title,
      description: description || '',
      days: []
    });

    await newItinerary.save();

    res.status(201).json({ 
      message: 'Itinerary created successfully!',
      itinerary: newItinerary
    });
  } catch (error) {
    console.error('Create itinerary error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while creating the itinerary.', 
      error: error.message 
    });
  }
};

const getItinerary = async (req, res) => {
  const { tripId } = req.params;
  
  try {
    const itinerary = await Itinerary.findOne({ tripId }).populate('tripId');
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.status(200).json({
      message: 'Itinerary retrieved successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while fetching the itinerary.', 
      error: error.message 
    });
  }
};

const updateItinerary = async (req, res) => {
  const { tripId } = req.params;
  const updates = req.body;
  
  console.log('Update itinerary request:', { tripId, updates });
  
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { tripId }, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.status(200).json({
      message: 'Itinerary updated successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while updating the itinerary.', 
      error: error.message 
    });
  }
};

const addDay = async (req, res) => {
  const { tripId } = req.params;
  const { date, city, accommodation, notes } = req.body;
  
  console.log('Add day request:', { tripId, date, city });
  
  // Validation
  if (!date || !city) {
    return res.status(400).json({ message: 'Date and city are required' });
  }
  
  try {
    const itinerary = await Itinerary.findOne({ tripId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    // Check if day already exists
    const existingDay = itinerary.days.find(day => 
      new Date(day.date).toDateString() === new Date(date).toDateString()
    );
    
    if (existingDay) {
      return res.status(400).json({ message: 'Day already exists in itinerary' });
    }
    
    const newDay = {
      date: new Date(date),
      city,
      accommodation: accommodation || {},
      activities: [],
      notes: notes || ''
    };
    
    itinerary.days.push(newDay);
    itinerary.days.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
    
    await itinerary.save();
    
    res.status(200).json({
      message: 'Day added successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Add day error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while adding the day.', 
      error: error.message 
    });
  }
};

const updateDay = async (req, res) => {
  const { tripId, dayId } = req.params;
  const updates = req.body;
  
  console.log('Update day request:', { tripId, dayId, updates });
  
  try {
    const itinerary = await Itinerary.findOne({ tripId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const day = itinerary.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }
    
    // Update day fields
    Object.keys(updates).forEach(key => {
      if (key !== '_id') {
        day[key] = updates[key];
      }
    });
    
    await itinerary.save();
    
    res.status(200).json({
      message: 'Day updated successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Update day error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while updating the day.', 
      error: error.message 
    });
  }
};

const addActivity = async (req, res) => {
  const { tripId, dayId } = req.params;
  const { name, description, startTime, endTime, location, cost, category, notes } = req.body;
  
  console.log('Add activity request:', { tripId, dayId, name, startTime, endTime });
  
  // Validation
  if (!name || !startTime || !endTime) {
    return res.status(400).json({ message: 'Activity name, start time, and end time are required' });
  }
  
  try {
    const itinerary = await Itinerary.findOne({ tripId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const day = itinerary.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }
    
    const newActivity = {
      name,
      description: description || '',
      startTime,
      endTime,
      location: location || '',
      cost: cost || 0,
      category: category || 'other',
      notes: notes || '',
      order: day.activities.length
    };
    
    day.activities.push(newActivity);
    day.activities.sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort by time
    
    await itinerary.save();
    
    res.status(200).json({
      message: 'Activity added successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while adding the activity.', 
      error: error.message 
    });
  }
};

const updateActivity = async (req, res) => {
  const { tripId, dayId, activityId } = req.params;
  const updates = req.body;
  
  console.log('Update activity request:', { tripId, dayId, activityId, updates });
  
  try {
    const itinerary = await Itinerary.findOne({ tripId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const day = itinerary.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }
    
    const activity = day.activities.id(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Update activity fields
    Object.keys(updates).forEach(key => {
      if (key !== '_id') {
        activity[key] = updates[key];
      }
    });
    
    // Re-sort activities by time
    day.activities.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    await itinerary.save();
    
    res.status(200).json({
      message: 'Activity updated successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while updating the activity.', 
      error: error.message 
    });
  }
};

const deleteActivity = async (req, res) => {
  const { tripId, dayId, activityId } = req.params;
  
  try {
    const itinerary = await Itinerary.findOne({ tripId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const day = itinerary.days.id(dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }
    
    day.activities.id(activityId).remove();
    
    await itinerary.save();
    
    res.status(200).json({
      message: 'Activity deleted successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while deleting the activity.', 
      error: error.message 
    });
  }
};

const deleteDay = async (req, res) => {
  const { tripId, dayId } = req.params;
  
  try {
    const itinerary = await Itinerary.findOne({ tripId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    itinerary.days.id(dayId).remove();
    
    await itinerary.save();
    
    res.status(200).json({
      message: 'Day deleted successfully',
      itinerary: itinerary
    });
  } catch (error) {
    console.error('Delete day error:', error);
    res.status(500).json({ 
      message: 'Something went wrong while deleting the day.', 
      error: error.message 
    });
  }
};

export { 
  createItinerary, 
  getItinerary, 
  updateItinerary, 
  addDay, 
  updateDay, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  deleteDay 
};