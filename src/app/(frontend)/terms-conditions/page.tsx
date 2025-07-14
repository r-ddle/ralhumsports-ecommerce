'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Gavel,
  CreditCard,
  Truck,
  RotateCcw,
  Globe,
  Users,
} from 'lucide-react'
import Link from 'next/link'

const termsCategories = [
  {
    icon: FileText,
    title: 'General Terms',
    description: 'Basic terms and conditions for using our services',
    color: 'bg-[#003DA5]',
  },
  {
    icon: CreditCard,
    title: 'Payment Terms',
    description: 'Payment methods, pricing, and billing information',
    color: 'bg-[#FF3D00]',
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    description: 'Delivery terms, shipping costs, and timeframes',
    color: 'bg-[#AEEA00]',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    description: 'Return policy, refund procedures, and exchanges',
    color: 'bg-[#FFD700]',
  },
]

const userObligations = [
  'Provide accurate and complete information',
  'Use our services only for lawful purposes',
  'Respect intellectual property rights',
  'Not engage in fraudulent activities',
  'Comply with all applicable laws and regulations',
  'Maintain the security of your account',
  'Report any unauthorized use immediately',
  'Use products as intended by manufacturers',
]

const prohibitedActivities = [
  'Reselling products for commercial purposes without authorization',
  'Using our website to distribute malware or viruses',
  'Attempting to gain unauthorized access to our systems',
  'Posting false or misleading product reviews',
  'Violating any applicable laws or regulations',
  'Infringing on intellectual property rights',
  'Engaging in any form of harassment or abuse',
  'Using automated systems to access our website',
]

const liabilityLimitations = [
  {
    title: 'Product Defects',
    description: 'Our liability is limited to repair, replacement, or refund of defective products',
    icon: Shield,
  },
  {
    title: 'Indirect Damages',
    description: 'We are not liable for indirect, incidental, or consequential damages',
    icon: AlertTriangle,
  },
  {
    title: 'Third Party Products',
    description: 'Manufacturer warranties apply to all products; we act as distributor only',
    icon: Users,
  },
  {
    title: 'Service Interruptions',
    description: 'We are not liable for temporary service interruptions or website downtime',
    icon: Globe,
  },
]

