import React, { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, User, Building, Bell, Shield, Database, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('clinic');
  const [loading, setLoading] = useState(false);
  const [clinicSettings, setClinicSettings] = useState({
    clinic_name: '',
    clinic_tagline: '',
    clinic_address: '',
    clinic_phone_1: '',
    clinic_phone_2: '',
    working_hours: '',
    appointment_duration: ''
  });
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    email_alerts: true,
    theme: 'light',
    language: 'en'
  });
  const [systemSettings, setSystemSettings] = useState({
    auto_backup: true,
    backup_frequency: 'daily',
    data_retention: '365',
    encryption_enabled: true
  });

  useEffect(() => {
    fetchClinicSettings();
  }, []);

  const fetchClinicSettings = async () => {
    try {
      const response = await fetch('/api/clinic-settings');
      if (response.ok) {
        const data = await response.json();
        const settings = {};
        data.settings.forEach(setting => {
          settings[setting.setting_key] = setting.setting_value;
        });
        setClinicSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error fetching clinic settings:', error);
    }
  };

  const handleClinicSettingsSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clinic-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings: clinicSettings })
      });

      if (response.ok) {
        toast.success('Clinic settings updated successfully');
      } else {
        toast.error('Failed to update clinic settings');
      }
    } catch (error) {
      toast.error('Error updating clinic settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSettingsSave = async () => {
    try {
      setLoading(true);
      // Save user preferences to localStorage or backend
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      toast.success('User preferences saved successfully');
    } catch (error) {
      toast.error('Error saving user preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsSave = async () => {
    try {
      setLoading(true);
      // Save system settings to backend
      const response = await fetch('/api/system-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(systemSettings)
      });

      if (response.ok) {
        toast.success('System settings updated successfully');
      } else {
        toast.error('Failed to update system settings');
      }
    } catch (error) {
      toast.error('Error updating system settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'clinic', name: 'Clinic Settings', icon: Building },
    { id: 'user', name: 'User Preferences', icon: User },
    { id: 'system', name: 'System Settings', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'backup', name: 'Backup & Data', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600 mt-1">Configure your clinic management system</p>
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
        {activeTab === 'clinic' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Building className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Clinic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  value={clinicSettings.clinic_name}
                  onChange={(e) => setClinicSettings({...clinicSettings, clinic_name: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Clinic Tagline
                </label>
                <input
                  type="text"
                  value={clinicSettings.clinic_tagline}
                  onChange={(e) => setClinicSettings({...clinicSettings, clinic_tagline: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Clinic Address
                </label>
                <textarea
                  value={clinicSettings.clinic_address}
                  onChange={(e) => setClinicSettings({...clinicSettings, clinic_address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={clinicSettings.clinic_phone_1}
                  onChange={(e) => setClinicSettings({...clinicSettings, clinic_phone_1: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Secondary Phone
                </label>
                <input
                  type="tel"
                  value={clinicSettings.clinic_phone_2}
                  onChange={(e) => setClinicSettings({...clinicSettings, clinic_phone_2: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={clinicSettings.working_hours}
                  onChange={(e) => setClinicSettings({...clinicSettings, working_hours: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 09:00-17:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Default Appointment Duration (minutes)
                </label>
                <input
                  type="number"
                  value={clinicSettings.appointment_duration}
                  onChange={(e) => setClinicSettings({...clinicSettings, appointment_duration: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-secondary-200">
              <button
                onClick={handleClinicSettingsSave}
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'user' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">User Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Theme
                </label>
                <select
                  value={userSettings.theme}
                  onChange={(e) => setUserSettings({...userSettings, theme: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Language
                </label>
                <select
                  value={userSettings.language}
                  onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="id">Bahasa Indonesia</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Push Notifications</h3>
                  <p className="text-sm text-secondary-600">Receive notifications for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.notifications}
                    onChange={(e) => setUserSettings({...userSettings, notifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Email Alerts</h3>
                  <p className="text-sm text-secondary-600">Receive email notifications for appointments and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.email_alerts}
                    onChange={(e) => setUserSettings({...userSettings, email_alerts: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-secondary-200">
              <button
                onClick={handleUserSettingsSave}
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <SettingsIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">System Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={systemSettings.backup_frequency}
                  onChange={(e) => setSystemSettings({...systemSettings, backup_frequency: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Data Retention (days)
                </label>
                <input
                  type="number"
                  value={systemSettings.data_retention}
                  onChange={(e) => setSystemSettings({...systemSettings, data_retention: e.target.value})}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="365"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Automatic Backups</h3>
                  <p className="text-sm text-secondary-600">Automatically backup database at scheduled intervals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.auto_backup}
                    onChange={(e) => setSystemSettings({...systemSettings, auto_backup: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900">Data Encryption</h3>
                  <p className="text-sm text-secondary-600">Encrypt sensitive data in the database</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.encryption_enabled}
                    onChange={(e) => setSystemSettings({...systemSettings, encryption_enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-secondary-200">
              <button
                onClick={handleSystemSettingsSave}
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save System Settings'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Notification Settings</h2>
            </div>
            
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Notification Preferences</h3>
              <p className="text-secondary-600">Configure how you receive notifications and alerts</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Security Settings</h2>
            </div>
            
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Security Configuration</h3>
              <p className="text-secondary-600">Manage security settings and access controls</p>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Backup & Data Management</h2>
            </div>
            
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Data Management</h3>
              <p className="text-secondary-600">Configure backup schedules and data retention policies</p>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Appearance & Theme</h2>
            </div>
            
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Visual Customization</h3>
              <p className="text-secondary-600">Customize the look and feel of your application</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
