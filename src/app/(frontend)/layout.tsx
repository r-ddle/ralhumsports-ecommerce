import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import AccessibilityEnhancements from '@/components/accessibility-enhancements'
import { CartProvider } from '@/hooks/use-cart'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { Toaster } from '@/components/ui/sonner'
import PerformanceOptimizer from '@/components/performance-optimizer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Ralhum Sports - Sri Lanka's #1 Sports Equipment Distributor & Online Store",
  description:
    'Shop premium sports equipment from world-renowned brands. Exclusive distributor of Gray-Nicolls, Gilbert, Grays & Molten in Sri Lanka. 25+ years of athletic excellence.',
  keywords:
    'sports equipment, cricket, rugby, basketball, hockey, tennis, Sri Lanka, Gray-Nicolls, Gilbert, Molten, Grays',
  openGraph: {
    title: 'Ralhum Sports - Premium Sports Equipment Store',
    description:
      'Shop the best sports equipment from trusted global brands. Fast delivery across Sri Lanka.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CartProvider>
          <PerformanceOptimizer />
          <AccessibilityEnhancements />
          <Navigation />
          <main id="main-content" role="main">
            {children}
          </main>
          <Footer />
          <CartSidebar />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  )
}
