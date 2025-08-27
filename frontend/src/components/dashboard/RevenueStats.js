import React from 'react';
import { ChevronRight, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const RevenueStats = ({ data }) => {
  if (!data) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Revenue Statistics</h3>
        </div>
        <div className="card-content">
          <p className="text-secondary-500 text-center py-8">No revenue data available</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-success-600" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-accent-600" />;
    }
    return null;
  };

  const getTrendText = (current, previous) => {
    if (current > previous) {
      return 'text-success-600';
    } else if (current < previous) {
      return 'text-accent-600';
    }
    return 'text-secondary-600';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Revenue (Jaspel)</h3>
      </div>
      
      <div className="card-content">
        <div className="space-y-4">
          {/* This Month Revenue */}
          <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-900">This Month</p>
                <p className="text-lg font-bold text-success-600">
                  {formatCurrency(data.thisMonth)}
                </p>
                <p className="text-xs text-success-700">So Far</p>
              </div>
            </div>
            {getTrendIcon(data.thisMonth, data.previousMonth)}
          </div>

          {/* Previous Month Revenue */}
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">Previous Month</p>
                <p className={`text-lg font-bold ${getTrendText(data.thisMonth, data.previousMonth)}`}>
                  {formatCurrency(data.previousMonth)}
                </p>
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

export default RevenueStats;
