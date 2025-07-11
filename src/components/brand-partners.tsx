'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Award, Star, Target } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site-config'

const brandIcons: Record<string, any> = {
  'Gray-Nicolls': Trophy,
  Gilbert: Award,
  Grays: Star,
  Molten: Target,
}

export default function BrandPartners() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="bg-[#003DA5] dark:bg-[#4A90E2] text-white px-6 py-2 text-sm font-bold mb-4">
            EXCLUSIVE PARTNERSHIPS
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
            WORLD-RENOWNED
            <span className="block text-[#FF3D00] dark:text-[#FF6B47]">SPORTS BRANDS</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            As Sri Lanka&apos;s exclusive distributor, we bring you authentic equipment from the
            world&apos;s most trusted sports brands
          </p>
        </div>

        {/* Brand Cards Grid - Improved mobile responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SITE_CONFIG.brands.map((brand) => {
            const IconComponent = brandIcons[brand.name] || Trophy
            return (
              <Card
                key={brand.name}
                className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden bg-white dark:bg-gray-800"
              >
                <CardContent className="p-0">
                  {/* Card Header with Gradient */}
                  <div
                    className={`bg-gradient-to-br ${brand.color} p-4 sm:p-6 text-white relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-white/10 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10"></div>
                    <div className="relative z-10">
                      <IconComponent className="w-6 sm:w-8 h-6 sm:h-8 mb-3 sm:mb-4" />
                      <h3 className="text-xl sm:text-2xl font-black mb-2">{brand.name}</h3>
                      <p className="text-xs sm:text-sm opacity-90">{brand.heritage}</p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                    <Badge className="bg-[#FFD700] text-[#1A1A1A] mb-3 font-bold text-xs sm:text-sm">
                      {brand.specialty}
                    </Badge>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                      {brand.description}
                    </p>

                    {/* Achievements */}
                    <div className="space-y-2">
                      {brand.achievements.map((achievement) => (
                        <div key={achievement} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#AEEA00] rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA - Better mobile layout */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
            Experience the difference of authentic, professional-grade equipment
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-4xl mx-auto">
            <Badge className="bg-[#003DA5] dark:bg-[#4A90E2] text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold">
              ✓ Exclusive Sri Lankan Distributor
            </Badge>
            <Badge className="bg-[#FF3D00] dark:bg-[#FF6B47] text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold">
              ✓ Authentic Guarantee
            </Badge>
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold">
              ✓ Professional Support
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
