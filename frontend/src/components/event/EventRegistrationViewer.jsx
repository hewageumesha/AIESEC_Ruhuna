import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Filter, Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { aiesecColors, pieColors } from './constants';
import DataTable from './DataTable';
import apiService from './apiService';

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

export default EventRegistrationViewer;