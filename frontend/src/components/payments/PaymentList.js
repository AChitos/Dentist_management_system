import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, User, DollarSign, Calendar, CreditCard, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    treatment_id: '',
    appointment_id: '',
    type: 'income',
    category: '',
    amount: '',
    description: '',
    payment_method: '',
    payment_status: 'pending',
    transaction_date: '',
    due_date: '',
    notes: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchPatients();
    fetchTreatments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/financial-records');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.financial_records || []);
      } else {
        toast.error('Failed to fetch payments');
      }
    } catch (error) {
      toast.error('Error fetching payments');
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

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments');
      if (response.ok) {
        const data = await response.json();
        setTreatments(data.treatments || []);
      }
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedPayment ? `/api/financial-records/${selectedPayment.id}` : '/api/financial-records';
      const method = selectedPayment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(selectedPayment ? 'Payment updated successfully' : 'Payment recorded successfully');
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPayment(null);
        resetForm();
        fetchPayments();
      } else {
        toast.error('Failed to save payment');
      }
    } catch (error) {
      toast.error('Error saving payment');
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      patient_id: payment.patient_id || '',
      treatment_id: payment.treatment_id || '',
      appointment_id: payment.appointment_id || '',
      type: payment.type,
      category: payment.category,
      amount: payment.amount,
      description: payment.description || '',
      payment_method: payment.payment_method || '',
      payment_status: payment.payment_status,
      transaction_date: payment.transaction_date,
      due_date: payment.due_date || '',
      notes: payment.notes || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        const response = await fetch(`/api/financial-records/${paymentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Payment record deleted successfully');
          fetchPayments();
        } else {
          toast.error('Failed to delete payment record');
        }
      } catch (error) {
        toast.error('Error deleting payment record');
      }
    }
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`/api/financial-records/${paymentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ payment_status: newStatus })
      });

      if (response.ok) {
        toast.success(`Payment status updated to ${newStatus}`);
        fetchPayments();
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      toast.error('Error updating payment status');
    }
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      treatment_id: '',
      appointment_id: '',
      type: 'income',
      category: '',
      amount: '',
      description: '',
      payment_method: '',
      payment_status: 'pending',
      transaction_date: '',
      due_date: '',
      notes: ''
    });
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.record_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || payment.type === filterType;
    const matchesStatus = filterStatus === 'all' || payment.payment_status === filterStatus;
    const matchesDate = !filterDate || payment.transaction_date === filterDate;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  const getTreatmentName = (treatmentId) => {
    const treatment = treatments.find(t => t.id === treatmentId);
    return treatment ? treatment.treatment_type : 'Unknown Treatment';
  };

  const getTotalIncome = () => {
    return payments
      .filter(p => p.type === 'income')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const getTotalExpenses = () => {
    return payments
      .filter(p => p.type === 'expense')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const getNetIncome = () => {
    return getTotalIncome() - getTotalExpenses();
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
          <h1 className="text-3xl font-bold text-secondary-900">Payment Management</h1>
          <p className="text-secondary-600 mt-1">Track income, expenses, and payment status</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-white/20">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${getTotalIncome().toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft border border-white/20">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${getTotalExpenses().toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft border border-white/20">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Net Income</p>
              <p className={`text-2xl font-bold ${getNetIncome() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${getNetIncome().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payments by ID, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-xl shadow-soft border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Patient & Treatment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Amount & Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Status & Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-secondary-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-secondary-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-secondary-900">
                        {payment.category}
                      </div>
                      <div className="text-sm text-secondary-500">ID: {payment.record_id}</div>
                      {payment.description && (
                        <div className="text-sm text-secondary-600 mt-1">{payment.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {payment.patient_id && (
                        <div className="flex items-center text-sm text-secondary-600">
                          <User className="w-4 h-4 mr-2" />
                          {getPatientName(payment.patient_id)}
                        </div>
                      )}
                      {payment.treatment_id && (
                        <div className="flex items-center text-sm text-secondary-600">
                          <Activity className="w-4 h-4 mr-2" />
                          {getTreatmentName(payment.treatment_id)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium text-secondary-900">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${payment.amount}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(payment.type)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                          {payment.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                        {payment.payment_status}
                      </span>
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(payment.transaction_date).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(payment)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(payment)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                        title="Edit Payment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete Payment"
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
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <CreditCard className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No payments found</h3>
            <p className="text-secondary-600">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterDate
                ? 'Try adjusting your search or filters'
                : 'Get started by recording your first payment'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Payment Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">
                {selectedPayment ? 'Edit Payment' : 'Record New Payment'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedPayment(null);
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
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Treatment, Consultation, Supplies"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Payment Status *
                  </label>
                  <select
                    required
                    value={formData.payment_status}
                    onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Patient
                  </label>
                  <select
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Patient (Optional)</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} - {patient.patient_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Treatment
                  </label>
                  <select
                    value={formData.treatment_id}
                    onChange={(e) => setFormData({...formData, treatment_id: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Treatment (Optional)</option>
                    {treatments.map(treatment => (
                      <option key={treatment.id} value={treatment.id}>
                        {treatment.treatment_type} - ${treatment.cost}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Transaction Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
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
                  placeholder="Payment description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="insurance">Insurance</option>
                </select>
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
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedPayment(null);
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
                  {selectedPayment ? 'Update Payment' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">Payment Details</h2>
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
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Record ID</label>
                  <p className="text-secondary-900">{selectedPayment.record_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Type</label>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedPayment.type)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedPayment.type)}`}>
                      {selectedPayment.type}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                  <p className="text-secondary-900">{selectedPayment.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Amount</label>
                  <p className="text-secondary-900">${selectedPayment.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.payment_status)}`}>
                    {selectedPayment.payment_status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Transaction Date</label>
                  <p className="text-secondary-900">
                    {new Date(selectedPayment.transaction_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedPayment.patient_id && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Patient</label>
                  <p className="text-secondary-900">{getPatientName(selectedPayment.patient_id)}</p>
                </div>
              )}

              {selectedPayment.treatment_id && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Treatment</label>
                  <p className="text-secondary-900">{getTreatmentName(selectedPayment.treatment_id)}</p>
                </div>
              )}

              {selectedPayment.due_date && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Due Date</label>
                  <p className="text-secondary-900">
                    {new Date(selectedPayment.due_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedPayment.description && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                  <p className="text-secondary-900">{selectedPayment.description}</p>
                </div>
              )}

              {selectedPayment.payment_method && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Payment Method</label>
                  <p className="text-secondary-900 capitalize">{selectedPayment.payment_method.replace('_', ' ')}</p>
                </div>
              )}

              {selectedPayment.notes && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Notes</label>
                  <p className="text-secondary-900">{selectedPayment.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-secondary-200">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedPayment);
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                  >
                    Edit Payment
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

export default PaymentList;
