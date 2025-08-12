import Trip from "../models/Trip.js";
import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";

// Returns analytics used by the client AdminDashboard
export const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Users
    const [totalUsers, activeUsers] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // Latest trips
    const trips = await Trip.find({})
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    const tripIds = trips.map((t) => t._id);
    const userIds = trips.map((t) => t.userId).filter(Boolean);

    const [itineraries, users] = await Promise.all([
      Itinerary.find({ tripId: { $in: tripIds } }).select("tripId days").lean(),
      User.find({ _id: { $in: userIds } })
        .select("_id name firstName lastName")
        .lean(),
    ]);

    const tripIdToDaysCount = new Map(
      itineraries.map((it) => [String(it.tripId), Array.isArray(it.days) ? it.days.length : 0])
    );
    const userIdToName = new Map(
      users.map((u) => [String(u._id), u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim()])
    );

    const tripsOut = trips.map((t) => ({
      id: t._id,
      name: t.name,
      creatorName: userIdToName.get(String(t.userId)) || "Unknown",
      createdAt: t.createdAt,
      daysCount: tripIdToDaysCount.get(String(t._id)) || 0,
    }));

    // Top cities by itinerary days
    const topCitiesAgg = await Itinerary.aggregate([
      { $unwind: "$days" },
      { $match: { "days.city": { $ne: null } } },
      { $group: { _id: "$days.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const topCities = topCitiesAgg.map((c) => ({ name: c._id, count: c.count }));

    res.json({
      trips: tripsOut,
      topCities,
      activeUsers,
      totalUsers,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics", error: error.message });
  }
};


