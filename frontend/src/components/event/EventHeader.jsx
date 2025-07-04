import React from 'react';

const EventHeader = ({ imageUrl }) => {
  return (
    <div className="relative w-full h-64 mb-10 rounded-xl overflow-hidden shadow-md">
      <img
        src={imageUrl || '/default-event-image.jpg'}
        alt="Event Banner"
        className="w-full h-full object-cover"
        onError={(e) => (e.target.src = '/default-event-image.jpg')}
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default EventHeader;
