import {
  createItinerary,
  getItinerary,
  updateItinerary,
  addDay,
  updateDay,
  addActivity,
  updateActivity,
  deleteActivity,
  deleteDay,
} from "../Controllers/itineraryControllers.js";
import express from "express";

const router = express.Router();

// Itinerary routes
router.post("/create", createItinerary);
router.get("/:tripId", getItinerary);
router.put("/:tripId", updateItinerary);

// Day routes
router.post("/:tripId/days", addDay);
router.put("/:tripId/days/:dayId", updateDay);
router.delete("/:tripId/days/:dayId", deleteDay);

// Activity routes
router.post("/:tripId/days/:dayId/activities", addActivity);
router.put("/:tripId/days/:dayId/activities/:activityId", updateActivity);
router.delete("/:tripId/days/:dayId/activities/:activityId", deleteActivity);

export default router;