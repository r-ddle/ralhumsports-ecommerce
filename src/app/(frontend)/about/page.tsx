'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Award, TrendingUp, Target, Globe, Star, Trophy } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site-config'

// All data is now managed by SITE_CONFIG
const iconMap = { Calendar, Trophy, Award, TrendingUp } as const
type IconMapKey = keyof typeof iconMap

const timeline = SITE_CONFIG.about.timeline.map((item) => ({
  ...item,
  icon: iconMap[item.icon as IconMapKey] || Calendar,
}))
const brands = SITE_CONFIG.brands.map((b) => b.name)
const achievements = SITE_CONFIG.stats.map((stat, i) => {
  // Map color to gradient for visual consistency
  const gradients = [
    'from-[#003DA5] to-[#0052CC]',
    'from-[#FF3D00] to-[#FF6B47]',
    'from-[#AEEA00] to-[#7CB342]',
    'from-[#FFD700] to-[#FFA500]',
  ]
  const icons = [Calendar, Trophy, Globe, Star]
  return {
    number: stat.number,
    label: stat.label,
    icon: icons[i % icons.length],
    gradient: gradients[i % gradients.length],
  }
})

export default function AboutPage() {
  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#1A1A1A] text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-20 left-20 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
          ></div>
          <div
            className={`absolute bottom-20 right-20 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-pulse delay-1000' : ''}`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/3 w-24 h-24 bg-[#FF3D00] rounded-full blur-2xl ${!prefersReducedMotion ? 'animate-bounce' : ''}`}
          ></div>
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 backdrop-blur-sm"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <Badge
              className={`bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4 shadow-lg backdrop-blur-sm border border-white/20 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
            >
              {SITE_CONFIG.about.companyName?.toUpperCase() || 'OUR STORY'}
            </Badge>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
            >
              {SITE_CONFIG.about.yearsOfExcellence || '75+'} YEARS OF
              <span className="block bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] bg-clip-text text-transparent">
                EXCELLENCE
              </span>
            </h1>
            <p
              className={`text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed ${!prefersReducedMotion ? 'animate-fade-in-up delay-400' : ''}`}
            >
              {SITE_CONFIG.about.description}
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Achievement Stats */}
      <section className="py-20 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #003DA5 2px, transparent 2px), radial-gradient(circle at 75% 75%, #FF3D00 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-white/20 ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300 animate-fade-in-up' : ''}`}
                  style={!prefersReducedMotion ? { animationDelay: `${index * 150}ms` } : {}}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${achievement.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div
                    className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${achievement.gradient} bg-clip-text text-transparent mb-2`}
                  >
                    {achievement.number}
                  </div>
                  <p className="text-gray-600 font-medium leading-tight">{achievement.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Who We Are Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={!prefersReducedMotion ? 'animate-fade-in-up' : ''}>
              <Badge className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white px-4 py-2 text-sm font-bold mb-4 shadow-lg">
                WHO WE ARE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6 leading-tight">
                {SITE_CONFIG.about.companyName?.toUpperCase() || 'RALHUM TRADING'}
                <span className="block bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] bg-clip-text text-transparent">
                  COMPANY
                </span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-[#003DA5]">{SITE_CONFIG.about.companyName}</strong> was
                  established in {SITE_CONFIG.about.established} primarily to take care of the
                  sports and consumer industry. Originally, the parent company of{' '}
                  {SITE_CONFIG.about.companyName} was{' '}
                  <strong className="text-[#FF3D00]">
                    {SITE_CONFIG.about.legacy.parentCompany}
                  </strong>
                  , which was formed more than {SITE_CONFIG.about.legacy.parentCompanyYears} years
                  ago by S.M.M.Muhlar.
                </p>
                <p>{SITE_CONFIG.about.legacy.legacyText}</p>
                <div className="bg-gradient-to-r from-[#003DA5]/10 to-[#FF3D00]/10 rounded-xl p-4 border-l-4 border-[#003DA5]">
                  <p className="text-lg font-semibold text-[#003DA5]">
                    It can now be proudly stated that {SITE_CONFIG.about.companyName} is the leading
                    sports distributing company in Sri Lanka for over{' '}
                    {SITE_CONFIG.about.yearsOfExcellence} years.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`relative ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
            >
              <div className="bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#FF3D00] rounded-2xl p-8 text-white shadow-2xl backdrop-blur-md">
                <h3 className="text-2xl font-black mb-6 text-center">OUR GLOBAL BRANDS</h3>
                <div className="grid grid-cols-2 gap-4">
                  {brands.map((brand, index) => (
                    <div
                      key={brand}
                      className={`bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm border border-white/20 shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                      style={!prefersReducedMotion ? { animationDelay: `${index * 100}ms` } : {}}
                    >
                      <span className="font-bold text-sm">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Timeline Section */}
      <section className="py-20 bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-10 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-float' : ''}`}
          ></div>
          <div
            className={`absolute bottom-10 right-10 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-float delay-1000' : ''}`}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className={`text-center mb-16 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
            <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4 shadow-lg">
              OUR JOURNEY
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              HERITAGE
              <span className="block bg-gradient-to-r from-[#AEEA00] to-[#7CB342] bg-clip-text text-transparent">
                TIMELINE
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((milestone, index) => {
              const IconComponent = milestone.icon
              return (
                <Card
                  key={index}
                  className={`bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500 shadow-2xl ${!prefersReducedMotion ? 'hover:scale-105 animate-fade-in-up' : ''}`}
                  style={!prefersReducedMotion ? { animationDelay: `${index * 200}ms` } : {}}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-black bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{milestone.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{milestone.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Present Day Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`order-2 lg:order-1 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
            >
              <div className="bg-gradient-to-br from-[#AEEA00] via-[#7CB342] to-[#FFD700] rounded-2xl p-8 text-[#1A1A1A] shadow-2xl">
                <h3 className="text-2xl font-black mb-6">CURRENT LEADERSHIP</h3>
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
                    <div
                      key={item.title}
                      className={`flex items-center gap-4 p-3 rounded-xl bg-[#1A1A1A]/10 backdrop-blur-sm ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                    >
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-lg">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm opacity-80">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`order-1 lg:order-2 ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
            >
              <Badge className="bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] text-white px-4 py-2 text-sm font-bold mb-4 shadow-lg">
                RALHUM PRESENTLY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6 leading-tight">
                LEADING THE
                <span className="block bg-gradient-to-r from-[#003DA5] to-[#0052CC] bg-clip-text text-transparent">
                  INDUSTRY
                </span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Ralhum currently headed by <strong className="text-[#003DA5]">M.M.Mohamed</strong>
                  , the son of the founder company chairman S.M.M.Muhlar, is the leading sports
                  equipment distributor in Sri Lanka having in its portfolio all the leading brands.
                </p>
                <p>
                  With a well-spread dealer network right across the country, we ensure that quality
                  sports equipment reaches every corner of Sri Lanka. We also export some of our
                  sports brands to other countries, expanding our reach beyond national borders.
                </p>
                <div className="bg-gradient-to-r from-[#003DA5]/10 to-[#FF3D00]/10 rounded-xl p-4 border-l-4 border-[#003DA5] backdrop-blur-sm">
                  <p className="font-semibold text-[#003DA5]">
                    &quot;Our commitment to excellence and quality has made us the trusted choice
                    for athletes, schools, and sports enthusiasts across Sri Lanka.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Vision Section */}
      <section className="py-20 bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#FF3D00] text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl ${!prefersReducedMotion ? 'animate-float' : ''}`}
          ></div>
          <div
            className={`absolute bottom-10 right-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-float delay-1000' : ''}`}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className={`text-center mb-16 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
            <Badge className="bg-white text-[#003DA5] px-6 py-2 text-sm font-bold mb-4 shadow-lg">
              RALHUM IN THE FUTURE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              OUR
              <span className="block bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                VISION
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'HOUSEHOLD NAME',
                description:
                  'To make Ralhum a household name for sports having a very solid reputation in whatever sports it serves and to give consumers the best quality at an affordable price.',
                gradient: 'from-[#FFD700] to-[#FFA500]',
              },
              {
                icon: Trophy,
                title: 'RALHUM ELITE SQUAD',
                description:
                  'To have under our sponsorship a leading squad of players using the particular brands which Ralhum distributes. This elite squad will carry our name forward.',
                gradient: 'from-[#AEEA00] to-[#7CB342]',
              },
              {
                icon: Globe,
                title: 'REGIONAL EXPANSION',
                description:
                  'To expand the horizons of Ralhum to serve regions like South Asia and the Middle East with products and brands which are in demand.',
                gradient: 'from-[#FF3D00] to-[#E53935]',
              },
            ].map((vision, index) => (
              <Card
                key={index}
                className={`bg-white/10 border-white/20 backdrop-blur-md shadow-2xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-500 animate-fade-in-up' : ''}`}
                style={!prefersReducedMotion ? { animationDelay: `${index * 200}ms` } : {}}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${vision.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}
                  >
                    <vision.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{vision.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{vision.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div
            className={`text-center mt-12 ${!prefersReducedMotion ? 'animate-fade-in-up delay-600' : ''}`}
          >
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Carrying out operations in an ethically professional manner while building the future
              of sports in Sri Lanka
            </p>
            <Button
              size="lg"
              className={`bg-white text-[#003DA5] hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full shadow-2xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
            >
              JOIN OUR JOURNEY
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
