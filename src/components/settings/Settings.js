'use client'

import { useState } from 'react'
import Layout from '../layout/Layout'
import { 
  Settings, 
  User, 
  Building, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Save,
  Activity
} from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    clinicName: 'Zendenta Dental Clinic',
    clinicAddress: '123 Main Street, City, State 12345',
    clinicPhone: '+1 (555) 123-4567',
    clinicEmail: 'info@zendenta.com',
    workingHours: '9:00 AM - 6:00 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    theme: 'light',
    language: 'en',
    timezone: 'UTC-5'
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup & Export', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Clinic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Clinic Name</label>
            <input
              type="text"
              value={settings.clinicName}
              onChange={(e) => handleSettingChange('clinicName', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.clinicPhone}
              onChange={(e) => handleSettingChange('clinicPhone', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Email Address</label>
            <input
              type="email"
              value={settings.clinicEmail}
              onChange={(e) => handleSettingChange('clinicEmail', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Working Hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => handleSettingChange('workingHours', e.target.value)}
              className="input-field"
              placeholder="9:00 AM - 6:00 PM"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-apple-dark mb-2">Address</label>
          <textarea
            value={settings.clinicAddress}
            onChange={(e) => handleSettingChange('clinicAddress', e.target.value)}
            className="input-field"
            rows="3"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">System Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="input-field"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">User Profile</h3>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xl">A</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-apple-dark">Admin User</h4>
            <p className="text-apple-gray">Administrator</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Username</label>
            <input
              type="text"
              value="admin"
              disabled
              className="input-field bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Email</label>
            <input
              type="email"
              value="admin@zendenta.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">First Name</label>
            <input
              type="text"
              value="Admin"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Last Name</label>
            <input
              type="text"
              value="User"
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Current Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Confirm New Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div>
              <h4 className="font-medium text-apple-dark">Email Notifications</h4>
              <p className="text-sm text-apple-gray">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div>
              <h4 className="font-medium text-apple-dark">SMS Notifications</h4>
              <p className="text-sm text-apple-gray">Receive notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div>
              <h4 className="font-medium text-apple-dark">Push Notifications</h4>
              <p className="text-sm text-apple-gray">Receive push notifications in browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-apple-gray mb-3">Add an extra layer of security to your account</p>
            <button className="btn-secondary">Enable 2FA</button>
          </div>

          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Session Management</h4>
            <p className="text-sm text-apple-gray mb-3">Manage your active sessions across devices</p>
            <button className="btn-secondary">View Active Sessions</button>
          </div>

          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Login History</h4>
            <p className="text-sm text-apple-gray mb-3">View your recent login activity</p>
            <button className="btn-secondary">View Login History</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Backup & Export</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Database Backup</h4>
            <p className="text-sm text-apple-gray mb-3">Create a complete backup of your clinic data</p>
            <button className="btn-primary">Create Backup</button>
          </div>

          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Export Data</h4>
            <p className="text-sm text-apple-gray mb-3">Export your data in various formats (Excel, CSV, PDF)</p>
            <button className="btn-primary">Export Data</button>
          </div>

          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Restore Data</h4>
            <p className="text-sm text-apple-gray mb-3">Restore your clinic data from a backup file</p>
            <button className="btn-secondary">Restore from Backup</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Appearance Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="input-field"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-apple-dark mb-2">Color Scheme</h4>
            <p className="text-sm text-apple-gray mb-3">Customize the color scheme of your interface</p>
            <div className="flex space-x-2">
              <button className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg"></button>
              <button className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg"></button>
              <button className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg"></button>
              <button className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white shadow-lg"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'profile':
        return renderProfileSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'backup':
        return renderBackupSettings()
      case 'appearance':
        return renderAppearanceSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <Layout activePage="settings">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-apple-dark">Settings</h1>
        <p className="text-apple-gray">Manage your clinic's configuration and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="glass-card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-apple-blue text-white shadow-apple'
                        : 'text-apple-gray hover:bg-white/50 hover:text-apple-dark'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="glass-card p-6">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
