
'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import { useTypingEffect } from '@/hooks/useTypingEffect'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const { getCurrentImageUrl, loading: profileLoading } = useProfilePicture()
  
  const phrases = ["Cloud Operations Engineer", "DevOps Engineer", "Cloud AI Engineer", "Platform Engineer"]
  const dynamicText = useTypingEffect({
    phrases,
    typingDelay: 100,
    deletingDelay: 50,
    pauseBetweenPhrases: 1500,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToAbout = () => {
    document?.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8 animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/35ac5497-dfd1-4933-8203-3fd0e4914952.png"
            alt="Cloud computing background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-cyan-900/70 dark:from-gray-900/80 dark:to-slate-900/80" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="fade-in">
          {/* Profile Image */}
          <div className="relative w-40 h-40 mx-auto mb-8 float">
            {profileLoading ? (
              <div className="w-40 h-40 bg-white/20 rounded-full border-4 border-white shadow-xl animate-pulse" />
            ) : (
              <Image
                src={getCurrentImageUrl()}
                alt="Joyson Fernandes"
                fill
                className="object-cover rounded-full border-4 border-white shadow-xl"
              />
            )}
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 slide-up">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Joyson Fernandes
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl text-blue-100 mb-4 slide-up font-light min-h-[3rem] flex items-center justify-center">
            <span className="inline-block">
              {mounted ? dynamicText : "Cloud Operations Engineer"}
              <span className="inline-block w-0.5 h-8 bg-cyan-300 ml-1 animate-pulse"></span>
            </span>
          </h2>



          {/* Description */}
          <p className="text-xl text-blue-100 mb-20 max-w-3xl mx-auto leading-relaxed slide-up">
            Passionate about automation, cloud architecture, and building scalable infrastructure solutions with{' '}
            <span className="text-cyan-300 font-semibold">AWS</span>,{' '}
            <span className="text-cyan-300 font-semibold">Azure</span>, and{' '}
            <span className="text-cyan-300 font-semibold">DevOps</span> best practices.
          </p>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white hover:text-cyan-300 transition-colors animate-bounce"
          aria-label="Scroll to about section"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-cyan-300/10 rounded-full blur-xl float" style={{ animationDelay: '4s' }} />
    </section>
  )
}
