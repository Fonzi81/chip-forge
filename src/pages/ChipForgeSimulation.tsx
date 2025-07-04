import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArrowLeft, Cpu, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SimulationConfig from "@/components/chipforge/SimulationConfig";
import WaveformViewer from "@/components/chipforge/WaveformViewer";
import ConsoleLog from "@/components/chipforge/ConsoleLog";
import ResultsPanel from "@/components/chipforge/ResultsPanel";

interface SimulationState {
  isRunning: boolean;
  isComplete: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
  logs: string[];
  waveformData: any;
  results: {
    pass: boolean;
    duration: string;
    gateCount: number;
    assertions: { passed: number; failed: number };
  };
}

const ChipForgeSimulation = () => {
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    isComplete: false,
    status: 'idle',
    logs: [],
    waveformData: null,
    results: {
      pass: false,
      duration: '0ms',
      gateCount: 0,
      assertions: { passed: 0, failed: 0 }
    }
  });

  const handleRunSimulation = async (config: any) => {
    setSimulation(prev => ({ 
      ...prev, 
      isRunning: true, 
      status: 'running',
      logs: ['Starting simulation...', 'Compiling HDL code...']
    }));

    // Mock simulation - replace with actual API call
    setTimeout(() => {
      const mockWaveformData = {
        signals: ['clk', 'a[3:0]', 'b[3:0]', 'result[3:0]', 'carry_out'],
        timeScale: 'ns',
        duration: 1000,
        traces: [
          { name: 'clk', type: 'clock', transitions: [] },
          { name: 'a[3:0]', type: 'bus', width: 4, values: ['0000', '0001', '0010', '0011'] },
          { name: 'b[3:0]', type: 'bus', width: 4, values: ['0001', '0010', '0011', '0100'] },
          { name: 'result[3:0]', type: 'bus', width: 4, values: ['0001', '0011', '0101', '0111'] },
          { name: 'carry_out', type: 'signal', values: ['0', '0', '0', '0'] }
        ]
      };

      setSimulation(prev => ({
        ...prev,
        isRunning: false,
        isComplete: true,
        status: 'success',
        logs: [...prev.logs, 'Compilation successful', 'Running testbench...', 'Simulation complete'],
        waveformData: mockWaveformData,
        results: {
          pass: true,
          duration: '2.3s',
          gateCount: 42,
          assertions: { passed: 8, failed: 0 }
        }
      }));
    }, 3000);
  };

  const getStatusBadge = () => {
    switch (simulation.status) {
      case 'running':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Running...</Badge>;
      case 'success':
        return <Badge className="bg-chipforge-accent/20 text-chipforge-accent border-chipforge-accent/30">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Ready</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-chipforge-bg text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <Cpu className="h-6 w-6 text-chipforge-accent" />
              <span className="text-xl font-display font-semibold">ChipForge</span>
              <span className="text-slate-400">Simulation Platform</span>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="bg-slate-900/50 border-slate-700 text-slate-300 font-mono text-xs"
            >
              Powered by Icarus Verilog
            </Badge>
            <div className="flex items-center gap-1 text-slate-400">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Live Simulation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Configuration Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <SimulationConfig 
              onRunSimulation={handleRunSimulation}
              isRunning={simulation.isRunning}
            />
          </ResizablePanel>
          
          <ResizableHandle className="bg-slate-800 hover:bg-slate-700 transition-colors" />
          
          {/* Main Viewer Area */}
          <ResizablePanel defaultSize={50} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Waveform Viewer */}
              <ResizablePanel defaultSize={70} minSize={50}>
                <WaveformViewer 
                  waveformData={simulation.waveformData}
                  isComplete={simulation.isComplete}
                />
              </ResizablePanel>
              
              <ResizableHandle className="bg-slate-800 hover:bg-slate-700 transition-colors" />
              
              {/* Console Log */}
              <ResizablePanel defaultSize={30} minSize={20}>
                <ConsoleLog 
                  logs={simulation.logs}
                  status={simulation.status}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle className="bg-slate-800 hover:bg-slate-700 transition-colors" />
          
          {/* Results Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <ResultsPanel 
              results={simulation.results}
              isComplete={simulation.isComplete}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChipForgeSimulation;