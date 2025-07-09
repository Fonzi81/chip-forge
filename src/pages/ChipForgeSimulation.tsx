import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  Lightbulb,
  Code,
  Settings,
  BarChart3,
  Activity,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { runTestBench } from '../backend/sim/testBench';
import { getReflexionAdvice } from '../backend/reflexion/reviewer';
import { loadHDLDesign, HDLDesign } from '../utils/localStorage';

interface SimulationResult {
  passed: boolean;
  feedback: string;
  warnings: string[];
  errors: string[];
  simulationTime: number;
  waveforms?: WaveformData[];
  statistics?: SimulationStats;
}

interface WaveformData {
  signal: string;
  values: { time: number; value: string | number }[];
  type: 'wire' | 'reg' | 'input' | 'output';
}

interface SimulationStats {
  totalSignals: number;
  simulationCycles: number;
  maxFrequency: number;
  powerEstimate: number;
  areaEstimate: number;
}

interface ReflexionAdvice {
  suggestions: string[];
  codeReview: string;
  improvements: string[];
  confidence: number;
}

export default function ChipForgeSimulation() {
  const [currentDesign, setCurrentDesign] = useState<HDLDesign | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [advice, setAdvice] = useState<ReflexionAdvice | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'failed' | 'passed'>('idle');
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadActiveDesign();
  }, []);

  const loadActiveDesign = () => {
    setStatus('loading');
    try {
      // Try to load the most recent design or a specific one
      const designs = JSON.parse(localStorage.getItem('hdlDesigns') || '[]');
      if (designs.length > 0) {
        const latestDesign = designs[designs.length - 1];
        setCurrentDesign(latestDesign);
        setStatus('idle');
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('Failed to load design:', error);
      setStatus('idle');
    }
  };

  const runSimulation = async () => {
    if (!currentDesign?.verilog) return;
    
    setStatus('running');
    setIsPaused(false);
    
    try {
      // Simulate processing time based on code complexity
      const processingTime = Math.min(3000 + currentDesign.verilog.length * 2, 8000);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      const result = await runTestBench(currentDesign.verilog);
      
      // Generate mock waveform data
      const waveforms = generateMockWaveforms(currentDesign.verilog);
      const statistics = generateMockStatistics(currentDesign.verilog);
      
      const fullResult: SimulationResult = {
        ...result,
        waveforms,
        statistics
      };
      
      setSimulationResult(fullResult);

      if (result.passed) {
        setStatus('passed');
        setAdvice(null);
      } else {
        // Get reflexion advice
        const reflexionAdvice = await getReflexionAdvice(currentDesign.verilog, result.feedback);
        setAdvice(reflexionAdvice);
        setStatus('failed');
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setStatus('failed');
      setSimulationResult({
        passed: false,
        feedback: 'Simulation failed. Please check your HDL code.',
        warnings: [],
        errors: ['Simulation error'],
        simulationTime: 0
      });
    }
  };

  const generateMockWaveforms = (verilog: string): WaveformData[] => {
    const signals = extractSignals(verilog);
    const waveforms: WaveformData[] = [];
    
    signals.forEach((signal, index) => {
      const values = [];
      for (let i = 0; i < 20; i++) {
        if (signal.type === 'clk') {
          values.push({ time: i * 10, value: i % 2 === 0 ? '0' : '1' });
        } else if (signal.type === 'reset') {
          values.push({ time: i * 10, value: i < 2 ? '1' : '0' });
        } else {
          values.push({ time: i * 10, value: Math.floor(Math.random() * 16).toString(16) });
        }
      }
      
      waveforms.push({
        signal: signal.name,
        values,
        type: signal.direction as any
      });
    });
    
    return waveforms;
  };

  const generateMockStatistics = (verilog: string): SimulationStats => {
    const lines = verilog.split('\n').length;
    const complexity = Math.min(lines / 10, 1);
    
    return {
      totalSignals: extractSignals(verilog).length,
      simulationCycles: Math.floor(100 + Math.random() * 900),
      maxFrequency: Math.floor(50 + Math.random() * 450),
      powerEstimate: Math.floor(10 + Math.random() * 90),
      areaEstimate: Math.floor(1000 + Math.random() * 9000)
    };
  };

  const extractSignals = (verilog: string) => {
    const signals = [];
    const lines = verilog.split('\n');
    
    for (const line of lines) {
      const inputMatch = line.match(/input\s+(?:wire\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/);
      const outputMatch = line.match(/output\s+(?:reg\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/);
      const wireMatch = line.match(/wire\s+(?:\[(\d+):(\d+)\]\s+)?(\w+)/);
      const regMatch = line.match(/reg\s+(?:\[(\d+):(\d+)\]\s+)?(\w+)/);
      
      if (inputMatch) {
        signals.push({ name: inputMatch[3], direction: 'input', type: inputMatch[3].includes('clk') ? 'clk' : 'data' });
      } else if (outputMatch) {
        signals.push({ name: outputMatch[3], direction: 'output', type: 'data' });
      } else if (wireMatch) {
        signals.push({ name: wireMatch[3], direction: 'wire', type: 'data' });
      } else if (regMatch) {
        signals.push({ name: regMatch[3], direction: 'reg', type: 'data' });
      }
    }
    
    return signals;
  };

  const exportWaveforms = () => {
    if (!simulationResult?.waveforms) return;
    
    const data = simulationResult.waveforms.map(wave => ({
      signal: wave.signal,
      values: wave.values
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDesign?.name || 'simulation'}_waveforms.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-emerald-400';
      case 'failed': return 'text-red-400';
      case 'running': return 'text-blue-400';
      case 'loading': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4" />;
      case 'loading': return <Clock className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              ChipForge Simulation
            </h1>
            <p className="text-slate-400 mt-2">
              Test and validate your HDL designs with professional simulation tools
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              Simulation Engine
            </Badge>
            {currentDesign && (
              <Badge variant="secondary">
                {currentDesign.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={getStatusColor(status)}>
                  {getStatusIcon(status)}
                </div>
                <div>
                  <div className="font-medium text-slate-200">
                    {status === 'idle' && 'Ready to simulate'}
                    {status === 'loading' && 'Loading design...'}
                    {status === 'running' && 'Running simulation...'}
                    {status === 'passed' && 'Simulation passed! ✅'}
                    {status === 'failed' && 'Simulation failed - Review results'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {simulationResult && `Simulation time: ${simulationResult.simulationTime}ms`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={runSimulation}
                  disabled={!currentDesign?.verilog || status === 'running'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
                {simulationResult?.waveforms && (
                  <Button variant="outline" size="sm" onClick={exportWaveforms}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Waveforms
                  </Button>
                )}
              </div>
            </div>
            {status === 'running' && (
              <Progress value={75} className="mt-3" />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - HDL Code */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  HDL Code
                </CardTitle>
                <CardDescription>
                  Current design being simulated
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentDesign?.verilog ? (
                  <div className="bg-slate-900 rounded p-4 overflow-auto max-h-96">
                    <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                      {currentDesign.verilog}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No HDL code loaded</p>
                    <p className="text-sm">Create a design first</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                                 <TabsTrigger value="waveforms" className="data-[state=active]:bg-slate-700">
                   <TrendingUp className="h-4 w-4 mr-2" />
                   Waveforms
                 </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-slate-700">
                  <Activity className="h-4 w-4 mr-2" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="advice" className="data-[state=active]:bg-slate-700">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  AI Advice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                      Simulation Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {simulationResult ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-emerald-400">
                            {simulationResult.statistics?.totalSignals || 0}
                          </div>
                          <div className="text-sm text-slate-400">Signals</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-blue-400">
                            {simulationResult.statistics?.simulationCycles || 0}
                          </div>
                          <div className="text-sm text-slate-400">Cycles</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-purple-400">
                            {simulationResult.statistics?.maxFrequency || 0}MHz
                          </div>
                          <div className="text-sm text-slate-400">Max Freq</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-pink-400">
                            {simulationResult.statistics?.powerEstimate || 0}mW
                          </div>
                          <div className="text-sm text-slate-400">Power</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No simulation data available</p>
                        <p className="text-sm">Run simulation to see overview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="waveforms" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                                         <CardTitle className="flex items-center gap-2">
                       <TrendingUp className="h-5 w-5 text-purple-400" />
                       Signal Waveforms
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {simulationResult?.waveforms ? (
                      <div className="space-y-4">
                        {simulationResult.waveforms.map((waveform, idx) => (
                          <div key={idx} className="bg-slate-900 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-sm text-slate-200">
                                {waveform.signal}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {waveform.type}
                              </Badge>
                            </div>
                            <div className="bg-slate-800 rounded p-2 overflow-x-auto">
                              <div className="flex items-center space-x-1 min-w-max">
                                {waveform.values.map((point, pointIdx) => (
                                  <div
                                    key={pointIdx}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="text-xs text-slate-400 mb-1">
                                      {point.time}ns
                                    </div>
                                    <div className="w-8 h-6 bg-slate-700 rounded flex items-center justify-center text-xs font-mono">
                                      {point.value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                                             <div className="text-center text-slate-400 py-8">
                         <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                         <p>No waveform data available</p>
                         <p className="text-sm">Run simulation to see waveforms</p>
                       </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" />
                      Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {simulationResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {simulationResult.passed ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          )}
                          <span className="font-medium">
                            {simulationResult.passed ? 'All Tests Passed' : 'Tests Failed'}
                          </span>
                        </div>
                        
                        <div className="bg-slate-900 rounded p-4">
                          <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                            {simulationResult.feedback}
                          </pre>
                        </div>

                        {simulationResult.errors.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-400">Errors:</h4>
                            <ul className="space-y-1">
                              {simulationResult.errors.map((error, idx) => (
                                <li key={idx} className="text-sm text-red-300">• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {simulationResult.warnings.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-yellow-400">Warnings:</h4>
                            <ul className="space-y-1">
                              {simulationResult.warnings.map((warning, idx) => (
                                <li key={idx} className="text-sm text-yellow-300">• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No test results available</p>
                        <p className="text-sm">Run simulation to see results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advice" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-purple-400" />
                      AI Reflexion Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {advice ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            Confidence: {advice.confidence}%
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Code Review:</h4>
                            <div className="bg-slate-900 rounded p-3 text-sm text-slate-300">
                              {advice.codeReview}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Suggestions:</h4>
                            <ul className="space-y-1">
                              {advice.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Improvements:</h4>
                            <ul className="space-y-1">
                              {advice.improvements.map((improvement, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                  <Sparkles className="h-3 w-3 mt-1 flex-shrink-0 text-purple-400" />
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No AI advice available</p>
                        <p className="text-sm">AI feedback appears when tests fail</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}