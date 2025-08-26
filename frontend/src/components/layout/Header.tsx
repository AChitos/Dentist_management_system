import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  Moon, 
  Sun, 
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  specialization?: string;
  avatar?: string;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'DOCTOR':
        return 'Doctor';
      case 'STAFF':
        return 'Staff';
      case 'RECEPTIONIST':
        return 'Receptionist';
      default:
        return role;
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-glass-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="w-full pl-10 pr-4 py-2 bg-secondary-50/50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
                const currentIndex = themes.indexOf(theme);
                const nextIndex = (currentIndex + 1) % themes.length;
                setTheme(themes[nextIndex]);
              }}
              className="p-2 rounded-xl bg-secondary-100/50 hover:bg-secondary-200/50 text-secondary-600 hover:text-secondary-800 transition-all duration-200"
              title={`Current theme: ${getThemeLabel()}`}
            >
              {getThemeIcon()}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-secondary-100/50 hover:bg-secondary-200/50 text-secondary-600 hover:text-secondary-800 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-secondary-100/50 hover:bg-secondary-200/50 transition-all duration-200"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
                  )}
                </div>
                
                {/* User Info */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-600">
                    {getRoleDisplay(user?.role || '')}
                  </p>
                </div>
                
                <ChevronDown className={`w-4 h-4 text-secondary-600 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-glass-lg border border-white/20 py-2 z-50"
                  >
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-secondary-600">
                        {user?.email}
                      </p>
                      {user?.specialization && (
                        <p className="text-xs text-primary-600 mt-1">
                          {user.specialization}
                        </p>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-3 transition-colors duration-200">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-3 transition-colors duration-200">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-secondary-100 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center space-x-3 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-glass-lg border border-white/20 py-4 z-50"
          >
            <div className="px-4 pb-3 border-b border-secondary-100">
              <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {/* Sample notifications */}
              <div className="px-4 py-3 hover:bg-secondary-50 transition-colors duration-200">
                <p className="text-sm text-secondary-900">New appointment scheduled for tomorrow</p>
                <p className="text-xs text-secondary-600 mt-1">2 minutes ago</p>
              </div>
              
              <div className="px-4 py-3 hover:bg-secondary-50 transition-colors duration-200">
                <p className="text-sm text-secondary-900">Patient check-in reminder</p>
                <p className="text-xs text-secondary-600 mt-1">15 minutes ago</p>
              </div>
              
              <div className="px-4 py-3 hover:bg-secondary-50 transition-colors duration-200">
                <p className="text-sm text-secondary-900">Inventory low: Dental floss</p>
                <p className="text-xs text-secondary-600 mt-1">1 hour ago</p>
              </div>
            </div>
            
            <div className="px-4 pt-3 border-t border-secondary-100">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
