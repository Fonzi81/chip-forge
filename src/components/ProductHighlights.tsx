import { Card, CardContent } from "@/components/ui/card";
import { FileText, Zap, Activity } from "lucide-react";

const ProductHighlights = () => {
  const highlights = [
    {
      icon: FileText,
      title: "Natural Language to HDL",
      description: "Type a spec. Get clean, valid Verilog with 100% syntax guarantee.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Self-Correcting Reflexion Loop",
      description: "Errors? Fixed by AI. Simulation-driven iterations until your logic passes.",
      gradient: "from-blue-500 to-emerald-500"
    },
    {
      icon: Activity,
      title: "Waveform & Schematic Integration",
      description: "Draw FSMs, define expected waveforms. We'll generate the matching logic.",
      gradient: "from-emerald-500 to-cyan-500"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            AI-Native <span className="gradient-text">Chip Design</span> Platform
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Revolutionary capabilities that transform how semiconductors are designed and developed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <Card 
              key={index}
              className="relative bg-slate-800/50 border-2 border-slate-700/50 transition-all duration-300 enterprise-hover hover:border-cyan-500/40"
            >
              <CardContent className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-gradient-to-r ${highlight.gradient} bg-opacity-20`}>
                  <highlight.icon className="h-8 w-8 text-cyan-400" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-slate-100">{highlight.title}</h3>
                <p className="text-slate-400 leading-relaxed">{highlight.description}</p>

                {/* Technical indicator */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
                  <span className="text-sm text-emerald-400 font-medium">Enterprise Ready</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;