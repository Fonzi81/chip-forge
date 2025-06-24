
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Cpu, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden silicon-pattern">
      {/* Professional background elements */}
      <div className="absolute inset-0 opacity-10">
        {/* Silicon wafer rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-cyan-500/20 rounded-full animate-silicon-etch"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-blue-500/20 rounded-full animate-silicon-etch" style={{animationDelay: '2s'}}></div>
        
        {/* Circuit traces */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 L 25 50 L 25 25 L 75 25 L 75 75 L 100 75" 
                    stroke="rgb(6 182 212 / 0.1)" strokeWidth="0.5" fill="none" 
                    strokeDasharray="2,2" className="animate-trace-flow"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-7xl mx-auto px-6">
        {/* Professional status indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-cyan-500/20 rounded-full mb-8">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
          <span className="text-sm text-slate-300 font-medium">ChipForge AI Engine Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
          From <span className="gradient-text">Specification</span>
          <br />to Silicon
        </h1>
        
        <div className="text-xl md:text-2xl text-slate-400 mb-4 font-light">
          Enterprise AI-Native Chip Design Platform
        </div>
        
        <p className="text-lg md:text-xl mb-12 text-slate-400 max-w-4xl mx-auto leading-relaxed">
          Automated HDL generation, verification, and optimization for sovereign semiconductor development. 
          <span className="text-cyan-400 font-medium"> Reduce 6-month cycles to hours.</span>
        </p>

        {/* Professional CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button size="lg" className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 font-semibold px-8 py-4 text-lg enterprise-shadow-lg transition-all duration-200 hover:scale-105 min-w-[180px]">
            <Cpu className="mr-2 h-5 w-5" />
            Request Demo
          </Button>
          <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500 font-semibold px-8 py-4 text-lg transition-all duration-200 hover:scale-105 min-w-[180px]">
            <Play className="mr-2 h-5 w-5" />
            Technical Overview
          </Button>
        </div>

        {/* Technical specifications preview */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-cyan-400 mb-1">98.7%</div>
            <div className="text-sm text-slate-400">Verification Accuracy</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-blue-400 mb-1">&lt; 30s</div>
            <div className="text-sm text-slate-400">HDL Generation</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-emerald-400 mb-1">40%</div>
            <div className="text-sm text-slate-400">Area Optimization</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-cyan-400 mb-1">SOC2</div>
            <div className="text-sm text-slate-400">Compliance</div>
          </div>
        </div>

        {/* Subtle professional decorative elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <div className="w-16 h-16 border border-cyan-500/30 rounded-lg rotate-45 animate-data-pulse">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-sm m-4"></div>
          </div>
        </div>
        <div className="absolute bottom-32 right-10 opacity-30">
          <div className="w-12 h-12 border border-blue-500/30 rounded-lg rotate-12 animate-data-pulse" style={{animationDelay: '1s'}}>
            <div className="w-6 h-6 bg-blue-500/20 rounded-sm m-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
