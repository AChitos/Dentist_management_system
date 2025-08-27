import React from 'react';
import { ChevronRight, Users, UserPlus } from 'lucide-react';

const PatientStats = ({ data }) => {
  if (!data) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Patient Statistics</h3>
        </div>
        <div className="card-content">
          <p className="text-secondary-500 text-center py-8">No patient data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Patient Statistics</h3>
      </div>
      
      <div className="card-content">
        <div className="space-y-4">
          {/* New Patients This Month */}
          <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900">New This Month</p>
                <p className="text-lg font-bold text-primary-600">{data.newThisMonth || 0}</p>
              </div>
            </div>
            <button className="p-1 text-primary-400 hover:text-primary-600 transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Total Patients */}
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">Total Patients</p>
                <p className="text-lg font-bold text-secondary-600">{data.total || 0}</p>
              </div>
            </div>
            <button className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStats;
