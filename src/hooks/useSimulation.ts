import { useState, useCallback, useRef } from 'react';
import type { SimulationConfig, SimulationProgress, SimulationResult, WaveformData } from '@/components/design-editor/types';

export const useSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<SimulationProgress>({
    progress: 0,
    stage: 'idle',
    message: 'Ready to simulate'
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const maxRetries = 3;

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

  const simulate = useCallback(async (config: SimulationConfig) => {
    if (isRunning) return;

    try {
      setIsRunning(true);
      setLastError(null);
      setProgress({
        progress: 0,
        stage: 'initializing',
        message: 'Initializing simulation...'
      });

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
        id: simulationIdRef.current,
        status: 'success',
        waveformData: {
          signals: ['clk', 'a[3:0]', 'b[3:0]', 'result[3:0]', 'carry_out'],
          timeScale: 'ns',
          duration: parseInt(config.simulationTime) || 1000,
          traces: [
            { name: 'clk', type: 'clock', values: ['0', '1', '0', '1'], transitions: [] },
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setProgress({
          progress: 0,
          stage: 'retrying',
          message: `Retrying... (${retryCount + 1}/${maxRetries})`
        });
        
        // Retry after a delay
        setTimeout(() => {
          simulate(config);
        }, 2000);
      } else {
        setResult({
          status: 'error',
          error: errorMessage,
          waveformData: null
        });
        setIsRunning(false);
        setRetryCount(0);
      }
    }
  }, [isRunning, retryCount, updateProgress]);

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
      progress: 0,
      stage: 'idle',
      message: 'Ready to simulate'
    });
  }, []);

  const retrySimulation = useCallback(() => {
    if (lastError && !isRunning) {
      setRetryCount(0);
      setLastError(null);
      // Retry with last config
      // This would need to store the last config
    }
  }, [lastError, isRunning]);

  return {
    isRunning,
    progress,
    result,
    logs,
    simulate,
    cancelSimulation,
    clearLogs,
    resetSimulation,
    retrySimulation,
    retryCount,
    lastError,
    maxRetries
  };
};