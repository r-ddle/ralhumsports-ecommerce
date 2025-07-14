'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

export default function Hero() {
  const hasAnimated = useRef(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const getInitial = () => {
    if (reducedMotion) return false
    if (!hasAnimated.current) {
      hasAnimated.current = true
      return undefined
    }
    return false
  }

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32 md:py-40 lg:py-48"
      style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--secondary-blue))' }}
    >
      {/* Enhanced Animated Background - Only on desktop and with motion preference */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(255, 107, 53, 0.2), rgba(243, 156, 18, 0.2))',
          }}
        />

        {/* Floating Orbs - Only on desktop without reduced motion */}
        {!reducedMotion && (
          <>
            <motion.div
              className="hidden lg:block absolute top-1/4 left-1/6 w-72 h-72 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(59, 130, 246, 0.3), rgba(255, 107, 53, 0.3))',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="hidden lg:block absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-brand-accent/25 to-brand-primary/25 rounded-full blur-3xl"
              animate={{
                scale: [1, 0.8, 1],
                opacity: [0.4, 0.7, 0.4],
                x: [0, -40, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
            <motion.div
              className="hidden lg:block absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-brand-primary/30 to-brand-accent/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, 20, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 4,
              }}
            />
          </>
        )}

        {/* Static geometric accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-accent/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-brand-primary/10 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Heritage Badge */}
        <motion.div
          initial={getInitial() ?? { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.8 }}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm mb-6 sm:mb-8 bg-gradient-to-r from-brand-accent to-brand-primary text-white shadow-lg backdrop-blur-sm border border-brand-accent/30"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="sr-only">Celebrating</span>
          {SITE_CONFIG.about.yearsOfExcellence} YEARS OF EXCELLENCE
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={getInitial() ?? { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 1, delay: reducedMotion ? 0 : 0.2 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-tight"
        >
          <motion.span
            initial={getInitial() ?? { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.8, delay: reducedMotion ? 0 : 0.4 }}
            className="block"
          >
            Sri Lanka&apos;s
          </motion.span>
          <motion.span
            initial={getInitial() ?? { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.8, delay: reducedMotion ? 0 : 0.6 }}
            className="block bg-gradient-to-r from-brand-accent via-brand-primary to-brand-accent bg-clip-text text-transparent drop-shadow-lg"
          >
            #1 SPORTS EQUIPMENT
          </motion.span>
          <motion.span
            initial={getInitial() ?? { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.8, delay: reducedMotion ? 0 : 0.8 }}
            className="block"
          >
            DISTRIBUTOR
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={getInitial() ?? { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.8, delay: reducedMotion ? 0 : 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4"
        >
          Exclusive distributor of world-renowned brands including
          {SITE_CONFIG.brands.slice(0, 4).map((brand, i) => (
            <motion.span
              key={brand.name}
              initial={getInitial() ?? { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 1 + i * 0.1 }}
              className="font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"
            >
              {' '}
              {brand.name}
              {i < Math.min(3, SITE_CONFIG.brands.length - 1) ? ',' : ''}
            </motion.span>
          ))}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={getInitial() ?? { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.8, delay: reducedMotion ? 0 : 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-8 sm:mb-12"
        >
          <Link href="/products" className="w-full max-w-[280px] sm:w-auto">
            <Button
              size="lg"
              className="w-full font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl text-white bg-gradient-to-r from-brand-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 border-0 relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <span className="relative z-10 flex items-center justify-center">
                {SITE_CONFIG.branding.cta.shop}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full max-w-[280px] sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 bg-white/5 backdrop-blur-sm border-brand-accent/50 text-brand-accent hover:bg-brand-accent/10 hover:border-brand-accent hover:text-white hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
            >
              {SITE_CONFIG.branding.cta.contact}
            </Button>
          </Link>
        </motion.div>

        {/* Brand Logos */}
        <motion.div
          initial={getInitial() ?? { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.1 : 1, delay: reducedMotion ? 0 : 0.8 }}
          className="mt-8 sm:mt-12 lg:mt-16 overflow-hidden"
          role="region"
          aria-label="Partner brands"
        >
          <div
            className={`flex gap-2 sm:gap-3 lg:gap-6 ${!reducedMotion ? 'animate-infinite-scroll' : 'justify-center flex-wrap'}`}
          >
            {(reducedMotion
              ? SITE_CONFIG.brands.slice(0, 6)
              : [...SITE_CONFIG.brands, ...SITE_CONFIG.brands]
            ).map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                initial={getInitial() ?? { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.6,
                  delay: reducedMotion ? 0 : 0.8 + (index % SITE_CONFIG.brands.length) * 0.1,
                }}
                whileHover={!reducedMotion ? { scale: 1.05, y: -5 } : {}}
                className="bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-lg whitespace-nowrap flex-shrink-0"
              >
                <span className="text-white font-semibold text-xs sm:text-sm lg:text-base tracking-wide">
                  {brand.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
