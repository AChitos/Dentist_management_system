'use client'

import { useState } from 'react'
import PatientManagement from './pages/PatientManagement'
import AppointmentManagement from './pages/AppointmentManagement'
import Messages from './pages/Messages'
import PaymentInformation from './pages/PaymentInformation'
import Settings from './pages/Settings'
import ApprovalRequests from './pages/ApprovalRequests'

export default function SimpleDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const [activeChartTab, setActiveChartTab] = useState('monthly')

  const handleNavigation = (section) => {
    setActiveSection(section)
  }

  const handleChartTabChange = (tab) => {
    setActiveChartTab(tab)
    console.log(`Chart view changed to: ${tab}`)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'patients':
        return <PatientManagement />
      case 'calendar':
        return <AppointmentManagement />
      case 'messages':
        return <Messages />
      case 'payments':
        return <PaymentInformation />
      case 'settings':
        return <Settings />
      case 'approvals':
        return <ApprovalRequests />
      case 'appointments':
        return <AppointmentManagement />
      case 'clinic-info':
        return <Settings />
      case 'treatments':
        return <PaymentInformation />
      case 'revenue':
        return <PaymentInformation />
      case 'todays-appointments':
        return <AppointmentManagement />
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Content - Greeting and Chart */}
        <div className="col-span-8 space-y-6">
          {/* Greeting Section with Dark Background */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">Good Morning, Dr Adam.</h2>
            
            {/* Chart Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">APPOINTMENT STATISTICS</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleChartTabChange('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeChartTab === 'monthly' 
                        ? 'bg-white text-slate-800' 
                        : 'bg-slate-600 text-white hover:bg-slate-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => handleChartTabChange('weekly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeChartTab === 'weekly' 
                        ? 'bg-white text-slate-800' 
                        : 'bg-slate-600 text-white hover:bg-slate-500'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => handleChartTabChange('30day')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeChartTab === '30day' 
                        ? 'bg-white text-slate-800' 
                        : 'bg-slate-600 text-white hover:bg-slate-500'
                    }`}
                  >
                    30 Day
                  </button>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="h-80 bg-slate-700 rounded-lg p-4 relative">
                <AppointmentChart activeTab={activeChartTab} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Cards */}
        <div className="col-span-4 space-y-6">
          {/* Approval Request Card */}
          <button 
            onClick={() => handleNavigation('approvals')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">APPROVAL REQUEST</h3>
              <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                More
              </button>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">26</div>
            <p className="text-sm text-gray-500">Request Waiting To Approve</p>
          </button>

          {/* Upcoming Appointment Card */}
          <button 
            onClick={() => handleNavigation('appointments')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">UPCOMING APPOINTMENT</h3>
              <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                More
              </button>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">14</div>
          </button>

          {/* Clinic Information Card */}
          <button 
            onClick={() => handleNavigation('clinic-info')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">CLINIC INFORMATION</h3>
              <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                More
              </button>
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
          </button>
        </div>

        {/* Bottom Row Cards */}
        <div className="col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Today's Appointments */}
            <button 
              onClick={() => handleNavigation('todays-appointments')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">TODAY'S APPOINTMENT (4)</h4>
                <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                  More
                </button>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold text-gray-800">Consultation</div>
                  <div className="text-sm text-gray-500">09:00-10:00</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold text-gray-800">Open Access</div>
                  <div className="text-sm text-gray-500">10:00-11:00</div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-gray-800">Scaling</div>
                  <div className="text-sm text-gray-500">13:00-14:00</div>
                </div>
              </div>
            </button>
            
            {/* Top Treatments */}
            <button 
              onClick={() => handleNavigation('treatments')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">TOP TREATMENT</h4>
                <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                  More
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">1. Consultation</div>
                <div className="text-sm text-gray-700">2. Scaling</div>
                <div className="text-sm text-gray-700">3. Root Canal</div>
                <div className="text-sm text-gray-700">4. Bleaching</div>
                <div className="text-sm text-gray-700">5. Wisdom Teeth Removal</div>
              </div>
            </button>
            
            {/* Total Patients */}
            <button 
              onClick={() => handleNavigation('patients')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">TOTAL PATIENTS THIS MONTH</h4>
                <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                  More
                </button>
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-2">10</div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">TOTAL PATIENTS ALL TIME</div>
              <div className="text-5xl font-bold text-gray-800">103</div>
            </button>
            
            {/* Revenue */}
            <button 
              onClick={() => handleNavigation('revenue')}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">JASPEL</h4>
                <button className="bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">
                  More
                </button>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">$23,000</div>
              <div className="text-sm text-gray-500 mb-4">This Month So Far</div>
              <div className="text-4xl font-bold text-gray-800">$35,000</div>
              <div className="text-sm text-gray-500">Previous Month</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Zendenta</h1>
              <p className="text-xs text-blue-300">Dental Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            <li className={`rounded-lg ${activeSection === 'overview' ? 'bg-blue-700' : ''}`}>
              <button 
                onClick={() => handleNavigation('overview')}
                className="w-full flex items-center space-x-3 p-3 text-left text-white hover:bg-blue-700 transition-colors"
              >
                <div className="w-5 h-5 bg-white rounded-sm"></div>
                <span>Overview</span>
                {activeSection === 'overview' && (
                  <div className="ml-auto w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                  </div>
                )}
              </button>
            </li>
            <li className={`rounded-lg ${activeSection === 'calendar' ? 'bg-blue-700' : ''}`}>
              <button 
                onClick={() => handleNavigation('calendar')}
                className="w-full flex items-center space-x-3 p-3 text-left text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
              >
                <div className="w-5 h-5 border border-blue-300 rounded"></div>
                <span>Calendar</span>
              </button>
            </li>
            <li className={`rounded-lg ${activeSection === 'patients' ? 'bg-blue-700' : ''}`}>
              <button 
                onClick={() => handleNavigation('patients')}
                className="w-full flex items-center space-x-3 p-3 text-left text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
              >
                <div className="w-5 h-5 border border-blue-300 rounded-full"></div>
                <span>Patient List</span>
              </button>
            </li>
            <li className={`rounded-lg ${activeSection === 'messages' ? 'bg-blue-700' : ''}`}>
              <button 
                onClick={() => handleNavigation('messages')}
                className="w-full flex items-center space-x-3 p-3 text-left text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
              >
                <div className="w-5 h-5 border border-blue-300 rounded-full"></div>
                <span>Messages</span>
              </button>
            </li>
            <li className={`rounded-lg ${activeSection === 'payments' ? 'bg-blue-700' : ''}`}>
              <button 
                onClick={() => handleNavigation('payments')}
                className="w-full flex items-center space-x-3 p-3 text-left text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
              >
                <div className="w-5 h-5 border border-blue-300 rounded"></div>
                <span>Payment Information</span>
              </button>
            </li>
            <li className={`rounded-lg ${activeSection === 'settings' ? 'bg-blue-700' : ''}`}>
              <button 
                onClick={() => handleNavigation('settings')}
                className="w-full flex items-center space-x-3 p-3 text-left text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
              >
                <div className="w-5 h-5 border border-blue-300 rounded-full"></div>
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-blue-800 bg-blue-900 mt-auto">
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-2 text-blue-200 hover:text-white transition-colors text-left">
              <div className="w-5 h-5 border border-blue-300 rounded-full flex items-center justify-center">
                <span className="text-xs">?</span>
              </div>
              <span>Help</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-2 text-blue-200 hover:text-white transition-colors text-left">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Dr. Adam H.</p>
                <p className="text-xs text-blue-300">Dentist</p>
              </div>
              <div className="w-4 h-4 border border-blue-300 rounded"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
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
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-400 rounded"></div>
              </div>
              <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </button>
              <div className="relative">
                <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  )
}
