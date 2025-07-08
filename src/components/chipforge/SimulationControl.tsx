import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Settings,
  Activity,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3
} from "lucide-react";

interface SimulationConfig {
  timeLimit: number;
  timeStep: number;
  signals: string[];
  testbench?: string;
}

interface WaveformData {
  time: number[];
  signals: {
    [signalName: string]: {
      values: (0 | 1 | 'x' | 'z')[];
      transitions: number[];
    };
  };
}

interface SimulationResult {
  success: boolean;
  waveform: WaveformData;
  coverage: {
    lineCoverage: number;
    branchCoverage: number;
    toggleCoverage: number;
  };
  errors: string[];
  warnings: string[];
  executionTime: number;
}

const SimulationControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLimit, setTimeLimit] = useState(1000);
  const [timeStep, setTimeStep] = useState(1);
  const [selectedSignals, setSelectedSignals] = useState<string[]>(['clk', 'rst_n', 'data_in', 'data_out']);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [activeTab, setActiveTab] = useState("control");
  const [currentTime, setCurrentTime] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

  const availableSignals = [
    'clk', 'rst_n', 'data_in', 'data_out', 'enable', 'load', 'count', 'overflow'
  ];

  const handleStartSimulation = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
    setExecutionTime(0);
    setSimulationResult(null);

    const startTime = Date.now();

    // Simulate simulation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          completeSimulation(startTime);
          return 100;
        }
        return prev + 2;
      });

      setCurrentTime(prev => prev + timeStep);
    }, 50);

    // Store interval reference for cleanup
    return () => clearInterval(interval);
  };

  const handlePauseSimulation = () => {
    setIsPaused(!isPaused);
  };

  const handleStopSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
    setSimulationResult(null);
  };

  const completeSimulation = (startTime: number) => {
    const endTime = Date.now();
    const execTime = (endTime - startTime) / 1000;
    setExecutionTime(execTime);

    // Generate mock simulation result
    const mockWaveform: WaveformData = {
      time: Array.from({ length: 100 }, (_, i) => i * timeStep),
      signals: {
        clk: {
          values: Array.from({ length: 100 }, (_, i) => i % 2 as 0 | 1),
          transitions: [0, 50]
        },
        rst_n: {
          values: Array.from({ length: 100 }, (_, i) => i < 10 ? 0 : 1),
          transitions: [0, 10]
        },
        data_in: {
          values: Array.from({ length: 100 }, (_, i) => (i % 4) as 0 | 1),
          transitions: [0, 25, 50, 75]
        },
        data_out: {
          values: Array.from({ length: 100 }, (_, i) => (i % 4) as 0 | 1),
          transitions: [0, 25, 50, 75]
        }
      }
    };

    const result: SimulationResult = {
      success: true,
      waveform: mockWaveform,
      coverage: {
        lineCoverage: 85.5,
        branchCoverage: 72.3,
        toggleCoverage: 91.2
      },
      errors: [],
      warnings: ['Simulation completed with mock data'],
      executionTime: execTime
    };

    setSimulationResult(result);
  };

  const toggleSignal = (signal: string) => {
    setSelectedSignals(prev => 
      prev.includes(signal) 
        ? prev.filter(s => s !== signal)
        : [...prev, signal]
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">Simulation Control</h2>
          <Badge variant="secondary" className="bg-blue-800 text-blue-200">
            Native Engine
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-400">
            Time: {currentTime}ns
          </Badge>
          {simulationResult && (
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              {simulationResult.coverage.lineCoverage.toFixed(1)}% Coverage
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/3 p-4 border-r border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="control">Control</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
            </TabsList>

            <TabsContent value="control" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-400" />
                    Simulation Settings
                  </CardTitle>
                  <CardDescription>
                    Configure simulation parameters and controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (ns)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeStep">Time Step (ns)</Label>
                    <Input
                      id="timeStep"
                      type="number"
                      value={timeStep}
                      onChange={(e) => setTimeStep(parseInt(e.target.value))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Simulation Controls</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleStartSimulation}
                        disabled={isRunning}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                      <Button
                        onClick={handlePauseSimulation}
                        disabled={!isRunning}
                        variant="outline"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleStopSimulation}
                        disabled={!isRunning}
                        variant="outline"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleResetSimulation}
                        variant="outline"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isRunning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {simulationResult && (
                    <div className="space-y-3">
                      <Label>Results</Label>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Execution Time</div>
                          <div className="font-mono">{executionTime.toFixed(3)}s</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Line Coverage</div>
                          <div className="font-mono">{simulationResult.coverage.lineCoverage.toFixed(1)}%</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Branch Coverage</div>
                          <div className="font-mono">{simulationResult.coverage.branchCoverage.toFixed(1)}%</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Toggle Coverage</div>
                          <div className="font-mono">{simulationResult.coverage.toggleCoverage.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signals" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Signal Selection</CardTitle>
                  <CardDescription>
                    Choose which signals to monitor during simulation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableSignals.map(signal => (
                    <div
                      key={signal}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-slate-700"
                      onClick={() => toggleSignal(signal)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSignals.includes(signal)}
                        onChange={() => {}}
                        className="rounded border-slate-600 bg-slate-900"
                      />
                      <Label className="cursor-pointer flex-1">{signal}</Label>
                      <Badge variant="outline" className="text-xs">
                        {signal.includes('clk') ? 'clock' : signal.includes('rst') ? 'reset' : 'data'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-2/3 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Waveform Viewer
              </h3>
              {simulationResult && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    {simulationResult.waveform.time.length} samples
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {Object.keys(simulationResult.waveform.signals).length} signals
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4">
              {simulationResult ? (
                <div className="h-full flex flex-col">
                  {/* Mock waveform display */}
                  <div className="flex-1 bg-slate-800 rounded p-4 mb-4">
                    <div className="text-center text-slate-400 mb-4">
                      Waveform visualization coming soon...
                    </div>
                    <div className="space-y-2">
                      {selectedSignals.map(signal => {
                        const signalData = simulationResult.waveform.signals[signal];
                        if (!signalData) return null;
                        
                        return (
                          <div key={signal} className="flex items-center gap-3">
                            <div className="w-20 text-sm font-mono text-slate-300">{signal}</div>
                            <div className="flex-1 h-6 bg-slate-700 rounded flex items-center">
                              <div className="flex h-full">
                                {signalData.values.slice(0, 20).map((value, i) => (
                                  <div
                                    key={i}
                                    className={`h-full border-r border-slate-600 ${
                                      value === 1 ? 'bg-emerald-500' :
                                      value === 0 ? 'bg-slate-600' :
                                      value === 'x' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: '5px' }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="w-12 text-xs text-slate-400">
                              {signalData.values[0] === 1 ? 'HIGH' : 
                               signalData.values[0] === 0 ? 'LOW' : 
                               signalData.values[0] === 'x' ? 'X' : 'Z'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {simulationResult.warnings.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-200">
                        {simulationResult.warnings.map((warning, index) => (
                          <div key={index}>• {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No simulation data available</p>
                    <p className="text-sm">Start a simulation to view waveforms</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControl; 