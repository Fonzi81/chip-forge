import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReflexion } from "@/hooks/useReflexion";
import ReflexionInput from "@/components/reflexion/ReflexionInput";
import ReflexionLoop from "@/components/reflexion/ReflexionLoop";
import ReflexionResults from "@/components/reflexion/ReflexionResults";

const HDLReflexionAgent = () => {
  const navigate = useNavigate();
  const {
    state,
    startReflexion,
    stopReflexion,
    resetReflexion,
  } = useReflexion();

  const handleStartReflexion = (description: string, testbench: string) => {
    startReflexion(description, testbench);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">HDL Reflexion Agent</span>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            AI-Powered
          </Badge>
        </div>
      </header>

      {/* Status Bar */}
      {state.isRunning && (
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">
                  Iteration {state.currentIteration}/5
                </span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <span className="text-sm text-muted-foreground">
                {state.currentStage}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={stopReflexion}
              className="text-destructive hover:text-destructive"
            >
              Stop Process
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Input */}
        <div className="w-1/3 border-r border-border bg-card/20">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Input Configuration</h2>
            </div>
            <ReflexionInput
              onStartReflexion={handleStartReflexion}
              isRunning={state.isRunning}
              onReset={resetReflexion}
            />
          </div>
        </div>

        {/* Center Panel - Reflexion Loop */}
        <div className="flex-1 bg-background">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Reflexion Process</h2>
            </div>
            <ReflexionLoop
              iterations={state.iterations}
              currentIteration={state.currentIteration}
              isRunning={state.isRunning}
              currentStage={state.currentStage}
            />
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="w-1/3 border-l border-border bg-card/20">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Results & Metrics</h2>
            </div>
            <ReflexionResults
              finalCode={state.finalCode}
              metrics={state.metrics}
              iterations={state.iterations}
              isComplete={state.isComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HDLReflexionAgent;