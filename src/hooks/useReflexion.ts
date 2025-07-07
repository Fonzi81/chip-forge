import { useState, useCallback, useRef, useEffect } from 'react';
import { reflexionAI } from '@/services/reflexionAI';
import { useSimulation } from '@/hooks/useSimulation';

export interface ReflexionIteration {
  id: string;
  iteration: number;
  generatedCode: string;
  testResult: {
    passed: boolean;
    errors: string[];
    output: string;
  };
  reviewerFeedback?: string;
  timestamp: Date;
  tokensUsed: number;
}

export interface ReflexionMetrics {
  totalIterations: number;
  passAt1: boolean;
  passAt3: boolean;
  passAt5: boolean;
  totalTokensUsed: number;
  totalTime: number;
  finalSuccess: boolean;
}

export interface ReflexionState {
  isRunning: boolean;
  currentIteration: number;
  currentStage: 'idle' | 'generating' | 'testing' | 'reviewing' | 'complete' | 'failed';
  iterations: ReflexionIteration[];
  finalCode: string | null;
  metrics: ReflexionMetrics | null;
  isComplete: boolean;
  error: string | null;
}

const initialState: ReflexionState = {
  isRunning: false,
  currentIteration: 0,
  currentStage: 'idle',
  iterations: [],
  finalCode: null,
  metrics: null,
  isComplete: false,
  error: null,
};

/**
 * Custom hook for managing reflexion-based HDL development workflow
 * 
 * @param initialHdlCode - The initial HDL code to start with
 * @param maxIterations - Maximum number of reflexion iterations (default: 5)
 * @returns Object containing reflexion state and control functions
 * 
 * @example
 * ```typescript
 * const { state, startReflexion, stopReflexion, resetReflexion } = useReflexion(initialCode);
 * ```
 */
export const useReflexion = (
  initialHdlCode: string = '',
  maxIterations: number = 5
) => {
  const [state, setState] = useState<ReflexionState>(initialState);
  const { simulate } = useSimulation();
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
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

  const updateState = useCallback((updates: Partial<ReflexionState>) => {
    if (!isMountedRef.current) return;
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const runIteration = useCallback(async (
    iteration: number,
    description: string,
    testbench: string,
    previousCode?: string,
    reviewerFeedback?: string
  ): Promise<ReflexionIteration> => {
    if (!isMountedRef.current) {
      throw new Error('Component unmounted during iteration');
    }
    
    const iterationId = `iter_${iteration}_${Date.now()}`;
    
    // Generate code
    updateState({ currentStage: 'generating' });
    const generatedCode = await reflexionAI.generateCode(
      description,
      previousCode,
      reviewerFeedback
    );

    if (!isMountedRef.current) {
      throw new Error('Component unmounted during iteration');
    }

    // Test the code (mock for now since simulate returns void)
    updateState({ currentStage: 'testing' });
    
    // Mock simulation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!isMountedRef.current) {
      throw new Error('Component unmounted during iteration');
    }
    
    // Mock test result - in production this would use actual simulation
    const mockPassed = Math.random() > 0.3; // 70% chance of success for demo
    const testResult = {
      passed: mockPassed,
      errors: mockPassed ? [] : ['Syntax error: Missing semicolon at line 15', 'Logic error: Signal width mismatch'],
      output: mockPassed ? 'Simulation completed successfully' : 'Compilation failed with errors'
    };

    let feedback = '';
    if (!testResult.passed && iteration < 5) {
      // Get reviewer feedback
      updateState({ currentStage: 'reviewing' });
      feedback = await reflexionAI.reviewCode(
        generatedCode,
        testResult.errors,
        testResult.output,
        description
      );
    }

    return {
      id: iterationId,
      iteration,
      generatedCode,
      testResult,
      reviewerFeedback: feedback,
      timestamp: new Date(),
      tokensUsed: 1000 // Mock token count - would be real in production
    };
  }, [updateState]);

  const startReflexion = useCallback(async (description: string, testbench: string) => {
    if (state.isRunning) return;

    abortControllerRef.current = new AbortController();
    startTimeRef.current = Date.now();
    
    updateState({
      isRunning: true,
      currentIteration: 1,
      currentStage: 'generating',
      iterations: [],
      finalCode: null,
      metrics: null,
      isComplete: false,
      error: null
    });

    try {
      const maxIterations = 5;
      const iterations: ReflexionIteration[] = [];
      let currentCode = '';
      let reviewerFeedback = '';
      let success = false;

      for (let i = 1; i <= maxIterations; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Process cancelled by user');
        }

        updateState({ currentIteration: i });

        const iteration = await runIteration(
          i,
          description,
          testbench,
          currentCode,
          reviewerFeedback
        );

        iterations.push(iteration);
        updateState({ iterations: [...iterations] });

        if (iteration.testResult.passed) {
          success = true;
          updateState({
            finalCode: iteration.generatedCode,
            currentStage: 'complete',
            isComplete: true
          });
          break;
        }

        currentCode = iteration.generatedCode;
        reviewerFeedback = iteration.reviewerFeedback || '';
      }

      // Calculate metrics
      const totalTime = Date.now() - startTimeRef.current;
      const totalTokens = iterations.reduce((sum, iter) => sum + iter.tokensUsed, 0);
      
      const metrics: ReflexionMetrics = {
        totalIterations: iterations.length,
        passAt1: iterations.length > 0 && iterations[0].testResult.passed,
        passAt3: iterations.length >= 3 && iterations.slice(0, 3).some(iter => iter.testResult.passed),
        passAt5: iterations.some(iter => iter.testResult.passed),
        totalTokensUsed: totalTokens,
        totalTime,
        finalSuccess: success
      };

      updateState({
        metrics,
        currentStage: success ? 'complete' : 'failed',
        isRunning: false
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      updateState({
        error: errorMessage,
        currentStage: 'failed',
        isRunning: false
      });
    }
  }, [state.isRunning, runIteration, updateState]);

  const stopReflexion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (isMountedRef.current) {
      updateState({
        isRunning: false,
        currentStage: 'idle'
      });
    }
  }, [updateState]);

  const resetReflexion = useCallback(() => {
    if (isMountedRef.current) {
      setState(initialState);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    state,
    startReflexion,
    stopReflexion,
    resetReflexion
  };
};