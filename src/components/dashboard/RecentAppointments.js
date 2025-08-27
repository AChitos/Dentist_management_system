'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Activity } from 'lucide-react'

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentAppointments()
  }, [])

  const fetchRecentAppointments = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      
      if (response.ok && data.recentAppointments) {
        setAppointments(data.recentAppointments)
      } else {
        // Fallback data if API doesn't return appointments
        setAppointments([
          {
            id: 1,
            patient_name: 'John Smith',
            date: '2025-08-27',
            time: '09:00',
            treatment: 'Dental Cleaning',
            status: 'confirmed'
          },
          {
            id: 2,
            patient_name: 'Sarah Johnson',
            date: '2025-08-27',
            time: '10:30',
            treatment: 'Root Canal',
            status: 'confirmed'
          },
          {
            id: 3,
            patient_name: 'Mike Davis',
            date: '2025-08-27',
            time: '14:00',
            treatment: 'Crown Fitting',
            status: 'pending'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      // Fallback data
      setAppointments([
        {
          id: 1,
          patient_name: 'John Smith',
          date: '2025-08-27',
          time: '09:00',
          treatment: 'Dental Cleaning',
          status: 'confirmed'
        },
        {
          id: 2,
          patient_name: 'Sarah Johnson',
          date: '2025-08-27',
          time: '10:30',
          treatment: 'Root Canal',
          status: 'confirmed'
        },
        {
          id: 3,
          patient_name: 'Mike Davis',
          date: '2025-08-27',
          time: '14:00',
          treatment: 'Crown Fitting',
          status: 'pending'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-apple-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center space-x-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-apple-dark">{appointment.patient_name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1 text-sm text-apple-gray">
                <Clock size={14} />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-apple-gray">
                <Activity size={14} />
                <span>{appointment.treatment}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <button className="text-apple-blue hover:text-apple-dark text-sm font-medium transition-colors">
          View All Appointments →
        </button>
      </div>
    </div>
  )
}
