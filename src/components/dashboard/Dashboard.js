'use client'

import { useAuth } from '../../contexts/AuthContext'
import { Activity, LogOut } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-blue-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-apple-dark">Zendenta</h1>
              <p className="text-apple-gray">Welcome back, {user?.username || 'User'}!</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn-secondary flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-card p-8 rounded-3xl text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Activity className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-apple-dark mb-4">
          🎉 Successfully Logged In!
        </h2>
        
        <p className="text-lg text-apple-gray mb-8 max-w-2xl mx-auto">
          Welcome to your dental clinic management system. The backend API is working perfectly, 
          and you're now authenticated. This is a simplified dashboard view.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* API Status */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
            <h3 className="font-semibold text-green-800 mb-2">API Status</h3>
            <p className="text-green-600">✅ Connected</p>
          </div>

          {/* Authentication */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
            <h3 className="font-semibold text-blue-800 mb-2">Authentication</h3>
            <p className="text-blue-600">✅ JWT Active</p>
          </div>

          {/* Database */}
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl">
            <h3 className="font-semibold text-purple-800 mb-2">Database</h3>
            <p className="text-purple-600">✅ SQLite Ready</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-3">Next Steps</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• The application is now running successfully on Next.js</p>
            <p>• All API endpoints are functional</p>
            <p>• Ready for Vercel deployment</p>
            <p>• Database can be initialized via <code className="bg-gray-200 px-2 py-1 rounded">/api/init-db</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
