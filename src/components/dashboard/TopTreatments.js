'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, DollarSign } from 'lucide-react'

export default function TopTreatments() {
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopTreatments()
  }, [])

  const fetchTopTreatments = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      
      if (response.ok && data.topTreatments) {
        setTreatments(data.topTreatments)
      } else {
        // Fallback data if API doesn't return treatments
        setTreatments([
          {
            id: 1,
            name: 'Dental Cleaning',
            count: 45,
            revenue: 2250,
            trend: '+15%'
          },
          {
            id: 2,
            name: 'Root Canal',
            count: 18,
            revenue: 5400,
            trend: '+8%'
          },
          {
            id: 3,
            name: 'Crown Fitting',
            count: 22,
            revenue: 6600,
            trend: '+12%'
          },
          {
            id: 4,
            name: 'Tooth Extraction',
            count: 12,
            revenue: 2400,
            trend: '+5%'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching treatments:', error)
      // Fallback data
      setTreatments([
        {
          id: 1,
          name: 'Dental Cleaning',
          count: 45,
          revenue: 2250,
          trend: '+15%'
        },
        {
          id: 2,
          name: 'Root Canal',
          count: 18,
          revenue: 5400,
          trend: '+8%'
        },
        {
          id: 3,
          name: 'Crown Fitting',
          count: 22,
          revenue: 6600,
          trend: '+12%'
        },
        {
          id: 4,
          name: 'Tooth Extraction',
          count: 12,
          revenue: 2400,
          trend: '+5%'
        }
      ])
    } finally {
      setLoading(false)
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
      {treatments.map((treatment, index) => (
        <div key={treatment.id} className="flex items-center space-x-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
          {/* Rank */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            index === 0 ? 'bg-yellow-100 text-yellow-800' :
            index === 1 ? 'bg-gray-100 text-gray-800' :
            index === 2 ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            #{index + 1}
          </div>
          
          {/* Treatment Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-apple-dark">{treatment.name}</h4>
              <span className="text-sm text-green-600 font-medium flex items-center space-x-1">
                <TrendingUp size={14} />
                <span>{treatment.trend}</span>
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1 text-sm text-apple-gray">
                <Activity size={14} />
                <span>{treatment.count} procedures</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-apple-gray">
                <DollarSign size={14} />
                <span>${treatment.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <button className="text-apple-blue hover:text-apple-dark text-sm font-medium transition-colors">
          View All Treatments →
        </button>
      </div>
    </div>
  )
}
