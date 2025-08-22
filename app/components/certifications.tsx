
'use client'

import { useEffect, useState } from 'react'
import { Award, ExternalLink, Calendar, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { useCertifications } from '@/hooks/useCertifications'
import { format } from 'date-fns'
import Image from 'next/image'

export default function Certifications() {
  const [mounted, setMounted] = useState(false)
  const { certifications, loading, error, lastUpdated, refetch } = useCertifications()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredCerts, setFilteredCerts] = useState(certifications)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update filtered certifications when certifications or category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredCerts(certifications)
    } else {
      setFilteredCerts(certifications.filter(cert => cert.category === selectedCategory))
    }
  }, [certifications, selectedCategory])

  const categories = [...new Set(certifications.map(cert => cert.category))]

  if (!mounted || loading) {
    return (
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md mx-auto" />
            <div className="flex gap-2 mb-8 justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Professional <span className="gradient-text">Certifications</span>
            </h2>
            <button
              onClick={refetch}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              title="Refresh certifications from Credly"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Validated expertise across cloud platforms, DevOps tools, and enterprise technologies
          </p>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4 text-sm">
            {error ? (
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/50 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                Using cached data
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                Live from Credly
              </div>
            )}
            
            {lastUpdated && (
              <div className="text-gray-500 dark:text-gray-400">
                Last updated: {format(new Date(lastUpdated), 'MMM d, yyyy HH:mm')}
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{certifications.length}+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {[...new Set(certifications.map(cert => cert.issuer))].length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Major Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{categories.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Technology Areas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">2024</div>
              <div className="text-gray-600 dark:text-gray-400">Latest Achievement</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 slide-up">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            All ({certifications.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category} ({certifications.filter(cert => cert.category === category).length})
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert, index) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 card-hover slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 rounded-xl bg-white dark:bg-gray-700 p-2 shadow-sm border border-gray-200 dark:border-gray-600">
                  {cert.imageUrl ? (
                    <Image
                      src={cert.imageUrl}
                      alt={`${cert.name} certification badge`}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Show fallback icon
                        const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="fallback-icon absolute inset-0 flex items-center justify-center" style={{display: cert.imageUrl ? 'none' : 'flex'}}>
                    <Award className={`w-8 h-8 text-gray-600 dark:text-gray-400`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Certified</span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                  {cert.name}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{cert.issuer}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {cert.date}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${cert.color} text-white`}>
                    {cert.level}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Hover Action */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={cert.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Credential
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCerts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No certifications found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try selecting a different category or refresh the data.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Continuous Learning Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm committed to staying current with the latest cloud technologies and DevOps practices. 
              My certifications are automatically synced from Credly to showcase real-time achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.credly.com/users/joyson-fernandes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Award className="w-5 h-5" />
                View All Badges
              </a>
              <button
                onClick={refetch}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
