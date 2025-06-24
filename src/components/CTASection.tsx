
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, HandHeart, Shield, Zap, Globe } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-slate-900/50 relative overflow-hidden">
      {/* Professional background effects */}
      <div className="absolute inset-0 silicon-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Executive summary */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-cyan-500/20 rounded-full mb-8">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
          <span className="text-sm text-slate-300 font-medium">Ready for Production Deployment</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
          Transform Your <span className="gradient-text">Chip Design</span>
        </h2>
        <h3 className="text-2xl md:text-4xl font-light mb-8 text-slate-400">
          From months to <span className="text-cyan-400 font-semibold">hours</span>. 
          From manual to <span className="text-blue-400 font-semibold">AI-native</span>.
        </h3>

        <p className="text-xl text-slate-400 mb-16 max-w-4xl mx-auto leading-relaxed">
          Join leading semiconductor organizations, government agencies, and research institutions 
          already using ChipForge for mission-critical chip design automation.
        </p>

        {/* Professional CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Button 
            size="lg" 
            className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 font-semibold px-10 py-6 text-xl enterprise-shadow-lg transition-all duration-200 hover:scale-105 min-w-[220px]"
          >
            <Calendar className="mr-3 h-6 w-6" />
            Schedule Demo
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-slate-900 font-semibold px-10 py-6 text-xl transition-all duration-200 hover:scale-105 min-w-[220px]"
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            Enterprise Sales
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold px-10 py-6 text-xl transition-all duration-200 hover:scale-105 min-w-[220px]"
          >
            <HandHeart className="mr-3 h-6 w-6" />
            Strategic Partnership
          </Button>
        </div>

        {/* Enterprise value propositions */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="p-8 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-cyan-400" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-cyan-400">AI-Native Speed</h4>
            <p className="text-slate-400 leading-relaxed">From natural language specification to production-ready HDL in minutes, not months</p>
            <div className="mt-4 text-sm text-cyan-400 font-semibold">500x faster development</div>
          </div>
          
          <div className="p-8 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-blue-400">Sovereign Control</h4>
            <p className="text-slate-400 leading-relaxed">Complete on-premises deployment with zero external dependencies or data sharing</p>
            <div className="mt-4 text-sm text-blue-400 font-semibold">100% data sovereignty</div>
          </div>
          
          <div className="p-8 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-emerald-400">Enterprise Scale</h4>
            <p className="text-slate-400 leading-relaxed">SOC 2 certified platform trusted by government and Fortune 500 organizations</p>
            <div className="mt-4 text-sm text-emerald-400 font-semibold">Production validated</div>
          </div>
        </div>

        {/* Urgency and scarcity messaging */}
        <div className="p-8 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 rounded-xl border border-cyan-500/30 max-w-4xl mx-auto">
          <h4 className="text-2xl font-bold mb-4 gradient-text">Limited Availability Program</h4>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            We're accepting only <span className="text-cyan-400 font-semibold">50 organizations</span> into our 
            enterprise deployment program for 2025. Join industry leaders shaping the future of sovereign chip design.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 rounded-lg">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300">White-glove onboarding</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 rounded-lg">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-slate-300">Dedicated AI training</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-800/50 rounded-lg">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">24/7 enterprise support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
