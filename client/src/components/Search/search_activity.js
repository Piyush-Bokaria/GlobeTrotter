import React, { useState, useEffect } from "react";

const CitySearch = ({ onAddCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities from API or static data
  const fetchCities = async (query = "", country = "") => {
    setLoading(true);
    setError(null);
    try {
      // Example API endpoint with query and country filters
      const url = new URL("http://localhost:5000/apis/cities");
      if (query) url.searchParams.append("search", query);
      if (country) url.searchParams.append("country", country);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch cities");

      const data = await res.json();
      setCities(data.cities || []);
    } catch (err) {
      setError(err.message);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities(searchTerm, filterCountry);
  }, [searchTerm, filterCountry]);

  return (
    <section className="p-4 bg-white rounded shadow-md max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">Add Cities to Your Trip</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-grow"
        />
        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="border px-3 py-2 rounded w-48"
        >
          <option value="">All Countries</option>
          <option value="France">France</option>
          <option value="Italy">Italy</option>
          <option value="Spain">Spain</option>
          <option value="Netherlands">Netherlands</option>
          {/* Add more countries or fetch dynamically */}
        </select>
      </div>

      {loading && <p>Loading cities...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && cities.length === 0 && (
        <p>No cities found matching your criteria.</p>
      )}

      <ul className="divide-y">
        {cities.map((city) => (
          <li key={city._id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{city.name}</p>
              <p className="text-sm text-gray-600">
                Country: {city.country} | Cost Index: {city.costIndex} | Popularity:{" "}
                {city.popularity}
              </p>
            </div>
            <button
              onClick={() => onAddCity(city)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
            >
              Add to Trip
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CitySearch;
