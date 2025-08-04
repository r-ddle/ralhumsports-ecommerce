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
    title: 'Sports Products - Ralhum Sports Sri Lanka | ralhumsports.lk',
    description:
      'Explore premium sports products at ralhumsports.lk. Official Ralhum Store with cricket, rugby, hockey equipment from top brands.',
    url: 'https://ralhumsports.lk/products',
    images: [
      {
        url: '/ralhumbanner.png',
        width: 1200,
        height: 630,
        alt: 'Sports Products - Ralhum Sports Sri Lanka',
      }
    ],
  },
  twitter: {
    title: 'Sports Products - Ralhum Sports Sri Lanka',
    description: 'Browse premium sports products at ralhumsports.lk - your trusted Ralhum Store.',
  },
  alternates: {
    canonical: 'https://ralhumsports.lk/products',
  },
}