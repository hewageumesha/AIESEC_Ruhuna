import React, { useState, useEffect } from "react";
import axios from "axios";

const PastEventGalleryPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/past-events") // Adjust API endpoint
      .then((response) => {
        setPastEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching past events:", error);
        setError("Failed to load past events.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Past Event Gallery</h2>

        {/* Show loading state */}
        {loading && <p className="text-center text-gray-500">Loading past events...</p>}

        {/* Show error message */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Show past events */}
        {!loading && !error && pastEvents.length === 0 && (
          <p className="text-center text-gray-500">No past events available.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pastEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-gray-100 rounded-lg p-4 shadow-md text-center transition-transform transform hover:scale-105"
            >
              <img 
                src={event.photo} 
                alt={event.name} 
                className="w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => { e.target.src = "/images/default.jpg"; }} // Fallback image
              />
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="text-gray-500">{event.location}</p>
              <p className="text-gray-500">{event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastEventGalleryPage;