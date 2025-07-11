import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, message, Modal, Table } from 'antd';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { UserPlus, ShoppingCart } from 'lucide-react';

import GoogleMapEmbed from '../components/event/GoogleMapEmbed';
import EventHeader from '../components/event/EventHeader';
import EventInfo from '../components/event/EventInfo';
import EventMeta from '../components/event/EventMeta';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spin, message, Modal, Card, Select, Button, Row, Col, Image, Form, Input, InputNumber } from 'antd';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { UserPlus, ShoppingCart, Users, User, Globe, Calendar, Clock, MapPin, Info, ExternalLink, Tag, Star } from 'lucide-react';
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';

const { Option } = Select;

// Utility function to deduplicate merchandise
const deduplicateMerchandise = (merchandise) => {
  if (!Array.isArray(merchandise)) return [];
  
  const seen = new Set();
  return merchandise.filter(item => {
    // Create a unique key based on type and description
    const key = `${item.type}-${item.description}`.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Enhanced Event Header with AIESEC branding
const EventHeader = ({ imageUrl, eventName, startDate, location }) => (
  <div className="relative w-full h-80 sm:h-96 mb-6 sm:mb-8 rounded-xl overflow-hidden shadow-xl">
    <img
      src={imageUrl || '/default-event-image.jpg'}
      alt="Event Banner"
      className="w-full h-full object-cover"
      onError={(e) => (e.target.src = '/default-event-image.jpg')}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
      <span className="text-xs font-semibold text-blue-600">AIESEC in University of Ruhuna</span>
    </div>
    <div className="absolute bottom-6 left-6 right-6 text-white">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">
        {eventName}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-lg">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{startDate}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Enhanced Date Badge
const EventDateBadge = ({ startDate }) => {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  
  return (
    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-3 text-center min-w-[80px]">
      <div className="text-2xl font-bold">{day}</div>
      <div className="text-sm">{month}</div>
    </div>
  );
};

// Enhanced Navigation with AIESEC styling
const EventNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'comments', label: 'Comments', icon: Users },
  ];

  return (
    <div className="border-b border-gray-200 mb-6 sm:mb-8 bg-white rounded-t-lg">
      <nav className="flex space-x-8 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Dynamic Order Form Component
const DynamicOrderForm = ({ merchandise, onCancel, onOrderSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Add your order submission logic here
      console.log('Order values:', values);
      message.success('Order placed successfully!');
      onOrderSuccess();
    } catch (error) {
      console.error('Order submission error:', error);
      message.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    const type = merchandise.type.toLowerCase();
    
    switch(type) {
      case 't-shirt':
      case 'tshirt':
        return (
          <>
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true, message: 'Please select a size' }]}
            >
              <Select placeholder="Select size">
                <Option value="XS">XS</Option>
                <Option value="S">Small</Option>
                <Option value="M">Medium</Option>
                <Option value="L">Large</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber min={1} max={10} placeholder="Enter quantity" className="w-full" />
            </Form.Item>
          </>
        );
      
      case 'hoodie':
        return (
          <>
            <Form.Item
              name="size"
              label="Size"
              rules={[{ required: true, message: 'Please select a size' }]}
            >
              <Select placeholder="Select size">
                <Option value="S">Small</Option>
                <Option value="M">Medium</Option>
                <Option value="L">Large</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
            </Form.Item>
          </>
        );
      
      case 'cap':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      case 'bag':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={3} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      case 'mug':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      case 'wristband':
      case 'sticker':
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={10} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
      
      default:
        return (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full" />
          </Form.Item>
        );
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Order {merchandise.type}</h3>
        <p className="text-gray-600 text-sm">{merchandise.description}</p>
      </div>
      
      {renderFormFields()}
      
      <Form.Item name="notes" label="Special Notes (Optional)">
        <Input.TextArea rows={3} placeholder="Any special requirements or notes..." />
      </Form.Item>
      
      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-600">
          Place Order
        </Button>
      </div>
    </Form>
  );
};

// Enhanced Merchandise Display
const MerchandiseDisplay = ({ merchandise, onOrderClick }) => {
  // Deduplicate merchandise before displaying
  const uniqueMerchandise = deduplicateMerchandise(merchandise);
  
  if (!uniqueMerchandise || uniqueMerchandise.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Official Merchandise</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uniqueMerchandise.map((item, index) => (
          <div key={`${item.type}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              {/* Images Section */}
              <div className="mb-4">
                {item.images && item.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {item.images.slice(0, 4).map((imageUrl, imgIndex) => (
                      <div key={imgIndex} className="relative group">
                        <Image
                          src={imageUrl}
                          alt={`${item.type} ${imgIndex + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer"
                          onError={(e) => (e.target.src = '/default-merchandise.jpg')}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-lg text-gray-900">{item.type}</span>
                </div>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                
                {item.available && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Available</span>
                    </div>
                    <Button
                      type="primary"
                      icon={<ShoppingCart className="w-4 h-4" />}
                      onClick={() => onOrderClick(item)}
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                    >
                      Order Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Event Details
const EventDetails = ({ event, onRegister }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const InfoItem = ({ icon, label, value, highlight = false }) => (
    <div className={`flex items-center gap-4 py-3 px-4 rounded-lg ${highlight ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {React.createElement(icon, { className: `w-5 h-5 ${highlight ? 'text-blue-600' : 'text-gray-600'}` })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Event Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoItem icon={Calendar} label="Start Date" value={formatDate(event.startDate)} highlight />
          {event.endDate && (
            <InfoItem icon={Calendar} label="End Date" value={formatDate(event.endDate)} />
          )}
          <InfoItem icon={Clock} label="Event Time" value={formatTime(event.eventTime, event.endTime)} highlight />
          
          {event.location && !event.isVirtual && (
            <InfoItem icon={MapPin} label="Location" value={event.location} />
          )}
          
          {event.isVirtual && event.virtualLink && (
            <div className="flex items-center gap-4 py-3 px-4 rounded-lg bg-green-50">
              <div className="p-2 rounded-lg bg-green-100">
                <ExternalLink className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Virtual Event</p>
                <a
                  href={event.virtualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-green-600 hover:underline"
                >
                  Join Online
                </a>
              </div>
            </div>
          )}
          
          <InfoItem icon={Globe} label="Event Type" value={`${event.isPublic ? 'Public' : 'Private'} Event`} />
          <InfoItem icon={User} label="Organized by" value="AIESEC in University of Ruhuna" />
        </div>

        {event.description && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">About this event</h3>
            <div className="text-gray-700 leading-relaxed">
              <p className={showFullDescription ? '' : 'line-clamp-3'}>
                {event.description}
              </p>
              {event.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:underline mt-2 font-medium"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={onRegister}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Register for Event
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar
const EventSidebar = ({ event }) => (
  <div className="space-y-6">
    {/* Map Section */}
    {event.location && !event.isVirtual && (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Event Location</h3>
        </div>
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Event Location"
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCIS25E6e43YO7cjdgLqdVC50sJdKBbvws&q=${encodeURIComponent(event.location)}`}
          />
        </div>
        <p className="text-sm text-gray-600 mt-3 font-medium">{event.location}</p>
      </div>
    )}

    {/* Event Highlights */}
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-yellow-100 p-2 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Event Highlights</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Networking opportunities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Professional development</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Global Exposure</span>
        </div>
        {event.hasMerchandise && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Official merchandise available</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Main Event Page Component


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
  const [merchandise, setMerchandise] = useState([]);
  const [selectedMerchandise, setSelectedMerchandise] = useState(null);

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
        const eventData = res.data;

        if (!eventData.isPublic && !currentUser) {
          message.error("This is a private event. Please log in as an AIESEC member.");
          navigate('/login');
          return;
        }

        setEvent(eventData);

        // Fetch merchandise if event has merchandise
        if (eventData.hasMerchandise) {
          try {
            const merchRes = await axios.get(`http://localhost:8080/api/merchandise/event/${id}`);
            
            // Handle different response formats and ensure it's an array
            let merchData = merchRes.data;
            if (!Array.isArray(merchData)) {
              merchData = [merchData];
            }
            
            // Deduplicate merchandise data
            const uniqueMerchandise = deduplicateMerchandise(merchData);
            setMerchandise(uniqueMerchandise);
            
            console.log('Merchandise loaded:', uniqueMerchandise); // Debug log
          } catch (merchError) {
            console.error('Error fetching merchandise:', merchError);
            setMerchandise([]);
          }
        }

      } catch (error) {
        console.error('Error fetching event:', error);
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
  }, [id, currentUser, navigate]);

  const handleOrderClick = (merchandiseItem) => {
    setSelectedMerchandise(merchandiseItem);
    setIsOrderModalVisible(true);
  };

  const handleOrderSuccess = async () => {
    setIsOrderModalVisible(false);
    setSelectedMerchandise(null);
  };

  if (loading || userLoading) {
    return (

      <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>

        <div className="flex justify-center items-center h-screen bg-gray-50">
          <Spin size="large" />
        </div>

    );
  }

  if (!event) {
    return (

      <div className="text-center mt-20 text-red-600 font-semibold text-lg">
      <div className="text-center mt-20 text-red-600 font-semibold text-lg px-4">
        Event not found or unable to load event details.
      </div>

        <div className="text-center mt-20 text-red-600 font-semibold text-lg px-4">
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

      <GoogleMapEmbed location={event.location} />

      <div className="mt-6 flex justify-center">
        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openRegistrationModal}
          style={{ backgroundColor: AIESEC_BLUE }}
          className="text-white px-6 py-2 rounded-full hover:bg-[#005a9e] transition-all shadow-md flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Register Now
        </Motion.button>
      </div>

      {/* Merchandise Section */}
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

          <div className="mt-6 flex justify-center">
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openOrderModal}
              className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-200 transition-all shadow-md flex items-center gap-2 border border-gray-300"
            >
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              Order T-Shirt
            </Motion.button>
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

        <div className="px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'about' && (
                <>
                  <EventDetails
                    event={event}
                    onRegister={() => setIsModalVisible(true)}
                  />
                  
                  {/* Merchandise Display below the main event details */}
                  {event.hasMerchandise && merchandise && merchandise.length > 0 && (
                    <MerchandiseDisplay merchandise={merchandise} onOrderClick={handleOrderClick} />
                  )}
                </>
              )}
              {activeTab === 'comments' && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Comments & Discussion</h2>
                  </div>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Discussion features coming soon...</p>
                    <p className="text-gray-400 text-sm mt-2">Connect with other attendees and share your thoughts</p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <EventSidebar event={event} />
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
                onRegister={() => {
                  message.success("Guest registration successful!");
                  setIsModalVisible(false);
                }}
              />
            ) : isMember ? (
              <MemberRegistrationModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                eventId={event.Id || id}
                onRegister={() => {
                  message.success("Registration successful!");
                  setIsModalVisible(false);
                }}
              />
            ) : null}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Order Modal */}
      {selectedMerchandise && (
        <Modal
          title={null}
          open={isOrderModalVisible}
          onCancel={() => {
            setIsOrderModalVisible(false);
            setSelectedMerchandise(null);
          }}
          footer={null}
          width={600}
          className="order-modal"
        >
          <DynamicOrderForm
            merchandise={selectedMerchandise}
            onCancel={() => {
              setIsOrderModalVisible(false);
              setSelectedMerchandise(null);
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        </Modal>
      )}
    </div>
  );
};

export default EventDetailsPage;
