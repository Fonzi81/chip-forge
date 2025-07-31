import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Cpu, Brain, Activity, Layers, Shield } from "lucide-react";

const TechDeepDive = () => {
  const technologies = [
    {
      id: "smeltr",
      icon: Cpu,
      title: "Smeltr – Syntax-Forged Verilog",
      subtitle: "Grammar-constrained HDL generation with 100% syntax guarantee",
      description: "Our proprietary Smeltr engine uses advanced grammar constraints and Earley parsing to ensure every generated line of Verilog is syntactically perfect. No more compilation errors from AI-generated code.",
      features: [
        "Lark grammar parser integration",
        "Real-time syntax validation",
        "Module hierarchy optimization",
        "Port mapping verification"
      ]
    },
    {
      id: "reflexion",
      icon: Brain,
      title: "Reflexion – AI Self-Correction Loop",
      subtitle: "LLM-powered iterative improvement using testbench feedback",
      description: "When simulation fails, our Reflexion agent automatically analyzes errors, generates fixes, and re-tests until your logic passes. No manual debugging required.",
      features: [
        "Actor-Reviewer AI architecture",
        "Automated error analysis",
        "Testbench-driven corrections",
        "Performance metric optimization"
      ]
    },
    {
      id: "waveform",
      icon: Activity,
      title: "Waveform Planner – Behavioral Specification",
      subtitle: "Timeline-based behavioral specs that guide HDL generation",
      description: "Define expected signal behaviors visually through waveforms. Our AI translates timing diagrams directly into corresponding HDL logic structures.",
      features: [
        "Visual timing diagram editor",
        "Clock domain analysis",
        "Signal dependency mapping",
        "FSM state extraction"
      ]
    },
    {
      id: "schematic",
      icon: Layers,
      title: "Schematic Editor – Visual Design Flow",
      subtitle: "Drag & drop FSMs and modules with automatic HDL synthesis",
      description: "Build complex designs visually by connecting pre-verified components. Our synthesis engine automatically generates optimized netlists from your schematic.",
      features: [
        "Component library integration",
        "Automatic routing optimization",
        "Hierarchical design support",
        "Real-time DRC checking"
      ]
    },
    {
      id: "sovereign",
      icon: Shield,
      title: "Offline Sovereign Deploy",
      subtitle: "Air-gapped environments with audit trails for national-scale security",
      description: "Deploy ChipForge completely offline for sensitive projects. Full audit trails, deterministic builds, and zero cloud dependencies ensure maximum security.",
      features: [
        "Fully air-gapped operation",
        "Cryptographic audit trails",
        "Deterministic compilation",
        "NIST compliance ready"
      ]
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Technology <span className="gradient-text">Deep Dive</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore the advanced AI technologies powering ChipForge's chip design capabilities
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {technologies.map((tech) => (
            <AccordionItem 
              key={tech.id} 
              value={tech.id}
              className="border-slate-700"
            >
              <Card className="bg-slate-800/50 border-slate-700 transition-all duration-300 hover:bg-slate-800/70">
                <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                  <div className="flex items-center gap-6 w-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20">
                      <tech.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-100 mb-1">{tech.title}</h3>
                      <p className="text-sm text-slate-400">{tech.subtitle}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <CardContent className="px-8 pb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-slate-300 leading-relaxed mb-6">
                          {tech.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
                          <span className="text-sm text-emerald-400 font-medium">Production Ready</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          {tech.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                              <span className="text-sm text-slate-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default TechDeepDive;