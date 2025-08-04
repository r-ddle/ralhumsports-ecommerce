import { Suspense } from 'react'
import type { Metadata } from 'next'

// Import the existing client component
import BrandsClientPage from './client-page'

export const metadata: Metadata = {
  title: 'Official Sports Brands at Ralhum Sports Sri Lanka | Gray-Nicolls, Gilbert, Molten',
  description:
    'Discover premium sports brands at Ralhum Sports Sri Lanka (ralhumsports.lk). Official distributor of Gray-Nicolls cricket, Gilbert rugby, Molten basketball, Grays hockey equipment and more at our Ralhum Store.',
  keywords: [
    'sports brands sri lanka',
    'Gray-Nicolls sri lanka',
    'Gilbert rugby sri lanka',
    'Molten basketball sri lanka',
    'Grays hockey sri lanka',
    'ralhumsports.lk brands',
    'ralhum sports brands',
    'ralhum store brands',
    'official sports distributor',
    'premium sports brands',
    'cricket brands sri lanka',
    'rugby brands sri lanka',
    'basketball brands sri lanka',
    'hockey brands sri lanka'
  ].join(', '),
  openGraph: {
    title: 'Premium Sports Brands - Ralhum Sports Sri Lanka | ralhumsports.lk',
    description:
      'Explore premium sports brands at ralhumsports.lk. Official Ralhum Store for Gray-Nicolls, Gilbert, Molten, Grays and more.',
    url: 'https://ralhumsports.lk/brands',
    images: [
      {
        url: 'https://ralhumsports.lk/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Premium Sports Brands - Ralhum Sports Sri Lanka',
      }
    ],
  },
  twitter: {
    title: 'Premium Sports Brands - Ralhum Sports Sri Lanka',
    description: 'Explore premium sports brands at ralhumsports.lk - your trusted Ralhum Store.',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk/brands',
  },
}

export default function BrandsPage() {
  return (
    <>
      {/* Add structured data for brands collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Sports Brands - Ralhum Sports Sri Lanka',
            description: 'Premium sports brands available at Ralhum Sports Sri Lanka including Gray-Nicolls, Gilbert, Molten, and Grays.',
            url: 'https://ralhumsports.lk/brands',
            mainEntity: {
              '@type': 'ItemList',
              name: 'Sports Brands',
              itemListElement: [
                {
                  '@type': 'Brand',
                  name: 'Gray-Nicolls',
                  description: 'Premium cricket equipment and gear',
                  url: 'https://ralhumsports.lk/products?brand=gray-nicolls'
                },
                {
                  '@type': 'Brand',
                  name: 'Gilbert',
                  description: 'Professional rugby equipment and balls',
                  url: 'https://ralhumsports.lk/products?brand=gilbert'
                },
                {
                  '@type': 'Brand',
                  name: 'Molten',
                  description: 'High-quality basketball and volleyball equipment',
                  url: 'https://ralhumsports.lk/products?brand=molten'
                },
                {
                  '@type': 'Brand',
                  name: 'Grays',
                  description: 'Professional hockey sticks and equipment',
                  url: 'https://ralhumsports.lk/products?brand=grays'
                }
              ]
            },
            provider: {
              '@type': 'Organization',
              '@id': 'https://ralhumsports.lk/#organization'
            }
          })
        }}
      />
      
      <Suspense fallback={<div>Loading brands...</div>}>
        <BrandsClientPage />
      </Suspense>
    </>
  )
}