import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Globe, User, ExternalLink, Info, UserPlus } from 'lucide-react';

const EventDetails = ({ event, onRegister }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime && !endTime) return 'Time TBD';
    if (startTime && endTime) return `${startTime} - ${endTime}`;
    return startTime || 'Time TBD';
  };

  const InfoItem = ({ icon, label, value, highlight = false }) => (
    <div className={`flex items-center gap-4 py-3 px-4 rounded-lg ${
      highlight 
        ? 'bg-blue-50 dark:bg-blue-900/30' 
        : 'bg-gray-50 dark:bg-gray-700'
    }`}>
      <div className={`p-2 rounded-lg ${
        highlight 
          ? 'bg-blue-100 dark:bg-blue-800' 
          : 'bg-gray-100 dark:bg-gray-600'
      }`}>
        {React.createElement(icon, { 
          className: `w-5 h-5 ${
            highlight 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400'
          }` 
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Event Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoItem icon={Calendar} label="Start Date" value={formatDate(event.startDate)} highlight />
          {event.endDate && (
            <InfoItem icon={Calendar} label="End Date" value={formatDate(event.endDate)} />
          )}
          <InfoItem icon={Clock} label="Event Time" value={formatTime(event.eventTime, event.endTime)} highlight />
          
          {event.location && !event.isVirtual && (
            <InfoItem icon={MapPin} label="Location" value={event.location} />
          )}
          
          {event.isVirtual && event.virtualLink && (
            <div className="flex items-center gap-4 py-3 px-4 rounded-lg bg-green-50 dark:bg-green-900/30">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800">
                <ExternalLink className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Virtual Event</p>
                <a
                  href={event.virtualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-green-600 dark:text-green-400 hover:underline"
                >
                  Join Online
                </a>
              </div>
            </div>
          )}
          
          <InfoItem 
            icon={Globe} 
            label="Event Type" 
            value={`${event.isPublic ? 'Public' : 'Private'} Event`} 
          />
          <InfoItem 
            icon={User} 
            label="Organized by" 
            value="AIESEC in University of Ruhuna" 
          />
        </div>

        {event.description && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              About this event
            </h3>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className={showFullDescription ? '' : 'line-clamp-3'}>
                {event.description}
              </p>
              {event.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-2 font-medium"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onRegister}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-lg shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Register for Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;