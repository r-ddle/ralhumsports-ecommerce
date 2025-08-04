import { Suspense } from 'react'
import Hero from '@/components/hero'
import SportsCategories from '@/components/sports-categories'
import BrandPartners from '@/components/brand-partners'
import Heritage from '@/components/heritage'
import ContactCTA from '@/components/contact-cta'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Ralhum Sports Sri Lanka - Premium Sports Equipment Store | ralhumsports.lk",
  description:
    'Welcome to Ralhum Sports Sri Lanka (ralhumsports.lk) - your trusted Ralhum Store for premium sports equipment. Official distributor of Gray-Nicolls, Gilbert, Grays & Molten in Sri Lanka.',
  keywords: [
    'ralhumsports.lk',
    'ralhum sports sri lanka',
    'ralhum store',
    'sports equipment sri lanka',
    'cricket gear sri lanka',
    'Gray-Nicolls sri lanka',
    'Gilbert rugby sri lanka',
    'Molten basketball sri lanka',
    'Grays hockey sri lanka',
    'sports shop colombo',
    'premium sports equipment'
  ].join(', '),
  openGraph: {
    title: 'Ralhum Sports Sri Lanka - Premium Sports Equipment | ralhumsports.lk',
    description:
      'Visit ralhumsports.lk - Ralhum Sports Sri Lanka. Official Ralhum Store for premium sports equipment from Gray-Nicolls, Gilbert, Grays & Molten.',
    url: 'https://ralhumsports.lk',
    images: [
      {
        url: 'https://ralhumsports.lk/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Ralhum Sports Sri Lanka - Premium Sports Equipment Store',
      }
    ],
  },
  twitter: {
    title: 'Ralhum Sports Sri Lanka | ralhumsports.lk',
    description: 'Visit ralhumsports.lk - your trusted Ralhum Store for premium sports equipment in Sri Lanka.',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk',
  },
  metadataBase: new URL('https://ralhumsports.lk'),
}

// Loading components for each section
function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-8 bg-white/20 rounded-lg w-64 mx-auto mb-4"></div>
        <div className="h-16 bg-white/20 rounded-lg w-96 mx-auto mb-4"></div>
        <div className="h-4 bg-white/20 rounded-lg w-80 mx-auto"></div>
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Comprehensive Schema Markup for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://ralhumsports.lk/#organization',
            name: 'Ralhum Sports Sri Lanka',
            alternateName: ['Ralhum Store', 'ralhumsports.lk'],
            url: 'https://ralhumsports.lk',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ralhumsports.lk/ralhumlogo.svg',
              width: 300,
              height: 300
            },
            image: 'https://ralhumsports.lk/ralhumbanner.png',
            description: 'Ralhum Sports Sri Lanka (ralhumsports.lk) - your trusted Ralhum Store for premium sports equipment. Official distributor of Gray-Nicolls, Gilbert, Molten & Grays in Sri Lanka since 1990.',
            foundingDate: '1990',
            slogan: 'Sri Lanka\'s Premier Sports Equipment Store',
            telephone: '+94 11 234 5678',
            email: 'info@ralhumsports.lk',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Colombo Road',
              addressLocality: 'Colombo',
              addressRegion: 'Western Province',
              postalCode: '00400',
              addressCountry: 'LK'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '6.9271',
              longitude: '79.8612'
            },
            sameAs: [
              'https://facebook.com/ralhumsports',
              'https://instagram.com/ralhumsports'
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Sports Equipment Catalog',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Cricket Equipment',
                    category: 'Sports Equipment'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Rugby Equipment',
                    category: 'Sports Equipment'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Basketball Equipment',
                    category: 'Sports Equipment'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Hockey Equipment',
                    category: 'Sports Equipment'
                  }
                }
              ]
            },
            areaServed: {
              '@type': 'Country',
              name: 'Sri Lanka'
            }
          })
        }}
      />

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://ralhumsports.lk/#localbusiness',
            name: 'Ralhum Sports Sri Lanka',
            alternateName: 'Ralhum Store',
            url: 'https://ralhumsports.lk',
            telephone: '+94 11 234 5678',
            email: 'info@ralhumsports.lk',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Colombo Road',
              addressLocality: 'Colombo',
              addressRegion: 'Western Province',
              postalCode: '00400',
              addressCountry: 'LK'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '6.9271',
              longitude: '79.8612'
            },
            openingHours: ['Mo-Sa 09:00-18:00'],
            priceRange: '$$',
            paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
            currenciesAccepted: 'LKR'
          })
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://ralhumsports.lk/#website',
            url: 'https://ralhumsports.lk',
            name: 'Ralhum Sports Sri Lanka',
            alternateName: 'ralhumsports.lk',
            description: 'Official website of Ralhum Sports Sri Lanka - your trusted Ralhum Store for premium sports equipment.',
            publisher: {
              '@id': 'https://ralhumsports.lk/#organization'
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://ralhumsports.lk/products?search={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />

      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SportsCategories />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <BrandPartners />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Heritage />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactCTA />
      </Suspense>
    </>
  )
}
