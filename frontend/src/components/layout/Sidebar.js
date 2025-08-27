import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Activity,
  ChevronDown,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard' || location.pathname === '/'
    },
    {
      name: 'Calendar',
      href: '/appointments',
      icon: Calendar,
      current: location.pathname === '/appointments'
    },
    {
      name: 'Patient List',
      href: '/patients',
      icon: Users,
      current: location.pathname === '/patients'
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      current: location.pathname === '/messages'
    },
    {
      name: 'Payment Information',
      href: '/payments',
      icon: CreditCard,
      current: location.pathname === '/payments'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    },
    {
      name: 'Help?',
      href: '/help',
      icon: HelpCircle,
      current: location.pathname === '/help'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-soft min-h-screen">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900">Zendenta</h1>
            <p className="text-xs text-secondary-600">Cabut gigi tanpa sakit</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive || item.current
                    ? 'bg-primary-500 text-white shadow-soft'
                    : 'text-secondary-600 hover:bg-white/60 hover:text-secondary-900'
                }`
              }
            >
              <Icon className={`w-5 h-5 ${
                location.pathname === item.href || location.pathname === '/' && item.href === '/dashboard'
                  ? 'text-white'
                  : 'text-secondary-500 group-hover:text-secondary-700'
              }`} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/40 backdrop-blur-sm">
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/60 transition-colors duration-200 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-soft">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-secondary-600 truncate capitalize">
              {user?.role || 'Staff'}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-secondary-400 group-hover:text-secondary-600 transition-colors duration-200" />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-white/60 hover:text-secondary-900 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-secondary-500 group-hover:text-secondary-700" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
