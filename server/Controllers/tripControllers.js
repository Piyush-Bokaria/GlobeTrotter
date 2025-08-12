import Trip from "../models/Trip.js";

const createTrip = async (req, res) => {
  const {
    name,
    description,
    startDate,
    endDate,
    coverPhoto,
    budget,
    destination,
  } = req.body;

  // Get userId from authenticated user (set by auth middleware)
  const userId = req.user.id;

  console.log("Create trip request received:", {
    name,
    description,
    startDate,
    endDate,
    userId,
    budget,
    destination,
  });

  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({
      message: "Trip name, description, start date, and end date are required",
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return res.status(400).json({
      message: "Start date cannot be in the past",
    });
  }

  if (end <= start) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  try {
    const newTrip = new Trip({
      name,
      description,
      startDate: start,
      endDate: end,
      coverPhoto,
      userId: userId,
      budget: budget || 0,
      destination: destination || "",
    });

    await newTrip.save();

    res.status(201).json({
      message: "Trip created successfully!",
      trip: newTrip,
    });
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({
      message: "Something went wrong while creating the trip.",
      error: error.message,
    });
  }
};

const getUserTrips = async (req, res) => {
  // Get userId from authenticated user (set by auth middleware)
  const userId = req.user.id;

  console.log("Get trips request for userId:", userId);

  try {
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });

    console.log(`Found ${trips.length} trips for user ${userId}`);

    res.status(200).json({
      message: "Trips retrieved successfully",
      count: trips.length,
      trips: trips,
    });
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({
      message: "Something went wrong while fetching trips.",
      error: error.message,
    });
  }
};

const getTripById = async (req, res) => {
  const { id } = req.params;
  // Get userId from authenticated user (optional for this endpoint)
  const userId = req.user?.id;

  try {
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check ownership for private trips
    if (userId && trip.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only view your own trips." });
    }

    res.status(200).json({
      message: "Trip retrieved successfully",
      trip: trip,
    });
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({
      message: "Something went wrong while fetching the trip.",
      error: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    startDate,
    endDate,
    coverPhoto,
    budget,
    destination,
  } = req.body;

  // Get userId from authenticated user (set by auth middleware)
  const userId = req.user.id;

  console.log("Update trip request received:", {
    id,
    name,
    description,
    startDate,
    endDate,
    budget,
    destination,
  });

  // Validate required fields
  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({
      message: "Trip name, description, start date, and end date are required",
    });
  }

  // Convert and validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      message: "Invalid date format provided",
    });
  }

  if (end <= start) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  try {
    const updates = {
      name: name.trim(),
      description: description.trim(),
      startDate: start,
      endDate: end,
      budget: budget ? parseFloat(budget) : 0,
      destination: destination ? destination.trim() : "",
    };

    // Only update coverPhoto if provided
    if (coverPhoto !== undefined) {
      updates.coverPhoto = coverPhoto;
    }

    // First check if trip exists and belongs to user
    const existingTrip = await Trip.findById(id);
    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (existingTrip.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Access denied. You can only update your own trips.",
      });
    }

    const trip = await Trip.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Trip updated successfully",
      trip: trip,
    });
  } catch (error) {
    console.error("Update trip error:", error);

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: "Something went wrong while updating the trip.",
      error: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  const { id } = req.params;
  // Get userId from authenticated user (set by auth middleware)
  const userId = req.user.id;

  try {
    // First check if trip exists and belongs to user
    const existingTrip = await Trip.findById(id);
    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (existingTrip.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Access denied. You can only delete your own trips.",
      });
    }

    const trip = await Trip.findByIdAndDelete(id);

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({
      message: "Something went wrong while deleting the trip.",
      error: error.message,
    });
  }
};

export { createTrip, getUserTrips, getTripById, updateTrip, deleteTrip };
