'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Clock, 
  User,
  Activity,
  TrendingUp
} from 'lucide-react'

export default function TreatmentList() {
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTreatment, setSelectedTreatment] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchTreatments()
  }, [])

  const fetchTreatments = async () => {
    try {
      // Mock data for treatments
      const mockTreatments = [
        {
          id: 1,
          patient_name: 'John Smith',
          patient_id: 1,
          treatment_type: 'Dental Cleaning',
          date: '2025-08-20',
          duration: 60,
          cost: 150,
          status: 'completed',
          notes: 'Regular cleaning, no issues found',
          dentist: 'Dr. Johnson'
        },
        {
          id: 2,
          patient_name: 'Sarah Johnson',
          patient_id: 2,
          treatment_type: 'Root Canal',
          date: '2025-08-22',
          duration: 90,
          cost: 800,
          status: 'in_progress',
          notes: 'Root canal treatment on tooth #14',
          dentist: 'Dr. Smith'
        },
        {
          id: 3,
          patient_name: 'Mike Davis',
          patient_id: 3,
          treatment_type: 'Crown Fitting',
          date: '2025-08-25',
          duration: 45,
          cost: 1200,
          status: 'scheduled',
          notes: 'Crown fitting for tooth #3',
          dentist: 'Dr. Johnson'
        },
        {
          id: 4,
          patient_name: 'Emily Wilson',
          patient_id: 4,
          treatment_type: 'Tooth Extraction',
          date: '2025-08-18',
          duration: 30,
          cost: 300,
          status: 'completed',
          notes: 'Wisdom tooth extraction',
          dentist: 'Dr. Smith'
        }
      ]
      setTreatments(mockTreatments)
    } catch (error) {
      console.error('Error fetching treatments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTreatments = treatments.filter(treatment =>
    treatment.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    treatment.treatment_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    treatment.dentist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddTreatment = () => {
    setShowAddModal(true)
  }

  const handleEditTreatment = (treatment) => {
    setSelectedTreatment(treatment)
    setShowAddModal(true)
  }

  const handleViewTreatment = (treatment) => {
    setSelectedTreatment(treatment)
    setShowViewModal(true)
  }

  const handleDeleteTreatment = (treatmentId) => {
    if (confirm('Are you sure you want to delete this treatment record?')) {
      setTreatments(treatments.filter(t => t.id !== treatmentId))
    }
  }

  const totalRevenue = treatments.reduce((sum, t) => sum + t.cost, 0)
  const completedTreatments = treatments.filter(t => t.status === 'completed').length
  const inProgressTreatments = treatments.filter(t => t.status === 'in_progress').length

  if (loading) {
    return (
      <Layout activePage="treatments">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="treatments">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-dark">Treatment Management</h1>
          <p className="text-apple-gray">Track and manage patient treatments and procedures</p>
        </div>
        <button
          onClick={handleAddTreatment}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Treatment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
            <input
              type="text"
              placeholder="Search treatments by patient, type, or dentist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-200"
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">{treatments.length}</h3>
          <p className="text-apple-gray">Total Treatments</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">{completedTreatments}</h3>
          <p className="text-apple-gray">Completed</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">{inProgressTreatments}</h3>
          <p className="text-apple-gray">In Progress</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">${totalRevenue.toLocaleString()}</h3>
          <p className="text-apple-gray">Total Revenue</p>
        </div>
      </div>

      {/* Treatments Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredTreatments.map((treatment) => (
                <tr key={treatment.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {treatment.patient_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-apple-dark">{treatment.patient_name}</div>
                        <div className="text-sm text-apple-gray">ID: {treatment.patient_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{treatment.treatment_type}</div>
                    <div className="text-sm text-apple-gray">{treatment.dentist}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{treatment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{treatment.duration} min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-apple-dark">${treatment.cost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(treatment.status)}`}>
                      {treatment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewTreatment(treatment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditTreatment(treatment)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Treatment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTreatment(treatment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Treatment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Treatment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-apple-dark mb-4">
              {selectedTreatment ? 'Edit Treatment' : 'Add New Treatment'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Patient</label>
                <select className="input-field">
                  <option>Select Patient</option>
                  <option>John Smith</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Davis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Treatment Type</label>
                <select className="input-field">
                  <option>Select Treatment</option>
                  <option>Dental Cleaning</option>
                  <option>Root Canal</option>
                  <option>Crown Fitting</option>
                  <option>Tooth Extraction</option>
                  <option>Consultation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Date</label>
                  <input
                    type="date"
                    defaultValue={selectedTreatment?.date || ''}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Duration (min)</label>
                  <input
                    type="number"
                    defaultValue={selectedTreatment?.duration || 30}
                    className="input-field"
                    min="15"
                    step="15"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Cost ($)</label>
                  <input
                    type="number"
                    defaultValue={selectedTreatment?.cost || ''}
                    className="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Status</label>
                  <select className="input-field">
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Dentist</label>
                <select className="input-field">
                  <option>Select Dentist</option>
                  <option>Dr. Johnson</option>
                  <option>Dr. Smith</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Notes</label>
                <textarea
                  defaultValue={selectedTreatment?.notes || ''}
                  className="input-field"
                  rows="3"
                  placeholder="Add treatment notes..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {selectedTreatment ? 'Update' : 'Add'} Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Treatment Modal */}
      {showViewModal && selectedTreatment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-apple-dark">Treatment Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-apple-gray hover:text-apple-dark"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {selectedTreatment.patient_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-apple-dark">{selectedTreatment.patient_name}</h3>
                  <p className="text-apple-gray">Patient ID: {selectedTreatment.patient_id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedTreatment.treatment_type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedTreatment.dentist}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedTreatment.date} ({selectedTreatment.duration} min)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">${selectedTreatment.cost}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTreatment.status)}`}>
                    {selectedTreatment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {selectedTreatment.notes && (
                <div className="pt-4">
                  <h4 className="font-medium text-apple-dark mb-2">Notes</h4>
                  <div className="bg-white/50 px-3 py-2 rounded-lg text-sm text-apple-dark">
                    {selectedTreatment.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
