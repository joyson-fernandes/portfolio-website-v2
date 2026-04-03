export interface GuideMeta {
  title: string
  slug: string
  description: string
  category: string
  date: string
  updated?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  services: string[]
  published: boolean
}

export interface Guide {
  meta: GuideMeta
  content: string
}

export const GUIDE_CATEGORIES = [
  { id: 'kubernetes', label: 'Kubernetes', color: '#3b82f6' },
  { id: 'networking', label: 'Networking', color: '#ec4899' },
  { id: 'security', label: 'Security', color: '#8b5cf6' },
  { id: 'observability', label: 'Observability', color: '#22c55e' },
  { id: 'gitops', label: 'GitOps', color: '#f97316' },
  { id: 'storage', label: 'Storage', color: '#eab308' },
  { id: 'ci-cd', label: 'CI/CD', color: '#06b6d4' },
]
