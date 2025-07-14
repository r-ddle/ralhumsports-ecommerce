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
  CreditCard,
  Truck,
  Calendar,
  Building,
  ArrowRight,
  DollarSign,
  RefreshCw,
  Ban,
  Info,
  ShoppingCart,
  MapPin,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen mt-8 bg-brand-background">
      {/* Header Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-brand-primary text-white px-4 py-2 text-sm font-semibold mb-4">
            Customer Protection
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Return Policy</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your satisfaction is our priority. We offer comprehensive return and exchange options to
            ensure you&apos;re completely happy with your purchase.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: January 15, 2025</span>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Return Policy Overview
                  </h2>
                  <p className="text-text-secondary">Our commitment to customer satisfaction</p>
                </div>
              </div>
              <div className="space-y-4 text-text-primary leading-relaxed">
                <p>
                  At Ralhum Sports, we understand that purchasing sports equipment is an important
                  decision. Our comprehensive return policy is designed to give you confidence in
                  your purchase while ensuring fairness for all customers.
                </p>
                <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                  <p className="font-semibold text-success mb-2">30-Day Return Guarantee:</p>
                  <p>
                    We offer a 30-day return window for most products, giving you ample time to
                    evaluate your purchase and ensure it meets your needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Return Conditions</h2>
                  <p className="text-text-secondary">
                    Requirements for eligible returns and exchanges
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Basic Requirements
                  </h3>
                  <ul className="space-y-3 text-text-primary">
                    <li className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>30-Day Return Window:</strong> Items must be returned within 30
                        calendar days of the delivery date
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Original Condition:</strong> Products must be unused, unworn, and in
                        original condition with all tags and labels attached
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Proof of Purchase:</strong> Original receipt, invoice, or order
                        confirmation required
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Original Packaging:</strong> Items must be returned in original
                        packaging with all accessories, manuals, and components
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Product Condition Standards
                  </h3>
                  <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                    <p className="font-semibold text-info mb-2">Acceptable Return Conditions:</p>
                    <ul className="space-y-2 text-text-primary">
                      <li>• No signs of wear, use, or damage</li>
                      <li>• All original tags, labels, and protective films intact</li>
                      <li>• No odors (particularly important for sports equipment)</li>
                      <li>• Packaging materials undamaged and complete</li>
                      <li>• All accessories and documentation included</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Eligible and Non-Eligible Items */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Eligible for Return</h2>
                  <p className="text-text-secondary">Products that can be returned or exchanged</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Sports Equipment</h3>
                    <ul className="space-y-2 text-text-primary">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Unopened and unused bats, rackets, and sticks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Protective gear with original tags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Sports balls in original packaging</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Training equipment and accessories</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Apparel & Footwear</h3>
                    <ul className="space-y-2 text-text-primary">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Unworn clothing with original tags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Shoes without wear on soles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>Accessories and gear bags</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Special Circumstances</h3>
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <ul className="space-y-2 text-text-primary">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>
                          <strong>Defective Products:</strong> Manufacturing defects covered
                          regardless of use
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>
                          <strong>Wrong Item Sent:</strong> Returns accepted with no conditions when
                          we send incorrect items
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span>
                          <strong>Shipping Damage:</strong> Items damaged during transit are fully
                          returnable
                        </span>
                      </li>
                    </ul>
                  </div>
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
                    Not Eligible for Return
                  </h2>
                  <p className="text-text-secondary">
                    Products that cannot be returned for hygiene and safety reasons
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-error/10 p-4 rounded-lg border border-error/20">
                  <p className="font-semibold text-error mb-3">
                    The following items cannot be returned:
                  </p>
                  <ul className="space-y-2 text-text-primary">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                      <span>
                        <strong>Hygiene Products:</strong> Mouthguards, protective cups, and
                        personal protective equipment that comes into direct contact with the body
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                      <span>
                        <strong>Used Equipment:</strong> Any sports equipment showing signs of use,
                        wear, or damage
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                      <span>
                        <strong>Personalized Items:</strong> Custom-embroidered, engraved, or
                        personalized products
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                      <span>
                        <strong>Final Sale Items:</strong> Products marked as clearance, closeout,
                        or final sale
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                      <span>
                        <strong>Incomplete Returns:</strong> Items missing components, accessories,
                        or original packaging
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                      <span>
                        <strong>Expired Returns:</strong> Items returned after the 30-day return
                        window
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Return Process</h2>
                  <p className="text-text-secondary">Step-by-step guide to returning your items</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-brand-surface rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Contact Us</h4>
                        <p className="text-text-secondary text-sm">
                          Call {SITE_CONFIG.contact.phone} or email {SITE_CONFIG.contact.email}{' '}
                          within 30 days of delivery
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-brand-surface rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">
                          Get Return Authorization
                        </h4>
                        <p className="text-text-secondary text-sm">
                          Receive your Return Merchandise Authorization (RMA) number and detailed
                          return instructions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-brand-surface rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Package & Send</h4>
                        <p className="text-text-secondary text-sm">
                          Securely package the item with RMA number and ship to our returns center
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-brand-surface rounded-lg border border-brand-border">
                      <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Processing & Refund</h4>
                        <p className="text-text-secondary text-sm">
                          We inspect the item and process your refund within 5-7 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Important Return Guidelines
                  </h3>
                  <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                    <ul className="space-y-2 text-text-primary">
                      <li>
                        • <strong>Return Authorization Required:</strong> All returns must have an
                        RMA number
                      </li>
                      <li>
                        • <strong>Original Packaging:</strong> Use original box/packaging when
                        possible
                      </li>
                      <li>
                        • <strong>Tracking Recommended:</strong> Use a trackable shipping method for
                        your protection
                      </li>
                      <li>
                        • <strong>Return Address:</strong> Ship only to the address provided with
                        your RMA
                      </li>
                      <li>
                        • <strong>Inspection Process:</strong> All items are inspected upon receipt
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Exchanges */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Exchanges</h2>
                  <p className="text-text-secondary">
                    Exchange for different size, color, or model
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Exchange Options</h3>
                  <ul className="space-y-3 text-text-primary">
                    <li className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Size Exchanges:</strong> Same product in different size (subject to
                        availability)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Color Exchanges:</strong> Same product in different color (subject
                        to availability)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong>Model Exchanges:</strong> Different model within same product
                        category
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Exchange Process</h3>
                  <div className="space-y-4">
                    <p className="text-text-primary">
                      Exchanges follow the same process as returns but require additional
                      coordination:
                    </p>
                    <ol className="space-y-2 text-text-primary list-decimal list-inside">
                      <li>Contact us to discuss exchange options and availability</li>
                      <li>Reserve your preferred replacement item</li>
                      <li>Return original item with exchange RMA number</li>
                      <li>Replacement item ships once we receive and approve original item</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Exchange Fees</h3>
                  <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                    <ul className="space-y-2 text-text-primary">
                      <li>
                        • <strong>Same Price:</strong> No additional charge for equal-value
                        exchanges
                      </li>
                      <li>
                        • <strong>Higher Price:</strong> Pay difference between original and new
                        item
                      </li>
                      <li>
                        • <strong>Lower Price:</strong> Receive refund for price difference
                      </li>
                      <li>
                        • <strong>Shipping:</strong> Customer pays return shipping; we cover
                        shipping for replacement
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Refunds and Processing */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Refunds and Processing
                  </h2>
                  <p className="text-text-secondary">
                    How and when you&apos;ll receive your refund
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Refund Methods</h3>
                  <ul className="space-y-3 text-text-primary">
                    <li className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Original Payment Method:</strong> Refunds are processed to the
                        original payment method used for purchase
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Bank Transfer:</strong> For cash purchases or if original method is
                        unavailable
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Store Credit:</strong> Optional faster processing as account credit
                        for future purchases
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Processing Timeframes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-surface rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">
                        Inspection & Approval
                      </h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Initial inspection: 1-2 business days</li>
                        <li>• Quality assessment: 2-3 business days</li>
                        <li>• Approval notification: Same day</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-brand-surface rounded-lg border border-brand-border">
                      <h4 className="font-semibold text-text-primary mb-2">Refund Processing</h4>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Credit/Debit cards: 3-5 business days</li>
                        <li>• Bank transfers: 5-7 business days</li>
                        <li>• Store credit: Immediate</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Refund Amounts</h3>
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <ul className="space-y-2 text-text-primary">
                      <li>
                        • <strong>Full Purchase Price:</strong> For eligible returns in perfect
                        condition
                      </li>
                      <li>
                        • <strong>Original Shipping:</strong> Refunded only if return is due to our
                        error
                      </li>
                      <li>
                        • <strong>Return Shipping:</strong> Customer responsibility (except for our
                        errors)
                      </li>
                      <li>
                        • <strong>Taxes:</strong> Refunded in accordance with Sri Lankan tax
                        regulations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shipping and Costs */}
      <section className="py-12 sm:py-16 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Return Shipping</h2>
                  <p className="text-text-secondary">Shipping costs and responsibilities</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Shipping Responsibilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-text-primary mb-3 text-success">
                        Customer Pays Return Shipping:
                      </h4>
                      <ul className="space-y-2 text-text-primary">
                        <li className="flex items-start gap-2">
                          <User className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <span>Change of mind returns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <User className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <span>Size or color exchanges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <User className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <span>Product not suitable for intended use</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-text-primary mb-3 text-brand-primary">
                        We Pay Return Shipping:
                      </h4>
                      <ul className="space-y-2 text-text-primary">
                        <li className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                          <span>Manufacturing defects</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                          <span>Wrong item sent by us</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                          <span>Items damaged during shipping</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Return Shipping Address
                  </h3>
                  <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-primary mt-1" />
                      <div>
                        <p className="font-semibold text-text-primary">
                          Ralhum Sports Returns Center
                        </p>
                        <p className="text-text-primary">{SITE_CONFIG.contact.address.street}</p>
                        <p className="text-text-primary">
                          {SITE_CONFIG.contact.address.city}, {SITE_CONFIG.contact.address.country}
                        </p>
                        <p className="text-sm text-text-secondary mt-2">
                          <strong>Important:</strong> Only ship to this address with a valid RMA
                          number
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Shipping Recommendations
                  </h3>
                  <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                    <ul className="space-y-2 text-text-primary">
                      <li>• Use a trackable shipping method for your protection</li>
                      <li>• Purchase shipping insurance for high-value items</li>
                      <li>• Keep shipping receipts until refund is processed</li>
                      <li>• Package items securely to prevent damage during transit</li>
                      <li>• Include RMA number both inside and outside the package</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Warranty and Defects */}
      <section className="py-12 sm:py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border border-brand-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Warranty and Defects
                  </h2>
                  <p className="text-text-secondary">Protection beyond our return policy</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Manufacturer Warranties
                  </h3>
                  <ul className="space-y-3 text-text-primary">
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Brand Warranties:</strong> All products carry manufacturer
                        warranties as specified by each brand (Gray-Nicolls, Gilbert, Grays, etc.)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Warranty Claims:</strong> We facilitate warranty claims with
                        manufacturers on your behalf
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <div>
                        <strong>Extended Coverage:</strong> Warranty periods typically extend beyond
                        our 30-day return window
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Defective Product Process
                  </h3>
                  <div className="bg-error/10 p-4 rounded-lg border border-error/20">
                    <p className="font-semibold text-error mb-2">
                      If you receive a defective product:
                    </p>
                    <ol className="space-y-2 text-text-primary list-decimal list-inside">
                      <li>Contact us immediately, even if beyond 30-day return window</li>
                      <li>Provide photos and description of the defect</li>
                      <li>
                        We&apos;ll determine if it&apos;s covered under warranty or our return
                        policy
                      </li>
                      <li>Expedited replacement or full refund provided for confirmed defects</li>
                      <li>All shipping costs covered by us for defective items</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Quality Guarantee
                  </h3>
                  <p className="text-text-primary leading-relaxed">
                    Beyond manufacturer warranties, we stand behind the quality of every product we
                    sell. If you experience quality issues that aren&apos;t covered by the
                    manufacturer, contact us to discuss resolution options.
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
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Related Policies</h2>
                  <p className="text-text-secondary">Additional information and legal documents</p>
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
                      <p className="text-sm text-text-secondary">Full terms of service</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-brand-primary ml-auto transition-colors" />
                  </div>
                </Link>

                <Link
                  href="/privacy-policy"
                  className="group block p-4 bg-brand-background rounded-lg border border-brand-border hover:border-brand-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-brand-primary" />
                    <div>
                      <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                        Privacy Policy
                      </h3>
                      <p className="text-sm text-text-secondary">Data protection information</p>
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
                    Need Help with Returns?
                  </h2>
                  <p className="text-text-secondary">
                    Our customer service team is here to assist you
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Returns Department</h3>
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
                  <h3 className="font-semibold text-text-primary">Support Hours</h3>
                  <div className="text-text-secondary text-sm">
                    <p>{SITE_CONFIG.contact.supportHours}</p>
                    <p className="mt-1">Returns processing: Monday-Friday</p>
                    <p>Average response time: Within 4 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-border">
                <p className="text-sm text-text-secondary">
                  For return inquiries, please include your order number and reason for return. This
                  helps us process your request faster and provide the best possible service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
