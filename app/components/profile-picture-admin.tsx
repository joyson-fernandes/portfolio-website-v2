
'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Save, RefreshCw, User, CheckCircle, AlertTriangle, X } from 'lucide-react'
import Image from 'next/image'
import { useAdmin } from '@/contexts/AdminContext'

interface ProfilePictureInfo {
  currentPicture: string | null
  url?: string
  defaultUrl: string
}

export default function ProfilePictureAdmin() {
  const { isAdminVisible } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const [profileInfo, setProfileInfo] = useState<ProfilePictureInfo | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch current profile picture info
  const fetchProfileInfo = async () => {
    try {
      const response = await fetch('/api/profile-picture')
      const data = await response.json()
      setProfileInfo(data)
    } catch (error) {
      console.error('Failed to fetch profile info:', error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchProfileInfo()
    }
  }, [isOpen])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showMessage('Invalid file type. Please upload JPEG, PNG, or WebP images.', 'error')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      showMessage('File too large. Maximum size is 5MB.', 'error')
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/profile-picture', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const result = await response.json()
        showMessage('Profile picture updated successfully!', 'success')
        
        // Reset form
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        // Refresh profile info
        await fetchProfileInfo()
        
        // Trigger a page refresh to update the hero component
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        
      } else {
        const error = await response.json()
        showMessage(error.error || 'Failed to upload profile picture', 'error')
      }
    } catch (error) {
      showMessage('Upload failed. Please try again.', 'error')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const getCurrentImageUrl = () => {
    if (previewUrl) return previewUrl
    if (profileInfo?.url) return profileInfo.url
    return profileInfo?.defaultUrl || '/api/placeholder/150/150'
  }

  // Don't render if admin mode is not visible
  if (!isAdminVisible) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        title="Profile Picture Admin"
      >
        <Camera className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 left-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" />
          Profile Picture
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Current Profile Picture */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-3">Current Picture</div>
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <Image
              src={getCurrentImageUrl()}
              alt="Profile picture"
              fill
              className="object-cover rounded-full border-2 border-gray-200"
            />
          </div>
        </div>
        {profileInfo?.currentPicture && (
          <div className="text-center text-xs text-gray-500 mt-2">
            Custom image uploaded
          </div>
        )}
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Picture
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          <div className="text-xs text-gray-500 mt-1">
            Supports JPEG, PNG, WebP. Max size: 5MB
          </div>
        </div>

        {/* Preview and Upload */}
        {selectedFile && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-700 mb-2">Preview</div>
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <div className="relative w-16 h-16">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload Picture'}
            </button>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={fetchProfileInfo}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Info
        </button>
      </div>

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
          <strong>Tip:</strong> Upload a high-quality square image for best results. The image will be automatically optimized and cached.
        </div>
      </div>
    </div>
  )
}
