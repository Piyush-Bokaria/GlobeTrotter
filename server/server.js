import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import tripRoutes from "./routes/TripRoutes.js";
import itineraryRoutes from "./routes/ItineraryRoutes.js";

dotenv.config();
const app = new express();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/apis/auth", authRoutes);
app.use("/apis/trips", tripRoutes);
app.use("/apis/itinerary", itineraryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
