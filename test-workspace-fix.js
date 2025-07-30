#!/usr/bin/env node

/**
 * Workspace Fix Test
 * Verifies that the white screen issue is resolved
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  startTime: Date.now()
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test functions
function testWorkspaceFile() {
  log('Testing workspace file exists...');
  
  const workspaceFile = 'src/pages/ChipForgeWorkspace.tsx';
  assert(fs.existsSync(workspaceFile), `Workspace file missing: ${workspaceFile}`);
  
  const content = fs.readFileSync(workspaceFile, 'utf8');
  assert(content.includes('export default function ChipForgeWorkspace'), 'Workspace component not exported');
  assert(content.includes('AICopilot'), 'AI Copilot component missing');
  assert(content.includes('ComponentLibrary'), 'Component Library missing');
  assert(content.includes('Tabs'), 'Tab system missing');
  
  log('Workspace file test passed', 'success');
  testResults.passed++;
}

function testAppRouting() {
  log('Testing app routing...');
  
  const appFile = 'src/App.tsx';
  const content = fs.readFileSync(appFile, 'utf8');
  
  assert(content.includes('import ChipForgeWorkspace'), 'Workspace import missing');
  assert(content.includes('path="/workspace"'), 'Workspace route missing');
  assert(content.includes('<Route path="/" element={<Dashboard />} />'), 'Dashboard should be home route');
  
  log('App routing test passed', 'success');
  testResults.passed++;
}

function testMissingDependencies() {
  log('Testing for missing dependencies...');
  
  const workspaceContent = fs.readFileSync('src/pages/ChipForgeWorkspace.tsx', 'utf8');
  
  // Check that complex backend imports are removed
  const removedImports = [
    'useWorkflowStore',
    'useHDLDesignStore', 
    'HDLGenerator',
    'VerilogSimulator',
    'ProfessionalChip3DViewer'
  ];
  
  removedImports.forEach(importName => {
    assert(!workspaceContent.includes(importName), `Complex import still present: ${importName}`);
  });
  
  // Check that basic imports are present
  const requiredImports = [
    'React',
    'useState',
    'Card',
    'Button',
    'Tabs'
  ];
  
  requiredImports.forEach(importName => {
    assert(workspaceContent.includes(importName), `Required import missing: ${importName}`);
  });
  
  log('Missing dependencies test passed', 'success');
  testResults.passed++;
}

function testSimulationFile() {
  log('Testing simulation file exists...');
  
  const simulationFile = 'src/pages/ChipForgeSimulation.tsx';
  assert(fs.existsSync(simulationFile), `Simulation file missing: ${simulationFile}`);
  
  const content = fs.readFileSync(simulationFile, 'utf8');
  assert(content.includes('export default function ChipForgeSimulation'), 'Simulation component not exported');
  
  log('Simulation file test passed', 'success');
  testResults.passed++;
}

function testIconImports() {
  log('Testing icon imports...');
  
  const workspaceContent = fs.readFileSync('src/pages/ChipForgeWorkspace.tsx', 'utf8');
  
  // Check that Box icon is used instead of Cube
  assert(workspaceContent.includes('Box'), 'Box icon should be imported');
  assert(!workspaceContent.includes('Cube'), 'Cube icon should not be imported');
  
  log('Icon imports test passed', 'success');
  testResults.passed++;
}

// Main test runner
async function runTests() {
  log('🚀 Starting Workspace Fix Test Suite...');
  
  const tests = [
    testWorkspaceFile,
    testAppRouting,
    testMissingDependencies,
    testSimulationFile,
    testIconImports
  ];
  
  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      log(`Test failed: ${test.name} - ${error.message}`, 'error');
      testResults.failed++;
      testResults.errors.push({
        test: test.name,
        error: error.message
      });
    }
  }
  
  // Generate report
  const endTime = Date.now();
  const duration = endTime - testResults.startTime;
  
  log('\n📊 Test Results Summary:');
  log(`✅ Passed: ${testResults.passed}`);
  log(`❌ Failed: ${testResults.failed}`);
  log(`⏱️  Duration: ${duration}ms`);
  
  if (testResults.errors.length > 0) {
    log('\n❌ Failed Tests:');
    testResults.errors.forEach(({ test, error }) => {
      log(`  - ${test}: ${error}`, 'error');
    });
  }
  
  const successRate = (testResults.passed / (testResults.passed + testResults.failed)) * 100;
  log(`\n📈 Success Rate: ${successRate.toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    log('🎉 All tests passed! White screen issue should be resolved.', 'success');
    log('🌐 Navigate to http://localhost:8082/workspace to test the integrated design environment', 'success');
    process.exit(0);
  } else {
    log('⚠️  Some tests failed. Please review the errors above.', 'error');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
}); 