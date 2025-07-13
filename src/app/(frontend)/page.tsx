import Hero from '@/components/hero'
import BrandPartners from '@/components/brand-partners'
import SportsCategories from '@/components/sports-categories'
import Heritage from '@/components/heritage'
import ContactCTA from '@/components/contact-cta'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Ralhum Sports - Sri Lanka's #1 Sports Equipment Distributor",
  description:
    'Shop premium sports equipment from world-renowned brands. Exclusive distributor of Gray-Nicolls, Gilbert, Grays & Molten in Sri Lanka.',
  openGraph: {
    title: 'Ralhum Sports - Premium Sports Equipment Store',
    description:
      'Shop the best sports equipment from trusted global brands. Fast delivery across Sri Lanka.',
    images: ['/og-image.jpg'],
  },
}

// Loading components for each section
function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-pulse">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <div className="h-4 bg-gray-700 rounded w-48 mx-auto"></div>
          <div className="h-16 bg-gray-700 rounded w-96 mx-auto"></div>
          <div className="h-6 bg-gray-700 rounded w-80 mx-auto"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gray-700 rounded w-32"></div>
            <div className="h-12 bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
          <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-300 rounded w-80 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <BrandPartners />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SportsCategories />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Heritage />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactCTA />
      </Suspense>
    </main>
  )
}
