import React, { useState } from 'react';
import axios from 'axios';

const AddEvent = () => {
    const [eventData, setEventData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        eventPhoto: null,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!eventData.name || !eventData.startDate || !eventData.endDate || !eventData.location || !eventData.eventPhoto) {
            alert("Please fill in all fields and upload an event photo.");
            return;
        }

        const formData = new FormData();
        formData.append("name", eventData.name);
        formData.append("startDate", eventData.startDate);
        formData.append("endDate", eventData.endDate);
        formData.append("location", eventData.location);
        formData.append("eventPhoto", eventData.eventPhoto);

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/events', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Event created successfully!");
        } catch (error) {
            alert("There was an error creating the event.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, eventPhoto: e.target.files[0] });
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
                type="text"
                placeholder="Event Name"
                value={eventData.name}
                onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            />
            <input
                type="datetime-local"
                value={eventData.startDate}
                onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
            />
            <input
                type="datetime-local"
                value={eventData.endDate}
                onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
            />
            <input
                type="text"
                placeholder="Location"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <button type="submit" disabled={loading}>Create Event</button>
        </form>
    );
};

export default AddEvent;
