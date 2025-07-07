import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import FileExplorer from "@/components/chipforge/FileExplorer";
import CodeEditor from "@/components/chipforge/CodeEditor";
import EditorToolbar from "@/components/chipforge/EditorToolbar";
import AIAssistant from "@/components/chipforge/AIAssistant";
import WaveformViewer from "@/components/chipforge/WaveformViewer";
import RTLViewer from "@/components/RTLViewer";
import SimulationConfig from "@/components/chipforge/SimulationConfig";
import SimulationProgress from "@/components/chipforge/SimulationProgress";
import ConsoleLog from "@/components/chipforge/ConsoleLog";
import ResultsPanel from "@/components/chipforge/ResultsPanel";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSimulation } from "@/hooks/useSimulation";
import { 
  ArrowLeft, 
  FileCode, 
  Play, 
  Activity,
  Eye,
  Zap,
  Settings,
  Download,
  RotateCcw,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HDLFile {
  id: string;
  name: string;
  type: 'verilog' | 'vhdl' | 'systemverilog' | 'testbench' | 'constraint';
  content: string;
  hasErrors: boolean;
  path: string;
  failedLines?: number[];
}

const ChipForgeWorkspace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("code");
  const [activeFileId, setActiveFileId] = useState("1");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [highlightedSignal, setHighlightedSignal] = useState<string | null>(null);
  const [selectedCodeLine, setSelectedCodeLine] = useState<number | null>(null);

  const {
    isRunning,
    progress,
    result,
    logs,
    simulate,
    cancelSimulation,
    clearLogs,
    resetSimulation
  } = useSimulation();

  const [files, setFiles] = useState<HDLFile[]>([
    { 
      id: "1", 
      name: "alu_4bit.v", 
      type: "verilog", 
      hasErrors: false, 
      path: "src/alu_4bit.v",
      failedLines: result?.status === 'error' ? [12, 15] : [],
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
      type: "testbench", 
      hasErrors: false, 
      path: "tb/alu_testbench.v",
      content: `module alu_testbench;
    reg [3:0] a, b;
    reg [2:0] op;
    wire [3:0] result;
    wire carry_out;
    
    alu_4bit uut (.a(a), .b(b), .op(op), .result(result), .carry_out(carry_out));
    
    initial begin
        $dumpfile("alu_waveform.vcd");
        $dumpvars(0, alu_testbench);
        
        $monitor("Time: %0t | a=%b, b=%b, op=%b, result=%b, carry=%b", 
                 $time, a, b, op, result, carry_out);
        
        // Test cases
        a = 4'b0011; b = 4'b0001; op = 3'b000; #10; // Add: 3+1=4
        a = 4'b0101; b = 4'b0010; op = 3'b001; #10; // Sub: 5-2=3
        a = 4'b1100; b = 4'b1010; op = 3'b010; #10; // AND: 12&10=8
        a = 4'b1100; b = 4'b1010; op = 3'b011; #10; // OR: 12|10=14
        a = 4'b1100; b = 4'b1010; op = 3'b100; #10; // XOR: 12^10=6
        a = 4'b1010; b = 4'b0000; op = 3'b101; #10; // NOT: ~10=5
        a = 4'b0011; b = 4'b0000; op = 3'b110; #10; // SHL: 3<<1=6
        a = 4'b1100; b = 4'b0000; op = 3'b111; #10; // SHR: 12>>1=6
        
        $finish;
    end
endmodule`
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
      type: "fix" as const,
      title: "Fix Timing Violation",
      description: "Line 12 may cause timing violations. Consider breaking into smaller logic blocks.",
      confidence: 0.92,
      line: 12
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

  const handleRunSimulation = () => {
    if (!isRunning) {
      simulate({
        clockFreq: "100",
        simulationTime: "1000",
        inputVectors: "// test vectors",
        hdlCode: activeFile?.content || ""
      });
      setActiveTab("simulation");
    }
  };

  // Auto-simulate when code changes
  useEffect(() => {
    if (autoSimulate && hasUnsavedChanges && !isRunning) {
      const timer = setTimeout(() => {
        // Double-check conditions before running simulation
        if (autoSimulate && !isRunning && hasUnsavedChanges) {
          handleRunSimulation();
        }
      }, 2000); // Debounce 2 seconds
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, autoSimulate, isRunning, handleRunSimulation]);

  const handleStopSimulation = () => {
    cancelSimulation();
  };

  const handleCodeChange = (content: string) => {
    if (activeFile) {
      setFiles(files.map(f => 
        f.id === activeFileId ? { ...f, content } : f
      ));
      setHasUnsavedChanges(true);
    }
  };

  const handleSignalClick = (signal: string, time: number) => {
    setHighlightedSignal(signal);
    // Find the line in code that defines this signal
    if (activeFile) {
      const lines = activeFile.content.split('\n');
      const lineIndex = lines.findIndex(line => line.includes(signal));
      if (lineIndex !== -1) {
        setSelectedCodeLine(lineIndex + 1);
        setActiveTab("code");
      }
    }
  };

  const handleFileCreate = (name: string, type: HDLFile['type']) => {
    const newFile: HDLFile = {
      id: Date.now().toString(),
      name,
      type,
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onRunSimulation: handleRunSimulation,
    onStopSimulation: handleStopSimulation,
    onExportWaveform: () => {
      // TODO: Implement waveform export functionality
    },
    onClearLogs: () => clearLogs()
  });

  const getSimulationStatus = () => {
    if (isRunning) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Running Simulation
        </Badge>
      );
    }
    if (result?.status === 'error') {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          Simulation Failed
        </Badge>
      );
    }
    if (result?.status === 'success') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          Simulation Complete
        </Badge>
      );
    }
    return null;
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
            <span className="text-xl font-semibold">ChipForge Workspace</span>
            {getSimulationStatus()}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={autoSimulate ? "default" : "ghost"}
              size="sm"
              onClick={() => setAutoSimulate(!autoSimulate)}
              className={autoSimulate ? "bg-blue-500 text-white hover:bg-blue-400" : "text-slate-400 hover:text-slate-200"}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Auto-Sim
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsole(!showConsole)}
              className="text-slate-400 hover:text-slate-200"
            >
              Console
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Toolbar */}
      <EditorToolbar
        onSave={handleSave}
        onUndo={() => {
          // TODO: Implement undo functionality
        }}
        onRedo={() => {
          // TODO: Implement redo functionality
        }}
        onRunSimulation={handleRunSimulation}
        onExport={() => {
          // TODO: Implement export functionality
        }}
        onOpenSettings={() => {
          // TODO: Implement settings functionality
        }}
        canUndo={false}
        canRedo={false}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        compileStatus={result?.status === 'error' ? 'error' : result?.status === 'success' ? 'success' : 'idle'}
        aiAssistEnabled={aiAssistEnabled}
        onToggleAI={() => setAiAssistEnabled(!aiAssistEnabled)}
        simulationRunning={isRunning}
      />

      <div className="flex flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer
              files={files}
              activeFileId={activeFileId}
              onFileSelect={setActiveFileId}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={(id, name) => {
                // TODO: Implement file rename functionality
              }}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Main Content */}
          <ResizablePanel defaultSize={60}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
              <TabsList className="bg-slate-900/50 border-b border-slate-800 rounded-none justify-start h-12 px-6">
                <TabsTrigger value="code" className="data-[state=active]:bg-slate-800">
                  <FileCode className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="simulation" className="data-[state=active]:bg-slate-800">
                  <Play className="h-4 w-4 mr-2" />
                  Simulation
                </TabsTrigger>
                <TabsTrigger value="waveform" className="data-[state=active]:bg-slate-800">
                  <Activity className="h-4 w-4 mr-2" />
                  Waveform
                </TabsTrigger>
                <TabsTrigger value="rtl" className="data-[state=active]:bg-slate-800">
                  <Eye className="h-4 w-4 mr-2" />
                  RTL Diagram
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="flex-1 m-0">
                <div className="h-full flex">
                  <div className="flex-1">
                    {activeFile ? (
                      <CodeEditor
                        content={activeFile.content}
                        language="verilog"
                        onChange={handleCodeChange}
                        errors={activeFile.failedLines?.map(line => ({
                          line,
                          column: 1,
                          message: "Simulation failed at this line",
                          severity: "error" as const
                        })) || []}
                        onSave={handleSave}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">
                        Select a file to start editing
                      </div>
                    )}
                  </div>
                  
                  <AIAssistant
                    isVisible={aiAssistEnabled}
                    suggestions={aiSuggestions}
                    designMetrics={designMetrics}
                    onApplySuggestion={() => {
                      // TODO: Implement suggestion application
                    }}
                    onDismissSuggestion={() => {
                      // TODO: Implement suggestion dismissal
                    }}
                    onGenerateCode={() => {
                      // TODO: Implement code generation
                    }}
                    onExplainCode={() => {
                      // TODO: Implement code explanation
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="simulation" className="flex-1 m-0">
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-6">
                    {isRunning ? (
                      <SimulationProgress
                        progress={progress.progress}
                        stage={progress.stage}
                        message={progress.message}
                        isRunning={isRunning}
                      />
                    ) : (
                      <SimulationConfig
                        onRunSimulation={handleRunSimulation}
                        onCancelSimulation={handleStopSimulation}
                        isRunning={isRunning}
                      />
                    )}
                  </div>
                  
                  {showConsole && (
                    <div className="border-t border-slate-800">
                      <ConsoleLog
                        logs={logs}
                        status={isRunning ? 'running' : result?.status === 'success' ? 'success' : result?.status === 'error' ? 'error' : 'idle'}
                        onClearLogs={clearLogs}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="waveform" className="flex-1 m-0">
                <WaveformViewer
                  waveformData={result?.waveformData}
                  isComplete={!isRunning && result !== null}
                />
              </TabsContent>

              <TabsContent value="rtl" className="flex-1 m-0">
                <div className="h-full p-6">
                  <RTLViewer />
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Results & Summary */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <ResultsPanel
              results={{
                pass: result?.status === 'success',
                duration: result?.metrics?.duration || '0s',
                gateCount: result?.metrics?.gateCount || 0,
                assertions: result?.metrics?.assertions || { passed: 0, failed: 0 }
              }}
              isComplete={!isRunning && result !== null}
              onReset={resetSimulation}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChipForgeWorkspace;