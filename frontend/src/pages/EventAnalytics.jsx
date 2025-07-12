import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, Filter, Eye, UserCheck, UserX, Clock, Mail, Phone, User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// AIESEC Color Palette
const aiesecColors = {
  blue: '#037EF3',
  darkBlue: '#0D47A1',
  lightBlue: '#E3F2FD',
  orange: '#F85A2A',
  lightOrange: '#FFF3E0',
  green: '#00C896',
  lightGreen: '#E8F5E8',
  purple: '#7B1FA2',
  lightPurple: '#F3E5F5',
  gray: '#6B7280',
  lightGray: '#F9FAFB',
  white: '#FFFFFF',
  dark: '#1F2937'
};

const colorClasses = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  gray: { bg: "bg-gray-50", text: "text-gray-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
};

const pieColors = {
  GOING: aiesecColors.green,
  PENDING: aiesecColors.orange,
  NOT_GOING: '#F44336',
};

// API Service
const apiService = {
  // Get all events for analytics
  getEvents: async () => {
    const response = await fetch('/analytics/registrations/events');
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Get registration analytics by event
  getRegistrationsByEvent: async (type = 'all', eventId = null) => {
    const params = new URLSearchParams({ type });
    if (eventId) params.append('eventID', eventId);
    
    const response = await fetch(`/analytics/registrations/by-event?${params}`);
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  },

  // Get member registrations (paginated)
  getMemberRegistrations: async (eventId, page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await fetch(`/api/member-event-registrations/event/${eventId}/paged?${params}`);
    if (!response.ok) throw new Error('Failed to fetch member registrations');
    return response.json();
  },

  // Get guest registrations (paginated)
  getGuestRegistrations: async (eventId, page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await fetch(`/api/guest-registrations/event/${eventId}/paged?${params}`);
    if (!response.ok) throw new Error('Failed to fetch guest registrations');
    return response.json();
  },

  // Get status distribution for an event
  getStatusDistribution: async (eventId, type = 'all') => {
    const params = new URLSearchParams({
      eventId: eventId.toString(),
      type
    });
    
    const response = await fetch(`/analytics/registrations/status-distribution?${params}`);
    if (!response.ok) throw new Error('Failed to fetch status distribution');
    return response.json();
  },

  // Get member status summary
  getMemberStatusSummary: async (eventId) => {
    const params = new URLSearchParams({
      eventId: eventId.toString()
    });
    
    const response = await fetch(`/api/member-event-registrations/summary/status?${params}`);
    if (!response.ok) throw new Error('Failed to fetch member status summary');
    return response.json();
  },

  // Get guest status summary
  getGuestStatusSummary: async (eventId) => {
    const params = new URLSearchParams({
      eventId: eventId.toString()
    });
    
    const response = await fetch(`/api/guest-registrations/analytics/summary/status?${params}`);
    if (!response.ok) throw new Error('Failed to fetch guest status summary');
    return response.json();
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'GOING':
        return { 
          color: aiesecColors.green, 
          bgColor: aiesecColors.lightGreen, 
          icon: UserCheck,
          text: 'Going'
        };
      case 'PENDING':
        return { 
          color: aiesecColors.orange, 
          bgColor: aiesecColors.lightOrange, 
          icon: Clock,
          text: 'Pending'
        };
      case 'NOT_GOING':
        return { 
          color: '#F44336', 
          bgColor: '#FFEBEE', 
          icon: UserX,
          text: 'Not Going'
        };
      default:
        return { 
          color: aiesecColors.gray, 
          bgColor: aiesecColors.lightGray, 
          icon: Clock,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div 
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      style={{ 
        backgroundColor: config.bgColor, 
        color: config.color 
      }}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </div>
  );
};

// Data Table Component
const DataTable = ({ data, loading, pagination, onPageChange, type }) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (record) => (
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: aiesecColors.blue }}
          >
            {record.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{type === 'member' ? 'AIESEC Member' : 'Guest'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{record.email}</span>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{record.contact || record.contactNumber || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (record) => <StatusBadge status={record.interestStatus || record.status} />
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: aiesecColors.blue }}></div>
          <span className="ml-3 text-gray-600">Loading {type} data...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {type}s registered</h3>
          <p className="text-gray-500">No {type} registrations found for this event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: aiesecColors.lightBlue }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(record) : record[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {pagination.number * pagination.size + 1} to {Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.number - 1)}
                disabled={pagination.first}
                className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.number + 1} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.number + 1)}
                disabled={pagination.last}
                className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Event Registration Viewer Component
