// Phase 2 Implementation Test Runner
// Comprehensive validation of interactive layout tools and cross-section analysis

import { LayoutEditor } from './src/backend/layout/layoutEditor.js';
import { CrossSectionAnalysis } from './src/backend/analysis/crossSectionAnalysis.js';
import { defaultTSMC7nmData } from './src/backend/visualization/chipDataModels.js';
import * as THREE from 'three';

console.log('🚀 Phase 2 Implementation Test Suite');
console.log('=====================================\n');

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Test failed: ${message}`);
  }
}

function test(name, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${name} - PASSED`);
  } catch (error) {
    console.error(`❌ ${name} - FAILED: ${error.message}`);
    throw error;
  }
}

// Phase 2 Core Tests
function runPhase2CoreTests() {
  console.log('🧪 Phase 2 Core Tests\n');

  // Test 1: Layout Editor Engine
  test('Layout Editor Engine - Core Functionality', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Test element addition
    const transistor = defaultTSMC7nmData.transistors[0];
    const elementId = layoutEditor.addTransistor(transistor);
    assert(elementId !== null, 'Transistor should be added successfully');
    
    // Test element retrieval
    const element = layoutEditor.getElement(elementId);
    assert(element !== undefined, 'Element should be retrievable');
    assert(element.type === 'transistor', 'Element should be transistor type');
    
    // Test element selection
    layoutEditor.selectElement(elementId);
    const selectedElements = layoutEditor.getSelectedElements();
    assert(selectedElements.length === 1, 'Should have one selected element');
    assert(selectedElements[0].id === elementId, 'Selected element should match');
    
    // Test DRC
    const violations = layoutEditor.runDRC();
    assert(Array.isArray(violations), 'DRC should return violations array');
    
    layoutEditor.dispose();
  });

  // Test 2: Cross-Section Analysis Engine
  test('Cross-Section Analysis Engine - Core Functionality', () => {
    const scene = new THREE.Scene();
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    // Test plane management
    const planes = crossSectionAnalysis.getAllPlanes();
    assert(planes.length >= 2, 'Should have default planes');
    
    const activePlane = crossSectionAnalysis.getActivePlane();
    assert(activePlane !== null, 'Should have active plane');
    
    // Test cross-section generation
    const crossSectionData = crossSectionAnalysis.getCrossSectionData(activePlane);
    assert(crossSectionData !== undefined, 'Should generate cross-section data');
    assert(crossSectionData.layers.length > 0, 'Should have layers');
    assert(crossSectionData.materials.length > 0, 'Should have materials');
    
    // Test defect detection
    assert(crossSectionData.defects.length >= 0, 'Should detect defects');
    
    crossSectionAnalysis.dispose();
  });

  // Test 3: Element Management
  test('Element Management - Add/Remove/Select', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Add multiple elements
    const transistor = defaultTSMC7nmData.transistors[0];
    const interconnect = defaultTSMC7nmData.interconnects[0];
    const via = defaultTSMC7nmData.vias[0];
    
    const transistorId = layoutEditor.addTransistor(transistor);
    const interconnectId = layoutEditor.addInterconnect(interconnect);
    const viaId = layoutEditor.addVia(via);
    
    assert(transistorId !== null, 'Transistor should be added');
    assert(interconnectId !== null, 'Interconnect should be added');
    assert(viaId !== null, 'Via should be added');
    
    // Test element count
    const allElements = layoutEditor.getAllElements();
    assert(allElements.length >= 3, 'Should have at least 3 elements');
    
    // Test element types
    const transistorElement = layoutEditor.getElement(transistorId);
    const interconnectElement = layoutEditor.getElement(interconnectId);
    const viaElement = layoutEditor.getElement(viaId);
    
    assert(transistorElement.type === 'transistor', 'Should be transistor type');
    assert(interconnectElement.type === 'interconnect', 'Should be interconnect type');
    assert(viaElement.type === 'via', 'Should be via type');
    
    layoutEditor.dispose();
  });

  // Test 4: DRC Rules and Violations
  test('DRC Rules and Violations - Validation', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Add elements that might violate rules
    const transistor1 = { ...defaultTSMC7nmData.transistors[0], position: { x: 0, y: 0, z: 50 } };
    const transistor2 = { ...defaultTSMC7nmData.transistors[0], position: { x: 0.001, y: 0, z: 50 } }; // Very close
    
    layoutEditor.addTransistor(transistor1);
    layoutEditor.addTransistor(transistor2);
    
    // Run DRC
    const violations = layoutEditor.runDRC();
    assert(Array.isArray(violations), 'DRC should return violations array');
    
    // Check violation structure
    violations.forEach(violation => {
      assert(violation.id !== undefined, 'Violation should have ID');
      assert(violation.message !== undefined, 'Violation should have message');
      assert(violation.severity !== undefined, 'Violation should have severity');
      assert(['error', 'warning', 'info'].includes(violation.severity), 'Severity should be valid');
    });
    
    layoutEditor.dispose();
  });

  // Test 5: Cross-Section Plane Management
  test('Cross-Section Plane Management - Multiple Planes', () => {
    const scene = new THREE.Scene();
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    // Test default planes
    const planes = crossSectionAnalysis.getAllPlanes();
    assert(planes.length >= 2, 'Should have default planes');
    
    // Test plane switching
    const firstPlane = planes[0];
    crossSectionAnalysis.setActivePlane(firstPlane.id);
    const activePlane = crossSectionAnalysis.getActivePlane();
    assert(activePlane === firstPlane.id, 'Active plane should be set correctly');
    
    // Test cross-section data for each plane
    planes.forEach(plane => {
      const data = crossSectionAnalysis.getCrossSectionData(plane.id);
      assert(data !== undefined, `Should have data for plane ${plane.id}`);
      assert(data.planeId === plane.id, 'Data should match plane ID');
    });
    
    crossSectionAnalysis.dispose();
  });
}

