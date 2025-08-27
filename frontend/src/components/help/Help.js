import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageCircle, Phone, Mail, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  const toggleFaq = (faqId) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFaqs(newExpanded);
  };

  const tabs = [
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'faq', name: 'FAQ', icon: HelpCircle },
    { id: 'support', name: 'Support', icon: MessageCircle }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I add a new patient?',
      answer: 'Navigate to the Patients section and click the "Add Patient" button. Fill in the required information and click "Add Patient" to save.'
    },
    {
      id: 2,
      question: 'How do I schedule an appointment?',
      answer: 'Go to the Appointments section and click "Schedule Appointment". Select the patient, doctor, date, time, and treatment type, then save.'
    },
    {
      id: 3,
      question: 'How do I create a database backup?',
      answer: 'Click the database icon in the header or go to the Dashboard and use the backup button. You can also run the backup script manually.'
    },
    {
      id: 4,
      question: 'How do I export data to Excel?',
      answer: 'Click the download icon in the header or go to the Dashboard and use the export button. This will download all your data in Excel format.'
    },
    {
      id: 5,
      question: 'How do I change my password?',
      answer: 'Go to your profile settings and click on "Change Password". Enter your current password and new password to update.'
    },
    {
      id: 6,
      question: 'How do I manage treatment records?',
      answer: 'Navigate to the Treatments section to view, add, edit, or delete treatment records. You can also track treatment status and costs.'
    }
  ];

  const gettingStartedSteps = [
    {
      title: '1. Login to Your Account',
      description: 'Use your admin credentials (admin/admin123) to access the system.',
      icon: '🔐'
    },
    {
      title: '2. Explore the Dashboard',
      description: 'Get familiar with the overview, statistics, and quick actions available.',
      icon: '📊'
    },
    {
      title: '3. Add Your First Patient',
      description: 'Start by adding patient information in the Patients section.',
      icon: '👤'
    },
    {
      title: '4. Schedule Appointments',
      description: 'Create appointments for your patients in the Appointments section.',
      icon: '📅'
    },
    {
      title: '5. Record Treatments',
      description: 'Track dental treatments and procedures in the Treatments section.',
      icon: '🦷'
    },
    {
      title: '6. Manage Payments',
      description: 'Record income and expenses in the Payments section.',
      icon: '💰'
    },
    {
      title: '7. Configure Settings',
      description: 'Customize clinic information and system preferences.',
      icon: '⚙️'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Help & Support</h1>
        <p className="text-secondary-600 mt-1">Get help with using your dental clinic management system</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-soft border border-white/20 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-soft border border-white/20 p-6">
        {activeTab === 'getting-started' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Getting Started Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gettingStartedSteps.map((step, index) => (
                <div key={index} className="bg-secondary-50 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{step.icon}</div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-2">{step.title}</h3>
                      <p className="text-secondary-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
              <h3 className="font-semibold text-primary-900 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li>• Use the search and filter options to quickly find information</li>
                <li>• Click on any row in tables to view detailed information</li>
                <li>• Use the backup feature regularly to protect your data</li>
                <li>• Export data to Excel for external analysis and reporting</li>
                <li>• Customize your dashboard to show the most important metrics</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <HelpCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-secondary-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left bg-secondary-50 hover:bg-secondary-100 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span className="font-medium text-secondary-900">{faq.question}</span>
                    {expandedFaqs.has(faq.id) ? (
                      <ChevronDown className="w-5 h-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-secondary-500" />
                    )}
                  </button>
                  {expandedFaqs.has(faq.id) && (
                    <div className="px-6 py-4 bg-white border-t border-secondary-200">
                      <p className="text-secondary-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-secondary-50 rounded-xl p-6">
              <h3 className="font-semibold text-secondary-900 mb-3">Still Need Help?</h3>
              <p className="text-secondary-600 mb-4">
                If you couldn't find the answer to your question in our FAQ, please don't hesitate to contact our support team.
              </p>
              <button
                onClick={() => setActiveTab('support')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Contact Support</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-6 h-6 text-primary-600" />
                  <h3 className="font-semibold text-secondary-900">Phone Support</h3>
                </div>
                <p className="text-secondary-600 mb-3">Call us for immediate assistance:</p>
                <p className="text-lg font-medium text-secondary-900">+1 (555) 123-4567</p>
                <p className="text-sm text-secondary-500">Monday - Friday, 9:00 AM - 6:00 PM EST</p>
              </div>

              <div className="bg-secondary-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-primary-600" />
                  <h3 className="font-semibold text-secondary-900">Email Support</h3>
                </div>
                <p className="text-secondary-600 mb-3">Send us an email for detailed inquiries:</p>
                <p className="text-lg font-medium text-secondary-900">support@zendenta.com</p>
                <p className="text-sm text-secondary-500">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
              <h3 className="font-semibold text-primary-900 mb-3">Support Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <button className="text-primary-700 hover:text-primary-800 underline flex items-center bg-transparent border-none cursor-pointer">
                    User Manual
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                  <button className="text-primary-700 hover:text-primary-800 underline flex items-center bg-transparent border-none cursor-pointer">
                    Video Tutorials
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                  <button className="text-primary-700 hover:text-primary-800 underline flex items-center bg-transparent border-none cursor-pointer">
                    Community Forum
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                  <button className="text-primary-700 hover:text-primary-800 underline flex items-center bg-transparent border-none cursor-pointer">
                    Knowledge Base
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-secondary-200 rounded-xl p-6">
              <h3 className="font-semibold text-secondary-900 mb-3">Submit a Support Ticket</h3>
              <p className="text-secondary-600 mb-4">
                For complex issues or feature requests, please submit a support ticket with detailed information.
              </p>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200">
                Submit Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
