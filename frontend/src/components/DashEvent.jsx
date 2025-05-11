import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, message } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddEventForm from './event/AddEventForm'; // ✅ Import your form component

const DashEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // ✅ Toggle state
  const navigate = useNavigate();

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

  const handleCardClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Event Management </h2>
        <Button
          type="primary"
          icon={showAddForm ? <CloseOutlined /> : <PlusOutlined />}
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showAddForm ? 'Close Form' : 'Add Event'}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 border p-4 rounded shadow">
          <AddEventForm onEventAdded={fetchEvents} />
        </div>
      )}

      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              hoverable
              title={event.eventName}
              cover={
                <img
                  alt={event.eventName}
                  src={event.imageUrl}
                  className="h-48 object-cover rounded-t"
                />
              }
              onClick={() => handleCardClick(event.id)}
            >
              <p><strong>Date:</strong> {event.startDate} to {event.endDate}</p>
              <p><strong>Time:</strong> {event.eventTime} - {event.endTime}</p>
              <p><strong>Type:</strong> {event.isVirtual ? 'Virtual' : 'In Person'}</p>
              <p><strong>Public:</strong> {event.isPublic ? 'Yes' : 'No'}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashEvent;
