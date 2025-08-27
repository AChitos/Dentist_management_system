'use client'

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Here's what's happening at your dental clinic today.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">1,247</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-800">18</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-800">$45,230</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Treatments</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white/70 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Add New Patient</h3>
                <p className="text-sm text-gray-600">Register a new patient</p>
              </div>
            </div>
          </button>

          <button className="bg-white/70 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Schedule Appointment</h3>
                <p className="text-sm text-gray-600">Book a new appointment</p>
              </div>
            </div>
          </button>

          <button className="bg-white/70 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">View Reports</h3>
                <p className="text-sm text-gray-600">Generate clinic reports</p>
              </div>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button className="bg-red-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
