import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clipboard, History } from 'lucide-react';

const MedicalRecords: React.FC = () => {
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
              Medical Records
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage patient medical history and records
            </p>
          </div>
          <button className="btn btn-primary">
            <FileText className="w-5 h-5 mr-2" />
            New Record
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Clipboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Medical Records Management
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This page will allow you to view, create, and manage patient medical records.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn btn-primary">
                <FileText className="w-4 h-4 mr-2" />
                Create Record
              </button>
              <button className="btn btn-secondary">
                <History className="w-4 h-4 mr-2" />
                View History
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MedicalRecords;
