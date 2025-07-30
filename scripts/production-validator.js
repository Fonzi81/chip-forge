#!/usr/bin/env node

/**
 * Production Standards Validator
 * Enforces production-quality code standards
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production standards configuration
const PRODUCTION_STANDARDS = {
  forbiddenPatterns: [
    /\/\/ TODO:/i,
    /\/\/ FIXME:/i,
    /\/\/ PLACEHOLDER/i,
    /\/\/ MOCK/i,
    /\/\/ SIMPLIFIED/i,
    /\/\/ PROTOTYPE/i,
    /\/\/ BASIC/i,
    /\/\/ STUB/i,
    /\/\/ SKELETON/i,
    /console\.log\(/,
    /alert\(/,
    /debugger;/,
    /throw new Error\('Not implemented'\)/,
    /return null; \/\/ TODO/,
    /return \[\]; \/\/ TODO/,
    /return {}; \/\/ TODO/,
    /return ''; \/\/ TODO/,
    /return 0; \/\/ TODO/,
    /return false; \/\/ TODO/,
    /return true; \/\/ TODO/,
    /\/\* TODO \*\//,
    /\/\* FIXME \*\//,
    /\/\* PLACEHOLDER \*\//,
    /\/\* MOCK \*\//,
    /\/\* SIMPLIFIED \*\//,
    /\/\* PROTOTYPE \*\//,
    /\/\* BASIC \*\//,
    /\/\* STUB \*\//,
    /\/\* SKELETON \*\//,
  ],
  
  requiredPatterns: [
    /export (class|function|const|interface|type)/,
    /import.*from/,
    /try\s*{/,
    /catch\s*\(/,
    /finally\s*{/,
    /async\s+function/,
    /await\s+/,
    /\.test\./,
    /\.spec\./,
    /describe\(/,
    /it\(/,
    /expect\(/,
  ],
  
  requiredFiles: [
    'package.json',
    'README.md',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.ts',
    'eslint.config.js',
  ],
  
  requiredDependencies: [
    'react',
    'typescript',
    'vite',
    'tailwindcss',
    '@types/react',
    '@types/react-dom',
  ],
  
  testFilePatterns: [
    /\.test\.(ts|tsx|js|jsx)$/,
    /\.spec\.(ts|tsx|js|jsx)$/,
  ],
  
  sourceFilePatterns: [
    /\.(ts|tsx|js|jsx)$/,
  ],
  
  excludedDirectories: [
    'node_modules',
    'dist',
    'build',
    '.git',
    'coverage',
    '.next',
    '.nuxt',
  ],
};

// Validation results
let validationResults = {
  passed: 0,
  failed: 0,
  errors: [],
  warnings: [],
  startTime: Date.now(),
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function assert(condition, message, severity = 'error') {
  if (!condition) {
    if (severity === 'error') {
      validationResults.failed++;
      validationResults.errors.push(message);
      log(message, 'error');
    } else {
      validationResults.warnings.push(message);
      log(message, 'warning');
    }
  } else {
    validationResults.passed++;
    log(message, 'success');
  }
}

// File validation functions
function validateFileStructure() {
  log('Validating file structure...');
  
  PRODUCTION_STANDARDS.requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    assert(exists, `Required file missing: ${file}`);
  });
  
  // Check for proper directory structure
  const requiredDirs = ['src', 'src/components', 'src/pages', 'src/backend'];
  requiredDirs.forEach(dir => {
    const exists = fs.existsSync(dir);
    assert(exists, `Required directory missing: ${dir}`);
  });
}

function validatePackageJson() {
  log('Validating package.json...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check required dependencies
  PRODUCTION_STANDARDS.requiredDependencies.forEach(dep => {
    const hasDep = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    assert(hasDep, `Required dependency missing: ${dep}`);
  });
  
  // Check scripts
  const requiredScripts = ['dev', 'build', 'test', 'lint'];
  requiredScripts.forEach(script => {
    const hasScript = packageJson.scripts?.[script];
    assert(hasScript, `Required script missing: ${script}`);
  });
  
  // Check for proper project configuration
  assert(packageJson.name, 'Package name is required');
  assert(packageJson.version, 'Package version is required');
  assert(packageJson.description, 'Package description is required');
}

function validateSourceFiles() {
  log('Validating source files...');
  
  function scanDirectory(dir, patterns) {
    const files = [];
    
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!PRODUCTION_STANDARDS.excludedDirectories.includes(item)) {
            files.push(...scanDirectory(fullPath, patterns));
          }
        } else if (patterns.some(pattern => pattern.test(item))) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }
  
  const sourceFiles = scanDirectory('src', PRODUCTION_STANDARDS.sourceFilePatterns);
  const testFiles = scanDirectory('src', PRODUCTION_STANDARDS.testFilePatterns);
  
  log(`Found ${sourceFiles.length} source files and ${testFiles.length} test files`);
  
  // Validate each source file
  sourceFiles.forEach(file => {
    validateSourceFile(file);
  });
  
  // Check test coverage
  const testCoverage = testFiles.length / Math.max(sourceFiles.length, 1);
  assert(testCoverage >= 0.5, `Insufficient test coverage: ${(testCoverage * 100).toFixed(1)}% (minimum 50%)`);
}

function validateSourceFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  // Check for forbidden patterns
  PRODUCTION_STANDARDS.forbiddenPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      assert(false, `Forbidden pattern found in ${fileName}: ${pattern.source}`);
    }
  });
  
  // Check for required patterns (at least some)
  const hasRequiredPatterns = PRODUCTION_STANDARDS.requiredPatterns.some(pattern => 
    content.match(pattern)
  );
  assert(hasRequiredPatterns, `No required patterns found in ${fileName}`);
  
  // Check for proper exports
  const hasExports = content.includes('export ') || content.includes('export default');
  assert(hasExports, `No exports found in ${fileName}`);
  
  // Check for error handling
  const hasErrorHandling = content.includes('try') || content.includes('catch') || content.includes('ErrorBoundary');
  assert(hasErrorHandling, `No error handling found in ${fileName}`);
  
  // Check for TypeScript types
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    const hasTypes = content.includes(': ') || content.includes('interface ') || content.includes('type ');
    assert(hasTypes, `No TypeScript types found in ${fileName}`);
  }
  
  // Check for comments (documentation)
  const hasComments = content.includes('//') || content.includes('/*');
  assert(hasComments, `No comments/documentation found in ${fileName}`);
  
  // Check for proper imports
  const hasImports = content.includes('import ') || content.includes('require(');
  assert(hasImports, `No imports found in ${fileName}`);
}

function validateComponentStructure() {
  log('Validating component structure...');
  
  const componentFiles = fs.readdirSync('src/components').filter(file => 
    file.endsWith('.tsx') || file.endsWith('.ts')
  );
  
  componentFiles.forEach(file => {
    const filePath = path.join('src/components', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for proper React component structure
    const isReactComponent = content.includes('React') || content.includes('useState') || content.includes('useEffect');
    assert(isReactComponent, `Not a proper React component: ${file}`);
    
    // Check for proper exports
    const hasDefaultExport = content.includes('export default');
    assert(hasDefaultExport, `No default export found in component: ${file}`);
    
    // Check for proper JSX
    const hasJSX = content.includes('<') && content.includes('>');
    assert(hasJSX, `No JSX found in component: ${file}`);
  });
}

function validateBackendStructure() {
  log('Validating backend structure...');
  
  if (fs.existsSync('src/backend')) {
    const backendFiles = fs.readdirSync('src/backend').filter(file => 
      file.endsWith('.ts') || file.endsWith('.js')
    );
    
    backendFiles.forEach(file => {
      const filePath = path.join('src/backend', file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for proper class/function exports
      const hasExports = content.includes('export ') || content.includes('export default');
      assert(hasExports, `No exports found in backend file: ${file}`);
      
      // Check for proper error handling
      const hasErrorHandling = content.includes('try') || content.includes('catch') || content.includes('throw');
      assert(hasErrorHandling, `No error handling found in backend file: ${file}`);
      
      // Check for logging
      const hasLogging = content.includes('console.log') || content.includes('logger') || content.includes('log');
      assert(hasLogging, `No logging found in backend file: ${file}`);
    });
  }
}

function validateTestingStructure() {
  log('Validating testing structure...');
  
  const testFiles = [];
  
  function findTestFiles(dir) {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findTestFiles(fullPath);
        } else if (item.includes('.test.') || item.includes('.spec.')) {
          testFiles.push(fullPath);
        }
      }
    }
  }
  
  findTestFiles('src');
  
  testFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    // Check for proper test structure
    const hasDescribe = content.includes('describe(');
    const hasIt = content.includes('it(');
    const hasExpect = content.includes('expect(');
    
    assert(hasDescribe, `No describe block found in test: ${fileName}`);
    assert(hasIt, `No it block found in test: ${fileName}`);
    assert(hasExpect, `No expect statement found in test: ${fileName}`);
    
    // Check for multiple test cases
    const testCaseCount = (content.match(/it\(/g) || []).length;
    assert(testCaseCount >= 2, `Insufficient test cases in ${fileName}: ${testCaseCount} (minimum 2)`);
  });
}

function validateDocumentation() {
  log('Validating documentation...');
  
  // Check README
  const readmeContent = fs.readFileSync('README.md', 'utf8');
  
  const requiredSections = [
    '# ChipForge',
    '## Features',
    '## Installation',
    '## Usage',
    '## API',
    '## Contributing',
  ];
  
  requiredSections.forEach(section => {
    const hasSection = readmeContent.includes(section);
    assert(hasSection, `Required README section missing: ${section}`);
  });
  
  // Check for code examples
  const hasCodeExamples = readmeContent.includes('```') && readmeContent.includes('```');
  assert(hasCodeExamples, 'No code examples found in README');
  
  // Check for proper formatting
  const hasProperFormatting = readmeContent.includes('##') && readmeContent.includes('- ');
  assert(hasProperFormatting, 'README lacks proper formatting');
}

function validateConfiguration() {
  log('Validating configuration files...');
  
  // Check TypeScript config
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  assert(tsConfig.compilerOptions, 'TypeScript config missing compilerOptions');
  assert(tsConfig.compilerOptions.strict !== false, 'TypeScript strict mode should be enabled');
  
  // Check Vite config
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  assert(viteConfig.includes('defineConfig'), 'Vite config should use defineConfig');
  assert(viteConfig.includes('react'), 'Vite config should include React plugin');
  
  // Check ESLint config
  const eslintConfig = fs.readFileSync('eslint.config.js', 'utf8');
  assert(eslintConfig.includes('eslint'), 'ESLint config should include eslint rules');
  
  // Check Tailwind config
  const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
  assert(tailwindConfig.includes('content'), 'Tailwind config should have content paths');
  assert(tailwindConfig.includes('theme'), 'Tailwind config should have theme configuration');
}

// Main validation runner
async function runProductionValidation() {
  log('🚀 Starting Production Standards Validation...');
  log('Enforcing enterprise-grade code quality standards');
  
  const validations = [
    validateFileStructure,
    validatePackageJson,
    validateSourceFiles,
    validateComponentStructure,
    validateBackendStructure,
    validateTestingStructure,
    validateDocumentation,
    validateConfiguration,
  ];
  
  for (const validation of validations) {
    try {
      await validation();
    } catch (error) {
      log(`Validation failed: ${validation.name} - ${error.message}`, 'error');
      validationResults.failed++;
      validationResults.errors.push({
        validation: validation.name,
        error: error.message
      });
    }
  }
  
  // Generate comprehensive report
  const endTime = Date.now();
  const duration = endTime - validationResults.startTime;
  
  log('\n📊 Production Validation Results:');
  log(`✅ Passed: ${validationResults.passed}`);
  log(`❌ Failed: ${validationResults.failed}`);
  log(`⚠️  Warnings: ${validationResults.warnings.length}`);
  log(`⏱️  Duration: ${duration}ms`);
  
  if (validationResults.errors.length > 0) {
    log('\n❌ Production Standards Violations:');
    validationResults.errors.forEach(({ validation, error }) => {
      log(`  - ${validation}: ${error}`, 'error');
    });
  }
  
  if (validationResults.warnings.length > 0) {
    log('\n⚠️  Production Standards Warnings:');
    validationResults.warnings.forEach(warning => {
      log(`  - ${warning}`, 'warning');
    });
  }
  
  const successRate = (validationResults.passed / (validationResults.passed + validationResults.failed)) * 100;
  log(`\n📈 Production Standards Compliance: ${successRate.toFixed(1)}%`);
  
  if (validationResults.failed === 0) {
    log('🎉 All production standards met! Code is ready for production deployment.', 'success');
    process.exit(0);
  } else {
    log('🚨 Production standards violations found. Code is NOT ready for production.', 'error');
    log('Please fix all violations before deployment.', 'error');
    process.exit(1);
  }
}

// Run validation
runProductionValidation().catch(error => {
  log(`Fatal validation error: ${error.message}`, 'error');
  process.exit(1);
}); 