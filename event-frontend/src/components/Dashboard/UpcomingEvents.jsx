import React, { useState } from "react";

const UpcomingEventsPage = () => {
  // Sample data for upcoming events
  const [upcomingEvents] = useState([
    { id: 1, name: "AI Expo", location: "Colombo", date: "2025-05-01", time: "10:00 AM", photo: "ai_expo.jpg" },
    { id: 2, name: "Hackathon 2025", location: "Galle", date: "2025-06-12", time: "9:00 AM", photo: "hackathon.jpg" },
    { id: 3, name: "Cybersecurity Workshop", location: "Kandy", date: "2025-07-25", time: "2:00 PM", photo: "cybersecurity.jpg" },
    { id: 4, name: "Startup Pitching", location: "Colombo", date: "2025-08-15", time: "11:00 AM", photo: "startup_pitch.jpg" },
  ]);

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-gray-100 rounded-lg p-4 shadow-md text-center">
              <img src={event.photo} alt={event.name} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="text-gray-500">{event.location}</p>
              <p className="text-gray-500">{event.date} | {event.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsPage;