// Backend Type Definitions
// This file contains all shared types used across backend operations

// ============================================================================
// HDL Generation Types
// ============================================================================

export interface HDLGenerationResult {
  code: string;
  warnings: string[];
  errors: string[];
  metadata: {
    moduleName: string;
    portCount: number;
    complexity: number;
    estimatedGates: number;
  };
}

export interface HDLGenerationRequest {
  description: string;
  language: 'verilog' | 'vhdl' | 'systemverilog';
  target: 'fpga' | 'asic' | 'simulation';
  constraints?: {
    maxGates?: number;
    maxFrequency?: number;
    powerBudget?: number;
  };
}

export interface LLMHDLGenerationResult extends HDLGenerationResult {
  aiModel: string;
  promptTokens: number;
  completionTokens: number;
  confidence: number;
}

// ============================================================================
// Simulation Types
// ============================================================================

export interface SimulationResult {
  success: boolean;
  waveforms: WaveformData[];
  testResults: TestResult[];
  executionTime: number;
  memoryUsage: number;
  warnings: string[];
  errors: string[];
}

export interface WaveformData {
  signalName: string;
  values: Array<{
    time: number;
    value: string | number | boolean;
  }>;
  type: 'wire' | 'reg' | 'input' | 'output';
  width: number;
}

export interface TestResult {
  testName: string;
  passed: boolean;
  expectedValue: string | number | boolean;
  actualValue: string | number | boolean;
  message?: string;
}

export interface SimulationConfig {
  timeUnit: 'ps' | 'ns' | 'us' | 'ms';
  timeScale: number;
  maxTime: number;
  testVectors: TestVector[];
}

export interface TestVector {
  name: string;
  inputs: Record<string, string | number | boolean>;
  expectedOutputs: Record<string, string | number | boolean>;
}

// ============================================================================
// Layout & Physical Design Types
// ============================================================================

export interface LayoutData {
  cells: Cell[];
  wires: Wire[];
  dimensions: {
    width: number;
    height: number;
    layers: number;
  };
  technology: {
    node: string;
    metalLayers: number;
    minFeature: number;
  };
}

export interface Cell {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    layer: number;
  };
  size: {
    width: number;
    height: number;
  };
  ports: Port[];
  properties: Record<string, string | number | boolean>;
}

export interface Wire {
  id: string;
  netName: string;
  path: Array<{
    x: number;
    y: number;
    layer: number;
  }>;
  width: number;
  layer: number;
}

export interface Port {
  name: string;
  direction: 'input' | 'output' | 'inout';
  position: {
    x: number;
    y: number;
  };
  width: number;
}

// ============================================================================
// Place & Route Types
// ============================================================================

export interface PlaceRouteResult {
  layout: LayoutData;
  statistics: PlaceRouteStats;
  timing: TimingAnalysis;
  congestion: CongestionAnalysis;
  power: PowerAnalysis;
  warnings: string[];
  errors: string[];
}

export interface PlaceRouteStats {
  totalCells: number;
  totalWires: number;
  totalLength: number;
  utilization: number;
  routingLayers: number;
}

export interface TimingAnalysis {
  criticalPath: {
    delay: number;
    path: string[];
  };
  maxFrequency: number;
  setupViolations: TimingViolation[];
  holdViolations: TimingViolation[];
  slack: Record<string, number>;
}

export interface TimingViolation {
  path: string;
  violation: number;
  type: 'setup' | 'hold';
  severity: 'warning' | 'error';
}

export interface CongestionAnalysis {
  hotspots: Array<{
    x: number;
    y: number;
    congestion: number;
  }>;
  maxCongestion: number;
  averageCongestion: number;
}

export interface PowerAnalysis {
  totalPower: number;
  dynamicPower: number;
  staticPower: number;
  powerByModule: Record<string, number>;
}

// ============================================================================
// Synthesis Types
// ============================================================================

export interface SynthesisResult {
  netlist: string;
  statistics: SynthesisStats;
  timing: TimingAnalysis;
  area: AreaAnalysis;
  power: PowerAnalysis;
  warnings: string[];
  errors: string[];
}

export interface SynthesisStats {
  gateCount: number;
  logicLevels: number;
  flipFlops: number;
  combinationalGates: number;
  sequentialGates: number;
}

export interface AreaAnalysis {
  totalArea: number;
  cellArea: number;
  routingArea: number;
  utilization: number;
  areaByModule: Record<string, number>;
}

// ============================================================================
// Testbench Types
// ============================================================================

export interface TestbenchResult {
  testbench: string;
  testResults: TestResult[];
  coverage: CoverageData;
  simulationTime: number;
  success: boolean;
}

export interface CoverageData {
  lineCoverage: number;
  branchCoverage: number;
  expressionCoverage: number;
  toggleCoverage: number;
  details: Record<string, number>;
}

export interface TestbenchConfig {
  language: 'verilog' | 'vhdl' | 'systemverilog';
  framework: 'basic' | 'uvm' | 'ovm' | 'vmm';
  testTypes: ('functional' | 'timing' | 'power')[];
  coverageEnabled: boolean;
}

// ============================================================================
// Reflexion Types
// ============================================================================

export interface ReflexionResult {
  suggestions: ReflexionSuggestion[];
  analysis: ReflexionAnalysis;
  confidence: number;
  reasoning: string;
}

export interface ReflexionSuggestion {
  type: 'optimization' | 'bugfix' | 'improvement' | 'refactor';
  description: string;
  code?: string;
  impact: 'low' | 'medium' | 'high';
  priority: number;
}

export interface ReflexionAnalysis {
  codeQuality: number;
  performance: number;
  maintainability: number;
  issues: string[];
  strengths: string[];
}

// ============================================================================
// Common Types
// ============================================================================

export interface ErrorResult {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export type Result<T> = SuccessResult<T> | ErrorResult;

export interface ProgressCallback {
  (progress: number, message: string): void;
}

export interface Logger {
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: Error): void;
  debug(message: string, data?: unknown): void;
} 