
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Zap, AlertTriangle, CheckCircle } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section className="py-24 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-amber-500/20 rounded-full mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-300 font-medium">Industry Challenge Analysis</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            Semiconductor design is still <span className="text-amber-400">fundamentally manual</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            ChipForge introduces AI-native automation to an industry relying on decades-old methodologies
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Traditional Workflow - Professional styling */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/30 transition-all duration-300 enterprise-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400">Traditional HDL Development</h3>
                  <p className="text-slate-400 text-sm">Legacy Engineering Workflow</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">6-12 Month Development Cycles</div>
                    <div className="text-sm text-slate-400">Manual specification → HDL → verification loop</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Expert-Only HDL Coding</div>
                    <div className="text-sm text-slate-400">Requires years of specialized training</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Manual Testing & Verification</div>
                    <div className="text-sm text-slate-400">Error-prone, time-intensive validation</div>
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

              <div className="mt-8 p-6 bg-slate-900 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-500 mb-2">// Traditional Verilog - Manual Implementation</div>
                <code className="text-sm text-amber-300 font-mono leading-relaxed block">
                  module counter(clk, reset, count);<br/>
                  &nbsp;&nbsp;input clk, reset;<br/>
                  &nbsp;&nbsp;output [3:0] count;<br/>
                  &nbsp;&nbsp;reg [3:0] count;<br/>
                  &nbsp;&nbsp;// 150+ lines of manual HDL...<br/>
                  &nbsp;&nbsp;// Hours of debugging required
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Arrow with animation */}
          <div className="flex justify-center lg:flex-col lg:items-center">
            <ArrowRight className="h-12 w-12 text-cyan-400 animate-data-pulse" />
            <div className="hidden lg:block text-center mt-4">
              <div className="text-sm text-slate-400 font-medium">AI Transformation</div>
            </div>
          </div>

          {/* ChipForge Workflow - Professional styling */}
          <Card className="bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 enterprise-shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400">ChipForge AI Pipeline</h3>
                  <p className="text-slate-400 text-sm">Automated Design Synthesis</p>
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
                    <div className="font-semibold text-slate-200 mb-1">Natural Language Interface</div>
                    <div className="text-sm text-slate-400">Plain English specifications</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">AI-Powered Verification</div>
                    <div className="text-sm text-slate-400">Automated testing with formal methods</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-semibold text-slate-200 mb-1">Sovereign Deployment</div>
                    <div className="text-sm text-slate-400">Local control, zero external dependencies</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-900 rounded-lg border border-cyan-500/30">
                <div className="text-xs text-slate-500 mb-2">// ChipForge Input/Output</div>
                <code className="text-sm font-mono leading-relaxed block">
                  <span className="text-cyan-400">{'"Create a 4-bit counter with reset"'}</span><br/>
                  <span className="text-slate-400">🤖 Analyzing requirements...</span><br/>
                  <span className="text-emerald-400">✓ HDL generated & optimized</span><br/>
                  <span className="text-blue-400">✓ Formal verification complete</span><br/>
                  <span className="text-cyan-400">✓ Ready for fabrication</span>
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quantified improvements */}
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-emerald-400 mb-2">500x</div>
            <div className="text-slate-400 text-sm">Faster Development</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-cyan-400 mb-2">98.7%</div>
            <div className="text-slate-400 text-sm">Verification Accuracy</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">40%</div>
            <div className="text-slate-400 text-sm">Area Reduction</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="text-3xl font-bold text-emerald-400 mb-2">Zero</div>
            <div className="text-slate-400 text-sm">External Dependencies</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
