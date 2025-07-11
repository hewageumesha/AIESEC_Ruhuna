import React from 'react';
import { Search, Filter } from 'lucide-react';

const EventFilterForm = ({ filters, setFilters, onFilter }) => {
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Top Row: Search + Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative w-40">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search events"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>
          <button
            onClick={onFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-1"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('status', option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                filters.status === option.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilterForm;
