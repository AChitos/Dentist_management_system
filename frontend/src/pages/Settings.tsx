import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Database, Bell } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure clinic and user preferences
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              System Settings
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This page will allow you to configure clinic settings, user preferences, and system options.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn btn-primary">
                <SettingsIcon className="w-4 h-4 mr-2" />
                General Settings
              </button>
              <button className="btn btn-secondary">
                <Database className="w-4 h-4 mr-2" />
                Database Settings
              </button>
              <button className="btn btn-warning">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
