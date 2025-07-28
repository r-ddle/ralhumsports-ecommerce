'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Calendar,
  Building,
  Clock,
  ArrowRight,
  XCircle,
  CreditCard,
  MapPin,
  Trash2,
  Download,
  Share,
  UserX,
} from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen mt-8 bg-brand-background">
      {/* Header Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-brand-primary text-white px-4 py-2 text-sm font-semibold mb-4">
            Data Protection
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect
            your personal information.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: January 15, 2025</span>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Data Controller Information
                  </h2>
                  <p className="text-text-secondary">Who is responsible for your personal data</p>
                </div>
              </div>
              <div className="space-y-4 text-text-primary">
                <p>
                  <strong>Data Controller:</strong> Ralhum Trading Company (Private) Limited
                </p>
                <p>
                  <strong>Registration Number:</strong> PV 14158 (Sri Lanka)
                </p>
                <p>
                  <strong>Address:</strong> {SITE_CONFIG.contact.address.street},{' '}
                  {SITE_CONFIG.contact.address.city}, {SITE_CONFIG.contact.address.country}
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> {SITE_CONFIG.contact.email}
                </p>
                <p>
                  <strong>Contact:</strong> {SITE_CONFIG.contact.phone} |{' '}
                  {SITE_CONFIG.contact.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Information We Collect
                  </h2>
                  <p className="text-text-secondary">Types of personal data we gather</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Identity Data:</strong> Full name, date of birth, gender, and
                        identification numbers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Contact Data:</strong> Email address, phone number, postal address,
                        and billing address
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Account Data:</strong> Username, password, and account preferences
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Transaction Information
                  </h3>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Order Data:</strong> Purchase history, product preferences, order
                        details, and delivery information
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Payment Data:</strong> Payment method, billing address, and
                        transaction records (not card details)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Financial Data:</strong> Bank account details for refunds and
                        payment verification
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Technical Data</h3>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Device Information:</strong> IP address, browser type, operating
                        system, and device identifiers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Usage Data:</strong> Website interactions, page views, search
                        queries, and browsing patterns
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Location Data:</strong> General location information based on IP
                        address for delivery purposes
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    How We Use Your Information
                  </h2>
                  <p className="text-text-secondary">
                    Legal basis and purposes for data processing
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Service Provision (Contract Performance)
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Process and fulfill your orders and delivery arrangements</li>
                    <li>• Manage your account and provide customer support</li>
                    <li>• Handle returns, exchanges, and warranty claims</li>
                    <li>• Process payments and manage billing</li>
                    <li>• Communicate order updates and delivery information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Legal Obligations
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Comply with tax reporting and accounting requirements</li>
                    <li>• Maintain records for consumer protection compliance</li>
                    <li>• Respond to legal requests and court orders</li>
                    <li>• Anti-money laundering and fraud prevention</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Legitimate Interests
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Improve our website functionality and user experience</li>
                    <li>• Analyze shopping patterns to enhance product offerings</li>
                    <li>• Detect and prevent fraud and security threats</li>
                    <li>• Conduct market research and business analysis</li>
                    <li>• Optimize delivery routes and service efficiency</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Consent-Based Processing
                  </h3>
                  <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                    <p className="font-semibold text-text-primary mb-2">
                      Only with your explicit consent:
                    </p>
                    <ul className="space-y-2 text-text-primary leading-relaxed">
                      <li>• Send promotional emails and marketing communications</li>
                      <li>• Share product recommendations based on purchase history</li>
                      <li>• Include you in customer surveys and feedback requests</li>
                      <li>• Use non-essential cookies for analytics and advertising</li>
                    </ul>
                    <p className="text-sm text-text-secondary mt-3">
                      You can withdraw your consent at any time without affecting other processing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Security and Protection */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Data Security and Protection
                  </h2>
                  <p className="text-text-secondary">How we keep your information safe</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Technical Safeguards
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• SSL/TLS encryption for all data transmission</li>
                    <li>• Secure, encrypted storage on protected servers</li>
                    <li>• Regular security updates and vulnerability assessments</li>
                    <li>• Multi-factor authentication for administrative access</li>
                    <li>• Automated backup systems with encrypted storage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Organizational Measures
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Strict access controls on a need-to-know basis</li>
                    <li>• Regular staff training on data protection</li>
                    <li>• Confidentiality agreements for all employees</li>
                    <li>• Incident response procedures for data breaches</li>
                    <li>• Regular audits of data processing activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Data Retention Policy
                  </h3>
                  <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                    <ul className="space-y-2 text-text-primary leading-relaxed">
                      <li>• Account data: Retained while account is active plus 2 years</li>
                      <li>• Transaction records: 7 years for tax and legal compliance</li>
                      <li>• Marketing data: Until consent is withdrawn</li>
                      <li>• Website analytics: Anonymized after 26 months</li>
                      <li>• Support communications: 3 years for quality assurance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Your Privacy Rights</h2>
                  <p className="text-text-secondary">
                    Your rights regarding your personal information
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Access</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Request a copy of all personal data we hold about you, including processing
                      purposes and retention periods.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Rectification</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Correct any inaccurate or incomplete personal information we have about you.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Trash2 className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Erasure</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Request deletion of your personal data when it&apos;s no longer necessary for
                      the original purpose.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Download className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Data Portability</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Receive your personal data in a structured, machine-readable format for
                      transfer to another service.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Object</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Object to processing of your personal data for direct marketing or legitimate
                      interests.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Lock className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">
                        Right to Restrict Processing
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Limit how we use your personal data while we verify its accuracy or address
                      your objections.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <UserX className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Withdraw Consent</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Withdraw your consent for marketing communications or other consent-based
                      processing at any time.
                    </p>
                  </div>

                  <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-brand-primary" />
                      <h3 className="font-semibold text-text-primary">Right to Complain</h3>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Lodge a complaint with the Sri Lankan data protection authority if you believe
                      we&apos;ve mishandled your data.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                <p className="text-sm text-text-primary">
                  <strong>How to Exercise Your Rights:</strong> Contact us at{' '}
                  {SITE_CONFIG.contact.email} with your request. We will respond within 30 days and
                  may require identity verification for security purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Cookies and Tracking
                  </h2>
                  <p className="text-text-secondary">How we use cookies and similar technologies</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Essential Cookies
                  </h3>
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <p className="font-semibold text-success mb-2">
                      Always Active - Cannot be Disabled:
                    </p>
                    <ul className="space-y-2 text-text-primary leading-relaxed">
                      <li>• Authentication and session management</li>
                      <li>• Shopping cart functionality and checkout process</li>
                      <li>• Security features and fraud prevention</li>
                      <li>• Website accessibility and user preferences</li>
                      <li>• Load balancing and performance optimization</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Optional Cookies (Require Consent)
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">Analytics Cookies</h4>
                      <p className="text-sm text-text-secondary mb-2">
                        Help us understand how visitors use our website to improve functionality.
                      </p>
                      <ul className="text-sm text-text-primary">
                        <li>• Google Analytics (anonymized)</li>
                        <li>• Page performance monitoring</li>
                        <li>• User behavior analysis</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">
                        Marketing and Advertising Cookies
                      </h4>
                      <p className="text-sm text-text-secondary mb-2">
                        Used to show relevant advertisements and measure campaign effectiveness.
                      </p>
                      <ul className="text-sm text-text-primary">
                        <li>• Facebook Pixel</li>
                        <li>• Google Ads conversion tracking</li>
                        <li>• Retargeting and remarketing</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">
                        Personalization Cookies
                      </h4>
                      <p className="text-sm text-text-secondary mb-2">
                        Remember your preferences and provide personalized experiences.
                      </p>
                      <ul className="text-sm text-text-primary">
                        <li>• Product recommendations</li>
                        <li>• Recently viewed items</li>
                        <li>• Language and region preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                  <p className="font-semibold text-info mb-2">Managing Your Cookie Preferences:</p>
                  <p className="text-text-primary text-sm">
                    You can manage your cookie preferences through our cookie banner when you first
                    visit our site, or by adjusting your browser settings. Note that disabling
                    certain cookies may affect website functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Sharing and Third Parties */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center flex-shrink-0">
                  <Share className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Data Sharing and Third Parties
                  </h2>
                  <p className="text-text-secondary">When and how we share your information</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-error/10 p-4 rounded-lg border border-error/20">
                  <p className="font-semibold text-error mb-2">
                    We DO NOT sell your personal data.
                  </p>
                  <p className="text-text-primary">
                    We never sell, rent, or trade your personal information to third parties for
                    their marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    When We Share Data
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">Service Providers</h4>
                      <p className="text-sm text-text-secondary mb-2">
                        Trusted partners who help us operate our business:
                      </p>
                      <ul className="text-sm text-text-primary">
                        <li>• Payment processors (secure transaction handling)</li>
                        <li>• Shipping and logistics companies (order delivery)</li>
                        <li>• Email service providers (communications)</li>
                        <li>• Cloud hosting providers (secure data storage)</li>
                        <li>• Analytics providers (website improvement)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">Legal Requirements</h4>
                      <p className="text-sm text-text-secondary mb-2">
                        We may share data when legally required:
                      </p>
                      <ul className="text-sm text-text-primary">
                        <li>• Court orders and legal proceedings</li>
                        <li>• Government investigations and regulatory requests</li>
                        <li>• Tax authorities and financial crime prevention</li>
                        <li>• Consumer protection enforcement</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">Business Transfers</h4>
                      <p className="text-sm text-text-secondary">
                        In the event of a merger, acquisition, or sale of assets, your data may be
                        transferred to the new entity under the same privacy protections.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Data Protection Standards
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• All third parties must sign data processing agreements</li>
                    <li>• Partners must meet our security and privacy standards</li>
                    <li>• Regular audits of third-party data handling practices</li>
                    <li>• Immediate breach notification requirements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* International Data Transfers */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    International Data Transfers
                  </h2>
                  <p className="text-text-secondary">How we handle cross-border data transfers</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-text-primary leading-relaxed">
                  Some of our service providers may be located outside Sri Lanka. When we transfer
                  your personal data internationally, we ensure appropriate safeguards are in place:
                </p>
                <ul className="space-y-2 text-text-primary leading-relaxed">
                  <li>• Standard contractual clauses approved by data protection authorities</li>
                  <li>• Adequacy decisions for countries with equivalent protection levels</li>
                  <li>• Binding corporate rules for multinational service providers</li>
                  <li>• Regular monitoring of international data protection developments</li>
                </ul>
                <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                  <p className="text-text-primary text-sm">
                    <strong>Primary Data Locations:</strong> Sri Lanka (primary), Singapore (backup
                    and analytics), and European Union (some cloud services with adequacy
                    decisions).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Pages and Contact */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Related Legal Pages */}
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Related Legal Documents
                  </h2>
                  <p className="text-text-secondary">Additional policies and legal information</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/terms-conditions"
                  className="group block p-4 bg-brand-background rounded-lg border border-brand-border hover:border-brand-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-primary" />
                    <div>
                      <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                        Terms & Conditions
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Legal terms for using our services
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-brand-primary ml-auto transition-colors" />
                  </div>
                </Link>

                <Link
                  href="/return-policy"
                  className="group block p-4 bg-brand-background rounded-lg border border-brand-border hover:border-brand-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-brand-primary rotate-180" />
                    <div>
                      <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                        Return Policy
                      </h3>
                      <p className="text-sm text-text-secondary">Returns, exchanges, and refunds</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-brand-primary ml-auto transition-colors" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Privacy Questions or Concerns?
                  </h2>
                  <p className="text-text-secondary">
                    Contact our Data Protection Officer for privacy matters
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Data Protection Officer</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-primary" />
                      <span className="text-text-primary">{SITE_CONFIG.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-primary" />
                      <span className="text-text-primary">{SITE_CONFIG.contact.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-brand-primary mt-1" />
                      <span className="text-text-primary text-sm">
                        {SITE_CONFIG.contact.address.street}, {SITE_CONFIG.contact.address.city},{' '}
                        {SITE_CONFIG.contact.address.country}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Response Times</h3>
                  <div className="text-text-secondary text-sm space-y-1">
                    <p>• Privacy rights requests: Within 30 days</p>
                    <p>• General privacy questions: Within 48 hours</p>
                    <p>• Data breach concerns: Within 24 hours</p>
                    <p>• {SITE_CONFIG.contact.supportHours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-border">
                <p className="text-sm text-text-secondary">
                  For privacy-related inquiries, please include &quot;Privacy Request&quot; in your
                  email subject line for faster processing. You may also have the right to lodge a
                  complaint with the Sri Lankan data protection authority.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
