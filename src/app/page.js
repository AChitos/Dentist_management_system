'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Login from '../components/auth/Login'
import Dashboard from '../components/dashboard/Dashboard'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

function HomeContent() {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    console.log('HomeContent: Authentication state changed:', { isAuthenticated, isLoading })
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
        <div className="glass-card p-8 rounded-3xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
          <p className="text-apple-gray">Loading Zendenta...</p>
        </div>
      </div>
    )
  }

  console.log('HomeContent: Rendering with state:', { isAuthenticated, isLoading })
  return isAuthenticated ? <Dashboard /> : <Login />
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