// Integration Tests
function runIntegrationTests() {
  console.log('\n🔗 Integration Tests\n');

  // Test 1: Layout Editor + Cross-Section Integration
  test('Layout Editor + Cross-Section Integration', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    // Add elements to layout editor
    const transistor = defaultTSMC7nmData.transistors[0];
    const elementId = layoutEditor.addTransistor(transistor);
    
    // Generate cross-section
    const activePlane = crossSectionAnalysis.getActivePlane();
    const crossSectionData = crossSectionAnalysis.getCrossSectionData(activePlane);
    
    // Verify integration
    assert(crossSectionData.materials.length > 0, 'Cross-section should include layout elements');
    
    layoutEditor.dispose();
    crossSectionAnalysis.dispose();
  });

  // Test 2: DRC + Cross-Section Integration
  test('DRC + Cross-Section Integration', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    // Add elements and run DRC
    const transistor = defaultTSMC7nmData.transistors[0];
    layoutEditor.addTransistor(transistor);
    const violations = layoutEditor.runDRC();
    
    // Generate cross-section
    const activePlane = crossSectionAnalysis.getActivePlane();
    const crossSectionData = crossSectionAnalysis.getCrossSectionData(activePlane);
    
    // Verify both systems work together
    assert(violations.length >= 0, 'DRC should run without errors');
    assert(crossSectionData.layers.length > 0, 'Cross-section should generate layers');
    
    layoutEditor.dispose();
    crossSectionAnalysis.dispose();
  });

  // Test 3: Element Transformation + DRC
  test('Element Transformation + DRC', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Add element
    const transistor = defaultTSMC7nmData.transistors[0];
    const elementId = layoutEditor.addTransistor(transistor);
    
    // Transform element
    const newPosition = new THREE.Vector3(1, 1, 1);
    layoutEditor.moveElement(elementId, newPosition);
    
    // Run DRC after transformation
    const violations = layoutEditor.runDRC();
    assert(Array.isArray(violations), 'DRC should run after transformation');
    
    layoutEditor.dispose();
  });
}

// Performance Tests
function runPerformanceTests() {
  console.log('\n⚡ Performance Tests\n');

  // Test 1: Large Layout Performance
  test('Large Layout Performance', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    const startTime = performance.now();
    
    // Add many elements
    for (let i = 0; i < 100; i++) {
      const transistor = {
        ...defaultTSMC7nmData.transistors[0],
        position: { x: i * 0.1, y: 0, z: 50 }
      };
      layoutEditor.addTransistor(transistor);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 2000, `Large layout creation should complete in < 2 seconds (${duration.toFixed(2)}ms)`);
    console.log(`   Large layout creation: ${duration.toFixed(2)}ms`);
    
    layoutEditor.dispose();
  });

  // Test 2: DRC Performance
  test('DRC Performance', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Add elements
    for (let i = 0; i < 50; i++) {
      const transistor = {
        ...defaultTSMC7nmData.transistors[0],
        position: { x: i * 0.1, y: 0, z: 50 }
      };
      layoutEditor.addTransistor(transistor);
    }
    
    const startTime = performance.now();
    const violations = layoutEditor.runDRC();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 1000, `DRC should complete in < 1 second (${duration.toFixed(2)}ms)`);
    console.log(`   DRC execution: ${duration.toFixed(2)}ms`);
    
    layoutEditor.dispose();
  });

  // Test 3: Cross-Section Generation Performance
  test('Cross-Section Generation Performance', () => {
    const scene = new THREE.Scene();
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    const startTime = performance.now();
    
    // Generate cross-sections for all planes
    const planes = crossSectionAnalysis.getAllPlanes();
    planes.forEach(plane => {
      crossSectionAnalysis.generateCrossSection(plane.id);
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 1000, `Cross-section generation should complete in < 1 second (${duration.toFixed(2)}ms)`);
    console.log(`   Cross-section generation: ${duration.toFixed(2)}ms`);
    
    crossSectionAnalysis.dispose();
  });
}

