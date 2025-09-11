import React from 'react';

const EventDateBadge = ({ startDate }) => {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  
  return (
    <div className="absolute top-4 right-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-lg p-3 text-center min-w-[80px]">
      <div className="text-2xl font-bold">{day}</div>
      <div className="text-sm">{month}</div>
    </div>
  );
};

export default EventDateBadge;