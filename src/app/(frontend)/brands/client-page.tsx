'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Trophy,
  Award,
  TrendingUp,
  Target,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Package,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

// Icon mapping for dynamic icon rendering
const iconMap = {
  Calendar,
  Trophy,
  Award,
  TrendingUp,
  Target,
  Globe,
  Star,
  CheckCircle,
  Package,
} as const
type IconMapKey = keyof typeof iconMap

export default function BrandsPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Performance optimization: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Show all brands from SITE_CONFIG
  const enhancedBrands = SITE_CONFIG.brands.map((brand, index) => ({
    ...brand,
    icon: iconMap[brand.icon as IconMapKey] || Trophy,
    gradient: [
      'from-brand-secondary to-secondary-600',
      'from-brand-primary to-primary-600',
      'from-brand-accent to-warning',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-purple-600',
      'from-cyan-500 to-cyan-600',
    ][index % 6],
  }))

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
    <main className="min-h-screen pt-8 bg-brand-background">
      {/* Clean Hero Section - Like tracking page */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-brand-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 rounded-full blur-3xl"
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
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-brand-accent text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              PREMIUM BRANDS
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-text-primary">WORLD-CLASS</span>
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                SPORTS BRANDS
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              As Sri Lanka&apos;s #1 sports equipment distributor, we&apos;re proud to be the
              exclusive distributor for premium sports brands trusted by professionals worldwide.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Brand Statistics */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                number: `${SITE_CONFIG.brands.length}+`,
                label: 'Premium Brands',
                icon: Trophy,
                color: 'text-brand-secondary',
              },
              {
                number: SITE_CONFIG.about.yearsOfExcellence + '+',
                label: 'Years of Excellence',
                icon: Calendar,
                color: 'text-brand-primary',
              },
              {
                number: '1000+',
                label: 'Products Available',
                icon: Package,
                color: 'text-brand-accent',
              },
              {
                number: '10K+',
                label: 'Happy Customers',
                icon: CheckCircle,
                color: 'text-green-600',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-6 rounded-2xl bg-brand-background shadow-xl border border-brand-border hover:shadow-2xl transition-all duration-300"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                <div className={`text-4xl md:text-5xl font-black ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <p className="text-text-secondary font-medium leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Brands Grid - Show All Brands */}
      <section className="py-16 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Badge className="bg-gradient-to-r from-brand-primary to-primary-600 text-white px-6 py-2 text-sm font-bold mb-4 shadow-lg">
              OUR EXCLUSIVE PARTNERS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary mb-6 leading-tight">
              TRUSTED BY
              <span className="block bg-gradient-to-r from-brand-secondary to-secondary-600 bg-clip-text text-transparent">
                PROFESSIONALS
              </span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              From cricket legends to Olympic athletes, our partner brands are chosen by champions
              worldwide.
            </p>
          </motion.div>

          {/* Display ALL brands from SITE_CONFIG */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {enhancedBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                variants={itemVariants}
                className="group bg-brand-surface rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-brand-border hover:border-gray-200 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Brand Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center shadow-lg overflow-hidden`}
                      >
                        {brand.image ? (
                          <Image
                            src={brand.image}
                            alt={brand.name + ' logo'}
                            width={48}
                            height={48}
                            className="object-contain w-10 h-10"
                            unoptimized
                          />
                        ) : (
                          <brand.icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-text-primary">{brand.name}</h3>
                        <p className="text-sm text-text-secondary font-medium">{brand.heritage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-brand-secondary mb-2">{brand.tagline}</h4>
                  <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3">
                    {brand.description}
                  </p>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide">
                    Key Achievements
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {brand.achievements.slice(0, 3).map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-text-secondary">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide">
                    Product Range
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(brand.products ?? []).slice(0, 3).map((product) => (
                      <Badge
                        key={product.name}
                        variant="outline"
                        className="text-xs border-brand-border text-text-secondary hover:border-brand-secondary hover:text-brand-secondary transition-colors duration-200"
                      >
                        {product.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  size="sm"
                  className={`w-full bg-gradient-to-r ${brand.gradient} text-white hover:shadow-lg transition-all duration-200 group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-secondary`}
                  asChild
                >
                  <Link href={`/products?brand=${brand.slug}`}>
                    Explore {brand.name} Products
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-black mb-4 text-text-primary leading-tight"
            >
              Ready to Experience Premium Quality?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl mb-8 text-text-secondary leading-relaxed"
            >
              Discover why professional athletes and sports enthusiasts across Sri Lanka choose our
              authentic equipment.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-brand-primary to-primary-600 hover:from-primary-600 hover:to-brand-primary text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                asChild
              >
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-[1.02]"
                asChild
              >
                <Link href="/contact">Get Expert Advice</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