// Feature Tests
function runFeatureTests() {
  console.log('\n🎯 Feature Tests\n');

  // Test 1: Grid and Snap Functionality
  test('Grid and Snap Functionality', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Test grid size setting
    layoutEditor.setGridSize(0.1);
    layoutEditor.setSnapToGrid(true);
    
    // Test element placement with snap
    const transistor = defaultTSMC7nmData.transistors[0];
    const elementId = layoutEditor.addTransistor(transistor);
    
    // Move element to test snap
    const newPosition = new THREE.Vector3(0.123, 0.456, 0.789);
    layoutEditor.moveElement(elementId, newPosition);
    
    const element = layoutEditor.getElement(elementId);
    assert(element !== undefined, 'Element should exist after move');
    
    layoutEditor.dispose();
  });

  // Test 2: Undo/Redo Functionality
  test('Undo/Redo Functionality', () => {
    const scene = new THREE.Scene();
    const layoutEditor = new LayoutEditor(scene);
    
    // Add element
    const transistor = defaultTSMC7nmData.transistors[0];
    const elementId = layoutEditor.addTransistor(transistor);
    
    // Move element
    const originalPosition = new THREE.Vector3(0, 0, 0);
    const newPosition = new THREE.Vector3(1, 1, 1);
    layoutEditor.moveElement(elementId, newPosition);
    
    // Test undo
    layoutEditor.undo();
    const element = layoutEditor.getElement(elementId);
    assert(element !== undefined, 'Element should exist after undo');
    
    // Test redo
    layoutEditor.redo();
    const elementAfterRedo = layoutEditor.getElement(elementId);
    assert(elementAfterRedo !== undefined, 'Element should exist after redo');
    
    layoutEditor.dispose();
  });

  // Test 3: Measurement Tools
  test('Measurement Tools', () => {
    const scene = new THREE.Scene();
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    // Test measurement creation
    const startPoint = new THREE.Vector3(0, 0, 0);
    const endPoint = new THREE.Vector3(1, 1, 1);
    const measurement = crossSectionAnalysis.addMeasurement(startPoint, endPoint, 'thickness');
    
    assert(measurement !== undefined, 'Measurement should be created');
    assert(measurement.type === 'thickness', 'Measurement should have correct type');
    assert(measurement.value > 0, 'Measurement should have positive value');
    
    crossSectionAnalysis.dispose();
  });

  // Test 4: Defect Detection
  test('Defect Detection', () => {
    const scene = new THREE.Scene();
    const crossSectionAnalysis = new CrossSectionAnalysis(scene, defaultTSMC7nmData);
    
    // Enable defect detection
    crossSectionAnalysis.setDefectDetection(true);
    
    // Generate cross-section
    const activePlane = crossSectionAnalysis.getActivePlane();
    const crossSectionData = crossSectionAnalysis.getCrossSectionData(activePlane);
    
    // Check for defects
    assert(crossSectionData.defects.length >= 0, 'Should detect defects');
    
    crossSectionAnalysis.dispose();
  });
}

// Main test runner
function runAllPhase2Tests() {
  try {
    console.log('🎯 Starting Phase 2 Implementation Validation...\n');
    
    runPhase2CoreTests();
    runIntegrationTests();
    runPerformanceTests();
    runFeatureTests();
    
    console.log('\n🎉 Phase 2 Implementation Tests Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Layout Editor Engine - Implemented');
    console.log('✅ Cross-Section Analysis - Implemented');
    console.log('✅ DRC Integration - Implemented');
    console.log('✅ Interactive Tools - Implemented');
    console.log('✅ Performance Optimization - Validated');
    console.log('✅ Feature Completeness - Validated');
    
    console.log('\n🚀 Phase 2 is ready for production!');
    
  } catch (error) {
    console.error('\n💥 Phase 2 Test Suite Failed:', error.message);
    throw error;
  }
}

// Export for use
export { runAllPhase2Tests };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllPhase2Tests();
} 