import express from "express";
import { getAnalytics } from "../Controllers/adminControllers.js";

const router = express.Router();

router.get("/analytics", getAnalytics);

export default router;

