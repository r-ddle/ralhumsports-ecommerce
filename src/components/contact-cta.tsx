'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Mail, Clock } from 'lucide-react'
import WhatsAppButton from '@/components/whatsapp-button'
import Image from 'next/image'
import { SITE_CONFIG } from '@/config/site-config'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ContactCTA() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const contactCards = [
    {
      icon: Phone,
      title: 'Call Us',
      content: SITE_CONFIG.contact.phone,
      color: '#FFD700',
      href: `tel:${SITE_CONFIG.contact.phone}`,
      ariaLabel: `Call us at ${SITE_CONFIG.contact.phone}`,
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: `${SITE_CONFIG.contact.address.street}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.country}`,
      color: '#AEEA00',
      href: `https://maps.google.com/?q=${encodeURIComponent(`${SITE_CONFIG.contact.address.street}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.country}`)}`,
      ariaLabel: `Get directions to ${SITE_CONFIG.contact.address.street}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.country}`,
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: SITE_CONFIG.contact.email,
      color: '#FF3D00',
      href: `mailto:${SITE_CONFIG.contact.email}`,
      ariaLabel: `Send email to ${SITE_CONFIG.contact.email}`,
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: SITE_CONFIG.contact.supportHours,
      color: '#FFD700',
      ariaLabel: `Our business hours: ${SITE_CONFIG.contact.supportHours}`,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: reducedMotion ? 0 : 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.6 },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4 hover:bg-[#FFD700]/90 transition-colors">
            GET IN TOUCH
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            READY TO ELEVATE
            <span className="block text-[#FF3D00] bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] bg-clip-text text-transparent">
              YOUR GAME?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Contact Sri Lanka&apos;s #1 sports equipment distributor today. Our expert team is ready
            to help you find the perfect equipment for your needs.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4"
        >
          {contactCards.map((card, index) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Card
                className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group cursor-pointer h-full"
                role={card.href ? 'button' : undefined}
                tabIndex={card.href ? 0 : undefined}
                onClick={card.href ? () => window.open(card.href, '_blank') : undefined}
                onKeyDown={
                  card.href
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          window.open(card.href!, '_blank')
                        }
                      }
                    : undefined
                }
                aria-label={card.ariaLabel}
              >
                <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col justify-center">
                  <card.icon
                    className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-3 sm:mb-4 transition-transform group-hover:scale-110"
                    style={{ color: card.color }}
                  />
                  <h3 className="font-bold mb-2 text-sm sm:text-base text-white group-hover:text-gray-100 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base group-hover:text-gray-200 transition-colors">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.4 }}
          className="text-center mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#FF3D00] focus-visible:ring-offset-2"
              asChild
            >
              <a href="/contact" aria-label="Get a quote for sports equipment">
                GET QUOTE NOW
              </a>
            </Button>
            <WhatsAppButton
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A] px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 bg-transparent hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2"
              message={SITE_CONFIG.whatsapp.message}
              aria-label="Contact us via WhatsApp"
            />
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.6 }}
          className="text-center"
        >
          <p className="text-gray-300 mb-4">Follow us for the latest updates</p>
          <div className="flex justify-center gap-4">
            <motion.a
              href={SITE_CONFIG.social.facebook}
              title="Follow us on Facebook"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={!reducedMotion ? { scale: 1.1 } : {}}
              whileTap={!reducedMotion ? { scale: 0.95 } : {}}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded-full"
              aria-label="Follow us on Facebook"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full p-3 transition-all duration-300 bg-transparent"
              >
                <Image src="/facebook.svg" alt="" width={20} height={20} className="w-5 h-5" />
              </Button>
            </motion.a>
            <motion.a
              href={SITE_CONFIG.social.instagram}
              title="Follow us on Instagram"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={!reducedMotion ? { scale: 1.1 } : {}}
              whileTap={!reducedMotion ? { scale: 0.95 } : {}}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded-full"
              aria-label="Follow us on Instagram"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full p-3 transition-all duration-300 bg-transparent"
              >
                <Image src="/instagram.svg" alt="" width={20} height={20} className="w-5 h-5" />
              </Button>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
