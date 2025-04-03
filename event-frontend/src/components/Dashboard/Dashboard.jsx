import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalPastEvents: 0, // Updated from totalRegistrations
    upcomingEvents: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: dashboardData } = await axios.get(
        "http://localhost:8080/api/dashboard"
      );
      setStats(dashboardData);

      const { data: eventData } = await axios.get(
        "http://localhost:8080/api/events/upcoming"
      );
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-6xl p-6">
        <h2 className="text-2xl font-bold mb-4">Event Management</h2>

        {/* Navigation Grid */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Link
            to="/add-event"
            className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
          >
            Add Event
          </Link>
          <Link
            to="/manage-events"
            className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
          >
            Manage Events
          </Link>
          <Link
            to="/gallery"
            className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
          >
            Gallery
          </Link>
          <Link
            to="/tshirt-orders"
            className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
          >
            T-Shirt Orders
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 shadow-md rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Event Participation</h3>
            <Bar
              data={{
                labels: ["Event A", "Event B", "Event C"],
                datasets: [
                  {
                    label: "Attendees",
                    data: [50, 100, 75],
                    backgroundColor: "blue",
                  },
                  {
                    label: "Registrations",
                    data: [30, 80, 60],
                    backgroundColor: "skyblue",
                  },
                ],
              }}
            />
          </div>

          {/* Merchandise Grid */}
          <div className="bg-white p-4 shadow-md rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Official Merchandise</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { id: 1, name: "Tote Bag", price: "RS:750", image: "images (2).jpeg" },
                { id: 2, name: "Light-Up Wristband", price: "RS:150", image: "images (3).jpeg" },
                { id: 3, name: "Eco-Beat-Cap", price: "RS:1500", image: "dressme-caps-1.jpg" },
              ].map((item) => (
                <div key={item.id} className="bg-gray-100 rounded-lg p-4 shadow-md text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                  <p className="text-black font-bold">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-500 text-white p-4 rounded-xl shadow-md">
            Total Events: {stats.totalEvents}
          </div>
          <div className="bg-green-500 text-white p-4 rounded-xl shadow-md">
            Total Past Events: {stats.totalPastEvents} {/* Updated label */}
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-xl shadow-md">
            Upcoming Events: {stats.upcomingEvents}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-6 bg-white p-4 shadow-md rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          <div className="max-h-40 overflow-y-auto">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-2 border-b flex justify-between items-center"
                >
                  <span className="font-medium">{event.title}</span>
                  <span className="text-gray-600">{event.date}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;