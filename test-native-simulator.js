#!/usr/bin/env node

// Test runner for Native Verilog Simulator
// Run with: node test-native-simulator.js

import { runNativeSimulatorTests } from './src/backend/sim/nativeSimulator.test.ts';

async function main() {
  console.log('🚀 Starting Native Verilog Simulator Test Suite\n');
  
  try {
    const success = await runNativeSimulatorTests();
    
    if (success) {
      console.log('\n✅ Phase 1 Implementation Complete!');
      console.log('🎯 Native Verilog Simulation Engine is working correctly.');
      console.log('\n📋 What was implemented:');
      console.log('   ✅ Verilog tokenization and parsing');
      console.log('   ✅ Module structure analysis');
      console.log('   ✅ Expression evaluation');
      console.log('   ✅ Real-time simulation with waveform generation');
      console.log('   ✅ Automatic testbench generation');
      console.log('   ✅ Simulation statistics and coverage');
      console.log('\n🔧 Next steps:');
      console.log('   1. Test the simulation in the UI');
      console.log('   2. Implement AI model integration');
      console.log('   3. Add more complex Verilog constructs');
      console.log('   4. Enhance expression parser');
      
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test runner crashed:', error);
    process.exit(1);
  }
}

main(); 