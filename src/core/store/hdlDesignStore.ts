import { create } from 'zustand';
import { CfDesign, CfComponent, CfClock, CfReset, CfBus, CfWaveformPlan, CfNet } from '../contracts/design-types';

interface HDLDesignState {
  design: CfDesign | null;
  waveform?: CfWaveformPlan;
  guidedMode: {
    isActive: boolean;
    currentStep: number;
    completedSteps: number[];
  };
}

interface HDLDesignActions {
  // State management
  loadDesign: (json: string | CfDesign) => void;
  resetDesign: () => void;
  
  // Component management
  addComponent: (component: Partial<CfComponent>) => string;
  updateComponent: (id: string, updates: Partial<CfComponent>) => void;
  removeComponent: (id: string) => void;
  
  // Net management
  addNet: (net: Omit<CfNet, 'id'>) => string;
  connectPins: (a: { compId: string; pinId: string }, b: { compId: string; pinId: string }) => string;
  disconnectPin: (compId: string, pinId: string) => void;
  
  // Constraint management
  setClock: (clock: CfClock) => void;
  setReset: (reset: CfReset) => void;
  setBus: (bus: CfBus) => void;
  
  // Waveform management
  setWaveform: (plan: CfWaveformPlan) => void;
  clearWaveform: () => void;
  
  // Export functionality
  exportAll: () => { design: string; waveform: string; constraints: string };
  
  // Guided mode management
  setGuidedMode: (isActive: boolean) => void;
  setGuidedStep: (step: number) => void;
  completeGuidedStep: (step: number) => void;
  resetGuidedMode: () => void;
}

type HDLDesignStore = HDLDesignState & HDLDesignActions;

