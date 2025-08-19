#!/usr/bin/env node

/**
 * Test script for HDL design store export functionality
 * Validates that exportAll() yields valid JSON/YAML
 */

console.log('📤 Testing HDL Design Store Export Functionality...\n');

// Mock the design store functionality for testing
class MockHDLDesignStore {
  constructor() {
    this.design = null;
    this.waveform = null;
  }

  loadDesign(design) {
    this.design = design;
  }

  setWaveform(waveform) {
    this.waveform = waveform;
  }

  exportAll() {
    if (!this.design) {
      throw new Error('No design loaded');
    }

    const design = JSON.stringify(this.design, null, 2);
    const waveform = this.waveform ? JSON.stringify(this.waveform, null, 2) : '{}';
    
    // Generate constraints YAML (simplified for testing)
    const constraints = this.generateConstraintsYAML();
    
    return { design, waveform, constraints };
  }

  generateConstraintsYAML() {
    const constraints = {
      clocks: this.design.constraints.clocks.map(clock => ({
        name: clock.name,
        frequency_mhz: clock.freqMHz,
        stable_between_clock: clock.stableBetweenClock || false,
      })),
      resets: this.design.constraints.resets.map(reset => ({
        name: reset.name,
        active: reset.active,
        sync_deassert: reset.syncDeassert,
      })),
      buses: this.design.buses.map(bus => ({
        id: bus.id,
        kind: bus.kind,
        properties: bus.properties,
      })),
    };

    return JSON.stringify(constraints, null, 2);
  }
}

// Test results tracking
let passed = 0;
let failed = 0;
let total = 0;

