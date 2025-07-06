import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArrowLeft, Cpu, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSimulation } from "@/hooks/useSimulation";
import SimulationConfig from "@/components/chipforge/SimulationConfig";
import SimulationProgress from "@/components/chipforge/SimulationProgress";
import WaveformViewer from "@/components/chipforge/WaveformViewer";
import ConsoleLog from "@/components/chipforge/ConsoleLog";
import ResultsPanel from "@/components/chipforge/ResultsPanel";

const ChipForgeSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialHdlCode = location.state?.hdlCode;
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

  const getStatusBadge = () => {
    if (!result) {
      switch (progress.stage) {
        case 'compiling':
        case 'running':
        case 'processing':
          return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Running...</Badge>;
        case 'complete':
          return <Badge className="bg-chipforge-accent/20 text-chipforge-accent border-chipforge-accent/30">Success</Badge>;
        default:
          return <Badge variant="outline" className="text-slate-400">Ready</Badge>;
      }
    }
    
    switch (result.status) {
      case 'success':
        return <Badge className="bg-chipforge-accent/20 text-chipforge-accent border-chipforge-accent/30">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      case 'timeout':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Timeout</Badge>;
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
            <div className="h-full flex flex-col">
              <SimulationConfig 
                onRunSimulation={simulate}
                onCancelSimulation={cancelSimulation}
                isRunning={isRunning}
                initialHdlCode={initialHdlCode}
              />
              
              {/* Progress Panel */}
              <div className="border-t border-slate-800 p-4">
                <SimulationProgress 
                  stage={progress.stage}
                  progress={progress.progress}
                  message={progress.message}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="bg-slate-800 hover:bg-slate-700 transition-colors" />
          
          {/* Main Viewer Area */}
          <ResizablePanel defaultSize={50} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Waveform Viewer */}
              <ResizablePanel defaultSize={70} minSize={50}>
                <WaveformViewer 
                  waveformData={result?.waveformData || null}
                  isComplete={progress.stage === 'complete' && result?.status === 'success'}
                />
              </ResizablePanel>
              
              <ResizableHandle className="bg-slate-800 hover:bg-slate-700 transition-colors" />
              
              {/* Console Log */}
              <ResizablePanel defaultSize={30} minSize={20}>
                <ConsoleLog 
                  logs={logs}
                  status={result?.status === 'success' ? 'success' : 
                         result?.status === 'error' ? 'error' :
                         isRunning ? 'running' : 'idle'}
                  onClearLogs={clearLogs}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle className="bg-slate-800 hover:bg-slate-700 transition-colors" />
          
          {/* Results Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <ResultsPanel 
              results={{
                pass: result?.status === 'success',
                duration: result?.metrics?.duration || '0ms',
                gateCount: result?.metrics?.gateCount || 0,
                assertions: result?.metrics?.assertions || { passed: 0, failed: 0 }
              }}
              isComplete={progress.stage === 'complete' && result?.status === 'success'}
              onReset={resetSimulation}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChipForgeSimulation;