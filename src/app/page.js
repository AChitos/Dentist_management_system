'use client'

import { useAuth } from '../contexts/AuthContext'
import SimpleLogin from '../components/SimpleLogin'
import SimpleDashboard from '../components/SimpleDashboard'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SimpleLogin />
  }

  return <SimpleDashboard />
}
