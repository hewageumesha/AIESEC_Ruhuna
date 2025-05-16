import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, message, Divider } from 'antd';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import TShirtOrderForm from '../components/event/TShirtOrderForm';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [merchandise, setMerchandise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);

  const fetchEventAndMerchandise = async () => {
    setLoading(true);
    try {
      const eventRes = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(eventRes.data);

      // Try fetching merchandise — ignore 404 errors
      try {
        const merchRes = await axios.get(`http://localhost:8080/api/merchandise/event/${id}`);
        setMerchandise(merchRes.data);
      } catch (merchError) {
        if (merchError.response?.status === 404) {
          setMerchandise(null); // No merchandise — that's OK
        } else {
          throw merchError;
        }
      }
    } catch (error) {
      console.error('❌ Error fetching event or merchandise:', error);
      message.error('Failed to fetch event or merchandise details.');
      setEvent(null);
      setMerchandise(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEventAndMerchandise();
  }, [id]);

  const generateMapLink = (location) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <p className="text-center text-red-600 font-semibold">
        Event not found or unable to load event details.
      </p>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl"
    >
      {/* Event Header */}
      <div className="relative w-full h-64 mb-6">
        <img
          src={event.imageUrl || '/default-event-image.jpg'}
          alt={event.eventName || 'Event'}
          className="rounded-lg w-full h-full object-cover shadow-md"
          onError={(e) => (e.target.src = '/default-event-image.jpg')}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-4 text-white">
          <h2 className="text-2xl font-bold">{event.eventName || 'Untitled Event'}</h2>
          <p className="text-sm">
            {event.startDate || 'Date N/A'} —{' '}
            {event.location ? (
              <a
                href={generateMapLink(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-300"
              >
                {event.location}
              </a>
            ) : (
              'Location N/A'
            )}
          </p>
        </div>
      </div>

      {/* Event Body */}
      <h1 className="text-4xl font-bold mb-2">{event.eventName}</h1>
      <p className="text-gray-700 text-lg mb-6">{event.description || 'No description available.'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-sm mb-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>📅 Start Date:</strong> {event.startDate || 'N/A'}
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>📅 End Date:</strong> {event.endDate || 'N/A'}
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <strong>🕒 Time:</strong>{' '}
          {event.eventTime && event.endTime ? `${event.eventTime} - ${event.endTime}` : 'N/A'}
        </div>
      </div>

      {/* T-Shirt Merchandise Section */}
      <Divider className="mt-10">👕 T-Shirt Merchandise</Divider>

      {merchandise ? (
        <>
          {merchandise.imageUrls?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {merchandise.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`T-Shirt ${idx + 1}`}
                  className="rounded-xl shadow-md h-64 w-full object-cover"
                  onError={(e) => (e.target.src = '/default-shirt-image.jpg')}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No merchandise images available.</p>
          )}

          <p className="mt-4 text-gray-700 text-md whitespace-pre-wrap">
            {merchandise.description || 'No merchandise description available.'}
          </p>

          {currentUser && (
            <div className="mt-6">
              {!showOrderForm ? (
                <Button
                  type="primary"
                  onClick={() => setShowOrderForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  👕 Order Your T-Shirt
                </Button>
              ) : (
                <TShirtOrderForm
                  eventId={event.eventId || id}
                  userId={currentUser.id}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 mt-2">
          No merchandise available for this event.
        </p>
      )}

      {/* Back Button */}
      <div className="mt-10">
        <Button type="default" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>
    </Motion.div>
  );
};

export default EventDetails;
