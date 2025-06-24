
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, CheckCircle, FileText, Monitor } from "lucide-react";

const ProductPreviews = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    {
      id: "text-to-hdl",
      title: "Text-to-HDL Interface",
      icon: Code,
      description: "Natural language input transforms to verified HDL code",
      preview: `> "Create a 32-bit RISC-V ALU with overflow detection"

🤖 ChipForge Agent Processing...
✓ Parsing requirements
✓ Generating Verilog HDL
✓ Optimizing for area/timing
✓ Adding overflow logic

module alu_32bit (
    input [31:0] a, b,
    input [3:0] op,
    output [31:0] result,
    output overflow
);
    // Generated & optimized by ChipForge AI
endmodule`
    },
    {
      id: "simulation",
      title: "Simulation Validator",
      icon: Monitor,
      description: "Real-time verification with visual feedback",
      preview: `Simulation Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Vector 1: PASS ✓
Test Vector 2: PASS ✓  
Test Vector 3: PASS ✓
Edge Case Analysis: PASS ✓

Timing Analysis:
Max Frequency: 125 MHz
Critical Path: 7.2ns
Power Est: 45mW @ 1.8V

Performance Score: 94/100`
    },
    {
      id: "audit-trail",
      title: "Audit Trail",
      icon: FileText,
      description: "Complete decision transparency for compliance",
      preview: `Agent Decision Log:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[12:34:01] Requirement parsing
  └─ Detected: ALU, 32-bit, overflow
  
[12:34:02] Architecture selection
  └─ Chose: Ripple-carry over CLA
  └─ Reason: Area optimization priority
  
[12:34:03] HDL generation
  └─ Template: risc_v_alu_v2.hdl
  └─ Optimizations: 3 applied
  
[12:34:05] Verification
  └─ Test vectors: 127 generated
  └─ Coverage: 98.4%`
    }
  ];

  return (
    <section className="py-20 px-6 bg-dark-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Product <span className="gradient-text">Previews</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of chip design with our intuitive AI-powered interface
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.id}
              className="bg-gray-900 border-gray-700 hover:border-neon-green transition-all duration-500 hover:scale-105 hover:glow-green cursor-pointer"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="h-6 w-6 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <Badge variant="outline" className="text-xs border-neon-green text-neon-green mt-1">
                      Live Preview
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{feature.description}</p>

                {/* Code Preview */}
                <div className={`bg-black rounded-lg p-4 border transition-all duration-300 ${
                  hoveredFeature === feature.id ? 'border-neon-green scale-105' : 'border-gray-700'
                }`}>
                  <pre className="text-xs text-green-400 overflow-x-auto">
                    <code>{feature.preview}</code>
                  </pre>
                </div>

                {/* Hover Details */}
                {hoveredFeature === feature.id && (
                  <div className="mt-4 p-4 bg-neon-green/10 rounded-lg border border-neon-green/30 animate-fade-in">
                    <div className="flex items-center text-neon-green text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Real-time processing • Enterprise ready • Full audit trail</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Callout */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-neon-green/10 to-neon-purple/10 border-neon-green max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Try the Live Demo
              </h3>
              <p className="text-gray-300 mb-6">
                Experience ChipForge in action with our interactive sandbox environment
              </p>
              <div className="flex justify-center">
                <Badge className="bg-neon-green text-black font-semibold px-4 py-2">
                  Coming Soon: Public Beta
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviews;
