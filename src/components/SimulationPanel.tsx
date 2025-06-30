
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  Zap
} from "lucide-react";

const SimulationPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [clockFreq, setClockFreq] = useState("100");
  const [inputVectors, setInputVectors] = useState("a=4'b0000; b=4'b0001; op=3'b000;");
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResults, setSimulationResults] = useState({
    status: "pass",
    gateCount: 24,
    timingScore: 98.5,
    powerConsumption: "2.3mW"
  });

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Simulate running for 3 seconds
    setTimeout(() => {
      setIsRunning(false);
      setSimulationComplete(true);
    }, 3000);
  };

  const handleStopSimulation = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimulationComplete(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Simulation Controls */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Simulation Control</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="bg-emerald-500 text-slate-900 hover:bg-emerald-400"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button
              onClick={handleStopSimulation}
              disabled={!isRunning}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-slate-900"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button
              onClick={handleReset}
              variant="ghost"
              className="text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clock-freq" className="text-slate-300">Clock Frequency (MHz)</Label>
            <Input
              id="clock-freq"
              value={clockFreq}
              onChange={(e) => setClockFreq(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-slate-100 mt-1"
              placeholder="100"
            />
          </div>
          <div>
            <Label htmlFor="input-vectors" className="text-slate-300">Input Test Vectors</Label>
            <Textarea
              id="input-vectors"
              value={inputVectors}
              onChange={(e) => setInputVectors(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-slate-100 mt-1 h-20 font-mono text-sm"
              placeholder="a=4'b0000; b=4'b0001; op=3'b000;"
            />
          </div>
        </div>
      </div>

      {/* Waveform Viewer */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span className="font-semibold text-slate-200">Waveform Viewer</span>
            {simulationComplete && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 ml-2">
                Simulation Complete
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              <Download className="h-4 w-4 mr-2" />
              Export VCD
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/50 p-4">
          {simulationComplete ? (
            <div className="h-full">
              {/* Mock Waveform Display */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 h-full">
                <div className="space-y-3">
                  {/* Clock Signal */}
                  <div className="flex items-center">
                    <div className="w-16 text-xs text-slate-400 font-mono">clk</div>
                    <div className="flex-1 h-8 bg-slate-900/50 border border-slate-600 rounded relative overflow-hidden">
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: 20 }, (_, i) => (
                          <div key={i} className="flex-1 border-r border-slate-600">
                            <div className={`h-full ${i % 2 === 0 ? 'bg-emerald-400/20' : 'bg-slate-700/20'}`}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Input A */}
                  <div className="flex items-center">
                    <div className="w-16 text-xs text-slate-400 font-mono">a[3:0]</div>
                    <div className="flex-1 h-8 bg-slate-900/50 border border-slate-600 rounded relative overflow-hidden">
                      <div className="absolute inset-0 flex">
                        <div className="w-1/4 bg-cyan-400/20 border-r border-slate-600"></div>
                        <div className="w-1/4 bg-cyan-400/30 border-r border-slate-600"></div>
                        <div className="w-1/4 bg-cyan-400/40 border-r border-slate-600"></div>
                        <div className="w-1/4 bg-cyan-400/20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Input B */}
                  <div className="flex items-center">
                    <div className="w-16 text-xs text-slate-400 font-mono">b[3:0]</div>
                    <div className="flex-1 h-8 bg-slate-900/50 border border-slate-600 rounded relative overflow-hidden">
                      <div className="absolute inset-0 flex">
                        <div className="w-1/3 bg-blue-400/20 border-r border-slate-600"></div>
                        <div className="w-1/3 bg-blue-400/30 border-r border-slate-600"></div>
                        <div className="w-1/3 bg-blue-400/40"></div>
                      </div>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex items-center">
                    <div className="w-16 text-xs text-slate-400 font-mono">result</div>
                    <div className="flex-1 h-8 bg-slate-900/50 border border-slate-600 rounded relative overflow-hidden">
                      <div className="absolute inset-0 flex">
                        <div className="w-1/4 bg-amber-400/20 border-r border-slate-600"></div>
                        <div className="w-1/4 bg-amber-400/30 border-r border-slate-600"></div>
                        <div className="w-1/4 bg-amber-400/40 border-r border-slate-600"></div>
                        <div className="w-1/4 bg-amber-400/30"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Waveforms will appear here after simulation</p>
                <p className="text-sm">Configure your inputs and click "Run Simulation"</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Summary */}
      {simulationComplete && (
        <div className="p-4 border-t border-slate-700 bg-slate-900/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-200">Simulation Summary</h4>
            <div className="flex items-center gap-2">
              {simulationResults.status === "pass" ? (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                simulationResults.status === "pass" ? "text-emerald-400" : "text-red-400"
              }`}>
                {simulationResults.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3 bg-slate-800/50 border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-slate-400">Gate Count</span>
              </div>
              <div className="text-lg font-semibold text-slate-200">{simulationResults.gateCount}</div>
            </Card>
            
            <Card className="p-3 bg-slate-800/50 border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-400">Timing Score</span>
              </div>
              <div className="text-lg font-semibold text-slate-200">{simulationResults.timingScore}%</div>
            </Card>
            
            <Card className="p-3 bg-slate-800/50 border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Power</span>
              </div>
              <div className="text-lg font-semibold text-slate-200">{simulationResults.powerConsumption}</div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
