
export interface Experience {
  title: string
  company: string
  location: string
  period: string
  type: string
  current: boolean
  achievements: string[]
  technologies: string[]
}

export interface Project {
  title: string
  description: string
  image: string
  technologies: string[]
  highlights: string[]
  github?: string
  demo?: string
}

export interface Certification {
  name: string
  issuer: string
  date: string
  level: string
  category: string
}

export interface Skill {
  name: string
  level: number
  color: string
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export interface ContactInfo {
  email: string
  phone?: string
  location: string
  linkedin?: string
  github?: string
  medium?: string
}

export interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export type SubmitStatus = 'idle' | 'success' | 'error' | 'loading'
