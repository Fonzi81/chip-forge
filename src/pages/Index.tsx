
import LivingBackground from "@/components/LivingBackground";
import HeroSection from "@/components/HeroSection";
import ProductHighlights from "@/components/ProductHighlights";
import HowItWorks from "@/components/HowItWorks";
import PainSolutionGrid from "@/components/PainSolutionGrid";
import LiveDemoSection from "@/components/LiveDemoSection";
import TechDeepDive from "@/components/TechDeepDive";
import EnterpriseCTA from "@/components/EnterpriseCTA";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">
      <LivingBackground />
      <div className="relative z-10">
        <HeroSection />
        <ProductHighlights />
        <HowItWorks />
        <PainSolutionGrid />
        <LiveDemoSection />
        <TechDeepDive />
        <EnterpriseCTA />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
