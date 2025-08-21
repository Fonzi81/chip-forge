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

export interface WaveformSignal {
  signal: string;
  pattern: string;
  annotations: string;
  category: 'clock' | 'reset' | 'input' | 'output' | 'control';
}

export interface WaveformData {
  signals: WaveformSignal[];
  cycles: number;
  metadata: {
    designName: string;
    description: string;
    clockFrequency?: number;
    resetType?: 'async' | 'sync';
  };
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
  waveform: Record<string, Record<number, 0 | 1>>;
  waveformData: WaveformData;
  testbenchVerilog: string;
  setWaveformSignal: (signal: string, values: Record<number, 0 | 1>) => void;
  setWaveformData: (data: WaveformData) => void;
  generateWaveformJSON: () => string;
  generateTestbench: () => void;
  generateNaturalLanguageHints: () => string[];
  // --- Added for EnhancedHDLGenerator integration ---
  hdlOutput: string;
  hdlScore: number;
  setHDL: (code: string) => void;
  setHDLScore: (score: number) => void;
  simResults: Record<string, number[]>;
  setSimResults: (results: Record<string, number[]>) => void;
  simulationScore: number;
  setSimulationScore: (score: number) => void;
  // --- Guided Mode Support ---
  guidedMode: {
    isActive: boolean;
    currentStep: number;
    completedSteps: number[];
  };
  setGuidedMode: (isActive: boolean) => void;
  setGuidedStep: (step: number) => void;
  completeGuidedStep: (step: number) => void;
  resetGuidedMode: () => void;
}

const LOCAL_STORAGE_KEY = 'chipforge-hdl-design';
const GUIDED_MODE_KEY = 'chipforge-guided-mode';
const WAVEFORM_STORAGE_KEY = 'chipforge-waveform-data';
const HDL_OUTPUT_KEY = 'chipforge-hdl-output';

