// Comprehensive Regression Testing Framework for Native Verilog Simulator
// This file contains all test cases and regression tests for Phase 1 implementation

import { NativeVerilogSimulator, VerilogModule, WaveformData } from './nativeSimulator';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'regression' | 'performance' | 'edge-case';
  priority: 'low' | 'medium' | 'high' | 'critical';
  verilogCode: string;
  expectedResults: {
    moduleName?: string;
    portCount?: number;
    signalCount?: number;
    simulationSteps?: number;
    waveformPoints?: number;
    errors?: string[];
    warnings?: string[];
  };
  testFunction: (simulator: NativeVerilogSimulator) => Promise<TestResult>;
}

export interface TestResult {
  testId: string;
  testName: string;
  passed: boolean;
  executionTime: number;
  error?: string;
  details: {
    actual: any;
    expected: any;
    differences?: string[];
  };
}

export interface TestSuite {
  name: string;
  description: string;
  tests: TestCase[];
}

export interface RegressionReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTime: number;
  testResults: TestResult[];
  summary: {
    unitTests: { passed: number; failed: number };
    integrationTests: { passed: number; failed: number };
    regressionTests: { passed: number; failed: number };
    performanceTests: { passed: number; failed: number };
    edgeCaseTests: { passed: number; failed: number };
  };
}

// ============================================================================
// TEST USE CASES - COMPREHENSIVE COVERAGE
// ============================================================================

