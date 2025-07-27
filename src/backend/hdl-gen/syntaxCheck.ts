// File: src/backend/hdl-gen/syntaxCheck.ts

import { parseVerilog, type SyntaxError as CoreSyntaxError } from '@/core/hdl-gen/verilogParser';

export interface SyntaxError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  code?: string;
}

export interface SyntaxCheckResult {
  errors: SyntaxError[];
  warnings: SyntaxError[];
  isValid: boolean;
  moduleInfo?: {
    name: string;
    portCount: number;
    signalCount: number;
    alwaysBlockCount: number;
    assignCount: number;
  };
}

export function checkVerilogSyntax(code: string): SyntaxCheckResult {
  // Use the core parser for comprehensive analysis
  const parsed = parseVerilog(code);
  
  // Convert core syntax errors to our format
  const errors: SyntaxError[] = parsed.errors.map(err => ({
    line: err.line,
    column: err.column || 1,
    message: err.message,
    severity: err.severity,
    code: err.code
  }));
  
  const warnings: SyntaxError[] = parsed.warnings.map(warn => ({
    line: warn.line,
    column: warn.column || 1,
    message: warn.message,
    severity: warn.severity,
    code: warn.code
  }));
  
  // Add additional checks that the core parser might not cover
  const additionalChecks = performAdditionalChecks(code);
  errors.push(...additionalChecks.errors);
  warnings.push(...additionalChecks.warnings);
  
  // Extract module information for analysis
  const moduleInfo = parsed.name ? {
    name: parsed.name,
    portCount: parsed.ports.length,
    signalCount: parsed.signals.length,
    alwaysBlockCount: parsed.alwaysBlocks.length,
    assignCount: parsed.assignStatements.length
  } : undefined;
  
  return {
    errors,
    warnings,
    isValid: errors.length === 0,
    moduleInfo
  };
}

function performAdditionalChecks(code: string): { errors: SyntaxError[]; warnings: SyntaxError[] } {
  const errors: SyntaxError[] = [];
  const warnings: SyntaxError[] = [];
  const lines = code.split('\n');
  
  lines.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    const trimmedLine = line.trim();
    
    // Skip comments and empty lines
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      return;
    }
    
    // Check for potential combinational loops
    if (trimmedLine.includes('assign') && trimmedLine.includes('=')) {
      const assignMatch = trimmedLine.match(/assign\s+(\w+)\s*=/);
      if (assignMatch) {
        const signalName = assignMatch[1];
        if (trimmedLine.includes(signalName) && trimmedLine.indexOf(signalName) !== trimmedLine.indexOf('assign')) {
          warnings.push({
            line: lineNumber,
            column: line.indexOf('assign') + 1,
            message: `Potential combinational loop: ${signalName} assigned to itself`,
            severity: 'warning',
            code: 'COMBINATIONAL_LOOP'
          });
        }
      }
    }
    
    // Check for proper port declarations
    if (trimmedLine.includes('input') || trimmedLine.includes('output')) {
      if (!trimmedLine.includes(';') && !trimmedLine.includes(',')) {
        errors.push({
          line: lineNumber,
          column: 1,
          message: 'Port declaration missing semicolon or comma',
          severity: 'error',
          code: 'INVALID_PORT_DECLARATION'
        });
      }
    }
    
    // Check for proper signal declarations
    if (trimmedLine.includes('reg') || trimmedLine.includes('wire')) {
      if (!trimmedLine.includes(';')) {
        errors.push({
          line: lineNumber,
          column: 1,
          message: 'Signal declaration missing semicolon',
          severity: 'error',
          code: 'MISSING_SEMICOLON'
        });
      }
    }
    
    // Check for proper parameter declarations
    if (trimmedLine.includes('parameter') && !trimmedLine.includes(';')) {
      errors.push({
        line: lineNumber,
        column: line.indexOf('parameter') + 1,
        message: 'Parameter declaration missing semicolon',
        severity: 'error',
        code: 'MISSING_SEMICOLON'
      });
    }
    
    // Check for proper localparam declarations
    if (trimmedLine.includes('localparam') && !trimmedLine.includes(';')) {
      errors.push({
        line: lineNumber,
        column: line.indexOf('localparam') + 1,
        message: 'Localparam declaration missing semicolon',
        severity: 'error',
        code: 'MISSING_SEMICOLON'
      });
    }
    
    // Check for potential timing issues
    if (trimmedLine.includes('always') && trimmedLine.includes('*')) {
      warnings.push({
        line: lineNumber,
        column: line.indexOf('always') + 1,
        message: 'Consider using explicit sensitivity list instead of always @(*)',
        severity: 'warning',
        code: 'IMPLICIT_SENSITIVITY'
      });
    }
    
    // Check for potential latch inference
    if (trimmedLine.includes('always') && !trimmedLine.includes('@')) {
      warnings.push({
        line: lineNumber,
        column: line.indexOf('always') + 1,
        message: 'Always block missing sensitivity list - may infer latches',
        severity: 'warning',
        code: 'POTENTIAL_LATCH'
      });
    }
    
    // Check for proper case statement formatting
    if (trimmedLine.includes('case') && !trimmedLine.includes('endcase')) {
      const remainingCode = lines.slice(lineIndex).join('\n');
      if (!remainingCode.includes('endcase')) {
        errors.push({
          line: lineNumber,
          column: line.indexOf('case') + 1,
          message: 'Case statement missing endcase',
          severity: 'error',
          code: 'MISSING_ENDCASE'
        });
      }
    }
    
    // Check for proper begin/end blocks
    if (trimmedLine.includes('begin') && !trimmedLine.includes('end')) {
      const remainingCode = lines.slice(lineIndex).join('\n');
      const beginCount = (remainingCode.match(/begin/g) || []).length;
      const endCount = (remainingCode.match(/end/g) || []).length;
      if (beginCount > endCount) {
        errors.push({
          line: lineNumber,
          column: line.indexOf('begin') + 1,
          message: 'Missing "end" for "begin" block',
          severity: 'error',
          code: 'MISSING_END'
        });
      }
    }
  });
  
  return { errors, warnings };
}

// Async version for API compatibility
export async function checkVerilogSyntaxAsync(code: string): Promise<SyntaxCheckResult> {
  // Simulate async processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  return checkVerilogSyntax(code);
} 