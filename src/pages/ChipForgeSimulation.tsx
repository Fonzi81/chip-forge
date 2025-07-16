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
import { HDLDesign } from '../utils/localStorage';
import TopNav from "../components/chipforge/TopNav";

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'failed' | 'passed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentDesign, setCurrentDesign] = useState<HDLDesign | null>(null);

  useEffect(() => {
    setStatus('loading');
    setError(null);
    try {
      const designs = JSON.parse(localStorage.getItem('hdlDesigns') || '[]');
      if (designs.length > 0) {
        const latestDesign = designs[designs.length - 1];
        setCurrentDesign(latestDesign);
      }
      setStatus('idle');
    } catch (err) {
      console.error('Failed to load design:', err);
      setError('Failed to load design from storage');
      setStatus('idle');
    }
  }, []);

  return (
    <SimulationErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <TopNav />
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
              {currentDesign && (
                <Badge variant="secondary">
                  {currentDesign.name}
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
                  <div className="text-slate-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">
                      Simulation module placeholder — ready for future logic.
                    </div>
                    <div className="text-sm text-slate-400">
                      Simulation status: {status}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimulationErrorBoundary>
  );
}
