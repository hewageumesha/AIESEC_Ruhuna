import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, message, Button } from 'antd';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';

import EventHeader from '../components/event/EventHeader';
import EventInfo from '../components/event/EventInfo';
import EventMeta from '../components/event/EventMeta';
import EventRegistrationModal from '../components/event/EventRegistrationModal';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error('❌ Error fetching event:', error);
        message.error('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const openRegistrationModal = () => {
    setIsModalVisible(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold text-lg">
        Event not found or unable to load event details.
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl"
    >
      <EventHeader
        imageUrl={event.imageUrl}
        eventName={event.eventName}
        startDate={event.startDate}
        location={event.location}
      />

      <EventInfo
        eventName={event.eventName}
        description={event.description}
      />

      <EventMeta
        startDate={event.startDate}
        endDate={event.endDate}
        eventTime={event.eventTime}
        endTime={event.endTime}
      />

      <div className="mt-6 text-center">
        <Button type="primary" size="large" onClick={openRegistrationModal}>
          Register Now
        </Button>
      </div>

      <EventRegistrationModal
        isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalVisible}
        eventId={event.eventId || id}
        userId={user?.id || null}
      />
    </Motion.div>
  );
};

export default EventDetails;
