import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, message } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('❌ Error fetching event:', error);
      message.error('Failed to fetch event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const generateMapLink = (location) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-center text-red-600 font-semibold">Event not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl"
    >
      {/* Image with overlayed minimal info */}
      <div className="relative w-full h-64 mb-6">
        <img
          src={event.imageUrl}
          alt={event.eventName}
          className="rounded-lg w-full h-full object-cover shadow-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-4 text-white">
          <h2 className="text-2xl font-bold">{event.eventName}</h2>
          <p className="text-sm">
            {event.startDate} —{' '}
            <a
              href={generateMapLink(event.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-300"
            >
              {event.location}
            </a>
          </p>
        </div>
      </div>

      {/* Event Title Below */}
      <h1 className="text-4xl font-bold mb-2">{event.eventName}</h1>
      <p className="text-gray-700 text-lg mb-6">{event.description}</p>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm">
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>📅 Start Date:</strong> {event.startDate}
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>📅 End Date:</strong> {event.endDate}
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>🕒 Time:</strong> {event.eventTime} - {event.endTime}
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>📍 Type:</strong> {event.isVirtual ? 'Virtual' : 'In Person'}
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>🌐 Public:</strong> {event.isPublic ? 'Yes' : 'No'}
        </div>
        {event.eventHighlights && (
          <div className="p-4 border rounded-lg bg-gray-50 col-span-full">
            <strong>✨ Highlights:</strong> {event.eventHighlights}
          </div>
        )}
      </div>

      {/* Navigation & Admin Options */}
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
        <Button type="default" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        {(event.createdByRole === 'LCP' || event.createdByRole === 'LCVP') && (
          <div className="flex gap-3">
            <Button type="primary" onClick={() => navigate(`/edit-event/${event.id}`)}>
              Edit
            </Button>
            <Button type="primary" danger>
              Delete
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventDetails;
