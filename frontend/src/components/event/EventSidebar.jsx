import React from 'react';
import { MapPin, Star } from 'lucide-react';

const EventSidebar = ({ event }) => (
  <div className="space-y-6">
    {/* Map Section */}
    {event.location && !event.isVirtual && (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Location</h3>
        </div>
        <div className="rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Event Location"
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCIS25E6e43YO7cjdgLqdVC50sJdKBbvws&q=${encodeURIComponent(event.location)}`}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">{event.location}</p>
      </div>
    )}

    {/* Event Highlights */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Highlights</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Networking opportunities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Professional development</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Global Exposure</span>
        </div>
        {event.hasMerchandise && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Official merchandise available</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default EventSidebar;