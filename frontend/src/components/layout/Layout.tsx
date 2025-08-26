import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <Header user={user} />
      
      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
