
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAdminVisible: boolean
  isAuthenticated: boolean
  showAdmin: () => void
  hideAdmin: () => void
  toggleAdmin: () => void
  authenticateAdmin: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdminVisible, setIsAdminVisible] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Admin password - in production, this should be more secure
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
  
  // Load admin state from session storage on mount
  useEffect(() => {
    const savedAdminState = sessionStorage.getItem('admin-visible')
    const savedAuthState = sessionStorage.getItem('admin-authenticated')
    
    if (savedAdminState === 'true' && savedAuthState === 'true') {
      setIsAdminVisible(true)
      setIsAuthenticated(true)
    }
  }, [])

  const showAdmin = () => {
    if (isAuthenticated) {
      setIsAdminVisible(true)
      sessionStorage.setItem('admin-visible', 'true')
    }
  }

  const hideAdmin = () => {
    setIsAdminVisible(false)
    sessionStorage.setItem('admin-visible', 'false')
  }

  const toggleAdmin = () => {
    if (isAuthenticated) {
      if (isAdminVisible) {
        hideAdmin()
      } else {
        showAdmin()
      }
    }
  }

  const authenticateAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin-authenticated', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdminVisible(false)
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin-visible')
    sessionStorage.removeItem('admin-authenticated')
  }

  const contextValue: AdminContextType = {
    isAdminVisible,
    isAuthenticated,
    showAdmin,
    hideAdmin,
    toggleAdmin,
    authenticateAdmin,
    logout
  }

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  )
}