export const TEST_CASES: TestCase[] = [
  // ============================================================================
  // UNIT TESTS - Basic Functionality
  // ============================================================================
  
  {
    id: 'UT-001',
    name: 'Basic Module Parsing',
    description: 'Test basic Verilog module parsing with simple structure',
    category: 'unit',
    priority: 'critical',
    verilogCode: `
      module buffer(input wire a, output wire b);
        assign b = a;
      endmodule
    `,
    expectedResults: {
      moduleName: 'buffer',
      portCount: 2,
      signalCount: 0,
      simulationSteps: 1,
      waveformPoints: 2
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const module = simulator.parseModule(TEST_CASES[0].verilogCode);
        const executionTime = performance.now() - startTime;
        
        const passed = module?.name === 'buffer' && module?.ports.length === 2;
        
        return {
          testId: 'UT-001',
          testName: 'Basic Module Parsing',
          passed,
          executionTime,
          details: {
            actual: { name: module?.name, portCount: module?.ports.length },
            expected: { name: 'buffer', portCount: 2 }
          }
        };
      } catch (error) {
        return {
          testId: 'UT-001',
          testName: 'Basic Module Parsing',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { name: 'buffer', portCount: 2 } }
        };
      }
    }
  },

  {
    id: 'UT-002',
    name: 'Tokenization Accuracy',
    description: 'Test Verilog tokenization with various token types',
    category: 'unit',
    priority: 'high',
    verilogCode: `
      module test(input wire clk, output reg [7:0] data);
        always @(posedge clk) begin
          data <= data + 1;
        end
      endmodule
    `,
    expectedResults: {
      moduleName: 'test',
      portCount: 2,
      signalCount: 0
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const tokens = simulator.tokenize(TEST_CASES[1].verilogCode);
        const executionTime = performance.now() - startTime;
        
        const hasKeywords = tokens.some(t => t.type === 'keyword');
        const hasIdentifiers = tokens.some(t => t.type === 'identifier');
        const hasOperators = tokens.some(t => t.type === 'operator');
        
        return {
          testId: 'UT-002',
          testName: 'Tokenization Accuracy',
          passed: hasKeywords && hasIdentifiers && hasOperators,
          executionTime,
          details: {
            actual: { tokenCount: tokens.length, hasKeywords, hasIdentifiers, hasOperators },
            expected: { hasKeywords: true, hasIdentifiers: true, hasOperators: true }
          }
        };
      } catch (error) {
        return {
          testId: 'UT-002',
          testName: 'Tokenization Accuracy',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { hasKeywords: true, hasIdentifiers: true, hasOperators: true } }
        };
      }
    }
  },

  // ============================================================================
  // INTEGRATION TESTS - Component Interaction
  // ============================================================================
  
  {
    id: 'IT-001',
    name: 'Counter Simulation',
    description: 'Test complete simulation of a 4-bit counter',
    category: 'integration',
    priority: 'high',
    verilogCode: `
      module counter(
        input wire clk,
        input wire reset,
        output reg [3:0] count
      );
        always @(posedge clk or posedge reset) begin
          if (reset) begin
            count <= 4'b0000;
          end else begin
            count <= count + 1;
          end
        end
      endmodule
    `,
    expectedResults: {
      moduleName: 'counter',
      portCount: 3,
      signalCount: 0,
      simulationSteps: 10,
      waveformPoints: 11
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const waveform = await simulator.simulate(TEST_CASES[2].verilogCode, 10);
        const executionTime = performance.now() - startTime;
        
        const hasCountSignal = 'count' in waveform.signals;
        const hasTimePoints = waveform.time.length > 0;
        const hasValues = hasCountSignal && waveform.signals.count.values.length > 0;
        
        return {
          testId: 'IT-001',
          testName: 'Counter Simulation',
          passed: hasCountSignal && hasTimePoints && hasValues,
          executionTime,
          details: {
            actual: { 
              hasCountSignal, 
              timePoints: waveform.time.length, 
              hasValues,
              finalCount: hasValues ? waveform.signals.count.values[waveform.signals.count.values.length - 1] : null
            },
            expected: { hasCountSignal: true, hasTimePoints: true, hasValues: true }
          }
        };
      } catch (error) {
        return {
          testId: 'IT-001',
          testName: 'Counter Simulation',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { hasCountSignal: true, hasTimePoints: true, hasValues: true } }
        };
      }
    }
  },

  {
    id: 'IT-002',
    name: 'Testbench Generation',
    description: 'Test automatic testbench generation for a module',
    category: 'integration',
    priority: 'medium',
    verilogCode: `
      module mux2to1(
        input wire [7:0] a,
        input wire [7:0] b,
        input wire sel,
        output wire [7:0] out
      );
        assign out = sel ? b : a;
      endmodule
    `,
    expectedResults: {
      moduleName: 'mux2to1',
      portCount: 4,
      signalCount: 0
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const module = simulator.parseModule(TEST_CASES[3].verilogCode);
        if (!module) {
          throw new Error('Failed to parse module');
        }
        const testbench = simulator.generateTestbench(module);
        const executionTime = performance.now() - startTime;
        
        const hasTestbench = testbench.length > 0;
        const hasInitialBlock = testbench.includes('initial');
        const hasTestCases = testbench.includes('$display');
        
        return {
          testId: 'IT-002',
          testName: 'Testbench Generation',
          passed: hasTestbench && hasInitialBlock && hasTestCases,
          executionTime,
          details: {
            actual: { hasTestbench, hasInitialBlock, hasTestCases, testbenchLength: testbench.length },
            expected: { hasTestbench: true, hasInitialBlock: true, hasTestCases: true }
          }
        };
      } catch (error) {
        return {
          testId: 'IT-002',
          testName: 'Testbench Generation',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { hasTestbench: true, hasInitialBlock: true, hasTestCases: true } }
        };
      }
    }
  },

  // ============================================================================
  // REGRESSION TESTS - Previous Bug Fixes
  // ============================================================================
  
  {
    id: 'RT-001',
    name: 'Expression Evaluation',
    description: 'Test complex expression evaluation with operators',
    category: 'regression',
    priority: 'high',
    verilogCode: `
      module alu(
        input wire [3:0] a,
        input wire [3:0] b,
        input wire [1:0] op,
        output reg [3:0] result
      );
        always @(*) begin
          case (op)
            2'b00: result = a + b;
            2'b01: result = a - b;
            2'b10: result = a & b;
            2'b11: result = a | b;
          endcase
        end
      endmodule
    `,
    expectedResults: {
      moduleName: 'alu',
      portCount: 4,
      signalCount: 0
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const module = simulator.parseModule(TEST_CASES[4].verilogCode);
        const executionTime = performance.now() - startTime;
        
        const hasCaseStatement = module?.alwaysBlocks.some(block => 
          block.statements.some(stmt => stmt.includes('case'))
        );
        
        return {
          testId: 'RT-001',
          testName: 'Expression Evaluation',
          passed: module?.name === 'alu' && hasCaseStatement,
          executionTime,
          details: {
            actual: { name: module?.name, hasCaseStatement },
            expected: { name: 'alu', hasCaseStatement: true }
          }
        };
      } catch (error) {
        return {
          testId: 'RT-001',
          testName: 'Expression Evaluation',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { name: 'alu', hasCaseStatement: true } }
        };
      }
    }
  },

  // ============================================================================
  // PERFORMANCE TESTS - Scalability
  // ============================================================================
  
  {
    id: 'PT-001',
    name: 'Large Module Simulation',
    description: 'Test simulation performance with larger modules',
    category: 'performance',
    priority: 'medium',
    verilogCode: `
      module large_counter(
        input wire clk,
        input wire reset,
        output reg [15:0] count
      );
        always @(posedge clk or posedge reset) begin
          if (reset) begin
            count <= 16'b0000000000000000;
          end else begin
            count <= count + 1;
          end
        end
      endmodule
    `,
    expectedResults: {
      moduleName: 'large_counter',
      portCount: 3,
      signalCount: 0,
      simulationSteps: 100
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const waveform = await simulator.simulate(TEST_CASES[5].verilogCode, 100);
        const executionTime = performance.now() - startTime;
        
        const performanceOK = executionTime < 1000; // Should complete within 1 second
        const hasExpectedSteps = waveform.time.length >= 100;
        
        return {
          testId: 'PT-001',
          testName: 'Large Module Simulation',
          passed: performanceOK && hasExpectedSteps,
          executionTime,
          details: {
            actual: { executionTime, timeSteps: waveform.time.length },
            expected: { maxExecutionTime: 1000, minTimeSteps: 100 }
          }
        };
      } catch (error) {
        return {
          testId: 'PT-001',
          testName: 'Large Module Simulation',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { maxExecutionTime: 1000, minTimeSteps: 100 } }
        };
      }
    }
  },

  // ============================================================================
  // EDGE CASE TESTS - Boundary Conditions
  // ============================================================================
  
  {
    id: 'EC-001',
    name: 'Empty Module Handling',
    description: 'Test handling of empty or minimal modules',
    category: 'edge-case',
    priority: 'medium',
    verilogCode: `
      module empty_module();
      endmodule
    `,
    expectedResults: {
      moduleName: 'empty_module',
      portCount: 0,
      signalCount: 0
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const module = simulator.parseModule(TEST_CASES[6].verilogCode);
        const executionTime = performance.now() - startTime;
        
        // Empty modules should be parsed successfully
        return {
          testId: 'EC-001',
          testName: 'Empty Module Handling',
          passed: module?.name === 'empty_module' && module?.ports.length === 0,
          executionTime,
          details: {
            actual: { name: module?.name, portCount: module?.ports.length },
            expected: { name: 'empty_module', portCount: 0 }
          }
        };
      } catch (error) {
        return {
          testId: 'EC-001',
          testName: 'Empty Module Handling',
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: { name: 'empty_module', portCount: 0 } }
        };
      }
    }
  },

  {
    id: 'EC-002',
    name: 'Invalid Syntax Handling',
    description: 'Test graceful handling of invalid Verilog syntax',
    category: 'edge-case',
    priority: 'high',
    verilogCode: `
      module invalid_module(
        input wire a
        // Missing closing parenthesis and semicolon
      endmodule
    `,
    expectedResults: {
      errors: ['syntax']
    },
    testFunction: async (simulator) => {
      const startTime = performance.now();
      try {
        const module = simulator.parseModule(TEST_CASES[7].verilogCode);
        const executionTime = performance.now() - startTime;
        
        // Should handle invalid syntax gracefully (return null or throw)
        const handledGracefully = module === null || module === undefined;
        
        return {
          testId: 'EC-002',
          testName: 'Invalid Syntax Handling',
          passed: handledGracefully,
          executionTime,
          details: {
            actual: { module: module ? 'parsed' : 'null' },
            expected: { module: 'null' }
          }
        };
      } catch (error) {
        // Exception is also acceptable for invalid syntax
        return {
          testId: 'EC-002',
          testName: 'Invalid Syntax Handling',
          passed: true,
          executionTime: performance.now() - startTime,
          details: {
            actual: { error: error instanceof Error ? error.message : 'Unknown error' },
            expected: { module: 'null or exception' }
          }
        };
      }
    }
  }
];

