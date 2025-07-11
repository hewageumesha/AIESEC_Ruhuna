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
