'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [orderNumber, setOrderNumber] = useState<string>('')

  useEffect(() => {
    if (orderId) {
      setOrderNumber(orderId)
    }
  }, [orderId])

  return (
    <main className="min-h-screen pt-8 bg-brand-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-brand-surface border-brand-border shadow-2xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-4 p-4 rounded-full bg-red-100"
              >
                <XCircle className="w-16 h-16 text-red-600" />
              </motion.div>
              <CardTitle className="text-3xl font-black text-text-primary">
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-text-secondary mb-4">
                  Your payment was cancelled. Don&apos;t worry - no charges were made to your
                  account.
                </p>
                {orderNumber && (
                  <div className="p-4 bg-brand-background rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">Order Number</p>
                    <p className="text-xl font-bold text-text-primary">{orderNumber}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      This order is still pending and can be completed later
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Link href={orderNumber ? `/checkout?retry=${orderNumber}` : '/cart'}>
                  <Button className="w-full" size="lg">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Payment Again
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="outline" className="w-full" size="lg">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>

                {/* WhatsApp option for manual order */}
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  size="lg"
                  onClick={() => {
                    const message = orderNumber
                      ? `Hi! I had an issue completing payment for order ${orderNumber}. Can you help me complete this order manually?`
                      : 'Hi! I had an issue completing my payment. Can you help me place my order manually?'
                    const whatsappUrl = `https://wa.me/94770123456?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, '_blank')
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Complete Order via WhatsApp
                </Button>
              </div>

              <div className="text-center text-sm text-text-secondary space-y-2">
                <p>
                  <strong>Why did this happen?</strong>
                </p>
                <ul className="text-left space-y-1 max-w-md mx-auto">
                  <li>• You chose to cancel the payment</li>
                  <li>• Payment gateway timeout</li>
                  <li>• Network connectivity issues</li>
                  <li>• Browser or security software interference</li>
                </ul>
                <p className="mt-4">
                  If you continue having issues, please contact our support team.
                </p>
              </div>

              <div className="border-t border-brand-border pt-4 text-center">
                <p className="text-sm text-text-secondary mb-2">Need help?</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="tel:+94770123456">📞 Call Support</a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="mailto:support@ralhumsports.lk">✉️ Email Support</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
