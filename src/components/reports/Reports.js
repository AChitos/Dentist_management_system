'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('month')
  const [loading, setLoading] = useState(false)

  const reports = [
    {
      id: 'overview',
      title: 'Overview Report',
      description: 'Comprehensive summary of clinic performance',
      icon: BarChart3,
      type: 'summary'
    },
    {
      id: 'patients',
      title: 'Patient Analytics',
      description: 'Patient demographics and trends analysis',
      icon: Users,
      type: 'analytics'
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Revenue, expenses, and financial metrics',
      icon: DollarSign,
      type: 'financial'
    },
    {
      id: 'treatments',
      title: 'Treatment Analysis',
      description: 'Treatment statistics and performance metrics',
      icon: Activity,
      type: 'analytics'
    },
    {
      id: 'appointments',
      title: 'Appointment Report',
      description: 'Scheduling efficiency and appointment trends',
      icon: Calendar,
      type: 'analytics'
    }
  ]

  const dateRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const generateReport = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    alert('Report generated successfully!')
  }

  const downloadReport = (format) => {
    alert(`Downloading ${selectedReport} report in ${format} format...`)
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">1,247</h3>
          <p className="text-apple-gray">Total Patients</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">89</h3>
          <p className="text-apple-gray">Appointments Today</p>
          <p className="text-sm text-green-600 mt-1">+8% from yesterday</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">156</h3>
          <p className="text-apple-gray">Treatments This Month</p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-apple-dark mb-2">$45,230</h3>
          <p className="text-apple-gray">Monthly Revenue</p>
          <p className="text-sm text-green-600 mt-1">+18% from last month</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Revenue Trends</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-16 h-16 text-apple-gray mx-auto mb-2" />
              <p className="text-apple-gray">Revenue Chart</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Patient Demographics</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-apple-gray mx-auto mb-2" />
              <p className="text-apple-gray">Demographics Chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Monthly Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Metric</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Current Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Previous Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">New Patients</td>
                <td className="px-4 py-3 text-sm text-apple-dark">89</td>
                <td className="px-4 py-3 text-sm text-apple-gray">76</td>
                <td className="px-4 py-3 text-sm text-green-600">+17%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">Appointments</td>
                <td className="px-4 py-3 text-sm text-apple-dark">1,234</td>
                <td className="px-4 py-3 text-sm text-apple-gray">1,156</td>
                <td className="px-4 py-3 text-sm text-green-600">+7%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">Treatments</td>
                <td className="px-4 py-3 text-sm text-apple-dark">156</td>
                <td className="px-4 py-3 text-sm text-apple-gray">135</td>
                <td className="px-4 py-3 text-sm text-green-600">+16%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">Revenue</td>
                <td className="px-4 py-3 text-sm text-apple-dark">$45,230</td>
                <td className="px-4 py-3 text-sm text-apple-gray">$38,450</td>
                <td className="px-4 py-3 text-sm text-green-600">+18%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderPatientAnalytics = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Patient Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-apple-gray mx-auto mb-2" />
              <p className="text-apple-gray">Age Distribution Chart</p>
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-apple-gray mx-auto mb-2" />
              <p className="text-apple-gray">Gender Distribution Chart</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Patient Growth Trends</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LineChart className="w-16 h-16 text-apple-gray mx-auto mb-2" />
            <p className="text-apple-gray">Patient Growth Chart</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Revenue Analysis</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-apple-gray mx-auto mb-2" />
            <p className="text-apple-gray">Revenue Chart</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Top Revenue Sources</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Root Canal</span>
              <span className="text-sm font-medium text-apple-dark">$12,400</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Crown Fitting</span>
              <span className="text-sm font-medium text-apple-dark">$8,900</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Dental Cleaning</span>
              <span className="text-sm font-medium text-apple-dark">$6,200</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Insurance</span>
              <span className="text-sm font-medium text-apple-dark">45%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Credit Card</span>
              <span className="text-sm font-medium text-apple-dark">30%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Cash</span>
              <span className="text-sm font-medium text-apple-dark">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTreatmentAnalysis = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Treatment Performance</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-apple-gray mx-auto mb-2" />
            <p className="text-apple-gray">Treatment Performance Chart</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Treatment Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Treatment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">Dental Cleaning</td>
                <td className="px-4 py-3 text-sm text-apple-dark">45</td>
                <td className="px-4 py-3 text-sm text-apple-dark">$6,200</td>
                <td className="px-4 py-3 text-sm text-green-600">98%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">Root Canal</td>
                <td className="px-4 py-3 text-sm text-apple-dark">18</td>
                <td className="px-4 py-3 text-sm text-apple-dark">$12,400</td>
                <td className="px-4 py-3 text-sm text-green-600">95%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-apple-dark">Crown Fitting</td>
                <td className="px-4 py-3 text-sm text-apple-dark">22</td>
                <td className="px-4 py-3 text-sm text-apple-dark">$8,900</td>
                <td className="px-4 py-3 text-sm text-green-600">92%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAppointmentReport = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-dark mb-4">Appointment Trends</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LineChart className="w-16 h-16 text-apple-gray mx-auto mb-2" />
            <p className="text-apple-gray">Appointment Trends Chart</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Appointment Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Confirmed</span>
              <span className="text-sm font-medium text-apple-dark">78%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Pending</span>
              <span className="text-sm font-medium text-apple-dark">15%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">Cancelled</span>
              <span className="text-sm font-medium text-apple-dark">7%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-apple-dark mb-4">Peak Hours</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">9:00 AM - 11:00 AM</span>
              <span className="text-sm font-medium text-apple-dark">High</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">2:00 PM - 4:00 PM</span>
              <span className="text-sm font-medium text-apple-dark">Medium</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <span className="text-sm text-apple-dark">4:00 PM - 6:00 PM</span>
              <span className="text-sm font-medium text-apple-dark">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport()
      case 'patients':
        return renderPatientAnalytics()
      case 'financial':
        return renderFinancialReport()
      case 'treatments':
        return renderTreatmentAnalysis()
      case 'appointments':
        return renderAppointmentReport()
      default:
        return renderOverviewReport()
    }
  }

  return (
    <Layout activePage="reports">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-apple-dark">Reports & Analytics</h1>
          <p className="text-apple-gray">Generate comprehensive reports and analyze clinic performance</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={generateReport}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FileText size={20} />
            )}
            <span>{loading ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Types */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold text-apple-dark mb-4">Report Types</h3>
            <nav className="space-y-2">
              {reports.map((report) => {
                const Icon = report.icon
                const isActive = selectedReport === report.id
                
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-apple-blue text-white shadow-apple'
                        : 'text-apple-gray hover:bg-white/50 hover:text-apple-dark'
                    }`}
                  >
                    <Icon size={20} />
                    <div className="text-left">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-xs opacity-80">{report.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Date Range */}
          <div className="glass-card p-4 mt-6">
            <h3 className="text-lg font-semibold text-apple-dark mb-4">Date Range</h3>
            <div className="space-y-2">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    dateRange === range.value
                      ? 'bg-apple-blue text-white'
                      : 'text-apple-gray hover:bg-white/50 hover:text-apple-dark'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="glass-card p-4 mt-6">
            <h3 className="text-lg font-semibold text-apple-dark mb-4">Export Options</h3>
            <div className="space-y-2">
              <button
                onClick={() => downloadReport('PDF')}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-apple-gray hover:bg-white/50 hover:text-apple-dark transition-colors"
              >
                <Download size={16} />
                <span>PDF Report</span>
              </button>
              <button
                onClick={() => downloadReport('Excel')}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-apple-gray hover:bg-white/50 hover:text-apple-dark transition-colors"
              >
                <Download size={16} />
                <span>Excel Report</span>
              </button>
              <button
                onClick={() => downloadReport('CSV')}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-apple-gray hover:bg-white/50 hover:text-apple-dark transition-colors"
              >
                <Download size={16} />
                <span>CSV Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-apple-dark">
                {reports.find(r => r.id === selectedReport)?.title}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-apple-gray">
                  {dateRanges.find(r => r.value === dateRange)?.label}
                </span>
              </div>
            </div>
            
            {renderReportContent()}
          </div>
        </div>
      </div>
    </Layout>
  )
}
