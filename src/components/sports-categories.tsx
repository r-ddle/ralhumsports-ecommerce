'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const sportsCategories = [
  {
    name: 'Cricket',
    description: 'Complete cricket equipment from bats to protective gear',
    featured: 'Gray-Nicolls Partnership',
    image: '/placeholder.svg?height=400&width=600',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    popular: true,
  },
  {
    name: 'Rugby',
    description: 'Professional rugby equipment and training gear',
    featured: 'Gilbert Official',
    image: '/placeholder.svg?height=400&width=600',
    gradient: 'from-orange-600 via-red-500 to-pink-400',
    popular: false,
  },
  {
    name: 'Basketball',
    description: 'Court equipment and professional basketballs',
    featured: 'Molten Official',
    image: '/placeholder.svg?height=400&width=600',
    gradient: 'from-yellow-500 via-orange-400 to-red-400',
    popular: true,
  },
  {
    name: 'Hockey',
    description: 'Field hockey sticks and protective equipment',
    featured: 'Grays Excellence',
    image: '/placeholder.svg?height=400&width=600',
    gradient: 'from-green-500 via-emerald-400 to-teal-400',
    popular: false,
  },
  {
    name: 'Volleyball',
    description: 'Professional volleyballs and net systems',
    featured: 'Molten Quality',
    image: '/placeholder.svg?height=400&width=600',
    gradient: 'from-purple-600 via-violet-500 to-indigo-400',
    popular: false,
  },
  {
    name: 'Tennis',
    description: 'Rackets, balls, and court accessories',
    featured: 'Premium Selection',
    image: '/placeholder.svg?height=400&width=600',
    gradient: 'from-lime-500 via-green-400 to-emerald-400',
    popular: true,
  },
]

export default function SportsCategories() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Modern Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-red-300/20 rounded-full blur-3xl"
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Enhanced Section Header */}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg backdrop-blur-sm border border-orange-300/30"
          >
            <Sparkles className="w-4 h-4" />
            SPORTS CATEGORIES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight"
          >
            EVERY SPORT,
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              EVERY LEVEL
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            From school teams to professional athletes, we supply equipment for every sport and
            skill level
          </motion.p>
        </motion.div>

        {/* Enhanced Sports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sportsCategories.map((sport, index) => (
            <motion.div
              key={sport.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="overflow-hidden bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-0">
                  {/* Enhanced Image Section */}
                  <div className="relative overflow-hidden">
                    <Image
                      width={600}
                      height={400}
                      src={sport.image || '/placeholder.svg'}
                      alt={sport.name}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${sport.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
                    />

                    {/* Popular Badge */}
                    {sport.popular && (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="absolute top-4 left-4"
                      >
                        <Badge className="bg-yellow-400 text-slate-900 font-bold text-xs shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          POPULAR
                        </Badge>
                      </motion.div>
                    )}

                    {/* Sport Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg"
                      >
                        {sport.name}
                      </motion.h3>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                          {sport.featured}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>

                  {/* Enhanced Content Section */}
                  <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm sm:text-base"
                    >
                      {sport.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    >
                      <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-bold transition-all duration-300 group/btn shadow-lg hover:shadow-xl">
                        EXPLORE {sport.name.toUpperCase()}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 p-8 sm:p-12 text-white shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="relative z-10 text-center">
              <motion.h3
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-black mb-4"
              >
                CAN&apos;T FIND YOUR SPORT?
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
              >
                We also supply equipment for Badminton, Netball, Football and more
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  asChild
                >
                  <a href="/contact">
                    CONTACT US
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