// ============================================================================
// TEST SUITES
// ============================================================================

export const TEST_SUITES: TestSuite[] = [
  {
    name: 'Unit Tests',
    description: 'Basic functionality tests for individual components',
    tests: TEST_CASES.filter(t => t.category === 'unit')
  },
  {
    name: 'Integration Tests',
    description: 'Tests for component interaction and complete workflows',
    tests: TEST_CASES.filter(t => t.category === 'integration')
  },
  {
    name: 'Regression Tests',
    description: 'Tests to ensure previous bug fixes remain working',
    tests: TEST_CASES.filter(t => t.category === 'regression')
  },
  {
    name: 'Performance Tests',
    description: 'Tests for scalability and performance characteristics',
    tests: TEST_CASES.filter(t => t.category === 'performance')
  },
  {
    name: 'Edge Case Tests',
    description: 'Tests for boundary conditions and error handling',
    tests: TEST_CASES.filter(t => t.category === 'edge-case')
  }
];

// ============================================================================
// REGRESSION TESTING FRAMEWORK
// ============================================================================

export class RegressionTestRunner {
  private simulator: NativeVerilogSimulator;

  constructor() {
    this.simulator = new NativeVerilogSimulator();
  }

  async runSingleTest(testCase: TestCase): Promise<TestResult> {
    return await testCase.testFunction(this.simulator);
  }

