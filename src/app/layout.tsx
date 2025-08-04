import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
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
  metadataBase: new URL('https://ralhumsports.lk'),
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
    images: ['/ralhumbanner.png'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://ralhumsports.lk/#organization',
              name: 'Ralhum Sports Sri Lanka',
              url: 'https://ralhumsports.lk',
              logo: 'https://ralhumsports.lk/ralhumlogo.svg',
              description: 'Premium sports equipment store in Sri Lanka. Official distributor of Gray-Nicolls, Gilbert, Molten & Grays.',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'LK',
                addressRegion: 'Western Province',
                addressLocality: 'Colombo',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English', 'Sinhala'],
              },
              sameAs: [
                'https://www.facebook.com/ralhumsports',
                'https://www.instagram.com/ralhumsports'
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}