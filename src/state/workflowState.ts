import { create } from 'zustand';

export type WorkflowStage = 'HDL' | 'Simulation' | 'Synthesis' | 'PlaceRoute' | 'Layout' | 'Export';

export interface WorkflowStageConfig {
  id: WorkflowStage;
  label: string;
  path: string;
  description: string;
  icon: string; // Use icon name as string for now
}

export const WORKFLOW_STAGES: WorkflowStageConfig[] = [
  {
    id: 'HDL',
    label: 'HDL Generator',
    path: '/hdl-generator',
    description: 'AI-powered Verilog generation',
    icon: 'Brain',
  },
  {
    id: 'Simulation',
    label: 'Simulation',
    path: '/test-native-simulator',
    description: 'Test and verify HDL design',
    icon: 'Play',
  },
  {
    id: 'Synthesis',
    label: 'Synthesis & P&R',
    path: '/advanced-chip-design',
    description: 'Synthesis and place & route',
    icon: 'Cpu',
  },
  {
    id: 'Layout',
    label: 'Layout Design',
    path: '/advanced-layout-designer',
    description: 'Layout design and verification',
    icon: 'Layers',
  },
  {
    id: 'Export',
    label: 'Export & Fabrication',
    path: '/export',
    description: 'Generate fabrication files',
    icon: 'Download',
  },
];

interface WorkflowState {
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  setStage: (stage: WorkflowStage) => void;
  markComplete: (stage: WorkflowStage) => void;
  reset: () => void;
  getStageConfig: (stage: WorkflowStage) => WorkflowStageConfig;
  getNextStage: () => WorkflowStage | null;
  getPreviousStage: () => WorkflowStage | null;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  currentStage: 'HDL',
  completedStages: [],
  setStage: (stage) => set({ currentStage: stage }),
  markComplete: (stage) =>
    set((state) => ({
      completedStages: [...new Set([...state.completedStages, stage])],
    })),
  reset: () => set({ currentStage: 'HDL', completedStages: [] }),
  getStageConfig: (stage) => {
    const config = WORKFLOW_STAGES.find((s) => s.id === stage);
    if (!config) throw new Error(`Unknown workflow stage: ${stage}`);
    return config;
  },
  getNextStage: () => {
    const { currentStage } = get();
    const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex < WORKFLOW_STAGES.length - 1) {
      return WORKFLOW_STAGES[currentIndex + 1].id;
    }
    return null;
  },
  getPreviousStage: () => {
    const { currentStage } = get();
    const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex > 0) {
      return WORKFLOW_STAGES[currentIndex - 1].id;
    }
    return null;
  },
})); 