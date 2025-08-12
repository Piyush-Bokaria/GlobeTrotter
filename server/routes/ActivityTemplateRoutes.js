import express from "express";

// Simple in-memory placeholder; replace with DB model when available
const router = express.Router();

router.get("/city/:city", async (req, res) => {
  const { city } = req.params;
  const limit = Math.max(1, Math.min(parseInt(req.query.limit || "10", 10), 25));

  // Minimal sample data
  const templates = [
    {
      name: `Explore ${city}`,
      description: `Discover the highlights of ${city}`,
      category: "sightseeing",
      defaultDuration: 120,
      estimatedCost: 0,
      suggestedTime: "10:00",
      bookingRequired: false,
    },
    {
      name: `Local Dining in ${city}`,
      description: `Experience local cuisine in ${city}`,
      category: "food",
      defaultDuration: 90,
      estimatedCost: 25,
      suggestedTime: "12:30",
      bookingRequired: false,
    },
    {
      name: `Cultural Experience in ${city}`,
      description: `Immerse yourself in the culture of ${city}`,
      category: "culture",
      defaultDuration: 150,
      estimatedCost: 15,
      suggestedTime: "14:00",
      bookingRequired: false,
    },
  ].slice(0, limit);

  res.json({ templates });
});

export default router;