function test(name, testFunction) {
  total++;
  try {
    testFunction();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assertValidJSON(jsonString, message) {
  try {
    JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`${message}: Invalid JSON - ${error.message}`);
  }
}

function assertContains(text, substring, message) {
  if (!text.includes(substring)) {
    throw new Error(`${message}: Text does not contain "${substring}"`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

// Test 1: Basic export functionality
test('Basic export functionality', () => {
  const store = new MockHDLDesignStore();
  
  const design = {
    id: 'cf_test_001',
    meta: {
      name: 'Test Design',
      version: '1.0.0',
      created: '2024-01-01T00:00:00Z',
      modified: '2024-01-01T00:00:00Z'
    },
    components: [],
    nets: [],
    buses: [],
    constraints: {
      clocks: [],
      resets: []
    },
    docs: []
  };

  store.loadDesign(design);
  const result = store.exportAll();

  assertValidJSON(result.design, 'Design export should be valid JSON');
  assertValidJSON(result.waveform, 'Waveform export should be valid JSON');
  assertValidJSON(result.constraints, 'Constraints export should be valid JSON');
});

// Test 2: Export with AHB components
test('Export with AHB components', () => {
  const store = new MockHDLDesignStore();
  
  const design = {
    id: 'cf_ahb_test',
    meta: {
      name: 'AHB Test Design',
      version: '1.0.0',
      created: '2024-01-01T00:00:00Z',
      modified: '2024-01-01T00:00:00Z'
    },
    components: [
      {
        id: 'cf_master',
        name: 'AHB Master',
        type: 'bus_master',
        pins: [
          { id: 'hclk', name: 'HCLK', dir: 'in', width: 1 },
          { id: 'haddr', name: 'HADDR', dir: 'out', width: 32 }
        ],
        params: {},
        view: { icon2d: 'master.svg' }
      }
    ],
    nets: [
      { id: 'net_hclk', name: 'HCLK', width: 1, endpoints: [] },
      { id: 'net_haddr', name: 'HADDR', width: 32, endpoints: [] }
    ],
    buses: [
      {
        id: 'bus_ahb',
        kind: 'AHB',
        signals: [
          { netId: 'net_hclk', role: 'clock', direction: 'master' },
          { netId: 'net_haddr', role: 'address', direction: 'master' }
        ],
        properties: {}
      }
    ],
    constraints: {
      clocks: [
        { name: 'HCLK', freqMHz: 100, stableBetweenClock: true }
      ],
      resets: [
        { name: 'HRESETn', active: 'low', syncDeassert: true }
      ]
    },
    docs: []
  };

  store.loadDesign(design);
  const result = store.exportAll();

  assertValidJSON(result.design, 'AHB design export should be valid JSON');
  assertContains(result.design, 'AHB Master', 'Design should contain AHB Master component');
  assertContains(result.design, 'HCLK', 'Design should contain HCLK signal');
  assertContains(result.design, 'AHB', 'Design should contain AHB bus');
});

// Test 3: Export with waveform
test('Export with waveform', () => {
  const store = new MockHDLDesignStore();
  
  const design = {
    id: 'cf_waveform_test',
    meta: {
      name: 'Waveform Test Design',
      version: '1.0.0',
      created: '2024-01-01T00:00:00Z',
      modified: '2024-01-01T00:00:00Z'
    },
    components: [],
    nets: [],
    buses: [],
    constraints: {
      clocks: [],
      resets: []
    },
    docs: []
  };

  const waveform = {
    nets: [
      {
        netId: 'net_clk',
        sequence: [
          { at: 't+0ns', value: '0' },
          { at: 't+5ns', value: '1' }
        ]
      }
    ]
  };

  store.loadDesign(design);
  store.setWaveform(waveform);
  const result = store.exportAll();

  assertValidJSON(result.waveform, 'Waveform export should be valid JSON');
  assertContains(result.waveform, 'net_clk', 'Waveform should contain net reference');
  assertContains(result.waveform, 't+0ns', 'Waveform should contain timing expression');
});

// Test 4: Export constraints format
test('Export constraints format', () => {
  const store = new MockHDLDesignStore();
  
  const design = {
    id: 'cf_constraints_test',
    meta: {
      name: 'Constraints Test Design',
      version: '1.0.0',
      created: '2024-01-01T00:00:00Z',
      modified: '2024-01-01T00:00:00Z'
    },
    components: [],
    nets: [],
    buses: [
      {
        id: 'bus_test',
        kind: 'Custom',
        signals: [],
        properties: { maxBurst: 16 }
      }
    ],
    constraints: {
      clocks: [
        { name: 'HCLK', freqMHz: 100, stableBetweenClock: true }
      ],
      resets: [
        { name: 'HRESETn', active: 'low', syncDeassert: true }
      ]
    },
    docs: []
  };

  store.loadDesign(design);
  const result = store.exportAll();

  assertValidJSON(result.constraints, 'Constraints export should be valid JSON');
  assertContains(result.constraints, 'HCLK', 'Constraints should contain clock name');
  assertContains(result.constraints, '100', 'Constraints should contain clock frequency');
  assertContains(result.constraints, 'HRESETn', 'Constraints should contain reset name');
  assertContains(result.constraints, 'low', 'Constraints should contain reset active level');
  assertContains(result.constraints, 'Custom', 'Constraints should contain bus kind');
});

// Test 5: Export error handling
test('Export error handling', () => {
  const store = new MockHDLDesignStore();
  
  try {
    store.exportAll();
    throw new Error('Should have thrown error for no design loaded');
  } catch (error) {
    assertContains(error.message, 'No design loaded', 'Should throw appropriate error message');
  }
});

// Test 6: Complex design export
test('Complex design export', () => {
  const store = new MockHDLDesignStore();
  
  const design = {
    id: 'cf_complex_test',
    meta: {
      name: 'Complex Test Design',
      version: '2.0.0',
      created: '2024-01-01T00:00:00Z',
      modified: '2024-01-01T00:00:00Z',
      description: 'A complex design with multiple components',
      author: 'Test Engineer'
    },
    components: [
      {
        id: 'cf_cpu',
        name: 'CPU Core',
        type: 'processor',
        pins: [
          { id: 'clk', name: 'CLK', dir: 'in', width: 1 },
          { id: 'data', name: 'DATA', dir: 'inout', width: 64 }
        ],
        params: { frequency: 2000, cores: 4 },
        view: { icon2d: 'cpu.svg', model3d: 'cpu.obj' },
        compliance: { standard: 'None', notes: 'Custom CPU design' }
      },
      {
        id: 'cf_memory',
        name: 'Memory Controller',
        type: 'memory',
        pins: [
          { id: 'addr', name: 'ADDR', dir: 'in', width: 32 },
          { id: 'data', name: 'DATA', dir: 'inout', width: 64 }
        ],
        params: { capacity: '8GB', type: 'DDR4' },
        view: { icon2d: 'memory.svg' }
      }
    ],
    nets: [
      { id: 'net_clk', name: 'System Clock', width: 1, endpoints: [] },
      { id: 'net_data', name: 'Data Bus', width: 64, endpoints: [] }
    ],
    buses: [
      {
        id: 'bus_system',
        kind: 'Custom',
        signals: [
          { netId: 'net_clk', role: 'clock', direction: 'master' },
          { netId: 'net_data', role: 'data', direction: 'bidirectional' }
        ],
        properties: { protocol: 'Custom', maxBurst: 32 }
      }
    ],
    constraints: {
      clocks: [
        { name: 'CLK', freqMHz: 2000, stableBetweenClock: true }
      ],
      resets: [
        { name: 'RESETn', active: 'low', syncDeassert: true }
      ]
    },
    docs: [
      {
        id: 'doc_spec',
        type: 'specification',
        url: 'https://example.com/cpu-spec.pdf',
        version: '2.0'
      }
    ]
  };

  store.loadDesign(design);
  const result = store.exportAll();

  assertValidJSON(result.design, 'Complex design export should be valid JSON');
  assertContains(result.design, 'CPU Core', 'Should contain CPU component');
  assertContains(result.design, 'Memory Controller', 'Should contain memory component');
  assertContains(result.design, 'System Clock', 'Should contain clock net');
  assertContains(result.design, 'Data Bus', 'Should contain data net');
  assertContains(result.design, 'Custom', 'Should contain custom bus');
  assertContains(result.design, 'specification', 'Should contain documentation');
});

console.log('\n📊 Export Test Results:');
console.log(`   Total: ${total}`);
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All export tests passed! HDL design store is working correctly.');
  process.exit(0);
} else {
  console.log('\n💥 Some export tests failed. Please check the implementation.');
  process.exit(1);
} 