import React from 'react';
import { Mail, Phone, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { aiesecColors } from './constants';
import StatusBadge from './StatusBadge';

const DataTable = ({ data, loading, pagination, onPageChange, type }) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (record) => (
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg dark:shadow-xl transform hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: aiesecColors.blue }}
            >
              {record.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 dark:bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-base">
              {record.name || 'Unknown'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {type === 'member' ? ' AIESEC Member' : ' Guest'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (record) => (
        <div className="flex items-center space-x-3 group">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
            <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <span className="text-gray-900 dark:text-gray-100 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {record.email || 'No email'}
          </span>
        </div>
      )
    },
    {
  key: 'phone',
  title: 'Contact',
  render: (record) => (
    <div className="flex items-center space-x-3 group">
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors duration-200">
        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
      </div>
      <span className="text-gray-900 dark:text-gray-100 font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
        {record.phone || 'No contact'}
      </span>
    </div>
  )
}
,
    {
      key: 'status',
      title: 'Status',
      render: (record) => <StatusBadge status={record.status} />
    }
  ];

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
            <div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent absolute top-0 left-0"
              style={{ borderColor: `${aiesecColors.blue} transparent transparent transparent` }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Loading {type} data...
            </span>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-12">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">0</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            No {type}s registered
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm mx-auto">
            No {type} registrations found for this event. Check back later for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl dark:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 backdrop-blur-sm group">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 dark:from-blue-900/10 dark:to-green-900/10 opacity-40 dark:opacity-20"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Enhanced Table Header */}
      <div className="relative z-10 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-wide">
              {type} Registrations
            </h3>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {data.length}
              </span>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Live Data
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/30 dark:divide-gray-700/30">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50/60 to-blue-50/30 dark:from-gray-800/30 dark:to-blue-900/10">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className="px-8 py-6 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider relative group"
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {index === 0 && (
                      <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    )}
                  </div>
                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-blue-500 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/30 dark:bg-gray-800/20 divide-y divide-gray-200/20 dark:divide-gray-700/20">
            {data.map((record, index) => (
              <tr 
                key={record.id || index} 
                className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-all duration-200 group hover:shadow-sm hover:scale-[1.005]"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className="px-8 py-6 whitespace-nowrap relative"
                  >
                    {column.render ? column.render(record) : record[column.key]}
                    {/* Subtle hover indicator */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent dark:via-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Enhanced Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="relative z-10 px-8 py-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Results Info */}
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Showing <span className="font-bold text-gray-900 dark:text-white px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{pagination.number * pagination.size + 1}</span> to{' '}
                <span className="font-bold text-gray-900 dark:text-white px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)}</span> of{' '}
                <span className="font-bold text-gray-900 dark:text-white px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{pagination.totalElements}</span> results
              </div>
            </div>

            {/* Enhanced Pagination Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onPageChange(pagination.number - 1)}
                disabled={pagination.first}
                className="group flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Previous</span>
              </button>

              {/* Page Info */}
              <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-2xl border border-blue-200 dark:border-blue-800/50 shadow-md">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  Page {pagination.number + 1}
                </span>
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-green-400 dark:from-blue-500 dark:to-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  of {pagination.totalPages}
                </span>
              </div>

              <button
                onClick={() => onPageChange(pagination.number + 1)}
                disabled={pagination.last}
                className="group flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-600 dark:to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      
      {/* Subtle ring on hover */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-blue-100 dark:group-hover:ring-blue-800/30 transition-all duration-300"></div>
    </div>
  );
};

export default DataTable;