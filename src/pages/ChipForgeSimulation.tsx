import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  Lightbulb,
  Code,
  BarChart3,
  Activity,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { runTestBench } from '../backend/sim/testBench';
import { getReflexionAdvice } from '../backend/reflexion/reviewer';
import { runReflexionIteration } from '../backend/reflexion';
import { HDLDesign } from '../utils/localStorage';
import TopNav from "../components/chipforge/TopNav";
import WorkflowNav from "../components/chipforge/WorkflowNav";
import { useWorkflowStore } from "../state/workflowState";
import { useHDLDesignStore } from '../state/hdlDesignStore';

// Error Boundary Component
class SimulationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Simulation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-red-400">Simulation Error</h2>
            <p className="text-slate-400 max-w-md">
              Something went wrong with the simulation component. Please refresh the page or try again.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ChipForgeSimulation() {
  const { markComplete, setStage } = useWorkflowStore();
  const { design, loadFromLocalStorage } = useHDLDesignStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'failed' | 'passed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState<HDLDesign | null>(null);
  const [simulationResult, setSimulationResult] = useState<{
    passed: boolean;
    feedback: string;
    simulationTime: number;
    errors?: string[];
    warnings?: string[];
  } | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isReflexionRunning, setIsReflexionRunning] = useState(false);
  const [reflexionCount, setReflexionCount] = useState(0);

  useEffect(() => {
    setStage('Simulation');
    loadFromLocalStorage();
  }, [setStage, loadFromLocalStorage]);

  if (!design?.verilog) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-red-400">No HDL Code Found</h2>
          <p className="text-slate-400 max-w-md">
            Please complete HDL Design first.
          </p>
        </div>
      </div>
    );
  }

  const runSimulation = async () => {
    if (!design?.verilog) {
      setError('No HDL code available for simulation');
      return;
    }
    
    setStatus('running');
    setError(null);
    setAdvice(null);
    
    try {
      const result = await runTestBench(design.verilog);
      setSimulationResult(result);
      
      if (result.passed) {
        setStatus('passed');
        markComplete('Simulation');
      } else {
        setStatus('failed');
        // Get AI advice for failed simulation
        try {
          const reflexionAdvice = await getReflexionAdvice(design.verilog, result.feedback);
          setAdvice(reflexionAdvice.codeReview);
        } catch (adviceError) {
          console.error('Failed to get reflexion advice:', adviceError);
          setAdvice('AI advice unavailable - please review the simulation results manually.');
        }
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setError('Simulation failed. Please check your HDL code and try again.');
      setStatus('failed');
    }
  };

  const handleReflexionFix = async () => {
    if (!design?.verilog || !advice) return;
    
    setIsReflexionRunning(true);
    setError(null);
    
    try {
      const newCode = await runReflexionIteration(
        design.description || 'HDL module',
        design.verilog,
        simulationResult?.feedback || 'Simulation failed',
        advice
      );
      
      // Update current design
      setCurrentDesign({
        ...design,
        verilog: newCode,
        updatedAt: new Date().toISOString()
      });
      
      // Save to localStorage
      const designs = JSON.parse(localStorage.getItem('hdlDesigns') || '[]');
      const updatedDesigns = designs.map((design: HDLDesign) => 
        design.id === currentDesign.id ? { ...design, verilog: newCode } : design
      );
      localStorage.setItem('hdlDesigns', JSON.stringify(updatedDesigns));
      
      setAdvice(null);
      setSimulationResult(null);
      setStatus('idle');
      setReflexionCount(prev => prev + 1);
      
    } catch (error) {
      console.error('Reflexion fix failed:', error);
      setError('Failed to apply AI improvements. Please try again or review the code manually.');
    } finally {
      setIsReflexionRunning(false);
    }
  };

  return (
    <SimulationErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <TopNav />
        <WorkflowNav />
        <div className="container mx-auto p-6 space-y-6">
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
              {design && (
                <Badge variant="secondary">
                  {design.name}
                </Badge>
              )}
              {reflexionCount > 0 && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {reflexionCount} AI Iteration{reflexionCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {error && (
            <Card className="bg-red-900/20 border-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${
                    status === 'passed' ? 'text-emerald-400' :
                    status === 'failed' ? 'text-red-400' :
                    status === 'running' ? 'text-blue-400' :
                    'text-slate-400'
                  }`}>
                    {status === 'passed' ? <CheckCircle className="h-4 w-4" /> :
                     status === 'failed' ? <AlertCircle className="h-4 w-4" /> :
                     status === 'running' ? <Activity className="h-4 w-4" /> :
                     <Zap className="h-4 w-4" />}
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
                    disabled={!design?.verilog || status === 'running'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                  {status === 'failed' && advice && (
                    <Button
                      onClick={handleReflexionFix}
                      disabled={isReflexionRunning}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                    >
                      {isReflexionRunning ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Applying AI Fix...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Apply Advice & Regenerate HDL
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {status === 'running' && (
                <Progress value={75} className="mt-3" />
              )}
            </CardContent>
          </Card>

          {/* Simulation Results */}
          {simulationResult && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Simulation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                  {simulationResult.errors && simulationResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-400">Errors:</h4>
                      <ul className="space-y-1">
                        {simulationResult.errors.map((error: string, idx: number) => (
                          <li key={idx} className="text-sm text-red-300">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {simulationResult.warnings && simulationResult.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-yellow-400">Warnings:</h4>
                      <ul className="space-y-1">
                        {simulationResult.warnings.map((warning: string, idx: number) => (
                          <li key={idx} className="text-sm text-yellow-300">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Advice */}
          {advice && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  AI Improvement Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded p-4">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">
                    {advice}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current HDL Code */}
          {design?.verilog && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  Current HDL Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded p-4 overflow-auto max-h-96">
                  <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                    {design.verilog}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SimulationErrorBoundary>
  );
}
