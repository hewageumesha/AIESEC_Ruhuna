import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Spin, Button, message, Tag, Popconfirm, Space } from 'antd';
import { PlusOutlined, CloseOutlined, EditOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddEventForm from './event/AddEventForm';

const { Meta } = Card;

const DashEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/events');
      setEvents(response.data);
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

// Helper function to check if user can edit/delete
const canEditOrDelete = () => {
  return currentUser && (currentUser.role === 'LCP' || currentUser.role === 'LCVP');
};

// handler for Analytics button
const handleViewAnalytics = () => {
  navigate('/event-analytics'); // analytics route path
};

useEffect(() => {
  fetchFilteredEvents();
}, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>
        {canEditOrDelete() && (
          <Button
            type="primary"
            icon={showAddForm ? <CloseOutlined /> : <PlusOutlined />}
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showAddForm ? 'Close Form' : 'Add Event'}
          </Button>

        {canEditOrDelete() && (
          <Space>
            <Button
              type="primary"
              icon={showAddForm ? <CloseOutlined /> : <PlusOutlined />}
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showAddForm ? 'Close Form' : 'Create New Event'}
            </Button>

            {/*  Analytics Button */}
            <Button
              type="default"
              icon={<BarChartOutlined />}
              onClick={handleViewAnalytics}
              className="bg-gray-200 hover:bg-gray-300"
            >
              View Analytics
            </Button>
          </Space>
        )}
      </div>

      {showAddForm && canEditOrDelete() && (
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <AddEventForm onEventAdded={fetchEvents} />
        </div>
      )}


      {/* 🔍 Filter Form */}
      {/* Filter Form */}
      <EventFilterForm filters={filters} setFilters={setFilters} onFilter={fetchFilteredEvents} />

{/* Filter Form */}
<EventFilterForm filters={filters} setFilters={setFilters} onFilter={fetchFilteredEvents} />


      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.eventId}
              hoverable
              onClick={() => handleCardClick(event.eventId)}
              className="relative group transition-transform transform hover:scale-105 shadow-md hover:shadow-xl border border-gray-200 cursor-pointer"
              cover={
                <img
                  alt={event.eventName}
                  src={event.imageUrl || '/default-event.jpg'}
                  onError={(e) => (e.target.src = '/default-event.jpg')}
                  className="h-48 object-cover rounded-t"
                />
              }
            >
              {event.eventType && (
                <Tag color="blue" className="absolute top-2 right-2 z-10">
                  {event.eventType}
                </Tag>
              )}

              {canEditOrDelete() && (
                <div className="absolute top-2 left-2 z-10 hidden group-hover:flex gap-2">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => handleEdit(event.eventId, e)}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this event?"
                    onConfirm={(e) => handleDelete(event.eventId, e)}
                    okText="Yes"
                    cancelText="No"
                    onCancel={(e) => e.stopPropagation()}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                </div>
              )}

              <Meta
                title={<span className="font-semibold text-lg text-gray-800">{event.eventName}</span>}
                description={
                  <div className="text-gray-600 mt-2 space-y-1 text-sm">
                    <p><strong>Date:</strong> {event.startDate} to {event.endDate}</p>
                    <p><strong>Time:</strong> {event.eventTime} - {event.endTime}</p>
                    {event.totalRegistrations !== undefined && (
                      <p className="text-green-600 font-medium">
                        {event.totalRegistrations} registered
                      </p>
                    )}
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashEvent;
