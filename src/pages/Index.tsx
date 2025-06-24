
import HeroSection from "@/components/HeroSection";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import WhyNowWhyUs from "@/components/WhyNowWhyUs";
import MarketOpportunity from "@/components/MarketOpportunity";
import ProductPreviews from "@/components/ProductPreviews";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
      <HeroSection />
      <ProblemSolution />
      <HowItWorks />
      <WhyNowWhyUs />
      <MarketOpportunity />
      <ProductPreviews />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
