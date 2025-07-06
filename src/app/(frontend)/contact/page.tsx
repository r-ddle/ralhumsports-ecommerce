'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  Building,
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    sport: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create WhatsApp message
    const message = `Hello Ralhum Sports!

*Contact Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
${formData.company ? `Company/Organization: ${formData.company}` : ''}
Sport Category: ${formData.sport || 'Not specified'}

*Message:*
${formData.message}

Thank you!`

    // WhatsApp URL with the message
    const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
              GET IN TOUCH
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              CONTACT
              <span className="block text-[#FF3D00]">OUR TEAM</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to elevate your game? Get in touch with Sri Lanka&apos;s #1 sports equipment
              distributor. Our expert team is here to help you find the perfect equipment for your
              needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#003DA5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">Call Us</h3>
                <p className="text-gray-600 mb-2">+94 11 250 8082</p>
                <p className="text-sm text-gray-500">Mon-Sat: 9AM-6PM</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#FF3D00] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">WhatsApp</h3>
                <p className="text-gray-600 mb-2">+94 77 123 4567</p>
                <p className="text-sm text-gray-500">Quick Response</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#AEEA00] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">Email Us</h3>
                <p className="text-gray-600 mb-2">info@ralhumsports.lk</p>
                <p className="text-sm text-gray-500">24/7 Support</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">Visit Us</h3>
                <p className="text-gray-600 mb-2">27, Hildon Place</p>
                <p className="text-sm text-gray-500">Colombo 04, Sri Lanka</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge className="bg-[#003DA5] text-white px-4 py-2 text-sm font-bold mb-4">
                  SEND MESSAGE
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">
                  GET A <span className="text-[#FF3D00]">QUOTE</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and our team will get back to you within 24 hours with a
                  personalized quote.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-2 border-gray-200 focus:border-[#003DA5] rounded-lg text-base py-3"
                      placeholder="Your full name"
                      aria-label="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-2 border-gray-200 focus:border-[#003DA5] rounded-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-2 border-gray-200 focus:border-[#003DA5] rounded-lg"
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Company/Organization
                    </label>
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="border-2 border-gray-200 focus:border-[#003DA5] rounded-lg"
                      placeholder="Your organization"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Sport Category
                  </label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 focus:border-[#003DA5] rounded-lg px-3 py-2"
                  >
                    <option value="">Select a sport</option>
                    <option value="cricket">Cricket</option>
                    <option value="rugby">Rugby</option>
                    <option value="basketball">Basketball</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="hockey">Hockey</option>
                    <option value="tennis">Tennis</option>
                    <option value="badminton">Badminton</option>
                    <option value="football">Football</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="border-2 border-gray-200 focus:border-[#003DA5] rounded-lg"
                    placeholder="Tell us about your requirements, quantities needed, or any specific questions..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    SEND MESSAGE
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={handleSubmit}
                    className="border-2 border-[#AEEA00] text-[#AEEA00] hover:bg-[#AEEA00] hover:text-[#1A1A1A] px-8 py-4 text-lg font-bold rounded-full transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WHATSAPP US
                  </Button>
                </div>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div>
              <div className="mb-8">
                <Badge className="bg-[#FFD700] text-[#1A1A1A] px-4 py-2 text-sm font-bold mb-4">
                  VISIT OUR STORE
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">
                  FIND <span className="text-[#003DA5]">US</span>
                </h2>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-lg overflow-hidden h-64 mb-6 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798475087!2d79.85249831477!3d6.914712994999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259684e2f8b7b%3A0x8c8b8b8b8b8b8b8b!2sHildon%20Place%2C%20Colombo%2004%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ralhum Sports Location"
                ></iframe>
              </div>

              {/* Store Information */}
              <Card className="border-2 border-[#003DA5]/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#003DA5]">Store Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#FF3D00] mt-1" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-gray-600">
                          27, Hildon Place
                          <br />
                          Colombo 04, Sri Lanka
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#AEEA00] mt-1" />
                      <div>
                        <p className="font-semibold">Business Hours</p>
                        <p className="text-gray-600">
                          Monday - Saturday: 9:00 AM - 6:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-[#FFD700] mt-1" />
                      <div>
                        <p className="font-semibold">Facilities</p>
                        <p className="text-gray-600">
                          Product Display, Expert Consultation, Bulk Orders
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-full p-3"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#E4405F] to-[#5B51D8] hover:opacity-90 text-white rounded-full p-3"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-[#003DA5] to-[#FF3D00] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">NEED IMMEDIATE ASSISTANCE?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our team is ready to help you with urgent orders or specific requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#003DA5] hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full"
            >
              <Phone className="w-5 h-5 mr-2" />
              CALL NOW: +94 11 250 8082
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => {
                const quickMessage = `Hello Ralhum Sports! I need immediate assistance with sports equipment. Please contact me as soon as possible. Thank you!`
                const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(quickMessage)}`
                window.open(whatsappUrl, '_blank')
              }}
              className="border-2 border-white text-white hover:bg-white hover:text-[#003DA5] px-8 py-4 text-lg font-bold rounded-full bg-transparent"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WHATSAPP CHAT
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
