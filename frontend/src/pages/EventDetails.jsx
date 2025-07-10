import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spin, message, Button, Modal } from 'antd';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { UserPlus, ShoppingCart, Users, User, Globe, Calendar, Clock, MapPin, Info, ExternalLink } from 'lucide-react';
import EventInfo from '../components/event/EventInfo';
import EventMeta from '../components/event/EventMeta';
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';
import TShirtOrderForm from '../components/event/TShirtOrderForm';
import EventHeader from '../components/event/EventHeader';
import EventDateBadge from '../components/event/EventDateBadge';
import EventNavigation from '../components/event/EventNavigation';
import EventDetails from '../components/event/EventDetails';
import EventSidebar from '../components/event/EventSidebar';

const EventDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isPublicPage = location.pathname.includes("/public");

  const navigate = useNavigate();
  const { currentUser, loading: userLoading } = useSelector((state) => state.user);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
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
        const eventData = res.data;

        console.log('Event data:', eventData);

        if (!eventData.isPublic && !currentUser) {
          message.error("This is a private event. Please log in as an AIESEC member.");
          navigate('/login');
          return;
        }

        setEvent(eventData);

        if (eventData.hasTshirtOrder) {
          try {
            const merchRes = await axios.get(`http://localhost:8080/api/merchandise/event/${id}`);
            setMerchandise(merchRes.data);

            if (merchRes.data && merchRes.data.merchandiseId) {
              const orderRes = await axios.get(`http://localhost:8080/api/tshirt-orders`);
              const filteredOrders = orderRes.data.filter(o => o.merchandiseId === merchRes.data.merchandiseId);
              setOrders(filteredOrders);
            }
          } catch (merchError) {
            console.error('Error fetching merchandise:', merchError);
          }
        }

      } catch (error) {
        console.error('❌ Error fetching event:', error);
        message.error('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id, currentUser, navigate]);

  const openRegistrationModal = () => {
    if (!event) return;
    if (!event.isPublic && !currentUser) {
      message.error("This is a private event. Please log in to register.");
      return;
    }
    setIsModalVisible(true);
  };

  const handleOrderSuccess = () => {
    message.success("T-shirt order placed successfully!");
    setIsOrderModalVisible(false);
  };

  if (loading || userLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <Spin size="large" />
        </div>
    );
  }

  if (!event) {
    return (
        <div className="text-center mt-20 text-red-600 font-semibold text-lg px-4">
          Event not found or unable to load event details.
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <EventHeader
                imageUrl={event.imageUrl}
                eventName={event.eventName}
                startDate={event.startDate}
                location={event.location}
            />
            <EventDateBadge startDate={event.startDate} />
          </div>

          <div className="px-4 sm:px-6">
            <EventNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="px-4 sm:px-6 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                {activeTab === 'about' && (
                    <EventDetails
                        event={event}
                        onRegister={openRegistrationModal}
                        onOrderTshirt={() => setIsOrderModalVisible(true)}
                    />
                )}
                {activeTab === 'comments' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black">Comments</h2>
                      <p className="text-gray-500 text-sm sm:text-base">Discussion features coming soon...</p>
                    </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <EventSidebar event={event} merchandise={merchandise} orders={orders} />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isModalVisible && (
              <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
              >
                {isPublicPage && event?.isPublic ? (
                    <GuestRegistrationModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        eventId={event?.eventId || id}
                        onRegister={() => {
                          message.success("Guest registration successful!");
                          setIsModalVisible(false);
                        }}
                    />
                ) : isMember ? (
                    <MemberRegistrationModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        eventId={event.eventId || id}
                        onRegister={() => {
                          message.success("Registration successful!");
                          setIsModalVisible(false);
                        }}
                    />
                ) : null}
              </Motion.div>
          )}
        </AnimatePresence>

        {event.hasTshirtOrder && merchandise && (
            <Modal
                title="Order T-Shirt"
                open={isOrderModalVisible}
                onCancel={() => setIsOrderModalVisible(false)}
                footer={null}
                width={500}
            >
              <TShirtOrderForm
                  merchandise={merchandise}
                  user={currentUser}
                  onCancel={() => setIsOrderModalVisible(false)}
                  onOrderSuccess={handleOrderSuccess}
              />
            </Modal>
        )}
      </div>
  );
};

export default EventDetailsPage;
