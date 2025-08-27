'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CreditCard, 
  Calendar, 
  User,
  Activity,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function PaymentList() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      // Mock data for payments
      const mockPayments = [
        {
          id: 1,
          patient_name: 'John Smith',
          patient_id: 1,
          treatment: 'Dental Cleaning',
          amount: 150,
          payment_method: 'Credit Card',
          status: 'paid',
          date: '2025-08-20',
          invoice_number: 'INV-001',
          notes: 'Payment received for cleaning service'
        },
        {
          id: 2,
          patient_name: 'Sarah Johnson',
          patient_id: 2,
          treatment: 'Root Canal',
          amount: 800,
          payment_method: 'Insurance',
          status: 'pending',
          date: '2025-08-22',
          invoice_number: 'INV-002',
          notes: 'Insurance claim submitted'
        },
        {
          id: 3,
          patient_name: 'Mike Davis',
          patient_id: 3,
          treatment: 'Crown Fitting',
          amount: 1200,
          payment_method: 'Cash',
          status: 'paid',
          date: '2025-08-25',
          invoice_number: 'INV-003',
          notes: 'Full payment received'
        },
        {
          id: 4,
          patient_name: 'Emily Wilson',
          patient_id: 4,
          treatment: 'Tooth Extraction',
          amount: 300,
          payment_method: 'Debit Card',
          status: 'paid',
          date: '2025-08-18',
          invoice_number: 'INV-004',
          notes: 'Payment processed successfully'
        }
      ]
      setPayments(mockPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment =>
    payment.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'partial':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} />
      case 'pending':
        return <AlertCircle size={16} />
      case 'overdue':
        return <XCircle size={16} />
      case 'partial':
        return <AlertCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const handleAddPayment = () => {
    setShowAddModal(true)
  }

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment)
    setShowAddModal(true)
  }

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment)
    setShowViewModal(true)
  }

  const handleDeletePayment = (paymentId) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      setPayments(payments.filter(p => p.id !== paymentId))
    }
  }

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const paidCount = payments.filter(p => p.status === 'paid').length

  if (loading) {
    return (
      <Layout activePage="payments">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="payments">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-dark">Financial Management</h1>
          <p className="text-apple-gray">Track payments, invoices, and financial records</p>
        </div>
        <button
          onClick={handleAddPayment}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Payment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
            <input
              type="text"
              placeholder="Search payments by patient, treatment, or invoice..."
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
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">${totalRevenue.toLocaleString()}</h3>
          <p className="text-apple-gray">Total Revenue</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">${paidAmount.toLocaleString()}</h3>
          <p className="text-apple-gray">Paid Amount</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">${pendingAmount.toLocaleString()}</h3>
          <p className="text-apple-gray">Pending Amount</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">{paidCount}</h3>
          <p className="text-apple-gray">Paid Transactions</p>
        </div>
      </div>

      {/* Payments Table */}
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-apple-gray uppercase tracking-wider">
                  Date
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {payment.patient_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-apple-dark">{payment.patient_name}</div>
                        <div className="text-sm text-apple-gray">ID: {payment.patient_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{payment.treatment}</div>
                    <div className="text-sm text-apple-gray">{payment.invoice_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-apple-dark">${payment.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{payment.payment_method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-apple-dark">{payment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span>{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Payment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Payment"
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

      {/* Add/Edit Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-apple-dark mb-4">
              {selectedPayment ? 'Edit Payment' : 'Add New Payment'}
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
                <label className="block text-sm font-medium text-apple-dark mb-2">Treatment</label>
                <select className="input-field">
                  <option>Select Treatment</option>
                  <option>Dental Cleaning</option>
                  <option>Root Canal</option>
                  <option>Crown Fitting</option>
                  <option>Tooth Extraction</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Amount ($)</label>
                  <input
                    type="number"
                    defaultValue={selectedPayment?.amount || ''}
                    className="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Payment Method</label>
                  <select className="input-field">
                    <option>Select Method</option>
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Insurance</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Date</label>
                <input
                  type="date"
                  defaultValue={selectedPayment?.date || ''}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Status</label>
                <select className="input-field">
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Invoice Number</label>
                <input
                  type="text"
                  defaultValue={selectedPayment?.invoice_number || ''}
                  className="input-field"
                  placeholder="e.g., INV-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-dark mb-2">Notes</label>
                <textarea
                  defaultValue={selectedPayment?.notes || ''}
                  className="input-field"
                  rows="3"
                  placeholder="Add payment notes..."
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
                  {selectedPayment ? 'Update' : 'Add'} Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-apple-dark">Payment Details</h2>
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
                    {selectedPayment.patient_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-apple-dark">{selectedPayment.patient_name}</h3>
                  <p className="text-apple-gray">Patient ID: {selectedPayment.patient_id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedPayment.treatment}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">${selectedPayment.amount}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedPayment.payment_method}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-apple-gray" />
                  <span className="text-apple-dark">{selectedPayment.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-apple-gray">Invoice:</span>
                  <span className="text-apple-dark">{selectedPayment.invoice_number}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusIcon(selectedPayment.status)}
                    <span>{selectedPayment.status}</span>
                  </span>
                </div>
              </div>
              
              {selectedPayment.notes && (
                <div className="pt-4">
                  <h4 className="font-medium text-apple-dark mb-2">Notes</h4>
                  <div className="bg-white/50 px-3 py-2 rounded-lg text-sm text-apple-dark">
                    {selectedPayment.notes}
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
