import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

const createTestAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@globetrotter.com" });
    if (existingAdmin) {
      console.log("Test admin already exists!");
      console.log("Email: admin@globetrotter.com");
      console.log("Password: admin123");
      console.log("Role:", existingAdmin.role);
      return;
    }

    // Create test admin
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    const testAdmin = new User({
      name: "Test Admin",
      email: "admin@globetrotter.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    await testAdmin.save();

    console.log("✅ Test admin created successfully!");
    console.log("Email: admin@globetrotter.com");
    console.log("Password: admin123");
    console.log("Role: admin");
    console.log("");
    console.log("You can now login with these credentials using admin mode.");

  } catch (error) {
    console.error("❌ Error creating test admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(() => {
  createTestAdmin();
});