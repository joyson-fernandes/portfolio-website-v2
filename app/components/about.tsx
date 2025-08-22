
'use client'

import { useEffect, useState } from 'react'
import { Cloud, Code2, Zap, Users, Award, Target } from 'lucide-react'

interface AboutData {
  sectionTitle: string
  subtitle: string
  mainTitle: string
  paragraphs: string[]
  stats: Array<{ value: string; label: string }>
  highlights: Array<{ title: string; description: string }>
}

export default function About() {
  const [mounted, setMounted] = useState(false)
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  // Icon mapping for highlights
  const iconMap: { [key: string]: any } = {
    'Cloud Architecture': Cloud,
    'Infrastructure as Code': Code2,
    'DevOps Excellence': Zap,
    'Team Collaboration': Users,
    '11+ Certifications': Award,
    'Problem Solver': Target
  }

  const getIconForHighlight = (title: string) => {
    return iconMap[title] || Target
  }

  useEffect(() => {
    setMounted(true)
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      setAboutData(data)
    } catch (error) {
      console.error('Failed to fetch about data:', error)
      // Set fallback data
      setAboutData({
        sectionTitle: "About Me",
        subtitle: "A dedicated Cloud DevOps Engineer with a passion for building robust, scalable infrastructure solutions and automating complex workflows.",
        mainTitle: "Transforming Ideas into Infrastructure",
        paragraphs: [
          "As a Cloud DevOps Engineer and Infrastructure Support Analyst, I specialize in creating seamless, automated cloud solutions that drive business growth and operational efficiency. My journey spans multiple cloud platforms, with deep expertise in AWS and Azure ecosystems.",
          "I graduated from the comprehensive 40-week Level Up In Tech program, where I mastered modern cloud technologies and DevOps practices. Currently, I balance my role as Infrastructure Support Analyst at Airinmar with part-time Cloud DevOps engineering at Level Up In Tech, continuously expanding my expertise.",
          "My approach combines technical excellence with collaborative problem-solving, focusing on Infrastructure as Code, containerization, and continuous integration/deployment pipelines. I'm passionate about automation, cloud architecture, and staying at the forefront of emerging technologies."
        ],
        stats: [
          { value: "5+", label: "Years Experience" },
          { value: "11+", label: "Certifications" },
          { value: "3", label: "Cloud Platforms" },
          { value: "50+", label: "Projects Delivered" }
        ],
        highlights: [
          { title: 'Cloud Architecture', description: 'Expert in AWS, Azure, and GCP cloud platforms with focus on scalable solutions.' },
          { title: 'Infrastructure as Code', description: 'Proficient in Terraform, CloudFormation, and Ansible for automation.' },
          { title: 'DevOps Excellence', description: 'CI/CD pipelines, containerization, and modern deployment strategies.' },
          { title: 'Team Collaboration', description: 'Strong communication skills and experience in cross-functional teams.' },
          { title: '11+ Certifications', description: 'AWS, Azure, HashiCorp, and Microsoft certified professional.' },
          { title: 'Problem Solver', description: 'Passionate about solving complex infrastructure challenges efficiently.' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading || !aboutData) {
    return (
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md mx-auto" />
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {aboutData.sectionTitle.split(' ')[0]} <span className="gradient-text">{aboutData.sectionTitle.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {aboutData.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="slide-in-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {aboutData.mainTitle}
            </h3>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {aboutData.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#contact"
                className="btn-primary"
              >
                Let's Work Together
              </a>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="slide-in-right">
            <div className="grid grid-cols-2 gap-6">
              {aboutData.highlights.map((highlight, index) => {
                const IconComponent = getIconForHighlight(highlight.title)
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl card-hover"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl w-fit mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{highlight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 slide-up">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
