'use client'

import { useState } from 'react'
import Login from '../components/auth/Login'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4">
        <div className="glass-card p-8 rounded-3xl text-center">
          <h1 className="text-3xl font-bold text-apple-dark mb-4">Welcome to Zendenta!</h1>
          <p className="text-apple-gray mb-6">You are successfully logged in.</p>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="btn-primary"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return <Login />
}
