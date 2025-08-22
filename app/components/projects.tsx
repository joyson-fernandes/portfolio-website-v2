
'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Github, ArrowRight, Cloud, Container, Layers, Cpu, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { useProjects } from '@/hooks/useProjects'

export default function Projects() {
  const [mounted, setMounted] = useState(false)
  const { mediumArticles, loading, error } = useProjects()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Icon mapping for dynamic icons
  const iconMap = {
    Cloud,
    Container,
    Layers,
    Cpu,
  }

  // Use only latest 6 Medium articles - no fallback projects
  const displayProjects = (mediumArticles || []).slice(0, 6)

  if (!mounted || loading) {
    return (
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md mx-auto" />
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="flex gap-2 mb-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
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
    <section id="projects" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {mediumArticles && mediumArticles.length > 0 
              ? 'Latest technical articles and projects from my Medium blog'
              : 'Technical articles and project insights from my Medium blog'
            }
          </p>
        </div>

        {/* Projects Grid */}
        {displayProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {displayProjects.map((project, index) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap] || Cpu
            return (
            <div
              key={project.id || project.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative aspect-video overflow-hidden bg-white dark:bg-gray-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${project.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {project.highlights.map((highlight, highlightIndex) => (
                      <li
                        key={highlightIndex}
                        className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                      >
                        <ArrowRight className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  )}
                  {project.mediumUrl && (
                    <a
                      href={project.mediumUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen className="w-4 h-4" />
                      Read Article
                    </a>
                  )}
                  {!project.github && !project.demo && !project.mediumUrl && (
                    <a
                      href="https://linkedin.com/in/joyson-fernandes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            </div>
            )
            })}
          </div>
        ) : (
          /* Empty State - No Medium Articles */
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Medium Articles Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                I haven't published any articles on Medium yet, or they're still being synced. 
                Check back soon for the latest technical insights and project breakdowns!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://medium.com/@joysonfernandes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <BookOpen className="w-5 h-5" />
                  Visit My Medium
                </a>
              </div>
            </div>
          </div>
        )}


      </div>
    </section>
  )
}
