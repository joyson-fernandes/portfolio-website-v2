
'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, TrendingUp, Users, Award, Target, Building, Clock } from 'lucide-react'
import { useExperience } from '@/hooks/useExperience'

export default function Experience() {
  const [mounted, setMounted] = useState(false)
  const { experiences, profile, stats, loading, error } = useExperience()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Icon mapping for dynamic icons
  const iconMap = {
    Building,
    Target,
    Users,
    Award,
    TrendingUp,
  }

  // Fallback experiences for when data is loading or unavailable
  const fallbackExperiences = [
    {
      title: 'Cloud DevOps Engineer',
      company: 'Level Up In Tech',
      location: 'Remote',
      period: 'Aug 2024 - Present',
      type: 'Part-time',
      current: true,
      icon: Building,
      color: 'from-green-500 to-green-600',
      achievements: [
        'Designing and implementing cloud infrastructure solutions for enterprise clients',
        'Mentoring new DevOps engineers in cloud best practices and automation',
        'Leading migration projects from on-premises to cloud environments',
        'Developing Infrastructure as Code templates for rapid deployment'
      ],
      technologies: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes']
    },
    {
      title: 'Infrastructure Support Analyst',
      company: 'Airinmar',
      location: 'UK',
      period: 'Nov 2022 - Present',
      type: 'Full-time',
      current: true,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      achievements: [
        'Managed critical infrastructure supporting 500+ users with 99.5% uptime',
        'Implemented automated monitoring solutions reducing incident response time by 60%',
        'Led virtualization projects using VMware vSphere and Hyper-V',
        'Developed PowerShell scripts for system administration and automation'
      ],
      technologies: ['VMware', 'Hyper-V', 'PowerShell', 'Windows Server', 'Active Directory']
    },
    {
      title: 'Senior 2nd Line Support Engineer',
      company: 'Kaplan UK',
      location: 'London, UK',
      period: 'Apr 2022 - Nov 2022',
      type: 'Full-time',
      current: false,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      achievements: [
        'Provided technical support for complex infrastructure issues across multiple sites',
        'Improved ticket resolution time by 45% through process optimization',
        'Collaborated with development teams on application deployment strategies',
        'Maintained and updated system documentation and knowledge base'
      ],
      technologies: ['Windows Server', 'SQL Server', 'Network Administration', 'Troubleshooting']
    },
    {
      title: 'Senior ICT Support Engineer',
      company: 'THPT',
      location: 'London, UK',
      period: 'Oct 2021 - Apr 2022',
      type: 'Full-time',
      current: false,
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      achievements: [
        'Led a team of 3 junior engineers in daily operations and problem resolution',
        'Implemented backup and disaster recovery solutions improving data protection',
        'Managed network infrastructure including VLANs, VPNs, and security policies',
        'Reduced system downtime by 35% through proactive monitoring and maintenance'
      ],
      technologies: ['Network Management', 'Backup Solutions', 'Team Leadership', 'Security']
    },
    {
      title: 'ICT Support Engineer',
      company: 'THPT',
      location: 'London, UK',
      period: 'Jan 2020 - Oct 2021',
      type: 'Full-time',
      current: false,
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      achievements: [
        'Provided comprehensive IT support for 200+ users across multiple departments',
        'Maintained Windows Server environments and Active Directory infrastructure',
        'Implemented user access management and security compliance procedures',
        'Achieved 95% user satisfaction rating through excellent customer service'
      ],
      technologies: ['Windows Server', 'Active Directory', 'Help Desk', 'User Management']
    }
  ]

  // Use dynamic data if available, otherwise use fallback
  const displayExperiences = experiences && experiences.length > 0 ? experiences : fallbackExperiences
  const displayStats = stats || {
    yearsExperience: "5+",
    usersSupported: "500+",
    uptimeAchieved: "99.5%",
    responseTimeImprovement: "60%"
  }
  const displayProfile = profile || {
    name: "Joyson Fernandes",
    title: "Cloud DevOps Engineer",
    summary: "A progressive journey through infrastructure, cloud, and DevOps engineering roles"
  }

  if (!mounted || loading) {
    return (
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md mx-auto" />
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full mt-2" />
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="section-padding bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {displayProfile.summary}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 transform md:-translate-x-0.5" />

          {/* Experience Items */}
          <div className="space-y-12">
            {displayExperiences.map((exp, index) => {
              const IconComponent = iconMap[exp.icon as keyof typeof iconMap] || Building
              return (
              <div
                key={index}
                className={`relative flex items-start gap-8 slide-up ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${exp.color} border-4 border-white shadow-lg`} />
                </div>

                {/* Content */}
                <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg card-hover">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${exp.color}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold">{exp.company}</p>
                        </div>
                      </div>
                      {exp.current && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exp.type}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/50 rounded-2xl p-8 slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">{displayStats.yearsExperience}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Years of Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">{displayStats.usersSupported}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Users Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">{displayStats.uptimeAchieved}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Uptime Achieved</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">{displayStats.responseTimeImprovement}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Faster Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
