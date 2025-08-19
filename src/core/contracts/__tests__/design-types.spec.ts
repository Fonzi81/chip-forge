import { 
  CfDesign, 
  CfComponent, 
  CfPin, 
  CfNet, 
  CfBus, 
  CfConstraintSet, 
  CfClock, 
  CfReset, 
  CfWaveformPlan, 
  WaveStep,
  CfCompliance,
  CfDocRef 
} from '../design-types';

// Import Jest globals explicitly
import { describe, it, expect } from '@jest/globals';

describe('Design Types', () => {
  describe('CfDesign', () => {
    it('should create a valid design with all required fields', () => {
      const design: CfDesign = {
        id: 'cf_test_design_001',
        meta: {
          name: 'Test Design',
          version: '1.0.0',
          created: '2024-01-01T00:00:00Z',
          modified: '2024-01-01T00:00:00Z',
          description: 'A test design for validation',
          author: 'Test User'
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

      expect(design.id).toBe('cf_test_design_001');
      expect(design.meta.name).toBe('Test Design');
      expect(design.meta.version).toBe('1.0.0');
      expect(design.components).toEqual([]);
      expect(design.nets).toEqual([]);
      expect(design.buses).toEqual([]);
      expect(design.constraints.clocks).toEqual([]);
      expect(design.constraints.resets).toEqual([]);
    });
  });

  describe('CfComponent', () => {
    it('should create a valid component with pins and parameters', () => {
      const component: CfComponent = {
        id: 'cf_comp_001',
        name: 'Test Component',
        type: 'generic',
        pins: [
          {
            id: 'pin1',
            name: 'CLK',
            dir: 'in',
            width: 1
          },
          {
            id: 'pin2',
            name: 'DATA',
            dir: 'inout',
            width: 8
          }
        ],
        params: {
          frequency: 100,
          enable: true,
          mode: 'normal'
        },
        view: {
          icon2d: 'test-icon.svg'
        }
      };

      expect(component.id).toBe('cf_comp_001');
      expect(component.name).toBe('Test Component');
      expect(component.pins).toHaveLength(2);
      expect(component.pins[0].name).toBe('CLK');
      expect(component.pins[1].width).toBe(8);
      expect(component.params.frequency).toBe(100);
      expect(component.params.enable).toBe(true);
    });

    it('should support compliance information', () => {
      const component: CfComponent = {
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

      expect(component.compliance?.standard).toBe('AHB');
      expect(component.compliance?.notes).toBe('AMBA AHB v2.0 compliant');
    });
  });

  describe('CfPin', () => {
    it('should create pins with correct directions', () => {
      const inputPin: CfPin = {
        id: 'pin_in',
        name: 'INPUT',
        dir: 'in',
        width: 1
      };

      const outputPin: CfPin = {
        id: 'pin_out',
        name: 'OUTPUT',
        dir: 'out',
        width: 8
      };

      expect(inputPin.dir).toBe('in');
      expect(outputPin.dir).toBe('out');
      expect(inputPin.width).toBe(1);
      expect(outputPin.width).toBe(8);
    });

    it('should support bus roles', () => {
      const masterPin: CfPin = {
        id: 'pin_master',
        name: 'HADDR',
        dir: 'out',
        width: 32,
        busRole: 'manager'
      };

      const slavePin: CfPin = {
        id: 'pin_slave',
        name: 'HRDATA',
        dir: 'in',
        width: 32,
        busRole: 'subordinate'
      };

      expect(masterPin.busRole).toBe('manager');
      expect(slavePin.busRole).toBe('subordinate');
    });

    it('should support net connections', () => {
      const connectedPin: CfPin = {
        id: 'pin_connected',
        name: 'CLK',
        dir: 'in',
        width: 1,
        netId: 'net_clk'
      };

      expect(connectedPin.netId).toBe('net_clk');
    });
  });

  describe('CfNet', () => {
    it('should create nets with endpoints', () => {
      const net: CfNet = {
        id: 'net_data',
        name: 'DATA_BUS',
        width: 32,
        endpoints: [
          { componentId: 'comp1', pinId: 'pin1' },
          { componentId: 'comp2', pinId: 'pin2' }
        ]
      };

      expect(net.id).toBe('net_data');
      expect(net.name).toBe('DATA_BUS');
      expect(net.width).toBe(32);
      expect(net.endpoints).toHaveLength(2);
      expect(net.endpoints[0].componentId).toBe('comp1');
    });
  });

  describe('CfBus', () => {
    it('should create AHB bus with signals', () => {
      const bus: CfBus = {
        id: 'bus_ahb',
        kind: 'AHB',
        signals: [
          { netId: 'net_hclk', role: 'clock', direction: 'master' },
          { netId: 'net_haddr', role: 'address', direction: 'master' }
        ],
        properties: {
          version: '2.0',
          supportsBurst: true
        }
      };

      expect(bus.kind).toBe('AHB');
      expect(bus.signals).toHaveLength(2);
      expect(bus.properties.version).toBe('2.0');
    });
  });

  describe('CfConstraintSet', () => {
    it('should create constraints with clocks and resets', () => {
      const constraints: CfConstraintSet = {
        clocks: [
          {
            name: 'HCLK',
            freqMHz: 100,
            stableBetweenClock: true
          }
        ],
        resets: [
          {
            name: 'HRESETn',
            active: 'low',
            syncDeassert: true
          }
        ]
      };

      expect(constraints.clocks).toHaveLength(1);
      expect(constraints.clocks[0].name).toBe('HCLK');
      expect(constraints.clocks[0].freqMHz).toBe(100);
      expect(constraints.clocks[0].stableBetweenClock).toBe(true);
      expect(constraints.resets[0].active).toBe('low');
    });
  });

  describe('CfWaveformPlan', () => {
    it('should create waveform plans with steps', () => {
      const waveform: CfWaveformPlan = {
        nets: [
          {
            netId: 'net_clk',
            sequence: [
              { at: '0ns', value: '0' },
              { at: '5ns', value: '1' },
              { at: '10ns', value: '0' }
            ]
          }
        ]
      };

      expect(waveform.nets).toHaveLength(1);
      expect(waveform.nets[0].sequence).toHaveLength(3);
      expect(waveform.nets[0].sequence[1].value).toBe('1');
    });
  });

  describe('WaveStep', () => {
    it('should support different value types', () => {
      const steps: WaveStep[] = [
        { at: '0ns', value: '0' },
        { at: '5ns', value: '1' },
        { at: '10ns', value: 'X' },
        { at: '15ns', value: 'Z' },
        { at: '20ns', value: 42 }
      ];

      expect(steps[0].value).toBe('0');
      expect(steps[1].value).toBe('1');
      expect(steps[2].value).toBe('X');
      expect(steps[3].value).toBe('Z');
      expect(steps[4].value).toBe(42);
    });

    it('should support timing expressions', () => {
      const step: WaveStep = {
        at: 'rise(HCLK)*3',
        value: '1'
      };

      expect(step.at).toBe('rise(HCLK)*3');
      expect(step.value).toBe('1');
    });
  });

  describe('CfCompliance', () => {
    it('should specify compliance standards', () => {
      const compliance: CfCompliance = {
        standard: 'AHB',
        notes: 'AMBA AHB v2.0 compliant with burst support'
      };

      expect(compliance.standard).toBe('AHB');
      expect(compliance.notes).toContain('AMBA AHB v2.0');
    });
  });

  describe('CfDocRef', () => {
    it('should reference documentation', () => {
      const docRef: CfDocRef = {
        id: 'doc_ahb_spec',
        type: 'specification',
        url: 'https://developer.arm.com/documentation/ihi0011/latest/',
        version: '2.0',
        content: 'AMBA AHB Protocol Specification'
      };

      expect(docRef.id).toBe('doc_ahb_spec');
      expect(docRef.type).toBe('specification');
      expect(docRef.url).toContain('developer.arm.com');
      expect(docRef.version).toBe('2.0');
      expect(docRef.content).toBe('AMBA AHB Protocol Specification');
    });
  });
}); 