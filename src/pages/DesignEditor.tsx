import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RTLViewer from "@/components/RTLViewer";
import SimulationPanel from "@/components/SimulationPanel";
import FileExplorer from "@/components/chipforge/FileExplorer";
import CodeEditor from "@/components/chipforge/CodeEditor";
import EditorToolbar from "@/components/chipforge/EditorToolbar";
import AIAssistant from "@/components/chipforge/AIAssistant";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { 
  ArrowLeft, 
  FileCode, 
  Play, 
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesignEditor = () => {
  const navigate = useNavigate();
  const [activeFileId, setActiveFileId] = useState("1");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const [files, setFiles] = useState([
    { 
      id: "1", 
      name: "alu_4bit.v", 
      type: "verilog" as const, 
      hasErrors: false, 
      path: "src/alu_4bit.v",
      content: `module alu_4bit (
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

endmodule`
    },
    { 
      id: "2", 
      name: "alu_testbench.v", 
      type: "testbench" as const, 
      hasErrors: false, 
      path: "tb/alu_testbench.v",
      content: `module alu_testbench;
    reg [3:0] a, b;
    reg [2:0] op;
    wire [3:0] result;
    wire carry_out;
    
    alu_4bit uut (.a(a), .b(b), .op(op), .result(result), .carry_out(carry_out));
    
    initial begin
        $monitor("a=%b, b=%b, op=%b, result=%b, carry=%b", a, b, op, result, carry_out);
        
        a = 4'b0011; b = 4'b0001; op = 3'b000; #10; // Add
        a = 4'b0011; b = 4'b0001; op = 3'b001; #10; // Sub
        a = 4'b0011; b = 4'b0001; op = 3'b010; #10; // AND
        
        $finish;
    end
endmodule`
    },
    { 
      id: "3", 
      name: "constraints.xdc", 
      type: "constraint" as const, 
      hasErrors: false, 
      path: "constraints/constraints.xdc",
      content: `# Clock constraint
create_clock -period 10.0 [get_ports clk]

# Input/Output constraints
set_input_delay -clock clk 2.0 [get_ports {a[*] b[*] op[*]}]
set_output_delay -clock clk 2.0 [get_ports {result[*] carry_out}]`
    }
  ]);

  const [aiSuggestions] = useState([
    {
      id: "1",
      type: "optimization" as const,
      title: "Add Pipeline Registers",
      description: "Consider adding pipeline registers to improve timing closure for high-frequency operation.",
      code: "always_ff @(posedge clk) begin\n    result_reg <= result;\nend",
      confidence: 0.85,
      line: 15
    },
    {
      id: "2", 
      type: "completion" as const,
      title: "Add Reset Logic",
      description: "Adding a reset signal would improve design robustness and simulation.",
      confidence: 0.72
    }
  ]);

  const designMetrics = {
    linesOfCode: files.reduce((acc, file) => acc + file.content.split('\n').length, 0),
    estimatedGates: 145,
    complexityScore: 6,
    version: "v1.2.3",
    lastModified: new Date()
  };

  const activeFile = files.find(f => f.id === activeFileId);

  // Event handlers
  const handleSave = () => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const handleUndo = () => {
    setCanRedo(true);
    if (Math.random() > 0.5) setCanUndo(false);
  };

  const handleRedo = () => {
    setCanUndo(true);
    if (Math.random() > 0.5) setCanRedo(false);
  };

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => setSimulationRunning(false), 3000);
  };

  const handleExport = () => {
    console.log("Exporting design...");
  };

  const handleCodeChange = (content: string) => {
    if (activeFile) {
      setFiles(files.map(f => 
        f.id === activeFileId ? { ...f, content } : f
      ));
      setHasUnsavedChanges(true);
    }
  };

  const handleFileCreate = (name: string, type: string) => {
    const newFile = {
      id: Date.now().toString(),
      name,
      type: type as any,
      hasErrors: false,
      path: `src/${name}`,
      content: type === 'verilog' ? '// New Verilog module\nmodule new_module;\n\nendmodule' : ''
    };
    setFiles([...files, newFile]);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
    if (activeFileId === fileId && files.length > 1) {
      setActiveFileId(files.find(f => f.id !== fileId)?.id || "");
    }
  };

  const handleApplySuggestion = (suggestion: any) => {
    console.log("Applying suggestion:", suggestion);
  };

  const handleDismissSuggestion = (id: string) => {
    console.log("Dismissing suggestion:", id);
  };

  const handleGenerateCode = (prompt: string) => {
    console.log("Generating code for prompt:", prompt);
  };

  const handleExplainCode = (code: string) => {
    console.log("Explaining code:", code);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onRunSimulation: handleRunSimulation,
    onExportWaveform: handleExport,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-6 py-4">
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
      </header>

      {/* Editor Toolbar */}
      <EditorToolbar
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRunSimulation={handleRunSimulation}
        onExport={handleExport}
        onOpenSettings={() => console.log("Settings")}
        canUndo={canUndo}
        canRedo={canRedo}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        compileStatus={compileStatus}
        aiAssistEnabled={aiAssistEnabled}
        onToggleAI={() => setAiAssistEnabled(!aiAssistEnabled)}
        simulationRunning={simulationRunning}
      />

      <div className="flex flex-1">
        {/* File Explorer */}
        <FileExplorer
          files={files}
          activeFileId={activeFileId}
          onFileSelect={setActiveFileId}
          onFileCreate={handleFileCreate}
          onFileDelete={handleFileDelete}
          onFileRename={(id, name) => console.log("Rename", id, name)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="bg-slate-900/50 border-b border-slate-800 rounded-none justify-start h-12 px-6">
              <TabsTrigger value="code" className="data-[state=active]:bg-slate-800">
                <FileCode className="h-4 w-4 mr-2" />
                Code Editor
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
              <div className="h-full flex">
                <div className="flex-1">
                  {activeFile ? (
                    <CodeEditor
                      content={activeFile.content}
                      language={activeFile.type === 'constraint' ? 'verilog' : activeFile.type === 'testbench' ? 'verilog' : 'verilog'}
                      onChange={handleCodeChange}
                      errors={activeFile.hasErrors ? [
                        { line: 5, column: 10, message: "Syntax error: Missing semicolon", severity: "error" }
                      ] : []}
                      onSave={handleSave}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Select a file to start editing
                    </div>
                  )}
                </div>
                
                {/* AI Assistant Sidebar */}
                <AIAssistant
                  isVisible={aiAssistEnabled}
                  suggestions={aiSuggestions}
                  designMetrics={designMetrics}
                  onApplySuggestion={handleApplySuggestion}
                  onDismissSuggestion={handleDismissSuggestion}
                  onGenerateCode={handleGenerateCode}
                  onExplainCode={handleExplainCode}
                />
              </div>
            </TabsContent>

            <TabsContent value="rtl" className="flex-1 m-0">
              <div className="h-full p-6">
                <Card className="h-full bg-slate-900/50 border-slate-700 flex items-center justify-center">
                  <RTLViewer />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="simulation" className="flex-1 m-0">
              <SimulationPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;
