import React from 'react';
import { ChevronRight, Clock, Calendar, AlertTriangle, Users, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon, color = 'primary', showMore = false }) => {
  const getIcon = () => {
    switch (icon) {
      case 'approval':
        return <AlertTriangle className="w-6 h-6" />;
      case 'calendar':
        return <Calendar className="w-6 h-6" />;
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'revenue':
        return <DollarSign className="w-6 h-6" />;
      case 'clock':
        return <Clock className="w-6 h-6" />;
      default:
        return <Calendar className="w-6 h-6" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50',
          text: 'text-primary-600',
          iconBg: 'bg-primary-100',
          iconColor: 'text-primary-600'
        };
      case 'success':
        return {
          bg: 'bg-success-50',
          text: 'text-success-600',
          iconBg: 'bg-success-100',
          iconColor: 'text-success-600'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          text: 'text-warning-600',
          iconBg: 'bg-warning-100',
          iconColor: 'text-warning-600'
        };
      case 'accent':
        return {
          bg: 'bg-accent-50',
          text: 'text-accent-600',
          iconBg: 'bg-accent-100',
          iconColor: 'text-accent-600'
        };
      default:
        return {
          bg: 'bg-secondary-50',
          text: 'text-secondary-600',
          iconBg: 'bg-secondary-100',
          iconColor: 'text-secondary-600'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-secondary-600 mb-2">{title}</h4>
          <p className={`text-lg font-semibold ${colors.text} mb-3`}>{value}</p>
          
          {showMore && (
            <button className="flex items-center space-x-1 text-sm font-medium text-secondary-500 hover:text-secondary-700 transition-colors duration-200 group">
              <span>More</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <div className={colors.iconColor}>
            {getIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
