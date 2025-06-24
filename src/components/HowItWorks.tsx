
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Cpu, CheckCircle, ToggleLeft, ToggleRight } from "lucide-react";

const HowItWorks = () => {
  const [isChipForgeFlow, setIsChipForgeFlow] = useState(true);

  const traditionalSteps = [
    { icon: MessageSquare, title: "Specification Document", desc: "Write detailed technical specs", time: "2-4 weeks" },
    { icon: Cpu, title: "Manual HDL Coding", desc: "Expert engineers write HDL", time: "3-6 months" },
    { icon: CheckCircle, title: "Manual Testing", desc: "Extensive verification process", time: "1-3 months" }
  ];

  const chipforgeSteps = [
    { icon: MessageSquare, title: "Plain English Input", desc: "Describe what you want in natural language", time: "5 minutes" },
    { icon: Cpu, title: "Agentic AI Processing", desc: "AI generates & optimizes HDL automatically", time: "30 seconds" },
    { icon: CheckCircle, title: "Automated Verification", desc: "AI validates & creates deployment package", time: "2 minutes" }
  ];

  const currentSteps = isChipForgeFlow ? chipforgeSteps : traditionalSteps;

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          
          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg ${!isChipForgeFlow ? 'text-neon-purple' : 'text-gray-400'}`}>
              Traditional Flow
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChipForgeFlow(!isChipForgeFlow)}
              className="p-0 h-auto"
            >
              {isChipForgeFlow ? (
                <ToggleRight className="h-12 w-12 text-neon-green" />
              ) : (
                <ToggleLeft className="h-12 w-12 text-neon-purple" />
              )}
            </Button>
            <span className={`text-lg ${isChipForgeFlow ? 'text-neon-green' : 'text-gray-400'}`}>
              ChipForge Flow
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {currentSteps.map((step, index) => (
            <Card 
              key={index} 
              className={`relative bg-dark-surface border-2 transition-all duration-500 hover:scale-105 ${
                isChipForgeFlow ? 'border-neon-green hover:glow-green' : 'border-neon-purple hover:glow-purple'
              }`}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                  isChipForgeFlow ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-purple/20 text-neon-purple'
                }`}>
                  <step.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300 mb-4">{step.desc}</p>
                
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  isChipForgeFlow ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-purple/20 text-neon-purple'
                }`}>
                  {step.time}
                </div>

                {/* Step number */}
                <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  isChipForgeFlow ? 'bg-neon-green text-black' : 'bg-neon-purple text-white'
                }`}>
                  {index + 1}
                </div>

                {/* Connection line */}
                {index < currentSteps.length - 1 && (
                  <div className={`hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 ${
                    isChipForgeFlow ? 'bg-neon-green' : 'bg-neon-purple'
                  } animate-shimmer`}></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="text-center mt-16">
          <p className="text-2xl text-gray-300">
            Total Time: <span className={`font-bold ${isChipForgeFlow ? 'text-neon-green' : 'text-red-400'}`}>
              {isChipForgeFlow ? '< 1 hour' : '6-12 months'}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
