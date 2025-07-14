'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Trophy, Users, Target, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export default function Heritage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const milestones = [
    {
      year: '1999',
      title: 'Company Founded',
      description:
        'Started as a small sports equipment retailer with a vision to bring quality gear to Sri Lankan athletes',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2005',
      title: 'First Brand Partnership',
      description:
        'Became the exclusive distributor for Gray-Nicolls cricket equipment in Sri Lanka',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500',
    },
    {
      year: '2010',
      title: 'Expanded Portfolio',
      description:
        'Added Gilbert, Grays, and Molten to our brand portfolio, covering multiple sports',
      icon: Target,
      color: 'from-orange-500 to-red-500',
    },
    {
      year: '2015',
      title: '10,000+ Customers',
      description:
        'Reached a milestone of serving over 10,000 satisfied customers across the island',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched our online store and digital presence to serve customers nationwide',
      icon: Zap,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      year: '2024',
      title: SITE_CONFIG.about.yearsOfExcellence + ' Years of Excellence',
      description:
        'Celebrating a quarter-century of providing premium sports equipment to Sri Lankan athletes',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  const achievements = [
    { label: 'Years of Excellence', value: SITE_CONFIG.about.yearsOfExcellence, suffix: '+' },
    { label: 'Brand Partners', value: SITE_CONFIG.brands.length.toString(), suffix: '' },
    { label: 'Products Available', value: '1000', suffix: '+' },
    { label: 'Happy Customers', value: '10K', suffix: '+' },
  ]

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.1 : 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 text-brand-primary border border-brand-primary/20"
          >
            <Award className="w-4 h-4 mr-2" />
            OUR HERITAGE
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4 sm:mb-6">
            {SITE_CONFIG.about.yearsOfExcellence} Years of
            <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Athletic Excellence
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to becoming Sri Lanka&apos;s premier sports equipment
            distributor, our journey has been driven by passion for sports and commitment to quality
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.1 : 0.6, delay: reducedMotion ? 0 : 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: reducedMotion ? 0.1 : 0.5,
                delay: reducedMotion ? 0 : 0.3 + index * 0.1,
              }}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-brand-background to-blue-50 rounded-xl sm:rounded-2xl border border-gray-200"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-secondary mb-2">
                {achievement.value}
                {achievement.suffix}
              </div>
              <div className="text-xs sm:text-sm text-text-secondary font-medium">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-brand-secondary via-brand-primary to-brand-accent rounded-full h-full" />

          <div className="space-y-8 sm:space-y-12">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={milestone.year}
                  initial={reducedMotion ? false : { opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: reducedMotion ? 0.1 : 0.6,
                    delay: reducedMotion ? 0 : 0.4 + index * 0.1,
                  }}
                  className={`relative flex items-center ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:gap-8`}
                >
                  {/* Timeline Node - Hidden on mobile */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-brand-secondary rounded-full z-10" />

                  {/* Content Card */}
                  <div
                    className={`w-full lg:w-5/12 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}
                  >
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      {/* Year Badge */}
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm mb-4 bg-gradient-to-r ${milestone.color}`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {milestone.year}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for opposite side on desktop */}
                  <div className="hidden lg:block w-5/12" />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Clean CTA Section - No Background Image */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.1 : 0.6, delay: reducedMotion ? 0 : 0.8 }}
          className="text-center mt-12 sm:mt-16 bg-gradient-to-r from-brand-secondary to-secondary-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6">
            Be Part of Our Continuing Story
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who trust Ralhum Sports for their equipment needs. Experience
            the quality and service that has made us Sri Lanka&apos;s #1 choice for{' '}
            {SITE_CONFIG.about.yearsOfExcellence} years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-brand-surface text-brand-secondary hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              asChild
            >
              <Link href="/products">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-secondary font-bold px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 bg-transparent"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
