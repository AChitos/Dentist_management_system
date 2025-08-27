'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  User, 
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      // Mock data for appointments
      const mockAppointments = [
        {
          id: 1,
          patient_name: 'John Smith',
          patient_id: 1,
          date: '2025-08-27',
          time: '09:00',
          duration: 60,
          treatment: 'Dental Cleaning',
          status: 'confirmed',
          notes: 'Regular cleaning appointment'
        },
        {
          id: 2,
          patient_name: 'Sarah Johnson',
          patient_id: 2,
          date: '2025-08-27',
          time: '10:30',
          duration: 90,
          treatment: 'Root Canal',
          status: 'confirmed',
          notes: 'Follow-up root canal treatment'
        },
        {
          id: 3,
          patient_name: 'Mike Davis',
          patient_id: 3,
          date: '2025-08-27',
          time: '14:00',
          duration: 45,
          treatment: 'Crown Fitting',
          status: 'pending',
          notes: 'Crown fitting appointment'
        },
        {
          id: 4,
          patient_name: 'Emily Wilson',
          patient_id: 4,
          date: '2025-08-28',
          time: '11:00',
          duration: 30,
          treatment: 'Consultation',
          status: 'confirmed',
          notes: 'Initial consultation'
        }
      ]
      setAppointments(mockAppointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.date.includes(searchQuery)
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />
      case 'pending':
        return <AlertCircle size={16} />
      case 'cancelled':
        return <XCircle size={16} />
      case 'completed':
        return <CheckCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const handleAddAppointment = () => {
    setShowAddModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAddModal(true)
  }

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowViewModal(true)
  }

  const handleDeleteAppointment = (appointmentId) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== appointmentId))
    }
  }

  const todayAppointments = appointments.filter(a => a.date === selectedDate)
  const upcomingAppointments = appointments.filter(a => new Date(a.date) > new Date(selectedDate))

  if (loading) {
    return (
      <Layout activePage="appointments">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="appointments">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-dark">Appointment Scheduling</h1>
          <p className="text-apple-gray">Manage your clinic's appointment calendar</p>
        </div>
        <button
          onClick={handleAddAppointment}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Date Selector and Search */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-apple-dark">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field w-auto"
            />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
            <input
              type="text"
              placeholder="Search appointments..."
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

      {/* Today's Schedule */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-apple-dark mb-4">Today's Schedule ({selectedDate})</h2>
        {todayAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="glass-card p-4 hover:shadow-apple-hover transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {appointment.patient_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-apple-dark">{appointment.patient_name}</h3>
                      <p className="text-sm text-apple-gray">{appointment.treatment}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span>{appointment.status}</span>
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-apple-gray">
                    <Clock size={14} />
                    <span>{appointment.time} ({appointment.duration} min)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-apple-gray">
                    <Activity size={14} />
                    <span>{appointment.treatment}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewAppointment(appointment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEditAppointment(appointment)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Appointment"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Appointment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Calendar className="w-12 h-12 text-apple-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-dark mb-2">No Appointments Today</h3>
            <p className="text-apple-gray">Schedule some appointments to get started</p>
          </div>
        )}
      </div>

      {/* All Appointments Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/20">
          <h2 className="text-lg font-semibold text-apple-dark">All Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Duration
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {appointment.patient_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-apple-dark">{appointment.patient_name}</div>
                        <div className="text-sm text-apple-gray">ID: {appointment.patient_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{appointment.date}</div>
                    <div className="text-sm text-apple-gray">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{appointment.treatment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{appointment.duration} min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span>{appointment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Appointment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Appointment"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">{appointments.length}</h3>
          <p className="text-apple-gray">Total Appointments</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">
            {appointments.filter(a => a.status === 'confirmed').length}
          </h3>
          <p className="text-apple-gray">Confirmed</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">
            {appointments.filter(a => a.status === 'pending').length}
          </h3>
          <p className="text-apple-gray">Pending</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">
            {todayAppointments.length}
          </h3>
          <p className="text-apple-gray">Today</p>
        </div>
      </div>

      {/* Add/Edit Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-apple-dark mb-4">
              {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Date</label>
                  <input
                    type="date"
                    defaultValue={selectedAppointment?.date || ''}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Time</label>
                  <input
                    type="time"
                    defaultValue={selectedAppointment?.time || ''}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Treatment</label>
                <select className="input-field">
                  <option>Select Treatment</option>
                  <option>Dental Cleaning</option>
                  <option>Root Canal</option>
                  <option>Crown Fitting</option>
                  <option>Consultation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  defaultValue={selectedAppointment?.duration || 30}
                  className="input-field"
                  min="15"
                  step="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Notes</label>
                <textarea
                  defaultValue={selectedAppointment?.notes || ''}
                  className="input-field"
                  rows="3"
                  placeholder="Add appointment notes..."
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
                  {selectedAppointment ? 'Update' : 'Schedule'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-apple-dark">Appointment Details</h2>
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
                    {selectedAppointment.patient_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-apple-dark">{selectedAppointment.patient_name}</h3>
                  <p className="text-apple-gray">ID: {selectedAppointment.patient_id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedAppointment.time} ({selectedAppointment.duration} min)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedAppointment.treatment}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span>{selectedAppointment.status}</span>
                  </span>
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div className="pt-4">
                  <h4 className="font-medium text-apple-dark mb-2">Notes</h4>
                  <div className="bg-white/50 px-3 py-2 rounded-lg text-sm text-apple-dark">
                    {selectedAppointment.notes}
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
