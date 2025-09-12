import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { aiesecColors } from './constants';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'GOING':
        return { 
          colorLight: aiesecColors.green, 
          bgColorLight: aiesecColors.lightGreen,
          colorDark: '#4CAF50',
          bgColorDark: 'rgba(76, 175, 80, 0.2)',
          icon: UserCheck,
          text: 'Going'
        };
      case 'PENDING':
        return { 
          colorLight: aiesecColors.orange, 
          bgColorLight: aiesecColors.lightOrange,
          colorDark: '#FF9800',
          bgColorDark: 'rgba(255, 152, 0, 0.2)',
          icon: Clock,
          text: 'Pending'
        };
      case 'NOT_GOING':
        return { 
          colorLight: '#F44336', 
          bgColorLight: '#FFEBEE',
          colorDark: '#F44336',
          bgColorDark: 'rgba(244, 67, 54, 0.2)',
          icon: UserX,
          text: 'Not Going'
        };
      default:
        return { 
          colorLight: aiesecColors.gray, 
          bgColorLight: aiesecColors.lightGray,
          colorDark: '#9E9E9E',
          bgColorDark: 'rgba(158, 158, 158, 0.2)',
          icon: Clock,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const badgeStyle = {
    '--status-color-light': config.colorLight,
    '--status-bg-light': config.bgColorLight,
    '--status-color-dark': config.colorDark,
    '--status-bg-dark': config.bgColorDark,
  };

  return (
    <div 
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium status-badge"
      style={badgeStyle}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
      
      <style jsx>{`
        .status-badge {
          background-color: var(--status-bg-light);
          color: var(--status-color-light);
        }
        
        @media (prefers-color-scheme: dark) {
          .status-badge {
            background-color: var(--status-bg-dark);
            color: var(--status-color-dark);
          }
        }
      `}</style>
    </div>
  );
};

export default StatusBadge;