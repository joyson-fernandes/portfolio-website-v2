
'use client'

import { useState } from 'react'
import { RefreshCw, Settings, Clock, CheckCircle, AlertTriangle, Database } from 'lucide-react'

interface AdminStats {
  totalCertifications: number
  lastUpdated: string | null
  cacheStatus: 'hit' | 'miss' | 'stale'
  apiStatus: 'healthy' | 'error' | 'loading'
  autoRefreshEnabled: boolean
}

export default function CertificationsAdmin() {
  const [isOpen, setIsOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<AdminStats>({
    totalCertifications: 0,
    lastUpdated: null,
    cacheStatus: 'miss',
    apiStatus: 'loading',
    autoRefreshEnabled: true
  })

  const refreshCertifications = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/certifications/refresh', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        // Update stats
        setStats(prev => ({
          ...prev,
          lastUpdated: data.timestamp,
          apiStatus: 'healthy'
        }))
        
        // Trigger a page refresh to show new data
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to refresh:', error)
      setStats(prev => ({ ...prev, apiStatus: 'error' }))
    } finally {
      setRefreshing(false)
    }
  }

  const testCronEndpoint = async () => {
    try {
      const response = await fetch('/api/cron/refresh-certifications', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'test'}`
        }
      })
      const data = await response.json()
      console.log('Cron test result:', data)
    } catch (error) {
      console.error('Cron test failed:', error)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Certifications Admin"
      >
        <Settings className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Certifications Admin</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              stats.apiStatus === 'healthy' ? 'bg-green-500' :
              stats.apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="text-gray-600">API Status</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{stats.totalCertifications} Certs</span>
          </div>
        </div>

        {/* Last Updated */}
        {stats.lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date(stats.lastUpdated).toLocaleString()}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={refreshCertifications}
            disabled={refreshing}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Manual Refresh'}
          </button>
          
          <button
            onClick={testCronEndpoint}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Clock className="w-4 h-4" />
            Test Cron Job
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Auto-refresh setup:</p>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono">
            <div className="mb-1">Endpoint:</div>
            <div className="break-all text-blue-600">
              /api/cron/refresh-certifications
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Set up a cron job to call this endpoint hourly for automatic updates.
          </p>
        </div>
      </div>
    </div>
  )
}
