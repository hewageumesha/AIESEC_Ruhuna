// src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (event.eventId) {
      navigate(`/event/${event.eventId}`);
    } else {
      console.error("❌ Event ID is undefined", event);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border p-4 rounded-xl shadow hover:shadow-md cursor-pointer transition bg-white"
    >
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h2>
      <p className="text-sm text-gray-500">
        {dayjs(event.eventDate).format('MMMM D, YYYY h:mm A')}
      </p>
    </div>
  );
};

export default EventCard;
