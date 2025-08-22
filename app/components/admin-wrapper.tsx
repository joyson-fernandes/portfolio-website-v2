
'use client'

import { useAdmin } from '@/contexts/AdminContext'
import { ReactNode } from 'react'

interface AdminWrapperProps {
  children: ReactNode
  showInDevelopment?: boolean
}

export default function AdminWrapper({ children, showInDevelopment = true }: AdminWrapperProps) {
  const { isAdminVisible, isAuthenticated } = useAdmin()
  
  // Show admin panels if:
  // 1. User is authenticated AND admin is visible
  // 2. OR in development mode (if showInDevelopment is true)
  const shouldShowAdmin = (isAuthenticated && isAdminVisible) || 
                         (showInDevelopment && process.env.NODE_ENV === 'development')

  if (!shouldShowAdmin) {
    return null
  }

  return <>{children}</>
}