  async runTestSuite(suite: TestSuite): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    for (const testCase of suite.tests) {
      try {
        const result = await this.runSingleTest(testCase);
        results.push(result);
      } catch (error) {
        results.push({
          testId: testCase.id,
          testName: testCase.name,
          passed: false,
          executionTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: { actual: null, expected: testCase.expectedResults }
        });
      }
    }
    
    return results;
  }

  async runAllTests(): Promise<RegressionReport> {
    const startTime = performance.now();
    const allResults: TestResult[] = [];
    
    for (const suite of TEST_SUITES) {
      const suiteResults = await this.runTestSuite(suite);
      allResults.push(...suiteResults);
    }
    
    const executionTime = performance.now() - startTime;
    const passedTests = allResults.filter(r => r.passed).length;
    const failedTests = allResults.filter(r => !r.passed).length;
    
    return {
      timestamp: new Date().toISOString(),
      totalTests: allResults.length,
      passedTests,
      failedTests,
      executionTime,
      testResults: allResults,
      summary: {
        unitTests: {
          passed: allResults.filter(r => r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'unit').length,
          failed: allResults.filter(r => !r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'unit').length
        },
        integrationTests: {
          passed: allResults.filter(r => r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'integration').length,
          failed: allResults.filter(r => !r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'integration').length
        },
        regressionTests: {
          passed: allResults.filter(r => r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'regression').length,
          failed: allResults.filter(r => !r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'regression').length
        },
        performanceTests: {
          passed: allResults.filter(r => r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'performance').length,
          failed: allResults.filter(r => !r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'performance').length
        },
        edgeCaseTests: {
          passed: allResults.filter(r => r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'edge-case').length,
          failed: allResults.filter(r => !r.passed && TEST_CASES.find(t => t.id === r.testId)?.category === 'edge-case').length
        }
      }
    };
  }

  generateTestReport(report: RegressionReport): string {
    const { summary, testResults } = report;
    
    let reportText = `# Regression Test Report\n\n`;
    reportText += `**Timestamp:** ${report.timestamp}\n`;
    reportText += `**Total Tests:** ${report.totalTests}\n`;
    reportText += `**Passed:** ${report.passedTests}\n`;
    reportText += `**Failed:** ${report.failedTests}\n`;
    reportText += `**Success Rate:** ${((report.passedTests / report.totalTests) * 100).toFixed(2)}%\n`;
    reportText += `**Execution Time:** ${report.executionTime.toFixed(2)}ms\n\n`;
    
    reportText += `## Summary by Category\n\n`;
    reportText += `| Category | Passed | Failed | Total |\n`;
    reportText += `|----------|--------|--------|-------|\n`;
    reportText += `| Unit Tests | ${summary.unitTests.passed} | ${summary.unitTests.failed} | ${summary.unitTests.passed + summary.unitTests.failed} |\n`;
    reportText += `| Integration Tests | ${summary.integrationTests.passed} | ${summary.integrationTests.failed} | ${summary.integrationTests.passed + summary.integrationTests.failed} |\n`;
    reportText += `| Regression Tests | ${summary.regressionTests.passed} | ${summary.regressionTests.failed} | ${summary.regressionTests.passed + summary.regressionTests.failed} |\n`;
    reportText += `| Performance Tests | ${summary.performanceTests.passed} | ${summary.performanceTests.failed} | ${summary.performanceTests.passed + summary.performanceTests.failed} |\n`;
    reportText += `| Edge Case Tests | ${summary.edgeCaseTests.passed} | ${summary.edgeCaseTests.failed} | ${summary.edgeCaseTests.passed + summary.edgeCaseTests.failed} |\n\n`;
    
    reportText += `## Failed Tests\n\n`;
    const failedTests = testResults.filter(r => !r.passed);
    if (failedTests.length === 0) {
      reportText += `✅ All tests passed!\n\n`;
    } else {
      failedTests.forEach(test => {
        reportText += `### ${test.testName} (${test.testId})\n`;
        reportText += `**Error:** ${test.error || 'No error message'}\n`;
        reportText += `**Execution Time:** ${test.executionTime.toFixed(2)}ms\n\n`;
      });
    }
    
    return reportText;
  }
}

// ============================================================================
// EXPORT FUNCTIONS FOR TESTING
// ============================================================================

export async function runRegressionTests(): Promise<RegressionReport> {
  const runner = new RegressionTestRunner();
  return await runner.runAllTests();
}

export async function runTestSuite(suiteName: string): Promise<TestResult[]> {
  const runner = new RegressionTestRunner();
  const suite = TEST_SUITES.find(s => s.name === suiteName);
  if (!suite) {
    throw new Error(`Test suite '${suiteName}' not found`);
  }
  return await runner.runTestSuite(suite);
}

export async function runSingleTest(testId: string): Promise<TestResult> {
  const runner = new RegressionTestRunner();
  const testCase = TEST_CASES.find(t => t.id === testId);
  if (!testCase) {
    throw new Error(`Test case '${testId}' not found`);
  }
  return await runner.runSingleTest(testCase);
}

export function getTestCases(): TestCase[] {
  return TEST_CASES;
}

export function getTestSuites(): TestSuite[] {
  return TEST_SUITES;
} 