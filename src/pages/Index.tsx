
import LivingBackground from "@/components/LivingBackground";
import HeroSection from "@/components/HeroSection";
import ConsolidatedSolution from "@/components/ConsolidatedSolution";
import HowItWorks from "@/components/HowItWorks";
import MarketOpportunity from "@/components/MarketOpportunity";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">
      <LivingBackground />
      <div className="relative z-10">
        <HeroSection />
        <ConsolidatedSolution />
        <HowItWorks />
        <MarketOpportunity />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
