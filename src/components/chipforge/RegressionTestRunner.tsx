import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  BarChart3,
  FileText,
  Zap
} from "lucide-react";
import { 
  runRegressionTests, 
  runTestSuite, 
  runSingleTest,
  getTestCases,
  getTestSuites,
  type TestResult,
  type RegressionReport,
  type TestCase,
  type TestSuite
} from '../../backend/sim/regressionTests';

interface TestRunnerState {
  isRunning: boolean;
  currentTest: string | null;
  progress: number;
  results: RegressionReport | null;
  error: string | null;
}

export default function RegressionTestRunner() {
  const [state, setState] = useState<TestRunnerState>({
    isRunning: false,
    currentTest: null,
    progress: 0,
    results: null,
    error: null
  });

  const [testCases] = useState<TestCase[]>(getTestCases());
  const [testSuites] = useState<TestSuite[]>(getTestSuites());

  const runAllTests = async () => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      currentTest: 'Running all tests...',
      progress: 0,
      results: null,
      error: null
    }));

    try {
      const results = await runRegressionTests();
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentTest: null,
        progress: 100,
        results
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentTest: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const runSuite = async (suiteName: string) => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      currentTest: `Running ${suiteName}...`,
      progress: 0,
      results: null,
      error: null
    }));

    try {
      const results = await runTestSuite(suiteName);
      const mockReport: RegressionReport = {
        timestamp: new Date().toISOString(),
        totalTests: results.length,
        passedTests: results.filter(r => r.passed).length,
        failedTests: results.filter(r => !r.passed).length,
        executionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
        testResults: results,
        summary: {
          unitTests: { passed: 0, failed: 0 },
          integrationTests: { passed: 0, failed: 0 },
          regressionTests: { passed: 0, failed: 0 },
          performanceTests: { passed: 0, failed: 0 },
          edgeCaseTests: { passed: 0, failed: 0 }
        }
      };
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentTest: null,
        progress: 100,
        results: mockReport
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentTest: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const runSingleTestCase = async (testId: string) => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      currentTest: `Running ${testId}...`,
      progress: 0,
      results: null,
      error: null
    }));

    try {
      const result = await runSingleTest(testId);
      const mockReport: RegressionReport = {
        timestamp: new Date().toISOString(),
        totalTests: 1,
        passedTests: result.passed ? 1 : 0,
        failedTests: result.passed ? 0 : 1,
        executionTime: result.executionTime,
        testResults: [result],
        summary: {
          unitTests: { passed: 0, failed: 0 },
          integrationTests: { passed: 0, failed: 0 },
          regressionTests: { passed: 0, failed: 0 },
          performanceTests: { passed: 0, failed: 0 },
          edgeCaseTests: { passed: 0, failed: 0 }
        }
      };
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentTest: null,
        progress: 100,
        results: mockReport
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentTest: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'unit': return <CheckCircle className="h-4 w-4" />;
      case 'integration': return <BarChart3 className="h-4 w-4" />;
      case 'regression': return <AlertTriangle className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'edge-case': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Regression Test Runner
          </CardTitle>
          <CardDescription className="text-slate-400">
            Comprehensive testing framework for Phase 1 implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={runAllTests}
              disabled={state.isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {state.isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {state.isRunning ? 'Running...' : 'Run All Tests'}
            </Button>
            
            {testSuites.map(suite => (
              <Button
                key={suite.name}
                onClick={() => runSuite(suite.name)}
                disabled={state.isRunning}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Run {suite.name}
              </Button>
            ))}
          </div>

          {state.isRunning && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400">{state.currentTest}</span>
              </div>
              <Progress value={state.progress} className="w-full" />
            </div>
          )}

          {state.error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-4 w-4" />
                <span className="font-semibold">Error:</span>
                <span>{state.error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {state.results && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription className="text-slate-400">
              {state.results.timestamp}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-slate-100">{state.results.totalTests}</div>
                <div className="text-sm text-slate-400">Total Tests</div>
              </div>
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{state.results.passedTests}</div>
                <div className="text-sm text-green-300">Passed</div>
              </div>
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{state.results.failedTests}</div>
                <div className="text-sm text-red-300">Failed</div>
              </div>
              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {((state.results.passedTests / state.results.totalTests) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-300">Success Rate</div>
              </div>
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Test Details</TabsTrigger>
                <TabsTrigger value="cases">Test Cases</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Test Summary by Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(state.results.summary).map(([category, stats]) => (
                      <div key={category} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(category)}
                          <span className="font-semibold text-slate-200 capitalize">
                            {category.replace('-', ' ')} Tests
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">Passed: {stats.passed}</span>
                          <span className="text-red-400">Failed: {stats.failed}</span>
                          <span className="text-slate-400">Total: {stats.passed + stats.failed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Individual Test Results</h3>
                  <div className="space-y-2">
                    {state.results.testResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.passed 
                            ? 'bg-green-900/20 border-green-700' 
                            : 'bg-red-900/20 border-red-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className="font-semibold text-slate-200">{result.testName}</span>
                            <Badge variant="outline" className="text-xs">
                              {result.testId}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-400">
                            {result.executionTime.toFixed(2)}ms
                          </div>
                        </div>
                        {result.error && (
                          <div className="mt-2 text-sm text-red-400">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cases" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Available Test Cases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testCases.map((testCase) => (
                      <div key={testCase.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(testCase.category)}
                            <span className="font-semibold text-slate-200">{testCase.name}</span>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(testCase.priority)}`}>
                            {testCase.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{testCase.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {testCase.id}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => runSingleTestCase(testCase.id)}
                            disabled={state.isRunning}
                            variant="outline"
                          >
                            Run Test
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 