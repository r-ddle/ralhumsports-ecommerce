import Hero from "@/components/hero"
import BrandPartners from "@/components/brand-partners"
import SportsCategories from "@/components/sports-categories"
import Heritage from "@/components/heritage"
import ContactCTA from "@/components/contact-cta"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BrandPartners />
      <SportsCategories />
      <Heritage />
      <ContactCTA />
    </main>
  )
}
