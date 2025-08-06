import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, message, Button } from 'antd';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import EventHeader from '../components/event/EventHeader';
import EventInfo from '../components/event/EventInfo';
import EventMeta from '../components/event/EventMeta';
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser, loading: userLoading } = useSelector((state) => state.user);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isMember = currentUser && ['LCP', 'LCVP', 'Team_Leader', 'Member'].includes(currentUser.role);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://aiesecinruhuna-production.up.railway.app/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error('❌ Error fetching event:', error);
        message.error('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const openRegistrationModal = () => {
    if (!event) return;

    // Guest trying to register for private event
    if (!event.isPublic && !currentUser) {
      message.error("This is a private event. Please log in to register.");
      return;
    }

    setIsModalVisible(true);
  };

  if (loading || userLoading) {
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

      {/* Registration Modals */}
      {isMember ? (
        <MemberRegistrationModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          eventId={event.eventId || id}
          onRegister={() => {
            message.success("Registration successful!");
            setIsModalVisible(false);
          }}
        />
      ) : (
        <GuestRegistrationModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          eventId={event.eventId || id}
          onRegister={() => {
            message.success("Guest registration successful!");
            setIsModalVisible(false);
          }}
        />
      )}
    </Motion.div>
  );
};

export default EventDetails;
