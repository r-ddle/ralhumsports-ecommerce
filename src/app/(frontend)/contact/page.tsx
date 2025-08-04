import { Suspense } from 'react'
import type { Metadata } from 'next'

// Import the existing client component
import ContactClientPage from './client-page'

export const metadata: Metadata = {
  title: 'Contact Ralhum Sports Sri Lanka - Get Expert Sports Equipment Advice',
  description:
    'Contact Ralhum Sports Sri Lanka (ralhumsports.lk) for expert sports equipment advice. Visit our Ralhum Store, call us, or WhatsApp for personalized quotes on Gray-Nicolls, Gilbert, Molten & Grays products.',
  keywords: [
    'contact ralhum sports sri lanka',
    'ralhum sports contact',
    'ralhumsports.lk contact',
    'ralhum store contact',
    'sports equipment quote sri lanka',
    'buy sports gear sri lanka',
    'sports equipment advice',
    'cricket gear quote',
    'rugby equipment quote',
    'contact sports distributor',
    'sports equipment consultation',
    'ralhum sports phone number'
  ].join(', '),
  openGraph: {
    title: 'Contact Ralhum Sports Sri Lanka - Expert Sports Equipment Advice',
    description:
      'Get in touch with Ralhum Sports Sri Lanka (ralhumsports.lk) for expert advice on sports equipment. Your trusted Ralhum Store for premium gear.',
    url: 'https://ralhumsports.lk/contact',
    images: [
      {
        url: 'https://ralhumsports.lk/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Contact Ralhum Sports Sri Lanka - Expert Sports Equipment Advice',
      }
    ],
  },
  twitter: {
    title: 'Contact Ralhum Sports Sri Lanka | ralhumsports.lk',
    description: 'Get expert sports equipment advice from ralhumsports.lk - your trusted Ralhum Store.',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk/contact',
  },
}

export default function ContactPage() {
  return (
    <>
      {/* Add structured data for local business contact */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://ralhumsports.lk/#organization',
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
            servesCuisine: 'Sports Equipment',
            paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
            currenciesAccepted: 'LKR'
          })
        }}
      />
      
      <Suspense fallback={<div>Loading contact page...</div>}>
        <ContactClientPage />
      </Suspense>
    </>
  )
}