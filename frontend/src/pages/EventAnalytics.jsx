import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState('all');
  const [registrationType] = useState('both');

  // Fetch event list once on mount
  useEffect(() => {
    axios.get('/analytics/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  // Fetch registrations whenever selectedEvent changes
  useEffect(() => {
    const params = {
      eventId: selectedEvent === 'all' ? undefined : selectedEvent,
      type: registrationType === 'both' ? 'all' : registrationType,
    };

    axios.get('/analytics/registrations', { params })
      .then(res => setRegistrations(res.data))
      .catch(err => console.error('Failed to fetch registrations:', err));
  }, [selectedEvent, registrationType]);

  // Registration summary data
  const summaryData = useMemo(() => {
    const filteredRegs = selectedEvent === 'all'
      ? registrations
      : registrations.filter(reg => reg.eventId === parseInt(selectedEvent));

    const memberCount = filteredRegs.filter(reg => reg.type === 'member').length;
    const guestCount = filteredRegs.filter(reg => reg.type === 'guest').length;

    let publicCount = 0;
    let memberOnlyCount = 0;

    if (selectedEvent === 'all') {
      events.forEach(event => {
        const eventRegs = filteredRegs.filter(reg => reg.eventId === event.id);
        if (event.isPublic) publicCount += eventRegs.length;
        else memberOnlyCount += eventRegs.length;
      });
    } else {
      const event = events.find(e => e.id === parseInt(selectedEvent));
      if (event?.isPublic) publicCount = filteredRegs.length;
      else memberOnlyCount = filteredRegs.length;
    }

    return {
      totalMembers: memberCount,
      totalGuests: guestCount,
      publicEvents: publicCount,
      memberOnlyEvents: memberOnlyCount,
      total: memberCount + guestCount
    };
  }, [selectedEvent, registrations, events]);

  // Event table data
  // (Removed unused eventTableData)

  // Export CSV helper (same as your existing one)
  const exportCSV = (data, filename) => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ... your existing JSX UI here, replacing mockEvents with events and mockRegistrations with registrations

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Event Analytics Dashboard</h1>

        {/* Registration Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Registration Summary</h2>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryData.totalMembers}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold text-green-600">{summaryData.totalGuests}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Public Events</p>
                  <p className="text-2xl font-bold text-purple-600">{summaryData.publicEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Member-Only</p>
                  <p className="text-2xl font-bold text-orange-600">{summaryData.memberOnlyEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-600">{summaryData.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations by Event - truncated for brevity, just replace mockEvents with events and mockRegistrations with registrations */}

        {/* Continue rest of your component as before, replacing data sources */}

      </div>
    </div>
  );
};

export default EventAnalytics;
