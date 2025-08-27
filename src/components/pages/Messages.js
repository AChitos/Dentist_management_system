'use client'

import { useState } from 'react'

export default function Messages() {
  const [messages] = useState([
    {
      id: 1,
      from: 'Dr. Sarah Johnson',
      subject: 'Patient follow-up required',
      message: 'Please schedule a follow-up appointment for patient John Smith after his root canal treatment.',
      timestamp: '2024-01-15 10:30 AM',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      from: 'Reception Desk',
      subject: 'New patient registration',
      message: 'A new patient, Mary Davis, has registered for an appointment. Please review her medical history.',
      timestamp: '2024-01-15 09:15 AM',
      read: true,
      priority: 'normal'
    },
    {
      id: 3,
      from: 'System',
      subject: 'Database backup completed',
      message: 'Daily database backup has been completed successfully. All patient data is secure.',
      timestamp: '2024-01-15 08:00 AM',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      from: 'Dr. Michael Chen',
      subject: 'Equipment maintenance reminder',
      message: 'The dental X-ray machine is due for maintenance next week. Please schedule accordingly.',
      timestamp: '2024-01-14 04:45 PM',
      read: false,
      priority: 'normal'
    }
  ])

  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showCompose, setShowCompose] = useState(false)
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    message: ''
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    console.log('Sending message:', composeData)
    setComposeData({ to: '', subject: '', message: '' })
    setShowCompose(false)
    alert('Message sent successfully!')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Compose Message
        </button>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold mb-4">Compose New Message</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <input
                type="text"
                placeholder="To (email or username)"
                value={composeData.to}
                onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={composeData.subject}
                onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <textarea
                placeholder="Message"
                value={composeData.message}
                onChange={(e) => setComposeData({...composeData, message: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                required
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">Inbox ({messages.filter(m => !m.read).length} unread)</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  } ${!message.read ? 'font-medium' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-gray-900 truncate flex-1">
                      {message.from}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1 truncate">
                    {message.subject}
                  </div>
                  <div className="text-xs text-gray-500">
                    {message.timestamp}
                  </div>
                  {!message.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            {selectedMessage ? (
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedMessage.subject}
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority} priority
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">From:</span> {selectedMessage.from}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {selectedMessage.timestamp}
                  </div>
                </div>
                <div className="text-gray-800 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
                <div className="mt-6 pt-4 border-t flex space-x-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Reply
                  </button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                    Forward
                  </button>
                  <button className="text-red-600 hover:text-red-800 px-4 py-2">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gray-400 rounded"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">No message selected</h3>
                <p>Select a message from the inbox to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
