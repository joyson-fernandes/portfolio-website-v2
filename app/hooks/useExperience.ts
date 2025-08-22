
'use client'

import { useState, useEffect } from 'react'

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  period: string
  startDate: string
  endDate: string | null
  type: string
  current: boolean
  icon: string
  color: string
  description: string
  achievements: string[]
  technologies: string[]
  linkedinUrl?: string
  companyLogo?: string
}

export interface ExperienceProfile {
  name: string
  title: string
  location: string
  summary: string
}

export interface ExperienceStats {
  yearsExperience: string
  usersSupported: string
  uptimeAchieved: string
  responseTimeImprovement: string
}

export interface ExperienceData {
  lastUpdated: string
  profile: ExperienceProfile
  experiences: Experience[]
  stats: ExperienceStats
}

export function useExperience() {
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/experience')
      if (!response.ok) {
        throw new Error(`Failed to fetch experience: ${response.status}`)
      }

      const data = await response.json()
      setExperienceData(data)
    } catch (err) {
      console.error('Error fetching experience:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch experience')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperience()
  }, [])

  const refetch = () => {
    fetchExperience()
  }

  return {
    ...experienceData,
    loading,
    error,
    refetch
  }
}
