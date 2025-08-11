const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Implement auth middleware

// @route   GET api/budget/:tripId
// @desc    Get budget estimation for a trip
// @access  Private
router.get('/:tripId', auth, async (req, res) => {
  try {
    const tripId = req.params.tripId;

    // Fetch the trip details (including destinations and activities)
    const trip = await Trip.findById(tripId).populate({
      path: 'destinations',
      populate: {
        path: 'activities',
        model: 'Activity'
      }
    });

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Check if user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Calculate the estimated budget
    let estimatedBudget = 0;

    trip.destinations.forEach(destination => {
      destination.activities.forEach(activity => {
        estimatedBudget += activity.cost || 0;
      });
    });

    // You can add more sophisticated logic here,
    // such as considering travel costs, accommodation, etc.

    res.json({ estimatedBudget });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;