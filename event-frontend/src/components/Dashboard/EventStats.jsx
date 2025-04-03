import React from "react";

const EventStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-blue-200 rounded-lg">
        <h3>Total Events</h3>
        <p>{stats.totalEvents}</p>
      </div>
      <div className="p-4 bg-green-200 rounded-lg">
        <h3>Registrations</h3>
        <p>{stats.totalRegistrations}</p>
      </div>
      <div className="p-4 bg-yellow-200 rounded-lg">
        <h3>Upcoming Events</h3>
        <p>{stats.upcomingEvents}</p>
      </div>
    </div>
  );
};

export default EventStats;