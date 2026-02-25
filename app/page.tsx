import ParticleBackground from '@/components/ParticleBackground';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import FeaturesSection from '@/components/FeaturesSection';
import UseCasesSection from '@/components/UseCasesSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <ParticleBackground />
      <div className="relative z-10">
        <HeroSection />
        <ProductSection />
        <FeaturesSection />
        <UseCasesSection />
        <PricingSection />
        {/* Placeholder sections for PR 3 */}
        <section id="demo" className="min-h-screen flex items-center justify-center py-20 px-4">
          <h2 className="text-4xl font-bold text-slate-100">Demo</h2>
        </section>
        <section id="faq" className="min-h-screen flex items-center justify-center py-20 px-4">
          <h2 className="text-4xl font-bold text-slate-100">FAQ</h2>
        </section>
        <section id="contact" className="min-h-screen flex items-center justify-center py-20 px-4">
          <h2 className="text-4xl font-bold text-slate-100">Contact</h2>
        </section>
        <Footer />
      </div>
    </main>
  );
}
