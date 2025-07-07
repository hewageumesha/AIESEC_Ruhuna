import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, message, Card, Tag } from 'antd';
import EventFilterForm from '../components/event/EventFilterForm';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const PublicEventsPage = () => {
  const [publicEvents, setPublicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', date: '' });
  const navigate = useNavigate();

  //  Fetch all public events from backend
  const fetchPublicEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/events/public');
      setPublicEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch public events:', error);
      message.error('❌ Failed to load public events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upcoming Public Events</h2>

      {/*  Filter Form */}
      <EventFilterForm
        filters={filters}
        setFilters={setFilters}
        onFilter={fetchPublicEvents}
      />

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : publicEvents.length === 0 ? (
        <p className="text-center text-gray-600">No public events available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publicEvents.map((event) => (
            <Card
              key={event.eventId}
              hoverable
              onClick={() => navigate(`/public-event/${event.eventId}`)}
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
              {/* Event Type Tag */}
              {event.eventType && (
                <Tag color="blue" className="absolute top-2 right-2 z-10 capitalize">
                  {event.eventType.replace('_', ' ')}
                </Tag>
              )}

              <Meta
                title={
                  <span className="font-semibold text-lg text-gray-800">
                    {event.eventName}
                  </span>
                }
                description={
                  <div className="text-gray-600 mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Date:</strong> {event.startDate} to {event.endDate}
                    </p>
                    <p>
                      <strong>Time:</strong> {event.eventTime} - {event.endTime}
                    </p>
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

export default PublicEventsPage;
