import { create } from 'zustand';

export type CellPin = {
  id: string;
  name: string;
  direction: 'input' | 'output' | 'inout' | 'power' | 'ground';
  position: { x: number; y: number };
  signalType?: 'data' | 'clock' | 'reset' | 'enable' | 'power' | 'ground';
};

export type CellInstance = {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  pins?: CellPin[];
};

export type Route = {
  id: string;
  startPin: string;
  endPin: string;
  path: Array<{ x: number; y: number; layer: string }>;
  width: number;
  layer: string;
  status: 'pending' | 'routed' | 'failed' | 'drc_violation';
  drcViolations?: string[];
};

export type ToolMode = 'select' | 'place' | 'move' | 'delete' | 'measure' | 'route' | 'via' | 'text';

interface LayoutEditorState {
  cells: CellInstance[];
  routes: Route[];
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
  exportLayout: () => { cells: CellInstance[]; routes: Route[] };
  importLayout: (data: { cells: CellInstance[]; routes?: Route[] }) => void;
  duplicateCell: (id: string) => void;
  addRoute: (route: Route) => void;
  updateRoute: (id: string, route: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  clearRoutes: () => void;
}

export const useLayoutEditorStore = create<LayoutEditorState>((set, get) => ({
  cells: [],
  routes: [],
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
  clearLayout: () => set({ cells: [], routes: [], selectedId: null }),
  exportLayout: () => {
    const state = get();
    return { cells: state.cells, routes: state.routes };
  },
  importLayout: (data) => set({ 
    cells: data.cells, 
    routes: data.routes || [], 
    selectedId: null 
  }),
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
  addRoute: (route) => set((s) => ({ routes: [...s.routes, route] })),
  updateRoute: (id, route) =>
    set((s) => ({
      routes: s.routes.map((r) => (r.id === id ? { ...r, ...route } : r))
    })),
  deleteRoute: (id) =>
    set((s) => ({
      routes: s.routes.filter((r) => r.id !== id)
    })),
  clearRoutes: () => set({ routes: [] }),
})); 