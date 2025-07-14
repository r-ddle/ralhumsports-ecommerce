'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Globe, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function BrandPartners() {
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

  const featuredBrands = SITE_CONFIG.brands.slice(0, 6).map((brand, index) => ({
    ...brand,
    logo: `/placeholder.svg?height=80&width=200&text=${encodeURIComponent(brand.name)}`,
    description: [
      'World-renowned cricket equipment manufacturer',
      'Official rugby ball supplier for international matches',
      'Premium basketball and volleyball equipment',
      'Professional hockey equipment and accessories',
      'High-quality sports balls and training equipment',
      'Innovative sports gear and accessories',
    ][index],
    stats: [
      '150+ Years',
      'Official Partner',
      'Global Leader',
      'Premium Quality',
      'Trusted Brand',
      'Innovation First',
    ][index],
    specialties: [
      ['Cricket Bats', 'Protective Gear', 'Accessories'],
      ['Rugby Balls', 'Training Equipment', 'Match Gear'],
      ['Basketballs', 'Volleyballs', 'Court Equipment'],
      ['Hockey Sticks', 'Balls', 'Protective Gear'],
      ['Sports Balls', 'Training Aids', 'Equipment'],
      ['Innovative Gear', 'Accessories', 'Equipment'],
    ][index],
  }))

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
    >
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
            className="mb-4 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-50 to-red-50 text-brand-primary border border-orange-200"
          >
            <Award className="w-4 h-4 mr-2" />
            TRUSTED PARTNERS
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-4 sm:mb-6">
            World-Class Brands,
            <span className="block bg-gradient-to-r from-brand-primary to-primary-600 bg-clip-text text-transparent">
              Exclusive Distribution
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            As the exclusive distributor for premium sports brands in Sri Lanka, we bring you
            authentic, high-quality equipment trusted by professionals worldwide
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.1 : 0.6, delay: reducedMotion ? 0 : 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {[
            { icon: Globe, label: 'Global Brands', value: '6+' },
            { icon: Star, label: 'Years Experience', value: '25+' },
            { icon: CheckCircle, label: 'Products', value: '1000+' },
            { icon: Award, label: 'Satisfied Customers', value: '10K+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: reducedMotion ? 0.1 : 0.5,
                delay: reducedMotion ? 0 : 0.3 + index * 0.1,
              }}
              className="text-center p-4 sm:p-6 bg-brand-surface rounded-xl sm:rounded-2xl shadow-lg border border-brand-border"
            >
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-brand-secondary mx-auto mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-black text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-text-secondary font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {featuredBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={reducedMotion ? false : { opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: reducedMotion ? 0.1 : 0.6,
                delay: reducedMotion ? 0 : 0.4 + index * 0.1,
              }}
              className="group bg-brand-surface rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl border border-brand-border hover:border-gray-200 transition-all duration-300"
            >
              {/* Brand Logo */}
              <div className="mb-6 text-center">
                <div className="bg-gray-50 rounded-xl p-4 mb-4 group-hover:bg-gray-100 transition-colors duration-300">
                  <Image
                    src={brand.logo || '/placeholder.svg'}
                    alt={`${brand.name} logo`}
                    width={200}
                    height={80}
                    className="h-12 sm:h-16 w-auto mx-auto object-contain"
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-brand-secondary/10 to-secondary-600/10 text-brand-secondary border border-brand-secondary/20 text-xs"
                >
                  {brand.stats}
                </Badge>
              </div>

              {/* Brand Info */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
                  {brand.name}
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
                  {brand.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {brand.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="text-xs border-brand-border text-text-secondary hover:border-brand-secondary hover:text-brand-secondary transition-colors duration-200"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button
                size="sm"
                variant="outline"
                className="w-full border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all duration-200 group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-secondary bg-transparent"
                asChild
              >
                <Link href={`/brands?brand=${brand.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  View Products
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0.1 : 0.6, delay: reducedMotion ? 0 : 0.8 }}
          className="text-center bg-gradient-to-r from-brand-secondary to-secondary-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6">
            Ready to Experience Premium Quality?
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Discover our complete range of authentic sports equipment from the world&apos;s most
            trusted brands
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-brand-surface text-brand-secondary hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              asChild
            >
              <Link href="/brands">
                Explore All Brands
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-secondary font-bold px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
