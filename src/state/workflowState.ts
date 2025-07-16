import { create } from 'zustand';

type WorkflowStage = 'HDL' | 'Simulation' | 'Synthesis' | 'PlaceRoute' | 'Layout' | 'Export';

interface WorkflowState {
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  setStage: (stage: WorkflowStage) => void;
  markComplete: (stage: WorkflowStage) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  currentStage: 'HDL',
  completedStages: [],
  setStage: (stage) => set({ currentStage: stage }),
  markComplete: (stage) =>
    set((state) => ({
      completedStages: [...new Set([...state.completedStages, stage])]
    })),
  reset: () => set({ currentStage: 'HDL', completedStages: [] }),
})); 