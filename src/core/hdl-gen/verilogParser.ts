// File: src/core/hdl-gen/verilogParser.ts

export interface SyntaxError {
  message: string;
  line: number;
  column?: number;
  severity: 'error' | 'warning';
  code?: string;
}

export interface ParsedModule {
  name: string;
  ports: Port[];
  signals: Signal[];
  alwaysBlocks: AlwaysBlock[];
  assignStatements: AssignStatement[];
  parameters: Parameter[];
  errors: SyntaxError[];
  warnings: SyntaxError[];
}

export interface Port {
  name: string;
  direction: 'input' | 'output' | 'inout';
  width: number;
  signed: boolean;
  line: number;
}

export interface Signal {
  name: string;
  type: 'wire' | 'reg';
  width: number;
  signed: boolean;
  line: number;
}

export interface AlwaysBlock {
  sensitivityList: string;
  body: string[];
  line: number;
}

export interface AssignStatement {
  target: string;
  expression: string;
  line: number;
}

export interface Parameter {
  name: string;
  value: string;
  line: number;
}

export function parseVerilog(code: string): ParsedModule {
  const lines = code.split('\n');
  const errors: SyntaxError[] = [];
  const warnings: SyntaxError[] = [];
  
  let insideModule = false;
  let moduleName = '';
  let currentModuleLine = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let insideAlways = false;
  let insideCase = false;
  let insideBegin = false;
  let beginDepth = 0;
  
  const ports: Port[] = [];
  const signals: Signal[] = [];
  const alwaysBlocks: AlwaysBlock[] = [];
  const assignStatements: AssignStatement[] = [];
  const parameters: Parameter[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const lineNumber = i + 1;

    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

    // Track bracket and parenthesis depth
    bracketDepth += (trimmed.match(/\[/g) || []).length;
    bracketDepth -= (trimmed.match(/\]/g) || []).length;
    parenDepth += (trimmed.match(/\(/g) || []).length;
    parenDepth -= (trimmed.match(/\)/g) || []).length;

    // Check for module declaration
    if (trimmed.startsWith('module')) {
      if (insideModule) {
        errors.push({
          message: 'Nested module declarations are not allowed.',
          line: lineNumber,
          severity: 'error',
          code: 'NESTED_MODULE'
        });
      }
      
      insideModule = true;
      currentModuleLine = lineNumber;
      
      // Extract module name
      const moduleMatch = trimmed.match(/module\s+(\w+)/);
      if (moduleMatch) {
        moduleName = moduleMatch[1];
      } else {
        errors.push({
          message: 'Invalid module declaration - missing module name.',
          line: lineNumber,
          severity: 'error',
          code: 'INVALID_MODULE_NAME'
        });
      }
      
      if (!trimmed.includes('(')) {
        errors.push({
          message: 'Module declaration missing port list opening parenthesis.',
          line: lineNumber,
          severity: 'error',
          code: 'MISSING_PORT_LIST'
        });
      }
    }

    // Check for endmodule
    if (trimmed === 'endmodule') {
      if (!insideModule) {
        errors.push({
          message: '"endmodule" found without corresponding "module".',
          line: lineNumber,
          severity: 'error',
          code: 'UNMATCHED_ENDMODULE'
        });
      }
      insideModule = false;
    }

    // Parse port declarations
    if (insideModule && (trimmed.includes('input') || trimmed.includes('output') || trimmed.includes('inout'))) {
      const port = parsePortDeclaration(trimmed, lineNumber);
      if (port) {
        ports.push(port);
      }
    }

    // Parse signal declarations
    if (insideModule && (trimmed.includes('wire') || trimmed.includes('reg'))) {
      const signal = parseSignalDeclaration(trimmed, lineNumber);
      if (signal) {
        signals.push(signal);
      }
    }

    // Parse parameter declarations
    if (insideModule && trimmed.includes('parameter')) {
      const param = parseParameterDeclaration(trimmed, lineNumber);
      if (param) {
        parameters.push(param);
      }
    }

    // Check assign statements
    if (trimmed.startsWith('assign')) {
      const assign = parseAssignStatement(trimmed, lineNumber);
      if (assign) {
        assignStatements.push(assign);
      }
      
      if (!trimmed.endsWith(';')) {
        errors.push({
          message: 'Missing semicolon at end of assign statement.',
          line: lineNumber,
          severity: 'error',
          code: 'MISSING_SEMICOLON'
        });
      }
      if (!trimmed.includes('=')) {
        errors.push({
          message: 'Assign statement missing "=".',
          line: lineNumber,
          severity: 'error',
          code: 'MISSING_ASSIGNMENT'
        });
      }
    }

    // Parse always blocks
    if (trimmed.startsWith('always')) {
      insideAlways = true;
      const alwaysBlock = parseAlwaysBlock(trimmed, lines.slice(i), lineNumber);
      if (alwaysBlock) {
        alwaysBlocks.push(alwaysBlock);
      }
      
      if (!trimmed.includes('@') && !trimmed.includes('begin')) {
        errors.push({
          message: 'Always block missing sensitivity list or begin statement.',
          line: lineNumber,
          severity: 'error',
          code: 'INVALID_ALWAYS_BLOCK'
        });
      }
    }

    // Track begin/end blocks
    if (trimmed.includes('begin')) {
      insideBegin = true;
      beginDepth++;
    }
    if (trimmed.includes('end')) {
      beginDepth--;
      if (beginDepth === 0) {
        insideBegin = false;
      }
    }

    // Track case statements
    if (trimmed.includes('case')) {
      insideCase = true;
    }
    if (trimmed.includes('endcase')) {
      insideCase = false;
    }

    // Check for common syntax issues
    if (trimmed.includes(';') && !trimmed.startsWith('//')) {
      // Check for missing semicolons in declarations
      if ((trimmed.includes('wire') || trimmed.includes('reg')) && !trimmed.endsWith(';')) {
        errors.push({
          message: 'Signal declaration missing semicolon.',
          line: lineNumber,
          severity: 'error',
          code: 'MISSING_SEMICOLON'
        });
      }
    }

    // Check for potential issues
    if (trimmed.includes('always') && trimmed.includes('*')) {
      warnings.push({
        message: 'Consider using explicit sensitivity list instead of always @(*).',
        line: lineNumber,
        severity: 'warning',
        code: 'IMPLICIT_SENSITIVITY'
      });
    }
  });

  // Final checks
  if (insideModule) {
    errors.push({
      message: 'Missing "endmodule" for open module.',
      line: lines.length,
      severity: 'error',
      code: 'MISSING_ENDMODULE'
    });
  }

  if (bracketDepth !== 0) {
    errors.push({
      message: `Unmatched brackets: ${bracketDepth > 0 ? 'missing' : 'extra'} closing bracket(s).`,
      line: lines.length,
      severity: 'error',
      code: 'UNMATCHED_BRACKETS'
    });
  }

  if (parenDepth !== 0) {
    errors.push({
      message: `Unmatched parentheses: ${parenDepth > 0 ? 'missing' : 'extra'} closing parenthesis(es).`,
      line: lines.length,
      severity: 'error',
      code: 'UNMATCHED_PARENTHESES'
    });
  }

  if (beginDepth !== 0) {
    errors.push({
      message: `Unmatched begin/end blocks: ${beginDepth > 0 ? 'missing' : 'extra'} end statement(s).`,
      line: lines.length,
      severity: 'error',
      code: 'UNMATCHED_BEGIN_END'
    });
  }

  if (insideCase) {
    errors.push({
      message: 'Missing "endcase" for open case statement.',
      line: lines.length,
      severity: 'error',
      code: 'MISSING_ENDCASE'
    });
  }

  return {
    name: moduleName,
    ports,
    signals,
    alwaysBlocks,
    assignStatements,
    parameters,
    errors,
    warnings
  };
}

