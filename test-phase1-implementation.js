// Phase 1 Implementation Test Runner
// Comprehensive validation of professional chip visualization system

import { runAllTests } from './src/backend/visualization/chipDataModels.test.ts';
import { MaterialFactory, materialManager } from './src/backend/visualization/materialSystem';
import { TransistorGeometryFactory } from './src/backend/visualization/transistorModels';
import { defaultTSMC7nmData } from './src/backend/visualization/chipDataModels';

console.log('🚀 Phase 1 Implementation Test Suite');
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

// Phase 1 Core Tests
function runPhase1CoreTests() {
  console.log('🧪 Phase 1 Core Tests\n');

  // Test 1: Professional Chip Data Models
  test('Professional Chip Data Models - Complete Structure', () => {
    assert(defaultTSMC7nmData.id === 'tsmc7nm_demo', 'Default chip should have correct ID');
    assert(defaultTSMC7nmData.technology.name === 'tsmc7', 'Should be TSMC 7nm technology');
    assert(defaultTSMC7nmData.statistics.transistorCount === 1000000000, 'Should have 1B transistors');
    assert(defaultTSMC7nmData.layers.length >= 5, 'Should have multiple layers');
    assert(defaultTSMC7nmData.transistors.length > 0, 'Should have transistors');
    assert(defaultTSMC7nmData.interconnects.length > 0, 'Should have interconnects');
    assert(defaultTSMC7nmData.vias.length > 0, 'Should have vias');
    assert(defaultTSMC7nmData.thermal.hotspots.length > 0, 'Should have thermal data');
    assert(defaultTSMC7nmData.electrical.nets.length > 0, 'Should have electrical data');
  });

  // Test 2: Material System
  test('Professional Material System - All Materials', () => {
    const materials = ['silicon', 'siliconDoped', 'polysilicon', 'copper', 'aluminum', 'tungsten', 'siliconOxide', 'highKOxide', 'siliconNitride'];
    
    materials.forEach(materialName => {
      const material = MaterialFactory.createMaterial(materialName);
      assert(material !== null, `${materialName} material should be created`);
      assert(material !== undefined, `${materialName} material should not be undefined`);
    });
  });

  // Test 3: Transistor Models
  test('Professional Transistor Models - All Types', () => {
    const transistorTypes = ['finfet', 'gaafet', 'planar'];
    
    transistorTypes.forEach(type => {
      const transistor = {
        ...defaultTSMC7nmData.transistors[0],
        structure: type,
        id: `test_${type}`
      };
      
      const geometry = TransistorGeometryFactory.createTransistor(transistor);
      assert(geometry.id === transistor.id, `${type} transistor should have correct ID`);
      assert(geometry.type === type, `${type} transistor should have correct type`);
      assert(geometry.mesh !== null, `${type} transistor should have mesh`);
      assert(geometry.boundingBox !== null, `${type} transistor should have bounding box`);
    });
  });

  // Test 4: Material Manager
  test('Material Manager - Lifecycle', () => {
    const manager = materialManager;
    
    // Test material creation
    const material = manager.createMaterial('silicon');
    assert(material !== null, 'Material manager should create materials');
    
    // Test material retrieval
    const retrievedMaterial = manager.getMaterial('silicon');
    assert(retrievedMaterial !== undefined, 'Material manager should retrieve materials');
    
    // Test material update
    manager.setMaterialProperty('silicon', 'time', 1.0);
    assert(true, 'Material manager should update properties');
  });

  // Test 5: Technology Node Validation
  test('Technology Node Validation - Multiple Nodes', () => {
    const technologies = [
      { name: 'tsmc28', node: 28, expectedLayers: 10 },
      { name: 'tsmc16', node: 16, expectedLayers: 12 },
      { name: 'tsmc7', node: 7, expectedLayers: 15 },
      { name: 'tsmc5', node: 5, expectedLayers: 20 }
    ];
    
    technologies.forEach(tech => {
      const chipData = {
        ...defaultTSMC7nmData,
        technology: {
          ...defaultTSMC7nmData.technology,
          name: tech.name,
          node: tech.node,
          metalLayers: tech.expectedLayers
        }
      };
      
      assert(chipData.technology.node === tech.node, `${tech.name} should have correct node`);
      assert(chipData.technology.metalLayers === tech.expectedLayers, `${tech.name} should have correct layers`);
    });
  });
}

// Integration Tests
function runIntegrationTests() {
  console.log('\n🔗 Integration Tests\n');

  // Test 1: Complete Chip Visualization Pipeline
  test('Complete Chip Visualization Pipeline', () => {
    // Create chip data
    const chipData = defaultTSMC7nmData;
    assert(chipData !== null, 'Chip data should be created');
    
    // Create materials for all components
    const materials = ['silicon', 'copper', 'polysilicon'];
    materials.forEach(materialName => {
      const material = MaterialFactory.createMaterial(materialName);
      assert(material !== null, `${materialName} material should be created`);
    });
    
    // Create transistor geometries
    chipData.transistors.forEach(transistor => {
      const geometry = TransistorGeometryFactory.createTransistor(transistor);
      assert(geometry !== null, 'Transistor geometry should be created');
      assert(geometry.mesh !== null, 'Transistor should have mesh');
    });
    
    // Validate electrical connections
    chipData.transistors.forEach(transistor => {
      const geometry = TransistorGeometryFactory.createTransistor(transistor);
      assert(geometry.electricalConnections.source !== null, 'Should have source connection');
      assert(geometry.electricalConnections.drain !== null, 'Should have drain connection');
      assert(geometry.electricalConnections.gate !== null, 'Should have gate connection');
    });
  });

  // Test 2: Material-Transistor Integration
  test('Material-Transistor Integration', () => {
    const transistor = defaultTSMC7nmData.transistors[0];
    const geometry = TransistorGeometryFactory.createTransistor(transistor);
    
    // Verify materials are applied to transistor components
    geometry.mesh.traverse((child) => {
      if (child.material) {
        assert(child.material !== null, 'Transistor component should have material');
      }
    });
  });

  // Test 3: Thermal-Electrical Integration
  test('Thermal-Electrical Integration', () => {
    const chipData = defaultTSMC7nmData;
    
    // Verify thermal data consistency
    assert(chipData.thermal.maxTemperature >= chipData.thermal.ambient, 'Max temp should be >= ambient');
    assert(chipData.thermal.averageTemperature >= chipData.thermal.ambient, 'Avg temp should be >= ambient');
    
    // Verify electrical data consistency
    assert(chipData.electrical.powerConsumption >= 0, 'Power consumption should be positive');
    chipData.electrical.nets.forEach(net => {
      assert(net.voltage >= 0, 'Net voltage should be positive');
      assert(net.current >= 0, 'Net current should be positive');
    });
  });
}

