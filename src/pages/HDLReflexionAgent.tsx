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
import TopNav from "@/components/chipforge/TopNav";

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
    <>
      <TopNav />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 px-6 py-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-semibold">HDL Reflexion Agent</span>
            </div>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              AI-Powered
            </Badge>
          </div>
        </header>

        {/* Status Bar */}
        {state.isRunning && (
          <div className="bg-cyan-900/10 border-b border-cyan-800 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span className="text-sm font-medium">
                    Iteration {state.currentIteration}/5
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-700"></div>
                <span className="text-sm text-slate-400">
                  {state.currentStage}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={stopReflexion}
                className="text-red-400 hover:text-red-500 border-red-400"
              >
                Stop Process
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Panel - Input */}
          <div className="w-1/3 border-r border-slate-800 bg-slate-800/50">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-cyan-400" />
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
          <div className="flex-1 bg-slate-900">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-cyan-400" />
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
          <div className="w-1/3 border-l border-slate-800 bg-slate-800/50">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-cyan-400" />
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
    </>
  );
};

export default HDLReflexionAgent;