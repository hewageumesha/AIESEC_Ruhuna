import React from 'react';
import { Info } from 'lucide-react';

const EventInfo = ({ eventName, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
        {eventName}
      </h1>

      <div className="flex items-start gap-2 text-gray-700">
        <Info className="w-5 h-5 mt-1 text-blue-500" />
        <p className="text-base sm:text-lg leading-relaxed">
          {description && description.trim().length > 0
            ? description
            : 'No description provided for this event yet.'}
        </p>
      </div>
    </div>
  );
};

export default EventInfo;