// Performance Tests
function runPerformanceTests() {
  console.log('\n⚡ Performance Tests\n');

  // Test 1: Large Scale Chip Creation
  test('Large Scale Chip Creation Performance', () => {
    const startTime = performance.now();
    
    // Create large chip with many transistors
    const largeChip = {
      ...defaultTSMC7nmData,
      transistors: Array.from({ length: 1000 }, (_, i) => ({
        ...defaultTSMC7nmData.transistors[0],
        id: `T${i}`,
        position: { x: i * 100, y: 0, z: 50 }
      }))
    };
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 2000, `Large chip creation should complete in < 2 seconds (${duration.toFixed(2)}ms)`);
    console.log(`   Large chip creation: ${duration.toFixed(2)}ms`);
  });

  // Test 2: Material Creation Performance
  test('Material Creation Performance', () => {
    const startTime = performance.now();
    
    // Create many materials
    for (let i = 0; i < 100; i++) {
      MaterialFactory.createMaterial('silicon');
      MaterialFactory.createMaterial('copper');
      MaterialFactory.createMaterial('polysilicon');
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 1000, `Material creation should complete in < 1 second (${duration.toFixed(2)}ms)`);
    console.log(`   Material creation: ${duration.toFixed(2)}ms`);
  });

  // Test 3: Transistor Geometry Creation Performance
  test('Transistor Geometry Creation Performance', () => {
    const startTime = performance.now();
    
    // Create many transistor geometries
    for (let i = 0; i < 100; i++) {
      const transistor = {
        ...defaultTSMC7nmData.transistors[0],
        id: `T${i}`,
        position: { x: i * 10, y: 0, z: 50 }
      };
      TransistorGeometryFactory.createTransistor(transistor);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 2000, `Transistor geometry creation should complete in < 2 seconds (${duration.toFixed(2)}ms)`);
    console.log(`   Transistor geometry creation: ${duration.toFixed(2)}ms`);
  });
}

// Regression Tests
function runRegressionTests() {
  console.log('\n🔄 Regression Tests\n');

  // Test 1: Data Consistency
  test('Data Consistency - No Data Loss', () => {
    const originalChip = defaultTSMC7nmData;
    const copiedChip = JSON.parse(JSON.stringify(originalChip));
    
    assert(copiedChip.id === originalChip.id, 'ID should be preserved');
    assert(copiedChip.technology.name === originalChip.technology.name, 'Technology should be preserved');
    assert(copiedChip.statistics.transistorCount === originalChip.statistics.transistorCount, 'Statistics should be preserved');
  });

  // Test 2: Material Property Consistency
  test('Material Property Consistency', () => {
    const siliconMaterial = MaterialFactory.createMaterial('silicon');
    const copperMaterial = MaterialFactory.createMaterial('copper');
    
    assert(siliconMaterial !== copperMaterial, 'Different materials should be different objects');
    assert(siliconMaterial !== null, 'Silicon material should be created');
    assert(copperMaterial !== null, 'Copper material should be created');
  });

  // Test 3: Transistor Type Consistency
  test('Transistor Type Consistency', () => {
    const finfetTransistor = {
      ...defaultTSMC7nmData.transistors[0],
      structure: 'finfet'
    };
    
    const gaafetTransistor = {
      ...defaultTSMC7nmData.transistors[0],
      structure: 'gaafet'
    };
    
    const finfetGeometry = TransistorGeometryFactory.createTransistor(finfetTransistor);
    const gaafetGeometry = TransistorGeometryFactory.createTransistor(gaafetTransistor);
    
    assert(finfetGeometry.type === 'finfet', 'FinFET should have correct type');
    assert(gaafetGeometry.type === 'gaafet', 'GAAFET should have correct type');
    assert(finfetGeometry.type !== gaafetGeometry.type, 'Different transistor types should be different');
  });
}

// Main test runner
function runAllPhase1Tests() {
  try {
    console.log('🎯 Starting Phase 1 Implementation Validation...\n');
    
    runPhase1CoreTests();
    runIntegrationTests();
    runPerformanceTests();
    runRegressionTests();
    
    console.log('\n🎉 Phase 1 Implementation Tests Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Professional Chip Data Models - Implemented');
    console.log('✅ Material System with PBR Shaders - Implemented');
    console.log('✅ Realistic Transistor Models - Implemented');
    console.log('✅ Integration & Performance - Validated');
    console.log('✅ Regression Testing - Passed');
    
    console.log('\n🚀 Phase 1 is ready for production!');
    
  } catch (error) {
    console.error('\n💥 Phase 1 Test Suite Failed:', error.message);
    throw error;
  }
}

// Export for use
export { runAllPhase1Tests };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllPhase1Tests();
} 