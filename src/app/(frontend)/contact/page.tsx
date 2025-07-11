'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  Building,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    sport: '',
    message: '',
  })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Performance optimization: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `Hello Ralhum Sports!

*Contact Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
${formData.company ? `Company/Organization: ${formData.company}` : ''}
Sport Category: ${formData.sport || 'Not specified'}

*Message:*
${formData.message}

Thank you!`

    const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        duration: prefersReducedMotion ? 0 : 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5 },
    },
  }

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                  }
            }
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/15 to-teal-400/15 rounded-full blur-3xl"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 0.8, 1],
                    opacity: [0.4, 0.7, 0.4],
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                  }
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg backdrop-blur-sm border border-yellow-300/30"
            >
              <Sparkles className="w-4 h-4" />
              GET IN TOUCH
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                CONTACT
              </span>
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                OUR TEAM
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Ready to elevate your game? Get in touch with Sri Lanka&apos;s #1 sports equipment
              distributor. Our expert team is here to help you find the perfect equipment for your
              needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Information Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Phone,
                title: 'Call Us',
                primary: '+94 11 250 8082',
                secondary: 'Mon-Sat: 9AM-6PM',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                primary: '+94 77 123 4567',
                secondary: 'Quick Response',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Mail,
                title: 'Email Us',
                primary: 'info@ralhumsports.lk',
                secondary: '24/7 Support',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: MapPin,
                title: 'Visit Us',
                primary: '27, Hildon Place',
                secondary: 'Colombo 04, Sri Lanka',
                color: 'from-orange-500 to-red-500',
              },
            ].map((contact, index) => (
              <motion.div key={contact.title} variants={itemVariants}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <contact.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {contact.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      {contact.primary}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.secondary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Form & Map Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="mb-8">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-sm font-bold mb-4 shadow-lg">
                  SEND MESSAGE
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  <span className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                    GET A
                  </span>
                  <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    QUOTE
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Fill out the form below and our team will get back to you within 24 hours with a
                  personalized quote.
                </p>
              </div>

              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-base"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Company/Organization
                        </label>
                        <Input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                          placeholder="Your organization"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Sport Category
                      </label>
                      <select
                        name="sport"
                        value={formData.sport}
                        onChange={handleChange}
                        className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                      >
                        <option value="">Select a sport</option>
                        <option value="cricket">Cricket</option>
                        <option value="rugby">Rugby</option>
                        <option value="basketball">Basketball</option>
                        <option value="volleyball">Volleyball</option>
                        <option value="hockey">Hockey</option>
                        <option value="tennis">Tennis</option>
                        <option value="badminton">Badminton</option>
                        <option value="football">Football</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none"
                        placeholder="Tell us about your requirements, quantities needed, or any specific questions..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        SEND MESSAGE
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WHATSAPP US
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Map & Additional Info */}
            <motion.div variants={itemVariants}>
              <div className="mb-8">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 text-sm font-bold mb-4 shadow-lg">
                  VISIT OUR STORE
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  <span className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                    FIND
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    US
                  </span>
                </h2>
              </div>

              {/* Enhanced Google Maps */}
              <div className="rounded-2xl overflow-hidden h-64 mb-6 shadow-2xl border border-white/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798475087!2d79.85249831477!3d6.914712994999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259684e2f8b7b%3A0x8c8b8b8b8b8b8b8b!2sHildon%20Place%2C%20Colombo%2004%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ralhum Sports Location"
                ></iframe>
              </div>

              {/* Enhanced Store Information */}
              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Store Information
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        icon: MapPin,
                        title: 'Address',
                        content: '27, Hildon Place\nColombo 04, Sri Lanka',
                        color: 'text-red-500',
                      },
                      {
                        icon: Clock,
                        title: 'Business Hours',
                        content: 'Monday - Saturday: 9:00 AM - 6:00 PM\nSunday: Closed',
                        color: 'text-green-500',
                      },
                      {
                        icon: Building,
                        title: 'Facilities',
                        content: 'Product Display, Expert Consultation, Bulk Orders',
                        color: 'text-blue-500',
                      },
                    ].map((info) => (
                      <div
                        key={info.title}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl"
                      >
                        <info.icon className={`w-6 h-6 ${info.color} mt-1 flex-shrink-0`} />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white mb-1">
                            {info.title}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Social Media */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Follow Us</h3>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Quick Contact CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-black mb-4 text-white leading-tight"
            >
              NEED IMMEDIATE ASSISTANCE?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl mb-8 text-blue-100 leading-relaxed"
            >
              Our team is ready to help you with urgent orders or specific requirements
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Phone className="w-5 h-5 mr-2" />
                CALL NOW: +94 11 250 8082
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  const quickMessage = `Hello Ralhum Sports! I need immediate assistance with sports equipment. Please contact me as soon as possible. Thank you!`
                  const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(quickMessage)}`
                  window.open(whatsappUrl, '_blank')
                }}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-xl bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WHATSAPP CHAT
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
