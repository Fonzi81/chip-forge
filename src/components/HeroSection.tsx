
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden circuit-pattern">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-green rounded-full animate-pulse-glow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon-purple rounded-full animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse-glow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-neon-purple rounded-full animate-pulse-glow" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Circuit lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent animate-shimmer"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent animate-shimmer" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent animate-shimmer" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          From <span className="gradient-text">Plain English</span> to Silicon.
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
          AI-designed Chips for a <span className="text-neon-purple">Post-China Era</span>.
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
          <span className="text-neon-green font-semibold">Automated.</span>{" "}
          <span className="text-neon-purple font-semibold">Scalable.</span>{" "}
          <span className="text-white font-semibold">Locally Controlled.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button size="lg" className="bg-neon-green text-black hover:bg-green-400 font-semibold px-8 py-4 text-lg glow-green transition-all duration-300 hover:scale-105">
            Book a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
            <Play className="mr-2 h-5 w-5" />
            Investor Deck
          </Button>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-60 animate-float">
          <div className="w-12 h-12 border border-neon-green rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-neon-green rounded-sm opacity-80"></div>
          </div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-60 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-16 h-16 border border-neon-purple rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-neon-purple rounded-sm opacity-80"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
