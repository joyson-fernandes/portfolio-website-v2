
'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Send, Linkedin, Github, MessageSquare, Clock } from 'lucide-react'
import Image from 'next/image'

export default function Contact() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'jf@joysontech.com',
      href: 'mailto:jf@joysontech.com',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+44 (0) 123 456 789',
      href: 'tel:+44123456789',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'London, UK',
      href: 'https://maps.google.com/?q=London,UK',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      label: 'Timezone',
      value: 'GMT (UTC+0)',
      href: '#',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/in/joyson-fernandes',
      color: 'bg-[#0077B5] hover:bg-[#005885]'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/joysonfernandes',
      color: 'bg-gray-800 hover:bg-gray-900'
    },
    {
      name: 'Medium',
      icon: MessageSquare,
      href: 'https://medium.com/@joyson',
      color: 'bg-gray-700 hover:bg-gray-800'
    }
  ]

  if (!mounted) {
    return (
      <section className="section-padding relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8 max-w-md mx-auto" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-5 bg-gray-200 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-8 space-y-6">
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/12f9049c-ba5f-4dcb-b657-7c073ff7f26c.png"
            alt="Contact background"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-white/90 dark:from-gray-900/90 dark:to-gray-800/90" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to discuss your cloud infrastructure needs? Let's connect and explore how I can help transform your technology landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8 slide-in-left">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Whether you're looking to migrate to the cloud, implement DevOps practices, or need 
                infrastructure support, I'm here to help. Let's discuss how we can work together 
                to achieve your goals.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${contact.color} group-hover:scale-110 transition-transform`}>
                    <contact.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium">{contact.label}</div>
                    <div className="text-gray-900 font-semibold">{contact.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect With Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg ${social.color} text-white transition-all duration-200 hover:scale-110 shadow-lg`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="slide-in-right">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send Me a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Project inquiry, consultation, etc."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                    placeholder="Tell me about your project or how I can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                    ✅ Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                    ❌ Failed to send message. Please try again or contact me directly via email.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}