// Helper function to generate unique IDs
const generateId = (): string => {
  return `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to validate design structure
const validateDesign = (design: CfDesign): boolean => {
  return !!(
    design.id &&
    design.meta?.name &&
    Array.isArray(design.components) &&
    Array.isArray(design.nets) &&
    Array.isArray(design.buses) &&
    design.constraints
  );
};

export const useHDLDesignStore = create<HDLDesignStore>((set, get) => ({
  // Initial state
  design: null,
  waveform: undefined,
  guidedMode: {
    isActive: true, // Default ON for new users
    currentStep: 1,
    completedSteps: [],
  },

  // State management
  loadDesign: (json) => {
    try {
      const design = typeof json === 'string' ? JSON.parse(json) : json;
      if (validateDesign(design)) {
        set({ design, waveform: undefined });
      } else {
        throw new Error('Invalid design structure');
      }
    } catch (error) {
      console.error('Failed to load design:', error);
      throw error;
    }
  },

  resetDesign: () => {
    set({ design: null, waveform: undefined });
  },

  // Component management
  addComponent: (component) => {
    const id = generateId();
    const newComponent: CfComponent = {
      id,
      name: component.name || `Component_${id}`,
      type: component.type || 'generic',
      pins: component.pins || [],
      params: component.params || {},
      view: {
        icon2d: component.view?.icon2d || 'default-icon',
        model3d: component.view?.model3d,
      },
      compliance: component.compliance,
    };

    set((state) => ({
      design: state.design ? {
        ...state.design,
        components: [...state.design.components, newComponent],
        modified: new Date().toISOString(),
      } : null,
    }));

    return id;
  },

  updateComponent: (id, updates) => {
    set((state) => {
      if (!state.design) return state;
      
      const components = state.design.components.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      );

      return {
        design: {
          ...state.design,
          components,
          modified: new Date().toISOString(),
        },
      };
    });
  },

  removeComponent: (id) => {
    set((state) => {
      if (!state.design) return state;
      
      // Remove component and its associated nets
      const components = state.design.components.filter(comp => comp.id !== id);
      const nets = state.design.nets.filter(net => 
        !net.endpoints.some(endpoint => endpoint.componentId === id)
      );

      return {
        design: {
          ...state.design,
          components,
          nets,
          modified: new Date().toISOString(),
        },
      };
    });
  },

  // Net management
  addNet: (net) => {
    const id = generateId();
    const newNet: CfNet = {
      id,
      name: net.name || `Net_${id}`,
      width: net.width || 1,
      endpoints: net.endpoints || [],
    };

    set((state) => ({
      design: state.design ? {
        ...state.design,
        nets: [...state.design.nets, newNet],
        modified: new Date().toISOString(),
      } : null,
    }));

    return id;
  },

  connectPins: (a, b) => {
    const netId = generateId();
    const net: CfNet = {
      id: netId,
      name: `Net_${a.compId}_${a.pinId}_to_${b.compId}_${b.pinId}`,
      width: 1, // Default width, should be validated
      endpoints: [
        { componentId: a.compId, pinId: a.pinId },
        { componentId: b.compId, pinId: b.pinId },
      ],
    };

    set((state) => {
      if (!state.design) return state;

      // Update pins to reference the new net
      const components = state.design.components.map(comp => {
        if (comp.id === a.compId || comp.id === b.compId) {
          return {
            ...comp,
            pins: comp.pins.map(pin => {
              if ((comp.id === a.compId && pin.id === a.pinId) ||
                  (comp.id === b.compId && pin.id === b.pinId)) {
                return { ...pin, netId };
              }
              return pin;
            }),
          };
        }
        return comp;
      });

      return {
        design: {
          ...state.design,
          components,
          nets: [...state.design.nets, net],
          modified: new Date().toISOString(),
        },
      };
    });

    return netId;
  },

  disconnectPin: (compId, pinId) => {
    set((state) => {
      if (!state.design) return state;

      const components = state.design.components.map(comp => {
        if (comp.id === compId) {
          return {
            ...comp,
            pins: comp.pins.map(pin =>
              pin.id === pinId ? { ...pin, netId: undefined } : pin
            ),
          };
        }
        return comp;
      });

      return {
        design: {
          ...state.design,
          components,
          modified: new Date().toISOString(),
        },
      };
    });
  },

  // Constraint management
  setClock: (clock) => {
    set((state) => {
      if (!state.design) return state;

      const clocks = state.design.constraints.clocks.filter(c => c.name !== clock.name);
      clocks.push(clock);

      return {
        design: {
          ...state.design,
          constraints: {
            ...state.design.constraints,
            clocks,
          },
          modified: new Date().toISOString(),
        },
      };
    });
  },

  setReset: (reset) => {
    set((state) => {
      if (!state.design) return state;

      const resets = state.design.constraints.resets.filter(r => r.name !== reset.name);
      resets.push(reset);

      return {
        design: {
          ...state.design,
          constraints: {
            ...state.design.constraints,
            resets,
          },
          modified: new Date().toISOString(),
        },
      };
    });
  },

  setBus: (bus) => {
    set((state) => {
      if (!state.design) return state;

      const buses = state.design.buses.filter(b => b.id !== bus.id);
      buses.push(bus);

      return {
        design: {
          ...state.design,
          buses,
          modified: new Date().toISOString(),
        },
      };
    });
  },

  // Waveform management
  setWaveform: (plan) => {
    set({ waveform: plan });
  },

  clearWaveform: () => {
    set({ waveform: undefined });
  },

  // Export functionality
  exportAll: () => {
    const state = get();
    if (!state.design) {
      throw new Error('No design loaded');
    }

    const design = JSON.stringify(state.design, null, 2);
    const waveform = state.waveform ? JSON.stringify(state.waveform, null, 2) : '{}';
    
    // Generate constraints YAML
    const constraints = generateConstraintsYAML(state.design);
    
    return { design, waveform, constraints };
  },

  // Guided mode management
  setGuidedMode: (isActive) => {
    set((state) => ({
      guidedMode: {
        ...state.guidedMode,
        isActive,
      },
    }));
  },

  setGuidedStep: (step) => {
    set((state) => ({
      guidedMode: {
        ...state.guidedMode,
        currentStep: step,
      },
    }));
  },

  completeGuidedStep: (step) => {
    set((state) => ({
      guidedMode: {
        ...state.guidedMode,
        completedSteps: [...state.guidedMode.completedSteps, step],
        currentStep: Math.min(step + 1, 7), // Move to next step, max 7
      },
    }));
  },

  resetGuidedMode: () => {
    set((state) => ({
      guidedMode: {
        ...state.guidedMode,
        currentStep: 1,
        completedSteps: [],
      },
    }));
  },
}));

// Helper function to generate constraints YAML
function generateConstraintsYAML(design: CfDesign): string {
  const constraints = {
    clocks: design.constraints.clocks.map(clock => ({
      name: clock.name,
      frequency_mhz: clock.freqMHz,
      stable_between_clock: clock.stableBetweenClock || false,
    })),
    resets: design.constraints.resets.map(reset => ({
      name: reset.name,
      active: reset.active,
      sync_deassert: reset.syncDeassert,
    })),
    buses: design.buses.map(bus => ({
      id: bus.id,
      kind: bus.kind,
      properties: bus.properties,
    })),
  };

  return JSON.stringify(constraints, null, 2);
} 