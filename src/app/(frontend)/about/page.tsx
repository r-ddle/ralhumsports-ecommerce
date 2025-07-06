'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Award, TrendingUp, Target, Globe, Star, Trophy } from 'lucide-react'

const timeline = [
  {
    year: '1921',
    title: 'S.M.M.Muhlar & Co Founded',
    description:
      'Parent company established by S.M.M.Muhlar, pioneering garment accessories and consumer products',
    icon: Calendar,
    color: 'bg-[#003DA5]',
  },
  {
    year: '1996',
    title: 'Ralhum Sports Established',
    description: 'Founded primarily to serve the cricket industry in Sri Lanka',
    icon: Trophy,
    color: 'bg-[#FF3D00]',
  },
  {
    year: '2000s',
    title: 'Portfolio Expansion',
    description: 'Gradually expanded to include global brands across multiple sports categories',
    icon: TrendingUp,
    color: 'bg-[#AEEA00]',
  },
  {
    year: 'Present',
    title: 'Market Leadership',
    description: 'Leading sports distributing company in Sri Lanka for over 25 years',
    icon: Award,
    color: 'bg-[#FFD700]',
  },
]

const brands = [
  'Gray-Nicolls',
  'Gilbert',
  'Molten',
  'Grays',
  'Dunlop',
  'Slazenger',
  'Babolat',
  'Carlton',
  'Stiga',
  'Mayor',
]

const achievements = [
  { number: '75+', label: 'Years Parent Company Heritage', icon: Calendar },
  { number: '25+', label: 'Years Ralhum Excellence', icon: Trophy },
  { number: '10+', label: 'Global Brand Partnerships', icon: Globe },
  { number: '#1', label: 'Sports Distributor in Sri Lanka', icon: Star },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              OUR STORY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              75+ YEARS OF
              <span className="block text-[#FF3D00]">EXCELLENCE</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              From humble beginnings to Sri Lanka&apos;s leading sports equipment distributor, our
              journey spans generations of commitment to athletic excellence and unwavering quality.
            </p>
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#003DA5] to-[#FF3D00] rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-[#003DA5] mb-2">
                    {achievement.number}
                  </div>
                  <p className="text-gray-600 font-medium">{achievement.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#003DA5] text-white px-4 py-2 text-sm font-bold mb-4">
                WHO WE ARE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6">
                RALHUM TRADING
                <span className="block text-[#FF3D00]">COMPANY</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-[#003DA5]">Ralhum Trading Company Pvt Ltd</strong> was
                  established in 1996 primarily to take care of the sports and consumer industry.
                  Originally, the parent company of Ralhum was{' '}
                  <strong className="text-[#FF3D00]">S.M.M.Muhlar & Co</strong>, which was formed
                  more than 75 years ago by S.M.M.Muhlar.
                </p>
                <p>
                  The parent company was a pioneer in garment accessories and consumer products.
                  Ralhum was established initially catering to the cricket industry but gradually
                  expanded its portfolio to now include global brands such as{' '}
                  <strong>
                    Dunlop, Slazenger, Molten, Grays, Stiga, Carlton, Babolat, Gray-Nicolls and
                    Mayor
                  </strong>
                  covering each sport strategically.
                </p>
                <p className="text-lg font-semibold text-[#003DA5]">
                  It can now be proudly stated that Ralhum is the leading sports distributing
                  company in Sri Lanka for over 25 years.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#003DA5] to-[#FF3D00] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-black mb-6">OUR GLOBAL BRANDS</h3>
                <div className="grid grid-cols-2 gap-4">
                  {brands.map((brand) => (
                    <div
                      key={brand}
                      className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm"
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

      {/* Timeline Section */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              OUR JOURNEY
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              HERITAGE
              <span className="block text-[#AEEA00]">TIMELINE</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((milestone, index) => {
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
                    <p className="text-gray-300 leading-relaxed text-sm">{milestone.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Present Day Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-[#AEEA00] to-[#FFD700] rounded-2xl p-8 text-[#1A1A1A]">
                <h3 className="text-2xl font-black mb-6">CURRENT LEADERSHIP</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">M.M.Mohamed</p>
                      <p className="text-sm opacity-80">Current Head & Son of Founder Chairman</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">Nationwide Network</p>
                      <p className="text-sm opacity-80">
                        Well-spread dealer network across Sri Lanka
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">Export Operations</p>
                      <p className="text-sm opacity-80">
                        Exporting sports brands to other countries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="bg-[#FF3D00] text-white px-4 py-2 text-sm font-bold mb-4">
                RALHUM PRESENTLY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6">
                LEADING THE
                <span className="block text-[#003DA5]">INDUSTRY</span>
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
                <div className="bg-[#003DA5]/10 rounded-lg p-4 border-l-4 border-[#003DA5]">
                  <p className="font-semibold text-[#003DA5]">
                    &quot;Our commitment to excellence and quality has made us the trusted choice for
                    athletes, schools, and sports enthusiasts across Sri Lanka.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-br from-[#003DA5] to-[#FF3D00] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-white text-[#003DA5] px-6 py-2 text-sm font-bold mb-4">
              RALHUM IN THE FUTURE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              OUR
              <span className="block text-[#FFD700]">VISION</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">HOUSEHOLD NAME</h3>
                <p className="text-gray-200 leading-relaxed">
                  To make Ralhum a household name for sports having a very solid reputation in
                  whatever sports it serves and to give consumers the best quality at an affordable
                  price.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-[#AEEA00] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">RALHUM ELITE SQUAD</h3>
                <p className="text-gray-200 leading-relaxed">
                  To have under our sponsorship a leading squad of players using the particular
                  brands which Ralhum distributes. This elite squad will carry our name forward.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Globe className="w-12 h-12 text-[#FF3D00] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">REGIONAL EXPANSION</h3>
                <p className="text-gray-200 leading-relaxed">
                  To expand the horizons of Ralhum to serve regions like South Asia and the Middle
                  East with products and brands which are in demand.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-xl mb-8 opacity-90">
              Carrying out operations in an ethically professional manner while building the future
              of sports in Sri Lanka
            </p>
            <Button
              size="lg"
              className="bg-white text-[#003DA5] hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full"
            >
              JOIN OUR JOURNEY
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
