'use client'

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-blue-900 text-white">
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Zendenta</h1>
              <p className="text-xs text-blue-300">Cabut gigi tanpa sakit</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li className="bg-blue-700 rounded-lg">
              <a href="#" className="flex items-center space-x-3 p-3 text-white">
                <div className="w-5 h-5 bg-white rounded-sm"></div>
                <span>Overview</span>
                <div className="ml-auto w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 text-blue-200 hover:text-white transition-colors">
                <div className="w-5 h-5 border border-blue-300 rounded"></div>
                <span>Calendar</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 text-blue-200 hover:text-white transition-colors">
                <div className="w-5 h-5 border border-blue-300 rounded-full"></div>
                <span>Patient List</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 text-blue-200 hover:text-white transition-colors">
                <div className="w-5 h-5 border border-blue-300 rounded-full"></div>
                <span>Messages</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 text-blue-200 hover:text-white transition-colors">
                <div className="w-5 h-5 border border-blue-300 rounded"></div>
                <span>Payment information</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 text-blue-200 hover:text-white transition-colors">
                <div className="w-5 h-5 border border-blue-300 rounded-full"></div>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 text-blue-200 hover:text-white transition-colors cursor-pointer">
              <div className="w-5 h-5 border border-blue-300 rounded-full flex items-center justify-center">
                <span className="text-xs">?</span>
              </div>
              <span>Help ?</span>
            </div>
            <div className="flex items-center space-x-3 p-2 text-blue-200 hover:text-white transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Drg. Adam H.</p>
                <p className="text-xs text-blue-300">Dentist</p>
              </div>
              <div className="w-4 h-4 border border-blue-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-gray-400 rounded"></div>
              </div>
              <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </button>
              <div className="relative">
                <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                  <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Greeting and Top Row Cards */}
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Good Morning, Dr Adam.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Approval Request Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Approval Request</h3>
                  <div className="w-5 h-5 border border-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">26</div>
                <p className="text-sm text-gray-500">Request Waiting To Approve</p>
              </div>

              {/* Upcoming Appointment Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Upcoming Appointment</h3>
                  <div className="w-5 h-5 border border-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">14</div>
                <p className="text-sm text-gray-500">Appointments Today</p>
              </div>

              {/* Clinic Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Clinic Information</h3>
                  <div className="w-5 h-5 border border-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-gray-400 rounded mt-1"></div>
                    <p className="text-sm text-gray-600">7898 Marsh Ln Undefined Richardson, Wisconsin 35697 United States</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-gray-400 rounded mt-1"></div>
                    <p className="text-sm text-gray-600">(205) 555-0100 • (262) 555-0131</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600">Dashboard with sidebar, header, and top cards working.</p>
        </div>
      </div>
    </div>
  )
}
