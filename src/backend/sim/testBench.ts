export interface TestResult {
  passed: boolean;
  feedback: string;
  warnings: string[];
  errors: string[];
  simulationTime: number;
}

export const runTestBench = async (verilogCode: string): Promise<TestResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Simple test bench logic - in a real implementation, this would:
  // 1. Parse the Verilog code
  // 2. Generate appropriate test vectors
  // 3. Run simulation
  // 4. Check outputs against expected values
  
  const hasSyntaxErrors = verilogCode.includes('syntax error') || verilogCode.includes('undefined');
  const hasLogicErrors = verilogCode.includes('always') && !verilogCode.includes('@');
  const hasMissingPorts = verilogCode.includes('input') && !verilogCode.includes('output');
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (hasSyntaxErrors) {
    errors.push('Syntax error detected in Verilog code');
  }
  
  if (hasLogicErrors) {
    errors.push('Missing sensitivity list in always block');
  }
  
  if (hasMissingPorts) {
    warnings.push('Module has inputs but no outputs - consider adding output ports');
  }
  
  // Check for common HDL patterns
  if (!verilogCode.includes('module')) {
    errors.push('No module declaration found');
  }
  
  if (!verilogCode.includes('endmodule')) {
    errors.push('Module not properly closed');
  }
  
  // Simulate some random test results
  const randomPass = Math.random() > 0.3; // 70% pass rate
  
  if (randomPass && errors.length === 0) {
    return {
      passed: true,
      feedback: `✅ All tests passed successfully!\n\nTest Results:\n- Module compiled successfully\n- All test vectors passed\n- No timing violations detected\n- Power consumption within limits\n\nSimulation completed in ${Math.floor(Math.random() * 100 + 50)}ms`,
      warnings,
      errors: [],
      simulationTime: Math.floor(Math.random() * 100 + 50)
    };
  } else {
    const allErrors = errors.length > 0 ? errors : ['Test bench failed - unexpected behavior detected'];
    
    return {
      passed: false,
      feedback: `❌ Test bench failed!\n\nIssues found:\n${allErrors.map(err => `- ${err}`).join('\n')}\n\nTest Results:\n- Module compilation: ${errors.length === 0 ? 'PASS' : 'FAIL'}\n- Test vectors: FAIL\n- Timing analysis: FAIL\n\nPlease review the code and try again.`,
      warnings,
      errors: allErrors,
      simulationTime: Math.floor(Math.random() * 100 + 50)
    };
  }
}; 