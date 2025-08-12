import City from "../models/City.js";
import fetch from 'node-fetch';

// Get all cities with search and filter functionality
export const getCities = async (req, res) => {
  try {
    const { search, country, region, minCost, maxCost, minPopularity, maxPopularity, sortBy, limit = 50 } = req.query;
    
    let query = { isActive: true };
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Country filter
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    // Region filter
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }
    
    // Cost index filter
    if (minCost || maxCost) {
      query.costIndex = {};
      if (minCost) query.costIndex.$gte = parseInt(minCost);
      if (maxCost) query.costIndex.$lte = parseInt(maxCost);
    }
    
    // Popularity filter
    if (minPopularity || maxPopularity) {
      query.popularity = {};
      if (minPopularity) query.popularity.$gte = parseInt(minPopularity);
      if (maxPopularity) query.popularity.$lte = parseInt(maxPopularity);
    }
    
    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'popularity':
        sort.popularity = -1;
        break;
      case 'cost-low':
        sort.costIndex = 1;
        break;
      case 'cost-high':
        sort.costIndex = -1;
        break;
      case 'name':
        sort.name = 1;
        break;
      default:
        sort.popularity = -1;
    }
    
    const cities = await City.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: cities.length,
      cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
};

// Get city by ID
export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const city = await City.findById(id).select('-__v');
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    res.status(200).json({
      success: true,
      city
    });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching city',
      error: error.message
    });
  }
};

// Get all countries
export const getCountries = async (req, res) => {
  try {
    const countries = await City.distinct('country', { isActive: true });
    
    res.status(200).json({
      success: true,
      countries: countries.sort()
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message
    });
  }
};

// Get all regions
export const getRegions = async (req, res) => {
  try {
    const { country } = req.query;
    let query = { isActive: true };
    
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    const regions = await City.distinct('region', query);
    
    res.status(200).json({
      success: true,
      regions: regions.filter(region => region).sort()
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching regions',
      error: error.message
    });
  }
};

// Create a new city (admin function)
export const createCity = async (req, res) => {
  try {
    const cityData = req.body;
    
    // Check if city already exists
    const existingCity = await City.findOne({
      name: { $regex: cityData.name, $options: 'i' },
      country: { $regex: cityData.country, $options: 'i' }
    });
    
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'City already exists in this country'
      });
    }
    
    const city = new City(cityData);
    await city.save();
    
    res.status(201).json({
      success: true,
      message: 'City created successfully',
      city
    });
  } catch (error) {
    console.error('Error creating city:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating city',
      error: error.message
    });
  }
};

// Update city (admin function)
export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const city = await City.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'City updated successfully',
      city
    });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating city',
      error: error.message
    });
  }
};

// Delete city (admin function)
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const city = await City.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting city',
      error: error.message
    });
  }
};

// Fetch hotels from OSM Overpass API
const fetchHotelsFromOSM = async (bbox) => {
  const query = `[out:json][timeout:25];(node["tourism"="hotel"](${bbox});node["tourism"="guest_house"](${bbox});node["tourism"="motel"](${bbox});node["tourism"="hostel"](${bbox}););out body;>;out skel qt;`;
  const url = "https://overpass-api.de/api/interpreter";
  
  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "text/plain",
      },
    });
    
    if (!response.ok) throw new Error("OSM Overpass API request failed");
    
    const data = await response.json();
    
    // Extract nodes from the data
    const hotels = data.elements.map((el) => ({
      id: el.id,
      name: el.tags?.name || "Unnamed Hotel",
      lat: el.lat,
      lon: el.lon,
      address: el.tags?.["addr:street"] || "Address not available",
      city: el.tags?.["addr:city"] || "City unknown",
      stars: el.tags?.stars || "N/A",
      phone: el.tags?.phone || "N/A",
      website: el.tags?.website || "N/A",
      email: el.tags?.email || "N/A",
      type: el.tags?.tourism || "hotel"
    }));
    
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels from OSM:", error);
    return [];
  }
};

