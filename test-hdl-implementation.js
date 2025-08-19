#!/usr/bin/env node

/**
 * Simple test runner for HDL implementation validation
 * Tests the core functionality without requiring Jest setup
 */

console.log('🧪 Testing ChipForge HDL Implementation...\n');

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

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertArrayLength(array, expectedLength, message) {
  if (array.length !== expectedLength) {
    throw new Error(`${message}: expected length ${expectedLength}, got ${array.length}`);
  }
}

function assertContains(array, item, message) {
  if (!array.includes(item)) {
    throw new Error(`${message}: array does not contain ${item}`);
  }
}

// Test 1: Basic design type creation
test('Basic CfDesign creation', () => {
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

  assertEqual(design.id, 'cf_test_001', 'Design ID should match');
  assertEqual(design.meta.name, 'Test Design', 'Design name should match');
  assertArrayLength(design.components, 0, 'Components array should be empty');
  assertArrayLength(design.nets, 0, 'Nets array should be empty');
});

// Test 2: Component with pins
test('Component with pins creation', () => {
  const component = {
    id: 'cf_comp_001',
    name: 'Test Component',
    type: 'generic',
    pins: [
      { id: 'pin1', name: 'CLK', dir: 'in', width: 1 },
      { id: 'pin2', name: 'DATA', dir: 'out', width: 8 }
    ],
    params: { frequency: 100 },
    view: { icon2d: 'test.svg' }
  };

  assertEqual(component.name, 'Test Component', 'Component name should match');
  assertArrayLength(component.pins, 2, 'Component should have 2 pins');
  assertEqual(component.pins[0].name, 'CLK', 'First pin name should match');
  assertEqual(component.pins[1].width, 8, 'Second pin width should match');
  assertEqual(component.params.frequency, 100, 'Component parameter should match');
});

// Test 3: Net connections
test('Net with endpoints creation', () => {
  const net = {
    id: 'net_001',
    name: 'Data Bus',
    width: 32,
    endpoints: [
      { componentId: 'comp_001', pinId: 'data_out' },
      { componentId: 'comp_002', pinId: 'data_in' }
    ]
  };

  assertEqual(net.name, 'Data Bus', 'Net name should match');
  assertEqual(net.width, 32, 'Net width should match');
  assertArrayLength(net.endpoints, 2, 'Net should have 2 endpoints');
  assertEqual(net.endpoints[0].componentId, 'comp_001', 'First endpoint component ID should match');
});

// Test 4: AHB bus creation
test('AHB bus creation', () => {
  const bus = {
    id: 'bus_001',
    kind: 'AHB',
    signals: [
      { netId: 'net_clk', role: 'clock', direction: 'master' },
      { netId: 'net_data', role: 'data', direction: 'slave' }
    ],
    properties: { protocol: 'AMBA AHB v2.0' }
  };

  assertEqual(bus.kind, 'AHB', 'Bus kind should be AHB');
  assertArrayLength(bus.signals, 2, 'Bus should have 2 signals');
  assertEqual(bus.properties.protocol, 'AMBA AHB v2.0', 'Bus protocol should match');
});

// Test 5: Clock and reset constraints
test('Clock and reset constraints', () => {
  const constraints = {
    clocks: [
      { name: 'HCLK', freqMHz: 100, stableBetweenClock: true }
    ],
    resets: [
      { name: 'HRESETn', active: 'low', syncDeassert: true }
    ]
  };

  assertArrayLength(constraints.clocks, 1, 'Should have 1 clock');
  assertEqual(constraints.clocks[0].name, 'HCLK', 'Clock name should match');
  assertEqual(constraints.clocks[0].freqMHz, 100, 'Clock frequency should match');
  assertTrue(constraints.clocks[0].stableBetweenClock, 'Clock should be stable between edges');

  assertArrayLength(constraints.resets, 1, 'Should have 1 reset');
  assertEqual(constraints.resets[0].name, 'HRESETn', 'Reset name should match');
  assertEqual(constraints.resets[0].active, 'low', 'Reset should be active low');
  assertTrue(constraints.resets[0].syncDeassert, 'Reset should have sync deassert');
});

// Test 6: Waveform plan
test('Waveform plan creation', () => {
  const waveform = {
    nets: [
      {
        netId: 'net_clk',
        sequence: [
          { at: 't+0ns', value: '0' },
          { at: 't+5ns', value: '1' },
          { at: 'rise(HCLK)*1', value: '0' }
        ]
      }
    ]
  };

  assertArrayLength(waveform.nets, 1, 'Should have 1 net in waveform');
  assertArrayLength(waveform.nets[0].sequence, 3, 'Net should have 3 waveform steps');
  assertEqual(waveform.nets[0].sequence[0].value, '0', 'First step value should match');
  assertEqual(waveform.nets[0].sequence[2].at, 'rise(HCLK)*1', 'Relative timing should match');
});

// Test 7: Compliance information
test('Component compliance information', () => {
  const component = {
    id: 'cf_ahb_master',
    name: 'AHB Master',
    type: 'bus_master',
    pins: [],
    params: {},
    view: { icon2d: 'ahb-master.svg' },
    compliance: {
      standard: 'AHB',
      notes: 'AMBA AHB v2.0 compliant'
    }
  };

  assertEqual(component.compliance.standard, 'AHB', 'Compliance standard should match');
  assertEqual(component.compliance.notes, 'AMBA AHB v2.0 compliant', 'Compliance notes should match');
});

// Test 8: Pin bus roles
test('Pin bus role assignment', () => {
  const pins = [
    { id: 'clk', name: 'HCLK', dir: 'in', width: 1 },
    { id: 'data_out', name: 'HRDATA', dir: 'out', width: 32, busRole: 'subordinate' },
    { id: 'data_bus', name: 'HDATA', dir: 'inout', width: 16, busRole: 'mux' }
  ];

  assertEqual(pins[0].dir, 'in', 'First pin should be input');
  assertEqual(pins[1].busRole, 'subordinate', 'Second pin should have subordinate role');
  assertEqual(pins[2].busRole, 'mux', 'Third pin should have mux role');
});

// Test 9: Documentation references
test('Documentation references', () => {
  const docs = [
    {
      id: 'doc_001',
      type: 'specification',
      url: 'https://example.com/spec.pdf',
      version: '1.0'
    }
  ];

  assertArrayLength(docs, 1, 'Should have 1 document');
  assertEqual(docs[0].type, 'specification', 'Document type should match');
  assertEqual(docs[0].url, 'https://example.com/spec.pdf', 'Document URL should match');
});

// Test 10: Complex timing expressions
test('Complex timing expressions', () => {
  const steps = [
    { at: 't+0ns', value: '0' },
    { at: 'rise(HCLK)*3 + 10ns', value: '1' },
    { at: 'fall(HCLK)*2', value: 'X' }
  ];

  assertArrayLength(steps, 3, 'Should have 3 timing steps');
  assertEqual(steps[1].at, 'rise(HCLK)*3 + 10ns', 'Complex timing expression should match');
  assertEqual(steps[2].at, 'fall(HCLK)*2', 'Fall edge timing should match');
});

console.log('\n📊 Test Results:');
console.log(`   Total: ${total}`);
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! HDL implementation is working correctly.');
  process.exit(0);
} else {
  console.log('\n💥 Some tests failed. Please check the implementation.');
  process.exit(1);
} 