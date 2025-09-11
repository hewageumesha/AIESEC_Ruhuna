import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const EventHeader = ({ imageUrl, eventName, startDate, location }) => (
  <div className="relative w-full h-80 sm:h-96 mb-6 sm:mb-8 rounded-xl overflow-hidden shadow-xl">
    <img
      src={imageUrl || '/default-event-image.jpg'}
      alt="Event Banner"
      className="w-full h-full object-cover"
      onError={(e) => (e.target.src = '/default-event-image.jpg')}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
        AIESEC in University of Ruhuna
      </span>
    </div>
    <div className="absolute bottom-6 left-6 right-6 text-white">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">
        {eventName}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-lg">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{startDate}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default EventHeader;