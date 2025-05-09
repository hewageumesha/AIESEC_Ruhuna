import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, message } from 'antd';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        message.error('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <Spin size="large" className="m-auto block mt-10" />;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">{event.eventName}</h2>
      <img src={event.imageUrl} alt={event.eventName} className="w-full max-h-96 object-cover mb-6 rounded-lg" />
      <p><strong>Date:</strong> {event.startDate} - {event.endDate}</p>
      <p><strong>Time:</strong> {event.eventTime} - {event.endTime}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Type:</strong> {event.isVirtual ? "Virtual" : "In Person"}</p>
      <p><strong>Public:</strong> {event.isPublic ? "Yes" : "No"}</p>

      {/* 📌 Add your tabs/sections below */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Registrations</h3>
        {/* <RegistrationList eventId={id} /> */}
        
        <h3 className="text-xl font-semibold mt-6 mb-2">T-Shirt Orders</h3>
        {/* <TShirtOrderList eventId={id} /> */}

        <h3 className="text-xl font-semibold mt-6 mb-2">Testimonials</h3>
        {/* <Testimonials eventId={id} /> */}
      </div>
    </div>
  );
};

export default EventDetails;
