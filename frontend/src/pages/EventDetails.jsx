import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, message, Button, Modal, Table } from 'antd';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import EventHeader from '../components/event/EventHeader';
import EventInfo from '../components/event/EventInfo';
import EventMeta from '../components/event/EventMeta';
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';
import TShirtOrderForm from '../components/event/TShirtOrderForm';

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser, loading: userLoading } = useSelector((state) => state.user);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [merchandise, setMerchandise] = useState(null);
  const [orders, setOrders] = useState([]);

  const isMember = currentUser && ['LCP', 'LCVP', 'Team_Leader', 'Member'].includes(currentUser.role);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`);
        setEvent(res.data);

        if (res.data.hasTshirtOrder) {
          const merchRes = await axios.get(`http://localhost:8080/api/merchandise/event/${id}`);
          setMerchandise(merchRes.data);

          const orderRes = await axios.get(`http://localhost:8080/api/tshirt-orders`);
          const filtered = orderRes.data.filter(o => o.merchandiseId === merchRes.data.merchandiseId);
          setOrders(filtered);
        }
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
    if (!event.isPublic && !currentUser) {
      message.error("This is a private event. Please log in to register.");
      return;
    }
    setIsModalVisible(true);
  };

  const openOrderModal = () => {
    if (!currentUser && !event.isPublic) {
      message.error("Login required to order T-shirts for this event.");
      return;
    }
    setIsOrderModalVisible(true);
  };

  const handleOrderSuccess = async () => {
    message.success("Order placed!");
    setIsOrderModalVisible(false);
    const res = await axios.get(`http://localhost:8080/api/tshirt-orders`);
    const filtered = res.data.filter(o => o.merchandiseId === merchandise.merchandiseId);
    setOrders(filtered);
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

      <div className="mt-6 flex justify-center gap-4">
        <Button type="primary" size="large" onClick={openRegistrationModal}>
          Register Now
        </Button>

        {event.hasTshirtOrder && (
          <Button size="large" onClick={openOrderModal} className="bg-blue-600 text-white">
            Order T-Shirt
          </Button>
        )}
      </div>

      {merchandise && (
        <div className="mt-10">
          <h3 className="text-black xl font-semibold mb-2">T-Shirt Merchandise</h3>
          <p className="text-gray-700 mb-3">{merchandise.description}</p>
          <div className="flex flex-wrap gap-4">
            {merchandise.imageUrls?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Tshirt ${index}`}
                className="w-32 h-32 object-cover rounded shadow"
              />
            ))}
          </div>

          {orders.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-2">Orders</h4>
              <Table
                dataSource={orders.map((o, i) => ({
                  key: i,
                  size: o.size,
                  quantity: o.quantity,
                  userId: o.userId || "Guest"
                }))}
                columns={[
                  { title: "Size", dataIndex: "size" },
                  { title: "Quantity", dataIndex: "quantity" },
                  { title: "User", dataIndex: "userId" }
                ]}
                pagination={false}
                bordered
              />
            </div>
          )}
        </div>
      )}

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

      <Modal
        title="Order T-Shirt"
        open={isOrderModalVisible}
        onCancel={() => setIsOrderModalVisible(false)}
        footer={null}
      >
        <TShirtOrderForm
          merchandise={merchandise}
          user={currentUser}
          onCancel={() => setIsOrderModalVisible(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      </Modal>
    </Motion.div>
  );
};

export default EventDetails;