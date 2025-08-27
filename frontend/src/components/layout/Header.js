import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Bell, Download, Database } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard Overview';
      case '/patients':
        return 'Patient Management';
      case '/appointments':
        return 'Appointment Calendar';
      case '/treatments':
        return 'Treatment Management';
      case '/payments':
        return 'Payment Information';
      case '/settings':
        return 'Settings';
      case '/help':
        return 'Help & Support';
      default:
        return 'Dashboard';
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      toast.success(`Searching for: ${searchQuery}`);
    }
  };

  // Handle backup
  const handleBackup = async () => {
    try {
      toast.loading('Creating backup...');
      await axios.post('/api/backup/create');
      toast.dismiss();
      toast.success('Backup created successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to create backup');
    }
  };

  // Handle Excel export
  const handleExport = async () => {
    try {
      toast.loading('Preparing Excel export...');
      const response = await axios.post('/api/export/excel/all', {}, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `zendenta-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Excel export downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export data');
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-soft px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Page Title and Greeting */}
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-semibold text-secondary-900">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-secondary-600">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Doctor'}
            </p>
          </div>
        </div>

        {/* Right Side - Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients, appointments..."
                className="w-80 pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Backup Button */}
            <button
              onClick={handleBackup}
              className="p-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl transition-colors duration-200 group"
              title="Create Database Backup"
            >
              <Database className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="p-2 bg-success-50 hover:bg-success-100 text-success-600 rounded-xl transition-colors duration-200 group"
              title="Export to Excel"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Add New Button */}
            <button className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors duration-200 group shadow-soft hover:shadow-medium">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 bg-secondary-50 hover:bg-secondary-100 text-secondary-600 rounded-xl transition-colors duration-200 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
