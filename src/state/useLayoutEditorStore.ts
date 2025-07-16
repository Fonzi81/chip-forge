import { create } from 'zustand';

export type CellInstance = {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
};

export type ToolMode = 'select' | 'place' | 'move' | 'delete';

interface LayoutEditorState {
  cells: CellInstance[];
  selectedCellType: string;
  selectedId: string | null;
  tool: ToolMode;
  setTool: (tool: ToolMode) => void;
  setSelectedCellType: (type: string) => void;
  addCell: (cell: CellInstance) => void;
  moveCell: (id: string, x: number, y: number) => void;
  rotateCell: (id: string) => void;
  deleteCell: (id: string) => void;
  setSelected: (id: string | null) => void;
  clearLayout: () => void;
  exportLayout: () => { cells: CellInstance[] };
  importLayout: (data: { cells: CellInstance[] }) => void;
  duplicateCell: (id: string) => void;
}

export const useLayoutEditorStore = create<LayoutEditorState>((set, get) => ({
  cells: [],
  selectedCellType: 'AND2_X1',
  selectedId: null,
  tool: 'place',
  setTool: (tool) => set({ tool }),
  setSelectedCellType: (type) => set({ selectedCellType: type }),
  addCell: (cell) => set((s) => ({ cells: [...s.cells, cell] })),
  moveCell: (id, x, y) =>
    set((s) => ({
      cells: s.cells.map((c) => (c.id === id ? { ...c, x, y } : c))
    })),
  rotateCell: (id) =>
    set((s) => ({
      cells: s.cells.map((c) =>
        c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c
      )
    })),
  deleteCell: (id) =>
    set((s) => ({
      cells: s.cells.filter((c) => c.id !== id),
      selectedId: null
    })),
  setSelected: (id) => set({ selectedId: id }),
  clearLayout: () => set({ cells: [], selectedId: null }),
  exportLayout: () => {
    const state = get();
    return { cells: state.cells };
  },
  importLayout: (data) => set({ cells: data.cells, selectedId: null }),
  duplicateCell: (id: string) => {
    const state = get();
    const cell = state.cells.find(c => c.id === id);
    if (cell) {
      const newCell = {
        ...cell,
        id: `cell-${Date.now()}`,
        x: cell.x + 100,
        y: cell.y + 100
      };
      set(s => ({ cells: [...s.cells, newCell] }));
    }
  },
})); 