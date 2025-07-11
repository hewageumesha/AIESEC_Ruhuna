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

  const fetchEvents = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const response = await axios.get('http://localhost:8080/api/events/filter', {
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCardClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleEdit = (eventId, e) => {
    e.stopPropagation(); // Prevent triggering card click
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = async (eventId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8080/api/events/${eventId}`);
      message.success('Event deleted successfully');
      setEvents((prev) => prev.filter((event) => event.eventId !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      message.error('Failed to delete event');
    }
  };

  const handleViewAnalytics = () => {
    navigate('/event-analytics');
  };

// handler for Analytics button
const handleViewAnalytics = () => {
  navigate('/event-analytics'); // analytics route path
};

useEffect(() => {
  fetchFilteredEvents();
}, []);

  // Custom styles for AIESEC branding
  const aiesecButtonStyle = {
    backgroundColor: '#0B7EC8',
    borderColor: '#0B7EC8',
    color: 'white',
    fontWeight: '500',
    height: '40px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  };

  const aiesecButtonHoverStyle = {
    backgroundColor: '#0969A3',
    borderColor: '#0969A3',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(11, 126, 200, 0.3)',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Event Management
            </h2>

            {canEditOrDelete() && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  type="primary"
                  icon={showAddForm ? <CloseOutlined /> : <PlusOutlined />}
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={aiesecButtonStyle}
                  className="flex-1 sm:flex-none min-w-[160px] hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
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
                  className="flex-1 sm:flex-none min-w-[140px] hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
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
                  className="flex-1 sm:flex-none min-w-[140px] hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                  size="large"
                >
                  <span className="hidden sm:inline">Gallery Images</span>
                  <span className="sm:hidden">Gallery</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add Event Form */}
        {showAddForm && canEditOrDelete() && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:p-6">
            <AddEventForm onEventAdded={fetchFilteredEvents} />
          </div>
        )}

        {/* Filter Form */}
        <div className="mb-6">
          <EventFilterForm 
            filters={filters} 
            setFilters={setFilters} 
            onFilter={fetchFilteredEvents} 
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {events.map((event) => (
              <Card
                key={event.eventId}
                hoverable
                onClick={() => handleCardClick(event.eventId)}
                className="relative group transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl border border-gray-200 cursor-pointer overflow-hidden"
                cover={
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      alt={event.eventName}
                      src={event.imageUrl || '/default-event.jpg'}
                      onError={(e) => (e.target.src = '/default-event.jpg')}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {event.eventType && (
                      <Tag 
                        color="#0B7EC8" 
                        className="absolute top-2 right-2 z-10 font-medium"
                      >
                        {event.eventType}
                      </Tag>
                    )}
                  </div>
                }
              >
                {canEditOrDelete() && (
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={(e) => handleEdit(event.eventId, e)}
                      style={{
                        backgroundColor: '#0B7EC8',
                        borderColor: '#0B7EC8',
                        color: 'white',
                      }}
                      className="shadow-md hover:shadow-lg"
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this event?"
                      onConfirm={(e) => handleDelete(event.eventId, e)}
                      okText="Yes"
                      cancelText="No"
                      onCancel={(e) => e.stopPropagation()}
                      okButtonProps={{
                        style: {
                          backgroundColor: '#dc2626',
                          borderColor: '#dc2626',
                        }
                      }}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={(e) => e.stopPropagation()}
                        className="shadow-md hover:shadow-lg"
                      />
                    </Popconfirm>
                  </div>
                )}

                <Meta
                  title={
                    <span className="font-semibold text-base lg:text-lg text-gray-800 line-clamp-2">
                      {event.eventName}
                    </span>
                  }
                  description={
                    <div className="text-gray-600 mt-2 space-y-1 text-sm">
                      <p className="flex flex-wrap gap-1">
                        <strong className="text-gray-700">Date:</strong> 
                        <span className="break-all">{event.startDate} to {event.endDate}</span>
                      </p>
                      <p className="flex flex-wrap gap-1">
                        <strong className="text-gray-700">Time:</strong> 
                        <span>{event.eventTime} - {event.endTime}</span>
                      </p>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No events found</div>
            <p className="text-gray-500">Try adjusting your filters or create a new event.</p>
          </div>
        )}
      </div>

      {/* Gallery Upload Modal */}
      <Modal
        title="Upload Gallery Images"
        open={showGalleryUpload}
        onCancel={() => setShowGalleryUpload(false)}
        footer={null}
        destroyOnClose
        width="90%"
        style={{ maxWidth: '600px' }}
        className="top-4"
      >
        <GalleryUploader 
          onClose={() => setShowGalleryUpload(false)} 
          events={events} 
        />
      </Modal>

      {/* Custom CSS for additional styling */}
      <style jsx>{`
        .ant-btn-primary:hover {
          background-color: #0969A3 !important;
          border-color: #0969A3 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(11, 126, 200, 0.3);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 640px) {
          .ant-card-meta-title {
            font-size: 14px !important;
          }
          
          .ant-card-meta-description {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashEvent;