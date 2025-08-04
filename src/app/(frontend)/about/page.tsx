import { Suspense } from 'react'
import type { Metadata } from 'next'

// Import the existing client component
import AboutClientPage from './client-page'

export const metadata: Metadata = {
  title: 'About Ralhum Sports Sri Lanka - 30+ Years of Sports Excellence',
  description:
    'Learn about Ralhum Sports Sri Lanka (ralhumsports.lk) - your trusted Ralhum Store since 1990. Over 30 years as Sri Lanka\'s leading sports equipment distributor serving Gray-Nicolls, Gilbert, Molten & Grays.',
  keywords: [
    'about ralhum sports sri lanka',
    'ralhum sports history',
    'ralhumsports.lk about',
    'ralhum store history',
    'sports distributor sri lanka',
    'Gray-Nicolls distributor sri lanka',
    'Gilbert rugby distributor',
    'Molten basketball distributor',
    'Grays hockey distributor',
    'sports equipment company sri lanka',
    'ralhum trading company',
    'sports business sri lanka'
  ].join(', '),
  openGraph: {
    title: 'About Ralhum Sports Sri Lanka - 30+ Years of Excellence',
    description:
      'Discover the story of Ralhum Sports Sri Lanka (ralhumsports.lk) - your trusted Ralhum Store since 1990. Leading sports equipment distributor in Sri Lanka.',
    url: 'https://ralhumsports.lk/about',
    images: [
      {
        url: '/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'About Ralhum Sports Sri Lanka - 30+ Years of Excellence',
      }
    ],
  },
  twitter: {
    title: 'About Ralhum Sports Sri Lanka | ralhumsports.lk',
    description: 'Discover the story of ralhumsports.lk - your trusted Ralhum Store since 1990.',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk/about',
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Add structured data for organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Ralhum Sports Sri Lanka',
            alternateName: ['Ralhum Store', 'Ralhum Trading Company'],
            url: 'https://ralhumsports.lk',
            logo: '/ralhumlogo.svg',
            foundingDate: '1990',
            description: 'Leading sports equipment distributor in Sri Lanka for over 30 years, serving as official distributor for Gray-Nicolls, Gilbert, Molten & Grays.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Colombo Road',
              addressLocality: 'Colombo',
              addressRegion: 'Western Province',
              postalCode: '00400',
              addressCountry: 'LK'
            },
            sameAs: [
              'https://facebook.com/ralhumsports',
              'https://instagram.com/ralhumsports'
            ],
            knowsAbout: [
              'Sports Equipment',
              'Cricket Gear',
              'Rugby Equipment',
              'Basketball Equipment',
              'Hockey Equipment',
              'Tennis Equipment'
            ]
          })
        }}
      />
      
      <Suspense fallback={<div>Loading about page...</div>}>
        <AboutClientPage />
      </Suspense>
    </>
  )
}