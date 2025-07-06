import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] dark:bg-gray-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile-first grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info - Full width on mobile */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <div className="text-2xl font-black text-[#FFD700] mb-4">
              RALHUM
              <span className="text-[#FF3D00]">SPORTS</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base max-w-sm mx-auto sm:mx-0">
              Sri Lanka&apos;s #1 sports equipment distributor for 25+ years. Exclusive distributor
              of world-renowned sports brands.
            </p>
            {/* Fixed social media icons with proper colors */}
            <div className="flex justify-center sm:justify-start space-x-4">
              <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:bg-[#1877F2]/80 cursor-pointer transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-[#E4405F] to-[#5B51D8] rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer transition-opacity">
                <Instagram className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links - Better mobile spacing */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold mb-4 text-[#FFD700]">QUICK LINKS</h3>
            <ul className="space-y-3">
              {['Home', 'Brands', 'Sports', 'Products', 'About', 'News', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-gray-300 hover:text-[#FFD700] transition-colors text-sm sm:text-base block py-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sports Categories - Better mobile spacing */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold mb-4 text-[#FFD700]">SPORTS</h3>
            <ul className="space-y-3">
              {[
                'Cricket',
                'Rugby',
                'Basketball',
                'Hockey',
                'Volleyball',
                'Tennis',
                'Badminton',
              ].map((sport) => (
                <li key={sport}>
                  <Link
                    href="/products"
                    className="text-gray-300 hover:text-[#FFD700] transition-colors text-sm sm:text-base block py-1"
                  >
                    {sport}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Better mobile layout */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold mb-4 text-[#FFD700]">CONTACT</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <MapPin className="w-5 h-5 text-[#AEEA00] mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm sm:text-base">
                  <p>27, Hildon Place</p>
                  <p>Colombo 04, Sri Lanka</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Phone className="w-5 h-5 text-[#AEEA00] flex-shrink-0" />
                <p className="text-gray-300 text-sm sm:text-base">+94 11 250 8082</p>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Mail className="w-5 h-5 text-[#AEEA00] flex-shrink-0" />
                <p className="text-gray-300 text-sm sm:text-base">info@ralhumsports.lk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Better mobile layout */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 Ralhum Trading Company Pvt Ltd. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Part of S.M.M.Muhlar & Co - 75+ Years of Excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
