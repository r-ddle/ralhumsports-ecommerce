"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react"
import Link from "next/link"

const dataTypes = [
  {
    icon: Users,
    title: "Personal Information",
    description: "Name, email, phone number, billing and shipping addresses",
    color: "bg-[#003DA5]",
  },
  {
    icon: FileText,
    title: "Order Information",
    description: "Purchase history, payment details, product preferences",
    color: "bg-[#FF3D00]",
  },
  {
    icon: Globe,
    title: "Usage Data",
    description: "Website interactions, browsing patterns, device information",
    color: "bg-[#AEEA00]",
  },
  {
    icon: Settings,
    title: "Technical Data",
    description: "IP address, browser type, operating system, cookies",
    color: "bg-[#FFD700]",
  },
]

const dataUsage = [
  "Process and fulfill your orders",
  "Provide customer support and service",
  "Send order confirmations and updates",
  "Improve our website and services",
  "Personalize your shopping experience",
  "Send promotional offers (with consent)",
  "Comply with legal obligations",
  "Prevent fraud and ensure security",
]

const dataProtection = [
  {
    icon: Lock,
    title: "Encryption",
    description: "All sensitive data is encrypted using industry-standard SSL/TLS protocols",
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Data stored on secure servers with restricted access and regular backups",
  },
  {
    icon: Eye,
    title: "Access Control",
    description: "Limited access to personal data on a need-to-know basis only",
  },
  {
    icon: Database,
    title: "Regular Audits",
    description: "Regular security audits and updates to maintain data protection standards",
  },
]

const userRights = [
  {
    right: "Access",
    description: "Request a copy of the personal data we hold about you",
    icon: Eye,
  },
  {
    right: "Correction",
    description: "Request correction of inaccurate or incomplete personal data",
    icon: Settings,
  },
  {
    right: "Deletion",
    description: "Request deletion of your personal data under certain circumstances",
    icon: AlertTriangle,
  },
  {
    right: "Portability",
    description: "Request transfer of your data to another service provider",
    icon: Database,
  },
  {
    right: "Objection",
    description: "Object to processing of your personal data for marketing purposes",
    icon: Shield,
  },
  {
    right: "Restriction",
    description: "Request restriction of processing under certain circumstances",
    icon: Lock,
  },
]

export default function PrivacyPolicyPage() {
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
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">DATA PROTECTION</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              PRIVACY
              <span className="block text-[#FF3D00]">POLICY</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Your privacy is fundamental to us. This policy explains how Ralhum Trading Company collects, uses, and
              protects your personal information when you use our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold rounded-full px-8 py-4"
                asChild
              >
                <Link href="#your-rights">
                  <Shield className="w-5 h-5 mr-2" />
                  YOUR RIGHTS
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#003DA5] font-bold rounded-full px-8 py-4 bg-transparent"
                asChild
              >
                <Link href="#contact">
                  <Mail className="w-5 h-5 mr-2" />
                  CONTACT US
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
            <Badge className="bg-[#003DA5] text-white px-4 py-2 text-sm font-bold">LAST UPDATED: JANUARY 2025</Badge>
          </div>
        </div>
      </section>

      {/* Data We Collect */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">
              INFORMATION COLLECTION
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              DATA WE
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">COLLECT</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We collect information to provide you with the best possible service and shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {dataTypes.map((type, index) => {
              const IconComponent = type.icon
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-3">{type.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{type.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How We Use Data */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FF3D00] text-white px-6 py-2 text-sm font-bold mb-4">DATA USAGE</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              HOW WE USE
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">YOUR DATA</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dataUsage.map((usage, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{usage}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 sm:py-20 bg-[#1A1A1A] dark:bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">SECURITY MEASURES</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
              DATA
              <span className="block text-[#AEEA00]">PROTECTION</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We implement robust security measures to protect your personal information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {dataProtection.map((protection, index) => {
              const IconComponent = protection.icon
              return (
                <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#AEEA00] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#1A1A1A]" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{protection.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{protection.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section id="your-rights" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#003DA5] text-white px-6 py-2 text-sm font-bold mb-4">YOUR PRIVACY RIGHTS</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              YOUR
              <span className="block text-[#FF3D00]">RIGHTS</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              You have several rights regarding your personal data. Contact us to exercise any of these rights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {userRights.map((right, index) => {
              const IconComponent = right.icon
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#003DA5] to-[#FF3D00] rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white">
                        RIGHT TO {right.right.toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{right.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cookies & Tracking */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-6 py-2 text-sm font-bold mb-4">COOKIES & TRACKING</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              COOKIES
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">POLICY</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-6">ESSENTIAL COOKIES</h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>• Required for website functionality and security</p>
                  <p>• Remember your shopping cart contents</p>
                  <p>• Maintain your login session</p>
                  <p>• Enable secure checkout process</p>
                  <p className="text-sm italic">These cookies cannot be disabled.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-700 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-6">OPTIONAL COOKIES</h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>• Analytics to improve website performance</p>
                  <p>• Personalized product recommendations</p>
                  <p>• Marketing and advertising preferences</p>
                  <p>• Social media integration features</p>
                  <p className="text-sm italic">You can opt-out of these cookies.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Third Party Services */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FF3D00] text-white px-6 py-2 text-sm font-bold mb-4">THIRD PARTY SERVICES</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] dark:text-white mb-6 leading-tight">
              DATA
              <span className="block text-[#003DA5] dark:text-[#4A90E2]">SHARING</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-[#FFD700] to-[#AEEA00] text-[#1A1A1A] border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-4">WE DO NOT SELL YOUR DATA</h3>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    <strong>We may share your information with:</strong>
                  </p>
                  <p>• Payment processors for secure transaction processing</p>
                  <p>• Shipping companies for order delivery</p>
                  <p>• Legal authorities when required by law</p>
                  <p>• Service providers who help us operate our business (under strict confidentiality agreements)</p>
                  <p className="font-bold">
                    We never sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-gradient-to-r from-[#003DA5] to-[#FF3D00] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white text-[#003DA5] px-6 py-2 text-sm font-bold mb-4">PRIVACY QUESTIONS?</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
            CONTACT OUR
            <span className="block text-[#FFD700]">PRIVACY TEAM</span>
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed">
            Have questions about our privacy policy or want to exercise your rights? Our privacy team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#003DA5] hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full"
              asChild
            >
              <Link href="mailto:privacy@ralhum.lk">
                <Mail className="w-5 h-5 mr-2" />
                EMAIL PRIVACY TEAM
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
            <p>Privacy Team: privacy@ralhum.lk | Phone: +94 11 234 5678</p>
            <p>We respond to privacy inquiries within 48 hours</p>
          </div>
        </div>
      </section>
    </main>
  )
}
