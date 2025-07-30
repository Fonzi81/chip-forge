import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopNav from "../components/chipforge/TopNav";

// Error boundary component
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
    console.error('Simulation error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <TopNav />
          <div className="container mx-auto p-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Simulation Error</CardTitle>
                <CardDescription>An error occurred during simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
                <Button onClick={() => this.setState({ hasError: false })}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ChipForgeSimulation() {
  return (
    <SimulationErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <TopNav />
        
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">ChipForge Simulation</h1>
            <p className="text-slate-400">Professional HDL simulation and testing environment</p>
          </div>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>Simulation Environment</CardTitle>
              <CardDescription>This is a placeholder for the simulation interface</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                The simulation environment is being developed. Please use the integrated workspace for now.
              </p>
              <Button asChild>
                <a href="/workspace">Go to Workspace</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimulationErrorBoundary>
  );
} 