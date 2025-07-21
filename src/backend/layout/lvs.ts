import type { Cell } from '../../components/chipforge/layout-designer/CellLibrary';

export type LVSResultType = 'error' | 'warning' | 'info';

export interface LVSResult {
  type: LVSResultType;
  message: string;
  net?: string;
  cellIds?: string[];
}

// Dummy schematic netlist extraction from Verilog (placeholder for real parser)
export function extractNetlistFromSchematic(verilog: string): Record<string, string[]> {
  // TODO: Replace with real Verilog parser
  // For now, extract lines like: assign net = ...;
  const netlist: Record<string, string[]> = {};
  const assignRegex = /assign\s+(\w+)\s*=\s*(.*);/g;
  let match;
  while ((match = assignRegex.exec(verilog)) !== null) {
    const net = match[1];
    // Dummy: treat all RHS tokens as cell IDs
    const cells = match[2].split(/[^\w]+/).filter(Boolean);
    netlist[net] = cells;
  }
  return netlist;
}

// Layout netlist extraction from cell instances
export function extractNetlistFromLayout(cells: Cell[]): Record<string, string[]> {
  const netlist: Record<string, string[]> = {};
  cells.forEach(cell => {
    (cell.pins || []).forEach(pin => {
      if (!netlist[pin.name]) netlist[pin.name] = [];
      netlist[pin.name].push(cell.id);
    });
  });
  return netlist;
}

// Compare schematic and layout netlists
export function compareNetlists(
  schematic: Record<string, string[]>,
  layout: Record<string, string[]>
): LVSResult[] {
  const results: LVSResult[] = [];
  // Check for missing nets
  for (const net in schematic) {
    if (!layout[net]) {
      results.push({ type: 'error', message: `Net ${net} missing in layout`, net });
    }
  }
  // Check for extra nets
  for (const net in layout) {
    if (!schematic[net]) {
      results.push({ type: 'warning', message: `Extra net ${net} in layout`, net });
    }
  }
  // Check for mismatched connections
  for (const net in schematic) {
    if (layout[net]) {
      const schCells = new Set(schematic[net]);
      const layCells = new Set(layout[net]);
      for (const cell of schCells) {
        if (!layCells.has(cell)) {
          results.push({ type: 'error', message: `Cell ${cell} missing from net ${net} in layout`, net, cellIds: [cell] });
        }
      }
      for (const cell of layCells) {
        if (!schCells.has(cell)) {
          results.push({ type: 'warning', message: `Cell ${cell} extra in net ${net} in layout`, net, cellIds: [cell] });
        }
      }
    }
  }
  if (results.length === 0) {
    results.push({ type: 'info', message: 'LVS passed: layout matches schematic' });
  }
  return results;
} 