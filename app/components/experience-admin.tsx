
'use client'

import { useState, useEffect } from 'react'
import { Building, Save, RefreshCw, CheckCircle, AlertTriangle, X, Plus, Trash2, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

interface ExperienceItem {
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
  linkedinUrl: string | null
  companyLogo: string | null
}

interface Profile {
  name: string
  title: string
  location: string
  summary: string
}

interface Stats {
  yearsExperience: string
  usersSupported: string
  uptimeAchieved: string
  responseTimeImprovement: string
}

interface ExperienceData {
  profile: Profile
  experiences: ExperienceItem[]
  stats: Stats
}

export default function ExperienceAdmin() {
  const { isAdminVisible } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Form state
  const [formData, setFormData] = useState<ExperienceData>({
    profile: {
      name: '',
      title: '',
      location: '',
      summary: ''
    },
    experiences: [],
    stats: {
      yearsExperience: '',
      usersSupported: '',
      uptimeAchieved: '',
      responseTimeImprovement: ''
    }
  })

  // Fetch experience data
  const fetchExperienceData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/experience')
      const data = await response.json()
      setExperienceData(data)
      setFormData({
        profile: data.profile || {
          name: '',
          title: '',
          location: '',
          summary: ''
        },
        experiences: data.experiences || [],
        stats: data.stats || {
          yearsExperience: '',
          usersSupported: '',
          uptimeAchieved: '',
          responseTimeImprovement: ''
        }
      })
    } catch (error) {
      console.error('Failed to fetch experience data:', error)
      showMessage('Failed to load experience data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchExperienceData()
    }
  }, [isOpen])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('Experience data updated successfully!', 'success')
        setExperienceData(result.data)
        
        // Trigger page refresh after a short delay to show updated content
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        showMessage(result.error || 'Failed to update experience data', 'error')
      }
    } catch (error) {
      showMessage('Save failed. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  // Profile handlers
  const updateProfile = (field: keyof Profile, value: string) => {
    setFormData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }))
  }

  // Stats handlers
  const updateStats = (field: keyof Stats, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }))
  }

  // Experience handlers
  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      period: '',
      startDate: '',
      endDate: null,
      type: 'Full-time',
      current: false,
      icon: 'Building',
      color: 'from-blue-500 to-blue-600',
      description: '',
      achievements: [''],
      technologies: [''],
      linkedinUrl: null,
      companyLogo: null
    }

    setFormData(prev => ({
      ...prev,
      experiences: [newExperience, ...prev.experiences]
    }))
  }

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addAchievement = (expIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex 
          ? { ...exp, achievements: [...exp.achievements, ''] }
          : exp
      )
    }))
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex 
          ? { ...exp, achievements: exp.achievements.filter((_, ai) => ai !== achIndex) }
          : exp
      )
    }))
  }

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex 
          ? { 
              ...exp, 
              achievements: exp.achievements.map((ach, ai) => ai === achIndex ? value : ach)
            }
          : exp
      )
    }))
  }

  const addTechnology = (expIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex 
          ? { ...exp, technologies: [...exp.technologies, ''] }
          : exp
      )
    }))
  }

  const removeTechnology = (expIndex: number, techIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex 
          ? { ...exp, technologies: exp.technologies.filter((_, ti) => ti !== techIndex) }
          : exp
      )
    }))
  }

  const updateTechnology = (expIndex: number, techIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex 
          ? { 
              ...exp, 
              technologies: exp.technologies.map((tech, ti) => ti === techIndex ? value : tech)
            }
          : exp
      )
    }))
  }

  // Don't render if admin mode is not visible
  if (!isAdminVisible) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-20 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Experience Section Admin"
      >
        <Building className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-20 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-[500px] z-40 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Experience Section
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3">Profile Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.profile.title}
                  onChange={(e) => updateProfile('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.profile.location}
                  onChange={(e) => updateProfile('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={formData.profile.summary}
                  onChange={(e) => updateProfile('summary', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years Experience</label>
                <input
                  type="text"
                  value={formData.stats.yearsExperience}
                  onChange={(e) => updateStats('yearsExperience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Users Supported</label>
                <input
                  type="text"
                  value={formData.stats.usersSupported}
                  onChange={(e) => updateStats('usersSupported', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uptime Achieved</label>
                <input
                  type="text"
                  value={formData.stats.uptimeAchieved}
                  onChange={(e) => updateStats('uptimeAchieved', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="99.5%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Improvement</label>
                <input
                  type="text"
                  value={formData.stats.responseTimeImprovement}
                  onChange={(e) => updateStats('responseTimeImprovement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="60%"
                />
              </div>
            </div>
          </div>

          {/* Experiences Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Experience Entries</h4>
              <button
                onClick={addExperience}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="Add Experience"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {formData.experiences.map((exp, expIndex) => (
                <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-800">Position #{expIndex + 1}</h5>
                    <button
                      onClick={() => removeExperience(expIndex)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Remove Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                        placeholder="Job Title"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                        placeholder="Company"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                        placeholder="Location"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateExperience(expIndex, 'period', e.target.value)}
                        placeholder="Period (e.g., Jan 2020 - Present)"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(expIndex, 'description', e.target.value)}
                      placeholder="Job description"
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />

                    {/* Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-600">Achievements</label>
                        <button
                          onClick={() => addAchievement(expIndex)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Add Achievement"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2 mb-1">
                          <textarea
                            value={achievement}
                            onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                            placeholder={`Achievement ${achIndex + 1}`}
                            rows={2}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          />
                          {exp.achievements.length > 1 && (
                            <button
                              onClick={() => removeAchievement(expIndex, achIndex)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-600">Technologies</label>
                        <button
                          onClick={() => addTechnology(expIndex)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Add Technology"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => updateTechnology(expIndex, techIndex, e.target.value)}
                              placeholder="Tech"
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-16"
                            />
                            {exp.technologies.length > 1 && (
                              <button
                                onClick={() => removeTechnology(expIndex, techIndex)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={fetchExperienceData}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
          <div className={`text-sm ${
            messageType === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-800 text-xs">
          <strong>Note:</strong> Changes will take effect after saving. The page will refresh automatically to show updates.
        </div>
      </div>
    </div>
  )
}
