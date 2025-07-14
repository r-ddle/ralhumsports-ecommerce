'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Trophy, Target, Users } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function SportsCategories() {
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

  const categories = [
    {
      id: 'cricket',
      name: 'Cricket',
      description: 'Professional cricket equipment from Gray-Nicolls, Grays & more',
      icon: Target,
      image: '/cricket.avif',
      products: ['Bats', 'Balls', 'Protective Gear', 'Accessories'],
      featured: true,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'rugby',
      name: 'Rugby',
      description: 'Official Gilbert rugby balls and professional equipment',
      icon: Trophy,
      image: '/rugby.avif',
      products: ['Balls', 'Training Equipment', 'Protective Gear'],
      featured: true,
      color: 'from-brand-secondary to-secondary-600',
      stats: '200+ Products',
    },
    {
      id: 'basketball',
      name: 'Basketball',
      description: 'Premium Molten basketballs and court equipment',
      icon: Zap,
      image: '/basketball.avif',
      products: ['Balls', 'Hoops', 'Training Aids', 'Accessories'],
      featured: false,
      color: 'from-brand-primary to-primary-600',
    },
    {
      id: 'hockey',
      name: 'Hockey',
      description: 'Professional hockey sticks, balls and protective equipment',
      icon: Users,
      image: '/hockey.avif',
      products: ['Sticks', 'Balls', 'Protective Gear', 'Goals'],
      featured: false,
      color: 'from-brand-accent to-warning',
    },
  ]

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 bg-brand-surface overflow-hidden">
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
            className="mb-4 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 text-brand-secondary border border-blue-200"
          >
            <Zap className="w-4 h-4 mr-2" />
            SPORTS CATEGORIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4 sm:mb-6">
            Equipment for Every
            <span className="block bg-gradient-to-r from-brand-secondary to-secondary-600 bg-clip-text text-transparent">
              Sport & Athlete
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            From professional cricket gear to premium rugby equipment, we have everything you need
            to excel in your sport
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                initial={reducedMotion ? false : { opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.6,
                  delay: reducedMotion ? 0 : index * 0.1,
                }}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${category.color} shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  category.featured ? 'lg:col-span-1' : ''
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Image
                    src={category.image || '/placeholder.svg'}
                    alt={`${category.name} equipment`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-900/20 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between min-h-[300px] sm:min-h-[350px]">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      {category.featured && (
                        <Badge className="bg-brand-accent text-white font-bold text-xs px-2 py-1">
                          FEATURED
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Product Types */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {category.products.slice(0, 3).map((product) => (
                        <Badge
                          key={product}
                          variant="secondary"
                          className="bg-white/20 text-white border-white/30 text-xs"
                        >
                          {product}
                        </Badge>
                      ))}
                      {category.products.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white border-white/30 text-xs"
                        >
                          +{category.products.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      asChild
                    >
                      <Link href={`/products?category=${category.id}`}>
                        Shop Now
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.1 : 0.6, delay: reducedMotion ? 0 : 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Button
            size="lg"
            className="bg-brand-secondary hover:bg-secondary-600 text-white font-bold px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
            asChild
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
