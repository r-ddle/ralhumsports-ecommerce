import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, Phone } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-12">
            {/* 404 Graphic */}
            <div className="mb-8">
              <div className="text-8xl font-black text-[#003DA5] mb-4">404</div>
              <div className="w-24 h-1 bg-gradient-to-r from-[#003DA5] to-[#FF3D00] mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-black text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
              moved, deleted, or you entered the wrong URL.
            </p>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Button
                size="lg"
                className="bg-[#003DA5] hover:bg-[#003DA5]/90 text-white font-bold"
                asChild
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white font-bold"
                asChild
              >
                <Link href="/products">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>

            {/* Popular Links */}
            <div className="text-left">
              <h3 className="font-bold text-gray-900 mb-4">Popular Pages:</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/products"
                  className="text-[#003DA5] hover:underline text-sm font-medium"
                >
                  → Sports Equipment Store
                </Link>
                <Link href="/brands" className="text-[#003DA5] hover:underline text-sm font-medium">
                  → Our Brands
                </Link>
                <Link href="/about" className="text-[#003DA5] hover:underline text-sm font-medium">
                  → About Ralhum Sports
                </Link>
                <Link href="/news" className="text-[#003DA5] hover:underline text-sm font-medium">
                  → Latest News
                </Link>
                <Link
                  href="/contact"
                  className="text-[#003DA5] hover:underline text-sm font-medium"
                >
                  → Contact Us
                </Link>
                <Link href="/sports" className="text-[#003DA5] hover:underline text-sm font-medium">
                  → Sports Expertise
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t text-sm text-gray-600">
              <p className="mb-4">Need help finding what you&apos;re looking for?</p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-[#003DA5] hover:underline font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Contact Support
                </Link>
                <span>•</span>
                <a
                  href="tel:+94772350712"
                  className="flex items-center gap-2 text-[#003DA5] hover:underline font-medium"
                >
                  📞 +94 77 235 0712
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
