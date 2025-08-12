import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../Controllers/tripControllers.js";
import { auth, optionalAuth } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/create", auth, createTrip);
router.get("/", auth, getUserTrips);
router.get("/:id", optionalAuth, getTripById);
router.put("/:id", auth, updateTrip);
router.delete("/:id", auth, deleteTrip);

export default router;