import { Suspense } from 'react'
import Hero from '@/components/hero'
import SportsCategories from '@/components/sports-categories'
import BrandPartners from '@/components/brand-partners'
import Heritage from '@/components/heritage'
import ContactCTA from '@/components/contact-cta'
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