const EventRegistrationViewer = ({ events, loading: eventsLoading }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [memberData, setMemberData] = useState([]);
  const [guestData, setGuestData] = useState([]);
  const [memberPagination, setMemberPagination] = useState(null);
  const [guestPagination, setGuestPagination] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [statusDistribution, setStatusDistribution] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState(null);

  const selectedEventData = events.find(e => e.id === parseInt(selectedEvent));

  const fetchMemberData = async (eventId, page = 0, size = 10) => {
    setLoadingMembers(true);
    setError(null);
    try {
      const response = await apiService.getMemberRegistrations(eventId, page, size);
      setMemberData(response.content || []);
      setMemberPagination(response);
    } catch (error) {
      console.error('Failed to fetch member data:', error);
      setError('Failed to load member data');
      setMemberData([]);
      setMemberPagination(null);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchGuestData = async (eventId, page = 0, size = 10) => {
    setLoadingGuests(true);
    setError(null);
    try {
      const response = await apiService.getGuestRegistrations(eventId, page, size);
      setGuestData(response.content || []);
      setGuestPagination(response);
    } catch (error) {
      console.error('Failed to fetch guest data:', error);
      setError('Failed to load guest data');
      setGuestData([]);
      setGuestPagination(null);
    } finally {
      setLoadingGuests(false);
    }
  };

  const fetchStatusDistribution = async (eventId) => {
    setLoadingStatus(true);
    try {
      const [memberStatus, guestStatus] = await Promise.all([
        apiService.getMemberStatusSummary(eventId),
        selectedEventData?.isPublic ? apiService.getGuestStatusSummary(eventId) : Promise.resolve({})
      ]);

      // Combine member and guest status data
      const combined = {
        GOING: (memberStatus.GOING || 0) + (guestStatus.GOING || 0),
        PENDING: (memberStatus.PENDING || 0) + (guestStatus.PENDING || 0),
        NOT_GOING: (memberStatus.NOT_GOING || 0) + (guestStatus.NOT_GOING || 0)
      };

      setStatusDistribution(combined);
    } catch (error) {
      console.error('Failed to fetch status distribution:', error);
      setStatusDistribution(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      fetchMemberData(selectedEvent, 0);
      fetchStatusDistribution(selectedEvent);
      
      if (selectedEventData?.isPublic) {
        fetchGuestData(selectedEvent, 0);
      } else {
        setGuestData([]);
        setGuestPagination(null);
      }
    } else {
      setMemberData([]);
      setGuestData([]);
      setMemberPagination(null);
      setGuestPagination(null);
      setStatusDistribution(null);
    }
  }, [selectedEvent, selectedEventData?.isPublic]);

  const handleMemberPageChange = (page) => {
    fetchMemberData(selectedEvent, page);
  };

  const handleGuestPageChange = (page) => {
    fetchGuestData(selectedEvent, page);
  };

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    if (!statusDistribution) return [];
    
    return Object.entries(statusDistribution)
      .filter(([_, value]) => value > 0)
      .map(([status, count]) => ({
        name: status.replace('_', ' '),
        value: count,
        color: pieColors[status] || aiesecColors.gray
      }));
  }, [statusDistribution]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: aiesecColors.blue }}
          >
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Registration Viewer</h2>
            <p className="text-gray-600">View detailed registration data for any event</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
            disabled={eventsLoading}
          >
            <option value="">Select an event</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name || event.eventName} {event.isPublic ? '(Public)' : '(Private)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {selectedEvent && (
        <div className="space-y-8">
          {/* Event Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEventData?.name || selectedEventData?.eventName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedEventData?.isPublic ? 'Public Event - Members & Guests' : 'Private Event - Members Only'}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: aiesecColors.blue }}>
                    {memberPagination?.totalElements || 0}
                  </div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                {selectedEventData?.isPublic && (
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: aiesecColors.green }}>
                      {guestPagination?.totalElements || 0}
                    </div>
                    <div className="text-sm text-gray-600">Guests</div>
                  </div>
                )}
                {/* Status Distribution Chart */}
                {pieChartData.length > 0 && (
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Member Registrations */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: aiesecColors.blue }}
              >
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Member Registrations</h3>
            </div>
            <DataTable
              data={memberData}
              loading={loadingMembers}
              pagination={memberPagination}
              onPageChange={handleMemberPageChange}
              type="member"
            />
          </div>

          {/* Guest Registrations */}
          {selectedEventData?.isPublic && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: aiesecColors.green }}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Guest Registrations</h3>
              </div>
              <DataTable
                data={guestData}
                loading={loadingGuests}
                pagination={guestPagination}
                onPageChange={handleGuestPageChange}
                type="guest"
              />
            </div>
          )}
        </div>
      )}

      {!selectedEvent && (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
          <p className="text-gray-500">Choose an event from the dropdown above to view registration details</p>
        </div>
      )}
    </div>
  );
};

// Main Event Analytics Component
const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events list
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const response = await apiService.getEvents();
        setEvents(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch registrations for summary cards
  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoadingRegs(true);
      setError(null);
      try {
        const eventId = selectedEvent === 'all' ? null : selectedEvent;
        const response = await apiService.getRegistrationsByEvent('all', eventId);
        setRegistrations(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Failed to load registrations');
        setRegistrations([]);
      } finally {
        setLoadingRegs(false);
      }
    };

    fetchRegistrations();
  }, [selectedEvent]);

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

  const SummaryCard = ({ label, value, icon: Icon, color }) => {
    const classes = colorClasses[color] || colorClasses.gray;
    return (
      <div className={`${classes.bg} p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow`}>
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
            style={{ backgroundColor: color === 'blue' ? aiesecColors.blue : color === 'green' ? aiesecColors.green : aiesecColors.gray }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: aiesecColors.lightGray }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Analytics</h1>
          <p className="text-gray-600">Monitor and analyze event registrations across AIESEC Ruhuna</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Registration Summary Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: aiesecColors.blue }}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Registration Summary</h2>
                <p className="text-gray-600">Overview of event registrations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingEvents}
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name || event.eventName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingRegs ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: aiesecColors.blue }}></div>
              <span className="ml-3 text-gray-600">Loading registrations...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                label="Total Registrations"
                icon={Users}
                value={summaryData.total}
                color="gray"
              />
            </div>
          )}
        </div>

        {/* Event Registration Viewer */}
        <EventRegistrationViewer events={events} loading={loadingEvents} />
      </div>
    </div>
  );
};

export default EventAnalytics;