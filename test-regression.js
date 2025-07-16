#!/usr/bin/env node

/**
 * ChipForge Regression Test Suite
 * Tests all major functionality to ensure no regressions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  verbose: true,
  stopOnError: false,
  testTimeout: 30000
};

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
function testFileStructure() {
  log('Testing file structure...');
  
  const requiredFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/pages/Dashboard.tsx',
    'src/pages/ChipForgeSimulation.tsx',
    'src/components/chipforge/TopNav.tsx',
    'package.json',
    'vite.config.ts',
    'tailwind.config.ts'
  ];
  
  for (const file of requiredFiles) {
    assert(fs.existsSync(file), `Required file missing: ${file}`);
  }
  
  log('File structure test passed', 'success');
  testResults.passed++;
}

function testPackageJson() {
  log('Testing package.json...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  assert(packageJson.name, 'Package name is required');
  assert(packageJson.version, 'Package version is required');
  assert(packageJson.scripts, 'Scripts section is required');
  assert(packageJson.scripts.dev, 'Dev script is required');
  assert(packageJson.scripts.build, 'Build script is required');
  
  log('Package.json test passed', 'success');
  testResults.passed++;
}

function testAppRouting() {
  log('Testing App.tsx routing...');
  
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  
  // Check that Dashboard is the home route
  assert(appContent.includes('<Route path="/" element={<Dashboard />} />'), 
         'Dashboard should be the home route');
  
  // Check that all major routes exist
  const requiredRoutes = [
    '/dashboard',
    '/landing',
    '/workspace',
    '/chipforge-simulation',
    '/synthesis',
    '/place-and-route'
  ];
  
  for (const route of requiredRoutes) {
    assert(appContent.includes(`path="${route}"`), `Route ${route} is missing`);
  }
  
  log('App routing test passed', 'success');
  testResults.passed++;
}

function testChipForgeSimulation() {
  log('Testing ChipForgeSimulation component...');
  
  const simulationContent = fs.readFileSync('src/pages/ChipForgeSimulation.tsx', 'utf8');
  
  // Check for error boundary
  assert(simulationContent.includes('SimulationErrorBoundary'), 
         'Error boundary should be implemented');
  
  // Check for error handling
  assert(simulationContent.includes('setError'), 
         'Error state should be managed');
  
  // Check for required imports
  const requiredImports = [
    'runTestBench',
    'getReflexionAdvice',
    'TopNav'
  ];
  
  for (const importName of requiredImports) {
    assert(simulationContent.includes(importName), 
           `Required import missing: ${importName}`);
  }
  
  // Check for required UI components
  const requiredComponents = [
    'Card',
    'Button',
    'Tabs',
    'Progress'
  ];
  
  for (const component of requiredComponents) {
    assert(simulationContent.includes(component), 
           `Required UI component missing: ${component}`);
  }
  
  log('ChipForgeSimulation test passed', 'success');
  testResults.passed++;
}

function testBackendFiles() {
  log('Testing backend files...');
  
  const backendFiles = [
    'src/backend/sim/testBench.ts',
    'src/backend/reflexion/reviewer.ts'
  ];
  
  for (const file of backendFiles) {
    assert(fs.existsSync(file), `Backend file missing: ${file}`);
    
    const content = fs.readFileSync(file, 'utf8');
    assert(content.includes('export'), `File ${file} should export functions`);
  }
  
  log('Backend files test passed', 'success');
  testResults.passed++;
}

function testComponents() {
  log('Testing UI components...');
  
  const componentFiles = [
    'src/components/ui/button.tsx',
    'src/components/ui/card.tsx',
    'src/components/ui/tabs.tsx',
    'src/components/ui/progress.tsx',
    'src/components/ui/badge.tsx'
  ];
  
  for (const file of componentFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      assert(content.includes('export'), `Component ${file} should export something`);
    }
  }
  
  log('UI components test passed', 'success');
  testResults.passed++;
}

function testTypeScriptConfig() {
  log('Testing TypeScript configuration...');
  
  const tsConfigFiles = [
    'tsconfig.json',
    'tsconfig.app.json'
  ];
  
  for (const file of tsConfigFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const config = JSON.parse(content);
      assert(config.compilerOptions, `TypeScript config ${file} should have compilerOptions`);
    }
  }
  
  log('TypeScript configuration test passed', 'success');
  testResults.passed++;
}

function testViteConfig() {
  log('Testing Vite configuration...');
  
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  
  assert(viteConfig.includes('defineConfig'), 'Vite config should use defineConfig');
  assert(viteConfig.includes('react'), 'Vite config should include React plugin');
  
  log('Vite configuration test passed', 'success');
  testResults.passed++;
}

function testTailwindConfig() {
  log('Testing Tailwind configuration...');
  
  const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
  
  assert(tailwindConfig.includes('content'), 'Tailwind config should have content paths');
  assert(tailwindConfig.includes('theme'), 'Tailwind config should have theme configuration');
  
  log('Tailwind configuration test passed', 'success');
  testResults.passed++;
}

function testNavigationConsistency() {
  log('Testing navigation consistency...');
  
  // Check that TopNav is used consistently
  const pagesDir = 'src/pages';
  const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.tsx'));
  
  let pagesWithNav = 0;
  let totalPages = pageFiles.length;
  
  for (const file of pageFiles) {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    if (content.includes('TopNav')) {
      pagesWithNav++;
    }
  }
  
  // At least 80% of pages should have navigation
  const navPercentage = (pagesWithNav / totalPages) * 100;
  assert(navPercentage >= 80, 
         `Navigation consistency too low: ${navPercentage.toFixed(1)}% (${pagesWithNav}/${totalPages})`);
  
  log(`Navigation consistency test passed: ${navPercentage.toFixed(1)}%`, 'success');
  testResults.passed++;
}

function testErrorHandling() {
  log('Testing error handling...');
  
  const simulationContent = fs.readFileSync('src/pages/ChipForgeSimulation.tsx', 'utf8');
  
  // Check for try-catch blocks
  assert(simulationContent.includes('try {'), 'Should have try-catch error handling');
  assert(simulationContent.includes('catch (error)'), 'Should catch errors properly');
  
  // Check for error boundaries
  assert(simulationContent.includes('componentDidCatch'), 'Should have error boundary');
  
  log('Error handling test passed', 'success');
  testResults.passed++;
}

// Main test runner
async function runTests() {
  log('🚀 Starting ChipForge Regression Test Suite...');
  log(`Configuration: ${JSON.stringify(TEST_CONFIG, null, 2)}`);
  
  const tests = [
    testFileStructure,
    testPackageJson,
    testAppRouting,
    testChipForgeSimulation,
    testBackendFiles,
    testComponents,
    testTypeScriptConfig,
    testViteConfig,
    testTailwindConfig,
    testNavigationConsistency,
    testErrorHandling
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
      
      if (TEST_CONFIG.stopOnError) {
        break;
      }
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
    log('🎉 All tests passed! ChipForge is ready for deployment.', 'success');
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