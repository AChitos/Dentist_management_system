import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  Calendar,
  User,
  FileText,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    appointments: number;
    treatments: number;
    medicalRecords: number;
    billing: number;
  };
}

interface PatientsResponse {
  patients: Patient[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [filters, setFilters] = useState({
    gender: '',
    isActive: '',
    hasInsurance: '',
  });

  const queryClient = useQueryClient();

  // Fetch patients
  const { data, isLoading, error } = useQuery<PatientsResponse>({
    queryKey: ['patients', currentPage, searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchQuery && { q: searchQuery }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.isActive && { isActive: filters.isActive }),
      });

      const response = await fetch(`/api/patients?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      return response.json();
    },
  });

  // Delete patient mutation
  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Patient deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete patient');
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (patientToDelete) {
      deletePatientMutation.mutate(patientToDelete.id);
    }
  };

  const openPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading patients</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Patients
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage patient records and information
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Patient
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search patients by name, ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-secondary">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
              </div>
              
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </form>
        </div>

        {/* Patients List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Insurance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data?.patients.map((patient) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {patient.patientId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')} • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center mb-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {patient.phone}
                        </div>
                        {patient.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {patient.insuranceProvider ? (
                          <>
                            <div className="font-medium">{patient.insuranceProvider}</div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {patient.insuranceNumber}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No insurance</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {patient._count.appointments}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Activity className="w-4 h-4 mr-1" />
                          {patient._count.treatments}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FileText className="w-4 h-4 mr-1" />
                          {patient._count.medicalRecords}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {patient.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openPatientDetails(patient)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!data.pagination.hasPrevPage}
                  className="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!data.pagination.hasNextPage}
                  className="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {((currentPage - 1) * 20) + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 20, data.pagination.totalCount)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{data.pagination.totalCount}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!data.pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(data.pagination.totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!data.pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Patient Details Modal */}
        {isModalOpen && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Patient Details
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Full Name
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Patient ID
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.patientId}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Date of Birth
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {format(new Date(selectedPatient.dateOfBirth), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Gender
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.gender}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.phone}
                        </p>
                      </div>
                      {selectedPatient.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {selectedPatient.email}
                          </p>
                        </div>
                      )}
                      {selectedPatient.address && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Address
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {selectedPatient.address}
                            {selectedPatient.city && `, ${selectedPatient.city}`}
                            {selectedPatient.state && `, ${selectedPatient.state}`}
                            {selectedPatient.zipCode && ` ${selectedPatient.zipCode}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Medical Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Insurance Provider
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.insuranceProvider || 'No insurance'}
                        </p>
                        {selectedPatient.insuranceNumber && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedPatient.insuranceNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Medical History
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.medicalHistory || 'No medical history recorded'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Allergies
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.allergies || 'No known allergies'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Current Medications
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPatient.medications || 'No current medications'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Records Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {selectedPatient._count.appointments}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Appointments
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedPatient._count.treatments}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Treatments
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedPatient._count.medicalRecords}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Medical Records
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {selectedPatient._count.billing}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Billing Records
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                  <button className="btn btn-primary">
                    Edit Patient
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && patientToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Delete Patient
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete {patientToDelete.firstName} {patientToDelete.lastName}? 
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deletePatientMutation.isPending}
                    className="btn btn-danger"
                  >
                    {deletePatientMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Patients;
