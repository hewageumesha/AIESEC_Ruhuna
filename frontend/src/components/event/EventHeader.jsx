
import React from 'react';

const EventHeader = ({ imageUrl, eventName, location }) => {
  const generateMapLink = (loc) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;

  return (
    <div className="relative w-full h-64 mb-6">
      <img
        src={imageUrl || '/default-event-image.jpg'}
        alt={eventName || 'Event'}
        className="rounded-lg w-full h-full object-cover shadow-md"
        onError={(e) => (e.target.src = '/default-event-image.jpg')}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-4 text-white">
        <h2 className="text-2xl font-bold">{eventName || 'Untitled Event'}</h2>
        <p className="text-sm">
    
          {location ? (
            <a
              href={generateMapLink(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-300"
            >
              {location}
            </a>
          ) : (
            'Location N/A'
          )}
        </p>
      </div>
    </div>
  );
};

export default EventHeader;
