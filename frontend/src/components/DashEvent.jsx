import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, message, Tag, Popconfirm, Space, Modal } from 'antd';
import { PlusOutlined, CloseOutlined, EditOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddEventForm from './event/AddEventForm';
import EventFilterForm from './event/EventFilterForm';
import GalleryUploader from './event/GalleryUploader';

const { Meta } = Card;

const DashEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', date: '' });
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser);

  const canEditOrDelete = () => {
    return currentUser && (currentUser.role === 'LCP' || currentUser.role === 'LCVP');
  };

  const fetchFilteredEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const response = await axios.get('https://aiesecinruhuna-production.up.railway.app/api/events/filter', {
        params,
      });

      setEvents(response.data.content);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      message.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (eventId) => navigate(`/event/${eventId}`);

  const handleEdit = (eventId, e) => {
    e.stopPropagation();
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = async (eventId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://aiesecinruhuna-production.up.railway.app/api/events/${eventId}`);
      message.success('Event deleted successfully');
      fetchFilteredEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      message.error('Failed to delete event');
    }
  };

  const handleViewAnalytics = () => {
    navigate('/event-analytics');
  };

  useEffect(() => {
    fetchFilteredEvents();
  }, []);

  // Enhanced AIESEC button styles with gradients
  const aiesecButtonStyle = {
    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    height: '42px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Event Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base transition-colors duration-300">
            Manage and showcase your events with style
          </p>
        </div>

        {canEditOrDelete() && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="primary"
              icon={showAddForm ? <CloseOutlined /> : <PlusOutlined />}
              onClick={() => setShowAddForm(!showAddForm)}
              style={aiesecButtonStyle}
              className="flex-1 sm:flex-none min-w-[160px] hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              size="large"
            >
              <span className="hidden sm:inline">
                {showAddForm ? 'Close Form' : 'Create New Event'}
              </span>
              <span className="sm:hidden">
                {showAddForm ? 'Close' : 'Create Event'}
              </span>
            </Button>

            <Button
              type="primary"
              icon={<BarChartOutlined />}
              onClick={handleViewAnalytics}
              style={aiesecButtonStyle}
              className="flex-1 sm:flex-none min-w-[140px] hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              size="large"
            >
              <span className="hidden sm:inline">View Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowGalleryUpload(true)}
              style={aiesecButtonStyle}
              className="flex-1 sm:flex-none min-w-[140px] hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              size="large"
            >
              <span className="hidden sm:inline">Gallery Images</span>
              <span className="sm:hidden">Gallery</span>
            </Button>
          </div>
        )}
      </div>

      {/* Add Event Form */}
      {showAddForm && canEditOrDelete() && (
        <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl p-6 lg:p-8 transition-colors duration-300">
          <AddEventForm onEventAdded={fetchFilteredEvents} />
        </div>
      )}

      {/* Filter Form */}
      <div className="mb-8">
        <EventFilterForm 
          filters={filters} 
          setFilters={setFilters} 
          onFilter={fetchFilteredEvents} 
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Loading amazing events...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {events.map((event) => (
            <div key={event.eventId} className="group">
              <Card
                hoverable
                onClick={() => handleCardClick(event.eventId)}
                className="event-card relative overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm cursor-pointer rounded-2xl"
                style={{
                  background: 'var(--card-bg)',
                  backdropFilter: 'blur(10px)',
                }}
                cover={
                  <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-2xl">
                    <img
                      alt={event.eventName}
                      src={event.imageUrl || '/default-event.jpg'}
                      onError={(e) => (e.target.src = '/default-event.jpg')}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating action button */}
                    <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full p-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                }
              >
                {/* Enhanced Event Type Tag */}
                {event.eventType && (
                  <Tag 
                    className="absolute top-4 right-4 z-20 capitalize border-0 font-semibold text-white shadow-lg backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
                      borderRadius: '12px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {event.eventType.replace('_', ' ')}
                  </Tag>
                )}

                {/* Enhanced Action Buttons */}
                {canEditOrDelete() && (
                  <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={(e) => handleEdit(event.eventId, e)}
                      className="shadow-lg hover:shadow-xl backdrop-blur-sm border-0 hover:scale-110 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '8px',
                      }}
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this event?"
                      onConfirm={(e) => handleDelete(event.eventId, e)}
                      okText="Yes"
                      cancelText="No"
                      onCancel={(e) => e.stopPropagation()}
                      okButtonProps={{
                        style: {
                          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                          borderColor: 'transparent',
                        }
                      }}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        className="shadow-lg hover:shadow-xl backdrop-blur-sm border-0 hover:scale-110 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                          color: 'white',
                          borderRadius: '8px',
                        }}
                      />
                    </Popconfirm>
                  </div>
                )}

                <div className="p-6">
                  <Meta
                    title={
                      <span className="font-bold text-xl text-gray-800 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 leading-tight">
                        {event.eventName}
                      </span>
                    }
                    description={
                      <div className="text-gray-600 dark:text-gray-300 mt-4 space-y-3 transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">
                            <strong className="text-indigo-700 dark:text-indigo-300">Date:</strong> {event.startDate} to {event.endDate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full animate-pulse delay-300"></div>
                          <span className="text-sm font-medium">
                            <strong className="text-purple-700 dark:text-purple-300">Time:</strong> {event.eventTime} - {event.endTime}
                          </span>
                        </div>
                      </div>
                    }
                  />
                  
                  {/* Enhanced CTA button */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm backdrop-blur-sm">
                      <span className="flex items-center justify-center space-x-2">
                        <span>View Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-xl transition-colors duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-2 transition-colors duration-300">
              No events found
            </div>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Try adjusting your filters or create your first amazing event!
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Gallery Upload Modal */}
      <Modal
        title={
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Upload Gallery Images
          </span>
        }
        open={showGalleryUpload}
        onCancel={() => setShowGalleryUpload(false)}
        footer={null}
        destroyOnClose
        width="90%"
        style={{ maxWidth: '700px' }}
        className="top-4 dark-modal"
        styles={{
          mask: { backdropFilter: 'blur(8px)' },
          content: { 
            borderRadius: '16px', 
            overflow: 'hidden',
            background: 'var(--modal-bg)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <GalleryUploader 
          onClose={() => setShowGalleryUpload(false)} 
          events={events} 
        />
      </Modal>

      {/* Enhanced Custom CSS with Dark Mode Support */}
      <style jsx>{`
        :root {
          --card-bg: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%);
          --modal-bg: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
        }
        
        .dark {
          --card-bg: linear-gradient(135deg, rgba(31,41,55,0.9) 0%, rgba(31,41,55,0.8) 100%);
          --modal-bg: linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(31,41,55,0.9) 100%);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .group:hover .ant-card {
          box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.25);
        }
        
        .dark .group:hover .ant-card {
          box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.4);
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4) !important;
        }
        
        .ant-card-meta-title {
          margin-bottom: 8px !important;
        }
        
        .ant-card-meta-description {
          color: #6B7280 !important;
        }
        
        .dark .ant-card-meta-description {
          color: #D1D5DB !important;
        }
        
        .ant-modal-content {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        
        .dark .ant-modal-content {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        
        /* Dark mode modal styles */
        .dark .dark-modal .ant-modal-content {
          background: var(--modal-bg) !important;
          color: #F3F4F6 !important;
        }
        
        .dark .dark-modal .ant-modal-header {
          background: transparent !important;
          border-bottom: 1px solid rgba(75, 85, 99, 0.3) !important;
        }
        
        .dark .dark-modal .ant-modal-title {
          color: #F3F4F6 !important;
        }
        
        .dark .dark-modal .ant-modal-close {
          color: #9CA3AF !important;
        }
        
        .dark .dark-modal .ant-modal-close:hover {
          color: #F3F4F6 !important;
        }
        
        /* Enhanced event card styles */
        .event-card {
          transition: all 0.3s ease, box-shadow 0.3s ease !important;
        }
        
        .dark .event-card {
          border: 1px solid rgba(75, 85, 99, 0.2) !important;
        }
        
        .event-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
        }
        
        .dark .event-card:hover {
          border-color: rgba(139, 92, 246, 0.3) !important;
        }
        
        /* Improved spin component for dark mode */
        .dark .ant-spin-dot-item {
          background-color: #8B5CF6 !important;
        }
        
        /* Enhanced popconfirm styles */
        .dark .ant-popover-inner {
          background: #1F2937 !important;
          color: #F3F4F6 !important;
        }
        
        .dark .ant-popover-arrow-content {
          background: #1F2937 !important;
        }
        
        .dark .ant-popover-title {
          color: #F3F4F6 !important;
          border-bottom-color: rgba(75, 85, 99, 0.3) !important;
        }
        
        @media (max-width: 640px) {
          .ant-card-meta-title {
            font-size: 16px !important;
          }
          
          .ant-card-meta-description {
            font-size: 13px !important;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
        }
        
        /* Dark mode transitions */
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Custom scrollbar for dark mode */
        .dark ::-webkit-scrollbar {
          width: 8px;
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #1F2937;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 4px;
        }
        
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        
        /* Enhanced focus states for accessibility */
        .dark button:focus,
        .dark .ant-btn:focus {
          outline: 2px solid #8B5CF6;
          outline-offset: 2px;
        }
        
        /* Better contrast for dark mode text */
        .dark .text-gray-600 {
          color: #D1D5DB !important;
        }
        
        .dark .text-gray-500 {
          color: #9CA3AF !important;
        }
        
        .dark .text-gray-700 {
          color: #E5E7EB !important;
        }
        
        /* Enhanced card hover effects for dark mode */
        .dark .group:hover .event-card {
          background: linear-gradient(135deg, rgba(55,65,81,0.95) 0%, rgba(55,65,81,0.9) 100%) !important;
        }
        
        /* Better visibility for floating action button in dark mode */
        .dark .group:hover .absolute.bottom-4.right-4 {
          background: rgba(31, 41, 55, 0.95) !important;
        }
      `}</style>
    </div>
  );
};

export default DashEvent;