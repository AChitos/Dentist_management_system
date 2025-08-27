import React from 'react';
import { ChevronRight, Activity } from 'lucide-react';

const TopTreatments = ({ treatments }) => {
  if (!treatments || treatments.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Treatment</h3>
        </div>
        <div className="card-content">
          <p className="text-secondary-500 text-center py-8">No treatment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Top Treatment</h3>
      </div>
      
      <div className="card-content">
        <div className="space-y-3">
          {treatments.map((treatment, index) => (
            <div key={treatment.treatment_type || index} className="treatment-item">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {treatment.treatment_type || 'Treatment'}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {treatment.count || 0} procedures
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-secondary-400">
                  #{index + 1}
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

export default TopTreatments;
