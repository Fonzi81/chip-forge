
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Cpu, CheckCircle, ToggleLeft, ToggleRight, Timer, Zap } from "lucide-react";

const HowItWorks = () => {
  const [isChipForgeFlow, setIsChipForgeFlow] = useState(true);

  const traditionalSteps = [
    { 
      icon: FileText, 
      title: "Manual Specification", 
      desc: "Write detailed technical documentation and requirements", 
      time: "2-4 weeks",
      details: "Requirements gathering, architecture planning, manual documentation"
    },
    { 
      icon: Cpu, 
      title: "Expert HDL Development", 
      desc: "Senior engineers manually code Verilog/VHDL implementations", 
      time: "3-6 months",
      details: "Manual coding, debugging, optimization iterations"
    },
    { 
      icon: CheckCircle, 
      title: "Manual Verification", 
      desc: "Extensive testing, simulation, and validation processes", 
      time: "1-3 months",
      details: "Test bench creation, simulation runs, bug fixes"
    }
  ];

  const chipforgeSteps = [
    { 
      icon: FileText, 
      title: "Input: Natural Language / Schematic / Waveform", 
      desc: "Describe functionality, draw FSMs, or define expected waveforms", 
      time: "< 1 minute",
      details: "Multiple input modalities: text, visual, temporal specifications"
    },
    { 
      icon: Zap, 
      title: "Smeltr (Syntax-Constrained Verilog Generator)", 
      desc: "Grammar-constrained HDL generation with 100% syntax guarantee", 
      time: "< 30 seconds",
      details: "Earley parser integration, real-time syntax validation"
    },
    { 
      icon: CheckCircle, 
      title: "Simulation Engine + Reflexion Loop", 
      desc: "Automated testing with AI-driven error correction until pass", 
      time: "< 2 minutes",
      details: "Actor-Reviewer architecture, continuous improvement cycle"
    },
    { 
      icon: Cpu, 
      title: "Synthesis Engine + Layout + GDSII Export", 
      desc: "Complete flow from logic to fabrication-ready files", 
      time: "< 5 minutes",
      details: "Integrated synthesis, place & route, DRC verification"
    }
  ];

  const currentSteps = isChipForgeFlow ? chipforgeSteps : traditionalSteps;
  const totalTime = isChipForgeFlow ? "< 8 minutes" : "6-12 months";
  const efficiency = isChipForgeFlow ? "500x faster" : "baseline";

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-cyan-500/20 rounded-full mb-6">
            <Timer className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-slate-300 font-medium">Workflow Comparison</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            A Full AI EDA Stack — <span className="gradient-text">Not Just Code Generation</span>
          </h2>
          
          {/* Professional toggle */}
          <div className="flex items-center justify-center gap-6 mb-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700 max-w-md mx-auto">
            <span className={`text-sm font-medium transition-colors ${!isChipForgeFlow ? 'text-amber-400' : 'text-slate-500'}`}>
              Traditional Flow
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChipForgeFlow(!isChipForgeFlow)}
              className="p-0 h-auto hover:bg-transparent"
            >
              {isChipForgeFlow ? (
                <ToggleRight className="h-8 w-8 text-cyan-400" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-amber-400" />
              )}
            </Button>
            <span className={`text-sm font-medium transition-colors ${isChipForgeFlow ? 'text-cyan-400' : 'text-slate-500'}`}>
              ChipForge AI
            </span>
          </div>
        </div>

        {/* Professional workflow steps */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {currentSteps.map((step, index) => (
            <Card 
              key={index} 
              className={`relative bg-slate-800/50 border-2 transition-all duration-500 enterprise-hover ${
                isChipForgeFlow ? 'border-cyan-500/30 hover:border-cyan-400' : 'border-amber-500/30 hover:border-amber-400'
              }`}
            >
              <CardContent className="p-8">
                {/* Step indicator */}
                <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  isChipForgeFlow ? 'bg-cyan-500 text-slate-900' : 'bg-amber-500 text-slate-900'
                }`}>
                  {index + 1}
                </div>

                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${
                  isChipForgeFlow ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <step.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-slate-100">{step.title}</h3>
                <p className="text-slate-400 mb-4 leading-relaxed">{step.desc}</p>
                
                {/* Technical details */}
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Process Details:</div>
                  <div className="text-sm text-slate-300">{step.details}</div>
                </div>

                {/* Connection line */}
                {index < currentSteps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 ${
                    isChipForgeFlow ? 'bg-cyan-500' : 'bg-amber-500'
                  } animate-trace-flow`}></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Professional summary with metrics */}
        <div className="text-center">
          <Card className="w-full bg-slate-800/30 border-slate-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-slate-100">Workflow Comparison Summary</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-1">Total Time to Production</div>
                  <div className={`text-3xl font-bold ${isChipForgeFlow ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {totalTime}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-1">Efficiency Gain</div>
                  <div className={`text-3xl font-bold ${isChipForgeFlow ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {efficiency}
                  </div>
                </div>
              </div>

              {isChipForgeFlow && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="text-sm text-emerald-400 font-medium">
                    ✓ Production-ready HDL in minutes, not months
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
