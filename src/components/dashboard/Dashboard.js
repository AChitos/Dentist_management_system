'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import StatCard from './StatCard'
import AppointmentChart from './AppointmentChart'
import RecentAppointments from './RecentAppointments'
import TopTreatments from './TopTreatments'
import RevenueChart from './RevenueChart'
import { Activity, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    monthlyTreatments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Monthly Treatments',
      value: stats.monthlyTreatments,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      change: '+8%',
      changeType: 'positive'
    }
  ]

  if (loading) {
    return (
      <Layout activePage="dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-apple-dark mb-2">Welcome back! 👋</h1>
        <p className="text-apple-gray">Here's what's happening at your dental clinic today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Appointments Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Appointments Overview</h3>
          <AppointmentChart />
        </div>

        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Revenue Trends</h3>
          <RevenueChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Recent Appointments</h3>
          <RecentAppointments />
        </div>

        {/* Top Treatments */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Top Treatments</h3>
          <TopTreatments />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="glass-card p-4 text-left hover:shadow-apple-hover transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-apple-dark">Add New Patient</h4>
                <p className="text-sm text-apple-gray">Register a new patient</p>
              </div>
            </div>
          </button>

          <button className="glass-card p-4 text-left hover:shadow-apple-hover transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-apple-dark">Schedule Appointment</h4>
                <p className="text-sm text-apple-gray">Book a new appointment</p>
              </div>
            </div>
          </button>

          <button className="glass-card p-4 text-left hover:shadow-apple-hover transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-apple-dark">View Reports</h4>
                <p className="text-sm text-apple-gray">Generate clinic reports</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  )
}
