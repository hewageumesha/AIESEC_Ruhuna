import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Spin, message, Modal, Card, Select, Button, Row, Col, Image, Form, Input, InputNumber } from 'antd';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { UserPlus, ShoppingCart, Users, User, Globe, Calendar, Clock, MapPin, Info, ExternalLink, Tag, Star, Moon, Sun } from 'lucide-react';
import MemberRegistrationModal from '../components/event/MemberRegistrationModal';
import GuestRegistrationModal from '../components/event/GuestRegistrationModal';

const { Option } = Select;

// Dark Mode Context Hook (you can replace this with your existing theme context)
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
};

// Theme-aware class utility
const getThemeClasses = (lightClasses, darkClasses) => {
  return `${lightClasses} dark:${darkClasses}`;
};

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

// Enhanced Event Header with AIESEC branding and dark mode
const EventHeader = ({ imageUrl, eventName, startDate, location }) => (
  <div className="relative w-full h-80 sm:h-96 mb-6 sm:mb-8 rounded-xl overflow-hidden shadow-xl">
    <img
      src={imageUrl || '/default-event-image.jpg'}
      alt="Event Banner"
      className="w-full h-full object-cover"
      onError={(e) => (e.target.src = '/default-event-image.jpg')}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className={getThemeClasses(
      "absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full",
      "bg-gray-800/90"
    )}>
      <span className={getThemeClasses(
        "text-xs font-semibold text-blue-600",
        "text-blue-400"
      )}>AIESEC in University of Ruhuna</span>
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

// Enhanced Date Badge with dark mode
const EventDateBadge = ({ startDate }) => {
  const date = new Date(startDate);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  
  return (
    <div className={getThemeClasses(
      "absolute top-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-3 text-center min-w-[80px]",
      "bg-blue-500"
    )}>
      <div className="text-2xl font-bold">{day}</div>
      <div className="text-sm">{month}</div>
    </div>
  );
};



// Enhanced Navigation with AIESEC styling and dark mode
const EventNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    
  ];

  return (
    <div className={getThemeClasses(
      "border-b border-gray-200 mb-6 sm:mb-8 bg-white rounded-t-lg",
      "border-gray-700 bg-gray-800"
    )}>
      <nav className="flex space-x-8 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? getThemeClasses('border-blue-600 text-blue-600', 'border-blue-400 text-blue-400')
                : getThemeClasses(
                    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  )
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

// Dynamic Order Form Component with dark mode
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
              label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Size</span>}
              rules={[{ required: true, message: 'Please select a size' }]}
            >
              <Select placeholder="Select size" className="dark:bg-gray-700">
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
              label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber min={1} max={10} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
            </Form.Item>
          </>
        );
      
      case 'hoodie':
        return (
          <>
            <Form.Item
              name="size"
              label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Size</span>}
              rules={[{ required: true, message: 'Please select a size' }]}
            >
              <Select placeholder="Select size" className="dark:bg-gray-700">
                <Option value="S">Small</Option>
                <Option value="M">Medium</Option>
                <Option value="L">Large</Option>
                <Option value="XL">XL</Option>
                <Option value="XXL">XXL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
            </Form.Item>
          </>
        );
      
      case 'cap':
        return (
          <Form.Item
            name="quantity"
            label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
          </Form.Item>
        );
      
      case 'bag':
        return (
          <Form.Item
            name="quantity"
            label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={3} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
          </Form.Item>
        );
      
      case 'mug':
        return (
          <Form.Item
            name="quantity"
            label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
          </Form.Item>
        );
      
      case 'wristband':
      case 'sticker':
        return (
          <Form.Item
            name="quantity"
            label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={10} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
          </Form.Item>
        );
      
      default:
        return (
          <Form.Item
            name="quantity"
            label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Quantity</span>}
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} max={5} placeholder="Enter quantity" className="w-full dark:bg-gray-700" />
          </Form.Item>
        );
    }
  };

  return (
    <div className={getThemeClasses("bg-white", "bg-gray-800")}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="mb-4">
          <h3 className={getThemeClasses("text-lg font-semibold mb-2 text-gray-900", "text-gray-100")}>
            Order {merchandise.type}
          </h3>
          <p className={getThemeClasses("text-gray-600 text-sm", "text-gray-400")}>
            {merchandise.description}
          </p>
        </div>
        
        {renderFormFields()}
        
        <Form.Item 
          name="notes" 
          label={<span className={getThemeClasses("text-gray-700", "text-gray-300")}>Special Notes (Optional)</span>}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Any special requirements or notes..." 
            className={getThemeClasses("", "dark:bg-gray-700 dark:border-gray-600")}
          />
        </Form.Item>
        
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} className={getThemeClasses("", "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300")}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            Place Order
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Enhanced Merchandise Display with dark mode
const MerchandiseDisplay = ({ merchandise, onOrderClick }) => {
  // Deduplicate merchandise before displaying
  const uniqueMerchandise = deduplicateMerchandise(merchandise);
  
  if (!uniqueMerchandise || uniqueMerchandise.length === 0) return null;

  return (
    <div className={getThemeClasses(
      "bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-8",
      "bg-gray-800 border-gray-700"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={getThemeClasses(
          "bg-blue-100 p-2 rounded-lg",
          "bg-blue-900"
        )}>
          <ShoppingCart className={getThemeClasses("w-6 h-6 text-blue-600", "text-blue-400")} />
        </div>
        <h3 className={getThemeClasses("text-2xl font-bold text-gray-900", "text-gray-100")}>
          Official Merchandise
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uniqueMerchandise.map((item, index) => (
          <div key={`${item.type}-${index}`} className={getThemeClasses(
            "bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow",
            "bg-gray-700 border-gray-600 hover:shadow-lg hover:shadow-gray-900/50"
          )}>
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
                  <div className={getThemeClasses(
                    "w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center",
                    "bg-gray-600"
                  )}>
                    <span className={getThemeClasses("text-gray-500", "text-gray-400")}>
                      No images available
                    </span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className={getThemeClasses("w-4 h-4 text-blue-600", "text-blue-400")} />
                  <span className={getThemeClasses("font-semibold text-lg text-gray-900", "text-gray-100")}>
                    {item.type}
                  </span>
                </div>
                <p className={getThemeClasses("text-gray-700 mb-4 text-sm leading-relaxed", "text-gray-300")}>
                  {item.description}
                </p>
                
                {item.available && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Available</span>
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

// Enhanced Event Details with dark mode
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
    <div className={`flex items-center gap-4 py-3 px-4 rounded-lg ${
      highlight 
        ? getThemeClasses('bg-blue-50', 'bg-blue-900/30') 
        : getThemeClasses('bg-gray-50', 'bg-gray-700')
    }`}>
      <div className={`p-2 rounded-lg ${
        highlight 
          ? getThemeClasses('bg-blue-100', 'bg-blue-800') 
          : getThemeClasses('bg-gray-100', 'bg-gray-600')
      }`}>
        {React.createElement(icon, { 
          className: `w-5 h-5 ${
            highlight 
              ? getThemeClasses('text-blue-600', 'text-blue-400') 
              : getThemeClasses('text-gray-600', 'text-gray-400')
          }` 
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p className={getThemeClasses("text-sm text-gray-500 font-medium", "text-gray-400")}>
          {label}
        </p>
        <p className={getThemeClasses("font-semibold text-gray-900 truncate", "text-gray-100")}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className={getThemeClasses(
        "bg-white rounded-lg shadow-lg border border-gray-200 p-6",
        "bg-gray-800 border-gray-700"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className={getThemeClasses(
            "bg-blue-100 p-2 rounded-lg",
            "bg-blue-900"
          )}>
            <Info className={getThemeClasses("w-6 h-6 text-blue-600", "text-blue-400")} />
          </div>
          <h2 className={getThemeClasses("text-2xl font-bold text-gray-900", "text-gray-100")}>
            Event Information
          </h2>
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
            <div className={getThemeClasses(
              "flex items-center gap-4 py-3 px-4 rounded-lg bg-green-50",
              "bg-green-900/30"
            )}>
              <div className={getThemeClasses(
                "p-2 rounded-lg bg-green-100",
                "bg-green-800"
              )}>
                <ExternalLink className={getThemeClasses("w-5 h-5 text-green-600", "text-green-400")} />
              </div>
              <div>
                <p className={getThemeClasses("text-sm text-gray-500 font-medium", "text-gray-400")}>
                  Virtual Event
                </p>
                <a
                  href={event.virtualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getThemeClasses("font-semibold text-green-600 hover:underline", "text-green-400")}
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
          <div className="border-t pt-6 dark:border-gray-700">
            <h3 className={getThemeClasses("text-lg font-semibold mb-3 text-gray-900", "text-gray-100")}>
              About this event
            </h3>
            <div className={getThemeClasses("text-gray-700 leading-relaxed", "text-gray-300")}>
              <p className={showFullDescription ? '' : 'line-clamp-3'}>
                {event.description}
              </p>
              {event.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className={getThemeClasses("text-blue-600 hover:underline mt-2 font-medium", "text-blue-400")}
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t dark:border-gray-700">
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

// Enhanced Sidebar with dark mode
const EventSidebar = ({ event }) => (
  <div className="space-y-6">
    {/* Map Section */}
    {event.location && !event.isVirtual && (
      <div className={getThemeClasses(
        "bg-white rounded-lg shadow-lg border border-gray-200 p-6",
        "bg-gray-800 border-gray-700"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className={getThemeClasses(
            "bg-red-100 p-2 rounded-lg",
            "bg-red-900"
          )}>
            <MapPin className={getThemeClasses("w-6 h-6 text-red-600", "text-red-400")} />
          </div>
          <h3 className={getThemeClasses("text-lg font-semibold text-gray-900", "text-gray-100")}>
            Event Location
          </h3>
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
        <p className={getThemeClasses("text-sm text-gray-600 mt-3 font-medium", "text-gray-400")}>
          {event.location}
        </p>
      </div>
    )}

    {/* Event Highlights */}
    <div className={getThemeClasses(
      "bg-white rounded-lg shadow-lg border border-gray-200 p-6",
      "bg-gray-800 border-gray-700"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={getThemeClasses(
          "bg-yellow-100 p-2 rounded-lg",
          "bg-yellow-900"
        )}>
          <Star className={getThemeClasses("w-6 h-6 text-yellow-600", "text-yellow-400")} />
        </div>
        <h3 className={getThemeClasses("text-lg font-semibold text-gray-900", "text-gray-100")}>
          Event Highlights
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className={getThemeClasses("text-sm text-gray-700", "text-gray-300")}>
            Networking opportunities
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className={getThemeClasses("text-sm text-gray-700", "text-gray-300")}>
            Professional development
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className={getThemeClasses("text-sm text-gray-700", "text-gray-300")}>
            Global Exposure
          </span>
        </div>
        {event.hasMerchandise && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className={getThemeClasses("text-sm text-gray-700", "text-gray-300")}>
              Official merchandise available
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);
// Main Event Page Component with Dark Mode Support
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
  const [darkMode, setDarkMode] = useState(false);

  const isMember = currentUser && ['LCP', 'LCVP', 'Team_Leader', 'Member'].includes(currentUser.role);

  // Dark mode detection effect
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`);
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
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center pt-20 text-red-600 dark:text-red-400 font-semibold text-lg px-4">
          Event not found or unable to load event details.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <EventHeader
            imageUrl={event.imageUrl}
            eventName={event.eventName}
            startDate={event.startDate}
            location={event.location}
            darkMode={darkMode}
          />
          <EventDateBadge startDate={event.startDate} darkMode={darkMode} />
        </div>

        <div className="px-4 sm:px-6">
          <EventNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            darkMode={darkMode}
          />
        </div>

        <div className="px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'about' && (
                <>
                  <EventDetails
                    event={event}
                    onRegister={() => setIsModalVisible(true)}
                    darkMode={darkMode}
                  />
                  
                  {/* Merchandise Display below the main event details */}
                  {event.hasMerchandise && merchandise && merchandise.length > 0 && (
                    <div className="mt-8">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Event Merchandise
                          </h2>
                        </div>
                        <MerchandiseDisplay 
                          merchandise={merchandise} 
                          onOrderClick={handleOrderClick}
                          darkMode={darkMode}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeTab === 'comments' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg transition-colors duration-300">
                      <Users className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Comments & Discussion
                    </h2>
                  </div>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors duration-300" />
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

            <div className="lg:col-span-1">
              <EventSidebar event={event} darkMode={darkMode} />
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
                onRegister={() => {
                  message.success("Guest registration successful!");
                  setIsModalVisible(false);
                }}
                darkMode={darkMode}
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
                darkMode={darkMode}
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
          className={`order-modal ${darkMode ? 'dark-modal' : ''}`}
          styles={{
            content: {
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderRadius: '12px',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            },
            header: {
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            }
          }}
        >
          <DynamicOrderForm
            merchandise={selectedMerchandise}
            onCancel={() => {
              setIsOrderModalVisible(false);
              setSelectedMerchandise(null);
            }}
            onOrderSuccess={handleOrderSuccess}
            darkMode={darkMode}
          />
        </Modal>
      )}
    </div>
  );
};

export default EventDetailsPage;