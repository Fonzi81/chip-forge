
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, HandHeart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-dark-surface relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 circuit-pattern opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Build <span className="gradient-text">chips</span>.
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold mb-8 text-gray-300">
          No expertise needed.
        </h3>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Join the revolution in chip design. From concept to silicon in hours, not months.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="bg-neon-green text-black hover:bg-green-400 font-bold px-8 py-6 text-xl glow-green transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            <Users className="mr-3 h-6 w-6" />
            Get Early Access
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black font-bold px-8 py-6 text-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            Talk to Sales
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-black font-bold px-8 py-6 text-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            <HandHeart className="mr-3 h-6 w-6" />
            Partner With Us
          </Button>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-neon-green transition-all duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-xl font-bold mb-2 text-neon-green">Lightning Fast</h4>
            <p className="text-gray-400">From plain English to verified HDL in minutes</p>
          </div>
          
          <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-neon-purple transition-all duration-300">
            <div className="text-4xl mb-4">🛡️</div>
            <h4 className="text-xl font-bold mb-2 text-neon-purple">Sovereign Control</h4>
            <p className="text-gray-400">Local deployment, complete data sovereignty</p>
          </div>
          
          <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-neon-green transition-all duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-xl font-bold mb-2 text-white">Production Ready</h4>
            <p className="text-gray-400">Enterprise-grade reliability and compliance</p>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="mt-12 p-6 bg-gradient-to-r from-neon-green/10 to-neon-purple/10 rounded-lg border border-neon-green/30">
          <p className="text-lg text-gray-300">
            <span className="text-neon-green font-semibold">Limited Beta Access:</span> Join the first 100 organizations shaping the future of chip design
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
