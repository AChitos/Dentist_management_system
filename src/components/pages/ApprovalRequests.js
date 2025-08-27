'use client'

import { useState } from 'react'

export default function ApprovalRequests() {
  const [requests] = useState([
    {
      id: 1,
      type: 'Treatment Plan',
      patient: 'John Smith',
      description: 'Root canal treatment plan for upper molar',
      estimatedCost: 800,
      submittedBy: 'Dr. Sarah Johnson',
      submittedDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      notes: 'Patient experiencing severe pain, urgent treatment required'
    },
    {
      id: 2,
      type: 'Insurance Claim',
      patient: 'Mary Davis',
      description: 'Dental cleaning and fluoride treatment claim',
      estimatedCost: 150,
      submittedBy: 'Reception Desk',
      submittedDate: '2024-01-14',
      status: 'pending',
      priority: 'normal',
      notes: 'Standard cleaning procedure, no complications'
    },
    {
      id: 3,
      type: 'Equipment Purchase',
      patient: 'N/A',
      description: 'New digital X-ray machine purchase request',
      estimatedCost: 25000,
      submittedBy: 'Dr. Michael Chen',
      submittedDate: '2024-01-12',
      status: 'pending',
      priority: 'low',
      notes: 'Current machine is 8 years old and needs frequent repairs'
    },
    {
      id: 4,
      type: 'Leave Request',
      patient: 'N/A',
      description: 'Vacation leave request for next month',
      estimatedCost: 0,
      submittedBy: 'Dental Assistant',
      submittedDate: '2024-01-10',
      status: 'approved',
      priority: 'normal',
      notes: 'Two weeks vacation time, coverage arranged'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const handleApprove = (id) => {
    if (confirm('Are you sure you want to approve this request?')) {
      console.log('Approving request:', id)
      alert('Request approved successfully!')
    }
  }

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      console.log('Rejecting request:', id, 'Reason:', reason)
      alert('Request rejected successfully!')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Approval Requests 
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{requests.filter(r => r.status === 'rejected').length}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex space-x-4">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient/Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{request.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{request.patient}</div>
                    <div className="text-sm text-gray-500">{request.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.estimatedCost > 0 ? (
                      <span className="font-medium text-green-600">
                        ${request.estimatedCost.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {request.submittedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(request.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No requests found for the selected filter
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="text-gray-900">{selectedRequest.type}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <div className="text-gray-900">{selectedRequest.patient}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="text-gray-900">{selectedRequest.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <div className="text-gray-900">
                    {selectedRequest.estimatedCost > 0 ? `$${selectedRequest.estimatedCost.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                  <div className="text-gray-900">{selectedRequest.submittedBy}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                  <div className="text-gray-900">{new Date(selectedRequest.submittedDate).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.notes}
                </div>
              </div>
              
              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id)
                      setSelectedRequest(null)
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id)
                      setSelectedRequest(null)
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
