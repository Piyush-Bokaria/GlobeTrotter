import {
  register,
  login,
  verifyOTP,
  getAllUsers,
} from "../Controllers/authControllers.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/users", getAllUsers);

export default router;
