'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Activity, 
  Users, 
  Calendar, 
  Stethoscope, 
  DollarSign, 
  Settings, 
  HelpCircle, 
  BarChart3,
  FileText,
  Database,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { id: 'patients', label: 'Patients', icon: Users, path: '/patients' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/appointments' },
  { id: 'treatments', label: 'Treatments', icon: Stethoscope, path: '/treatments' },
  { id: 'payments', label: 'Payments', icon: DollarSign, path: '/payments' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  { id: 'backup', label: 'Backup', icon: Database, path: '/backup' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' },
]

export default function Sidebar({ isOpen, onToggle, activePage }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-md border-r border-white/20 shadow-apple transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    } ${collapsed ? 'w-16' : ''}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {isOpen && !collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-apple-blue to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-apple-dark">Zendenta</span>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* User Info */}
      {isOpen && !collapsed && (
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-apple-dark text-sm">{user?.username}</p>
              <p className="text-xs text-apple-gray capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          
          return (
            <a
              key={item.id}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-apple-blue text-white shadow-apple'
                  : 'text-apple-gray hover:bg-white/50 hover:text-apple-dark'
              }`}
            >
              <Icon size={20} />
              {isOpen && !collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </a>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          {isOpen && !collapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  )
}
