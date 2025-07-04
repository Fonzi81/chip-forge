import { useState, useCallback, useRef } from 'react';

export interface SimulationConfig {
  clockFreq: string;
  simulationTime: string;
  inputVectors: string;
  hdlCode: string;
}

export interface SimulationProgress {
  stage: 'idle' | 'compiling' | 'running' | 'processing' | 'complete';
  progress: number;
  message: string;
}

export interface SimulationResult {
  id: string;
  status: 'success' | 'error' | 'timeout';
  waveformData?: any;
  logs: string[];
  metrics?: {
    duration: string;
    gateCount: number;
    assertions: { passed: number; failed: number };
  };
  error?: string;
}

export const useSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<SimulationProgress>({
    stage: 'idle',
    progress: 0,
    message: 'Ready to simulate'
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const simulationIdRef = useRef<string | null>(null);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const updateProgress = useCallback((stage: SimulationProgress['stage'], progress: number, message: string) => {
    setProgress({ stage, progress, message });
    addLog(message);
  }, [addLog]);

  const simulateWithWebSocket = useCallback(async (config: SimulationConfig) => {
    if (isRunning) return;

    setIsRunning(true);
    setResult(null);
    setLogs([]);
    abortControllerRef.current = new AbortController();
    
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    simulationIdRef.current = simulationId;

    try {
      // Phase 1: Compilation
      updateProgress('compiling', 10, 'Starting HDL compilation...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateProgress('compiling', 30, 'Parsing HDL syntax...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateProgress('compiling', 60, 'Generating simulation model...');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      updateProgress('compiling', 90, 'Compilation successful');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Phase 2: Simulation
      updateProgress('running', 5, 'Initializing simulation environment...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      updateProgress('running', 20, 'Loading test vectors...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateProgress('running', 40, 'Running simulation cycles...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProgress('running', 70, 'Processing signal transitions...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateProgress('running', 90, 'Finalizing waveform data...');
      await new Promise(resolve => setTimeout(resolve, 400));

      // Phase 3: Processing
      updateProgress('processing', 20, 'Generating VCD file...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateProgress('processing', 60, 'Analyzing results...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateProgress('processing', 90, 'Preparing output...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock successful result
      const mockResult: SimulationResult = {
        id: simulationId,
        status: 'success',
        waveformData: {
          signals: ['clk', 'a[3:0]', 'b[3:0]', 'result[3:0]', 'carry_out'],
          timeScale: 'ns',
          duration: parseInt(config.simulationTime) || 1000,
          traces: [
            { name: 'clk', type: 'clock', transitions: [] },
            { name: 'a[3:0]', type: 'bus', width: 4, values: ['0000', '0001', '0010', '0011'] },
            { name: 'b[3:0]', type: 'bus', width: 4, values: ['0001', '0010', '0011', '0100'] },
            { name: 'result[3:0]', type: 'bus', width: 4, values: ['0001', '0011', '0101', '0111'] },
            { name: 'carry_out', type: 'signal', values: ['0', '0', '0', '0'] }
          ]
        },
        logs: [...logs],
        metrics: {
          duration: '2.3s',
          gateCount: 42,
          assertions: { passed: 8, failed: 0 }
        }
      };

      updateProgress('complete', 100, 'Simulation completed successfully');
      setResult(mockResult);

    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        updateProgress('idle', 0, 'Simulation cancelled by user');
        setResult({
          id: simulationId,
          status: 'error',
          logs: [...logs],
          error: 'Simulation was cancelled'
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        updateProgress('idle', 0, `Simulation failed: ${errorMessage}`);
        setResult({
          id: simulationId,
          status: 'error',
          logs: [...logs],
          error: errorMessage
        });
      }
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  }, [isRunning, logs, updateProgress]);

  const cancelSimulation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      updateProgress('idle', 0, 'Cancelling simulation...');
    }
  }, [updateProgress]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const resetSimulation = useCallback(() => {
    setResult(null);
    setLogs([]);
    setProgress({
      stage: 'idle',
      progress: 0,
      message: 'Ready to simulate'
    });
  }, []);

  return {
    isRunning,
    progress,
    result,
    logs,
    simulate: simulateWithWebSocket,
    cancelSimulation,
    clearLogs,
    resetSimulation
  };
};