// Get hotels for a specific city
export const getCityHotels = async (req, res) => {
  try {
    const { id } = req.params;
    const { radius = 0.05 } = req.query; // Default radius of ~5km
    
    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    const { latitude, longitude } = city.coordinates;
    
    // Create bounding box around the city
    const radiusNum = parseFloat(radius);
    const bbox = `${latitude - radiusNum},${longitude - radiusNum},${latitude + radiusNum},${longitude + radiusNum}`;
    
    const hotels = await fetchHotelsFromOSM(bbox);
    
    res.status(200).json({
      success: true,
      city: city.name,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    console.error('Error fetching city hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
};

// Fetch cities by country using GeoNames API
const fetchCitiesByCountry = async (countryCode = "IN") => {
  const username = process.env.GEO_NAME_USER_NAME || process.env.GEONAMES_USERNAME || 'demo';
  const url = `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=${username}&orderby=population`;
  
  try {
    console.log('Fetching cities from GeoNames:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('GeoNames API HTTP Error:', response.status, response.statusText);
      throw new Error(`GeoNames API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('GeoNames API Response for country:', countryCode, 'Count:', data.geonames?.length || 0);
    
    if (data.status) {
      console.error('GeoNames API Error:', data.status);
      throw new Error(data.status.message || 'GeoNames API error');
    }
    
    if (!data.geonames) {
      console.log('No geonames data in response for country:', countryCode);
      return [];
    }
    
    return data.geonames.map(city => ({
      externalId: city.geonameId,
      name: city.name,
      country: city.countryName,
      countryCode: city.countryCode,
      region: city.adminName1,
      coordinates: {
        latitude: parseFloat(city.lat),
        longitude: parseFloat(city.lng)
      },
      population: city.population || 0,
      timezone: city.timezone?.timeZoneId,
      source: 'geonames'
    }));
  } catch (error) {
    console.error("Error fetching cities for country", countryCode, ":", error);
    throw error; // Re-throw to be handled by the calling function
  }
};

// Get cities by country code
export const getCitiesByCountry = async (req, res) => {
  try {
    const { countryCode = "IN" } = req.query;
    
    console.log('Fetching cities for country:', countryCode);
    const cities = await fetchCitiesByCountry(countryCode);
    
    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
      countryCode
    });
  } catch (error) {
    console.error('Error fetching cities by country:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities by country',
      error: error.message,
      details: error.stack
    });
  }
};

// Search cities from external APIs (GeoNames)
export const searchExternalCities = async (req, res) => {
  try {
    const { query, maxRows = 50, countryCode } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Using GeoNames API
    const geonamesUsername = process.env.GEO_NAME_USER_NAME || process.env.GEONAMES_USERNAME || 'demo';
    let geonamesUrl = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=${maxRows}&username=${geonamesUsername}&featureClass=P&orderby=population`;
    
    // Add country filter if provided
    if (countryCode) {
      geonamesUrl += `&country=${countryCode}`;
    }
    
    console.log('GeoNames API URL:', geonamesUrl);
    
    const response = await fetch(geonamesUrl);
    
    if (!response.ok) {
      console.error('GeoNames API HTTP Error:', response.status, response.statusText);
      throw new Error(`GeoNames API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('GeoNames API Response:', JSON.stringify(data, null, 2));
    
    if (data.status) {
      console.error('GeoNames API Error:', data.status);
      throw new Error(data.status.message || 'GeoNames API error');
    }
    
    if (!data.geonames) {
      console.error('No geonames data in response:', data);
      return res.status(200).json({
        success: true,
        count: 0,
        cities: [],
        message: 'No cities found'
      });
    }
    
    const cities = data.geonames.map(city => ({
      externalId: city.geonameId,
      name: city.name,
      country: city.countryName,
      countryCode: city.countryCode,
      region: city.adminName1,
      coordinates: {
        latitude: parseFloat(city.lat),
        longitude: parseFloat(city.lng)
      },
      population: city.population || 0,
      timezone: city.timezone?.timeZoneId,
      source: 'geonames'
    }));
    
    res.status(200).json({
      success: true,
      count: cities.length,
      cities
    });
  } catch (error) {
    console.error('Error searching external cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching external cities',
      error: error.message,
      details: error.stack
    });
  }
};

// Test GeoNames API connection
export const testGeoNamesAPI = async (req, res) => {
  try {
    const geonamesUsername = process.env.GEO_NAME_USER_NAME || process.env.GEONAMES_USERNAME || 'demo';
    const testUrl = `http://api.geonames.org/searchJSON?q=london&maxRows=5&username=${geonamesUsername}&featureClass=P`;
    
    console.log('Testing GeoNames API with URL:', testUrl);
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    console.log('GeoNames Test Response:', JSON.stringify(data, null, 2));
    
    res.status(200).json({
      success: true,
      testUrl,
      response: data,
      username: geonamesUsername
    });
  } catch (error) {
    console.error('GeoNames API test failed:', error);
    res.status(500).json({
      success: false,
      message: 'GeoNames API test failed',
      error: error.message
    });
  }
};

// Get list of countries from GeoNames
export const getCountriesFromAPI = async (req, res) => {
  try {
    const geonamesUsername = process.env.GEO_NAME_USER_NAME || process.env.GEONAMES_USERNAME || 'demo';
    const url = `http://api.geonames.org/countryInfoJSON?username=${geonamesUsername}`;
    
    console.log('Fetching countries from GeoNames:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('GeoNames API HTTP Error:', response.status, response.statusText);
      throw new Error(`GeoNames API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Countries API Response:', data.geonames?.length || 0, 'countries');
    
    if (data.status) {
      console.error('GeoNames API Error:', data.status);
      throw new Error(data.status.message || 'GeoNames API error');
    }
    
    const countries = data.geonames?.map(country => ({
      code: country.countryCode,
      name: country.countryName,
      capital: country.capital,
      population: country.population,
      area: country.areaInSqKm
    })).sort((a, b) => a.name.localeCompare(b.name)) || [];
    
    res.status(200).json({
      success: true,
      count: countries.length,
      countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message,
      details: error.stack
    });
  }
};

// Add external city to database
export const addExternalCity = async (req, res) => {
  try {
    const { externalId, name, country, region, coordinates, population, timezone } = req.body;
    
    // Check if city already exists
    const existingCity = await City.findOne({
      name: { $regex: name, $options: 'i' },
      country: { $regex: country, $options: 'i' }
    });
    
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'City already exists in database'
      });
    }
    
    // Estimate cost index and popularity based on population and country
    let costIndex = 5;
    let popularity = 5;
    
    // Simple heuristics for cost and popularity
    if (population > 1000000) popularity = Math.min(10, popularity + 3);
    if (population > 5000000) popularity = Math.min(10, popularity + 2);
    
    // Country-based cost adjustments (simplified)
    const expensiveCountries = ['Switzerland', 'Norway', 'Denmark', 'Japan', 'Singapore'];
    const cheapCountries = ['India', 'Thailand', 'Vietnam', 'Nepal', 'Cambodia'];
    
    if (expensiveCountries.includes(country)) costIndex = Math.min(10, costIndex + 3);
    if (cheapCountries.includes(country)) costIndex = Math.max(1, costIndex - 2);
    
    const cityData = {
      name,
      country,
      region,
      coordinates,
      costIndex,
      popularity,
      timezone,
      description: `${name} is a city in ${region ? region + ', ' : ''}${country}`,
      tags: ['external-api'],
      externalId
    };
    
    const city = new City(cityData);
    await city.save();
    
    res.status(201).json({
      success: true,
      message: 'City added successfully',
      city
    });
  } catch (error) {
    console.error('Error adding external city:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding city',
      error: error.message
    });
  }
};

// Seed cities with sample data
export const seedCities = async (req, res) => {
  try {
    const sampleCities = [
      {
        name: "Paris",
        country: "France",
        region: "Île-de-France",
        costIndex: 8,
        popularity: 10,
        description: "The City of Light, known for its art, fashion, and culture",
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
        currency: "EUR",
        language: "French",
        timezone: "CET",
        bestTimeToVisit: "April to June, September to October",
        attractions: [
          { name: "Eiffel Tower", description: "Iconic iron lattice tower", category: "landmark" },
          { name: "Louvre Museum", description: "World's largest art museum", category: "museum" }
        ],
        tags: ["romantic", "art", "fashion", "cuisine"]
      },
      {
        name: "Tokyo",
        country: "Japan",
        region: "Kanto",
        costIndex: 9,
        popularity: 9,
        description: "Modern metropolis blending tradition and innovation",
        coordinates: { latitude: 35.6762, longitude: 139.6503 },
        currency: "JPY",
        language: "Japanese",
        timezone: "JST",
        bestTimeToVisit: "March to May, September to November",
        attractions: [
          { name: "Senso-ji Temple", description: "Ancient Buddhist temple", category: "temple" },
          { name: "Shibuya Crossing", description: "Famous pedestrian crossing", category: "landmark" }
        ],
        tags: ["modern", "traditional", "technology", "cuisine"]
      },
      {
        name: "Bangkok",
        country: "Thailand",
        region: "Central Thailand",
        costIndex: 3,
        popularity: 8,
        description: "Vibrant capital known for street food and temples",
        coordinates: { latitude: 13.7563, longitude: 100.5018 },
        currency: "THB",
        language: "Thai",
        timezone: "ICT",
        bestTimeToVisit: "November to March",
        attractions: [
          { name: "Grand Palace", description: "Royal palace complex", category: "palace" },
          { name: "Wat Pho", description: "Temple of the Reclining Buddha", category: "temple" }
        ],
        tags: ["budget-friendly", "street-food", "temples", "nightlife"]
      },
      {
        name: "New York",
        country: "United States",
        region: "New York",
        costIndex: 9,
        popularity: 10,
        description: "The Big Apple, city that never sleeps",
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        currency: "USD",
        language: "English",
        timezone: "EST",
        bestTimeToVisit: "April to June, September to November",
        attractions: [
          { name: "Statue of Liberty", description: "Symbol of freedom", category: "landmark" },
          { name: "Central Park", description: "Large public park", category: "park" }
        ],
        tags: ["urban", "culture", "shopping", "broadway"]
      },
      {
        name: "Rome",
        country: "Italy",
        region: "Lazio",
        costIndex: 6,
        popularity: 9,
        description: "The Eternal City, rich in history and culture",
        coordinates: { latitude: 41.9028, longitude: 12.4964 },
        currency: "EUR",
        language: "Italian",
        timezone: "CET",
        bestTimeToVisit: "April to June, September to October",
        attractions: [
          { name: "Colosseum", description: "Ancient amphitheater", category: "landmark" },
          { name: "Vatican City", description: "Papal enclave", category: "religious" }
        ],
        tags: ["history", "art", "cuisine", "ancient"]
      }
    ];

    // Clear existing cities (optional)
    // await City.deleteMany({});

    // Insert sample cities
    const cities = await City.insertMany(sampleCities);

    res.status(201).json({
      success: true,
      message: `${cities.length} cities seeded successfully`,
      cities
    });
  } catch (error) {
    console.error('Error seeding cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding cities',
      error: error.message
    });
  }
};
