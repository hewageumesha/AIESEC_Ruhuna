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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-green-700 dark:from-white dark:via-blue-300 dark:to-green-300 bg-clip-text text-transparent mb-3">
              Event Analytics
            </h1>
            <div className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 font-medium">
            Monitor and analyze event registrations across AIESEC Ruhuna
          </p>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 backdrop-blur-sm border border-red-200 dark:border-red-800/50 rounded-2xl p-6 mb-8 shadow-lg dark:shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-400 flex-shrink-0"></div>
              <div className="text-red-800 dark:text-red-300 font-semibold text-lg">{error}</div>
            </div>
          </div>
        )}

        {/* Enhanced Registration Summary Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-black/20 p-8 mb-10 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-green-100/20 dark:from-blue-900/10 dark:to-green-900/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/20 to-blue-100/20 dark:from-green-900/10 dark:to-blue-900/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            {/* Enhanced Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
              <div className="flex items-center space-x-5">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${aiesecColors.blue}, ${aiesecColors.green})` }}
                  >
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 dark:bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Registration Summary
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Overview of event registrations - Going Count
                  </p>
                </div>
              </div>
              
              {/* Enhanced Filter Section */}
              <div className="flex items-center space-x-4 bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-md dark:shadow-lg">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <select
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                  className="border-0 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl px-4 py-3 font-semibold min-w-52 cursor-pointer hover:bg-white/50 dark:hover:bg-gray-600/50 transition-all duration-200"
                  disabled={loadingEvents}
                >
                  <option value="all" className="bg-white dark:bg-gray-800">All Events</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id} className="bg-white dark:bg-gray-800">
                      {event.name || event.eventName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enhanced Loading State */}
            {loadingRegs ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
                  <div 
                    className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent absolute top-0 left-0"
                    style={{ borderColor: `${aiesecColors.blue} transparent transparent transparent` }}
                  ></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
                  Loading registrations...
                </span>
                <div className="mt-3 flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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

                {/* Enhanced Statistics Overview */}
                {summaryData.total > 0 && (
                  <div className="bg-gradient-to-r from-blue-50/50 via-white/30 to-green-50/50 dark:from-blue-900/10 dark:via-gray-800/30 dark:to-green-900/10 rounded-2xl p-6 backdrop-blur-sm border border-blue-100/50 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Registration Distribution</h3>
                      <div className="flex items-center space-x-4 text-sm font-semibold">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Members: {((summaryData.totalMembers / summaryData.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Guests: {((summaryData.totalGuests / summaryData.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full flex">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                          style={{ width: `${(summaryData.totalMembers / summaryData.total) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ease-out"
                          style={{ width: `${(summaryData.totalGuests / summaryData.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Event Registration Viewer */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-black/20 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500"></div>
          
          {/* Enhanced Header */}
          <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50/30 to-blue-50/30 dark:from-green-900/10 dark:to-blue-900/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${aiesecColors.green}, ${aiesecColors.blue})` }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 dark:bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Event Registrations
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Detailed view of all registrations
                  </p>
                </div>
              </div>
              
              {/* Enhanced CSV Export Section */}
              <div className="flex items-center space-x-4 bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-md dark:shadow-lg">
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <CSVDownloadButton
                  type="all"
                  eventId={selectedEvent === 'all' ? null : selectedEvent}
                  status={null}
                />
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-8">
            <EventRegistrationViewer events={events} loading={loadingEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;