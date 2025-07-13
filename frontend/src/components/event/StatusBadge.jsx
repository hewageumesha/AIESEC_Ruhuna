import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { aiesecColors } from './constants';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'GOING':
        return { 
          color: aiesecColors.green, 
          bgColor: aiesecColors.lightGreen, 
          icon: UserCheck,
          text: 'Going'
        };
      case 'PENDING':
        return { 
          color: aiesecColors.orange, 
          bgColor: aiesecColors.lightOrange, 
          icon: Clock,
          text: 'Pending'
        };
      case 'NOT_GOING':
        return { 
          color: '#F44336', 
          bgColor: '#FFEBEE', 
          icon: UserX,
          text: 'Not Going'
        };
      default:
        return { 
          color: aiesecColors.gray, 
          bgColor: aiesecColors.lightGray, 
          icon: Clock,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div 
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      style={{ 
        backgroundColor: config.bgColor, 
        color: config.color 
      }}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </div>
  );
};

export default StatusBadge;