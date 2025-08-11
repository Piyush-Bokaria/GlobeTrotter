const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth'); // Implement auth middleware

// Create a new destination
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, location } = req.body;

    const newDestination = new Destination({
      name,
      description,
      location,
    });

    const destination = await newDestination.save();
    res.json(destination);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).populate('activities');

    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }

    res.json(destination);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Update a destination
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, location } = req.body;

    // Build destination object
    const destinationFields = {};
    if (name) destinationFields.name = name;
    if (description) destinationFields.description = description;
    if (location) destinationFields.location = location;

    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }

    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { $set: destinationFields },
      { new: true }
    );

    res.json(destination);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete a destination
router.delete('/:id', auth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }

    await Destination.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Destination removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Create a new activity for a destination
router.post('/:destinationId/activities', auth, async (req, res) => {
  try {
    const { name, description, cost } = req.body;

    const newActivity = new Activity({
      name,
      description,
      cost,
    });

    const activity = await newActivity.save();

    const destination = await Destination.findById(req.params.destinationId);

    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }

    destination.activities.push(activity.id);
    await destination.save();

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;