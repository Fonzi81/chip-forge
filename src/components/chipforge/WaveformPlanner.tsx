import { useState, useEffect } from "react";
import { useHDLDesignStore, WaveformSignal } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  Eye, 
  Download, 
  Copy, 
  Lightbulb,
  Play,
  Square,
  Circle
} from "lucide-react";

const MAX_CYCLES = 16;

export default function WaveformPlanner() {
  const { 
    design, 
    waveform, 
    waveformData,
    guidedMode,
    setWaveformSignal, 
    setWaveformData,
    generateWaveformJSON,
    generateTestbench, 
    generateNaturalLanguageHints,
    testbenchVerilog,
    completeGuidedStep
  } = useHDLDesignStore();
  const [cycles] = useState(MAX_CYCLES);
  const [showModal, setShowModal] = useState(false);
  const [showWaveformModal, setShowWaveformModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [naturalLanguageHints, setNaturalLanguageHints] = useState<string[]>([]);

  // Enhanced signal detection with automatic categorization
  const allSignals = [
    ...(design?.components.flatMap(c => c.inputs.map(i => `${c.id}.${i}`)) || []),
    ...(design?.components.flatMap(c => c.outputs.map(o => `${c.id}.${o}`)) || []),
  ];

  // Auto-populate signals if none exist
  useEffect(() => {
    if (allSignals.length > 0 && Object.keys(waveform).length === 0) {
      // Auto-populate with default patterns
      allSignals.forEach(signal => {
        let defaultPattern: Record<number, 0 | 1> = {};
        
        if (signal.toLowerCase().includes('clk') || signal.toLowerCase().includes('clock')) {
          // Clock pattern: alternating 0,1
          for (let i = 0; i < cycles; i++) {
            defaultPattern[i] = (i % 2) as 0 | 1;
          }
        } else if (signal.toLowerCase().includes('reset') || signal.toLowerCase().includes('rst')) {
          // Reset pattern: 1 at start, 0 after
          for (let i = 0; i < cycles; i++) {
            defaultPattern[i] = (i === 0 ? 1 : 0) as 0 | 1;
          }
        } else {
          // Default pattern: all 0
          for (let i = 0; i < cycles; i++) {
            defaultPattern[i] = 0;
          }
        }
        
        setWaveformSignal(signal, defaultPattern);
      });
    }
  }, [allSignals, cycles, waveform, setWaveformSignal]);

  // Generate natural language hints when guided mode is active
  useEffect(() => {
    if (guidedMode.isActive && Object.keys(waveform).length > 0) {
      const hints = generateNaturalLanguageHints();
      setNaturalLanguageHints(hints);
    }
  }, [waveform, guidedMode.isActive, generateNaturalLanguageHints]);

  const toggle = (signal: string, cycle: number) => {
    const current = waveform[signal]?.[cycle] || 0;
    const updated = { ...waveform[signal], [cycle]: (current === 1 ? 0 : 1) as 0 | 1 } as Record<number, 0 | 1>;
    setWaveformSignal(signal, updated);
    
    // Guided mode: complete steps based on user actions
    if (guidedMode.isActive) {
      if (signal.toLowerCase().includes('clk') || signal.toLowerCase().includes('clock')) {
        completeGuidedStep(6); // Clock signal step
      } else if (Object.keys(waveform).length > 0) {
        completeGuidedStep(7); // Waveform planning step
      }
    }
  };

  const handleGenerate = () => {
    generateTestbench();
    setShowModal(true);
  };

  const handleGenerateWaveform = () => {
    const waveformJSON = generateWaveformJSON();
    setShowWaveformModal(true);
  };

  const handleDownloadWaveform = () => {
    const waveformJSON = generateWaveformJSON();
    const blob = new Blob([waveformJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waveform.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSignalCategory = (signal: string) => {
    if (signal.toLowerCase().includes('clk') || signal.toLowerCase().includes('clock')) return 'clock';
    if (signal.toLowerCase().includes('reset') || signal.toLowerCase().includes('rst')) return 'reset';
    if (signal.toLowerCase().includes('out') || signal.toLowerCase().includes('q')) return 'output';
    if (signal.toLowerCase().includes('en') || signal.toLowerCase().includes('ctrl')) return 'control';
    return 'input';
  };

  const getSignalIcon = (category: string) => {
    switch (category) {
      case 'clock': return <Clock className="h-4 w-4" />;
      case 'reset': return <RotateCcw className="h-4 w-4" />;
      case 'output': return <Eye className="h-4 w-4" />;
      case 'control': return <Square className="h-4 w-4" />;
      default: return <ArrowRight className="h-4 w-4" />;
    }
  };

  const getSignalColor = (category: string) => {
    switch (category) {
      case 'clock': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'reset': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'output': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'control': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testbenchVerilog);
  };

  const handleDownload = () => {
    const blob = new Blob([testbenchVerilog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testbench.v';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (showModal) {
      // Always show the latest testbenchVerilog
    }
  }, [testbenchVerilog, showModal]);

  return (
    <div className="p-4 bg-slate-900 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Waveform Planner</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateWaveform}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Waveform
          </Button>
          <Button 
            onClick={handleGenerate}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Generate Testbench
          </Button>
        </div>
      </div>

      {/* Guided Mode Hints */}
      {guidedMode.isActive && naturalLanguageHints.length > 0 && (
        <Card className="mb-4 border-blue-500/30 bg-blue-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-300">
              <Lightbulb className="h-4 w-4" />
              Guided Mode Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {naturalLanguageHints.map((hint, index) => (
              <p key={index} className="text-xs text-blue-200">
                💡 {hint}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Waveform Timeline */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Signal Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="border border-slate-700 rounded p-2 h-[400px]">
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr>
                  <th className="text-left pr-4">Signal</th>
                  {Array.from({ length: cycles }).map((_, i) => (
                    <th key={i} className="px-1 text-center">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {i}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSignals.map((sig) => {
                  const category = getSignalCategory(sig);
                  const icon = getSignalIcon(category);
                  const colorClass = getSignalColor(category);
                  
                  return (
                    <tr key={sig} className="hover:bg-slate-800/50">
                      <td className="pr-4">
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="font-medium">{sig}</span>
                          <Badge variant="secondary" className={colorClass}>
                            {category}
                          </Badge>
                        </div>
                      </td>
                      {Array.from({ length: cycles }).map((_, i) => (
                        <td key={i} className="text-center p-1">
                          <button
                            className={`w-6 h-6 rounded transition-all hover:scale-110 ${
                              waveform[sig]?.[i] 
                                ? "bg-emerald-400 text-emerald-900" 
                                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                            }`}
                            onClick={() => toggle(sig, i)}
                            title={`Toggle ${sig} at cycle ${i}`}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Waveform Export Modal */}
      {showWaveformModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl shadow-lg border border-slate-600">
            <h3 className="text-lg font-bold mb-4 text-white">Generated Waveform JSON</h3>
            <pre className="bg-slate-900 p-4 rounded text-xs max-h-96 overflow-auto mb-4 text-green-400 border border-slate-600">
              {generateWaveformJSON()}
            </pre>
            <div className="flex gap-2">
              <Button onClick={handleDownloadWaveform} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWaveformModal(false)}
                className="text-slate-300 border-slate-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Testbench Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl shadow-lg border border-slate-600">
            <h3 className="text-lg font-bold mb-4 text-white">Generated Verilog Testbench</h3>
            <pre className="bg-slate-900 p-4 rounded text-xs max-h-96 overflow-auto mb-4 text-green-400 border border-slate-600">
              {testbenchVerilog}
            </pre>
            <div className="flex gap-2">
              <Button onClick={handleCopy} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download .v
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowModal(false)}
                className="text-slate-300 border-slate-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 