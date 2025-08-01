import { useState, useCallback, useRef } from 'react';
import { reflexionAI } from '@/services/reflexionAI';
import { useSimulation } from '@/hooks/useSimulation';
// Mock reflexion iteration function
const runReflexionIteration = async (description: string, code: string, feedback: string, advice: string): Promise<string> => {
  // Mock implementation - in production this would call the actual reflexion backend
  await new Promise(resolve => setTimeout(resolve, 500));
  return `// Improved code based on feedback\n${code}\n// Added improvements based on: ${advice}`;
};

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

export const useReflexion = () => {
  const [state, setState] = useState<ReflexionState>(initialState);
  const { simulate } = useSimulation();
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);

  const updateState = useCallback((updates: Partial<ReflexionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const runIteration = useCallback(async (
    iteration: number,
    description: string,
    testbench: string,
    previousCode?: string,
    reviewerFeedback?: string
  ): Promise<ReflexionIteration> => {
    const iterationId = `iter_${iteration}_${Date.now()}`;
    
    // Generate code using the new reflexion loop
    updateState({ currentStage: 'generating' });
    let generatedCode: string;
    
    if (iteration === 1) {
      // First iteration - generate initial code
      generatedCode = await reflexionAI.generateCode(
        description,
        previousCode,
        reviewerFeedback
      );
    } else {
      // Subsequent iterations - use reflexion loop for improvement
      const feedback = reviewerFeedback || 'No previous feedback available';
      const advice = await reflexionAI.reviewCode(
        previousCode || '',
        ['Previous iteration failed'],
        'Simulation failed',
        description
      );
      
      generatedCode = await runReflexionIteration(
        description,
        previousCode || '',
        feedback,
        advice
      );
    }

    // Test the code
    updateState({ currentStage: 'testing' });
    
    // Mock simulation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    updateState({
      isRunning: false,
      currentStage: 'idle'
    });
  }, [updateState]);

  const resetReflexion = useCallback(() => {
    setState(initialState);
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