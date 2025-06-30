
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  File, 
  FileCode, 
  Folder, 
  Save, 
  Undo, 
  Redo, 
  Play, 
  Zap,
  Eye,
  Settings,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesignEditor = () => {
  const navigate = useNavigate();
  const [activeFile, setActiveFile] = useState("main.v");
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [code, setCode] = useState(`module alu_4bit (
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

endmodule`);

  const files = [
    { name: "main.v", type: "verilog", hasErrors: false },
    { name: "testbench.v", type: "testbench", hasErrors: false },
    { name: "constraints.xdc", type: "constraint", hasErrors: false }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "verilog": return <FileCode className="h-4 w-4 text-emerald-400" />;
      case "testbench": return <Play className="h-4 w-4 text-blue-400" />;
      case "constraint": return <Settings className="h-4 w-4 text-purple-400" />;
      default: return <File className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <span className="text-xl font-semibold">4-bit ALU Design</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Compiled
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              <Redo className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <Button 
              variant={aiSuggestions ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setAiSuggestions(!aiSuggestions)}
              className={aiSuggestions ? "bg-purple-500 text-white hover:bg-purple-400" : "text-slate-400 hover:text-slate-200"}
            >
              <Zap className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
            <Button className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* File Explorer */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/30">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold">Project Files</span>
            </div>
            
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    activeFile === file.name 
                      ? "bg-slate-800 text-slate-100" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {getFileIcon(file.type)}
                  <span className="text-sm">{file.name}</span>
                  {file.hasErrors && (
                    <div className="w-2 h-2 bg-red-400 rounded-full ml-auto"></div>
                  )}
                </div>
              ))}
            </div>

            {aiSuggestions && (
              <div className="mt-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">AI Suggestion</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">Add pipeline registers for better timing?</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20 text-xs">
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-200 text-xs">
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="bg-slate-900/50 border-b border-slate-800 rounded-none justify-start h-12 px-6">
              <TabsTrigger value="code" className="data-[state=active]:bg-slate-800">
                <FileCode className="h-4 w-4 mr-2" />
                Code
              </TabsTrigger>
              <TabsTrigger value="rtl" className="data-[state=active]:bg-slate-800">
                <Eye className="h-4 w-4 mr-2" />
                RTL Diagram
              </TabsTrigger>
              <TabsTrigger value="simulation" className="data-[state=active]:bg-slate-800">
                <Play className="h-4 w-4 mr-2" />
                Simulation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 m-0">
              <div className="h-full p-6">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-full bg-slate-900/50 border-slate-700 text-slate-100 font-mono text-sm resize-none"
                  placeholder="Enter your HDL code here..."
                />
              </div>
            </TabsContent>

            <TabsContent value="rtl" className="flex-1 m-0">
              <div className="h-full p-6">
                <Card className="h-full bg-slate-900/50 border-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 mb-4">RTL Diagram will be rendered here</p>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Download className="h-4 w-4 mr-2" />
                      Export Diagram
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="simulation" className="flex-1 m-0">
              <div className="h-full p-6">
                <Card className="h-full bg-slate-900/50 border-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 mb-4">Simulation waveforms will appear here</p>
                    <Button className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
                      <Play className="h-4 w-4 mr-2" />
                      Run Simulation
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;
