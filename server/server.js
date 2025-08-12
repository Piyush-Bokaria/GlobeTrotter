import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import tripRoutes from "./routes/TripRoutes.js";
import itineraryRoutes from "./routes/ItineraryRoutes.js";
import cityRoutes from "./routes/CityRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import activityTemplateRoutes from "./routes/ActivityTemplateRoutes.js";
import activityRoutes from "./routes/ActivityRoutes.js";
import userActivityRoutes from "./routes/UserActivityRoutes.js";

dotenv.config();
const app = express();
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
app.use("/apis/cities", cityRoutes);
app.use("/apis/admin", adminRoutes);
app.use("/apis/activity-templates", activityTemplateRoutes);
app.use("/apis/activities", activityRoutes);
app.use("/apis/user-activity", userActivityRoutes);

// Public itinerary route
app.get("/apis/public/itinerary/:tripId", async (req, res, next) => {
  try {
    const { default: Itinerary } = await import("./models/Itinerary.js");
    const { default: Trip } = await import("./models/Trip.js");
    const { tripId } = req.params;

    const [trip, itinerary] = await Promise.all([
      Trip.findById(tripId).lean(),
      (await Itinerary.findOne({ tripId }).lean()) || null,
    ]);

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const days = Array.isArray(itinerary?.days)
      ? itinerary.days.map((d, idx) => ({
          dayNumber: idx + 1,
          date: d.date,
          city: d.city,
          activities: (d.activities || []).map((a) => ({
            id: a._id,
            name: a.name,
            description: a.description,
            startTime: a.startTime,
            endTime: a.endTime,
          })),
        }))
      : [];

    res.json({
      id: trip._id,
      name: trip.name,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      days,
    });
  } catch (err) {
    next(err);
  }
});

// List public itineraries (FIFO by creation date)
app.get("/apis/public/itinerary", async (req, res, next) => {
  try {
    const { default: Itinerary } = await import("./models/Itinerary.js");
    const { default: Trip } = await import("./models/Trip.js");

    // Consider finalized or completed itineraries as public
    const publicStatuses = ["finalized", "completed"];

    const itineraries = await Itinerary.find({ status: { $in: publicStatuses } })
      .sort({ createdAt: 1 })
      .populate("tripId")
      .lean();

    const results = itineraries.map((it) => {
      const trip = it.tripId;
      return {
        tripId: trip?._id,
        name: trip?.name || "",
        description: trip?.description || "",
        startDate: trip?.startDate,
        endDate: trip?.endDate,
        totalDays: Array.isArray(it.days) ? it.days.length : 0,
        createdAt: it.createdAt,
        status: it.status,
      };
    });

    res.json({ count: results.length, itineraries: results });
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
