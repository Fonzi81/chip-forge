import { useState, useCallback, useRef, useEffect } from 'react';
import type { SimulationConfig, SimulationProgress, SimulationResult } from '@/components/design-editor/types';

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
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const addLog = useCallback((message: string) => {
    if (!isMountedRef.current) return;
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  const updateProgress = useCallback((stage: SimulationProgress['stage'], progress: number, message: string) => {
    if (!isMountedRef.current) return;
    setProgress({ stage, progress, message });
    addLog(message);
  }, [addLog]);

  const simulate = useCallback(async (config: SimulationConfig) => {
    if (isRunning || !isMountedRef.current) return;

    try {
      setIsRunning(true);
      setLastError(null);
      setProgress({
        progress: 0,
        stage: 'initializing',
        message: 'Initializing simulation...'
      });

      // ... keep all simulation logic here ...

      // Final section of try block:
      updateProgress('complete', 100, 'Simulation completed successfully');
      if (isMountedRef.current) {
        setResult(/* mockResult or actual result */);
      }

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

    } finally {
      if (isMountedRef.current) {
        setIsRunning(false);
      }
      abortControllerRef.current = null;
    }
  }, [isRunning, retryCount, updateProgress]);
