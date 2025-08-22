
'use client'

import { useState, useEffect } from 'react'
import { Cpu, Save, RefreshCw, CheckCircle, AlertTriangle, X, Plus, Trash2, ExternalLink, BookOpen } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

interface Project {
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

interface ProjectsData {
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

export default function ProjectsAdmin() {
  const { isAdminVisible } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Form state
  const [formData, setFormData] = useState<ProjectsData>({
    lastUpdated: '',
    mediumUrl: '',
    settings: {
      autoUpdateFromMedium: true,
      maxProjects: 10,
      fallbackToManual: true,
      includeManualProjects: true
    },
    mediumArticles: [],
    manualProjects: [],
    combinedProjects: []
  })

  // Fetch projects data
  const fetchProjectsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjectsData(data)
      setFormData(data)
    } catch (error) {
      console.error('Failed to fetch projects data:', error)
      showMessage('Failed to load projects data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchProjectsData()
    }
  }, [isOpen])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('Projects data updated successfully!', 'success')
        setProjectsData(result.data)
        
        // Trigger page refresh after a short delay to show updated content
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        showMessage(result.error || 'Failed to update projects data', 'error')
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

  // Settings handlers
  const updateSettings = (field: keyof ProjectsData['settings'], value: boolean | number) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }))
  }

  // Manual project handlers
  const addManualProject = () => {
    const newProject: Project = {
      id: `manual-${Date.now()}`,
      title: '',
      description: '',
      image: '',
      technologies: [''],
      icon: 'Cpu',
      color: 'from-gray-500 to-gray-600',
      github: '',
      demo: '',
      highlights: [''],
      type: 'manual',
      featured: false,
      publishedDate: new Date().toISOString(),
      categories: ['']
    }

    setFormData(prev => ({
      ...prev,
      manualProjects: [newProject, ...prev.manualProjects]
    }))
  }

  const removeManualProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.filter((_, i) => i !== index)
    }))
  }

  const updateManualProject = (index: number, field: keyof Project, value: any) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }))
  }

  const addProjectTechnology = (projectIndex: number) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: [...project.technologies, ''] }
          : project
      )
    }))
  }

  const removeProjectTechnology = (projectIndex: number, techIndex: number) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: project.technologies.filter((_, ti) => ti !== techIndex) }
          : project
      )
    }))
  }

  const updateProjectTechnology = (projectIndex: number, techIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === projectIndex 
          ? { 
              ...project, 
              technologies: project.technologies.map((tech, ti) => ti === techIndex ? value : tech)
            }
          : project
      )
    }))
  }

  const addProjectHighlight = (projectIndex: number) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === projectIndex 
          ? { ...project, highlights: [...project.highlights, ''] }
          : project
      )
    }))
  }

  const removeProjectHighlight = (projectIndex: number, highlightIndex: number) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === projectIndex 
          ? { ...project, highlights: project.highlights.filter((_, hi) => hi !== highlightIndex) }
          : project
      )
    }))
  }

  const updateProjectHighlight = (projectIndex: number, highlightIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      manualProjects: prev.manualProjects.map((project, i) => 
        i === projectIndex 
          ? { 
              ...project, 
              highlights: project.highlights.map((highlight, hi) => hi === highlightIndex ? value : highlight)
            }
          : project
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
        className="fixed bottom-6 left-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        title="Projects Section Admin"
      >
        <Cpu className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-[600px] z-40 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          Projects Section
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
          <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settings Section */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3">Project Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medium URL</label>
                <input
                  type="text"
                  value={formData.mediumUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, mediumUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://medium.com/@joysonfernandes"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Projects</label>
                  <input
                    type="number"
                    value={formData.settings.maxProjects}
                    onChange={(e) => updateSettings('maxProjects', parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    min="1"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoUpdateFromMedium}
                      onChange={(e) => updateSettings('autoUpdateFromMedium', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Auto-update from Medium</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.settings.includeManualProjects}
                      onChange={(e) => updateSettings('includeManualProjects', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Include manual projects</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Medium Articles Status */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Medium Integration Status
            </h4>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-900 mb-2">
                <strong>Articles:</strong> {formData.mediumArticles.length}
              </div>
              <div className="text-xs text-blue-700">
                Medium articles are automatically imported and displayed in the Featured Projects section
              </div>
            </div>
          </div>

          {/* Manual Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Manual Projects</h4>
              <button
                onClick={addManualProject}
                className="text-purple-600 hover:text-purple-700 transition-colors"
                title="Add Manual Project"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {formData.manualProjects.map((project, projectIndex) => (
                <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-800">Project #{projectIndex + 1}</h5>
                    <button
                      onClick={() => removeManualProject(projectIndex)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateManualProject(projectIndex, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={project.image}
                        onChange={(e) => updateManualProject(projectIndex, 'image', e.target.value)}
                        placeholder="Image URL"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <textarea
                      value={project.description}
                      onChange={(e) => updateManualProject(projectIndex, 'description', e.target.value)}
                      placeholder="Project description"
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={project.github || ''}
                        onChange={(e) => updateManualProject(projectIndex, 'github', e.target.value)}
                        placeholder="GitHub URL"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={project.demo || ''}
                        onChange={(e) => updateManualProject(projectIndex, 'demo', e.target.value)}
                        placeholder="Demo URL"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    {/* Technologies */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-600">Technologies</label>
                        <button
                          onClick={() => addProjectTechnology(projectIndex)}
                          className="text-purple-600 hover:text-purple-700"
                          title="Add Technology"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="flex items-center gap-1">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => updateProjectTechnology(projectIndex, techIndex, e.target.value)}
                              placeholder="Tech"
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 w-20"
                            />
                            {project.technologies.length > 1 && (
                              <button
                                onClick={() => removeProjectTechnology(projectIndex, techIndex)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-600">Highlights</label>
                        <button
                          onClick={() => addProjectHighlight(projectIndex)}
                          className="text-purple-600 hover:text-purple-700"
                          title="Add Highlight"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {project.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => updateProjectHighlight(projectIndex, highlightIndex, e.target.value)}
                            placeholder={`Highlight ${highlightIndex + 1}`}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          />
                          {project.highlights.length > 1 && (
                            <button
                              onClick={() => removeProjectHighlight(projectIndex, highlightIndex)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
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
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={fetchProjectsData}
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
          <strong>Note:</strong> Medium articles are automatically imported. Manual projects can be added here and will be included if "Include manual projects" is enabled.
        </div>
      </div>
    </div>
  )
}
