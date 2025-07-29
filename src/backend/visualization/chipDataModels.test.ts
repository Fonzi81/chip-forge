// Test suite for Professional Chip Data Models
// Comprehensive validation and regression testing

import { 
  defaultTSMC7nmData, 
  createChipData, 
  validateChipData,
  ProfessionalChipData,
  ChipTechnology 
} from './chipDataModels';
import { MaterialFactory } from './materialSystem';
import { TransistorGeometryFactory } from './transistorModels';

// Test utilities
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Test failed: ${message}`);
  }
}

function test(name: string, testFunction: () => void): void {
  try {
    testFunction();
    console.log(`✅ ${name} - PASSED`);
  } catch (error) {
    console.error(`❌ ${name} - FAILED: ${error}`);
    throw error;
  }
}

// Test suite
export function runChipDataModelTests(): void {
  console.log('🧪 Running Chip Data Model Tests...\n');

  // Test 1: Default data structure validation
  test('Default TSMC 7nm data structure validation', () => {
    assert(defaultTSMC7nmData.id === 'tsmc7nm_demo', 'ID should be correct');
    assert(defaultTSMC7nmData.name === 'TSMC 7nm Demo Chip', 'Name should be correct');
    assert(defaultTSMC7nmData.technology.name === 'tsmc7', 'Technology should be TSMC 7nm');
    assert(defaultTSMC7nmData.technology.node === 7, 'Node should be 7nm');
    assert(defaultTSMC7nmData.statistics.transistorCount === 1000000000, 'Should have 1B transistors');
    assert(defaultTSMC7nmData.layers.length > 0, 'Should have layers');
    assert(defaultTSMC7nmData.transistors.length > 0, 'Should have transistors');
    assert(defaultTSMC7nmData.interconnects.length > 0, 'Should have interconnects');
    assert(defaultTSMC7nmData.vias.length > 0, 'Should have vias');
  });

  // Test 2: Data validation function
  test('Chip data validation function', () => {
    assert(validateChipData(defaultTSMC7nmData), 'Valid data should pass validation');
    
    // Test invalid data
    const invalidData = { ...defaultTSMC7nmData, id: '' };
    assert(!validateChipData(invalidData), 'Invalid data should fail validation');
    
    const invalidData2 = { ...defaultTSMC7nmData, statistics: { ...defaultTSMC7nmData.statistics, transistorCount: -1 } };
    assert(!validateChipData(invalidData2), 'Negative transistor count should fail validation');
  });

  // Test 3: Chip data creation
  test('Chip data creation function', () => {
    const technology: ChipTechnology = {
      name: 'tsmc5',
      node: 5,
      minFeature: 5,
      metalLayers: 20,
      viaLayers: 19,
      transistorTypes: ['finfet', 'gaafet'],
      materials: {
        substrate: 'Si',
        gate: 'HKMG',
        interconnect: 'Cu',
        dielectric: 'Low-K'
      }
    };
    
    const newChip = createChipData(technology, 'Test Chip');
    assert(newChip.technology.name === 'tsmc5', 'Technology should be set correctly');
    assert(newChip.name === 'Test Chip', 'Name should be set correctly');
    assert(newChip.id.includes('tsmc5'), 'ID should include technology name');
    assert(validateChipData(newChip), 'Created chip should be valid');
  });

  // Test 4: Material system integration
  test('Material system integration', () => {
    // Test silicon material creation
    const siliconMaterial = MaterialFactory.createMaterial('silicon');
    assert(siliconMaterial !== null, 'Silicon material should be created');
    
    // Test copper material creation
    const copperMaterial = MaterialFactory.createMaterial('copper');
    assert(copperMaterial !== null, 'Copper material should be created');
    
    // Test oxide material creation
    const oxideMaterial = MaterialFactory.createMaterial('siliconOxide');
    assert(oxideMaterial !== null, 'Silicon oxide material should be created');
  });

  // Test 5: Transistor model creation
  test('Transistor model creation', () => {
    const transistor = defaultTSMC7nmData.transistors[0];
    const transistorGeometry = TransistorGeometryFactory.createTransistor(transistor);
    
    assert(transistorGeometry.id === transistor.id, 'Transistor ID should match');
    assert(transistorGeometry.type === transistor.structure, 'Transistor type should match');
    assert(transistorGeometry.mesh !== null, 'Transistor mesh should be created');
    assert(transistorGeometry.boundingBox !== null, 'Bounding box should be calculated');
    assert(transistorGeometry.electricalConnections.source !== null, 'Electrical connections should be defined');
    assert(transistorGeometry.electricalConnections.drain !== null, 'Electrical connections should be defined');
    assert(transistorGeometry.electricalConnections.gate !== null, 'Electrical connections should be defined');
  });

  // Test 6: Technology node validation
  test('Technology node validation', () => {
    const technologies: ChipTechnology[] = [
      { name: 'tsmc28', node: 28, minFeature: 28, metalLayers: 10, viaLayers: 9, transistorTypes: ['planar'], materials: { substrate: 'Si', gate: 'Poly-Si', interconnect: 'Al', dielectric: 'SiO2' } },
      { name: 'tsmc16', node: 16, minFeature: 16, metalLayers: 12, viaLayers: 11, transistorTypes: ['finfet'], materials: { substrate: 'Si', gate: 'HKMG', interconnect: 'Cu', dielectric: 'Low-K' } },
      { name: 'tsmc7', node: 7, minFeature: 7, metalLayers: 15, viaLayers: 14, transistorTypes: ['finfet', 'gaafet'], materials: { substrate: 'Si', gate: 'HKMG', interconnect: 'Cu', dielectric: 'Low-K' } },
      { name: 'tsmc5', node: 5, minFeature: 5, metalLayers: 20, viaLayers: 19, transistorTypes: ['gaafet', 'nanosheet'], materials: { substrate: 'Si', gate: 'HKMG', interconnect: 'Cu', dielectric: 'Low-K' } }
    ];
    
    technologies.forEach(tech => {
      const chip = createChipData(tech, `Test ${tech.name}`);
      assert(chip.technology.node === tech.node, `Node should match for ${tech.name}`);
      assert(chip.technology.minFeature === tech.minFeature, `Min feature should match for ${tech.name}`);
      assert(chip.technology.metalLayers === tech.metalLayers, `Metal layers should match for ${tech.name}`);
    });
  });

  // Test 7: Layer system validation
  test('Layer system validation', () => {
    const layers = defaultTSMC7nmData.layers;
    
    // Check layer ordering
    for (let i = 1; i < layers.length; i++) {
      assert(layers[i].level >= layers[i-1].level, 'Layers should be ordered by level');
    }
    
    // Check material properties
    layers.forEach(layer => {
      assert(layer.name.length > 0, 'Layer should have a name');
      assert(layer.thickness > 0, 'Layer should have positive thickness');
      assert(layer.color.length > 0, 'Layer should have a color');
      assert(layer.opacity >= 0 && layer.opacity <= 1, 'Opacity should be between 0 and 1');
    });
  });

  // Test 8: Thermal data validation
  test('Thermal data validation', () => {
    const thermal = defaultTSMC7nmData.thermal;
    
    assert(thermal.ambient >= 0, 'Ambient temperature should be positive');
    assert(thermal.maxTemperature >= thermal.ambient, 'Max temperature should be >= ambient');
    assert(thermal.averageTemperature >= thermal.ambient, 'Average temperature should be >= ambient');
    assert(thermal.averageTemperature <= thermal.maxTemperature, 'Average temperature should be <= max');
    
    thermal.hotspots.forEach(hotspot => {
      assert(hotspot.temperature >= thermal.ambient, 'Hotspot temperature should be >= ambient');
      assert(hotspot.power > 0, 'Hotspot power should be positive');
      assert(hotspot.area > 0, 'Hotspot area should be positive');
    });
  });

  // Test 9: Electrical data validation
  test('Electrical data validation', () => {
    const electrical = defaultTSMC7nmData.electrical;
    
    assert(electrical.powerConsumption >= 0, 'Power consumption should be positive');
    assert(electrical.nets.length > 0, 'Should have electrical nets');
    
    electrical.nets.forEach(net => {
      assert(net.id.length > 0, 'Net should have an ID');
      assert(net.name.length > 0, 'Net should have a name');
      assert(net.nodes.length > 0, 'Net should have nodes');
      assert(net.capacitance >= 0, 'Net capacitance should be positive');
      assert(net.resistance >= 0, 'Net resistance should be positive');
      assert(net.voltage >= 0, 'Net voltage should be positive');
    });
    
    electrical.voltageDomains.forEach(domain => {
      assert(domain.name.length > 0, 'Voltage domain should have a name');
      assert(domain.voltage > 0, 'Voltage should be positive');
      assert(domain.current >= 0, 'Current should be positive');
      assert(domain.power >= 0, 'Power should be positive');
    });
  });

  // Test 10: Manufacturing data validation
  test('Manufacturing data validation', () => {
    const manufacturing = defaultTSMC7nmData.manufacturing;
    
    assert(manufacturing.process.length > 0, 'Process should have a name');
    assert(manufacturing.maskCount > 0, 'Mask count should be positive');
    assert(manufacturing.yield >= 0 && manufacturing.yield <= 100, 'Yield should be between 0 and 100');
    assert(manufacturing.cost >= 0, 'Cost should be positive');
    assert(manufacturing.leadTime > 0, 'Lead time should be positive');
  });

  console.log('\n🎉 All Chip Data Model Tests Passed!');
}

// Performance test
export function runPerformanceTests(): void {
  console.log('\n⚡ Running Performance Tests...\n');

  // Test 1: Large chip data creation performance
  test('Large chip data creation performance', () => {
    const startTime = performance.now();
    
    // Create a large chip with many transistors
    const largeChip: ProfessionalChipData = {
      ...defaultTSMC7nmData,
      transistors: Array.from({ length: 1000 }, (_, i) => ({
        ...defaultTSMC7nmData.transistors[0],
        id: `T${i}`,
        position: { x: i * 100, y: 0, z: 50 }
      })),
      interconnects: Array.from({ length: 500 }, (_, i) => ({
        ...defaultTSMC7nmData.interconnects[0],
        id: `M${i}`,
        path: [{ x: i * 50, y: 0, z: 450 }, { x: (i + 1) * 50, y: 0, z: 450 }]
      }))
    };
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 1000, `Large chip creation should complete in < 1 second (${duration.toFixed(2)}ms)`);
    assert(validateChipData(largeChip), 'Large chip should be valid');
    console.log(`   Large chip creation: ${duration.toFixed(2)}ms`);
  });

  // Test 2: Material creation performance
  test('Material creation performance', () => {
    const startTime = performance.now();
    
    // Create many materials
    const materials = ['silicon', 'copper', 'aluminum', 'tungsten', 'siliconOxide', 'highKOxide'];
    for (let i = 0; i < 100; i++) {
      materials.forEach(material => {
        MaterialFactory.createMaterial(material);
      });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assert(duration < 500, `Material creation should complete in < 500ms (${duration.toFixed(2)}ms)`);
    console.log(`   Material creation: ${duration.toFixed(2)}ms`);
  });

  // Test 3: Transistor geometry creation performance
  test('Transistor geometry creation performance', () => {
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
    
    assert(duration < 1000, `Transistor geometry creation should complete in < 1 second (${duration.toFixed(2)}ms)`);
    console.log(`   Transistor geometry creation: ${duration.toFixed(2)}ms`);
  });

  console.log('\n🎉 All Performance Tests Passed!');
}

// Run all tests
export function runAllTests(): void {
  try {
    runChipDataModelTests();
    runPerformanceTests();
    console.log('\n🎯 All Tests Completed Successfully!');
  } catch (error) {
    console.error('\n💥 Test Suite Failed:', error);
    throw error;
  }
}

// Export for use in other modules
export default {
  runChipDataModelTests,
  runPerformanceTests,
  runAllTests
}; 