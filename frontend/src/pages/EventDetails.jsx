import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message, Modal } from 'antd';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { UserPlus, ShoppingCart, Users, User, Globe, Calendar, Clock, MapPin, Info, ExternalLink } from 'lucide-react';
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';
import TShirtOrderForm from '../components/event/TShirtOrderForm';

//  Event Header
const EventHeader = ({ imageUrl, eventName, startDate, location }) => (
  <div className="relative w-full h-60 sm:h-80 mb-4 sm:mb-6 rounded-xl overflow-hidden shadow-lg">
    <img
      src={imageUrl || '/default-event-image.jpg'}
      alt="Event Banner"
      className="w-full h-full object-cover"
      onError={(e) => (e.target.src = '/default-event-image.jpg')}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
        {eventName}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{startDate}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Compact Date Badge 
const EventDateBadge = ({ startDate }) => {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  
  return (
    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white rounded-lg shadow-lg p-2 sm:p-3 text-center min-w-[60px] sm:min-w-[80px]">
      <div className="text-xl sm:text-2xl font-bold text-red-600">{day}</div>
      <div className="text-xs sm:text-sm text-gray-600">{month}</div>
    </div>
  );
};

// Responsive Navigation Tabs
const EventNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'comments', label: 'Comments' },
   
  ];

  return (
    <div className="border-b border-gray-200 mb-4 sm:mb-6">
      <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Compact Event Details 
const EventDetails = ({ event, onRegister, onOrderTshirt }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Debug: Log to see what we're getting
  console.log('EventDetails - event.hasTshirtOrder:', event.hasTshirtOrder);
  console.log('EventDetails - full event object:', event);

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime && !endTime) return 'Time TBD';
    if (startTime && endTime) return `${startTime} - ${endTime}`;
    return startTime || 'Time TBD';
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 py-2">
      {React.createElement(icon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" })}
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <p className="font-medium text-black truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black">Event Details</h2>
      
      <div className="space-y-1 sm:space-y-2">
        <InfoItem icon={Calendar} label="Start Date" value={formatDate(event.startDate)} />
        {event.endDate && (
          <InfoItem icon={Calendar} label="End Date" value={formatDate(event.endDate)} />
        )}
        <InfoItem icon={Clock} label="Event Time" value={formatTime(event.eventTime, event.endTime)} />
        
        {event.location && !event.isVirtual && (
          <InfoItem icon={MapPin} label="Location" value={event.location} />
        )}
        
        {event.isVirtual && event.virtualLink && (
          <div className="flex items-center gap-3 py-2">
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Virtual Event</p>
              <a
                href={event.virtualLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline text-sm sm:text-base"
              >
                Join Online
              </a>
            </div>
          </div>
        )}
        
        <InfoItem icon={Globe} label="Event Type" value={`${event.isPublic ? 'Public' : 'Private'} Event`} />
        <InfoItem icon={User} label="Organized by" value="AIESEC in University of Ruhuna" />
        
        {/* Debug: Show T-shirt order status */}
        {event.hasTshirtOrder && (
          <InfoItem icon={ShoppingCart} label="T-Shirt Orders" value="Available" />
        )}
      </div>

      {event.description && (
        <div className="mt-4 sm:mt-6 border-t pt-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 mb-2">About this event</p>
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <p className={showFullDescription ? '' : 'line-clamp-3'}>
                  {event.description}
                </p>
                {event.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:underline mt-2 text-sm font-medium"
                  >
                    {showFullDescription ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRegister}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          Register
        </button>
        {/* Debug: Show the condition check */}
        {console.log('Rendering T-shirt button check:', event.hasTshirtOrder)}
        {event.hasTshirtOrder && (
          <button
            onClick={onOrderTshirt}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            Order T-Shirt
          </button>
        )}
      </div>
    </div>
  );
};

// Compact Sidebar 
const EventSidebar = ({ event, merchandise, orders }) => (
  <div className="space-y-4 sm:space-y-6">
    {/* Event Stats */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Event Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">12</div>
          <div className="text-xs sm:text-sm text-gray-500">Going</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">5</div>
          <div className="text-xs sm:text-sm text-gray-500">Not Going</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">15</div>
          <div className="text-xs sm:text-sm text-gray-500">Pending</div>
        </div>
      </div>
    </div>

    {/* Merchandise Section */}
    {merchandise && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Official Merchandise</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{merchandise.description}</p>
        
        {merchandise.images && merchandise.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
            {merchandise.images.slice(0, 4).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`T-shirt ${index + 1}`}
                className="w-full h-20 sm:h-24 object-cover rounded-lg"
                onError={(e) => (e.target.src = '/default-tshirt.jpg')}
              />
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <h4 className="text-xs sm:text-sm font-medium mb-2 text-black">Recent Orders</h4>
            <p className="text-xs text-gray-500">{orders.length} orders placed</p>
          </div>
        )}
      </div>
    )}

    {/* Map Section */}
    {event.location && !event.isVirtual && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Location</h3>
        <div className="rounded-lg overflow-hidden">
          <iframe
            title="Event Location"
            width="100%"
            height="150"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCIS25E6e43YO7cjdgLqdVC50sJdKBbvws&q=${encodeURIComponent(event.location)}`}
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 truncate">{event.location}</p>
      </div>
    )}
  </div>
);

// Main Event Page Component
const EventDetailsPage = () => {
  const { id } = useParams();
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

        // Debug: Log the event data to see what we're getting
        console.log('Event data:', eventData);
        console.log('Has T-shirt order:', eventData.hasTshirtOrder);

        if (!eventData.isPublic && !currentUser) {
          message.error("This is a private event. Please log in as an AIESEC member.");
          navigate('/login');
          return;
        }

        setEvent(eventData);

        // Check if event has t-shirt orders enabled
        if (eventData.hasTshirtOrder) {
          console.log('Fetching merchandise for event:', id);
          try {
            const merchRes = await axios.get(`http://localhost:8080/api/merchandise/event/${id}`);
            console.log('Merchandise data:', merchRes.data);
            setMerchandise(merchRes.data);

            // Fetch orders if we have merchandise
            if (merchRes.data && merchRes.data.merchandiseId) {
              const orderRes = await axios.get(`http://localhost:8080/api/tshirt-orders`);
              const filteredOrders = orderRes.data.filter(o => o.merchandiseId === merchRes.data.merchandiseId);
              console.log('T-shirt orders:', filteredOrders);
              setOrders(filteredOrders);
            }
          } catch (merchError) {
            console.error('Error fetching merchandise:', merchError);
            console.error('Merchandise error details:', merchError.response?.data);
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

  const handleOrderSuccess = async () => {
    message.success("Order placed!");
    setIsOrderModalVisible(false);
    
    // Refresh orders
    if (merchandise) {
      try {
        const res = await axios.get(`http://localhost:8080/api/tshirt-orders`);
        setOrders(res.data.filter(o => o.merchandiseId === merchandise.merchandiseId));
      } catch (error) {
        console.error('Error refreshing orders:', error);
      }
    }
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
                  onRegister={() => setIsModalVisible(true)}
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
        )}
      </AnimatePresence>

      {/* T-Shirt Order Modal */}
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