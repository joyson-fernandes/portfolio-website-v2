
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Skills() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const skillCategories = [
    {
      title: 'Cloud Platforms',
      skills: [
        { name: 'AWS', level: 95, color: 'from-orange-500 to-orange-600' },
        { name: 'Azure', level: 90, color: 'from-blue-500 to-blue-600' },
        { name: 'Google Cloud', level: 75, color: 'from-green-500 to-green-600' },
      ]
    },
    {
      title: 'Infrastructure as Code',
      skills: [
        { name: 'Terraform', level: 90, color: 'from-purple-500 to-purple-600' },
        { name: 'CloudFormation', level: 85, color: 'from-orange-500 to-orange-600' },
        { name: 'Ansible', level: 80, color: 'from-red-500 to-red-600' },
        { name: 'ARM/Bicep', level: 75, color: 'from-blue-500 to-blue-600' },
      ]
    },
    {
      title: 'Containerization & Orchestration',
      skills: [
        { name: 'Docker', level: 90, color: 'from-blue-500 to-blue-600' },
        { name: 'Kubernetes', level: 85, color: 'from-blue-500 to-purple-600' },
        { name: 'Docker Swarm', level: 80, color: 'from-blue-500 to-blue-600' },
        { name: 'EKS/AKS', level: 85, color: 'from-cyan-500 to-cyan-600' },
      ]
    },
    {
      title: 'CI/CD & DevOps',
      skills: [
        { name: 'GitHub Actions', level: 90, color: 'from-gray-800 to-gray-900' },
        { name: 'Jenkins', level: 85, color: 'from-blue-600 to-blue-700' },
        { name: 'Azure DevOps', level: 80, color: 'from-blue-500 to-blue-600' },
        { name: 'AWS CodePipeline', level: 85, color: 'from-orange-500 to-orange-600' },
      ]
    },
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Python', level: 85, color: 'from-yellow-500 to-yellow-600' },
        { name: 'PowerShell', level: 90, color: 'from-blue-500 to-blue-600' },
        { name: 'Bash', level: 85, color: 'from-green-500 to-green-600' },
        { name: 'Go', level: 70, color: 'from-cyan-500 to-cyan-600' },
      ]
    },
    {
      title: 'Monitoring & Observability',
      skills: [
        { name: 'Prometheus', level: 80, color: 'from-orange-500 to-orange-600' },
        { name: 'Grafana', level: 85, color: 'from-orange-500 to-red-600' },
        { name: 'ELK Stack', level: 75, color: 'from-yellow-500 to-yellow-600' },
        { name: 'New Relic', level: 70, color: 'from-green-500 to-green-600' },
      ]
    }
  ]

  if (!mounted) {
    return (
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="space-y-3">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    ))}
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
    <section id="skills" className="section-padding relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/232b567b-a5f4-44a2-a1db-5f1a1b1ad0a2.png"
            alt="Skills background"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/95 to-blue-50/95 dark:from-gray-900/95 dark:to-gray-800/95" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Core <span className="gradient-text">Competencies</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Technical expertise across cloud platforms, DevOps tools, and modern infrastructure practices
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 card-hover slide-up"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className="skill-item"
                    style={{ animationDelay: `${(categoryIndex * 0.1) + (skillIndex * 0.05)}s` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`skill-bar bg-gradient-to-r ${skill.color} rounded-full`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills Tags */}
        <div className="mt-16 text-center slide-up">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Additional Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'VMware vSphere', 'Hyper-V', 'Proxmox', 'TCP/IP', 'DNS', 'DHCP',
              'VLANs', 'VPN', 'Security Groups', 'DynamoDB', 'Aurora', 'RDS',
              'MySQL', 'Lambda', 'API Gateway', 'S3', 'EC2', 'VPC'
            ].map((tech, index) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 shadow-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
