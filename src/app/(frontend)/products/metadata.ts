import type { Metadata } from 'next'

export const productsMetadata: Metadata = {
  title: 'Sports Products - Premium Equipment at Ralhum Sports Sri Lanka',
  description:
    'Browse premium sports products at Ralhum Sports Sri Lanka (ralhumsports.lk). Find cricket, rugby, hockey, basketball equipment from Gray-Nicolls, Gilbert, Molten & Grays.',
  keywords: [
    'sports products sri lanka',
    'ralhumsports.lk products',
    'ralhum sports sri lanka products',
    'ralhum store products',
    'cricket equipment sri lanka',
    'rugby gear sri lanka',
    'hockey equipment colombo',
    'basketball gear sri lanka',
    'Gray-Nicolls products sri lanka',
    'Gilbert rugby products',
    'Molten basketball products',
    'Grays hockey products',
    'sports equipment catalog',
    'premium sports gear'
  ].join(', '),
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    siteName: 'Ralhum Sports Sri Lanka',
    title: 'Sports Products - Ralhum Sports Sri Lanka | ralhumsports.lk',
    description:
      'Explore premium sports products at ralhumsports.lk. Official Ralhum Store with cricket, rugby, hockey equipment from top brands.',
    url: 'https://www.ralhumsports.lk/products',
    images: [
      {
        url: 'https://www.ralhumsports.lk/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Sports Products - Ralhum Sports Sri Lanka',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ralhumsports',
    creator: '@ralhumsports',
    title: 'Sports Products - Ralhum Sports Sri Lanka',
    description: 'Browse premium sports products at ralhumsports.lk - your trusted Ralhum Store.',
    images: [
      {
        url: 'https://www.ralhumsports.lk/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Sports Products - Ralhum Sports Sri Lanka',
      }
    ],
  },
  alternates: {
    canonical: 'https://www.ralhumsports.lk/products',
  },
}