
import React from 'react';

const EventInfo = ({ eventName, description }) => (
  <>
    <h1 className="text-4xl font-bold mb-2">{eventName}</h1>
    <p className="text-gray-700 text-lg mb-6">{description || 'No description available.'}</p>
  </>
);

export default EventInfo;
