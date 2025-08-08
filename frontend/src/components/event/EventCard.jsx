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

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://aiesecruhuna-production.up.railway.app/api/events/${event.id}`, {
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
