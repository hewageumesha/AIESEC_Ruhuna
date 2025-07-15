import React from 'react';
import { colorClasses, aiesecColors } from './constants';

const SummaryCard = ({ label, value, icon: Icon, color }) => {
  const classes = colorClasses[color] || colorClasses.gray;
  
  const getBackgroundColor = (color) => {
    switch (color) {
      case 'blue':
        return aiesecColors.blue;
      case 'green':
        return aiesecColors.green;
      case 'orange':
        return aiesecColors.orange;
      default:
        return aiesecColors.gray;
    }
  };

  return (
    <div className={`${classes.bg} p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow`}>
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
          style={{ backgroundColor: getBackgroundColor(color) }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;