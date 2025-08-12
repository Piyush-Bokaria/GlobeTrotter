import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PublicItineraryView = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/apis/public/itinerary/${tripId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load itinerary");
        return res.json();
      })
      .then((data) => {
        setTripData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [tripId]);

  const handleCopyTrip = () => {
    // Example: copy itinerary JSON URL or details to clipboard
    navigator.clipboard.writeText(window.location.href);
    alert("Trip link copied to clipboard!");
  };

  if (loading) return <div>Loading itinerary...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tripData) return <div>No itinerary found.</div>;

  return (
    <div className="public-itinerary-container">
      <h1>{tripData.name}</h1>
      <p>
        {new Date(tripData.startDate).toLocaleDateString()} -{" "}
        {new Date(tripData.endDate).toLocaleDateString()}
      </p>
      <p>{tripData.description || "No description available."}</p>

      <button onClick={handleCopyTrip} className="copy-trip-button">
        Copy Trip Link
      </button>

      {/* Example social share buttons */}
      <div className="social-share-buttons">
        <a
          href={`https://twitter.com/intent/tweet?text=Check out this trip! ${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on Twitter
        </a>
        {/* Add more social links similarly */}
      </div>

      {/* Read-only itinerary days & activities */}
      <div className="itinerary-days">
        {tripData.days?.map((day) => (
          <div key={day.dayNumber} className="itinerary-day">
            <h3>
              Day {day.dayNumber} - {new Date(day.date).toLocaleDateString()} -{" "}
              {day.city}
            </h3>
            <ul>
              {day.activities.map((activity) => (
                <li key={activity.id}>
                  <strong>{activity.name}</strong>: {activity.description} (
                  {activity.startTime} - {activity.endTime})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicItineraryView;
