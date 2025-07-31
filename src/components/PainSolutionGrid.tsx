import { Card, CardContent } from "@/components/ui/card";
import { X, Check, ArrowRight } from "lucide-react";

const PainSolutionGrid = () => {
  const comparisons = [
    {
      pain: "$20k/year per-seat EDA suites",
      solution: "Free-tier and $100/month Pro",
      impact: "95% cost reduction"
    },
    {
      pain: "Syntax errors, RTL bugs",
      solution: "Smeltr enforces grammar correctness at generation time",
      impact: "100% syntax guarantee"
    },
    {
      pain: "Manual simulation/debug loop",
      solution: "Reflexion loop fixes logic via AI",
      impact: "70% faster debug cycles"
    },
    {
      pain: "No AI learning over time",
      solution: "ChipForge learns from every design it generates",
      impact: "Continuous improvement"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Why <span className="gradient-text">ChipForge</span>?
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Traditional EDA tools vs. AI-Native Platform - See the transformation
          </p>
        </div>

        <div className="space-y-6">
          {comparisons.map((comparison, index) => (
            <Card key={index} className="bg-slate-800/30 border-slate-700 transition-all duration-300 hover:bg-slate-800/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  {/* Pain Point */}
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                      <X className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Legacy EDA</div>
                      <div className="text-slate-300 font-medium">{comparison.pain}</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="md:col-span-1 flex justify-center">
                    <ArrowRight className="h-6 w-6 text-cyan-400" />
                  </div>

                  {/* Solution */}
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">ChipForge AI</div>
                      <div className="text-slate-300 font-medium">{comparison.solution}</div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="md:col-span-3">
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">Impact</div>
                      <div className="text-cyan-400 font-bold">{comparison.impact}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary card */}
        <Card className="mt-12 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-cyan-500/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-slate-100">
              Transform Your Chip Design Workflow
            </h3>
            <p className="text-lg text-slate-300 mb-6">
              Join hundreds of engineers already accelerating their development with AI-native tools
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
              <span className="text-sm text-emerald-400 font-medium">Ready for Production Use</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PainSolutionGrid;