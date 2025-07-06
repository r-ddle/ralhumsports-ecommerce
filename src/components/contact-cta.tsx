'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Mail, Clock } from 'lucide-react'
import WhatsAppButton from '@/components/whatsapp-button'
import Image from 'next/image'

export default function ContactCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
            GET IN TOUCH
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            READY TO ELEVATE
            <span className="block text-[#FF3D00]">YOUR GAME?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Contact Sri Lanka&apos;s #1 sports equipment distributor today. Our expert team is ready
            to help you find the perfect equipment for your needs.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <Phone className="w-6 sm:w-8 h-6 sm:h-8 text-[#FFD700] mx-auto mb-3 sm:mb-4" />
              <h3 className="font-bold mb-2 text-sm sm:text-base text-white">Call Us</h3>
              <p className="text-gray-300 text-sm sm:text-base">+94 11 250 8082</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <MapPin className="w-6 sm:w-8 h-6 sm:h-8 text-[#AEEA00] mx-auto mb-3 sm:mb-4" />
              <h3 className="font-bold mb-2 text-sm sm:text-base text-white">Visit Us</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                27, Hildon Place
                <br />
                Colombo 04, Sri Lanka
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <Mail className="w-6 sm:w-8 h-6 sm:h-8 text-[#FF3D00] mx-auto mb-3 sm:mb-4" />
              <h3 className="font-bold mb-2 text-sm sm:text-base text-white">Email Us</h3>
              <p className="text-gray-300 text-sm sm:text-base">info@ralhumsports.lk</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-[#FFD700] mx-auto mb-3 sm:mb-4" />
              <h3 className="font-bold mb-2 text-sm sm:text-base text-white">Business Hours</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Mon-Sat: 9AM-6PM
                <br />
                Sunday: Closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <a href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                GET QUOTE NOW
              </Button>
            </a>
            <WhatsAppButton
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A] px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 bg-transparent"
              message="Hello Ralhum Sports! I'm interested in getting a quote for sports equipment. Please contact me as soon as possible. Thank you!"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center">
          <p className="text-gray-300 mb-4">Follow us for the latest updates</p>
          <div className="flex justify-center gap-4">
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full p-3"
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full p-3"
            >
              <Image
                src="/instagram.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
