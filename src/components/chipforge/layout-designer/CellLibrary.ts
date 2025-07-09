export interface Point {
  x: number;
  y: number;
}

export interface Pin {
  name: string;
  x: number;
  y: number;
  direction: 'input' | 'output' | 'inout';
  signalType?: 'data' | 'clock' | 'reset' | 'enable' | 'power' | 'ground';
}

export interface Cell {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pins: Pin[];
  category?: CellCategory;
  description?: string;
}

export interface Wire {
  id: string;
  name: string;
  path: Point[];
  width: number;
  netType: 'signal' | 'power' | 'clock' | 'reset';
}

export interface Viewport {
  pan: Point;
  zoom: number;
}

export type CellCategory = 'logic' | 'memory' | 'io' | 'custom' | 'power';

export interface CellTemplate {
  width: number;
  height: number;
  pins: Pin[];
  category: CellCategory;
  description: string;
  symbol?: string; // Unicode symbol for display
}

// Enhanced cell templates with categories and descriptions
export const CELL_TEMPLATES: Record<string, CellTemplate> = {
  // Logic Gates
  'AND2_X1': {
    width: 80,
    height: 60,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 40, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '2-input AND gate',
    symbol: '&'
  },
  'AND3_X1': {
    width: 80,
    height: 80,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 35, direction: 'input', signalType: 'data' },
      { name: 'C', x: 0, y: 50, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 35, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '3-input AND gate',
    symbol: '&'
  },
  'NAND2_X1': {
    width: 80,
    height: 60,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 40, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '2-input NAND gate',
    symbol: '⊼'
  },
  'OR2_X1': {
    width: 80,
    height: 60,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 40, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '2-input OR gate',
    symbol: '≥1'
  },
  'NOR2_X1': {
    width: 80,
    height: 60,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 40, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '2-input NOR gate',
    symbol: '⊽'
  },
  'XOR2_X1': {
    width: 80,
    height: 60,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 40, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '2-input XOR gate',
    symbol: '=1'
  },
  'XNOR2_X1': {
    width: 80,
    height: 60,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'B', x: 0, y: 40, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 80, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: '2-input XNOR gate',
    symbol: '='
  },
  'INV_X1': {
    width: 60,
    height: 40,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 60, y: 20, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: 'Inverter',
    symbol: '1'
  },
  'BUF_X1': {
    width: 60,
    height: 40,
    pins: [
      { name: 'A', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'Z', x: 60, y: 20, direction: 'output', signalType: 'data' }
    ],
    category: 'logic',
    description: 'Buffer',
    symbol: '1'
  },

  // Memory Elements
  'DFF_X1': {
    width: 100,
    height: 80,
    pins: [
      { name: 'D', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'CLK', x: 0, y: 40, direction: 'input', signalType: 'clock' },
      { name: 'Q', x: 100, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'memory',
    description: 'D Flip-Flop',
    symbol: 'D'
  },
  'DFF_R_X1': {
    width: 100,
    height: 100,
    pins: [
      { name: 'D', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'CLK', x: 0, y: 35, direction: 'input', signalType: 'clock' },
      { name: 'RST', x: 0, y: 50, direction: 'input', signalType: 'reset' },
      { name: 'Q', x: 100, y: 35, direction: 'output', signalType: 'data' }
    ],
    category: 'memory',
    description: 'D Flip-Flop with Reset',
    symbol: 'D'
  },
  'LATCH_X1': {
    width: 100,
    height: 80,
    pins: [
      { name: 'D', x: 0, y: 20, direction: 'input', signalType: 'data' },
      { name: 'EN', x: 0, y: 40, direction: 'input', signalType: 'enable' },
      { name: 'Q', x: 100, y: 30, direction: 'output', signalType: 'data' }
    ],
    category: 'memory',
    description: 'D Latch',
    symbol: 'D'
  },

  // I/O Elements
  'INPUT_X1': {
    width: 60,
    height: 40,
    pins: [
      { name: 'I', x: 60, y: 20, direction: 'output', signalType: 'data' }
    ],
    category: 'io',
    description: 'Input Port',
    symbol: 'I'
  },
  'OUTPUT_X1': {
    width: 60,
    height: 40,
    pins: [
      { name: 'O', x: 0, y: 20, direction: 'input', signalType: 'data' }
    ],
    category: 'io',
    description: 'Output Port',
    symbol: 'O'
  },
  'CLOCK_X1': {
    width: 60,
    height: 40,
    pins: [
      { name: 'CLK', x: 60, y: 20, direction: 'output', signalType: 'clock' }
    ],
    category: 'io',
    description: 'Clock Generator',
    symbol: '⏰'
  },

  // Power Elements
  'VDD_X1': {
    width: 40,
    height: 40,
    pins: [
      { name: 'VDD', x: 20, y: 40, direction: 'output', signalType: 'power' }
    ],
    category: 'power',
    description: 'Power Supply',
    symbol: 'VDD'
  },
  'VSS_X1': {
    width: 40,
    height: 40,
    pins: [
      { name: 'VSS', x: 20, y: 0, direction: 'output', signalType: 'ground' }
    ],
    category: 'power',
    description: 'Ground',
    symbol: 'VSS'
  }
} as const;

export type CellType = keyof typeof CELL_TEMPLATES;

// Cell categories for organization
export const CELL_CATEGORIES: Record<CellCategory, { name: string; description: string; color: string }> = {
  logic: { name: 'Logic Gates', description: 'Basic logic operations', color: '#3B82F6' },
  memory: { name: 'Memory Elements', description: 'Flip-flops and latches', color: '#10B981' },
  io: { name: 'I/O Elements', description: 'Input/output ports', color: '#F59E0B' },
  power: { name: 'Power Elements', description: 'Power and ground connections', color: '#EF4444' },
  custom: { name: 'Custom Cells', description: 'User-defined cells', color: '#8B5CF6' }
};

// Validation functions
export function validatePinConnection(fromPin: Pin, toPin: Pin): boolean {
  // Can't connect output to output
  if (fromPin.direction === 'output' && toPin.direction === 'output') {
    return false;
  }
  
  // Can't connect input to input
  if (fromPin.direction === 'input' && toPin.direction === 'input') {
    return false;
  }
  
  // Power signals should only connect to power pins
  if (fromPin.signalType === 'power' && toPin.signalType !== 'power') {
    return false;
  }
  
  if (fromPin.signalType === 'ground' && toPin.signalType !== 'ground') {
    return false;
  }
  
  return true;
}

export function getCellByCategory(category: CellCategory): CellType[] {
  return Object.entries(CELL_TEMPLATES)
    .filter(([_, template]) => template.category === category)
    .map(([type, _]) => type as CellType);
}

export function getCellTemplate(cellType: CellType) {
  return CELL_TEMPLATES[cellType];
}

export function createCell(cellType: CellType, x: number, y: number, name?: string): Cell {
  const template = getCellTemplate(cellType);
  return {
    id: `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || `${cellType}_${Date.now()}`,
    type: cellType,
    x,
    y,
    width: template.width,
    height: template.height,
    pins: [...template.pins],
    category: template.category,
    description: template.description
  };
}

// Custom cell creation
export function createCustomCell(
  name: string,
  width: number,
  height: number,
  pins: Pin[],
  x: number,
  y: number,
  description?: string
): Cell {
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type: 'CUSTOM',
    x,
    y,
    width,
    height,
    pins: [...pins],
    category: 'custom',
    description: description || 'Custom cell'
  };
}

// Utility functions
export function getPinPosition(cell: Cell, pinName: string): Point | null {
  const pin = cell.pins.find(p => p.name === pinName);
  if (!pin) return null;
  
  return {
    x: cell.x + pin.x,
    y: cell.y + pin.y
  };
}

export function findCellAtPosition(cells: Cell[], x: number, y: number): Cell | null {
  return cells.find(cell => 
    x >= cell.x && x <= cell.x + cell.width &&
    y >= cell.y && y <= cell.y + cell.height
  ) || null;
}

export function findPinAtPosition(cells: Cell[], x: number, y: number): { cell: Cell; pin: Pin } | null {
  for (const cell of cells) {
    for (const pin of cell.pins) {
      const pinX = cell.x + pin.x;
      const pinY = cell.y + pin.y;
      
      // Check if click is within pin area (5px radius)
      const distance = Math.sqrt((x - pinX) ** 2 + (y - pinY) ** 2);
      if (distance <= 5) {
        return { cell, pin };
      }
    }
  }
  return null;
} 