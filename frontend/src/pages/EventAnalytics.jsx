import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, Filter, Download } from 'lucide-react';
import { aiesecColors } from '../components/event/constants';
import SummaryCard from '../components/event/SummaryCard';
import EventRegistrationViewer from '../components/event/EventRegistrationViewer';
import CSVDownloadButton from '../components/event/CSVDownloadButton';
import apiService from '../components/event/apiService';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Event Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and analyze event registrations across AIESEC Ruhuna</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="text-red-800 dark:text-red-400">{error}</div>
          </div>
        )}

        {/* Registration Summary Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: aiesecColors.blue }}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registration Summary</h2>
                <p className="text-gray-600 dark:text-gray-300">Overview of event registrations-Going Count</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
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
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading registrations...</span>
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

        {/* Event Registration Viewer with CSV Export */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: aiesecColors.green }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Event Registrations</h2>
                  <p className="text-gray-600 dark:text-gray-300">Detailed view of all registrations</p>
                </div>
              </div>
              
              {/* CSV Export Button */}
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <CSVDownloadButton
                  type="all"
                  eventId={selectedEvent === 'all' ? null : selectedEvent}
                  status={null}
                />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <EventRegistrationViewer events={events} loading={loadingEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;