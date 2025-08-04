import { Suspense } from 'react'
import { productsMetadata } from './metadata'
import type { Metadata } from 'next'

// Import the existing client component
import ProductsClientPage from './client-page'

export const metadata: Metadata = productsMetadata

export default function ProductsPage() {
  return (
    <>
      {/* Add structured data for products page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Sports Products - Ralhum Sports Sri Lanka',
            description: 'Browse premium sports products at Ralhum Sports Sri Lanka (ralhumsports.lk). Find cricket, rugby, hockey, basketball equipment from Gray-Nicolls, Gilbert, Molten & Grays.',
            url: 'https://ralhumsports.lk/products',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: 'Variable',
              itemListElement: 'Dynamic product list'
            },
            provider: {
              '@type': 'Organization',
              name: 'Ralhum Sports Sri Lanka',
              url: 'https://ralhumsports.lk',
              sameAs: [
                'https://facebook.com/ralhumsports',
                'https://instagram.com/ralhumsports'
              ]
            }
          })
        }}
      />
      
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsClientPage />
      </Suspense>
    </>
  )
}