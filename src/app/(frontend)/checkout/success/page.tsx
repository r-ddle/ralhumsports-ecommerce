'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CheckoutSuccessPage() {
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
                className="mx-auto mb-4 p-4 rounded-full bg-green-100"
              >
                <CheckCircle className="w-16 h-16 text-green-600" />
              </motion.div>
              <CardTitle className="text-3xl font-black text-text-primary">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-text-secondary mb-4">
                  Thank you for your order. Your payment has been processed successfully.
                </p>
                {orderNumber && (
                  <div className="p-4 bg-brand-background rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-text-primary">{orderNumber}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Link href="/orders/track">
                  <Button className="w-full" size="lg">
                    <Package className="w-5 h-5 mr-2" />
                    Track Your Order
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full" size="lg">
                    Continue Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-text-secondary">
                <p>A confirmation email has been sent to your email address.</p>
                <p className="mt-2">If you have any questions, please contact our support team.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
