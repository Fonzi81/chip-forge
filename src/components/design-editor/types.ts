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
  type: 'optimization' | 'completion';
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