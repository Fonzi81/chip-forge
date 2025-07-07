export interface DesignFile {
  id: string;
  name: string;
  type: 'verilog' | 'testbench' | 'constraint';
  hasErrors: boolean;
  path: string;
  content: string;
}

export interface AISuggestion {
  id: string;
  type: 'optimization' | 'completion' | 'fix' | 'explanation';
  title: string;
  description: string;
  code?: string;
  confidence: number;
  line?: number;
}

export interface DesignMetrics {
  linesOfCode: number;
  estimatedGates: number;
  complexityScore: number;
  version: string;
  lastModified: Date;
}

export type CompileStatus = 'idle' | 'compiling' | 'success' | 'error';

// Simulation types
export interface SimulationConfig {
  clockFreq: string;
  simulationTime: string;
  inputVectors: string;
  hdlCode: string;
}

export interface SimulationProgress {
  stage: 'idle' | 'compiling' | 'running' | 'processing' | 'complete';
  progress: number;
  message: string;
}

export interface WaveformTrace {
  name: string;
  type: 'clock' | 'bus' | 'signal';
  width?: number;
  values: string[];
  transitions?: Array<{ time: number; value: string }>;
}

export interface WaveformData {
  signals: string[];
  timeScale: string;
  duration: number;
  traces: WaveformTrace[];
}

export interface SimulationResult {
  id: string;
  status: 'success' | 'error' | 'timeout';
  waveformData?: WaveformData;
  logs: string[];
  metrics?: {
    duration: string;
    gateCount: number;
    assertions: { passed: number; failed: number };
  };
  error?: string;
}

// File types for workspace
export interface HDLFile {
  id: string;
  name: string;
  type: 'verilog' | 'vhdl' | 'systemverilog' | 'testbench' | 'constraint';
  content: string;
  hasErrors: boolean;
  path: string;
  failedLines?: number[];
}

// Code editor types
export interface CodeError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// Reflexion types
export interface ReflexionIteration {
  id: string;
  iteration: number;
  generatedCode: string;
  testResult: {
    passed: boolean;
    errors: string[];
    output: string;
  };
  reviewerFeedback?: string;
  timestamp: Date;
  tokensUsed: number;
}

export interface ReflexionMetrics {
  totalIterations: number;
  passAt1: boolean;
  passAt3: boolean;
  passAt5: boolean;
  totalTokensUsed: number;
  totalTime: number;
  finalSuccess: boolean;
}

export interface ReflexionState {
  isRunning: boolean;
  currentIteration: number;
  currentStage: 'idle' | 'generating' | 'testing' | 'reviewing' | 'complete' | 'failed';
  iterations: ReflexionIteration[];
  finalCode: string | null;
  metrics: ReflexionMetrics | null;
  isComplete: boolean;
  error: string | null;
}