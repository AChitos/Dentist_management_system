'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Settings() {
  const { user, logout } = useAuth()
  const [clinicSettings, setClinicSettings] = useState({
    clinic_name: 'Zendenta Dental Clinic',
    address: '',
    phone: '',
    email: '',
    working_hours: ''
  })
  const [userSettings, setUserSettings] = useState({
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setUserSettings({
        username: user.username || '',
        email: user.email || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    }
  }, [user])

  const handleClinicSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('Clinic settings updated successfully!')
    setTimeout(() => setMessage(''), 3000)
    setLoading(false)
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    if (userSettings.new_password && userSettings.new_password !== userSettings.confirm_password) {
      setMessage('New passwords do not match!')
      return
    }
    setLoading(true)
    setMessage('User settings updated successfully!')
    setTimeout(() => setMessage(''), 3000)
    setLoading(false)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinic Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Clinic Information</h2>
          <form onSubmit={handleClinicSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicSettings.clinic_name}
                onChange={(e) => setClinicSettings({...clinicSettings, clinic_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={clinicSettings.address}
                onChange={(e) => setClinicSettings({...clinicSettings, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="7898 Marsh Ln Richardson, Wisconsin 35697 United States"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={clinicSettings.phone}
                onChange={(e) => setClinicSettings({...clinicSettings, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(205) 555-0100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={clinicSettings.email}
                onChange={(e) => setClinicSettings({...clinicSettings, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="info@zendenta.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <textarea
                value={clinicSettings.working_hours}
                onChange={(e) => setClinicSettings({...clinicSettings, working_hours: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Monday-Friday: 8:00 AM - 6:00 PM"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Clinic Settings'}
            </button>
          </form>
        </div>

        {/* User Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">User Account</h2>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={userSettings.username}
                onChange={(e) => setUserSettings({...userSettings, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={userSettings.email}
                onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={userSettings.current_password}
                onChange={(e) => setUserSettings({...userSettings, current_password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password to change"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={userSettings.new_password}
                onChange={(e) => setUserSettings({...userSettings, new_password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={userSettings.confirm_password}
                onChange={(e) => setUserSettings({...userSettings, confirm_password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save User Settings'}
            </button>
          </form>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('/api/backup', '_blank')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Download Backup
          </button>
          <button
            onClick={() => window.open('/api/export-excel', '_blank')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Export to Excel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Session</h3>
        <div className="text-blue-800">
          <p><strong>User:</strong> {user?.username}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>
    </div>
  )
}
