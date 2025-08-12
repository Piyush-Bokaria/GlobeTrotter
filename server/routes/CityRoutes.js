import express from "express";
import {
  getCities,
  getCityById,
  getCountries,
  getRegions,
  createCity,
  updateCity,
  deleteCity,
  seedCities,
  getCityHotels,
  searchExternalCities,
  addExternalCity,
  getCitiesByCountry,
  getCountriesFromAPI,
  testGeoNamesAPI
} from "../Controllers/cityControllers.js";

const router = express.Router();

// Public routes
router.get("/", getCities);
router.get("/countries", getCountries);
router.get("/countries-api", getCountriesFromAPI);
router.get("/by-country", getCitiesByCountry);
router.get("/regions", getRegions);
router.get("/search-external", searchExternalCities);
router.get("/test-geonames", testGeoNamesAPI);
router.get("/:id", getCityById);
router.get("/:id/hotels", getCityHotels);

// Admin routes (you might want to add authentication middleware)
router.post("/", createCity);
router.post("/add-external", addExternalCity);
router.put("/:id", updateCity);
router.delete("/:id", deleteCity);

// Seed route (for development)
router.post("/seed", seedCities);

export default router;
