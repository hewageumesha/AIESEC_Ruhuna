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

  const getGradientColors = (color) => {
    switch (color) {
      case 'blue':
        return {
          light: 'from-blue-500 to-blue-600',
          dark: 'dark:from-blue-600 dark:to-blue-700',
          accent: 'bg-blue-50 dark:bg-blue-900/20',
          ring: 'ring-blue-100 dark:ring-blue-800/30'
        };
      case 'green':
        return {
          light: 'from-green-500 to-green-600',
          dark: 'dark:from-green-600 dark:to-green-700',
          accent: 'bg-green-50 dark:bg-green-900/20',
          ring: 'ring-green-100 dark:ring-green-800/30'
        };
      case 'orange':
        return {
          light: 'from-orange-500 to-orange-600',
          dark: 'dark:from-orange-600 dark:to-orange-700',
          accent: 'bg-orange-50 dark:bg-orange-900/20',
          ring: 'ring-orange-100 dark:ring-orange-800/30'
        };
      default:
        return {
          light: 'from-gray-500 to-gray-600',
          dark: 'dark:from-gray-600 dark:to-gray-700',
          accent: 'bg-gray-50 dark:bg-gray-800/50',
          ring: 'ring-gray-100 dark:ring-gray-700/50'
        };
    }
  };

  const gradients = getGradientColors(color);

  return (
    <div className={`${classes.bg} relative overflow-hidden p-8 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm group`}>
      {/* Decorative background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients.accent} opacity-40 dark:opacity-20`}></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 dark:text-black-400 mb-3 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-black-100a mb-2 transition-colors duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-3">
         
            
          </div>
        </div>
        
        {/* Enhanced Icon Container */}
        <div className="relative ml-6">
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${gradients.light} ${gradients.dark} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
          
          {/* Icon container */}
          <div 
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-xl transform group-hover:rotate-6 transition-transform duration-300 bg-gradient-to-r ${gradients.light} ${gradients.dark}`}
            style={{ backgroundColor: getBackgroundColor(color) }}
          >
            <Icon className="w-8 h-8 text-white drop-shadow-sm" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Status dot */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 dark:bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm animate-pulse"></div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients.light} ${gradients.dark} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
      
      {/* Subtle ring on hover */}
      <div className={`absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:${gradients.ring} transition-all duration-300`}></div>
    </div>
  );
};

export default SummaryCard;