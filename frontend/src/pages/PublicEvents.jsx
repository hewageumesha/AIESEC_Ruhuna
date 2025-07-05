import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import EventCard from "../components/event/EventCard";

const PublicEventsPage = () => {
  const location = useLocation();
  const [publicEvents, setPublicEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/events/public");
        setPublicEvents(res.data);
      } catch (err) {
        console.error("Failed to load public events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEvents();
  }, [location.state?.refresh]); // Re-fetch when 'refresh' changes

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Helmet>
        <title>Public Events | AIESEC Sri Lanka</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 py-8">
          Upcoming Public Events
        </h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spin size="large" />
          </div>
        ) : publicEvents.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No upcoming public events at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicEvents.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEventsPage;
