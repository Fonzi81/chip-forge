// Test runner for Chip Data Models
// Execute comprehensive validation and regression testing

import { runAllTests } from './src/backend/visualization/chipDataModels.test.ts';

console.log('🚀 Starting Chip Data Model Test Suite...\n');

try {
  runAllTests();
  console.log('\n🎯 All tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n💥 Test suite failed:', error);
  process.exit(1);
} 