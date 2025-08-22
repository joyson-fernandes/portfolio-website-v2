
'use client'

import { useState, useEffect } from 'react'
import { Settings, Eye, EyeOff, Lock, Unlock, X } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminToggle() {
  const { 
    isAdminVisible, 
    isAuthenticated, 
    showAdmin, 
    hideAdmin, 
    authenticateAdmin, 
    logout 
  } = useAdmin()
  
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut for admin toggle (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        if (isAuthenticated) {
          if (isAdminVisible) {
            hideAdmin()
          } else {
            showAdmin()
          }
        } else {
          setShowLogin(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAuthenticated, isAdminVisible, showAdmin, hideAdmin])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (authenticateAdmin(password)) {
      setPassword('')
      setLoginError('')
      setShowLogin(false)
      showAdmin()
    } else {
      setLoginError('Invalid admin password')
      setTimeout(() => setLoginError(''), 3000)
    }
  }

  const handleLogout = () => {
    logout()
    setShowLogin(false)
    setPassword('')
  }

  // Don't render anything on server-side
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Admin Access
              </h3>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>
              
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{loginError}</p>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Access Admin Panel
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Shortcut: <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Ctrl + Shift + A</kbd>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Toggle Controls */}
      <div className="fixed top-4 right-4 z-[1100] flex items-center gap-2">
        {!isAuthenticated ? (
          <button
            onClick={() => setShowLogin(true)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full shadow-lg transition-colors"
            title="Admin Login (Ctrl + Shift + A)"
          >
            <Settings className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-white rounded-full shadow-lg p-1">
            <button
              onClick={isAdminVisible ? hideAdmin : showAdmin}
              className={`p-2 rounded-full transition-colors ${
                isAdminVisible 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isAdminVisible ? 'Hide Admin Panels' : 'Show Admin Panels'}
            >
              {isAdminVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout from Admin"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
