import express from "express";
import {
  getActivities,
  getActivityById,
  getActivitiesByCity,
  getActivityCategories,
  getActivityCities,
  createActivity,
  updateActivity,
  deleteActivity,
  seedActivities,
  searchExternalActivities
} from "../Controllers/activityControllers.js";

const router = express.Router();

// Public routes
router.get("/", getActivities);
router.get("/categories", getActivityCategories);
router.get("/cities", getActivityCities);
router.get("/by-city", getActivitiesByCity);
router.get("/search-external", searchExternalActivities);
router.get("/:id", getActivityById);

// Admin routes (you might want to add authentication middleware)
router.post("/", createActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

// Seed route (for development)
router.post("/seed", seedActivities);

export default router;