function parsePortDeclaration(line: string, lineNumber: number): Port | null {
  const portMatch = line.match(/(input|output|inout)\s+(?:signed\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/);
  if (portMatch) {
    return {
      direction: portMatch[1] as 'input' | 'output' | 'inout',
      width: portMatch[2] ? parseInt(portMatch[2]) - parseInt(portMatch[3]) + 1 : 1,
      signed: line.includes('signed'),
      name: portMatch[4],
      line: lineNumber
    };
  }
  return null;
}

function parseSignalDeclaration(line: string, lineNumber: number): Signal | null {
  const signalMatch = line.match(/(wire|reg)\s+(?:signed\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/);
  if (signalMatch) {
    return {
      type: signalMatch[1] as 'wire' | 'reg',
      width: signalMatch[2] ? parseInt(signalMatch[2]) - parseInt(signalMatch[3]) + 1 : 1,
      signed: line.includes('signed'),
      name: signalMatch[4],
      line: lineNumber
    };
  }
  return null;
}

function parseParameterDeclaration(line: string, lineNumber: number): Parameter | null {
  const paramMatch = line.match(/parameter\s+(\w+)\s*=\s*(.+?);/);
  if (paramMatch) {
    return {
      name: paramMatch[1],
      value: paramMatch[2].trim(),
      line: lineNumber
    };
  }
  return null;
}

function parseAssignStatement(line: string, lineNumber: number): AssignStatement | null {
  const assignMatch = line.match(/assign\s+(\w+)\s*=\s*(.+?);/);
  if (assignMatch) {
    return {
      target: assignMatch[1],
      expression: assignMatch[2].trim(),
      line: lineNumber
    };
  }
  return null;
}

function parseAlwaysBlock(line: string, remainingLines: string[], startLine: number): AlwaysBlock | null {
  const sensitivityMatch = line.match(/always\s+@\s*\((.+?)\)/);
  const sensitivityList = sensitivityMatch ? sensitivityMatch[1] : '';
  
  const body: string[] = [];
  let foundEnd = false;
  
  for (let i = 0; i < remainingLines.length && !foundEnd; i++) {
    const currentLine = remainingLines[i].trim();
    if (currentLine === 'end') {
      foundEnd = true;
    } else if (currentLine && !currentLine.startsWith('//')) {
      body.push(currentLine);
    }
  }
  
  return {
    sensitivityList,
    body,
    line: startLine
  };
}

// Export a simplified version for backward compatibility
export function parseVerilogSimple(code: string): SyntaxError[] {
  const parsed = parseVerilog(code);
  return [...parsed.errors, ...parsed.warnings];
} 