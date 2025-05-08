import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition"
      onClick={handleClick}
    >
      <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">{event.date}</p>
        <p className="text-gray-700 mt-2">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
