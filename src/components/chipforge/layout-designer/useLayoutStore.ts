import { create } from 'zustand';
import { Cell, Wire, Viewport, Point, CellType, createCell } from './CellLibrary';

interface LayoutState {
  // Data
  cells: Cell[];
  wires: Wire[];
  viewport: Viewport;
  
  // UI State
  selectedCellType: CellType | null;
  currentTool: 'select' | 'place' | 'wire' | 'pan';
  selectedCell: string | null;
  selectedWire: string | null;
  
  // Actions
  addCell: (cell: Cell) => void;
  updateCell: (id: string, updates: Partial<Cell>) => void;
  removeCell: (id: string) => void;
  addWire: (wire: Wire) => void;
  removeWire: (id: string) => void;
  setViewport: (viewport: Viewport) => void;
  setSelectedCellType: (cellType: CellType | null) => void;
  setCurrentTool: (tool: 'select' | 'place' | 'wire' | 'pan') => void;
  setSelectedCell: (id: string | null) => void;
  setSelectedWire: (id: string | null) => void;
  
  // Utility actions
  createCellAtPosition: (cellType: CellType, x: number, y: number) => void;
  clearSelection: () => void;
  resetViewport: () => void;
  exportLayout: () => { cells: Cell[]; wires: Wire[] };
  importLayout: (data: { cells: Cell[]; wires: Wire[] }) => void;
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // Initial state
  cells: [],
  wires: [],
  viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
  selectedCellType: null,
  currentTool: 'select',
  selectedCell: null,
  selectedWire: null,

  // Actions
  addCell: (cell: Cell) => {
    set(state => ({
      cells: [...state.cells, cell]
    }));
  },

  updateCell: (id: string, updates: Partial<Cell>) => {
    set(state => ({
      cells: state.cells.map(cell => 
        cell.id === id ? { ...cell, ...updates } : cell
      )
    }));
  },

  removeCell: (id: string) => {
    set(state => {
      const cellToRemove = state.cells.find(cell => cell.id === id);
      return {
        cells: state.cells.filter(cell => cell.id !== id),
        wires: state.wires.filter(wire => 
          !wire.path.some(point => 
            cellToRemove?.pins.some(pin => 
              pin.x + cellToRemove.x === point.x && pin.y + cellToRemove.y === point.y
            )
          )
        )
      };
    });
  },

  addWire: (wire: Wire) => {
    set(state => ({
      wires: [...state.wires, wire]
    }));
  },

  removeWire: (id: string) => {
    set(state => ({
      wires: state.wires.filter(wire => wire.id !== id)
    }));
  },

  setViewport: (viewport: Viewport) => {
    set({ viewport });
  },

  setSelectedCellType: (cellType: CellType | null) => {
    set({ selectedCellType: cellType });
  },

  setCurrentTool: (tool: 'select' | 'place' | 'wire' | 'pan') => {
    set({ currentTool: tool });
  },

  setSelectedCell: (id: string | null) => {
    set({ selectedCell: id });
  },

  setSelectedWire: (id: string | null) => {
    set({ selectedWire: id });
  },

  // Utility actions
  createCellAtPosition: (cellType: CellType, x: number, y: number) => {
    const cell = createCell(cellType, x, y);
    get().addCell(cell);
  },

  clearSelection: () => {
    set({ selectedCell: null, selectedWire: null });
  },

  resetViewport: () => {
    set({ viewport: { pan: { x: 0, y: 0 }, zoom: 1 } });
  },

  exportLayout: () => {
    const state = get();
    return {
      cells: state.cells,
      wires: state.wires
    };
  },

  importLayout: (data: { cells: Cell[]; wires: Wire[] }) => {
    set({
      cells: data.cells,
      wires: data.wires
    });
  }
})); 