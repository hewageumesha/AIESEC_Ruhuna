import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const EventMeta = ({ startDate, endDate, eventTime, endTime }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-6">
      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <Calendar className="text-blue-500 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Start Date</p>
          <p className="font-medium">{startDate || 'N/A'}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <Calendar className="text-red-500 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">End Date</p>
          <p className="font-medium">{endDate || 'N/A'}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <Clock className="text-green-500 w-5 h-5 mt-1" />
        <div>
          <p className="text-xs text-gray-500">Time</p>
          <p className="font-medium">
            {eventTime && endTime ? `${eventTime} - ${endTime}` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventMeta;
