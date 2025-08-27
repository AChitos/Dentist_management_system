import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, User, Activity, DollarSign, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TreatmentList = () => {
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatmentTypes, setTreatmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_id: '',
    treatment_type: '',
    description: '',
    cost: '',
    status: 'planned',
    start_date: '',
    end_date: '',
    notes: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchTreatments();
    fetchPatients();
    fetchDoctors();
    fetchTreatmentTypes();
  }, []);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/treatments');
      if (response.ok) {
        const data = await response.json();
        setTreatments(data.treatments || []);
      } else {
        toast.error('Failed to fetch treatments');
      }
    } catch (error) {
      toast.error('Error fetching treatments');
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

  const fetchTreatmentTypes = async () => {
    try {
      const response = await fetch('/api/treatment-types');
      if (response.ok) {
        const data = await response.json();
        setTreatmentTypes(data.treatment_types || []);
      }
    } catch (error) {
      console.error('Error fetching treatment types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedTreatment ? `/api/treatments/${selectedTreatment.id}` : '/api/treatments';
      const method = selectedTreatment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(selectedTreatment ? 'Treatment updated successfully' : 'Treatment created successfully');
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedTreatment(null);
        resetForm();
        fetchTreatments();
      } else {
        toast.error('Failed to save treatment');
      }
    } catch (error) {
      toast.error('Error saving treatment');
    }
  };

  const handleEdit = (treatment) => {
    setSelectedTreatment(treatment);
    setFormData({
      patient_id: treatment.patient_id,
      doctor_id: treatment.doctor_id,
      appointment_id: treatment.appointment_id || '',
      treatment_type: treatment.treatment_type,
      description: treatment.description || '',
      cost: treatment.cost,
      status: treatment.status,
      start_date: treatment.start_date || '',
      end_date: treatment.end_date || '',
      notes: treatment.notes || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (treatmentId) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        const response = await fetch(`/api/treatments/${treatmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Treatment deleted successfully');
          fetchTreatments();
        } else {
          toast.error('Failed to delete treatment');
        }
      } catch (error) {
        toast.error('Error deleting treatment');
      }
    }
  };

  const handleStatusChange = async (treatmentId, newStatus) => {
    try {
      const response = await fetch(`/api/treatments/${treatmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Treatment status updated to ${newStatus}`);
        fetchTreatments();
      } else {
        toast.error('Failed to update treatment status');
      }
    } catch (error) {
      toast.error('Error updating treatment status');
    }
  };

  const handleView = (treatment) => {
    setSelectedTreatment(treatment);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_id: '',
      treatment_type: '',
      description: '',
      cost: '',
      status: 'planned',
      start_date: '',
      end_date: '',
      notes: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planned': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Activity className="w-4 h-4" />;
      case 'completed': return <Activity className="w-4 h-4" />;
      case 'cancelled': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = 
      treatment.treatment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.treatment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || treatment.status === filterStatus;
    const matchesType = filterType === 'all' || treatment.treatment_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
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
          <h1 className="text-3xl font-bold text-secondary-900">Treatment Management</h1>
          <p className="text-secondary-600 mt-1">Track and manage dental treatments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Treatment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search treatments by ID, type, or description..."
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
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {treatmentTypes.map(type => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Treatment List */}
      <div className="bg-white rounded-xl shadow-soft border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Treatment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Patient & Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Cost & Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Dates</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredTreatments.map((treatment) => (
                <tr key={treatment.id} className="hover:bg-secondary-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-secondary-900">
                        {treatment.treatment_type}
                      </div>
                      <div className="text-sm text-secondary-500">ID: {treatment.treatment_id}</div>
                      {treatment.description && (
                        <div className="text-sm text-secondary-600 mt-1">{treatment.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-secondary-600">
                        <User className="w-4 h-4 mr-2" />
                        {getPatientName(treatment.patient_id)}
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <User className="w-4 h-4 mr-2" />
                        Dr. {getDoctorName(treatment.doctor_id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-secondary-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${treatment.cost}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(treatment.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(treatment.status)}`}>
                          {treatment.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {treatment.start_date && (
                        <div className="flex items-center text-sm text-secondary-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Start: {new Date(treatment.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {treatment.end_date && (
                        <div className="flex items-center text-sm text-secondary-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          End: {new Date(treatment.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(treatment)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(treatment)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        title="Edit Treatment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(treatment.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Treatment"
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
        
        {filteredTreatments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <Activity className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No treatments found</h3>
            <p className="text-secondary-600">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first treatment'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Treatment Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">
                {selectedTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedTreatment(null);
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
                    Treatment Type *
                  </label>
                  <select
                    required
                    value={formData.treatment_type}
                    onChange={(e) => setFormData({...formData, treatment_type: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Treatment Type</option>
                    {treatmentTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.name} - ${type.base_cost}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Cost *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Treatment description and details..."
                />
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
                  placeholder="Additional notes or instructions..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedTreatment(null);
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
                  {selectedTreatment ? 'Update Treatment' : 'Add Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Treatment Modal */}
      {showViewModal && selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">Treatment Details</h2>
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
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Treatment ID</label>
                  <p className="text-secondary-900">{selectedTreatment.treatment_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Type</label>
                  <p className="text-secondary-900">{selectedTreatment.treatment_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Patient</label>
                  <p className="text-secondary-900">{getPatientName(selectedTreatment.patient_id)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Doctor</label>
                  <p className="text-secondary-900">Dr. {getDoctorName(selectedTreatment.doctor_id)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Cost</label>
                  <p className="text-secondary-900">${selectedTreatment.cost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTreatment.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTreatment.status)}`}>
                      {selectedTreatment.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {selectedTreatment.start_date && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Start Date</label>
                  <p className="text-secondary-900">
                    {new Date(selectedTreatment.start_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedTreatment.end_date && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">End Date</label>
                  <p className="text-secondary-900">
                    {new Date(selectedTreatment.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedTreatment.description && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                  <p className="text-secondary-900">{selectedTreatment.description}</p>
                </div>
              )}

              {selectedTreatment.notes && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Notes</label>
                  <p className="text-secondary-900">{selectedTreatment.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-secondary-200">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedTreatment);
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                  >
                    Edit Treatment
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

export default TreatmentList;
