import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Cpu, Zap, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Login button - top right */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          onClick={handleLoginClick}
          className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 font-semibold px-6 py-2 transition-all duration-200 hover:scale-105"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </div>

      <div className="relative z-10 text-center max-w-7xl mx-auto px-6 py-20">
        {/* Professional status indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-cyan-500/20 rounded-full mb-8 animate-fade-in">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
          <span className="text-sm text-slate-300 font-medium">ChipForge AI Engine Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight animate-fade-in" style={{animationDelay: '0.2s'}}>
          From <span className="gradient-text">Idea</span> to Silicon
        </h1>
        
        <div className="text-xl md:text-2xl text-slate-400 mb-4 font-light animate-fade-in" style={{animationDelay: '0.4s'}}>
          The World's First AI-Native Chip Design Platform
        </div>
        
        <p className="text-lg md:text-xl mb-12 text-slate-400 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
          ChipForge is the first AI-native platform that transforms plain English into verified, simulation-passed, synthesis-ready HDL. 
          <span className="text-cyan-400 font-medium">No manual coding. No toolchain juggling. Just chips — fast, local, and sovereign.</span>
        </p>

        {/* Professional CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <Button size="lg" className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 font-semibold px-8 py-4 text-lg enterprise-shadow-lg transition-all duration-200 hover:scale-105 min-w-[180px]">
            <Cpu className="mr-2 h-5 w-5" />
            Try the Generator
          </Button>
          <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500 font-semibold px-8 py-4 text-lg transition-all duration-200 hover:scale-105 min-w-[180px]">
            <Play className="mr-2 h-5 w-5" />
            See How It Works
          </Button>
        </div>

        {/* Technical specifications preview */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '1s'}}>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-cyan-400 mb-1">100%</div>
            <div className="text-sm text-slate-400">Syntax Guarantee</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-blue-400 mb-1">&lt; 30s</div>
            <div className="text-sm text-slate-400">HDL Generation</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-emerald-400 mb-1">AI-Native</div>
            <div className="text-sm text-slate-400">Processing</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 technical-hover">
            <div className="text-2xl font-bold text-cyan-400 mb-1">Sovereign</div>
            <div className="text-sm text-slate-400">Deploy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
