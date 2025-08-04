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
import { Analytics } from '@vercel/analytics/next'
import { NavigationProvider } from '@/components/navigation-provider'
import { WebVitals } from '@/components/performance/web-vitals'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ralhumsports.lk'),
  title: {
    template: '%s | Ralhum Sports Sri Lanka - Premium Sports Equipment Store',
    default: 'Ralhum Sports Sri Lanka - Premium Sports Equipment & Gear | ralhumsports.lk'
  },
  description:
    'Shop premium sports equipment at Ralhum Sports Sri Lanka (ralhumsports.lk). Official distributor of Gray-Nicolls, Gilbert, Molten & Grays. Fast nationwide delivery across Sri Lanka.',
  keywords: [
    'ralhumsports.lk',
    'ralhum sports sri lanka', 
    'ralhum store',
    'sports equipment sri lanka',
    'cricket gear sri lanka',
    'rugby equipment colombo',
    'basketball shoes sri lanka',
    'hockey sticks sri lanka',
    'tennis rackets colombo',
    'Gray-Nicolls sri lanka',
    'Gilbert rugby sri lanka',
    'Molten basketball sri lanka',
    'Grays hockey sri lanka',
    'sports shop colombo',
    'online sports store sri lanka',
    'cricket bats sri lanka',
    'official sports distributor',
    'sports gear western province',
    'athletic equipment sri lanka',
    'sportswear colombo'
  ].join(', '),
  authors: [{ name: 'Ralhum Sports Team' }],
  creator: 'Ralhum Sports Sri Lanka',
  publisher: 'Ralhum Sports',
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
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://ralhumsports.lk',
    siteName: 'Ralhum Sports Sri Lanka',
    title: 'Ralhum Sports Sri Lanka - Premium Sports Equipment Store',
    description:
      'Shop premium sports equipment at ralhumsports.lk. Official distributor of Gray-Nicolls, Gilbert, Grays & Molten. Fast delivery across Sri Lanka.',
    images: [
      {
        url: '/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Ralhum Sports Sri Lanka - Premium Sports Equipment Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ralhumsports',
    creator: '@ralhumsports',
    title: 'Ralhum Sports Sri Lanka - Premium Sports Equipment',
    description:
      'Shop premium sports equipment at ralhumsports.lk. Official distributor with fast delivery across Sri Lanka.',
    images: ['https://ralhumsports.lk/ralhumbanner.png'],
  },
  verification: {
    google: 'pjZLxNs-yhkubiRfnamMtruzHA58nrlA6y4myDerRNI',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk',
  },
  category: 'Sports Equipment Store',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Ralhum Sports',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#FF6B35',
  },
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
        <link rel="icon" href="/ralhumlogo.svg" type="image/svg+xml" />
        <link rel="icon" href="/ralhumlogo.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/ralhumlogo.svg" />
        <meta
          name="google-site-verification"
          content="pjZLxNs-yhkubiRfnamMtruzHA58nrlA6y4myDerRNI"
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-brand-background text-text-primary overflow-x-hidden`}
      >
        <ErrorBoundary>
          <CartProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <NavigationProvider>
                <div className="flex flex-col min-h-screen">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Navigation />
                  </Suspense>

                  <main className="flex-1">
                    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
                  </main>

                  <Suspense fallback={null}>
                    <Footer />
                  </Suspense>

                  <CartSidebar />
                </div>
                <Toaster />
              </NavigationProvider>
            </Suspense>
          </CartProvider>
        </ErrorBoundary>
        <Analytics />
        <WebVitals />
      </body>
    </html>
  )
}
