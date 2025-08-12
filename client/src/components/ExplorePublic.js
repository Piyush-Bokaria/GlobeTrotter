import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExplorePublic = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/apis/public/itinerary", {
          method: "GET",
          cache: "no-cache",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error("Failed to load public itineraries");
        const data = await res.json();
        setItems(data.itineraries || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
                GlobeTrotter
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Public Itineraries</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No public itineraries yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <div key={it.tripId} className="bg-gray-50 rounded-lg border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{it.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">{it.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{it.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(it.startDate).toLocaleDateString()} - {new Date(it.endDate).toLocaleDateString()}
                    <span className="ml-2">• {it.totalDays} days</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/public/itinerary/${it.tripId}`}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExplorePublic;


