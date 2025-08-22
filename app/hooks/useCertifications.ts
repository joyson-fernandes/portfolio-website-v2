
'use client'

import { useState, useEffect } from 'react'

interface Certification {
  id: string
  name: string
  issuer: string
  issuerUrl: string
  date: string
  expiresAt?: string
  imageUrl: string
  description: string
  badgeUrl: string
  category: string
  level: string
  color: string
}

interface CertificationsResponse {
  success: boolean
  data: Certification[]
  count: number
  lastUpdated: string
  error?: string
  message?: string
}

export function useCertifications(username = 'joyson-fernandes') {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchCertifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/certifications?username=${encodeURIComponent(username)}`)
      const data: CertificationsResponse = await response.json()
      
      if (data.success && data.data) {
        setCertifications(data.data)
        setLastUpdated(data.lastUpdated)
      } else {
        throw new Error(data.message || 'Failed to fetch certifications')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch certifications'
      setError(errorMessage)
      
      // Fallback to static data if API fails
      console.warn('Falling back to static certifications data:', errorMessage)
      setCertifications(getStaticCertifications())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertifications()
  }, [username])

  const refetch = () => {
    fetchCertifications()
  }

  return {
    certifications,
    loading,
    error,
    lastUpdated,
    refetch
  }
}

// Fallback static data in case API fails
function getStaticCertifications(): Certification[] {
  return [
    {
      id: 'aws-ai-practitioner',
      name: 'AWS Certified AI Practitioner',
      issuer: 'Amazon Web Services',
      issuerUrl: 'https://aws.amazon.com',
      date: '2024',
      imageUrl: '/certifications/aws-ai-practitioner.png',
      description: 'Validates foundational AI knowledge and skills',
      badgeUrl: 'https://www.credly.com/users/joyson-fernandes',
      level: 'Practitioner',
      color: 'from-orange-500 to-orange-600',
      category: 'Cloud'
    },
    {
      id: 'aws-cloud-practitioner',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issuerUrl: 'https://aws.amazon.com',
      date: '2024',
      imageUrl: '/certifications/aws-cloud-practitioner.png',
      description: 'Validates foundational AWS cloud knowledge',
      badgeUrl: 'https://www.credly.com/users/joyson-fernandes',
      level: 'Foundational',
      color: 'from-orange-500 to-orange-600',
      category: 'Cloud'
    },
    {
      id: 'github-foundations',
      name: 'GitHub Foundations',
      issuer: 'GitHub',
      issuerUrl: 'https://github.com',
      date: '2024',
      imageUrl: '/certifications/github-foundations.png',
      description: 'Demonstrates foundational GitHub knowledge',
      badgeUrl: 'https://www.credly.com/users/joyson-fernandes',
      level: 'Foundational',
      color: 'from-gray-700 to-gray-900',
      category: 'DevOps'
    },
    {
      id: 'terraform-associate',
      name: 'HashiCorp Certified: Terraform Associate (003)',
      issuer: 'HashiCorp',
      issuerUrl: 'https://hashicorp.com',
      date: '2024',
      imageUrl: '/certifications/terraform-associate.png',
      description: 'Validates Terraform skills and infrastructure automation knowledge',
      badgeUrl: 'https://www.credly.com/users/joyson-fernandes',
      level: 'Associate',
      color: 'from-purple-500 to-purple-600',
      category: 'Infrastructure'
    },
    {
      id: 'az-900',
      name: 'AZ-900: Azure Fundamentals',
      issuer: 'Microsoft',
      issuerUrl: 'https://microsoft.com',
      date: '2023',
      imageUrl: '/certifications/az-900.png',
      description: 'Validates foundational knowledge of Azure cloud services',
      badgeUrl: 'https://www.credly.com/users/joyson-fernandes',
      level: 'Fundamental',
      color: 'from-blue-500 to-blue-600',
      category: 'Cloud'
    }
  ]
}
