'use client'

import { useState } from 'react'
import Layout from '../layout/Layout'
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video,
  ChevronDown,
  ChevronRight,
  Activity
} from 'lucide-react'

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [expandedItems, setExpandedItems] = useState(new Set(['getting-started']))

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      items: [
        {
          id: 'first-login',
          title: 'First Time Login',
          content: 'Learn how to log in for the first time and set up your account. Use the default credentials: Username: admin, Password: admin123'
        },
        {
          id: 'dashboard-overview',
          title: 'Dashboard Overview',
          content: 'Understand the main dashboard, statistics cards, charts, and quick actions available to manage your clinic.'
        },
        {
          id: 'navigation',
          title: 'Navigation & Layout',
          content: 'Learn how to use the sidebar navigation, header, and responsive layout to navigate between different sections.'
        }
      ]
    },
    {
      id: 'patient-management',
      title: 'Patient Management',
      icon: Activity,
      items: [
        {
          id: 'add-patient',
          title: 'Adding New Patients',
          content: 'Step-by-step guide to add new patients, including personal information, contact details, and medical history.'
        },
        {
          id: 'edit-patient',
          title: 'Editing Patient Records',
          content: 'How to update patient information, modify contact details, and manage patient status.'
        },
        {
          id: 'patient-search',
          title: 'Searching Patients',
          content: 'Use the search functionality to quickly find patients by name, email, or phone number.'
        }
      ]
    },
    {
      id: 'appointments',
      title: 'Appointment Scheduling',
      icon: Activity,
      items: [
        {
          id: 'schedule-appointment',
          title: 'Scheduling Appointments',
          content: 'Create new appointments, select patients, choose treatments, and set duration and time slots.'
        },
        {
          id: 'manage-appointments',
          title: 'Managing Appointments',
          content: 'Edit appointment details, change status, reschedule, and handle cancellations.'
        },
        {
          id: 'appointment-calendar',
          title: 'Calendar View',
          content: 'Navigate the appointment calendar, view daily schedules, and manage time slots effectively.'
        }
      ]
    },
    {
      id: 'treatments',
      title: 'Treatment Management',
      icon: Activity,
      items: [
        {
          id: 'add-treatment',
          title: 'Recording Treatments',
          content: 'Document patient treatments, procedures performed, costs, and treatment notes.'
        },
        {
          id: 'treatment-status',
          title: 'Treatment Status',
          content: 'Update treatment progress, mark treatments as completed, and track ongoing procedures.'
        },
        {
          id: 'treatment-history',
          title: 'Treatment History',
          content: 'View complete treatment history for each patient and generate treatment reports.'
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Management',
      icon: Activity,
      items: [
        {
          id: 'payment-tracking',
          title: 'Payment Tracking',
          content: 'Record patient payments, track payment methods, and manage outstanding balances.'
        },
        {
          id: 'invoicing',
          title: 'Invoicing System',
          content: 'Generate invoices for treatments, manage payment terms, and track financial records.'
        },
        {
          id: 'revenue-reports',
          title: 'Revenue Reports',
          content: 'View financial analytics, revenue trends, and generate financial reports for your clinic.'
        }
      ]
    },
    {
      id: 'backup-export',
      title: 'Backup & Export',
      icon: Activity,
      items: [
        {
          id: 'database-backup',
          title: 'Database Backup',
          content: 'Create one-click backups of your clinic data for security and disaster recovery.'
        },
        {
          id: 'excel-export',
          title: 'Excel Export',
          content: 'Export patient data, appointments, treatments, and financial records to Excel format.'
        },
        {
          id: 'data-restore',
          title: 'Data Restoration',
          content: 'Restore your clinic data from backup files when needed.'
        }
      ]
    }
  ]

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.items.some(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      value: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      value: 'support@zendenta.com',
      action: 'Send Email'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 9 AM - 6 PM',
      action: 'Start Chat'
    }
  ]

  const quickActions = [
    {
      title: 'User Manual',
      description: 'Complete system documentation',
      icon: FileText,
      action: 'Download PDF'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      action: 'Watch Videos'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions',
      icon: HelpCircle,
      action: 'View FAQ'
    }
  ]

  return (
    <Layout activePage="help">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-apple-dark">Help & Support</h1>
        <p className="text-apple-gray">Find answers to your questions and get help with the system</p>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray" size={20} />
          <input
            type="text"
            placeholder="Search for help topics, guides, or troubleshooting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Help Categories */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-apple-dark mb-6">Help Topics</h2>
            
            {filteredCategories.length > 0 ? (
              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const Icon = category.icon
                  const isExpanded = expandedItems.has(category.id)
                  
                  return (
                    <div key={category.id} className="border border-white/20 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleExpanded(category.id)}
                        className="w-full flex items-center justify-between p-4 bg-white/50 hover:bg-white/70 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-apple-blue" />
                          <span className="font-medium text-apple-dark">{category.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-apple-gray" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-apple-gray" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 bg-white/30">
                          <div className="space-y-4">
                            {category.items.map((item) => (
                              <div key={item.id} className="border-l-4 border-apple-blue/20 pl-4">
                                <h4 className="font-medium text-apple-dark mb-2">{item.title}</h4>
                                <p className="text-sm text-apple-gray leading-relaxed">{item.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="w-16 h-16 text-apple-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-apple-dark mb-2">No results found</h3>
                <p className="text-apple-gray">Try searching with different keywords or browse the categories below.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-apple-dark mb-4">Contact Support</h3>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon
                return (
                  <div key={index} className="p-4 bg-white/50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-apple-dark">{contact.title}</h4>
                        <p className="text-sm text-apple-gray mb-2">{contact.description}</p>
                        <p className="text-sm font-medium text-apple-dark mb-3">{contact.value}</p>
                        <button className="text-sm text-apple-blue hover:text-apple-dark font-medium transition-colors">
                          {contact.action}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-apple-dark mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    className="w-full p-3 bg-white/50 hover:bg-white/70 rounded-xl text-left transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-apple-blue" />
                      <div>
                        <h4 className="font-medium text-apple-dark text-sm">{action.title}</h4>
                        <p className="text-xs text-apple-gray">{action.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-xs text-apple-blue font-medium">{action.action}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-apple-dark mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-apple-gray">Database</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-apple-gray">API Services</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-apple-gray">Backup System</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Help Resources */}
      <div className="mt-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-apple-dark mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white/50 rounded-xl">
              <h4 className="font-medium text-apple-dark mb-2">Getting Started Guide</h4>
              <p className="text-sm text-apple-gray mb-3">Complete beginner's guide to setting up and using the system</p>
              <button className="text-sm text-apple-blue hover:text-apple-dark font-medium">Read Guide →</button>
            </div>
            
            <div className="p-4 bg-white/50 rounded-xl">
              <h4 className="font-medium text-apple-dark mb-2">Video Tutorials</h4>
              <p className="text-sm text-apple-gray mb-3">Step-by-step video guides for all major features</p>
              <button className="text-sm text-apple-blue hover:text-apple-dark font-medium">Watch Videos →</button>
            </div>
            
            <div className="p-4 bg-white/50 rounded-xl">
              <h4 className="font-medium text-apple-dark mb-2">API Documentation</h4>
              <p className="text-sm text-apple-gray mb-3">Technical documentation for developers and integrations</p>
              <button className="text-sm text-apple-blue hover:text-apple-dark font-medium">View Docs →</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
