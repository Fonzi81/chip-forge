import { validateAHB } from '../ahb-erc';
import { CfDesign, CfComponent, CfPin, CfNet, CfBus, CfConstraintSet, CfClock, CfReset } from '../../contracts/design-types';

// Import Jest globals explicitly
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('AHB ERC Validation', () => {
  let validAHBDesign: CfDesign;

  beforeEach(() => {
    validAHBDesign = {
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
            { id: 'hclk', name: 'HCLK', dir: 'in' as const, width: 1 },
            { id: 'hresetn', name: 'HRESETn', dir: 'in' as const, width: 1 },
            { id: 'haddr', name: 'HADDR', dir: 'out' as const, width: 32 },
            { id: 'hrdata', name: 'HRDATA', dir: 'in' as const, width: 32 },
            { id: 'hwdata', name: 'HWDATA', dir: 'out' as const, width: 32 },
            { id: 'htrans', name: 'HTRANS', dir: 'out' as const, width: 2 },
            { id: 'hready', name: 'HREADY', dir: 'in' as const, width: 1 },
            { id: 'hresp', name: 'HRESP', dir: 'in' as const, width: 2 },
            { id: 'hwrite', name: 'HWRITE', dir: 'out' as const, width: 1 },
            { id: 'hsize', name: 'HSIZE', dir: 'out' as const, width: 3 }
          ],
          params: {},
          view: { icon2d: 'master.svg' }
        },
        {
          id: 'cf_slave',
          name: 'AHB Slave',
          type: 'bus_slave',
          pins: [
            { id: 'hclk', name: 'HCLK', dir: 'in' as const, width: 1 },
            { id: 'hresetn', name: 'HRESETn', dir: 'in' as const, width: 1 },
            { id: 'haddr', name: 'HADDR', dir: 'in' as const, width: 32 },
            { id: 'hrdata', name: 'HRDATA', dir: 'out' as const, width: 32 },
            { id: 'hwdata', name: 'HWDATA', dir: 'in' as const, width: 32 },
            { id: 'htrans', name: 'HTRANS', dir: 'in' as const, width: 2 },
            { id: 'hready', name: 'HREADY', dir: 'out' as const, width: 1 },
            { id: 'hresp', name: 'HRESP', dir: 'out' as const, width: 2 },
            { id: 'hwrite', name: 'HWRITE', dir: 'in' as const, width: 1 },
            { id: 'hsize', name: 'HSIZE', dir: 'in' as const, width: 3 },
            { id: 'hsel', name: 'HSEL', dir: 'in' as const, width: 1 }
          ],
          params: {},
          view: { icon2d: 'slave.svg' }
        },
        {
          id: 'cf_decoder',
          name: 'Address Decoder',
          type: 'decoder',
          pins: [
            { id: 'haddr', name: 'HADDR', dir: 'in' as const, width: 32 },
            { id: 'hsel1', name: 'HSEL1', dir: 'out' as const, width: 1 },
            { id: 'hsel2', name: 'HSEL2', dir: 'out' as const, width: 1 }
          ],
          params: { addressRange: '1KB' },
          view: { icon2d: 'decoder.svg' }
        }
      ],
      nets: [
        { id: 'net_hclk', name: 'HCLK', width: 1, endpoints: [] },
        { id: 'net_hresetn', name: 'HRESETn', width: 1, endpoints: [] },
        { id: 'net_haddr', name: 'HADDR', width: 32, endpoints: [] },
        { id: 'net_hrdata', name: 'HRDATA', width: 32, endpoints: [] },
        { id: 'net_hwdata', name: 'HWDATA', width: 32, endpoints: [] },
        { id: 'net_htrans', name: 'HTRANS', width: 2, endpoints: [] },
        { id: 'net_hready', name: 'HREADY', width: 1, endpoints: [] },
        { id: 'net_hresp', name: 'HRESP', width: 2, endpoints: [] },
        { id: 'net_hwrite', name: 'HWRITE', width: 1, endpoints: [] },
        { id: 'net_hsize', name: 'HSIZE', width: 3, endpoints: [] },
        { id: 'net_hsel1', name: 'HSEL1', width: 1, endpoints: [] },
        { id: 'net_hsel2', name: 'HSEL2', width: 1, endpoints: [] }
      ],
      buses: [
        {
          id: 'bus_ahb',
          kind: 'AHB',
          signals: [
            { netId: 'net_hclk', role: 'clock', direction: 'master' },
            { netId: 'net_hresetn', role: 'reset', direction: 'master' },
            { netId: 'net_haddr', role: 'address', direction: 'master' },
            { netId: 'net_hrdata', role: 'read_data', direction: 'slave' },
            { netId: 'net_hwdata', role: 'write_data', direction: 'master' },
            { netId: 'net_htrans', role: 'transfer', direction: 'master' },
            { netId: 'net_hready', role: 'ready', direction: 'slave' },
            { netId: 'net_hresp', role: 'response', direction: 'slave' },
            { netId: 'net_hwrite', role: 'write', direction: 'master' },
            { netId: 'net_hsize', role: 'size', direction: 'master' },
            { netId: 'net_hsel1', role: 'select1', direction: 'slave' },
            { netId: 'net_hsel2', role: 'select2', direction: 'slave' }
          ],
          properties: {
            version: '2.0',
            supportsBurst: true,
            supportsSplit: false
          }
        }
      ],
      constraints: {
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
      },
      docs: []
    };
  });

  describe('Basic AHB Signal Validation', () => {
    it('should validate a complete AHB design', () => {
      const result = validateAHB(validAHBDesign);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should detect missing HCLK signal', () => {
      const designWithoutHCLK = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.filter(net => net.name !== 'HCLK')
      };
      const result = validateAHB(designWithoutHCLK);
      expect(result.errors).toContain('Missing required AHB signal: HCLK');
    });

    it('should detect missing HRESETn signal', () => {
      const designWithoutHRESETn = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.filter(net => net.name !== 'HRESETn')
      };
      const result = validateAHB(designWithoutHRESETn);
      expect(result.errors).toContain('Missing required AHB signal: HRESETn');
    });

    it('should detect missing HADDR signal', () => {
      const designWithoutHADDR = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.filter(net => net.name !== 'HADDR')
      };
      const result = validateAHB(designWithoutHADDR);
      expect(result.errors).toContain('Missing required AHB signal: HADDR');
    });

    it('should detect missing HREADY signal', () => {
      const designWithoutHREADY = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.filter(net => net.name !== 'HREADY')
      };
      const result = validateAHB(designWithoutHREADY);
      expect(result.errors).toContain('Missing required AHB signal: HREADY');
    });

    it('should detect missing HRESP signal', () => {
      const designWithoutHRESP = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.filter(net => net.name !== 'HRESP')
      };
      const result = validateAHB(designWithoutHRESP);
      expect(result.errors).toContain('Missing required AHB signal: HRESP');
    });
  });

  describe('Signal Width Validation', () => {
    it('should detect incorrect HADDR width', () => {
      const designWithWrongHADDR = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.map(net => 
          net.name === 'HADDR' ? { ...net, width: 16 } : net
        )
      };
      const result = validateAHB(designWithWrongHADDR);
      expect(result.errors).toContain('HADDR must be 32 bits, got 16');
    });

    it('should detect incorrect HTRANS width', () => {
      const designWithWrongHTRANS = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.map(net => 
          net.name === 'HTRANS' ? { ...net, width: 1 } : net
        )
      };
      const result = validateAHB(designWithWrongHTRANS);
      expect(result.errors).toContain('HTRANS must be 2 bits, got 1');
    });

    it('should detect incorrect HRESP width', () => {
      const designWithWrongHRESP = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.map(net => 
          net.name === 'HRESP' ? { ...net, width: 1 } : net
        )
      };
      const result = validateAHB(designWithWrongHRESP);
      expect(result.errors).toContain('HRESP must be 2 bits, got 1');
    });

    it('should detect incorrect HWRITE width', () => {
      const designWithWrongHWRITE = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.map(net => 
          net.name === 'HWRITE' ? { ...net, width: 2 } : net
        )
      };
      const result = validateAHB(designWithWrongHWRITE);
      expect(result.errors).toContain('HWRITE must be 1 bit, got 2');
    });

    it('should detect incorrect HSIZE width', () => {
      const designWithWrongHSIZE = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.map(net => 
          net.name === 'HSIZE' ? { ...net, width: 2 } : net
        )
      };
      const result = validateAHB(designWithWrongHSIZE);
      expect(result.errors).toContain('HSIZE must be 3 bits, got 2');
    });
  });

  describe('Data Bus Consistency', () => {
    it('should detect mismatched HRDATA/HWDATA widths', () => {
      const designWithMismatchedData = {
        ...validAHBDesign,
        nets: validAHBDesign.nets.map(net => {
          if (net.name === 'HRDATA') return { ...net, width: 32 };
          if (net.name === 'HWDATA') return { ...net, width: 64 };
          return net;
        })
      };
      const result = validateAHB(designWithMismatchedData);
      expect(result.errors).toContain('HRDATA and HWDATA must have the same width');
    });
  });

  describe('Decode Granularity', () => {
    it('should validate 1KB decode granularity', () => {
      const result = validateAHB(validAHBDesign);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid decode granularity', () => {
      const designWithInvalidDecode = {
        ...validAHBDesign,
        components: validAHBDesign.components.map(comp => {
          if (comp.id === 'cf_decoder') {
            return { ...comp, params: { addressRange: '512B' } };
          }
          return comp;
        })
      };
      const result = validateAHB(designWithInvalidDecode);
      expect(result.errors).toContain('Decode granularity must be at least 1KB, got 512B');
    });
  });

  describe('HSEL Signal Validation', () => {
    it('should detect missing HSEL signals for multiple slaves', () => {
      const designWithMultipleSlaves = {
        ...validAHBDesign,
        components: [
          ...validAHBDesign.components,
          {
            id: 'cf_slave2',
            name: 'AHB Slave 2',
            type: 'bus_slave',
            pins: [
              { id: 'hclk2', name: 'HCLK', dir: 'in' as const, width: 1 },
              { id: 'hsel2', name: 'HSEL2', dir: 'in' as const, width: 1 }
            ],
            params: {},
            view: { icon2d: 'slave2.svg' }
          }
        ]
      };
      const result = validateAHB(designWithMultipleSlaves);
      expect(result.errors).toContain('Multiple slaves detected but missing HSEL signals');
    });
  });

  describe('Reset Configuration', () => {
    it('should validate correct reset configuration', () => {
      const result = validateAHB(validAHBDesign);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect incorrect reset polarity', () => {
      const designWithWrongReset = {
        ...validAHBDesign,
        constraints: {
          ...validAHBDesign.constraints,
          resets: [
            {
              name: 'HRESETn',
              active: 'high' as const,
              syncDeassert: true
            }
          ]
        }
      };
      const result = validateAHB(designWithWrongReset);
      expect(result.errors).toContain('HRESETn must be active-low (active: "low")');
    });
  });

  describe('Clock Configuration', () => {
    it('should detect multiple clocks', () => {
      const designWithMultipleClocks = {
        ...validAHBDesign,
        constraints: {
          ...validAHBDesign.constraints,
          clocks: [
            { name: 'HCLK', freqMHz: 100, stableBetweenClock: true },
            { name: 'HCLK2', freqMHz: 200, stableBetweenClock: false }
          ]
        }
      };
      const result = validateAHB(designWithMultipleClocks);
      expect(result.errors).toContain('AHB requires single clock domain, found 2 clocks');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty design gracefully', () => {
      const emptyDesign: CfDesign = {
        id: 'empty',
        meta: { name: 'Empty', version: '1.0.0', created: '', modified: '' },
        components: [],
        nets: [],
        buses: [],
        constraints: { clocks: [], resets: [] },
        docs: []
      };
      const result = validateAHB(emptyDesign);
      expect(result.errors).toContain('No AHB components found');
    });

    it('should handle design without AHB components', () => {
      const nonAHBDesign = {
        ...validAHBDesign,
        buses: []
      };
      const result = validateAHB(nonAHBDesign);
      expect(result.errors).toContain('No AHB bus found');
    });
  });
}); 