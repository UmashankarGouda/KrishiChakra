import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import HeroSection from '@/components/hero-section'
import ProblemSolutionSection from '@/components/problem-solution-section'
import ProductDemoSection from '@/components/product-demo-section'
import { CTASection } from '@/components/cta-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <ProductDemoSection />
      <CTASection />
      <Footer />
    </div>
  )
}