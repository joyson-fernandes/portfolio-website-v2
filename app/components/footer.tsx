
'use client'

import { useEffect, useState } from 'react'
import { Cloud, ArrowUp, Mail, Linkedin, Github, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/in/joyson-fernandes',
      color: 'hover:text-[#0077B5]'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/joysonfernandes',
      color: 'hover:text-gray-800'
    },
    {
      name: 'Medium',
      icon: MessageSquare,
      href: 'https://medium.com/@joyson',
      color: 'hover:text-gray-700'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:jf@joysontech.com',
      color: 'hover:text-red-500'
    }
  ]

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' }
  ]

  if (!mounted) {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-700 rounded" />
                <div className="h-4 bg-gray-700 rounded w-2/3" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-5 bg-gray-700 rounded w-1/2" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-700 rounded w-3/4" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-8">
              <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto" />
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <>
      <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text">
                    Joyson Fernandes
                  </h3>
                  <p className="text-blue-200">Cloud DevOps Engineer</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8 max-w-md">
                Passionate about building scalable cloud infrastructure and automating complex workflows. 
                Let's transform your technology landscape together.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-700 ${social.color} transition-all duration-200 hover:scale-110`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="slide-in-left">
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="slide-in-right">
              <h4 className="text-lg font-semibold text-white mb-6">Get In Touch</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <a
                    href="mailto:jf@joysontech.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    jf@joysontech.com
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-gray-300">London, UK</p>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400">
                  © {new Date().getFullYear()} Joyson Fernandes.
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Currently open to new opportunities</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}
