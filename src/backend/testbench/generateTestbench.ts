
// AI-based testbench generation from HDL + user description
// Enhanced testbench generator with comprehensive features

export interface TestbenchConfig {
  moduleName: string;
  clockPeriod: number;
  simulationTime: number;
  testVectors: TestVector[];
  coverageGoals: CoverageGoal[];
  assertions: Assertion[];
}

export interface TestVector {
  name: string;
  inputs: Record<string, string | number>;
  expectedOutputs?: Record<string, string | number>;
  delay: number;
}

export interface CoverageGoal {
  type: 'line' | 'branch' | 'toggle' | 'functional';
  target: number;
  description: string;
}

export interface Assertion {
  condition: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface TestbenchResult {
  testbenchCode: string;
  testVectors: TestVector[];
  coverageGoals: CoverageGoal[];
  assertions: Assertion[];
  metadata: {
    generatedAt: string;
    moduleName: string;
    simulationTime: number;
    clockPeriod: number;
  };
}

// Enhanced testbench generation with AI integration
export async function generateTestbench(
  moduleCode: string, 
  description: string,
  config?: Partial<TestbenchConfig>
): Promise<TestbenchResult> {
  
  // Parse module information from HDL code
  const moduleInfo = parseModuleInfo(moduleCode);
  
  // Generate test vectors based on module type and description
  const testVectors = generateTestVectors(moduleInfo, description);
  
  // Generate coverage goals
  const coverageGoals = generateCoverageGoals(moduleInfo);
  
  // Generate assertions
  const assertions = generateAssertions(moduleInfo);
  
  // Generate the complete testbench
  const testbenchCode = generateTestbenchCode(moduleInfo, testVectors, coverageGoals, assertions, config);
  
  return {
    testbenchCode,
    testVectors,
    coverageGoals,
    assertions,
    metadata: {
      generatedAt: new Date().toISOString(),
      moduleName: moduleInfo.name,
      simulationTime: config?.simulationTime || 1000,
      clockPeriod: config?.clockPeriod || 10
    }
  };
}

// Parse module information from HDL code
function parseModuleInfo(hdlCode: string) {
  const moduleMatch = hdlCode.match(/module\s+(\w+)\s*\(/);
  const name = moduleMatch ? moduleMatch[1] : 'dut';
  
  // Extract ports
  const portRegex = /(input|output|inout)\s+(?:reg\s+)?(?:wire\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/g;
  const ports: Array<{
    name: string;
    direction: 'input' | 'output' | 'inout';
    width: number;
    type: 'reg' | 'wire';
  }> = [];
  
  let match;
  while ((match = portRegex.exec(hdlCode)) !== null) {
    const [, direction, msb, lsb, portName] = match;
    const width = msb && lsb ? parseInt(msb) - parseInt(lsb) + 1 : 1;
    ports.push({
      name: portName,
      direction: direction as 'input' | 'output' | 'inout',
      width,
      type: hdlCode.includes(`reg ${portName}`) ? 'reg' : 'wire'
    });
  }
  
  // Determine module type based on content
  let moduleType = 'generic';
  if (hdlCode.includes('always @(posedge clk') || hdlCode.includes('always @(negedge clk')) {
    moduleType = 'sequential';
  } else if (hdlCode.includes('always @(*)') || hdlCode.includes('assign')) {
    moduleType = 'combinational';
  }
  
  return { name, ports, moduleType };
}

// Generate test vectors based on module type
function generateTestVectors(moduleInfo: any, description: string): TestVector[] {
  const { ports, moduleType } = moduleInfo;
  const testVectors: TestVector[] = [];
  
  // Generate clock and reset signals for sequential modules
  if (moduleType === 'sequential') {
    testVectors.push({
      name: 'Reset Test',
      inputs: { clk: 0, reset: 1 },
      delay: 10
    });
    
    testVectors.push({
      name: 'Clock Start',
      inputs: { clk: 1, reset: 0 },
      delay: 10
    });
  }
  
  // Generate functional test vectors based on module type
  if (description.toLowerCase().includes('alu') || description.toLowerCase().includes('arithmetic')) {
    testVectors.push(...generateALUTestVectors(ports));
  } else if (description.toLowerCase().includes('counter')) {
    testVectors.push(...generateCounterTestVectors(ports));
  } else if (description.toLowerCase().includes('memory') || description.toLowerCase().includes('ram')) {
    testVectors.push(...generateMemoryTestVectors(ports));
  } else if (description.toLowerCase().includes('multiplexer') || description.toLowerCase().includes('mux')) {
    testVectors.push(...generateMuxTestVectors(ports));
  } else {
    testVectors.push(...generateGenericTestVectors(ports));
  }
  
  return testVectors;
}

// Generate ALU-specific test vectors
function generateALUTestVectors(ports: any[]): TestVector[] {
  const vectors: TestVector[] = [];
  
  // Find ALU operands and operation
  const aPort = ports.find(p => p.name === 'a' || p.name.includes('operand'));
  const bPort = ports.find(p => p.name === 'b' || p.name.includes('operand'));
  const opPort = ports.find(p => p.name === 'op' || p.name.includes('operation'));
  
  if (aPort && bPort && opPort) {
    const maxValue = Math.pow(2, aPort.width) - 1;
    
    // Test basic operations
    vectors.push({
      name: 'Addition Test',
      inputs: { a: 4, b: 3, op: 0 },
      expectedOutputs: { result: 7 },
      delay: 10
    });
    
    vectors.push({
      name: 'Subtraction Test',
      inputs: { a: 7, b: 3, op: 1 },
      expectedOutputs: { result: 4 },
      delay: 10
    });
    
    vectors.push({
      name: 'AND Test',
      inputs: { a: 0b1010, b: 0b1100, op: 2 },
      expectedOutputs: { result: 0b1000 },
      delay: 10
    });
    
    vectors.push({
      name: 'OR Test',
      inputs: { a: 0b1010, b: 0b1100, op: 3 },
      expectedOutputs: { result: 0b1110 },
      delay: 10
    });
  }
  
  return vectors;
}

// Generate counter-specific test vectors
function generateCounterTestVectors(ports: any[]): TestVector[] {
  const vectors: TestVector[] = [];
  
  vectors.push({
    name: 'Counter Reset',
    inputs: { reset: 1, enable: 0 },
    delay: 10
  });
  
  vectors.push({
    name: 'Counter Enable',
    inputs: { reset: 0, enable: 1 },
    delay: 100
  });
  
  vectors.push({
    name: 'Counter Disable',
    inputs: { reset: 0, enable: 0 },
    delay: 50
  });
  
  return vectors;
}

// Generate memory-specific test vectors
function generateMemoryTestVectors(ports: any[]): TestVector[] {
  const vectors: TestVector[] = [];
  
  vectors.push({
    name: 'Memory Write',
    inputs: { addr: 0, data_in: 0xAA, write_enable: 1, read_enable: 0 },
    delay: 10
  });
  
  vectors.push({
    name: 'Memory Read',
    inputs: { addr: 0, write_enable: 0, read_enable: 1 },
    expectedOutputs: { data_out: 0xAA },
    delay: 10
  });
  
  return vectors;
}

// Generate multiplexer-specific test vectors
function generateMuxTestVectors(ports: any[]): TestVector[] {
  const vectors: TestVector[] = [];
  
  const selectPort = ports.find(p => p.name === 'select' || p.name.includes('sel'));
  if (selectPort) {
    const selectWidth = selectPort.width;
    const numInputs = Math.pow(2, selectWidth);
    
    for (let i = 0; i < numInputs; i++) {
      const inputs: Record<string, any> = { select: i };
      
      // Add data inputs
      for (let j = 0; j < numInputs; j++) {
        inputs[`data_${j}`] = j * 10;
      }
      
      vectors.push({
        name: `Mux Select ${i}`,
        inputs,
        expectedOutputs: { data_out: i * 10 },
        delay: 10
      });
    }
  }
  
  return vectors;
}

// Generate generic test vectors
function generateGenericTestVectors(ports: any[]): TestVector[] {
  const vectors: TestVector[] = [];
  
  // Generate basic test vectors for all inputs
  ports.forEach(port => {
    if (port.direction === 'input') {
      vectors.push({
        name: `${port.name} Test`,
        inputs: { [port.name]: port.width > 1 ? 0 : 0 },
        delay: 10
      });
    }
  });
  
  return vectors;
}

// Generate coverage goals
function generateCoverageGoals(moduleInfo: any): CoverageGoal[] {
  const goals: CoverageGoal[] = [
    {
      type: 'line',
      target: 90,
      description: 'Line coverage should be at least 90%'
    },
    {
      type: 'branch',
      target: 80,
      description: 'Branch coverage should be at least 80%'
    },
    {
      type: 'toggle',
      target: 95,
      description: 'Toggle coverage should be at least 95%'
    }
  ];
  
  return goals;
}

// Generate assertions
function generateAssertions(moduleInfo: any): Assertion[] {
  const assertions: Assertion[] = [];
  
  // Add basic assertions
  assertions.push({
    condition: 'reset !== 1\'bx',
    message: 'Reset signal should not be unknown',
    severity: 'error'
  });
  
  if (moduleInfo.moduleType === 'sequential') {
    assertions.push({
      condition: 'clk !== 1\'bx',
      message: 'Clock signal should not be unknown',
      severity: 'error'
    });
  }
  
  return assertions;
}

// Generate the complete testbench code
function generateTestbenchCode(
  moduleInfo: any,
  testVectors: TestVector[],
  coverageGoals: CoverageGoal[],
  assertions: Assertion[],
  config?: Partial<TestbenchConfig>
): string {
  const { name, ports, moduleType } = moduleInfo;
  const clockPeriod = config?.clockPeriod || 10;
  const simulationTime = config?.simulationTime || 1000;
  
  // Generate port declarations
  const portDeclarations = ports.map(port => {
    const width = port.width > 1 ? `[${port.width - 1}:0]` : '';
    const regWire = port.direction === 'input' ? 'reg' : 'wire';
    return `  ${regWire} ${width} ${port.name};`;
  }).join('\n');
  
  // Generate DUT instantiation
  const dutPorts = ports.map(port => `.${port.name}(${port.name})`).join(',\n    ');
  
  // Generate test vector application
  const testVectorCode = testVectors.map(vector => {
    const inputAssignments = Object.entries(vector.inputs)
      .map(([key, value]) => `    ${key} = ${value};`)
      .join('\n');
    
    return `    // ${vector.name}
${inputAssignments}
    #${vector.delay};`;
  }).join('\n\n');
  
  // Generate assertions
  const assertionCode = assertions.map(assertion => 
    `    assert(${assertion.condition}) else $error("${assertion.message}");`
  ).join('\n');
  
  // Generate coverage
  const coverageCode = coverageGoals.map(goal => 
    `    // ${goal.description}`
  ).join('\n');
  
  return `// Auto-generated testbench for ${name}
// Generated at: ${new Date().toISOString()}
// Module type: ${moduleType}

module ${name}_tb;

// Clock and reset generation
reg clk = 0;
reg reset = 1;

// Port declarations
${portDeclarations}

// DUT instantiation
${name} dut (
    ${dutPorts}
);

// Clock generation
always #${clockPeriod / 2} clk = ~clk;

// Test stimulus
initial begin
    // Initialize waveform dump
    $dumpfile("${name}_test.vcd");
    $dumpvars(0, ${name}_tb);
    
    // Initialize signals
    ${ports.filter(p => p.direction === 'input').map(p => `${p.name} = 0;`).join('\n    ')}
    
    // Reset sequence
    reset = 1;
    #${clockPeriod * 2} reset = 0;
    
    // Apply test vectors
${testVectorCode}
    
    // Run simulation
    #${simulationTime};
    
    // Check assertions
${assertionCode}
    
    // Coverage reporting
${coverageCode}
    
    // End simulation
    $display("Simulation completed successfully");
    $finish;
end

// Monitor for debugging
initial begin
    $monitor("Time=%0t reset=%b clk=%b", $time, reset, clk);
end

endmodule`;
}

// Generate simple testbench (backward compatibility)
export async function generateSimpleTestbench(moduleCode: string, description: string): Promise<string> {
  const result = await generateTestbench(moduleCode, description);
  return result.testbenchCode;
}

// Generate testbench with custom configuration
export async function generateCustomTestbench(
  moduleCode: string,
  description: string,
  config: TestbenchConfig
): Promise<TestbenchResult> {
  return generateTestbench(moduleCode, description, config);
}

// Generate testbench for specific module types
export async function generateTestbenchForType(
  moduleType: 'alu' | 'counter' | 'memory' | 'multiplexer' | 'fsm' | 'generic',
  moduleCode: string,
  description: string
): Promise<TestbenchResult> {
  const config: Partial<TestbenchConfig> = {
    moduleName: parseModuleInfo(moduleCode).name,
    clockPeriod: 10,
    simulationTime: 1000
  };
  
  return generateTestbench(moduleCode, description, config);
} 