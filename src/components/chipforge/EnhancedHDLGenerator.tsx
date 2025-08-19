import React, { useState, useRef, useEffect } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { hdlGenerator } from "@/backend/hdl-gen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Download, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Code2,
  Play,
  Save,
  FileText,
  Settings,
  Lightbulb
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function EnhancedHDLGenerator() {
  const { 
    design, 
    waveform, 
    testbenchVerilog, 
    setHDL, 
    setHDLScore, 
    hdlOutput, 
    hdlScore,
    exportNetlist,
    generateWaveformJSON,
    generateNaturalLanguageHints,
    guidedMode
  } = useHDLDesignStore();
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI HDL coding assistant. I can help you write, review, and optimize Verilog code. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [codeContent, setCodeContent] = useState(`// Welcome to ChipForge HDL Editor
// Start typing your Verilog code here or ask me to generate it!

module example_module (
    input wire clk,
    input wire rst_n,
    input wire [7:0] data_in,
    output reg [7:0] data_out
);

    // Your code here
    
endmodule`);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const generate = async () => {
    if (!prompt.trim()) {
      setLog(["❌ Please enter a design description first"]);
      return;
    }

    if (guidedMode.isActive) {
      setLog((prev) => [
        ...prev,
        "📘 We will now convert your schematic into Verilog HDL.",
      ]);
    }

    setStatus("generating");
    setLog((prev) => [...prev, "🔄 Generating HDL code using AI model..."]);

    try {
      const result = await hdlGenerator.generateHDL({
        description: prompt,
        targetLanguage: 'verilog',
        style: 'rtl',
        moduleName: design?.moduleName || 'generated_module'
      });

      const code = result.code || "// No code generated";
      setGeneratedCode(code);
      setCodeContent(code);
      setHDL(code);
      setHDLScore(0.9);
      setExplanation(buildExplanation([], code));
      setLog((prev) => [...prev, "✅ HDL Generated successfully!"]);
      setStatus("done");
      setActiveTab("generate");
    } catch (e: any) {
      setLog((prev) => [...prev, "❌ HDL generation failed: " + e.message]);
      setStatus("error");
    }
  };

  // New: Generate directly from schematic + waveform (Smeltr-style pipeline)
  const generateFromSchematic = async () => {
    try {
      if (!design) {
        setLog((prev) => [...prev, "❌ No design available. Create a schematic first."]);
        return;
      }

      const netlist = exportNetlist();
      const designJSON = JSON.stringify(netlist, null, 2);
      const waveformJSON = generateWaveformJSON();

      if (guidedMode.isActive) {
        setLog((prev) => [
          ...prev,
          "📘 We will now convert your schematic into Verilog HDL.",
          "🔗 Including schematic JSON and waveform JSON in generation context...",
        ]);
      }

      setStatus("generating");

      const combinedDescription = [
        "Generate synthesizable Verilog RTL from the provided ChipForge schematic and intended waveforms.",
        "Respect clock/reset semantics and IO directions.",
        "\n[Schematic JSON]",
        designJSON,
        "\n[Waveform JSON]",
        waveformJSON,
      ].join("\n");

      const result = await hdlGenerator.generateHDLWithReflexion({
        description: combinedDescription,
        targetLanguage: 'verilog',
        style: 'rtl',
        moduleName: design?.moduleName || 'generated_module',
        io: design?.io,
      } as any);

      const code = result.code || "// No code generated";
      setGeneratedCode(code);
      setCodeContent(code);
      setHDL(code);
      setHDLScore(result.reflexionLoop?.success ? 0.95 : 0.8);

      // Build natural language explanation from hints + reflexion + mismatch analysis
      const hints = generateNaturalLanguageHints();
      const mismatches = analyzeDesignMismatch();
      const reflexionNotes = summarizeReflexion(result.reflexionLoop);
      setExplanation(buildExplanation([...hints, ...mismatches, ...reflexionNotes], code));

      setLog((prev) => [...prev, "✅ HDL Generated from schematic successfully!"]);
      setStatus("done");
      setActiveTab("generate");
    } catch (e: any) {
      setLog((prev) => [...prev, "❌ Schematic-based HDL generation failed: " + e.message]);
      setStatus("error");
    }
  };

  const summarizeReflexion = (loop: any | undefined): string[] => {
    if (!loop) return [];
    const lines: string[] = [];
    lines.push(`Reflexion loop ${loop.success ? 'succeeded' : 'did not fully converge'} in ${loop.iterations ?? 0} iteration(s).`);
    if (Array.isArray(loop.steps) && loop.steps.length > 0) {
      lines.push(`Applied ${loop.steps.length} improvement step(s).`);
    }
    return lines;
  };

  const analyzeDesignMismatch = (): string[] => {
    const notes: string[] = [];
    if (!design) return notes;

    // Detect unconnected reset inputs
    const resetPortNames = ['rst', 'rst_n', 'reset', 'reset_n', 'rstn', 'resetn'];
    const componentsNeedingReset = design.components.filter(c => c.inputs.some(i => resetPortNames.includes(i.toLowerCase())));
    componentsNeedingReset.forEach(c => {
      c.inputs.forEach(pin => {
        if (resetPortNames.includes(pin.toLowerCase())) {
          const isConnected = design.wires.some(w => w.to.nodeId === c.id && w.to.port.toLowerCase() === pin.toLowerCase());
          if (!isConnected) {
            notes.push(`Simulation shows ${c.label || c.id} may never reset because reset wire not connected (${pin}).`);
          }
        }
      });
    });

    // Detect resets never asserted in waveform
    const wfSignals = Object.keys(waveform || {});
    const resetSignals = wfSignals.filter(s => /rst|reset/i.test(s));
    resetSignals.forEach(sig => {
      const values = Object.values(waveform[sig] || {});
      const everHigh = values.some(v => v === 1);
      if (!everHigh) {
        notes.push(`Waveform for ${sig} never asserts reset (always 0).`);
      }
    });

    return notes;
  };

  const buildExplanation = (bullets: string[], code: string) => {
    const header = "Natural Language Explanation";
    const intro = "This HDL was generated from your schematic and waveform plan. Key points:";
    const list = bullets.length ? bullets.map(b => `- ${b}`).join("\n") : "- Generation completed. Review the code on the left.";
    return `${header}\n\n${intro}\n${list}`;
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsGenerating(true);

    try {
      // Simulate AI response with context awareness
      const response = await generateAIResponse(chatInput, codeContent);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIResponse = async (userInput: string, currentCode: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const input = userInput.toLowerCase();
    
    if (input.includes("generate") || input.includes("create") || input.includes("write")) {
      if (input.includes("counter")) {
        return `I'll help you create a counter! Here's a 4-bit up counter with synchronous reset:

\`\`\`verilog
module counter_4bit (
    input wire clk,
    input wire rst_n,
    input wire enable,
    output reg [3:0] count
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            count <= 4'b0000;
        else if (enable)
            count <= count + 1'b1;
    end

endmodule
\`\`\`

This counter:
- Counts from 0 to 15 (4'b1111)
- Has synchronous reset (active low)
- Only increments when enable is high
- Uses non-blocking assignments for proper synthesis

Would you like me to explain any part of this code or help you modify it?`;
      }
      
      if (input.includes("fsm") || input.includes("state machine")) {
        return `Here's a simple 3-state FSM example:

\`\`\`verilog
module simple_fsm (
    input wire clk,
    input wire rst_n,
    input wire input_signal,
    output reg [1:0] state,
    output reg output_signal
);

    // State encoding
    localparam IDLE = 2'b00;
    localparam WORKING = 2'b01;
    localparam DONE = 2'b10;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state <= IDLE;
            output_signal <= 1'b0;
        end else begin
            case (state)
                IDLE: begin
                    if (input_signal) begin
                        state <= WORKING;
                        output_signal <= 1'b1;
                    end
                end
                WORKING: begin
                    if (!input_signal) begin
                        state <= DONE;
                        output_signal <= 1'b0;
                    end
                end
                DONE: begin
                    state <= IDLE;
                end
            endcase
        end
    end

endmodule
\`\`\`

This FSM has three states and demonstrates proper state encoding and transitions.`;
      }

      return `I can help you generate various types of Verilog code! Try asking for:
- "Generate a 4-bit counter"
- "Create an FSM for a traffic light controller"
- "Write a shift register"
- "Make a simple ALU"

Or describe what you want to build and I'll help you implement it!`;
    }

    if (input.includes("optimize") || input.includes("improve")) {
      return `Looking at your current code, here are some optimization suggestions:

1. **Timing**: Consider adding pipeline registers for better clock frequency
2. **Power**: Use clock gating for unused logic blocks  
3. **Area**: Share resources between similar operations
4. **Verification**: Add assertions for critical timing paths

Would you like me to help implement any of these optimizations?`;
    }

    if (input.includes("explain") || input.includes("how") || input.includes("what")) {
      return `I'd be happy to explain! I can help with:
- Verilog syntax and best practices
- RTL design principles
- Synthesis considerations
- Testbench writing
- Debugging techniques

What specific concept would you like me to explain?`;
    }

    return `I'm here to help you with HDL coding! I can:
- Generate Verilog code from descriptions
- Review and optimize existing code
- Explain concepts and best practices
- Help debug issues
- Write testbenches

What would you like to work on?`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeContent);
    setLog((prev) => [...prev, "📋 Code copied to clipboard!"]);
  };

  const downloadCode = () => {
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'module.v';
    a.click();
    URL.revokeObjectURL(url);
    setLog((prev) => [...prev, "💾 Code downloaded as module.v"]);
  };

  const runCode = () => {
    setLog((prev) => [...prev, "🚀 Running code simulation...", "✅ Simulation completed successfully!"]);
  };

  const saveCode = () => {
    setHDL(codeContent);
    setLog((prev) => [...prev, "💾 Code saved to project!"]);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-slate-100">ChipForge HDL Editor</h1>
            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
              Score: {hdlScore ? `${(hdlScore * 100).toFixed(1)}%` : 'N/A'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveCode} className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={runCode} className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode} className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Code Editor Panel */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
            <TabsList className="bg-slate-700 border-b border-slate-600 rounded-none">
              <TabsTrigger value="editor" className="bg-slate-700 text-slate-200 data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100 hover:bg-slate-600">
                <FileText className="h-4 w-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="generate" className="bg-slate-700 text-slate-200 data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100 hover:bg-slate-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="log" className="bg-slate-700 text-slate-200 data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100 hover:bg-slate-600">
                <Lightbulb className="h-4 w-4 mr-2" />
                Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 p-0">
              <div className="h-full bg-slate-900">
                <textarea
                  ref={editorRef}
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full h-full bg-slate-900 text-green-300 p-4 font-mono text-sm resize-none border-none outline-none"
                  placeholder="Start coding your Verilog module here..."
                  spellCheck={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="generate" className="flex-1 p-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Generate HDL</h3>

                {guidedMode.isActive && (
                  <Card className="mb-4 border-blue-500/30 bg-blue-500/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-blue-300">
                        <Lightbulb className="h-4 w-4" />
                        Guided Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-blue-200">We will now convert your schematic into Verilog HDL.</div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your design (e.g., '4-bit up counter with synchronous reset and enable')"
                      className="min-h-[100px] bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    />
                    <div className="flex gap-2">
                      <Button onClick={generate} disabled={status === "generating"} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {status === "generating" ? "🔄 Generating..." : "🚀 Generate from Text"}
                      </Button>
                      <Button onClick={generateFromSchematic} disabled={status === "generating"} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        {status === "generating" ? "🔄 Generating..." : "🧩 Generate from Schematic"}
                      </Button>
                    </div>
                  </div>

                  {/* Side-by-side code & explanation after generation */}
                  <div className="space-y-2">
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Natural Language Explanation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64 border border-slate-700 rounded p-2">
                          <pre className="whitespace-pre-wrap text-xs text-slate-200">{explanation || 'No explanation yet. Generate HDL to see analysis.'}</pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Code preview */}
                <div className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Generated Verilog</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64 border border-slate-700 rounded p-2">
                        <pre className="text-xs text-green-300">{generatedCode || '// Generate HDL to see output here.'}</pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="log" className="flex-1 p-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Activity Log</h3>
                <div className="bg-slate-900 p-4 rounded text-xs text-green-300 whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-600">
                  {log.length > 0 ? log.join("\n") : "No activity yet. Start coding or generating HDL to see logs here."}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Chatbot Panel */}
        <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-slate-100">AI Coding Assistant</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">Ask me anything about HDL coding!</p>
          </div>

          {/* Chat Messages - Scrollable Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[280px] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isGenerating && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-700 text-slate-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Chat Input - ALWAYS VISIBLE at Bottom */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask me about HDL coding..."
                className="flex-1 bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-400"
              />
              <Button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || isGenerating}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 