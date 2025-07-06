
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Cpu, Zap, Copy, Download, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewProject = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generatedHDL, setGeneratedHDL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hdlType, setHdlType] = useState("SystemVerilog");
  const [targetPlatform, setTargetPlatform] = useState("FPGA");

  const examplePrompts = [
    "Design a 4-bit ALU with carry-out",
    "Create a UART transmitter with configurable baud rate",
    "Build a simple 8-bit counter with reset",
    "Design a priority encoder for 8 inputs",
    "Create a finite state machine for traffic light control"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI HDL generation
    setTimeout(() => {
      const sampleHDL = `module alu_4bit (
    input [3:0] a,
    input [3:0] b,
    input [2:0] op,
    output reg [3:0] result,
    output reg carry_out
);

always @(*) begin
    case (op)
        3'b000: {carry_out, result} = a + b;    // Addition
        3'b001: {carry_out, result} = a - b;    // Subtraction
        3'b010: begin result = a & b; carry_out = 0; end  // AND
        3'b011: begin result = a | b; carry_out = 0; end  // OR
        3'b100: begin result = a ^ b; carry_out = 0; end  // XOR
        3'b101: begin result = ~a; carry_out = 0; end     // NOT A
        3'b110: begin result = a << 1; carry_out = a[3]; end  // Shift Left
        3'b111: begin result = a >> 1; carry_out = a[0]; end  // Shift Right
        default: begin result = 4'b0000; carry_out = 0; end
    endcase
end

endmodule`;
      
      setGeneratedHDL(sampleHDL);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <span className="text-xl font-semibold">New Chip Design</span>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={hdlType}
              onChange={(e) => setHdlType(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
            >
              <option value="SystemVerilog">SystemVerilog</option>
              <option value="Verilog">Verilog</option>
              <option value="VHDL">VHDL</option>
              <option value="Chisel">Chisel</option>
            </select>
            <select 
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
            >
              <option value="FPGA">FPGA</option>
              <option value="ASIC">ASIC</option>
              <option value="Simulation">Simulation</option>
            </select>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              AI Assistant Active
            </Badge>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 h-[calc(100vh-73px)]">
        {/* Left Panel - Input */}
        <div className="p-6 border-r border-slate-800">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Cpu className="h-6 w-6 text-emerald-400" />
                Describe Your Chip
              </h2>
              <p className="text-slate-400">Tell us what you want to build in plain English. Our AI will generate {hdlType} code for {targetPlatform} implementation.</p>
            </div>

            <div className="flex-1 flex flex-col">
              <Textarea
                placeholder="Example: Design a 4-bit ALU with carry-out that can perform addition, subtraction, AND, OR, XOR operations..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 resize-none min-h-[200px] font-mono"
              />
              
              <div className="mt-4">
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 font-semibold px-6 py-3 w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent mr-2"></div>
                      Generating HDL...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate HDL
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Example Prompts:</h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <Card 
                    key={index}
                    className="p-3 bg-slate-900/30 border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
                    onClick={() => setPrompt(example)}
                  >
                    <p className="text-sm text-slate-300">{example}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Generated HDL */}
        <div className="p-6">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Play className="h-6 w-6 text-purple-400" />
                Generated HDL Code
              </h2>
              {generatedHDL && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            <Card className="flex-1 bg-slate-900/50 border-slate-700">
              {generatedHDL ? (
                <pre className="p-4 text-sm font-mono text-slate-200 overflow-auto h-full">
                  <code>{generatedHDL}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your HDL code will appear here after generation</p>
                  </div>
                </div>
              )}
            </Card>

            {generatedHDL && (
              <div className="mt-4 flex gap-3">
                <Button 
                  onClick={() => navigate('/design-editor')}
                  className="bg-purple-500 text-white hover:bg-purple-400 font-semibold px-6 py-3 flex-1"
                >
                  Open in Editor
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 font-semibold px-6 py-3"
                >
                  Simulate
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
