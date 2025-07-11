'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Award, Star, Target, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { SITE_CONFIG } from '@/config/site-config'
import Image from 'next/image'

export default function BrandPartners() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/6 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 0.8, 1], opacity: [0.4, 0.7, 0.4], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg backdrop-blur-sm border border-blue-300/30"
          >
            <Sparkles className="w-4 h-4" />
            EXCLUSIVE PARTNERSHIPS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
          >
            WORLD-RENOWNED
            <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              SPORTS BRANDS
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            As Sri Lanka&apos;s exclusive distributor, we bring you authentic equipment from the
            world&apos;s most trusted sports brands
          </motion.p>
        </motion.div>

        {/* Centered Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {SITE_CONFIG.brands.slice(0, 4).map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="overflow-hidden bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${brand.color} p-6 text-white relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

                    <div className="relative z-10 flex flex-col items-center">
                      {brand.image && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                          <Image
                            src={brand.image}
                            alt={`${brand.name} logo`}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain mb-2 rounded-md bg-white/80 p-1"
                            priority={index < 4}
                          />
                        </motion.div>
                      )}

                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        className="text-xl sm:text-2xl font-black mb-2"
                      >
                        {brand.name}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        className="text-xs sm:text-sm opacity-90"
                      >
                        {brand.heritage}
                      </motion.p>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                      <Badge className="bg-yellow-400 text-slate-900 mb-4 font-bold text-xs shadow-lg">
                        {brand.specialty}
                      </Badge>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base"
                    >
                      {brand.description}
                    </motion.p>

                    <div className="space-y-3">
                      {brand.achievements.map((achievement, i) => (
                        <motion.div
                          key={achievement}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 + i * 0.1 }}
                          className="flex items-center gap-3 group/achievement"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-lime-400 to-green-400 rounded-full flex-shrink-0 group-hover/achievement:scale-125 transition-transform" />
                          <span className="text-xs sm:text-sm text-slate-300 font-medium group-hover/achievement:text-white transition-colors">
                            {achievement}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Brands Button */}
        <div className="flex justify-center mt-10">
          <a
            href="/brands"
            className="inline-block px-8 py-3 rounded-full font-bold text-base bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-300"
          >
            View All Brands
          </a>
        </div>
      </div>
    </section>
  )
}
