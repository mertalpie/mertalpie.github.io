import AnimatedBackground from '@/components/AnimatedBackground';
import HeroSection from '@/components/sections/HeroSection';
import ProductSection from '@/components/sections/ProductSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import UseCasesSection from '@/components/sections/UseCasesSection';
import PricingSection from '@/components/sections/PricingSection';
import DemoSection from '@/components/sections/DemoSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10">
        <HeroSection />
        <ProductSection />
        <FeaturesSection />
        <UseCasesSection />
        <PricingSection />
        <DemoSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
