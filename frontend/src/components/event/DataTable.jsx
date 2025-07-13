import React from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { aiesecColors } from './constants';
import StatusBadge from './StatusBadge';

const DataTable = ({ data, loading, pagination, onPageChange, type }) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (record) => (
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: aiesecColors.blue }}
          >
            {record.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.name || 'Unknown'}</div>
            <div className="text-sm text-gray-500">
              {type === 'member' ? 'AIESEC Member' : 'Guest'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{record.email || 'No email'}</span>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{record.contact || 'No contact'}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (record) => <StatusBadge status={record.status} />
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: aiesecColors.blue }}></div>
          <span className="ml-3 text-gray-600">Loading {type} data...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {type}s registered</h3>
          <p className="text-gray-500">No {type} registrations found for this event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: aiesecColors.lightBlue }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(record) : record[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {pagination.number * pagination.size + 1} to {Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.number - 1)}
                disabled={pagination.first}
                className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.number + 1} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.number + 1)}
                disabled={pagination.last}
                className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;