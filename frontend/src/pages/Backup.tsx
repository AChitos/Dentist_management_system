import React from 'react';
import { motion } from 'framer-motion';
import { Download, Database, FileSpreadsheet } from 'lucide-react';

const Backup: React.FC = () => {
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
              Backup & Export
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage database backups and data exports
            </p>
          </div>
          <button className="btn btn-primary">
            <Download className="w-5 h-5 mr-2" />
            Create Backup
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Backup Management
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This page will allow you to create database backups, export data to Excel, and manage backup files.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Create Backup
              </button>
              <button className="btn btn-secondary">
                <Database className="w-4 h-4 mr-2" />
                View Backups
              </button>
              <button className="btn btn-success">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Backup;
