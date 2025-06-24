
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Code, Zap, Clock, Users } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section className="py-20 px-6 bg-dark-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Chip design is still stuck in 2005
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ChipForge rewires the pipeline for an <span className="text-neon-green">AI-native world</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Traditional Workflow */}
          <Card className="bg-gray-900 border-gray-700 hover:border-red-500 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Clock className="h-8 w-8 text-red-400 mr-3" />
                <h3 className="text-2xl font-bold text-red-400">Manual HDL Workflow</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  <span>6-12 months development cycles</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  <span>Expert-only HDL coding</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  <span>Manual testing & verification</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  <span>Supply chain dependencies</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <code className="text-sm text-gray-400">
                  module counter(clk, reset, count);<br/>
                  &nbsp;&nbsp;input clk, reset;<br/>
                  &nbsp;&nbsp;output [3:0] count;<br/>
                  &nbsp;&nbsp;// 100+ lines of manual HDL...
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="h-12 w-12 text-neon-green animate-pulse" />
          </div>

          {/* ChipForge Workflow */}
          <Card className="bg-dark-surface border-neon-green hover:glow-green transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Zap className="h-8 w-8 text-neon-green mr-3" />
                <h3 className="text-2xl font-bold text-neon-green">ChipForge Agentic Flow</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-neon-green rounded-full mr-3"></div>
                  <span>Hours to working prototypes</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-neon-green rounded-full mr-3"></div>
                  <span>Plain English to HDL</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-neon-green rounded-full mr-3"></div>
                  <span>AI-powered verification</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-neon-green rounded-full mr-3"></div>
                  <span>Sovereign, local control</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-neon-green">
                <code className="text-sm text-neon-green">
                  > "Create a 4-bit counter with reset"<br/>
                  <span className="text-gray-400">🤖 Generating optimized HDL...</span><br/>
                  <span className="text-neon-purple">✓ Verified & ready to deploy</span>
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
