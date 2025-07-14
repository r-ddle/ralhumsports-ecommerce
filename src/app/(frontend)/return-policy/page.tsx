'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  RotateCcw,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  Package,
} from 'lucide-react'
import Link from 'next/link'

const returnConditions = [
  {
    icon: Clock,
    title: '30-Day Return Window',
    description: 'Items must be returned within 30 days of purchase date',
    color: 'bg-[#003DA5]',
  },
  {
    icon: Package,
    title: 'Original Packaging',
    description: 'Products must be in original, unopened packaging with all accessories',
    color: 'bg-[#FF3D00]',
  },
  {
    icon: FileText,
    title: 'Valid Receipt',
    description: 'Original purchase receipt or invoice must be provided',
    color: 'bg-[#AEEA00]',
  },
  {
    icon: Shield,
    title: 'Unused Condition',
    description: 'Items must be unused, undamaged, and in resaleable condition',
    color: 'bg-[#FFD700]',
  },
]

const eligibleItems = [
  'Unopened sports equipment in original packaging',
  'Unused apparel with original tags attached',
  'Defective products (manufacturing defects)',
  'Wrong items shipped by our error',
  'Damaged items received during shipping',
]

const nonEligibleItems = [
  'Used or worn sports equipment',
  'Personalized or customized items',
  'Items damaged by customer misuse',
  'Products without original packaging',
  'Items purchased on clearance or final sale',
  'Hygiene-related products (mouthguards, etc.)',
]

const returnProcess = [
  {
    step: '1',
    title: 'Contact Our Team',
    description: 'Call or email us within 30 days to initiate your return request',
    icon: Phone,
  },
  {
    step: '2',
    title: 'Return Authorization',
    description: 'Receive return authorization number and shipping instructions',
    icon: FileText,
  },
  {
    step: '3',
    title: 'Package & Ship',
    description: 'Securely package item with return authorization and ship back',
    icon: Package,
  },
  {
    step: '4',
    title: 'Processing & Refund',
    description: 'We process your return and issue refund within 5-7 business days',
    icon: RotateCcw,
  },
]

export default function ReturnPolicyPage() {
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
              CUSTOMER PROTECTION
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              RETURN
              <span className="block text-[#FF3D00]">POLICY</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Your satisfaction is our priority. We offer a comprehensive return policy to ensure
              you&apos;re completely happy with your Ralhum sports equipment purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold rounded-full px-8 py-4"
                asChild
              >
                <Link href="#return-process">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  START RETURN
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
                  CONTACT SUPPORT
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#003DA5] text-white px-6 py-2 text-sm font-bold mb-4">
              RETURN REQUIREMENTS
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              RETURN
              <span className="block text-[#FF3D00]">CONDITIONS</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              To ensure a smooth return process, please review our return conditions below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {returnConditions.map((condition, index) => {
              const IconComponent = condition.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${condition.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-3">
                      {condition.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {condition.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Eligible vs Non-Eligible Items */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              ITEM ELIGIBILITY
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              WHAT CAN BE
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">RETURNED?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Eligible Items */}
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-green-600 dark:text-green-400">
                    ELIGIBLE FOR RETURN
                  </h3>
                </div>
                <div className="space-y-4">
                  {eligibleItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Non-Eligible Items */}
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-red-600 dark:text-red-400">
                    NOT ELIGIBLE FOR RETURN
                  </h3>
                </div>
                <div className="space-y-4">
                  {nonEligibleItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section
        id="return-process"
        className="py-16 sm:py-20 bg-[#1A1A1A] dark:bg-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              STEP-BY-STEP GUIDE
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
              RETURN
              <span className="block text-[#AEEA00]">PROCESS</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Follow these simple steps to return your item and receive your refund.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {returnProcess.map((step, index) => {
              const IconComponent = step.icon
              return (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#AEEA00] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#1A1A1A]" />
                    </div>
                    <div className="text-3xl font-black text-[#FFD700] mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FF3D00] text-white px-6 py-2 text-sm font-bold mb-4">
              IMPORTANT INFORMATION
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              ADDITIONAL
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">TERMS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="bg-gradient-to-br from-[#FFD700] to-[#AEEA00] text-[#1A1A1A] border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8" />
                  <h3 className="text-2xl font-black">REFUND PROCESSING</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    • Refunds are processed within 5-7 business days after we receive your returned
                    item
                  </p>
                  <p>• Refunds will be issued to the original payment method</p>
                  <p>• Shipping costs are non-refundable unless the return is due to our error</p>
                  <p>• Customer is responsible for return shipping costs</p>
                  <p>• We recommend using a trackable shipping service</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#003DA5] to-[#FF3D00] text-white border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8" />
                  <h3 className="text-2xl font-black">EXCHANGES</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>• We offer exchanges for different sizes or colors of the same product</p>
                  <p>• Exchange requests must be made within the 30-day return window</p>
                  <p>• Exchanges are subject to product availability</p>
                  <p>• Additional charges may apply for price differences</p>
                  <p>• Contact our team to arrange an exchange</p>
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
            NEED HELP?
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            CONTACT OUR
            <span className="block text-[#FFD700]">SUPPORT TEAM</span>
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed">
            Have questions about returns? Our customer service team is here to help you through the
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#003DA5] hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full"
              asChild
            >
              <Link href="tel:+94112345678">
                <Phone className="w-5 h-5 mr-2" />
                CALL US NOW
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#003DA5] px-8 py-4 text-lg font-bold rounded-full bg-transparent"
              asChild
            >
              <Link href="mailto:returns@ralhum.lk">
                <Mail className="w-5 h-5 mr-2" />
                EMAIL SUPPORT
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-sm opacity-80">
            <p>Customer Service Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
            <p>Email: returns@ralhum.lk | Phone: +94 11 234 5678</p>
          </div>
        </div>
      </section>
    </main>
  )
}
