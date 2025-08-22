
'use client'

import { useState, useEffect } from 'react'

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  icon: string
  color: string
  github?: string
  demo?: string
  mediumUrl?: string
  highlights: string[]
  type: 'manual' | 'medium'
  featured: boolean
  publishedDate: string
  categories?: string[]
  content?: string
}

export interface ProjectData {
  lastUpdated: string
  mediumUrl: string
  settings: {
    autoUpdateFromMedium: boolean
    maxProjects: number
    fallbackToManual: boolean
    includeManualProjects: boolean
  }
  mediumArticles: Project[]
  manualProjects: Project[]
  combinedProjects: Project[]
}

export function useProjects() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`)
      }

      const data = await response.json()
      setProjectData(data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const refreshFromMedium = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/projects/refresh', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to refresh from Medium: ${response.status}`)
      }

      const data = await response.json()
      setProjectData(data)
    } catch (err) {
      console.error('Error refreshing from Medium:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh from Medium')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const refetch = () => {
    fetchProjects()
  }

  return {
    ...projectData,
    loading,
    error,
    refetch,
    refreshFromMedium
  }
}
