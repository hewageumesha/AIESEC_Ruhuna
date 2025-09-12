import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spin, message, Modal } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Import refactored components
import {
  EventHeader,
  EventDateBadge,
  EventNavigation,
  EventDetails,
  EventSidebar,
  MerchandiseDisplay,
  DynamicOrderForm
} from '../components/event';

// Import existing modals (assuming they're already created)
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';

// Import utilities
import { deduplicateMerchandise, isMember } from '../utils/eventUtils';

/**
 * Main Event Details Page Component
 * Displays comprehensive event information with registration and merchandise ordering
 */
const EventDetailsPage = () => {
  // Router hooks
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicPage = location.pathname.includes("/public");

  // Redux state
  const { currentUser, loading: userLoading } = useSelector((state) => state.user);

  // Local state
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [merchandise, setMerchandise] = useState([]);
  const [selectedMerchandise, setSelectedMerchandise] = useState(null);

  // Computed values
  const isUserMember = isMember(currentUser);

  /**
   * Fetch event data and merchandise
   */
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`);
        const eventData = res.data;

        // Check access permissions
        if (!eventData.isPublic && !currentUser) {
          message.error("This is a private event. Please log in as an AIESEC member.");
          navigate('/login');
          return;
        }

        setEvent(eventData);

        // Fetch merchandise if available
        if (eventData.hasMerchandise) {
          await fetchMerchandise(id);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        message.error('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, currentUser, navigate]);

  /**
   * Fetch merchandise data
   */
  const fetchMerchandise = async (eventId) => {
    try {
      const merchRes = await axios.get(`http://localhost:8080/api/merchandise/event/${eventId}`);
      
      // Ensure array format
      let merchData = merchRes.data;
      if (!Array.isArray(merchData)) {
        merchData = [merchData];
      }
      
      // Deduplicate and set merchandise
      const uniqueMerchandise = deduplicateMerchandise(merchData);
      setMerchandise(uniqueMerchandise);
      
      console.log('Merchandise loaded:', uniqueMerchandise);
    } catch (merchError) {
      console.error('Error fetching merchandise:', merchError);
      setMerchandise([]);
    }
  };

  /**
   * Handle merchandise order click
   */
  const handleOrderClick = (merchandiseItem) => {
    setSelectedMerchandise(merchandiseItem);
    setIsOrderModalVisible(true);
  };

  /**
   * Handle successful order submission
   */
  const handleOrderSuccess = () => {
    setIsOrderModalVisible(false);
    setSelectedMerchandise(null);
    message.success('Order placed successfully!');
  };

  /**
   * Handle registration modal close
   */
  const handleRegistrationSuccess = (isGuest = false) => {
    setIsModalVisible(false);
    const successMessage = isGuest ? "Guest registration successful!" : "Registration successful!";
    message.success(successMessage);
  };

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!event) {
    return (
      <div className="text-center mt-20 text-red-600 dark:text-red-400 font-semibold text-lg px-4">
        Event not found or unable to load event details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Event Header Section */}
        <div className="relative">
          <EventHeader
            imageUrl={event.imageUrl}
            eventName={event.eventName}
            startDate={event.startDate}
            location={event.location}
          />
          <EventDateBadge startDate={event.startDate} />
        </div>

        {/* Navigation Section */}
        <div className="px-4 sm:px-6">
          <EventNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content Section */}
        <div className="px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {activeTab === 'about' && (
                <>
                  <EventDetails
                    event={event}
                    onRegister={() => setIsModalVisible(true)}
                  />
                  
                  {/* Merchandise Section */}
                  {event.hasMerchandise && merchandise?.length > 0 && (
                    <MerchandiseDisplay 
                      merchandise={merchandise} 
                      onOrderClick={handleOrderClick} 
                    />
                  )}
                </>
              )}
              
              {activeTab === 'comments' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                      <TeamOutlined className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Comments & Discussion
                    </h2>
                  </div>
                  <div className="text-center py-12">
                    <TeamOutlined className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Discussion features coming soon...
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Connect with other attendees and share your thoughts
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <EventSidebar event={event} />
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
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
                eventId={event?.Id || id}
                onRegister={() => handleRegistrationSuccess(true)}
              />
            ) : isUserMember ? (
              <MemberRegistrationModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                eventId={event.Id || id}
                onRegister={() => handleRegistrationSuccess(false)}
              />
            ) : null}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <Modal
        title={null}
        open={isOrderModalVisible && selectedMerchandise}
        onCancel={() => {
          setIsOrderModalVisible(false);
          setSelectedMerchandise(null);
        }}
        footer={null}
        width={600}
        className="order-modal"
        styles={{
          content: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            padding: 0,
          }
        }}
      >
        {selectedMerchandise && (
          <DynamicOrderForm
            merchandise={selectedMerchandise}
            onCancel={() => {
              setIsOrderModalVisible(false);
              setSelectedMerchandise(null);
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default EventDetailsPage;
