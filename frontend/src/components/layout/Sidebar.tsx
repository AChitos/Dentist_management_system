import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  CreditCard,
  Package,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST'],
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: <Users className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST'],
  },
  {
    name: 'Appointments',
    path: '/appointments',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST'],
  },
  {
    name: 'Treatments',
    path: '/treatments',
    icon: <Stethoscope className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'STAFF'],
  },
  {
    name: 'Medical Records',
    path: '/medical-records',
    icon: <FileText className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'STAFF'],
  },
  {
    name: 'Billing',
    path: '/billing',
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['ADMIN', 'STAFF', 'RECEPTIONIST'],
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: <Package className="w-5 h-5" />,
    roles: ['ADMIN', 'STAFF'],
  },
  {
    name: 'Users',
    path: '/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['ADMIN'],
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST'],
  },
  {
    name: 'Backup',
    path: '/backup',
    icon: <Database className="w-5 h-5" />,
    roles: ['ADMIN'],
  },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-glass-sm h-screen overflow-hidden"
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-secondary-100/50 hover:bg-secondary-200/50 text-secondary-600 hover:text-secondary-800 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Navigation Items */}
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.li
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-secondary-700 hover:bg-secondary-100/50 hover:text-secondary-900'
                    }`
                  }
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Info at Bottom */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-100 bg-white/50 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-secondary-600 truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
