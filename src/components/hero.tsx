'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SITE_CONFIG } from '@/config/site-config'

export default function Hero() {
  const hasAnimated = useRef(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [brandImages, setBrandImages] = useState<Record<string, string>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Enhanced image loading with better error handling and validation
  useEffect(() => {
    const loadBrandImages = async () => {
      const imageMap: Record<string, string> = {}
      let loadedCount = 0
      let errorCount = 0

      console.log('🎨 Loading brand images from SITE_CONFIG...')

      SITE_CONFIG.brands.forEach((brand) => {
        if (brand.image) {
          // Ensure the image path is properly formatted
          const imagePath = brand.image.startsWith('/') ? brand.image : `/${brand.image}`
          imageMap[brand.name] = imagePath
          loadedCount++
        } else {
          console.warn(`⚠️ No image configured for brand: ${brand.name}`)
          errorCount++
        }
      })

      console.log(`✅ Brand images loaded: ${loadedCount} successful, ${errorCount} missing`)
      setBrandImages(imageMap)
    }

    loadBrandImages()
  }, [])

  const handleImageError = (brandName: string) => {
    console.warn(`❌ Failed to load image for brand: ${brandName}`)
    setImageErrors((prev) => ({
      ...prev,
      [brandName]: true,
    }))
  }

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
      className="relative overflow-hidden py-24 sm:py-32 md:py-40 lg:py-48 bg-heroBanner bg-cover bg-center text-white flex items-center justify-center"
      style={{
        backgroundImage: `url('/ralhummainbackground.jpg'), var(--tw-gradient-stops)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Enhanced Animated Background - Only on desktop and with motion preference */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/ralhummainbackground.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Enhanced dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

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
          className="relative z-10 inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm mb-6 sm:mb-8 bg-gradient-to-r from-brand-accent to-brand-primary text-white"
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
          className="relative z-10 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-tight"
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
            className="block text-brand-primary"
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

        {/* Full-Width Brand Carousel */}
        <motion.div
          initial={getInitial() ?? { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.1 : 1, delay: reducedMotion ? 0 : 0.8 }}
          className="mt-8 sm:mt-12 lg:mt-16 relative"
        >
          {/* Break out of container constraints */}
          <div
            className="w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-hidden"
            role="region"
            aria-label="Partner brands showcase"
          >
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black/60 to-transparent z-10 pointer-events-none" />

            {/* Scrolling container */}
            <div
              className={`flex gap-4 sm:gap-6 py-6 ${
                !reducedMotion ? 'animate-infinite-scroll' : 'justify-center flex-wrap px-8'
              }`}
              style={{
                animation: !reducedMotion ? 'scroll 35s linear infinite' : 'none',
                width: !reducedMotion ? 'max-content' : 'auto',
              }}
            >
              {/* CSS Keyframes for smooth scrolling */}
              <style jsx>{`
                @keyframes scroll {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-infinite-scroll:hover {
                  animation-play-state: paused;
                }
              `}</style>

              {/* Render brands - duplicate for seamless loop */}
              {(reducedMotion
                ? SITE_CONFIG.brands
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
                  whileHover={!reducedMotion ? { scale: 1.03, y: -4 } : {}}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-white/10 w-32 sm:w-36 lg:w-40 h-28 sm:h-32 lg:h-36">
                    <div className="p-3 sm:p-4 text-center h-full flex flex-col justify-center">
                      {/* Brand logo with enhanced loading and error handling */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-white/90 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden flex-shrink-0">
                        {brandImages[brand.name] && !imageErrors[brand.name] ? (
                          <Image
                            src={brandImages[brand.name]}
                            alt={`${brand.name} logo`}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain p-1"
                            onError={() => handleImageError(brand.name)}
                            onLoad={() =>
                              console.log(`✅ Image loaded successfully: ${brand.name}`)
                            }
                            priority={index < 6} // Prioritize first 6 images
                          />
                        ) : (
                          // Enhanced fallback with better styling
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-lg sm:text-xl font-black text-gray-700">
                              {brand.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Brand name - smaller and more compact */}
                      <h3 className="text-white font-bold text-sm sm:text-base mb-1 group-hover:text-brand-accent transition-colors duration-300 leading-tight flex-shrink-0">
                        {brand.name}
                      </h3>

                      {/* Brand category - smaller text */}
                      <p className="text-white/60 text-xs sm:text-sm font-medium flex-shrink-0">
                        {brand.category}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
