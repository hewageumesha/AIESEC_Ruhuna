import React, { useState } from 'react';

const AddEvent = () => {
    const [eventData, setEventData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventData.name || !eventData.startDate || !eventData.endDate || !eventData.location) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(eventData);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:8080/api/events", requestOptions);
            const result = await response.text();
            
            if (response.ok) {
                alert("Event created successfully!");
                setEventData({ name: '', startDate: '', endDate: '', location: '' });
            } else {
                alert("Error creating event: " + result);
            }
            
            console.log(result);
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error creating the event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Create Event</h2>
                
                <input
                    type="text"
                    placeholder="Event Name"
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <input
                    type="date"
                    value={eventData.startDate}
                    onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <input
                    type="date"
                    value={eventData.endDate}
                    onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <input
                    type="text"
                    placeholder="Location"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    );
};

export default AddEvent;
