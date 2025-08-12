import express from "express";
import {
  logActivity,
  logBatchActivities,
  getUserActivities,
  getActivityAnalytics,
  getUserBehaviorInsights,
  getPopularContent,
  cleanupOldActivities
} from "../Controllers/userActivityControllers.js";

const router = express.Router();

// Activity logging routes
router.post("/log", logActivity);
router.post("/log-batch", logBatchActivities);

// Activity retrieval routes
router.get("/", getUserActivities);
router.get("/analytics", getActivityAnalytics);
router.get("/insights/:userId", getUserBehaviorInsights);
router.get("/popular", getPopularContent);

// Admin routes
router.delete("/cleanup", cleanupOldActivities);

export default router;