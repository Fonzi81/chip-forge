import { create } from 'zustand';

export interface HDLDesign {
  moduleName: string;
  description: string;
  io: { name: string; direction: 'input' | 'output'; width: number }[];
  verilog: string;
}

interface HDLDesignState {
  design: HDLDesign | null;
  setDesign: (design: HDLDesign) => void;
  clearDesign: () => void;
  loadFromLocalStorage: () => void;
}

const LOCAL_STORAGE_KEY = 'chipforge-hdl-design';

export const useHDLDesignStore = create<HDLDesignState>((set) => ({
  design: null,
  setDesign: (design) => {
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
})); 