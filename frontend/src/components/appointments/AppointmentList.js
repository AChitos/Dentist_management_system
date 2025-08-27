import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, User, Search, Edit, Trash2, Eye, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    duration: 60,
    type: '',
    notes: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      } else {
        toast.error('Failed to fetch appointments');
      }
    } catch (error) {
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/users?role=doctor');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedAppointment ? `/api/appointments/${selectedAppointment.id}` : '/api/appointments';
      const method = selectedAppointment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(selectedAppointment ? 'Appointment updated successfully' : 'Appointment scheduled successfully');
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedAppointment(null);
        resetForm();
        fetchAppointments();
      } else {
        toast.error('Failed to save appointment');
      }
    } catch (error) {
      toast.error('Error saving appointment');
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.appointment_date,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes
    });
    setShowEditModal(true);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Appointment deleted successfully');
          fetchAppointments();
        } else {
          toast.error('Failed to delete appointment');
        }
      } catch (error) {
        toast.error('Error deleting appointment');
      }
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Appointment status updated to ${newStatus}`);
        fetchAppointments();
      } else {
        toast.error('Failed to update appointment status');
      }
    } catch (error) {
      toast.error('Error updating appointment status');
    }
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      start_time: '',
      end_time: '',
      duration: 60,
      type: '',
      notes: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <ClockIcon className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <ClockIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'no-show': return <XCircle className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.appointment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = !filterDate || appointment.appointment_date === filterDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.full_name : 'Unknown Doctor';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Appointment Management</h1>
          <p className="text-secondary-600 mt-1">Schedule and manage patient appointments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments by ID or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-xl shadow-soft border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Appointment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Patient & Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-secondary-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-secondary-900">
                        {appointment.type}
                      </div>
                      <div className="text-sm text-secondary-500">ID: {appointment.appointment_id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-secondary-600">
                        <User className="w-4 h-4 mr-2" />
                        {getPatientName(appointment.patient_id)}
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <User className="w-4 h-4 mr-2" />
                        Dr. {getDoctorName(appointment.doctor_id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {appointment.start_time} - {appointment.end_time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(appointment)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        title="Edit Appointment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No appointments found</h3>
            <p className="text-secondary-600">
              {searchTerm || filterStatus !== 'all' || filterDate
                ? 'Try adjusting your search or filters'
                : 'Get started by scheduling your first appointment'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Appointment Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">
                {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedAppointment(null);
                  resetForm();
                }}
                className="text-secondary-400 hover:text-secondary-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Patient *
                  </label>
                  <select
                    required
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} - {patient.patient_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Doctor *
                  </label>
                  <select
                    required
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.full_name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <select
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any additional notes or instructions..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedAppointment(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-secondary-200 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                >
                  {selectedAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">Appointment Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Appointment ID</label>
                  <p className="text-secondary-900">{selectedAppointment.appointment_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Type</label>
                  <p className="text-secondary-900">{selectedAppointment.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Patient</label>
                  <p className="text-secondary-900">{getPatientName(selectedAppointment.patient_id)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Doctor</label>
                  <p className="text-secondary-900">Dr. {getDoctorName(selectedAppointment.doctor_id)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Date</label>
                  <p className="text-secondary-900">
                    {new Date(selectedAppointment.appointment_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Time</label>
                  <p className="text-secondary-900">
                    {selectedAppointment.start_time} - {selectedAppointment.end_time}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Duration</label>
                  <p className="text-secondary-900">{selectedAppointment.duration} minutes</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedAppointment.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Notes</label>
                  <p className="text-secondary-900">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-secondary-200">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedAppointment);
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                  >
                    Edit Appointment
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-3 border border-secondary-200 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
