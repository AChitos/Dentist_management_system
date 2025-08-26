import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield } from 'lucide-react';

const Users: React.FC = () => {
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
              Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage clinic staff and user accounts
            </p>
          </div>
          <button className="btn btn-primary">
            <UserPlus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              User Management
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This page will allow you to manage clinic staff, set permissions, and control access levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
              <button className="btn btn-secondary">
                <Users className="w-4 h-4 mr-2" />
                View Staff
              </button>
              <button className="btn btn-warning">
                <Shield className="w-4 h-4 mr-2" />
                Permissions
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Users;
