'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Award, Star, Target, Globe, Phone, Eye, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/config/site-config'
import Image from 'next/image'
import Link from 'next/link'

const iconMap = { Trophy, Award, Star, Target }
const brands = SITE_CONFIG.brands

export default function BrandsPage() {
  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#1A1A1A] text-white relative overflow-hidden">
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
              EXCLUSIVE PARTNERSHIPS
            </Badge>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
            >
              WORLD-RENOWNED
              <span className="block bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] bg-clip-text text-transparent">
                SPORTS BRANDS
              </span>
            </h1>
            <p
              className={`text-lg sm:text-xl text-gray-200 max-w-4xl mx-auto mb-8 leading-relaxed ${!prefersReducedMotion ? 'animate-fade-in-up delay-400' : ''}`}
            >
              As Sri Lanka&apos;s exclusive distributor, we bring you authentic equipment from the
              world&apos;s most trusted and respected sports brands. Each partnership represents
              decades of excellence and innovation.
            </p>

            <div
              className={`flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 ${!prefersReducedMotion ? 'animate-fade-in-up delay-600' : ''}`}
            >
              {brands.map((brand, index) => (
                <Badge
                  key={brand.name}
                  className={`bg-white/10 text-white px-3 sm:px-4 py-2 font-bold border border-white/20 text-xs sm:text-sm backdrop-blur-md shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                  style={!prefersReducedMotion ? { animationDelay: `${600 + index * 100}ms` } : {}}
                >
                  {brand.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Brands Section (merged) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 relative">
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
          <div
            className={`text-center mb-12 sm:mb-16 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            <Badge className="bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] text-white px-6 py-2 text-sm font-bold mb-4 shadow-lg">
              ALL PARTNER BRANDS
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              OUR
              <span className="block bg-gradient-to-r from-[#003DA5] to-[#0052CC] bg-clip-text text-transparent">
                BRAND PARTNERS
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are proud to partner with the world’s most respected sports brands, bringing you
              authentic equipment and exclusive access in Sri Lanka.
            </p>
          </div>

          {/* All Brand Cards */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-20">
            {brands.map((brand, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={brand.name}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
                  style={!prefersReducedMotion ? { animationDelay: `${index * 200}ms` } : {}}
                >
                  {/* Brand Image */}
                  <div className={`order-1 ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div
                      className={`relative overflow-hidden rounded-2xl shadow-2xl ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-500' : ''}`}
                    >
                      <Image
                        width={600}
                        height={400}
                        src={brand.image || '/placeholder.svg'}
                        alt={brand.name}
                        className="w-full h-64 sm:h-80 object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${brand.color} opacity-90`}
                      ></div>
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"></div>
                          <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm backdrop-blur-sm">
                            {brand.heritage}
                          </Badge>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                          {brand.name}
                        </h3>
                        <p className="text-white/90 font-medium text-sm sm:text-base">
                          {brand.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Brand Content */}
                  <div className={`order-2 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <Badge className="bg-gradient-to-r from-[#AEEA00] to-[#7CB342] text-[#1A1A1A] mb-4 font-bold text-xs sm:text-sm px-4 py-2 shadow-lg">
                      {brand.category}
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A] dark:text-white mb-4 leading-tight">
                      {brand.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                      {brand.description}
                    </p>

                    {/* Achievements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                      {brand.achievements &&
                        brand.achievements.map((achievement, achIndex) => (
                          <div
                            key={achievement}
                            className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                          >
                            <div className="w-3 h-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {achievement}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Products */}
                    {brand.products && (
                      <div className="space-y-3 mb-6 sm:mb-8">
                        <h4 className="font-bold text-[#003DA5] dark:text-[#4A90E2] mb-3 text-sm sm:text-base">
                          PRODUCT CATEGORIES:
                        </h4>
                        {brand.products.slice(0, 3).map((product, prodIndex) => (
                          <div
                            key={product.name}
                            className={`border-l-4 border-gradient-to-b from-[#AEEA00] to-[#7CB342] pl-4 p-2 rounded-r-lg bg-gradient-to-r from-gray-50 to-transparent ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                          >
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                              {product.name}
                            </h5>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {product.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        className={`bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] hover:from-[#FF6B47] hover:to-[#FF3D00] text-white font-bold rounded-full py-3 text-sm sm:text-base shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                        asChild
                      >
                        <Link href={`/products?brand=${brand.slug}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          VIEW PRODUCTS
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className={`border-2 border-[#003DA5] dark:border-[#4A90E2] text-[#003DA5] dark:text-[#4A90E2] hover:bg-[#003DA5] dark:hover:bg-[#4A90E2] hover:text-white font-bold rounded-full py-3 text-sm sm:text-base ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                        asChild
                      >
                        <Link href="/contact">
                          <Phone className="w-4 h-4 mr-2" />
                          GET QUOTE
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Ralhum Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-10 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-float' : ''}`}
          ></div>
          <div
            className={`absolute bottom-10 right-10 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-float delay-1000' : ''}`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 w-24 h-24 bg-[#FF3D00] rounded-full blur-2xl ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 sm:mb-16 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4 shadow-lg">
              EXCLUSIVE ADVANTAGES
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              WHY CHOOSE
              <span className="block bg-gradient-to-r from-[#AEEA00] to-[#7CB342] bg-clip-text text-transparent">
                RALHUM?
              </span>
            </h2>
          </div>

          {/* Enhanced Advantage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Award,
                title: 'Exclusive Distributor',
                description:
                  'Official and exclusive distributor status for all major brands in Sri Lanka',
                gradient: 'from-[#FFD700] to-[#FFA500]',
              },
              {
                icon: Trophy,
                title: 'Authentic Guarantee',
                description:
                  '100% authentic products with full manufacturer warranties and support',
                gradient: 'from-[#AEEA00] to-[#7CB342]',
              },
              {
                icon: Globe,
                title: '25+ Years Experience',
                description: 'Over two decades of expertise in sports equipment distribution',
                gradient: 'from-[#FF3D00] to-[#E53935]',
              },
              {
                icon: Star,
                title: 'Professional Support',
                description:
                  'Expert consultation and after-sales support for all your sporting needs',
                gradient: 'from-[#03DAC6] to-[#00BCD4]',
              },
            ].map((advantage, index) => {
              const IconComponent = advantage.icon
              return (
                <Card
                  key={index}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 dark:bg-gray-800/50 backdrop-blur-md shadow-2xl ${!prefersReducedMotion ? 'hover:scale-105 animate-fade-in-up' : ''}`}
                  style={!prefersReducedMotion ? { animationDelay: `${index * 150}ms` } : {}}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${advantage.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#003DA5] via-[#0052CC] to-[#FF3D00] text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl ${!prefersReducedMotion ? 'animate-float' : ''}`}
          ></div>
          <div
            className={`absolute bottom-10 right-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-float delay-1000' : ''}`}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            READY TO EXPERIENCE THE DIFFERENCE?
          </h2>
          <p
            className={`text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
          >
            Contact us today to learn more about our exclusive brand partnerships and find the
            perfect equipment for your needs.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${!prefersReducedMotion ? 'animate-fade-in-up delay-400' : ''}`}
          >
            <Button
              size="lg"
              className={`bg-white text-[#003DA5] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full shadow-2xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
              asChild
            >
              <Link href="/contact">
                <Phone className="w-5 h-5 mr-2" />
                CONTACT OUR TEAM
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`border-2 border-white text-white hover:bg-white hover:text-[#003DA5] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full bg-transparent backdrop-blur-sm ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
              asChild
            >
              <Link href="/products">VIEW ALL PRODUCTS</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
