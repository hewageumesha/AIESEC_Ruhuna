// components/EventMeta.jsx
import React from 'react';

const EventMeta = ({ startDate, endDate, eventTime, endTime }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm mb-6">
    <div className="p-4 border rounded-lg bg-gray-50">
      <strong>📅 Start Date:</strong> {startDate || 'N/A'}
    </div>
    <div className="p-4 border rounded-lg bg-gray-50">
      <strong>📅 End Date:</strong> {endDate || 'N/A'}
    </div>
    <div className="p-4 border rounded-lg bg-gray-50">
      <strong>🕒 Time:</strong>{' '}
      {eventTime && endTime ? `${eventTime} - ${endTime}` : 'N/A'}
    </div>
  </div>
);

export default EventMeta;
