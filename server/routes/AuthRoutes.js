import {
  register,
  login,
  verifyOTP,
  changePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getAllUsers,
} from "../Controllers/authControllers.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.get("/users", getAllUsers);

export default router;
