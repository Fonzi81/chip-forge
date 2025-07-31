import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Code, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveDemoSection = () => {
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    navigate('/new-project');
  };

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            See ChipForge <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Watch how natural language transforms into production-ready HDL in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Preview */}
          <Card className="bg-slate-800/50 border-slate-700 enterprise-hover">
            <CardContent className="p-8">
              <div className="bg-slate-900 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm ml-2">ChipForge AI Generator</span>
                </div>
                
                {/* Input simulation */}
                <div className="mb-4">
                  <div className="text-sm text-slate-500 mb-2">Input:</div>
                  <div className="bg-slate-800 p-3 rounded text-cyan-400 font-mono text-sm">
                    "8-bit ALU with carry and overflow"
                  </div>
                </div>

                {/* Processing indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-4 w-4 text-cyan-400 animate-data-pulse" />
                  <span className="text-sm text-slate-400">Smeltr processing... (0.3s)</span>
                </div>

                {/* Output preview */}
                <div>
                  <div className="text-sm text-slate-500 mb-2">Generated Verilog:</div>
                  <div className="bg-slate-800 p-3 rounded text-emerald-400 font-mono text-xs overflow-auto max-h-32">
{`module alu_8bit (
  input [7:0] a, b,
  input [2:0] op,
  output reg [7:0] result,
  output reg carry, overflow
);
  always @(*) begin
    case (op)
      3'b000: {carry, result} = a + b;
      3'b001: {carry, result} = a - b;
      // ... complete implementation
    endcase
  end
endmodule`}
                  </div>
                </div>
              </div>

              {/* Waveform preview indicator */}
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Syntax: 100% Valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Simulation: Passed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Features */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">
                From Description to Silicon
              </h3>
              <p className="text-lg text-slate-400 mb-6">
                Experience the power of AI-native chip design. No manual coding, no syntax errors, no toolchain complexity.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20">
                  <Code className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Natural Language Input</div>
                  <div className="text-sm text-slate-400">Describe your chip in plain English</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Instant HDL Generation</div>
                  <div className="text-sm text-slate-400">Smeltr produces syntactically perfect Verilog</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20">
                  <Play className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Automated Verification</div>
                  <div className="text-sm text-slate-400">Built-in simulation and testing</div>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={handleLaunchDemo}
              className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 font-semibold px-8 py-4 text-lg enterprise-shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              Launch Demo in Workspace
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;