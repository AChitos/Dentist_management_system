'use client'

import { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  FileText, 
  HardDrive,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

export default function Backup() {
  const [backups, setBackups] = useState([])
  const [exports, setExports] = useState([])
  const [loading, setLoading] = useState(false)
  const [creatingBackup, setCreatingBackup] = useState(false)
  const [creatingExport, setCreatingExport] = useState(false)

  useEffect(() => {
    fetchBackups()
    fetchExports()
  }, [])

  const fetchBackups = async () => {
    try {
      // Mock data for backups
      const mockBackups = [
        {
          id: 1,
          filename: 'zendenta_backup_2025_08_27_143022.zip',
          size: '2.4 MB',
          date: '2025-08-27 14:30:22',
          status: 'completed',
          type: 'full_backup'
        },
        {
          id: 2,
          filename: 'zendenta_backup_2025_08_26_143022.zip',
          size: '2.3 MB',
          date: '2025-08-26 14:30:22',
          status: 'completed',
          type: 'full_backup'
        },
        {
          id: 3,
          filename: 'zendenta_backup_2025_08_25_143022.zip',
          size: '2.2 MB',
          date: '2025-08-25 14:30:22',
          status: 'completed',
          type: 'full_backup'
        }
      ]
      setBackups(mockBackups)
    } catch (error) {
      console.error('Error fetching backups:', error)
    }
  }

  const fetchExports = async () => {
    try {
      // Mock data for exports
      const mockExports = [
        {
          id: 1,
          filename: 'zendenta_export_2025_08_27_143022.xlsx',
          size: '1.8 MB',
          date: '2025-08-27 14:30:22',
          status: 'completed',
          type: 'excel_export',
          tables: ['patients', 'appointments', 'treatments', 'payments']
        },
        {
          id: 2,
          filename: 'zendenta_export_2025_08_26_143022.xlsx',
          size: '1.7 MB',
          date: '2025-08-26 14:30:22',
          status: 'completed',
          type: 'excel_export',
          tables: ['patients', 'appointments', 'treatments', 'payments']
        }
      ]
      setExports(mockExports)
    } catch (error) {
      console.error('Error fetching exports:', error)
    }
  }

  const createBackup = async () => {
    setCreatingBackup(true)
    try {
      const response = await fetch('/api/backup', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Backup created successfully! Filename: ${data.filename}`)
        fetchBackups() // Refresh the list
      } else {
        alert('Failed to create backup. Please try again.')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Error creating backup. Please try again.')
    } finally {
      setCreatingBackup(false)
    }
  }

  const createExport = async () => {
    setCreatingExport(true)
    try {
      const response = await fetch('/api/export-excel', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Export created successfully! Filename: ${data.filename}`)
        fetchExports() // Refresh the list
      } else {
        alert('Failed to create export. Please try again.')
      }
    } catch (error) {
      console.error('Error creating export:', error)
      alert('Error creating export. Please try again.')
    } finally {
      setCreatingExport(false)
    }
  }

  const downloadBackup = (backup) => {
    alert(`Downloading backup: ${backup.filename}`)
  }

  const downloadExport = (exportItem) => {
    alert(`Downloading export: ${exportItem.filename}`)
  }

  const deleteBackup = (backupId) => {
    if (confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      setBackups(backups.filter(b => b.id !== backupId))
      alert('Backup deleted successfully!')
    }
  }

  const deleteExport = (exportId) => {
    if (confirm('Are you sure you want to delete this export? This action cannot be undone.')) {
      setExports(exports.filter(e => e.id !== exportId))
      alert('Export deleted successfully!')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'in_progress':
        return <RefreshCw size={16} className="text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle size={16} className="text-red-600" />
      default:
        return <Clock size={16} className="text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'full_backup':
        return <Database size={16} />
      case 'excel_export':
        return <FileText size={16} />
      default:
        return <HardDrive size={16} />
    }
  }

  return (
    <Layout activePage="backup">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-apple-dark">Backup & Export</h1>
        <p className="text-apple-gray">Manage database backups and data exports</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-apple-dark mb-2">Database Backup</h3>
              <p className="text-apple-gray mb-4">Create a complete backup of your clinic database for security and disaster recovery.</p>
              <button
                onClick={createBackup}
                disabled={creatingBackup}
                className="btn-primary flex items-center space-x-2"
              >
                {creatingBackup ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Database className="w-5 h-5" />
                )}
                <span>{creatingBackup ? 'Creating Backup...' : 'Create Backup'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-apple-dark mb-2">Excel Export</h3>
              <p className="text-apple-gray mb-4">Export all clinic data to Excel format for analysis and reporting.</p>
              <button
                onClick={createExport}
                disabled={creatingExport}
                className="btn-primary flex items-center space-x-2"
              >
                {creatingExport ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                <span>{creatingExport ? 'Creating Export...' : 'Create Export'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-apple-dark">Backup History</h2>
          <button
            onClick={fetchBackups}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
        
        {backups.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Backup File</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-apple-dark">{backup.filename}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(backup.type)}
                        <span className="text-sm text-apple-dark">Full Backup</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-apple-dark">{backup.size}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-apple-dark">{backup.date}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(backup.status)}`}>
                        {getStatusIcon(backup.status)}
                        <span>{backup.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadBackup(backup)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download Backup"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteBackup(backup.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Backup"
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
        ) : (
          <div className="text-center py-8">
            <Database className="w-16 h-16 text-apple-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-dark mb-2">No backups yet</h3>
            <p className="text-apple-gray">Create your first backup to get started with data protection.</p>
          </div>
        )}
      </div>

      {/* Export History */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-apple-dark">Export History</h2>
          <button
            onClick={fetchExports}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
        
        {exports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Export File</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-apple-gray uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {exports.map((exportItem) => (
                  <tr key={exportItem.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-apple-dark">{exportItem.filename}</div>
                          <div className="text-xs text-apple-gray">
                            Tables: {exportItem.tables.join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(exportItem.type)}
                        <span className="text-sm text-apple-dark">Excel Export</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-apple-dark">{exportItem.size}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-apple-dark">{exportItem.date}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(exportItem.status)}`}>
                        {getStatusIcon(exportItem.status)}
                        <span>{exportItem.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadExport(exportItem)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download Export"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteExport(exportItem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Export"
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
        ) : (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-apple-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-apple-dark mb-2">No exports yet</h3>
            <p className="text-apple-gray">Create your first export to get started with data analysis.</p>
          </div>
        )}
      </div>

      {/* Backup Settings */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-apple-dark mb-4">Backup Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-apple-dark mb-3">Automated Backups</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-apple-dark text-sm">Daily Backups</h4>
                  <p className="text-xs text-apple-gray">Create backup every day at 2:00 AM</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-apple-dark text-sm">Weekly Backups</h4>
                  <p className="text-xs text-apple-gray">Create backup every Sunday at 3:00 AM</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-apple-dark mb-3">Retention Policy</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/50 rounded-lg">
                <h4 className="font-medium text-apple-dark text-sm mb-2">Keep backups for</h4>
                <select className="input-field w-full">
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                </select>
              </div>
              
              <div className="p-3 bg-white/50 rounded-lg">
                <h4 className="font-medium text-apple-dark text-sm mb-2">Maximum backup size</h4>
                <select className="input-field w-full">
                  <option>100 MB</option>
                  <option>500 MB</option>
                  <option>1 GB</option>
                  <option>5 GB</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <button className="btn-primary flex items-center space-x-2">
            <Activity size={20} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}
