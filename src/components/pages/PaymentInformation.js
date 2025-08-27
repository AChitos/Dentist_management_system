'use client'

import { useState, useEffect } from 'react'

export default function PaymentInformation() {
  const [treatments, setTreatments] = useState([])
  const [patients, setPatients] = useState([])
  const [treatmentTypes, setTreatmentTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: '',
    treatment_type_id: '',
    treatment_date: '',
    cost: '',
    notes: '',
    status: 'completed'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [treatmentsRes, patientsRes, treatmentTypesRes] = await Promise.all([
        fetch('/api/treatments'),
        fetch('/api/patients'),
        fetch('/api/treatment-types')
      ])
      
      const [treatmentsData, patientsData, treatmentTypesData] = await Promise.all([
        treatmentsRes.json(),
        patientsRes.json(),
        treatmentTypesRes.json()
      ])
      
      setTreatments(treatmentsData.treatments || [])
      setPatients(patientsData.patients || [])
      setTreatmentTypes(treatmentTypesData.treatmentTypes || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          doctor_id: 1 // Default to admin user
        })
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Error creating treatment:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      patient_id: '',
      treatment_type_id: '',
      treatment_date: '',
      cost: '',
      notes: '',
      status: 'completed'
    })
  }

  const getTotalRevenue = () => {
    return treatments.reduce((total, treatment) => total + (parseFloat(treatment.cost) || 0), 0)
  }

  const getRevenueByMonth = () => {
    const monthlyRevenue = {}
    treatments.forEach(treatment => {
      const month = new Date(treatment.treatment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (parseFloat(treatment.cost) || 0)
    })
    return monthlyRevenue
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const monthlyRevenue = getRevenueByMonth()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Payment Information</h1>
        <button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Treatment
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(getTotalRevenue())}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Treatments</h3>
          <p className="text-3xl font-bold text-blue-600">{treatments.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average Treatment Cost</h3>
          <p className="text-3xl font-bold text-purple-600">
            {treatments.length > 0 ? formatCurrency(getTotalRevenue() / treatments.length) : '$0.00'}
          </p>
        </div>
      </div>

      {/* Monthly Revenue */}
      {Object.keys(monthlyRevenue).length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(monthlyRevenue).map(([month, revenue]) => (
              <div key={month} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700">{month}</h4>
                <p className="text-xl font-bold text-green-600">{formatCurrency(revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Treatment Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Add New Treatment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.patient_id}
              onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
            <select
              value={formData.treatment_type_id}
              onChange={(e) => {
                const selectedType = treatmentTypes.find(t => t.id == e.target.value)
                setFormData({
                  ...formData, 
                  treatment_type_id: e.target.value,
                  cost: selectedType ? selectedType.base_cost : ''
                })
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Treatment Type</option>
              {treatmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {formatCurrency(type.base_cost)}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={formData.treatment_date}
              onChange={(e) => setFormData({...formData, treatment_date: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cost"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Treatment
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Treatments List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Treatment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatments.map((treatment) => (
                <tr key={treatment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {treatment.patient_first_name} {treatment.patient_last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {treatment.treatment_type_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(treatment.treatment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-green-600">
                      {formatCurrency(treatment.cost)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {treatment.doctor_name || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      treatment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {treatment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {treatments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No treatments found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