// Load guided mode from localStorage
const loadGuidedMode = () => {
  try {
    const saved = localStorage.getItem(GUIDED_MODE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load guided mode from localStorage:', error);
  }
  return {
    isActive: true, // Default ON for new users
    currentStep: 1,
    completedSteps: [],
  };
};

// Load waveform data from localStorage
const loadWaveformData = () => {
  try {
    const saved = localStorage.getItem(WAVEFORM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load waveform data from localStorage:', error);
  }
  return {};
};

// Load HDL output from localStorage
const loadHDLOutput = () => {
  try {
    const saved = localStorage.getItem(HDL_OUTPUT_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load HDL output from localStorage:', error);
  }
  return "";
};

export const useHDLDesignStore = create<HDLDesignState>((set, get) => ({
  design: null,
  guidedMode: loadGuidedMode(),
  waveform: loadWaveformData(),
  hdlOutput: loadHDLOutput(),
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
    
    // Also load waveform data
    const waveformData = localStorage.getItem(WAVEFORM_STORAGE_KEY);
    if (waveformData) set({ waveform: JSON.parse(waveformData) });
    
    // Also load HDL output
    const hdlOutput = localStorage.getItem(HDL_OUTPUT_KEY);
    if (hdlOutput) set({ hdlOutput: JSON.parse(hdlOutput) });
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
  },
  waveformData: {
    signals: [],
    cycles: 16,
    metadata: {
      designName: "Untitled Design",
      description: "No description provided",
      clockFrequency: 100,
      resetType: "async"
    }
  },
  testbenchVerilog: "",
  setWaveformSignal: (signal, values) => {
    set((state) => {
      const newWaveform = { ...state.waveform, [signal]: values };
      // Persist waveform data to localStorage
      localStorage.setItem('chipforge-waveform-data', JSON.stringify(newWaveform));
      return { waveform: newWaveform };
    });
  },
  setWaveformData: (data) => {
    set({ waveformData: data });
  },
  generateWaveformJSON: () => {
    const { waveform, design } = get();
    const signals = Object.keys(waveform);
    
    const waveformSignals: WaveformSignal[] = signals.map(signal => {
      const values = waveform[signal];
      const pattern = Array.from({ length: 16 }, (_, i) => values[i] || 0).join('');
      
      // Determine category based on signal name
      let category: 'clock' | 'reset' | 'input' | 'output' | 'control' = 'input';
      if (signal.toLowerCase().includes('clk') || signal.toLowerCase().includes('clock')) {
        category = 'clock';
      } else if (signal.toLowerCase().includes('reset') || signal.toLowerCase().includes('rst')) {
        category = 'reset';
      } else if (signal.toLowerCase().includes('out') || signal.toLowerCase().includes('q')) {
        category = 'output';
      } else if (signal.toLowerCase().includes('ctrl') || signal.toLowerCase().includes('en')) {
        category = 'control';
      }
      
      return {
        signal,
        pattern,
        annotations: `${category} signal`,
        category
      };
    });
    
    const waveformData: WaveformData = {
      signals: waveformSignals,
      cycles: 16,
      metadata: {
        designName: design?.moduleName || "Untitled Design",
        description: design?.description || "No description provided",
        clockFrequency: 100,
        resetType: "async"
      }
    };
    
    return JSON.stringify(waveformData, null, 2);
  },
  generateNaturalLanguageHints: () => {
    const { waveform, design, guidedMode } = get();
    const hints: string[] = [];
    
    if (!guidedMode.isActive) return hints;
    
    const signals = Object.keys(waveform);
    
    // Analyze clock signals
    const clockSignals = signals.filter(s => s.toLowerCase().includes('clk') || s.toLowerCase().includes('clock'));
    if (clockSignals.length > 0) {
      hints.push(`This ${clockSignals[0]} signal drives the design at 100MHz. Use it to synchronize all sequential logic.`);
    }
    
    // Analyze reset signals
    const resetSignals = signals.filter(s => s.toLowerCase().includes('reset') || s.toLowerCase().includes('rst'));
    if (resetSignals.length > 0) {
      hints.push(`The ${resetSignals[0]} signal initializes all flip-flops and registers when asserted.`);
    }
    
    // Analyze counter-like patterns
    const outputSignals = signals.filter(s => s.toLowerCase().includes('out') || s.toLowerCase().includes('q') || s.toLowerCase().includes('count'));
    if (outputSignals.length > 0) {
      hints.push(`Monitor ${outputSignals[0]} to verify the design behavior matches your expectations.`);
    }
    
    // Analyze control signals
    const controlSignals = signals.filter(s => s.toLowerCase().includes('en') || s.toLowerCase().includes('ctrl'));
    if (controlSignals.length > 0) {
      hints.push(`Use ${controlSignals[0]} to enable/disable specific functionality in your design.`);
    }
    
    return hints;
  },
  generateTestbench: () => {
    const waveform = get().waveform;
    const maxCycle = Math.max(0, ...Object.values(waveform).flatMap(s => Object.keys(s).map(Number)));
    let lines: string[] = [
      "module testbench;",
      "  reg clk = 0;",
      "  always #5 clk = ~clk;",
    ];
    const signals = Object.keys(waveform);
    // Declare signals
    signals.forEach(sig => {
      lines.push(`  reg ${sig.replace(/\./g, "_")};`);
    });
    lines.push("  initial begin");
    for (let t = 0; t <= maxCycle; t++) {
      lines.push(`    #10;`);
      signals.forEach(sig => {
        const val = waveform[sig]?.[t];
        if (val !== undefined) {
          lines.push(`    ${sig.replace(/\./g, "_")} = ${val};`);
        }
      });
    }
    lines.push("    $finish;");
    lines.push("  end");
    lines.push("endmodule");
    set({ testbenchVerilog: lines.join("\n") });
  },
  hdlScore: 0,
  setHDL: (code) => {
    set({ hdlOutput: code });
    // Persist HDL output to localStorage
    localStorage.setItem('chipforge-hdl-output', JSON.stringify(code));
  },
  setHDLScore: (score) => set({ hdlScore: score }),
  simResults: {},
  setSimResults: (results) => set({ simResults: results }),
  simulationScore: 0,
  setSimulationScore: (score) => set({ simulationScore: score }),
  
  // Guided mode actions
  setGuidedMode: (isActive) => {
    set((state) => {
      const newGuidedMode = {
        ...state.guidedMode,
        isActive,
      };
      localStorage.setItem(GUIDED_MODE_KEY, JSON.stringify(newGuidedMode));
      return { guidedMode: newGuidedMode };
    });
  },
  
  setGuidedStep: (step) => {
    set((state) => {
      const newGuidedMode = {
        ...state.guidedMode,
        currentStep: step,
      };
      localStorage.setItem(GUIDED_MODE_KEY, JSON.stringify(newGuidedMode));
      return { guidedMode: newGuidedMode };
    });
  },
  
  completeGuidedStep: (step) => {
    set((state) => {
      const newGuidedMode = {
        ...state.guidedMode,
        completedSteps: [...state.guidedMode.completedSteps, step],
        currentStep: Math.min(step + 1, 7), // Move to next step, max 7
      };
      localStorage.setItem(GUIDED_MODE_KEY, JSON.stringify(newGuidedMode));
      return { guidedMode: newGuidedMode };
    });
  },
  
  resetGuidedMode: () => {
    set((state) => {
      const newGuidedMode = {
        ...state.guidedMode,
        currentStep: 1,
        completedSteps: [],
      };
      localStorage.setItem(GUIDED_MODE_KEY, JSON.stringify(newGuidedMode));
      return { guidedMode: newGuidedMode };
    });
  },
})); 