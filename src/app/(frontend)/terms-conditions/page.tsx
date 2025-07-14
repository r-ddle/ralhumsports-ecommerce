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
  Calendar,
  Building,
  CreditCard,
  ShoppingCart,
  Truck,
  RotateCcw,
  Globe,
  Users,
  Lock,
  UserCheck,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen mt-8 bg-brand-background">
      {/* Header Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-brand-primary text-white px-4 py-2 text-sm font-semibold mb-4">
            Legal Agreement
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our services or making any
            purchases.
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
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Company Information</h2>
                  <p className="text-text-secondary">Legal entity and business details</p>
                </div>
              </div>
              <div className="space-y-4 text-text-primary">
                <p>
                  <strong>Company Name:</strong> Ralhum Sports (Private) Limited
                </p>
                <p>
                  <strong>Registration Number:</strong> PV 14158 (Sri Lanka)
                </p>
                <p>
                  <strong>Address:</strong> {SITE_CONFIG.contact.address.street},{' '}
                  {SITE_CONFIG.contact.address.city}, {SITE_CONFIG.contact.address.country}
                </p>
                <p>
                  <strong>Business Type:</strong> Private Limited Company
                </p>
                <p>
                  <strong>Primary Business:</strong> Sports equipment distribution and retail
                </p>
                <p>
                  <strong>Contact:</strong> {SITE_CONFIG.contact.email} |{' '}
                  {SITE_CONFIG.contact.phone}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Acceptance of Terms */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Acceptance of Terms</h2>
                  <p className="text-text-secondary">Agreement and legal binding conditions</p>
                </div>
              </div>
              <div className="space-y-4 text-text-primary leading-relaxed">
                <p>
                  By accessing our website (ralhumsports.lk), placing an order, creating an account,
                  or using any of our services, you acknowledge that you have read, understood, and
                  agree to be legally bound by these Terms and Conditions in their entirety.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you
                  (&quot;Customer&quot;, &quot;User&quot;, or &quot;you&quot;) and Ralhum Sports
                  (Private) Limited (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;).
                </p>
                <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                  <p className="font-semibold text-text-primary mb-2">Important Notice:</p>
                  <p>
                    If you do not agree with any part of these terms, you must immediately cease
                    using our website and services. Continued use after any modifications
                    constitutes acceptance of the updated terms.
                  </p>
                </div>
                <p>
                  We reserve the right to update, modify, or replace these Terms at any time without
                  prior notice. The updated Terms will be effective immediately upon posting on our
                  website. It is your responsibility to review these Terms periodically.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Obligations and Account Responsibilities */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    User Responsibilities
                  </h2>
                  <p className="text-text-secondary">Your obligations when using our services</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Account Management
                  </h3>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Provide accurate, current, and complete information during registration and
                        checkout
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Maintain the confidentiality of your account credentials and password
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Notify us immediately of any unauthorized access or security breach
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        You are responsible for all activities that occur under your account
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Legal Compliance</h3>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Use our services only for lawful purposes and in compliance with all
                        applicable laws
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Respect intellectual property rights of Ralhum Sports and third parties
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>Comply with all Sri Lankan laws and regulations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Product Usage</h3>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Use products according to manufacturer specifications and safety guidelines
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>
                        Ensure products are suitable for intended use and user skill level
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Prohibited Activities
                  </h2>
                  <p className="text-text-secondary">Activities that are strictly forbidden</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-error/10 p-4 rounded-lg border border-error/20">
                  <p className="font-semibold text-error mb-2">Strictly Prohibited:</p>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>Unauthorized commercial resale or distribution of our products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>Using automated systems, bots, or scrapers to access our website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>
                        Attempting to gain unauthorized access to our systems or databases
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>Posting false, misleading, or defamatory product reviews</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>
                        Engaging in fraudulent activities or payment disputes without valid reason
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>
                        Distributing malware, viruses, or any harmful code through our platform
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                      <span>
                        Harassment, abuse, or inappropriate conduct toward our staff or other users
                      </span>
                    </li>
                  </ul>
                </div>
                <p className="text-text-secondary text-sm">
                  Violation of these prohibited activities may result in immediate account
                  suspension, order cancellation, and potential legal action.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Orders, Payment, and Pricing */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Orders and Purchase Process
                  </h2>
                  <p className="text-text-secondary">How orders are processed and fulfilled</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Order Placement</h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>
                      • Orders are considered offers to purchase and are subject to our acceptance
                    </li>
                    <li>• We reserve the right to refuse or cancel any order for any reason</li>
                    <li>• Order confirmation does not guarantee product availability</li>
                    <li>• All orders are subject to verification and fraud prevention checks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Product Information
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• We strive to provide accurate product descriptions and images</li>
                    <li>• Colors may vary due to monitor display differences</li>
                    <li>• Product specifications are based on manufacturer information</li>
                    <li>• We are not responsible for manufacturer specification changes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Payment Terms</h2>
                  <p className="text-text-secondary">Payment methods and processing terms</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Payment Methods</h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• All prices are displayed in Sri Lankan Rupees (LKR)</li>
                    <li>
                      • We accept cash on delivery, bank transfers, and approved payment cards
                    </li>
                    <li>• Payment is required in full before order processing</li>
                    <li>• All transactions are processed through secure payment gateways</li>
                    <li>• We do not store payment card information on our servers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Pricing and Taxes
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>
                      • All prices include applicable taxes and duties unless stated otherwise
                    </li>
                    <li>• Prices are subject to change without notice</li>
                    <li>• Promotional prices are valid only for specified periods</li>
                    <li>
                      • Bulk order discounts available for educational institutions and sports clubs
                    </li>
                    <li>• Currency conversion rates for international orders may fluctuate</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Payment Issues</h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Failed payments may result in automatic order cancellation</li>
                    <li>• Payment disputes must be raised within 14 days of transaction</li>
                    <li>
                      • Chargebacks without prior communication may result in account suspension
                    </li>
                    <li>• Fraudulent payment attempts will be reported to authorities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shipping and Delivery */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Shipping and Delivery
                  </h2>
                  <p className="text-text-secondary">
                    Delivery terms, timeframes, and responsibilities
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Delivery Terms</h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Standard delivery within Colombo: 1-2 business days</li>
                    <li>• Island-wide delivery: 3-7 business days depending on location</li>
                    <li>
                      • Free delivery for orders above LKR{' '}
                      {SITE_CONFIG.shipping.freeShippingThreshold.toLocaleString()}
                    </li>
                    <li>
                      • Standard shipping fee: LKR{' '}
                      {SITE_CONFIG.shipping.standardShipping.toLocaleString()}
                    </li>
                    <li>• Express delivery options available for additional charges</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Delivery Responsibilities
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Accurate delivery address must be provided by customer</li>
                    <li>• Customer or authorized person must be available to receive delivery</li>
                    <li>• Failed delivery attempts may incur additional charges</li>
                    <li>• Risk of loss passes to customer upon delivery</li>
                    <li>
                      • Delivery delays due to force majeure events are not our responsibility
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    International Shipping
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• International shipping available on request</li>
                    <li>• Customer responsible for customs duties and import taxes</li>
                    <li>• International delivery times vary by destination</li>
                    <li>• Some products may be restricted for international shipping</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Warranty and Liability */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Warranty and Liability
                  </h2>
                  <p className="text-text-secondary">
                    Product warranties and limitation of liability
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Product Warranties
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• All products carry manufacturer warranties as specified by each brand</li>
                    <li>• Warranty terms vary by product and manufacturer</li>
                    <li>• We facilitate warranty claims but are not the warranty provider</li>
                    <li>• Warranty coverage excludes normal wear and tear, misuse, or accidents</li>
                    <li>• Original purchase receipt required for all warranty claims</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Limitation of Liability
                  </h3>
                  <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                    <p className="font-semibold text-warning mb-2">Important Legal Notice:</p>
                    <ul className="space-y-2 text-text-primary leading-relaxed">
                      <li>• Our total liability is limited to the purchase price of the product</li>
                      <li>
                        • We are not liable for indirect, incidental, or consequential damages
                      </li>
                      <li>
                        • We do not assume liability for product fitness for specific purposes
                      </li>
                      <li>• Customer assumes all risk for product selection and use</li>
                      <li>• Sports activities carry inherent risks that we cannot eliminate</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Service Limitations
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• Website availability and service uptime not guaranteed</li>
                    <li>• We reserve the right to modify or discontinue services</li>
                    <li>• Technical issues or force majeure events may affect service delivery</li>
                    <li>
                      • Information accuracy on website not guaranteed, subject to verification
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dispute Resolution and Governing Law */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Dispute Resolution</h2>
                  <p className="text-text-secondary">
                    Process for resolving conflicts and disagreements
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Resolution Process
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-brand-background rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Direct Communication</h4>
                        <p className="text-text-secondary text-sm">
                          Contact our customer service team at {SITE_CONFIG.contact.email} or{' '}
                          {SITE_CONFIG.contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-brand-background rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Formal Complaint</h4>
                        <p className="text-text-secondary text-sm">
                          Submit written complaint with order details and supporting documentation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-brand-background rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Mediation</h4>
                        <p className="text-text-secondary text-sm">
                          Independent mediation through agreed neutral third party if required
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-brand-background rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Legal Action</h4>
                        <p className="text-text-secondary text-sm">
                          Legal proceedings in Sri Lankan courts as final resort
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Governing Law and Jurisdiction
                  </h2>
                  <p className="text-text-secondary">Legal framework and court jurisdiction</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-secondary/10 p-4 rounded-lg border border-brand-secondary/20">
                  <p className="font-semibold text-brand-secondary mb-2">Legal Jurisdiction:</p>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>
                      • These Terms are governed by the laws of the Democratic Socialist Republic of
                      Sri Lanka
                    </li>
                    <li>
                      • Any legal proceedings shall be subject to the exclusive jurisdiction of Sri
                      Lankan courts
                    </li>
                    <li>• Courts of Colombo shall have primary jurisdiction for all disputes</li>
                    <li>
                      • Sri Lankan Consumer Protection Act and other applicable laws shall apply
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Severability and Enforcement
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>
                      • If any provision is deemed invalid, the remaining terms remain enforceable
                    </li>
                    <li>• These Terms constitute the entire agreement between parties</li>
                    <li>• Modifications require written agreement from both parties</li>
                    <li>�� Waiver of any right does not constitute waiver of future rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Updates and Modifications */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Terms Modifications</h2>
                  <p className="text-text-secondary">How we update and modify these terms</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Modification Rights
                  </h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>
                      • We reserve the right to modify these Terms at any time without prior notice
                    </li>
                    <li>
                      • Updates will be posted on this page with a revised &quot;Last Updated&quot;
                      date
                    </li>
                    <li>
                      • Material changes may be communicated via email to registered customers
                    </li>
                    <li>
                      • Continued use of our services constitutes acceptance of modified Terms
                    </li>
                  </ul>
                </div>

                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <p className="font-semibold text-warning mb-2">Your Responsibility:</p>
                  <p className="text-text-primary">
                    It is your responsibility to review these Terms periodically. If you do not
                    agree with any modifications, you must immediately discontinue use of our
                    services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Effective Date</h3>
                  <ul className="space-y-2 text-text-primary leading-relaxed">
                    <li>• All modifications become effective immediately upon posting</li>
                    <li>• Previous versions of Terms are superseded by current version</li>
                    <li>• Orders placed before modifications are governed by previous Terms</li>
                  </ul>
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
                  href="/privacy-policy"
                  className="group block p-4 bg-brand-background rounded-lg border border-brand-border hover:border-brand-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-brand-primary" />
                    <div>
                      <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                        Privacy Policy
                      </h3>
                      <p className="text-sm text-text-secondary">
                        How we collect and protect your data
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
                    <RotateCcw className="w-5 h-5 text-brand-primary" />
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
                    Questions About These Terms?
                  </h2>
                  <p className="text-text-secondary">
                    Contact us for clarification or legal assistance
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Customer Service</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-primary" />
                      <span className="text-text-primary">{SITE_CONFIG.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-primary" />
                      <span className="text-text-primary">{SITE_CONFIG.contact.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Business Hours</h3>
                  <div className="text-text-secondary text-sm">
                    <p>{SITE_CONFIG.contact.supportHours}</p>
                    <p className="mt-1">Response time: Within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-border">
                <p className="text-sm text-text-secondary">
                  For legal matters specifically related to these Terms and Conditions, please email
                  us with &quot;Legal Inquiry&quot; in the subject line for priority handling.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
