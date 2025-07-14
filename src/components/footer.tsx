'use client'

import { Facebook, Instagram, Phone, Mail, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

export default function Footer() {
  return (
    <footer
      className="relative text-white py-10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--text-primary), var(--secondary-blue))' }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), rgba(243, 156, 18, 0.1))',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1), rgba(243, 156, 18, 0.1))',
          }}
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Enhanced Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Enhanced Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1 text-center sm:text-left"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {SITE_CONFIG.branding.logoText.split(' ')[0]}
              </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {SITE_CONFIG.branding.logoText.split(' ')[1]}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base max-w-sm mx-auto sm:mx-0"
            >
              {SITE_CONFIG.about.description}
            </motion.p>

            {/* Enhanced Social Media Icons */}
            <div className="flex justify-center sm:justify-start space-x-4">
              <motion.a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
              >
                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </motion.a>
              <motion.a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center sm:text-left"
          >
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {['Home', 'Brands', 'Sports', 'Products', 'About', 'News', 'Contact'].map(
                (link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm sm:text-base block py-1 hover:translate-x-1 group"
                    >
                      <span className="group-hover:drop-shadow-lg">{link}</span>
                    </Link>
                  </motion.li>
                ),
              )}
            </ul>
          </motion.div>

          {/* Enhanced Sports Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center sm:text-left"
          >
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              SPORTS
            </h3>
            <ul className="space-y-3">
              {[
                'Cricket',
                'Rugby',
                'Basketball',
                'Hockey',
                'Volleyball',
                'Tennis',
                'Badminton',
              ].map((sport, index) => (
                <motion.li
                  key={sport}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="/products"
                    className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm sm:text-base block py-1 hover:translate-x-1 group"
                  >
                    <span className="group-hover:drop-shadow-lg">{sport}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Pages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center sm:text-left"
          >
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              LEGAL
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Terms & Conditions', href: '/terms-conditions' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Return Policy', href: '/return-policy' },
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-yellow-400 transition-all duration-300 text-sm sm:text-base block py-1 hover:translate-x-1 group"
                  >
                    <span className="group-hover:drop-shadow-lg">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center sm:text-left"
          >
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              CONTACT
            </h3>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-3 justify-center sm:justify-start group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500 to-green-400 group-hover:shadow-lg group-hover:shadow-green-400/25 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="text-slate-300 text-sm sm:text-base group-hover:text-white transition-colors">
                  <p>{`${SITE_CONFIG.contact.address.street}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.country}`}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3 justify-center sm:justify-start group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500 to-green-400 group-hover:shadow-lg group-hover:shadow-green-400/25 transition-all duration-300">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base group-hover:text-white transition-colors">
                  {SITE_CONFIG.contact.phone}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3 justify-center sm:justify-start group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-r from-lime-500 to-green-400 group-hover:shadow-lg group-hover:shadow-green-400/25 transition-all duration-300">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <p className="text-slate-300 text-sm sm:text-base group-hover:text-white transition-colors">
                  {SITE_CONFIG.contact.email}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-slate-700/50 mt-12 pt-8"
        >
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <p className="text-slate-300 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {SITE_CONFIG.about.companyName} Pvt Ltd. All rights
              reserved.
            </p>
            <p className="text-slate-300 text-sm text-center md:text-right">
              Part of {SITE_CONFIG.about.legacy.parentCompany} -{' '}
              {SITE_CONFIG.about.legacy.parentCompanyYears} Years of Excellence
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
