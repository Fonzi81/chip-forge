
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Zap, AlertTriangle, CheckCircle, Timer, Cpu } from "lucide-react";

const ConsolidatedSolution = () => {
  return (
    <section className="relative py-32 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-amber-500/20 rounded-full mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-300 font-medium">Industry Transformation</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            The Semiconductor <span className="gradient-text">Revolution</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            From months of manual HDL development to hours of AI-powered automation
          </p>
        </div>

        {/* Problem vs Solution Comparison */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Traditional Challenges */}
          <Card className="bg-slate-800/30 border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 enterprise-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400">Traditional Challenges</h3>
                  <p className="text-slate-400 text-sm">Current Industry Pain Points</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">6-12 Month Development Cycles</div>
                    <div className="text-sm text-slate-400">Manual specification → HDL → verification → repeat</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Critical Skills Shortage</div>
                    <div className="text-sm text-slate-400">1M+ missing HDL engineers globally</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Manual Error-Prone Processes</div>
                    <div className="text-sm text-slate-400">Extensive debugging and rework cycles</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Supply Chain Dependencies</div>
                    <div className="text-sm text-slate-400">Reliance on external tool ecosystems</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-900/70 rounded-lg border border-slate-700">
                <div className="text-amber-400 font-semibold text-center text-lg">$17.5B Market Waiting for Innovation</div>
              </div>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="flex justify-center lg:flex-col lg:items-center">
            <ArrowRight className="h-16 w-16 text-cyan-400 animate-data-pulse" />
            <div className="hidden lg:block text-center mt-4">
              <div className="text-sm text-slate-400 font-medium">AI Transformation</div>
            </div>
          </div>

          {/* ChipForge Solution */}
          <Card className="bg-slate-800/30 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 enterprise-shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400">ChipForge AI Solution</h3>
                  <p className="text-slate-400 text-sm">Automated Design Revolution</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Hours to Production HDL</div>
                    <div className="text-sm text-slate-400">Natural language → optimized implementation</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Democratized Access</div>
                    <div className="text-sm text-slate-400">Plain English specifications, no HDL expertise required</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">AI-Powered Verification</div>
                    <div className="text-sm text-slate-400">98.7% accuracy with formal methods</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Sovereign Deployment</div>
                    <div className="text-sm text-slate-400">Zero external dependencies, complete control</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-900/70 rounded-lg border border-cyan-500/30">
                <div className="text-cyan-400 font-semibold text-center text-lg">500x Faster Development</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quantified Impact Metrics */}
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-slate-800/20 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all duration-300">
            <div className="text-4xl font-bold text-emerald-400 mb-2">500x</div>
            <div className="text-slate-400">Faster Development</div>
            <div className="text-xs text-slate-500 mt-2">Months → Hours</div>
          </div>
          <div className="text-center p-8 bg-slate-800/20 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-all duration-300">
            <div className="text-4xl font-bold text-cyan-400 mb-2">98.7%</div>
            <div className="text-slate-400">Verification Accuracy</div>
            <div className="text-xs text-slate-500 mt-2">AI-Powered Quality</div>
          </div>
          <div className="text-center p-8 bg-slate-800/20 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all duration-300">
            <div className="text-4xl font-bold text-blue-400 mb-2">40%</div>
            <div className="text-slate-400">Area Optimization</div>
            <div className="text-xs text-slate-500 mt-2">Silicon Efficiency</div>
          </div>
          <div className="text-center p-8 bg-slate-800/20 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all duration-300">
            <div className="text-4xl font-bold text-emerald-400 mb-2">Zero</div>
            <div className="text-slate-400">External Dependencies</div>
            <div className="text-xs text-slate-500 mt-2">Sovereign Control</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsolidatedSolution;