const disputeResolution = [
  {
    step: '1',
    title: 'Direct Communication',
    description: 'Contact our customer service team to resolve the issue directly',
    icon: Phone,
  },
  {
    step: '2',
    title: 'Formal Complaint',
    description: 'Submit a formal written complaint if direct communication fails',
    icon: FileText,
  },
  {
    step: '3',
    title: 'Mediation',
    description: 'Engage in mediation through an agreed-upon neutral third party',
    icon: Users,
  },
  {
    step: '4',
    title: 'Legal Action',
    description: 'Pursue legal action in Sri Lankan courts as a last resort',
    icon: Gavel,
  },
]

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              LEGAL AGREEMENT
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              TERMS &<span className="block text-[#FF3D00]">CONDITIONS</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              These terms and conditions govern your use of Ralhum Trading Company&apos;s services.
              Please read carefully before making any purchases or using our website.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold rounded-full px-8 py-4"
                asChild
              >
                <Link href="#key-terms">
                  <Scale className="w-5 h-5 mr-2" />
                  KEY TERMS
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#003DA5] font-bold rounded-full px-8 py-4 bg-transparent"
                asChild
              >
                <Link href="#contact">
                  <Phone className="w-5 h-5 mr-2" />
                  LEGAL QUESTIONS
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Badge className="bg-[#003DA5] text-white px-4 py-2 text-sm font-bold">
              EFFECTIVE DATE: JANUARY 1, 2025 | LAST UPDATED: JANUARY 2025
            </Badge>
          </div>
        </div>
      </section>

      {/* Terms Categories */}
      <section id="key-terms" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              AGREEMENT OVERVIEW
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              KEY TERMS
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">CATEGORIES</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our terms are organized into key categories for easy understanding and reference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {termsCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Acceptance of Terms */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FF3D00] text-white px-6 py-2 text-sm font-bold mb-4">
              LEGAL AGREEMENT
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              ACCEPTANCE OF
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">TERMS</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-[#003DA5] to-[#FF3D00] text-white border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <Scale className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-4">BINDING AGREEMENT</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    By accessing our website, making a purchase, or using our services, you agree to
                    be bound by these terms and conditions.
                  </p>
                  <p>
                    If you do not agree with any part of these terms, you must not use our services
                    or make any purchases.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you and Ralhum
                    Trading Company Pvt Ltd.
                  </p>
                  <p className="font-bold">
                    We reserve the right to modify these terms at any time. Continued use of our
                    services after changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Obligations */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#003DA5] text-white px-6 py-2 text-sm font-bold mb-4">
              YOUR RESPONSIBILITIES
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              USER
              <span className="block text-[#FF3D00]">OBLIGATIONS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* User Obligations */}
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-green-600 dark:text-green-400">
                    YOU MUST
                  </h3>
                </div>
                <div className="space-y-4">
                  {userObligations.map((obligation, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{obligation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-red-600 dark:text-red-400">
                    PROHIBITED ACTIVITIES
                  </h3>
                </div>
                <div className="space-y-4">
                  {prohibitedActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment & Pricing */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              FINANCIAL TERMS
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              PAYMENT &<span className="block text-[#003DA5] dark:text-[#4A90E2]">PRICING</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-8 h-8 text-[#003DA5]" />
                  <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-white">
                    PAYMENT TERMS
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>• All prices are in Sri Lankan Rupees (LKR) unless otherwise stated</p>
                  <p>• Payment is required at the time of order placement</p>
                  <p>• We accept cash, bank transfers, and approved credit cards</p>
                  <p>• All transactions are processed securely</p>
                  <p>• Failed payments may result in order cancellation</p>
                  <p>• Additional charges may apply for international orders</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-[#FF3D00]" />
                  <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-white">
                    PRICING POLICY
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>• Prices are subject to change without prior notice</p>
                  <p>• Promotional prices are valid for limited periods only</p>
                  <p>• Bulk order discounts may be available upon request</p>
                  <p>• All prices include applicable taxes unless stated otherwise</p>
                  <p>• Price errors will be corrected, and you will be notified</p>
                  <p>• Special pricing for educational institutions available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Liability Limitations */}
      <section className="py-16 sm:py-20 bg-[#1A1A1A] dark:bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              LEGAL LIMITATIONS
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
              LIABILITY
              <span className="block text-[#AEEA00]">LIMITATIONS</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Understanding the scope and limitations of our liability in various situations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {liabilityLimitations.map((limitation, index) => {
              const IconComponent = limitation.icon
              return (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#AEEA00] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#1A1A1A]" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{limitation.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {limitation.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dispute Resolution */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FF3D00] text-white px-6 py-2 text-sm font-bold mb-4">
              CONFLICT RESOLUTION
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              DISPUTE
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">RESOLUTION</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We believe in resolving disputes fairly and efficiently through these structured
              steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {disputeResolution.map((step, index) => {
              const IconComponent = step.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#003DA5] to-[#FF3D00] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-black text-[#FFD700] mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              LEGAL JURISDICTION
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              GOVERNING
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">LAW</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-[#FFD700] to-[#AEEA00] text-[#1A1A1A] border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <Gavel className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-4">SRI LANKAN LAW APPLIES</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    These terms and conditions are governed by and construed in accordance with the
                    laws of Sri Lanka.
                  </p>
                  <p>
                    Any disputes arising from these terms will be subject to the exclusive
                    jurisdiction of the courts of Sri Lanka.
                  </p>
                  <p>
                    If any provision of these terms is found to be invalid or unenforceable, the
                    remaining provisions will continue to be valid and enforceable.
                  </p>
                  <p>
                    These terms constitute the entire agreement between you and Ralhum Trading
                    Company Pvt Ltd regarding the use of our services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modifications & Updates */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#003DA5] text-white px-6 py-2 text-sm font-bold mb-4">
              TERMS UPDATES
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              MODIFICATIONS &<span className="block text-[#FF3D00]">UPDATES</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-[#FF3D00]" />
                  <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-white">
                    IMPORTANT NOTICE
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>• We reserve the right to modify these terms and conditions at any time</p>
                  <p>
                    • Changes will be posted on this page with an updated &quot;Last Modified&quot;
                    date
                  </p>
                  <p>
                    • Significant changes will be communicated via email to registered customers
                  </p>
                  <p>• Continued use of our services after changes constitutes acceptance</p>
                  <p>• We recommend reviewing these terms periodically for updates</p>
                  <p>• If you disagree with changes, you must discontinue use of our services</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 sm:py-20 bg-gradient-to-r from-[#003DA5] to-[#FF3D00] text-white"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white text-[#003DA5] px-6 py-2 text-sm font-bold mb-4">
            LEGAL QUESTIONS?
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            CONTACT OUR
            <span className="block text-[#FFD700]">LEGAL TEAM</span>
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed">
            Have questions about our terms and conditions? Our legal team is available to provide
            clarification and assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#003DA5] hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full"
              asChild
            >
              <Link href="mailto:legal@ralhum.lk">
                <Mail className="w-5 h-5 mr-2" />
                EMAIL LEGAL TEAM
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#003DA5] px-8 py-4 text-lg font-bold rounded-full bg-transparent"
              asChild
            >
              <Link href="tel:+94112345678">
                <Phone className="w-5 h-5 mr-2" />
                CALL US
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-sm opacity-80">
            <p>Legal Team: legal@ralhum.lk | Phone: +94 11 234 5678</p>
            <p>Business Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </section>
    </main>
  )
}
