import React from 'react';
import { ChevronRight, Clock, User, Calendar } from 'lucide-react';

const AppointmentList = ({ appointments, title, count }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{title} (0)</h3>
        </div>
        <div className="card-content">
          <p className="text-secondary-500 text-center py-8">No appointments scheduled for today</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Format HH:MM
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title} ({count})</h3>
      </div>
      
      <div className="card-content">
        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <div key={appointment.id || index} className="appointment-item">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {appointment.type || 'Appointment'}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-secondary-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{appointment.patient_name || 'Patient'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status || 'scheduled'}
                </span>
                <button className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors duration-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <button className="flex items-center space-x-2 text-sm font-medium text-secondary-600 hover:text-secondary-800 transition-colors duration-200 group">
            <span>More</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
