'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, Bell, Search, Activity } from 'lucide-react'

export default function Header({ onMenuToggle, activePage }) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      patients: 'Patient Management',
      appointments: 'Appointment Scheduling',
      treatments: 'Treatment Records',
      payments: 'Financial Management',
      reports: 'Reports & Analytics',
      backup: 'Backup & Export',
      settings: 'System Settings',
      help: 'Help & Support'
    }
    return titles[activePage] || 'Dashboard'
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-apple sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors lg:hidden"
          >
            <Menu size={24} className="text-apple-dark" />
          </button>
          
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-apple-blue to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-apple-dark">Zendenta</span>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-apple-dark">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
            <input
              type="text"
              placeholder="Search patients, appointments, treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-white/50 transition-colors">
            <Bell size={20} className="text-apple-dark" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-apple-dark">{user?.username}</p>
              <p className="text-xs text-apple-gray capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
