'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Award, Users, TrendingUp } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site-config'

const milestones = [
  {
    year: SITE_CONFIG.about.established.toString(),
    title: `${SITE_CONFIG.about.companyName} Founded`,
    description: "Established as Sri Lanka's premier sports equipment distributor",
    icon: Calendar,
    color: `bg-[${SITE_CONFIG.branding.colors.primary}]`,
  },
  {
    year: '2000s',
    title: 'Brand Partnerships',
    description: 'Secured exclusive partnerships with Gray-Nicolls, Gilbert, and Grays',
    icon: Award,
    color: `bg-[${SITE_CONFIG.branding.colors.orange}]`,
  },
  {
    year: '2010s',
    title: 'Market Leadership',
    description: `Became Sri Lanka's #1 sports equipment distributor`,
    icon: TrendingUp,
    color: `bg-[${SITE_CONFIG.branding.colors.gold}]`,
  },
  {
    year: '2020s',
    title: 'Community Impact',
    description: 'Serving 1000+ schools, clubs, and professional athletes',
    icon: Users,
    color: `bg-[${SITE_CONFIG.branding.colors.lime}]`,
  },
]

export default function Heritage() {
  return (
    <section className="py-20 bg-[#1A1A1A] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#AEEA00] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
            OUR HERITAGE
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            25+ YEARS OF
            <span className="block text-[#FF3D00]">ATHLETIC EXCELLENCE</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From humble beginnings to Sri Lanka&apos;s leading sports equipment distributor, our
            journey is built on trust, quality, and unwavering commitment to sports excellence.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {SITE_CONFIG.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: stat.color }}>
                {stat.number}
              </div>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((milestone, index) => {
            const IconComponent = milestone.icon
            return (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${milestone.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-black text-[#FFD700] mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{milestone.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Legacy Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#003DA5]/20 to-[#FF3D00]/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-black mb-4">
              BUILT ON <span className="text-[#FFD700]">LEGACY</span>
            </h3>
            <p className="text-xl text-gray-300 mb-6 max-w-4xl mx-auto">
              {SITE_CONFIG.about.legacy.legacyText}
            </p>
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-8 py-3 text-base font-bold">
              Trusted by Generations of Athletes
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
