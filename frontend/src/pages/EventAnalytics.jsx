import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';  // Real axios import
import { Calendar, Users, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  gray: { bg: "bg-gray-50", text: "text-gray-600" },
};

const pieColors = {
  GOING: '#4CAF50',
  PENDING: '#FFC107',
  NOT_GOING: '#F44336',
};

const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedPieEvent, setSelectedPieEvent] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [loadingPieData, setLoadingPieData] = useState(false);
  const [statusDistribution, setStatusDistribution] = useState(null);
  const [pieError, setPieError] = useState(null);

  // Fetch events list
  useEffect(() => {
    setLoadingEvents(true);
    axios.get('/analytics/registrations/events')
      .then(res => {
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else if (Array.isArray(res.data.data)) {
          setEvents(res.data.data);
        } else {
          setEvents([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      })
      .finally(() => setLoadingEvents(false));
  }, []);

  // Fetch GOING registrations for summary cards
  useEffect(() => {
    setLoadingRegs(true);
    const params = {
      eventId: selectedEvent === 'all' ? undefined : selectedEvent,
      status: 'GOING'
    };
    axios.get('/analytics/registrations/by-event', { params })
      .then(res => {
        setRegistrations(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Failed to fetch registrations:', err);
        setRegistrations([]);
      })
      .finally(() => setLoadingRegs(false));
  }, [selectedEvent]);

  // Fetch status distribution for pie chart
  useEffect(() => {
    if (!selectedPieEvent) {
      setStatusDistribution(null);
      setPieError(null);
      return;
    }

    const event = events.find(e => e.id === parseInt(selectedPieEvent));
    if (!event) {
      setStatusDistribution(null);
      setPieError('Event not found');
      return;
    }

    setLoadingPieData(true);
    setPieError(null);

    if (event.isPublic) {
      const memberPromise = axios.get(`/api/member-event-registrations/summary/status?eventId=${selectedPieEvent}`);
      const guestPromise = axios.get(`/api/guest-registrations/analytics/summary/status?eventId=${selectedPieEvent}`);

      Promise.all([memberPromise, guestPromise])
        .then(([memberRes, guestRes]) => {
          const fallback = { GOING: 0, PENDING: 0, NOT_GOING: 0 };
          const combined = { ...fallback };

          const memberData = memberRes.data || {};
          const guestData = guestRes.data || {};

          ['GOING', 'PENDING', 'NOT_GOING'].forEach(status => {
            combined[status] = (memberData[status] || 0) + (guestData[status] || 0);
          });

          setStatusDistribution(combined);
        })
        .catch(err => {
          console.error('Failed to fetch combined status distribution:', err);
          setPieError('Failed to load status data');
          setStatusDistribution(null);
        })
        .finally(() => setLoadingPieData(false));
    } else {
      axios.get(`/api/member-event-registrations/summary/status?eventId=${selectedPieEvent}`)
        .then(res => {
          const fallback = { GOING: 0, PENDING: 0, NOT_GOING: 0 };
          const memberData = res.data || {};
          const combined = { ...fallback, ...memberData };
          setStatusDistribution(combined);
        })
        .catch(err => {
          console.error('Failed to fetch member status distribution:', err);
          setPieError('Failed to load status data');
          setStatusDistribution(null);
        })
        .finally(() => setLoadingPieData(false));
    }
  }, [selectedPieEvent, events]);

  // Compute summary card data
  const summaryData = useMemo(() => {
    const filteredRegs = selectedEvent === 'all'
      ? registrations
      : registrations.filter(reg => reg.eventId === parseInt(selectedEvent));

    const event = selectedEvent !== 'all'
      ? events.find(e => e.id === parseInt(selectedEvent))
      : null;

    let memberCount = 0;
    let guestCount = 0;

    if (selectedEvent === 'all') {
      memberCount = filteredRegs.reduce((sum, reg) => sum + (reg.memberRegistrations || 0), 0);
      guestCount = filteredRegs.reduce((sum, reg) => sum + (reg.guestRegistrations || 0), 0);
    } else if (event?.isPublic) {
      memberCount = filteredRegs.reduce((sum, reg) => sum + (reg.memberRegistrations || 0), 0);
      guestCount = filteredRegs.reduce((sum, reg) => sum + (reg.guestRegistrations || 0), 0);
    } else {
      memberCount = filteredRegs.reduce((sum, reg) => sum + (reg.memberRegistrations || 0), 0);
      guestCount = 0;
    }

    return {
      totalMembers: memberCount,
      totalGuests: guestCount,
      total: memberCount + guestCount
    };
  }, [selectedEvent, registrations, events]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (!statusDistribution) return [];

    return Object.entries(statusDistribution)
      .map(([status, count]) => ({
        name: status.replace('_', ' '),
        value: count || 0,
        originalStatus: status
      }))
      .filter(item => item.value > 0);
  }, [statusDistribution]);

  const SummaryCard = ({ label, value, icon: Icon, color }) => {
    const classes = colorClasses[color] || colorClasses.gray;
    return (
      <div className={`${classes.bg} p-4 rounded-lg`}>
        <div className="flex items-center">
          <Icon className={`w-8 h-8 ${classes.text} mr-3`} />
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (loadingPieData) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      );
    }

    if (pieError) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {pieError}</div>
        </div>
      );
    }

    if (!selectedPieEvent) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Select an event above to see interest status breakdown.</div>
        </div>
      );
    }

    if (!statusDistribution) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">No data available</div>
        </div>
      );
    }

    const total = Object.values(statusDistribution).reduce((a, b) => a + b, 0);
    if (total === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">No registration data available for this event.</div>
        </div>
      );
    }

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={(entry) => `${entry.name}: ${entry.value}`}
              labelLine={false}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[entry.originalStatus] || '#8884d8'}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Event Analytics Dashboard</h1>

        {/* Registration Summary Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Registration Summary</h2>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                disabled={loadingEvents}
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingRegs ? (
            <div className="text-gray-500 text-center py-10">Loading registrations...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SummaryCard
                label="Total Members"
                icon={Users}
                value={summaryData.totalMembers}
                color="blue"
              />
              <SummaryCard
                label="Total Guests"
                icon={Users}
                value={summaryData.totalGuests}
                color="green"
              />
              <SummaryCard
                label="Total"
                icon={Users}
                value={summaryData.total}
                color="gray"
              />
            </div>
          )}
        </div>

        {/* Interest Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Interest Status Breakdown</h2>
            <select
              value={selectedPieEvent}
              onChange={e => setSelectedPieEvent(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              disabled={loadingEvents}
            >
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>

          {renderPieChart()}
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
