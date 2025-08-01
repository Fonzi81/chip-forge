import { create } from 'zustand';

export interface HDLComponent {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
}

export interface HDLWire {
  from: { nodeId: string; port: string };
  to: { nodeId: string; port: string };
}

export interface HDLDesign {
  moduleName: string;
  description: string;
  io: { name: string; direction: 'input' | 'output'; width: number }[];
  verilog: string;
  components: HDLComponent[];
  wires: HDLWire[];
}

interface HDLDesignState {
  design: HDLDesign | null;
  setDesign: (design: HDLDesign) => void;
  setDesignFromWizard: (design: HDLDesign) => void; // alias for test/wizard compatibility
  clearDesign: () => void;
  loadFromLocalStorage: () => void;
  addComponent: (component: HDLComponent) => void;
  removeComponent: (id: string) => void;
  updateComponentPosition: (id: string, x: number, y: number) => void;
  addWire: (wire: HDLWire) => void;
  removeWire: (wire: HDLWire) => void;
  exportNetlist: () => any;
}

const LOCAL_STORAGE_KEY = 'chipforge-hdl-design';

export const useHDLDesignStore = create<HDLDesignState>((set, get) => ({
  design: null,
  setDesign: (design) => {
    set({ design });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(design));
  },
  setDesignFromWizard: (design) => {
    set({ design });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(design));
  },
  clearDesign: () => {
    set({ design: null });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
  loadFromLocalStorage: () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) set({ design: JSON.parse(data) });
  },
  addComponent: (component) => {
    set((state) => {
      if (!state.design) return state;
      const updated = { ...state.design, components: [...state.design.components, component] };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { design: updated };
    });
  },
  removeComponent: (id) => {
    set((state) => {
      if (!state.design) return state;
      const updated = { ...state.design, components: state.design.components.filter(c => c.id !== id), wires: state.design.wires.filter(w => w.from.nodeId !== id && w.to.nodeId !== id) };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { design: updated };
    });
  },
  updateComponentPosition: (id, x, y) => {
    set((state) => {
      if (!state.design) return state;
      const updated = { ...state.design, components: state.design.components.map(c => c.id === id ? { ...c, x, y } : c) };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { design: updated };
    });
  },
  addWire: (wire) => {
    set((state) => {
      if (!state.design) return state;
      // Prevent duplicate wires
      const exists = state.design.wires.some(w => w.from.nodeId === wire.from.nodeId && w.from.port === wire.from.port && w.to.nodeId === wire.to.nodeId && w.to.port === wire.to.port);
      if (exists) return state;
      const updated = { ...state.design, wires: [...state.design.wires, wire] };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { design: updated };
    });
  },
  removeWire: (wire) => {
    set((state) => {
      if (!state.design) return state;
      const updated = { ...state.design, wires: state.design.wires.filter(w => !(w.from.nodeId === wire.from.nodeId && w.from.port === wire.from.port && w.to.nodeId === wire.to.nodeId && w.to.port === wire.to.port)) };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { design: updated };
    });
  },
  exportNetlist: () => {
    const { design } = get();
    if (!design) return null;
    // Export a design.json style netlist
    return {
      module: design.moduleName,
      description: design.description,
      io: design.io,
      components: design.components,
      wires: design.wires
    };
  }
})); 