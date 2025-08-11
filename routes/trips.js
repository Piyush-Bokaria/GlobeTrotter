const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const auth = require('../middleware/auth'); // Implement auth middleware

// Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, destinations, budget } = req.body;

    const newTrip = new Trip({
      user: req.user.id,
      name,
      description,
      startDate,
      endDate,
      destinations,
      budget,
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all trips for a user
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).populate('destinations');
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific trip by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('destinations');

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Update a trip
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, destinations, budget } = req.body;

    // Build trip object
    const tripFields = {};
    if (name) tripFields.name = name;
    if (description) tripFields.description = description;
    if (startDate) tripFields.startDate = startDate;
    if (endDate) tripFields.endDate = endDate;
    if (destinations) tripFields.destinations = destinations;
    if (budget) tripFields.budget = budget;

    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: tripFields },
      { new: true }
    );

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete a trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Trip.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;