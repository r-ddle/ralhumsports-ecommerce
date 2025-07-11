'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-gradient-shift" />

        {/* Modern Floating Orbs with Glassmorphism */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/25 to-teal-400/25 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Geometric Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-transparent rounded-full blur-2xl" />

        {/* Modern Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Enhanced Heritage Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg backdrop-blur-sm border border-yellow-300/30"
        >
          <Sparkles className="w-4 h-4" />
          {SITE_CONFIG.about.yearsOfExcellence} YEARS OF EXCELLENCE
        </motion.div>

        {/* Enhanced Main Heading with Text Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="block"
          >
            Sri Lanka&apos;s
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg"
          >
            #1 SPORTS EQUIPMENT
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="block"
          >
            DISTRIBUTOR
          </motion.span>
        </motion.h1>

        {/* Enhanced Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
        >
          Exclusive distributor of world-renowned brands including
          {SITE_CONFIG.brands.map((brand, i) => (
            <motion.span
              key={brand.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
            >
              {' '}
              {brand.name}
              {i < SITE_CONFIG.brands.length - 1 ? ',' : ''}
            </motion.span>
          ))}
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-8"
        >
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto font-bold px-6 sm:px-8 py-4 text-base sm:text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                {SITE_CONFIG.branding.cta.shop}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          <a href="/contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 bg-white/5 backdrop-blur-sm border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 hover:text-white hover:font-normal hover:scale-105"
            >
              {SITE_CONFIG.branding.cta.contact}
            </Button>
          </a>
        </motion.div>

        {/* Enhanced Brand Logos with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-16 flex justify-center items-center gap-3 sm:gap-6 flex-wrap px-4"
        >
          {SITE_CONFIG.brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <span className="text-white font-semibold text-sm sm:text-base tracking-wide">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
