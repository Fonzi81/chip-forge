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
    label: 'HDL Design',
    path: '/workspace',
    description: 'Create and edit HDL code',
    icon: 'Code',
  },
  {
    id: 'Simulation',
    label: 'Simulation',
    path: '/chipforge-simulation',
    description: 'Test and verify HDL design',
    icon: 'Play',
  },
  {
    id: 'Synthesis',
    label: 'Synthesis',
    path: '/synthesis',
    description: 'Convert HDL to gate-level netlist',
    icon: 'Cpu',
  },
  {
    id: 'PlaceRoute',
    label: 'Place & Route',
    path: '/place-and-route',
    description: 'Physical layout and routing',
    icon: 'Grid3X3',
  },
  {
    id: 'Layout',
    label: 'Layout Design',
    path: '/layout-designer',
    description: 'Detailed layout design and verification',
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