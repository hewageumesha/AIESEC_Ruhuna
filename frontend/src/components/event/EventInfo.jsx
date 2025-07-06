import React from 'react';
import { Info } from 'lucide-react';

const EventInfo = ({ eventName, description }) => {
  return (
    <section className="mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-snug mb-4">
        {eventName}
      </h1>

      <div className="flex items-start gap-3">
        <Info className="w-6 h-6 mt-1 text-blue-600" />
        <div className="text-gray-700 text-base md:text-lg leading-relaxed">

          <p>
            {description && description.trim().length > 0
              ? description
              : 'No description provided for this event yet.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
