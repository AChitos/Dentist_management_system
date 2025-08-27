import React from 'react';
import { ChevronRight, MapPin, Phone, Building } from 'lucide-react';

const ClinicInfo = ({ data }) => {
  if (!data) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Clinic Information</h3>
        </div>
        <div className="card-content">
          <p className="text-secondary-500 text-center py-8">No clinic information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Clinic Information</h3>
      </div>
      
      <div className="card-content">
        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-xl">
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-secondary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 mb-1">Address</p>
              <p className="text-xs text-secondary-600 leading-relaxed">
                {data.clinic_address || '7898 Marsh Ln Undefined Richardson, Wisconsin 35697 United States'}
              </p>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-900 mb-1">Primary Phone</p>
                <p className="text-sm text-primary-600">
                  {data.clinic_phone_1 || '(205) 555-0100'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-900 mb-1">Secondary Phone</p>
                <p className="text-sm text-primary-600">
                  {data.clinic_phone_2 || '(262) 555-0131'}
                </p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-center space-x-3 p-3 bg-success-50 rounded-xl">
            <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Building className="w-4 h-4 text-success-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-success-900 mb-1">Working Hours</p>
              <p className="text-sm text-success-600">
                {data.working_hours || '09:00-17:00'}
              </p>
            </div>
          </div>
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

export default ClinicInfo;
