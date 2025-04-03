import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/api/events/${eventId}`);
        fetchEvents();
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event", error);
        alert("Failed to delete event.");
      }
    }
  };

  const filteredEvents = events.filter((event) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const isUpcoming = event.startDate >= today;
    const isPast = event.startDate < today;

    return (
      (filter === "all" || (filter === "upcoming" && isUpcoming) || (filter === "past" && isPast)) &&
      event.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Manage Events</h2>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search events..."
          className="border p-2 flex-1 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded-md" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Event List */}
      {filteredEvents.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-3">Event Name</th>
              <th className="border p-3">Start Date</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="border p-3">{event.name}</td>
                <td className="border p-3">{event.startDate}</td>
                <td className="border p-3">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No events found.</p>
      )}
    </div>
  );
};

export default ManageEvents;