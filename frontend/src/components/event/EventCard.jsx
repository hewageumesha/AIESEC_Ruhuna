import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
      const response = await fetch(`http://localhost:8080/api/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header here if needed
        },
      });

      if (response.ok) {
        alert('Event deleted successfully.');
        onDeleteSuccess?.(event.id); // optional callback to update UI
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete event.');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event.');
    }
  };

  const canEditOrDelete = currentUser?.role === 'LCP' || currentUser?.role === 'LCVP';

  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto mb-4">
      <img
        src={event.imageUrl || 'https://via.placeholder.com/400x200'}
        alt={event.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
      <p className="text-gray-600 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500">
        📅 {new Date(event.date).toLocaleString()}
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
