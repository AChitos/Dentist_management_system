import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, BarChart3 } from 'lucide-react';

const Inventory: React.FC = () => {
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
              Inventory
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage dental supplies and equipment inventory
            </p>
          </div>
          <button className="btn btn-primary">
            <Package className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Inventory Management
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              This page will allow you to track dental supplies, monitor stock levels, and manage inventory.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn btn-primary">
                <Package className="w-4 h-4 mr-2" />
                Add Item
              </button>
              <button className="btn btn-secondary">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </button>
              <button className="btn btn-warning">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Low Stock
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Inventory;
