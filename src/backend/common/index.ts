// Shared data formats and utilities for chip design toolchain
// This module provides common interfaces, types, and utility functions

import type { 
  HDLGenerationResult, 
  SimulationResult, 
  SynthesisResult, 
  PlaceRouteResult,
  LayoutData,
  Result,
  Logger
} from '../../types/backend';

// Abstract Syntax Tree (AST) types
export interface ASTNode {
  type: string;
  location: SourceLocation;
  children?: ASTNode[];
  value?: string | number | boolean | Record<string, unknown>;
}

export interface SourceLocation {
  line: number;
  column: number;
  file: string;
}

// Intermediate Representation (IR) types
export interface IRModule {
  name: string;
  ports: IRPort[];
  signals: IRSignal[];
  processes: IRProcess[];
  instances: IRInstance[];
}

export interface IRPort {
  name: string;
  direction: 'input' | 'output' | 'inout';
  type: IRType;
  width: number;
}

export interface IRSignal {
  name: string;
  type: IRType;
  width: number;
  initialValue?: string | number | boolean;
}

export interface IRProcess {
  name: string;
  sensitivity: string[];
  statements: IRStatement[];
}

export interface IRStatement {
  type: 'assignment' | 'if' | 'case' | 'for' | 'while';
  location: SourceLocation;
  value?: string | number | boolean | Record<string, unknown>;
}

export interface IRInstance {
  name: string;
  module: string;
  connections: { [port: string]: string };
}

export interface IRType {
  kind: 'wire' | 'reg' | 'integer' | 'real' | 'parameter';
  width: number;
  signed: boolean;
}

// Netlist types
export interface Netlist {
  name: string;
  cells: NetlistCell[];
  nets: NetlistNet[];
  ports: NetlistPort[];
}

export interface NetlistCell {
  name: string;
  type: string;
  pins: { [pin: string]: string };
  properties: { [key: string]: string | number | boolean };
}

export interface NetlistNet {
  name: string;
  driver: string;
  loads: string[];
  properties: { [key: string]: string | number | boolean };
}

export interface NetlistPort {
  name: string;
  direction: 'input' | 'output' | 'inout';
  net: string;
}

// Utility functions
export class DesignUtils {
  static parseVerilog(code: string): ASTNode[] {
    // TODO: Implement Verilog parsing
    return [];
  }

  static generateIR(ast: ASTNode[]): IRModule {
    // TODO: Implement IR generation
    return {
      name: '',
      ports: [],
      signals: [],
      processes: [],
      instances: []
    };
  }

  static generateNetlist(ir: IRModule): Netlist {
    // TODO: Implement netlist generation
    return {
      name: '',
      cells: [],
      nets: [],
      ports: []
    };
  }

  static validateDesign(design: IRModule | Netlist): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    // TODO: Implement design validation
    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  }

  static calculateMetrics(design: IRModule | Netlist): {
    area: number;
    power: number;
    timing: number;
    coverage: number;
  } {
    // TODO: Implement metrics calculation
    return {
      area: 0,
      power: 0,
      timing: 0,
      coverage: 0
    };
  }
}

// Error handling
export class DesignError extends Error {
  constructor(
    message: string,
    public location?: SourceLocation,
    public severity: 'error' | 'warning' | 'info' = 'error'
  ) {
    super(message);
    this.name = 'DesignError';
  }
}

// Configuration types
export interface ToolchainConfig {
  hdlGen: {
    aiModel: string;
    maxTokens: number;
    temperature: number;
  };
  sim: {
    timeLimit: number;
    timeStep: number;
    maxSignals: number;
  };
  synth: {
    targetLibrary: string;
    optimizationLevel: 'area' | 'speed' | 'balanced';
    maxIterations: number;
  };
  placeRoute: {
    dieSize: { width: number; height: number };
    maxUtilization: number;
    routingLayers: number;
  };
  layout: {
    unit: number;
    precision: number;
    layers: { [name: string]: number };
  };
  reflexion: {
    iterationLimit: number;
    improvementThreshold: number;
    learningEnabled: boolean;
  };
}

// Default configuration
export const defaultConfig: ToolchainConfig = {
  hdlGen: {
    aiModel: 'gpt-4',
    maxTokens: 2048,
    temperature: 0.1
  },
  sim: {
    timeLimit: 1000,
    timeStep: 1,
    maxSignals: 100
  },
  synth: {
    targetLibrary: 'tsmc_28nm',
    optimizationLevel: 'balanced',
    maxIterations: 10
  },
  placeRoute: {
    dieSize: { width: 1000, height: 1000 },
    maxUtilization: 0.8,
    routingLayers: 6
  },
  layout: {
    unit: 1e-6,
    precision: 1e-9,
    layers: {
      'metal1': 1,
      'metal2': 2,
      'metal3': 3,
      'poly': 4,
      'diffusion': 5
    }
  },
  reflexion: {
    iterationLimit: 10,
    improvementThreshold: 0.05,
    learningEnabled: true
  }
};

// Export all types and utilities 