import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useActivityTracker } from "../../hooks/useActivityTracker";

const CitySearch = ({ onAddCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("IN"); // Default to India
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState("country"); // "country" or "search"
  const [selectedCity, setSelectedCity] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [showHotels, setShowHotels] = useState(false);

  // Activity tracking
  const {
    trackSearch,
    trackClick,
    trackCityAction,
    trackError,
    trackFeatureUsage,
    trackFilterChange,
    trackModalAction,
  } = useActivityTracker();

  // Debounce search to avoid too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Fetch cities by country from external API
  const fetchCitiesByCountry = async (countryCode) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching cities for country:", countryCode);
      const startTime = Date.now();
      const response = await axios.get(
        `http://localhost:5000/apis/cities/by-country?countryCode=${countryCode}`
      );
      const responseTime = Date.now() - startTime;

      console.log("Country cities response:", response.data);
      setCities(response.data.cities || []);

      // Track successful search
      trackSearch(
        "city",
        `country:${countryCode}`,
        { countryCode },
        response.data.cities?.length || 0
      );
    } catch (err) {
      console.error("Fetch cities by country error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch cities";
      setError(`Failed to load cities: ${errorMessage}`);
      setCities([]);

      // Track error
      trackError("api_error", errorMessage, err.response?.status, {
        endpoint: "by-country",
        countryCode,
      });
    } finally {
      setLoading(false);
    }
  };

  // Search cities from external API
  const searchCities = async (query, countryCode = "") => {
    if (!query.trim()) {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/apis/cities/search-external?query=${encodeURIComponent(
        query
      )}&maxRows=50`;
      if (countryCode) {
        url += `&countryCode=${countryCode}`;
      }
      console.log("Searching cities with URL:", url);
      const startTime = Date.now();
      const response = await axios.get(url);
      const responseTime = Date.now() - startTime;

      console.log("Search response:", response.data);
      setCities(response.data.cities || []);

      // Track successful search
      trackSearch(
        "city",
        query,
        { countryCode },
        response.data.cities?.length || 0
      );
    } catch (err) {
      console.error("Search error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to search cities";
      setError(`Search failed: ${errorMessage}`);
      setCities([]);

      // Track error
      trackError("api_error", errorMessage, err.response?.status, {
        endpoint: "search-external",
        query,
        countryCode,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels for a city using coordinates
  const fetchCityHotels = async (city) => {
    setHotelsLoading(true);
    try {
      const { latitude, longitude } = city.coordinates;
      const radius = 0.05; // ~5km radius
      const bbox = `${latitude - radius},${longitude - radius},${
        latitude + radius
      },${longitude + radius}`;

      // Direct OSM Overpass API call
      const query = `[out:json][timeout:25];(node["tourism"="hotel"](${bbox});node["tourism"="guest_house"](${bbox});node["tourism"="motel"](${bbox});node["tourism"="hostel"](${bbox}););out body;>;out skel qt;`;
      const url = "https://overpass-api.de/api/interpreter";

      const response = await fetch(url, {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "text/plain",
        },
      });

      if (!response.ok) throw new Error("OSM Overpass API request failed");

      const data = await response.json();

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
        type: el.tags?.tourism || "hotel",
      }));

      setHotels(hotels);
      setShowHotels(true);
    } catch (err) {
      setError("Failed to fetch hotels for this city");
      setHotels([]);
    } finally {
      setHotelsLoading(false);
    }
  };

  // Add external city to database
  const addExternalCityToDatabase = async (city) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/apis/cities/add-external",
        city
      );
      return response.data.city;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to add city to database"
      );
    }
  };

  // Fetch countries from external API
  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/apis/cities/countries-api"
      );
      setCountries(response.data.countries || []);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
      // Fallback to some popular countries
      setCountries([
        { code: "IN", name: "India" },
        { code: "US", name: "United States" },
        { code: "GB", name: "United Kingdom" },
        { code: "FR", name: "France" },
        { code: "DE", name: "Germany" },
        { code: "JP", name: "Japan" },
        { code: "AU", name: "Australia" },
        { code: "CA", name: "Canada" },
        { code: "IT", name: "Italy" },
        { code: "ES", name: "Spain" },
        { code: "BR", name: "Brazil" },
        { code: "MX", name: "Mexico" },
        { code: "CN", name: "China" },
        { code: "RU", name: "Russia" },
        { code: "ZA", name: "South Africa" },
        { code: "EG", name: "Egypt" },
        { code: "TH", name: "Thailand" },
        { code: "SG", name: "Singapore" },
        { code: "AE", name: "United Arab Emirates" },
        { code: "TR", name: "Turkey" },
      ]);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query, countryCode) => {
      searchCities(query, countryCode);
    }, 800),
    []
  );

  // Effect for search based on mode
  useEffect(() => {
    if (searchMode === "country") {
      fetchCitiesByCountry(selectedCountry);
    } else if (searchMode === "search" && searchTerm.trim()) {
      debouncedSearch(searchTerm, selectedCountry);
    }
  }, [searchMode, selectedCountry, searchTerm, debouncedSearch]);

  // Load countries on component mount
  useEffect(() => {
    fetchCountries();
    // Load default country cities
    fetchCitiesByCountry(selectedCountry);
  }, []);

  const handleAddCity = async (city) => {
    try {
      // Track city add attempt
      trackCityAction("add_to_trip_attempt", city.externalId, city.name, {
        country: city.country,
        source: city.source,
      });

      // Add external city to database first
      const cityToAdd = await addExternalCityToDatabase(city);

      if (onAddCity) {
        await onAddCity(cityToAdd);

        // Track successful city add
        trackCityAction("added_to_trip", cityToAdd._id, cityToAdd.name, {
          country: cityToAdd.country,
          source: "external_api",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to add city to trip");

      // Track error
      trackError("city_add_error", err.message, null, {
        cityName: city.name,
        country: city.country,
      });
    }
  };

  const handleViewHotels = (city) => {
    setSelectedCity(city);
    fetchCityHotels(city);

    // Track hotel view action
    trackCityAction("view_hotels", city.externalId, city.name, {
      country: city.country,
    });
    trackModalAction("opened", "hotels_modal", { cityName: city.name });
  };

  const closeHotelsModal = () => {
    setShowHotels(false);
    setSelectedCity(null);
    setHotels([]);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (searchMode === "search") {
      setCities([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Discover Cities Worldwide
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={async () => {
              try {
                const response = await axios.get(
                  "http://localhost:5000/apis/cities/test-geonames"
                );
                console.log("GeoNames test result:", response.data);
                alert(
                  "GeoNames API test successful! Check console for details."
                );
              } catch (err) {
                console.error("GeoNames test failed:", err);
                alert("GeoNames API test failed! Check console for details.");
              }
            }}
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded"
          >
            Test API
          </button>
          <div className="text-sm text-gray-500">
            Powered by GeoNames API & OpenStreetMap
          </div>
        </div>
      </div>

      {/* Search Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={(e) => {
              setSearchMode("country");
              trackClick("search-mode-country", "toggle_button", e);
              trackFeatureUsage("browse_by_country");
            }}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              searchMode === "country"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Browse by Country
          </button>
          <button
            onClick={(e) => {
              setSearchMode("search");
              trackClick("search-mode-search", "toggle_button", e);
              trackFeatureUsage("search_cities");
            }}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              searchMode === "search"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Search Cities
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {searchMode === "country"
            ? "Browse all cities in a specific country"
            : "Search for specific cities worldwide"}
        </p>
      </div>

      {/* Country Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Country
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            const newCountry = e.target.value;
            setSelectedCountry(newCountry);
            trackFilterChange("country", newCountry, {
              previousCountry: selectedCountry,
            });
          }}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Bar - only show in search mode */}
      {searchMode === "search" && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cities by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">
            {searchMode === "country"
              ? "Loading cities..."
              : "Searching cities..."}
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && cities.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No cities found.</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchMode === "country"
              ? "Try selecting a different country."
              : "Try different search terms."}
          </p>
        </div>
      )}

      {/* Results Count */}
      {!loading && cities.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-600">
            Found {cities.length} cities
            {searchMode === "search" &&
              searchTerm &&
              ` matching "${searchTerm}"`}
            {selectedCountry &&
              ` in ${
                countries.find((c) => c.code === selectedCountry)?.name ||
                selectedCountry
              }`}
          </p>
        </div>
      )}

      {/* Cities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div
            key={city.externalId}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {city.name}
                </h3>
                <p className="text-gray-600">{city.country}</p>
                {city.region && (
                  <p className="text-sm text-gray-500">{city.region}</p>
                )}
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  GeoNames
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Coordinates:</span>{" "}
                {city.coordinates.latitude.toFixed(4)},{" "}
                {city.coordinates.longitude.toFixed(4)}
              </p>
              {city.population && city.population > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Population:</span>{" "}
                  {city.population.toLocaleString()}
                </p>
              )}
              {city.timezone && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Timezone:</span> {city.timezone}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAddCity(city)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Add to Trip
              </button>
              <button
                onClick={() => handleViewHotels(city)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="View Hotels"
              >
                🏨
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hotels Modal */}
      {showHotels && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-800">
                Hotels in {selectedCity?.name}
              </h3>
              <button
                onClick={closeHotelsModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {hotelsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading hotels...</span>
                </div>
              ) : hotels.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hotels found for this city.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Hotels data is sourced from OpenStreetMap.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {hotel.name}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {hotel.type}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {hotel.address}
                        </p>
                        {hotel.stars !== "N/A" && (
                          <p>
                            <span className="font-medium">Stars:</span>{" "}
                            {hotel.stars}
                          </p>
                        )}
                        {hotel.phone !== "N/A" && (
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {hotel.phone}
                          </p>
                        )}
                        {hotel.website !== "N/A" && (
                          <p>
                            <span className="font-medium">Website:</span>{" "}
                            <a
                              href={hotel.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit
                            </a>
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Coordinates: {hotel.lat.toFixed(4)},{" "}
                          {hotel.lon.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
