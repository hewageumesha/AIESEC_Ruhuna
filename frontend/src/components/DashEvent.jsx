import React, { useState } from "react";
import AddEventForm from "./event/AddEventForm";
import EventCard from "./event/EventCard"; // You should create this component
import { Button } from "antd"; // If you're using Ant Design
// Or use DaisyUI button styling

const DashEvent = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Dummy event data (replace with real data or fetch)
  const events = [
    {
      id: 1,
      title: "LDS 5.0",
      date: "2025-05-20",
      description: "Leadership Development Seminar",
      imageUrl: "https://via.placeholder.com/300x150"
    },
    {
      id: 2,
      title: "Team Building",
      date: "2025-06-01",
      description: "Fun activities to bond the team",
      imageUrl: "https://via.placeholder.com/300x150"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Event Management </h2>
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Close Form" : "Add Event"}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddEventForm />
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default DashEvent;
