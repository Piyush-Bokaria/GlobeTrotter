import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();
const app = new express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/apis/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
