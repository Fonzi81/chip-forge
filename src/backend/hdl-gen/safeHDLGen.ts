// Enhanced safe HDL generation with comprehensive validation and security
// This module provides robust, secure HDL code generation with multiple safety layers

import { callLLMHDLGenerator } from './llmHDLGen';

export interface SafeHDLConfig {
  maxRetries: number;
  validationLevel: 'basic' | 'strict' | 'comprehensive';
  securityChecks: boolean;
  timeoutMs: number;
  maxCodeSize: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  securityIssues: string[];
  complexity: {
    lines: number;
    modules: number;
    signals: number;
    estimatedGates: number;
  };
}

export interface SafeHDLResult {
  code: string;
  validation: ValidationResult;
  metadata: {
    generationTime: number;
    attempts: number;
    moduleName: string;
    language: 'verilog' | 'vhdl' | 'systemverilog';
    timestamp: string;
  };
}

// Default configuration
const DEFAULT_CONFIG: SafeHDLConfig = {
  maxRetries: 3,
  validationLevel: 'strict',
  securityChecks: true,
  timeoutMs: 30000,
  maxCodeSize: 10000
};

// Enhanced syntax validation with comprehensive checks
function validateSyntax(code: string, level: 'basic' | 'strict' | 'comprehensive'): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const securityIssues: string[] = [];

  // Basic validation
  if (!code || code.trim().length === 0) {
    errors.push('Empty code provided');
    return { isValid: false, errors, warnings, suggestions, securityIssues, complexity: { lines: 0, modules: 0, signals: 0, estimatedGates: 0 } };
  }

  // Check for basic Verilog structure
  if (!code.includes('module')) {
    errors.push('Missing module declaration');
  }

  if (!code.includes('endmodule')) {
    errors.push('Missing endmodule statement');
  }

  // Check for balanced brackets and braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Unbalanced braces detected');
  }

  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push('Unbalanced brackets detected');
  }

  // Check for proper module declaration
  const moduleMatch = code.match(/module\s+(\w+)\s*\(/);
  if (!moduleMatch) {
    errors.push('Invalid module declaration');
  }

  // Strict validation
  if (level === 'strict' || level === 'comprehensive') {
    // Check for common syntax errors
    if (code.includes('always') && !code.includes('@')) {
      errors.push('Always block missing sensitivity list');
    }

    if (code.includes('case') && !code.includes('endcase')) {
      errors.push('Case statement not properly closed');
    }

    if (code.includes('if') && !code.includes('else') && code.includes('begin')) {
      warnings.push('Consider adding else clause for better coverage');
    }

    // Check for proper signal declarations
    const inputMatches = code.match(/input\s+(?:reg\s+)?(?:wire\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/g);
    const outputMatches = code.match(/output\s+(?:reg\s+)?(?:wire\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/g);
    
    if (!inputMatches || inputMatches.length === 0) {
      warnings.push('No input ports detected');
    }

    if (!outputMatches || outputMatches.length === 0) {
      warnings.push('No output ports detected');
    }

    // Check for proper clock and reset handling
    if (code.includes('always @(posedge') || code.includes('always @(negedge')) {
      if (!code.includes('reset') && !code.includes('rst')) {
        warnings.push('Sequential logic detected without reset signal');
      }
    }
  }

  // Comprehensive validation
  if (level === 'comprehensive') {
    // Check for potential race conditions
    if (code.includes('always @(*)') && code.includes('always @(posedge')) {
      warnings.push('Mixed combinational and sequential logic - check for race conditions');
    }

    // Check for proper parameter usage
    if (code.includes('parameter') && !code.includes('localparam')) {
      suggestions.push('Consider using localparam for internal constants');
    }

    // Check for proper signal naming conventions
    const signalMatches = code.match(/\b(?:reg|wire)\s+(\w+)/g);
    if (signalMatches) {
      signalMatches.forEach(match => {
        const signalName = match.split(/\s+/)[1];
        if (signalName && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(signalName)) {
          warnings.push(`Signal name '${signalName}' may not follow naming conventions`);
        }
      });
    }
  }

  // Security checks
  if (code.includes('$system') || code.includes('$display') || code.includes('$write')) {
    securityIssues.push('System tasks detected - potential security risk');
  }

  if (code.includes('$random') || code.includes('$urandom')) {
    warnings.push('Random functions detected - may cause non-deterministic behavior');
  }

  // Calculate complexity metrics
  const lines = code.split('\n').length;
  const modules = (code.match(/module\s+\w+/g) || []).length;
  const signals = (code.match(/\b(?:reg|wire)\s+\w+/g) || []).length;
  const estimatedGates = Math.max(10, lines * 2); // Rough estimation

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
    securityIssues,
    complexity: { lines, modules, signals, estimatedGates }
  };
}

// Security validation
function validateSecurity(code: string): string[] {
  const securityIssues: string[] = [];

  // Check for potentially dangerous constructs
  const dangerousPatterns = [
    /\$system\s*\(/,
    /\$display\s*\(/,
    /\$write\s*\(/,
    /\$fopen\s*\(/,
    /\$fclose\s*\(/,
    /\$readmem\s*\(/,
    /\$writemem\s*\(/,
    /force\s+/,
    /release\s+/,
    /deposit\s+/
  ];

  dangerousPatterns.forEach(pattern => {
    if (pattern.test(code)) {
      securityIssues.push(`Potentially dangerous construct detected: ${pattern.source}`);
    }
  });

  // Check for infinite loops
  if (code.includes('forever') && !code.includes('$finish')) {
    securityIssues.push('Infinite loop detected without termination condition');
  }

  // Check for large arrays that might cause memory issues
  const arrayMatches = code.match(/\[(\d+):(\d+)\]/g);
  if (arrayMatches) {
    arrayMatches.forEach(match => {
      const sizeMatch = match.match(/\[(\d+):(\d+)\]/);
      if (sizeMatch) {
        const size = Math.abs(parseInt(sizeMatch[1]) - parseInt(sizeMatch[2])) + 1;
        if (size > 1000000) {
          securityIssues.push(`Large array detected (${size} elements) - may cause memory issues`);
        }
      }
    });
  }

  return securityIssues;
}

// Performance validation
function validatePerformance(code: string): string[] {
  const warnings: string[] = [];

  // Check for potential performance issues
  if (code.includes('always @(*)') && code.includes('case')) {
    warnings.push('Large combinational logic detected - consider pipelining');
  }

  if (code.includes('for') && code.includes('generate')) {
    warnings.push('Generate loops detected - may impact synthesis time');
  }

  // Check for deep nesting
  const nestingLevel = (code.match(/begin/g) || []).length;
  if (nestingLevel > 10) {
    warnings.push('Deep nesting detected - consider refactoring for better readability');
  }

  return warnings;
}

// Enhanced safe HDL generation with comprehensive validation
export async function generateSafeHDL(
  description: string,
  config: Partial<SafeHDLConfig> = {}
): Promise<SafeHDLResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  let attempts = 0;
  let bestResult: SafeHDLResult | null = null;

  // Input validation
  if (!description || description.trim().length === 0) {
    throw new Error('Description cannot be empty');
  }

  if (description.length > 1000) {
    throw new Error('Description too long (max 1000 characters)');
  }

  // Security check for description
  const dangerousKeywords = ['system', 'exec', 'eval', 'script', 'javascript'];
  if (dangerousKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
    throw new Error('Description contains potentially dangerous keywords');
  }

  for (attempts = 0; attempts < finalConfig.maxRetries; attempts++) {
    try {
      // Set timeout for generation
      const generationPromise = callLLMHDLGenerator(description, '');
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Generation timeout')), finalConfig.timeoutMs)
      );

      const code = await Promise.race([generationPromise, timeoutPromise]);

      // Validate generated code
      const validation = validateSyntax(code, finalConfig.validationLevel);
      
      if (finalConfig.securityChecks) {
        const securityIssues = validateSecurity(code);
        validation.securityIssues.push(...securityIssues);
      }

      // Add performance warnings
      const performanceWarnings = validatePerformance(code);
      validation.warnings.push(...performanceWarnings);

      // Check code size
      if (code.length > finalConfig.maxCodeSize) {
        validation.errors.push(`Generated code too large (${code.length} characters, max ${finalConfig.maxCodeSize})`);
      }

      // If validation passes, return result
      if (validation.isValid && validation.securityIssues.length === 0) {
        const moduleName = code.match(/module\s+(\w+)/)?.[1] || 'generated_module';
        
        return {
          code,
          validation,
          metadata: {
            generationTime: Date.now() - startTime,
            attempts: attempts + 1,
            moduleName,
            language: 'verilog',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Keep track of best result so far
      if (!bestResult || validation.errors.length < bestResult.validation.errors.length) {
        const moduleName = code.match(/module\s+(\w+)/)?.[1] || 'generated_module';
        bestResult = {
          code,
          validation,
          metadata: {
            generationTime: Date.now() - startTime,
            attempts: attempts + 1,
            moduleName,
            language: 'verilog',
            timestamp: new Date().toISOString()
          }
        };
      }

    } catch (error) {
      console.warn(`Generation attempt ${attempts + 1} failed:`, error);
      
      // If it's the last attempt, throw the error
      if (attempts === finalConfig.maxRetries - 1) {
        throw new Error(`HDL generation failed after ${finalConfig.maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // If we have a best result, return it with warnings
  if (bestResult) {
    bestResult.validation.warnings.push(`Generated code has validation issues after ${attempts} attempts`);
    return bestResult;
  }

  // Fallback to error template
  const errorCode = `// ERROR: Failed to generate valid HDL after ${attempts} attempts
// Description: ${description}
// Generated at: ${new Date().toISOString()}

module error_module (
    input wire clk,
    input wire reset,
    output wire error_flag
);

    // Error indicator
    assign error_flag = 1'b1;
    
    // Add your manual implementation here
    
endmodule`;

  return {
    code: errorCode,
    validation: {
      isValid: false,
      errors: [`Failed to generate valid HDL after ${attempts} attempts`],
      warnings: ['Using fallback error template'],
      suggestions: ['Please check your description and try again', 'Consider providing more specific requirements'],
      securityIssues: [],
      complexity: { lines: 10, modules: 1, signals: 3, estimatedGates: 5 }
    },
    metadata: {
      generationTime: Date.now() - startTime,
      attempts,
      moduleName: 'error_module',
      language: 'verilog',
      timestamp: new Date().toISOString()
    }
  };
}

// Quick generation function for backward compatibility
export async function generateSafeHDLQuick(description: string): Promise<string> {
  const result = await generateSafeHDL(description, { 
    maxRetries: 2, 
    validationLevel: 'basic',
    securityChecks: false 
  });
  return result.code;
}

// Comprehensive generation with full validation
export async function generateSafeHDLComprehensive(
  description: string,
  config: Partial<SafeHDLConfig> = {}
): Promise<SafeHDLResult> {
  return generateSafeHDL(description, {
    ...config,
    validationLevel: 'comprehensive',
    securityChecks: true,
    maxRetries: 5
  });
}

// Generation with specific constraints
export async function generateSafeHDLWithConstraints(
  description: string,
  constraints: {
    maxGates?: number;
    maxSignals?: number;
    maxLines?: number;
    requireReset?: boolean;
    requireClock?: boolean;
  },
  config: Partial<SafeHDLConfig> = {}
): Promise<SafeHDLResult> {
  const result = await generateSafeHDL(description, config);
  
  // Apply additional constraint validation
  const constraintWarnings: string[] = [];
  
  if (constraints.maxGates && result.validation.complexity.estimatedGates > constraints.maxGates) {
    constraintWarnings.push(`Estimated gates (${result.validation.complexity.estimatedGates}) exceed limit (${constraints.maxGates})`);
  }
  
  if (constraints.maxSignals && result.validation.complexity.signals > constraints.maxSignals) {
    constraintWarnings.push(`Signal count (${result.validation.complexity.signals}) exceed limit (${constraints.maxSignals})`);
  }
  
  if (constraints.maxLines && result.validation.complexity.lines > constraints.maxLines) {
    constraintWarnings.push(`Line count (${result.validation.complexity.lines}) exceed limit (${constraints.maxLines})`);
  }
  
  if (constraints.requireReset && !result.code.includes('reset')) {
    constraintWarnings.push('Reset signal required but not detected');
  }
  
  if (constraints.requireClock && !result.code.includes('clk')) {
    constraintWarnings.push('Clock signal required but not detected');
  }
  
  result.validation.warnings.push(...constraintWarnings);
  
  return result;
} 