'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Users,
  Award,
  TrendingUp,
  Target,
  Globe,
  Star,
  Trophy,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import { SITE_CONFIG } from '@/config/site-config'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// All data is now managed by SITE_CONFIG
const iconMap = { Calendar, Trophy, Award, TrendingUp } as const
type IconMapKey = keyof typeof iconMap

const timeline = SITE_CONFIG.about.timeline.map((item) => ({
  ...item,
  icon: iconMap[item.icon as IconMapKey] || Calendar,
}))
const brands = SITE_CONFIG.brands.map((b) => b.name)
const achievements = SITE_CONFIG.stats.map((stat, i) => {
  const icons = [Calendar, Trophy, Globe, Star]
  const colors = [
    'text-brand-secondary',
    'text-brand-primary',
    'text-brand-accent',
    'text-green-600',
  ]
  return {
    number: stat.number,
    label: stat.label,
    icon: icons[i % icons.length],
    color: colors[i % colors.length],
  }
})

export default function AboutPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Performance optimization: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

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
              {SITE_CONFIG.about.companyName?.toUpperCase() || 'OUR STORY'}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-text-primary">
                {SITE_CONFIG.about.yearsOfExcellence || '30'} YEARS OF
              </span>
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                EXCELLENCE
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              {SITE_CONFIG.about.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Achievement Stats */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-6 rounded-2xl bg-brand-background shadow-xl border border-brand-border hover:shadow-2xl transition-all duration-300"
                >
                  <IconComponent className={`w-8 h-8 ${achievement.color} mx-auto mb-4`} />
                  <div className={`text-4xl md:text-5xl font-black ${achievement.color} mb-2`}>
                    {achievement.number}
                  </div>
                  <p className="text-text-secondary font-medium leading-tight">
                    {achievement.label}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Who We Are Section */}
      <section className="py-16 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Badge className="bg-brand-secondary text-white px-4 py-2 text-sm font-bold mb-4 shadow-lg">
                  WHO WE ARE
                </Badge>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-black text-text-primary mb-6 leading-tight"
              >
                {SITE_CONFIG.about.companyName?.toUpperCase() || 'RALHUM TRADING'}
                <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  COMPANY
                </span>
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="space-y-6 text-text-secondary leading-relaxed"
              >
                <p className="text-lg">
                  <strong className="text-brand-secondary">{SITE_CONFIG.about.companyName}</strong>{' '}
                  was established in {SITE_CONFIG.about.established} primarily to take care of the
                  sports and consumer industry. Originally, the parent company of{' '}
                  {SITE_CONFIG.about.companyName} was{' '}
                  <strong className="text-brand-primary">
                    {SITE_CONFIG.about.legacy.parentCompany}
                  </strong>
                  , which was formed more than {SITE_CONFIG.about.legacy.parentCompanyYears} years
                  ago by S.M.M.Muhlar.
                </p>
                <p>{SITE_CONFIG.about.legacy.legacyText}</p>
                <div className="bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 rounded-xl p-4 border-l-4 border-brand-secondary">
                  <p className="text-lg font-semibold text-brand-secondary">
                    It can now be proudly stated that {SITE_CONFIG.about.companyName} is the leading
                    sports distributing company in Sri Lanka for over{' '}
                    {SITE_CONFIG.about.yearsOfExcellence} years.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <motion.div
                variants={itemVariants}
                className="bg-brand-surface rounded-2xl p-8 shadow-xl border border-brand-border"
              >
                <h3 className="text-2xl font-black mb-6 text-center text-brand-secondary">
                  OUR GLOBAL BRANDS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {brands.map((brand, index) => (
                    <motion.div
                      key={brand}
                      variants={itemVariants}
                      className="bg-brand-background rounded-lg p-3 text-center border border-brand-border shadow hover:shadow-lg transition-all duration-300"
                    >
                      <span className="font-bold text-sm text-text-primary">{brand}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Timeline Section */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-brand-accent text-white px-6 py-2 text-sm font-bold mb-4 shadow-lg">
                OUR JOURNEY
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black mb-6 text-text-primary"
            >
              HERITAGE
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                TIMELINE
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {timeline.map((milestone, index) => {
              const IconComponent = milestone.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="bg-brand-background border-brand-border hover:shadow-xl transition-all duration-500 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-2xl font-black text-brand-accent mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-text-primary">
                        {milestone.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed text-sm">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Present Day Section */}
      <section className="py-16 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="order-2 lg:order-1"
            >
              <motion.div
                variants={itemVariants}
                className="bg-brand-surface rounded-2xl p-8 shadow-xl border border-brand-border"
              >
                <h3 className="text-2xl font-black mb-6 text-brand-secondary">
                  CURRENT LEADERSHIP
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Users,
                      title: 'M.M.Mohamed',
                      desc: 'Current Head & Son of Founder Chairman',
                    },
                    {
                      icon: Globe,
                      title: 'Nationwide Network',
                      desc: 'Well-spread dealer network across Sri Lanka',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Export Operations',
                      desc: 'Exporting sports brands to other countries',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      variants={itemVariants}
                      className="flex items-center gap-4 p-3 rounded-xl bg-brand-background border border-brand-border hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center shadow-lg">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{item.title}</p>
                        <p className="text-sm text-text-secondary">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="order-1 lg:order-2 space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Badge className="bg-brand-primary text-white px-4 py-2 text-sm font-bold mb-4 shadow-lg">
                  RALHUM PRESENTLY
                </Badge>
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-black text-text-primary mb-6 leading-tight"
              >
                LEADING THE
                <span className="block bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent">
                  INDUSTRY
                </span>
              </motion.h2>
              <motion.div
                variants={itemVariants}
                className="space-y-6 text-text-secondary leading-relaxed"
              >
                <p className="text-lg">
                  Ralhum currently headed by{' '}
                  <strong className="text-brand-secondary">M.M.Mohamed</strong>, the son of the
                  founder company chairman S.M.M.Muhlar, is the leading sports equipment distributor
                  in Sri Lanka having in its portfolio all the leading brands.
                </p>
                <p>
                  With a well-spread dealer network right across the country, we ensure that quality
                  sports equipment reaches every corner of Sri Lanka. We also export some of our
                  sports brands to other countries, expanding our reach beyond national borders.
                </p>
                <div className="bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 rounded-xl p-4 border-l-4 border-brand-secondary">
                  <p className="font-semibold text-brand-secondary">
                    &quot;Our commitment to excellence and quality has made us the trusted choice
                    for athletes, schools, and sports enthusiasts across Sri Lanka.&quot;
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clean Vision Section - No More Gradients */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-brand-secondary text-white px-6 py-2 text-sm font-bold mb-4 shadow-lg">
                RALHUM IN THE FUTURE
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black mb-6 text-text-primary"
            >
              OUR
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                VISION
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Target,
                title: 'HOUSEHOLD NAME',
                description:
                  'To make Ralhum a household name for sports having a very solid reputation in whatever sports it serves and to give consumers the best quality at an affordable price.',
                color: 'text-brand-accent',
              },
              {
                icon: Trophy,
                title: 'RALHUM ELITE SQUAD',
                description:
                  'To have under our sponsorship a leading squad of players using the particular brands which Ralhum distributes. This elite squad will carry our name forward.',
                color: 'text-brand-primary',
              },
              {
                icon: Globe,
                title: 'REGIONAL EXPANSION',
                description:
                  'To expand the horizons of Ralhum to serve regions like South Asia and the Middle East with products and brands which are in demand.',
                color: 'text-brand-secondary',
              },
            ].map((vision, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-brand-background border-brand-border shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${vision.color} bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-current`}
                    >
                      <vision.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-text-primary">{vision.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{vision.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="text-xl mb-8 text-text-secondary leading-relaxed"
            >
              Carrying out operations in an ethically professional manner while building the future
              of sports in Sri Lanka
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                size="lg"
                className="bg-brand-secondary text-white hover:bg-secondary-600 px-8 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                JOIN OUR JOURNEY
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
