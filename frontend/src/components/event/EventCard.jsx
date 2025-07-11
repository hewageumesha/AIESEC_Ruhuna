import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const EventCard = ({ event, onDeleteSuccess }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-event/${event.id}`);
  };
import { message, Tag } from 'antd';
import { Calendar, MapPin } from 'lucide-react';

const AIESEC_BLUE = '#0072C6';

const EventCard = ({
  event,
  onDeleteSuccess,
  showActions = true,
  showRegister = false,
  onRegisterClick,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const canEditOrDelete = ['LCP', 'LCVP'].includes(currentUser?.role);

  const handleEdit = () => navigate(`/edit-event/${event.id}`);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${currentUser.token}`, // uncomment if you use token auth
        },
      });

      if (response.ok) {
        message.success('Event deleted successfully.');
        if (onDeleteSuccess) onDeleteSuccess(event.id);
      } else {
        // Try to parse error message from response body
        onDeleteSuccess?.(event.id);
      } else {
        const data = await response.json();
        message.error(data.message || 'Failed to delete event.');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      message.error('An error occurred while deleting the event.');
    }
  };

  const canEditOrDelete = currentUser?.role === 'LCP' || currentUser?.role === 'LCVP';

  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto mb-4">
      <img
        src={event.imageUrl || 'https://via.placeholder.com/400x200'}
        alt={event.title || event.eventName}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold mb-1">{event.title || event.eventName}</h2>
      <p className="text-gray-600 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500">
        📅 {new Date(event.date || event.startDate).toLocaleString()}
      </p>

      {canEditOrDelete && (
        <div className="flex justify-end gap-2 mt-4">
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 transition hover:shadow-xl border border-gray-100 flex flex-col">
      <img
        src={event.imageUrl || 'https://via.placeholder.com/400x200'}
        alt={event.eventName}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{event.eventName}</h2>
        <Tag color={event.isPublic ? 'blue' : 'red'}>
          {event.isPublic ? 'Public' : 'Private'}
        </Tag>
      </div>

      <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
        <Calendar className="w-4 h-4" />
        {new Date(event.startDate).toLocaleDateString()} — {event.eventTime || 'N/A'}
      </p>

      <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <MapPin className="w-4 h-4" />
        {event.location || 'Unknown Location'}
      </p>

      <p className="text-sm text-gray-700 mb-4">
        {event.description?.slice(0, 100)}...
      </p>

      {/* Show register button */}
      {showRegister && (
        <button
          onClick={() => onRegisterClick?.(event.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded w-full transition mb-2"
        >
          Register Now
        </button>
      )}

      {/* Edit/Delete Buttons */}
      {showActions && canEditOrDelete && (
        <div className="flex justify-end gap-2 mt-auto">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
