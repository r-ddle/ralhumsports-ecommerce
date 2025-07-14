import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { CartProvider } from '@/hooks/use-cart'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/error-boundary'
import { Suspense } from 'react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Ralhum Sports - Sri Lanka's #1 Sports Equipment Distributor & Online Store",
  description:
    'Shop premium sports equipment from world-renowned brands. Exclusive distributor of Gray-Nicolls, Gilbert, Grays & Molten in Sri Lanka. 25+ years of athletic excellence.',
  keywords: [
    'sports equipment',
    'cricket',
    'rugby',
    'basketball',
    'hockey',
    'tennis',
    'Sri Lanka',
    'Gray-Nicolls',
    'Gilbert',
    'Molten',
    'Grays',
    'Ralhum Sports',
  ].join(', '),
  authors: [{ name: 'Ralhum Sports' }],
  creator: 'Ralhum Sports',
  publisher: 'Ralhum Sports',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Ralhum Sports - Premium Sports Equipment Store',
    description:
      'Shop the best sports equipment from trusted global brands. Fast delivery across Sri Lanka.',
    type: 'website',
    locale: 'en_US',
    url: 'https://ralhumsports.lk',
    siteName: 'Ralhum Sports',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ralhum Sports - Premium Sports Equipment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ralhum Sports - Premium Sports Equipment Store',
    description: 'Shop the best sports equipment from trusted global brands.',
    images: ['/og-image.jpg'],
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
  alternates: {
    canonical: 'https://ralhumsports.lk',
  },
  category: 'Sports Equipment',
}

// Loading component for Suspense boundaries
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-background">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-brand-primary"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#FF6B35" />
        <meta name="color-scheme" content="light" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.className} antialiased bg-brand-background text-text-primary overflow-x-hidden`}
      >
        <ErrorBoundary>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<LoadingSpinner />}>
                <Navigation />
              </Suspense>

              <main className="flex-1 pt-16 sm:pt-20">
                <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
              </main>

              <Suspense fallback={null}>
                <Footer />
              </Suspense>

              <CartSidebar />
            </div>
            <Toaster />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
