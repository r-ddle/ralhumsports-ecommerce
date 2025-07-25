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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Ralhum Sports | Sri Lanka Sports Equipment Store – Cricket, Rugby, Hockey Gear',
  description:
    'Shop top‑quality cricket, rugby, hockey, basketball & tennis gear in Sri Lanka. Official distributor of Gray‑Nicolls, Gilbert, Molten & Grays. Fast nationwide delivery.',
  keywords: [
    'sports equipment',
    'cricket gear',
    'rugby equipment',
    'basketball shoes',
    'hockey sticks',
    'tennis rackets',
    'Sri Lanka sports shop',
    'buy sports gear Sri Lanka',
    'Colombo sports store',
    'Gray-Nicolls Sri Lanka',
    'Gilbert rugby Sri Lanka',
    'Molten basketball Sri Lanka',
    'Grays hockey sticks',
    'sportswear Sri Lanka',
    'online sports store LK',
    'cricket bats Sri Lanka',
    'official sports distributor',
    'sports gear for schools',
    'athletic equipment',
    'Ralhum Sports',
  ].join(', '),
  authors: [{ name: 'Ralhum Sports' }],
  publisher: 'Ralhum Sports',
  openGraph: {
    title: 'Ralhum Sports – Premium Cricket, Rugby & Hockey Gear in Sri Lanka',
    description:
      'Official distributor of Gray‑Nicolls, Gilbert, Grays & Molten. Shop cricket, rugby, hockey & basketball equipment with fast delivery across Sri Lanka.',
    url: 'https://ralhumsports.lk',
    siteName: 'Ralhum Sports',
    images: [
      {
        url: 'https://ralhumsports.lk/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Ralhum Sports – Sri Lanka Sports Gear',
      },
    ],
    type: 'website',
    locale: 'en_LK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ralhum Sports – Sports Gear Store in Sri Lanka',
    description:
      'Official distributor of Gray‑Nicolls, Gilbert, Grays & Molten with nationwide delivery.',
    images: ['https://ralhumsports.lk/ralhumbanner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  verification: {
    google: 'pjZLxNs-yhkubiRfnamMtruzHA58nrlA6y4myDerRNI',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk',
  },
  category: 'Sports Equipment Store',
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
      </body>
    </html>
  )
}
