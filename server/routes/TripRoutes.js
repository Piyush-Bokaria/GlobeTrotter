import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../Controllers/tripControllers.js";
import express from "express";

const router = express.Router();

router.post("/create", createTrip);
router.get("/", getUserTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;