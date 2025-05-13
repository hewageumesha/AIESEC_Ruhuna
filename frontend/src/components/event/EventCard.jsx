// src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const eventId = event.eventId; // ✅ this matches your backend entity field
    if (eventId) {
      navigate(`/event/${eventId}`);
    } else {
      console.error("❌ Event ID is undefined", event);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
    >
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p className="text-gray-600">{event.description}</p>
    </div>
  );
};

export default EventCard;
