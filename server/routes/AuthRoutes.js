import {
  register,
  login,
  verifyOTP,
  changePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
  getAllUsers,
  registerAdmin,
  debugUser,
} from "../Controllers/authControllers.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.put("/update-profile", updateProfile);
router.get("/users", getAllUsers);
router.get("/debug/:email", debugUser);

export default router;
