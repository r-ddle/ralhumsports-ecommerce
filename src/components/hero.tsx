'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#003DA5] via-[#1A1A1A] to-[#003DA5]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-[#FF3D00] rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Heritage Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-[#FFD700] text-[#1A1A1A] px-6 py-2 rounded-full font-bold text-sm mb-8"
        >
          <Star className="w-4 h-4" />
          EST. 1996 - 25+ YEARS OF EXCELLENCE
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
        >
          SRI LANKA&apos;S
          <span className="block bg-gradient-to-r from-[#FFD700] to-[#AEEA00] bg-clip-text text-transparent">
            #1 SPORTS
          </span>
          <span className="block text-[#FF3D00]">DISTRIBUTOR</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
        >
          Exclusive distributor of world-renowned brands including
          <span className="text-[#FFD700] font-bold"> Gray-Nicolls</span>,
          <span className="text-[#AEEA00] font-bold"> Gilbert</span>,
          <span className="text-[#FF3D00] font-bold"> Grays</span> &
          <span className="text-[#FFD700] font-bold"> Molten</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
        >
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              START SHOPPING
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <a href="/contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A] px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 bg-transparent"
            >
              CONTACT US
            </Button>
          </a>
        </motion.div>

        {/* Floating Brand Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 sm:mt-16 flex justify-center items-center gap-3 sm:gap-8 flex-wrap px-4"
        >
          {['Gray-Nicolls', 'Gilbert', 'Grays', 'Molten'].map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <span className="text-white font-semibold text-sm sm:text-base">{brand}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className=" w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div> */}
    </section>
  )
}
