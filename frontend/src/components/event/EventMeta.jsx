import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventMeta = ({ startDate, endDate, eventTime, endTime }) => {
  const infoBox = (Icon, label, value, iconColor = 'text-blue-600', isLink = false) => (
    <div className="flex items-start gap-3 p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <Icon className={`w-6 h-6 mt-1 ${iconColor}`} />
      <div>
        <p className="text-[12px] uppercase tracking-wide text-gray-500 mb-1">{label}</p>
        {isLink && value ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-blue-700 underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-base font-semibold text-gray-800">{value || 'N/A'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {infoBox(Calendar, 'Start Date', startDate, 'text-blue-600')}
      {infoBox(Calendar, 'End Date', endDate, 'text-red-600')}
      {infoBox(Clock, 'Time', eventTime && endTime ? `${eventTime} - ${endTime}` : 'N/A', 'text-green-600')}
      
    </div>
  );
};

export default EventMeta;
