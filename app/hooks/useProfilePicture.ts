
'use client'

import { useState, useEffect } from 'react'

interface ProfilePictureInfo {
  currentPicture: string | null
  url?: string
  defaultUrl: string
}

export function useProfilePicture() {
  const [profileInfo, setProfileInfo] = useState<ProfilePictureInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cacheKey, setCacheKey] = useState<string>('')

  const fetchProfilePicture = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile-picture')
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile picture')
      }
      
      const data = await response.json()
      setProfileInfo(data)
      setCacheKey(Date.now().toString())
      setError(null)
    } catch (err) {
      console.error('Error fetching profile picture:', err)
      setError('Failed to load profile picture')
      // Set fallback data
      setProfileInfo({
        currentPicture: null,
        defaultUrl: 'https://cdn.abacus.ai/images/99dbdee6-dd39-4ea5-aee3-e0b20c58fcb0.png'
      })
      setCacheKey(Date.now().toString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfilePicture()
  }, [])

  const refetch = () => {
    fetchProfilePicture()
  }

  const getCurrentImageUrl = () => {
    if (profileInfo?.url && cacheKey) {
      // Add stable cache busting for uploaded images
      return `${profileInfo.url}?t=${cacheKey}`
    }
    return profileInfo?.defaultUrl || 'https://cdn.abacus.ai/images/99dbdee6-dd39-4ea5-aee3-e0b20c58fcb0.png'
  }

  return {
    profileInfo,
    loading,
    error,
    refetch,
    getCurrentImageUrl
  }
}
