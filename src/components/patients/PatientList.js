'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  Calendar,
  Activity
} from 'lucide-react'

export default function PatientList() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, using mock data
      const mockPatients = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1985-03-15',
          lastVisit: '2025-08-20',
          status: 'active',
          treatments: ['Dental Cleaning', 'Crown Fitting']
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 234-5678',
          dateOfBirth: '1990-07-22',
          lastVisit: '2025-08-25',
          status: 'active',
          treatments: ['Root Canal', 'Dental Cleaning']
        },
        {
          id: 3,
          name: 'Mike Davis',
          email: 'mike.davis@email.com',
          phone: '+1 (555) 345-6789',
          dateOfBirth: '1978-11-08',
          lastVisit: '2025-08-18',
          status: 'inactive',
          treatments: ['Tooth Extraction']
        }
      ]
      setPatients(mockPatients)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  )

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const handleAddPatient = () => {
    setShowAddModal(true)
  }

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setShowAddModal(true)
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const handleDeletePatient = (patientId) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== patientId))
    }
  }

  if (loading) {
    return (
      <Layout activePage="patients">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="patients">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-dark">Patient Management</h1>
          <p className="text-apple-gray">Manage your patient records and information</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
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

      {/* Patients Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Last Visit
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
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-apple-dark">{patient.name}</div>
                        <div className="text-sm text-apple-gray">ID: {patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{patient.email}</div>
                    <div className="text-sm text-apple-gray">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{patient.lastVisit}</div>
                    <div className="text-sm text-apple-gray">Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Patient"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Patient"
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">{patients.length}</h3>
          <p className="text-apple-gray">Total Patients</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">
            {patients.filter(p => p.status === 'active').length}
          </h3>
          <p className="text-apple-gray">Active Patients</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">
            {patients.filter(p => new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </h3>
          <p className="text-apple-gray">Recent Visits (30d)</p>
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-apple-dark mb-4">
              {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={selectedPatient?.name || ''}
                  className="input-field"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedPatient?.email || ''}
                  className="input-field"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={selectedPatient?.phone || ''}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Date of Birth</label>
                <input
                  type="date"
                  defaultValue={selectedPatient?.dateOfBirth || ''}
                  className="input-field"
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
                  {selectedPatient ? 'Update' : 'Add'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-apple-dark">Patient Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-apple-gray hover:text-apple-dark"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedPatient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-apple-dark">{selectedPatient.name}</h3>
                  <p className="text-apple-gray">Patient ID: {selectedPatient.id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedPatient.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">Last Visit: {selectedPatient.lastVisit}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium text-apple-dark mb-2">Recent Treatments</h4>
                <div className="space-y-2">
                  {selectedPatient.treatments.map((treatment, index) => (
                    <div key={index} className="bg-white/50 px-3 py-2 rounded-lg text-sm text-apple-dark">
                      {treatment}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
