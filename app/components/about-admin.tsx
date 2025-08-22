
'use client'

import { useState, useEffect } from 'react'
import { User, Save, RefreshCw, CheckCircle, AlertTriangle, X, Plus, Trash2 } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

interface AboutData {
  sectionTitle: string
  subtitle: string
  mainTitle: string
  paragraphs: string[]
  stats: Array<{ value: string; label: string }>
  highlights: Array<{ title: string; description: string }>
}

export default function AboutAdmin() {
  const { isAdminVisible } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Form state
  const [formData, setFormData] = useState<AboutData>({
    sectionTitle: '',
    subtitle: '',
    mainTitle: '',
    paragraphs: [''],
    stats: [
      { value: '', label: '' }
    ],
    highlights: [
      { title: '', description: '' }
    ]
  })

  // Fetch about data
  const fetchAboutData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      setAboutData(data)
      setFormData({
        sectionTitle: data.sectionTitle || '',
        subtitle: data.subtitle || '',
        mainTitle: data.mainTitle || '',
        paragraphs: data.paragraphs || [''],
        stats: data.stats || [{ value: '', label: '' }],
        highlights: data.highlights || [{ title: '', description: '' }]
      })
    } catch (error) {
      console.error('Failed to fetch about data:', error)
      showMessage('Failed to load about data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAboutData()
    }
  }, [isOpen])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('About content updated successfully!', 'success')
        setAboutData(result.data)
        
        // Trigger page refresh after a short delay to show updated content
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        showMessage(result.error || 'Failed to update about content', 'error')
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

  const addParagraph = () => {
    setFormData(prev => ({
      ...prev,
      paragraphs: [...prev.paragraphs, '']
    }))
  }

  const removeParagraph = (index: number) => {
    if (formData.paragraphs.length > 1) {
      setFormData(prev => ({
        ...prev,
        paragraphs: prev.paragraphs.filter((_, i) => i !== index)
      }))
    }
  }

  const updateParagraph = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.map((p, i) => i === index ? value : p)
    }))
  }

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }]
    }))
  }

  const removeStat = (index: number) => {
    if (formData.stats.length > 1) {
      setFormData(prev => ({
        ...prev,
        stats: prev.stats.filter((_, i) => i !== index)
      }))
    }
  }

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map((s, i) => i === index ? { ...s, [field]: value } : s)
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
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors z-40"
        title="About Section Admin"
      >
        <User className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-96 z-40 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          About Section
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
          <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={formData.sectionTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, sectionTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="About Me"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Brief description..."
            />
          </div>

          {/* Main Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={formData.mainTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, mainTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Transforming Ideas into Infrastructure"
            />
          </div>

          {/* Paragraphs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Paragraphs
              </label>
              <button
                onClick={addParagraph}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="Add Paragraph"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {formData.paragraphs.map((paragraph, index) => (
                <div key={index} className="relative">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateParagraph(index, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    placeholder={`Paragraph ${index + 1}...`}
                  />
                  {formData.paragraphs.length > 1 && (
                    <button
                      onClick={() => removeParagraph(index)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Remove Paragraph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Statistics
              </label>
              <button
                onClick={addStat}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="Add Stat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {formData.stats.map((stat, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="5+"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Years Experience"
                  />
                  {formData.stats.length > 1 && (
                    <button
                      onClick={() => removeStat(index)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                      title="Remove Stat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={fetchAboutData}
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
