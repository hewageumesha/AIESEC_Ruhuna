import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, message, Card, Tag } from 'antd';
import EventFilterForm from '../components/event/EventFilterForm';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const PublicEventsPage = () => {
  const [publicEvents, setPublicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', date: '' });
  const navigate = useNavigate();

  //  Fetch all public events from backend
  const fetchPublicEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/events/public');
      setPublicEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch public events:', error);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Decoration with More Dynamic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-cyan-400/20 dark:from-purple-500/10 dark:via-blue-600/10 dark:to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 via-blue-600/20 to-purple-500/20 dark:from-indigo-600/10 dark:via-blue-700/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Secondary floating elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/10 via-blue-400/10 to-indigo-500/10 dark:from-cyan-400/5 dark:via-blue-500/5 dark:to-indigo-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-60 h-60 bg-gradient-to-bl from-purple-300/15 via-pink-400/15 to-blue-400/15 dark:from-purple-400/8 dark:via-pink-500/8 dark:to-blue-500/8 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-tl from-cyan-300/15 via-blue-400/15 to-indigo-400/15 dark:from-cyan-400/8 dark:via-blue-500/8 dark:to-indigo-500/8 rounded-full blur-2xl animate-pulse delay-300"></div>
        
        {/* Additional dynamic elements */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-rose-300/10 via-purple-400/10 to-blue-400/10 dark:from-rose-400/5 dark:via-purple-500/5 dark:to-blue-500/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-tr from-emerald-300/10 via-cyan-400/10 to-blue-400/10 dark:from-emerald-400/5 dark:via-cyan-500/5 dark:to-blue-500/5 rounded-full blur-xl animate-float delay-1500"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/2 animate-shimmer"></div>
      </div>

      {/* Fixed z-index for main content - reduced from z-10 to z-0 for header */}
      <div className="relative z-0 p-6">
        {/* Compact Dynamic Header with Proper Z-Index */}
        <div className="relative mb-6 backdrop-blur-md bg-gradient-to-r from-white/85 via-white/70 to-white/85 dark:from-gray-800/85 dark:via-gray-900/70 dark:to-gray-800/85 rounded-3xl p-4 shadow-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 dark:shadow-lg">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 dark:from-purple-600/10 dark:via-blue-600/10 dark:to-cyan-600/10 blur-sm animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Compact Logo and Title Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 dark:from-purple-600 dark:via-blue-700 dark:to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 animate-bounce group-hover:rotate-0 transition-transform duration-500">
                    <span className="text-white font-bold text-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">A</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 via-blue-500/30 to-cyan-400/30 dark:from-purple-500/20 dark:via-blue-600/20 dark:to-cyan-500/20 rounded-xl blur-sm animate-pulse"></div>
                </div>
                
                <div className="ml-3">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    AIESEC in University of Ruhuna
                  </h1>
                  <p className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">Experience • Exchange • Explore</p>
                </div>
              </div>

              {/* Compact stats */}
              <div className="flex items-center space-x-4 text-right">
                <div className="text-center">
                  <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">{publicEvents.length}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">200+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Members</div>
                </div>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-700 via-indigo-700 to-cyan-600 dark:from-purple-400 dark:via-blue-500 dark:via-indigo-500 dark:to-cyan-400 bg-clip-text text-transparent mb-3 animate-fadeIn">
                Upcoming Public Events
              </h2>
              
              {/* Enhanced decorative line */}
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div className="h-1 w-24 bg-gradient-to-r from-purple-500 via-blue-600 to-cyan-500 dark:from-purple-600 dark:via-blue-700 dark:to-cyan-600 rounded-full transform scale-x-0 animate-scaleX"></div>
                  <div className="absolute inset-0 h-1 w-24 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 dark:from-purple-500 dark:via-blue-600 dark:to-cyan-500 rounded-full blur-sm animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto animate-fadeIn delay-200">
                Discover amazing opportunities and connect with like-minded individuals
              </p>
            </div>

            {/* Compact Interactive Tags */}
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              <div className="group bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-cyan-600/20 rounded-full px-3 py-1 border border-blue-200/30 dark:border-blue-600/30 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105">
                <span className="text-blue-700 dark:text-blue-400 font-medium text-xs group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">Join Us</span>
              </div>
              <div className="group bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 dark:from-indigo-600/20 dark:via-blue-600/20 dark:to-purple-600/20 rounded-full px-3 py-1 border border-purple-200/30 dark:border-purple-600/30 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105">
                <span className="text-purple-700 dark:text-purple-400 font-medium text-xs group-hover:text-purple-800 dark:group-hover:text-purple-300 transition-colors">Build Future</span>
              </div>
              <div className="group bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-600/20 dark:via-blue-600/20 dark:to-indigo-600/20 rounded-full px-3 py-1 border border-cyan-200/30 dark:border-cyan-600/30 hover:border-cyan-300/50 dark:hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:scale-105">
                <span className="text-cyan-700 dark:text-cyan-400 font-medium text-xs group-hover:text-cyan-800 dark:group-hover:text-cyan-300 transition-colors">Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[300px] animate-fadeIn">
            <div className="relative">
              <Spin size="large" />
              <div className="absolute inset-0 animate-ping">
                <div className="w-12 h-12 border-4 border-purple-300 dark:border-purple-500 rounded-full"></div>
              </div>
              <div className="absolute inset-0 animate-ping delay-200">
                <div className="w-12 h-12 border-4 border-blue-300 dark:border-blue-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text mt-6 font-medium animate-pulse text-lg">Loading amazing events...</p>
          </div>
        ) : publicEvents.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 dark:from-purple-600 dark:via-blue-700 dark:to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-purple-400/30 via-blue-500/30 to-cyan-400/30 dark:from-purple-500/20 dark:via-blue-600/20 dark:to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">No Events Available</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No public events available right now</p>
            <p className="text-gray-500 dark:text-gray-500">Check back soon for exciting upcoming events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicEvents.map((event, index) => (
              <div
                key={event.eventId}
                className="animate-fadeIn hover:z-10 relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card
                  hoverable
                  onClick={() => navigate(`/public-event/${event.eventId}`)}
                  className="relative group transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 shadow-xl hover:shadow-2xl border-0 cursor-pointer bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white dark:hover:bg-gray-800"
                  cover={
                    <div className="relative overflow-hidden">
                      <img
                        alt={event.eventName}
                        src={event.imageUrl || '/default-event.jpg'}
                        onError={(e) => (e.target.src = '/default-event.jpg')}
                        className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Floating action button */}
                      <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full p-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>

                      {/* Enhanced gradient overlay */}
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-cyan-500/10 dark:to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  }
                >
                  {event.eventType && (
                    <Tag 
                      className="absolute top-4 right-4 z-20 capitalize border-0 font-semibold text-white shadow-lg backdrop-blur-sm"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {event.eventType.replace('_', ' ')}
                    </Tag>
                  )}

                  <div className="p-6">
                    <Meta
                      title={
                        <span className="font-bold text-xl text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-cyan-600 dark:group-hover:from-purple-400 dark:group-hover:via-blue-400 dark:group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 leading-tight">
                          {event.eventName}
                        </span>
                      }
                      description={
                        <div className="text-gray-600 dark:text-gray-400 mt-4 space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 dark:from-purple-600 dark:via-blue-600 dark:to-cyan-600 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">
                              <strong className="text-indigo-700 dark:text-indigo-400">Date:</strong> {event.startDate} to {event.endDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-600 dark:via-blue-600 dark:to-purple-600 rounded-full animate-pulse delay-300"></div>
                            <span className="text-sm font-medium">
                              <strong className="text-purple-700 dark:text-purple-400">Time:</strong> {event.eventTime} - {event.endTime}
                            </span>
                          </div>
                        </div>
                      }
                    />
                    
                    {/* Enhanced CTA button */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 dark:from-purple-600 dark:via-blue-600 dark:to-cyan-600 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 dark:hover:from-purple-700 dark:hover:via-blue-700 dark:hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm backdrop-blur-sm">
                        <span className="flex items-center justify-center space-x-2">
                          <span>View Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-scaleX {
          animation: scaleX 0.8s ease-out 0.5s forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-1500 {
          animation-delay: 1500ms;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Dark mode shadow adjustments */
        @media (prefers-color-scheme: dark) {
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
          }
        }

        /* Ensure dropdown menus and modals appear above everything */
        .ant-dropdown {
          z-index: 1050 !important;
        }

        .ant-modal {
          z-index: 1000 !important;
        }

        .ant-modal-mask {
          z-index: 1000 !important;
        }

        .ant-tooltip {
          z-index: 1060 !important;
        }

        .ant-popover {
          z-index: 1060 !important;
        }

        /* Dark mode specific adjustments for Ant Design components */
        .dark .ant-card {
          background: rgba(31, 41, 55, 0.95) !important;
          border-color: rgba(55, 65, 81, 0.5) !important;
        }

        .dark .ant-card-meta-title {
          color: #e5e7eb !important;
        }

        .dark .ant-card-meta-description {
          color: #9ca3af !important;
        }

        .dark .ant-spin-dot-item {
          background-color: #8b5cf6 !important;
        }
      `}</style>
    </div>
  );
};

export default PublicEventsPage;