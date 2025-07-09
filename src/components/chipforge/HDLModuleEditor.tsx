import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Brain, 
  Code, 
  Save, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Sparkles,
  Lightbulb,
  TestTube,
  ArrowRight,
  RotateCcw,
  Edit3,
  Eye,
  Shield,
  Zap
} from "lucide-react";
import { callLLMHDLGenerator } from '../../backend/hdl-gen/llmHDLGen';
import { generateSafeHDL, SafeHDLResult, ValidationResult } from '../../backend/hdl-gen/safeHDLGen';
import { runTestBench } from '../../backend/sim/testBench';
import { getReflexionAdvice } from '../../backend/reflexion/reviewer';
import { saveHDLDesign, HDLDesign, saveDesign } from '../../utils/localStorage';

interface TestResult {
  passed: boolean;
  feedback: string;
  warnings: string[];
  errors: string[];
  simulationTime: number;
}

interface ReflexionAdvice {
  suggestions: string[];
  codeReview: string;
  improvements: string[];
  confidence: number;
}

interface SafeHDLState {
  result: SafeHDLResult | null;
  validation: ValidationResult | null;
  isUsingSafeGeneration: boolean;
}

export default function HDLModuleEditor() {
  const [prompt, setPrompt] = useState('');
  const [constraints, setConstraints] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [verilog, setVerilog] = useState('');
  const [editableVerilog, setEditableVerilog] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [advice, setAdvice] = useState<ReflexionAdvice | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'testing' | 'reviewing' | 'failed' | 'passed'>('idle');
  const [iteration, setIteration] = useState(0);
  const [activeTab, setActiveTab] = useState('input');
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [safeHDLState, setSafeHDLState] = useState<SafeHDLState>({
    result: null,
    validation: null,
    isUsingSafeGeneration: false
  });
  const [useSafeGeneration, setUseSafeGeneration] = useState(true);

  // Clear validation state when switching generation modes
  const handleSafeGenerationToggle = (enabled: boolean) => {
    setUseSafeGeneration(enabled);
    if (!enabled) {
      setSafeHDLState({
        result: null,
        validation: null,
        isUsingSafeGeneration: false
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus('generating');
    setIteration(prev => prev + 1);
    
    try {
      let code: string;
      let validation: ValidationResult | null = null;
      
      if (useSafeGeneration) {
        // Use enhanced safe HDL generation
        setSafeHDLState(prev => ({ ...prev, isUsingSafeGeneration: true }));
        
        const safeResult = await generateSafeHDL(prompt, {
          maxRetries: 3,
          validationLevel: 'strict',
          securityChecks: true,
          timeoutMs: 30000
        });
        
        code = safeResult.code;
        validation = safeResult.validation;
        
        setSafeHDLState({
          result: safeResult,
          validation: safeResult.validation,
          isUsingSafeGeneration: true
        });
        
        // Extract module name from generated code if not provided
        if (!moduleName.trim()) {
          const moduleMatch = code.match(/module\s+(\w+)/);
          if (moduleMatch) {
            setModuleName(moduleMatch[1]);
          }
        }
        
        // Auto-switch to validation tab if there are validation issues
        if (!safeResult.validation.isValid || safeResult.validation.errors.length > 0 || safeResult.validation.securityIssues.length > 0) {
          setActiveTab('validation');
        }
      } else {
        // Use legacy LLM generation
        setSafeHDLState(prev => ({ ...prev, isUsingSafeGeneration: false }));
        code = await callLLMHDLGenerator(prompt, constraints || '');
      }
      
      setVerilog(code);
      setEditableVerilog(code);
      
      // Run test bench
      setStatus('testing');
      const result = await runTestBench(code);
      setTestResult(result);
      
      if (result.passed) {
        setStatus('passed');
        setAdvice(null);
      } else {
        // Get reflexion advice
        setStatus('reviewing');
        const reflexionAdvice = await getReflexionAdvice(code, result.feedback);
        setAdvice(reflexionAdvice);
        setStatus('failed');
      }

      // Auto-save design after generation (success or failure)
      saveDesign('active', code);
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('failed');
      setTestResult({
        passed: false,
        feedback: error instanceof Error ? error.message : 'Generation failed. Please check your inputs.',
        warnings: [],
        errors: ['Generation error'],
        simulationTime: 0
      });
    }
  };

  const handleRegenerate = async () => {
    if (advice) {
      // Use advice to improve the prompt
      const improvedPrompt = `${prompt}\n\nImprovements based on feedback:\n${advice.suggestions.join('\n')}`;
      setPrompt(improvedPrompt);
    }
    await handleGenerate();
  };

  const handleSave = () => {
    if (!moduleName.trim() || !verilog) return;
    
    const designId = currentDesignId || `llm-${Date.now()}`;
    const design: HDLDesign = {
      id: designId,
      name: moduleName,
      description: prompt,
      verilog: editableVerilog || verilog,
      io: [], // Extract from verilog if needed
      createdAt: currentDesignId ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveHDLDesign(design);
    setCurrentDesignId(designId);
  };

  const handleExport = () => {
    const codeToExport = editableVerilog || verilog;
    if (codeToExport) {
      const blob = new Blob([codeToExport], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${moduleName || 'module'}.v`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableVerilog(verilog);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-emerald-400';
      case 'failed': return 'text-red-400';
      case 'generating': return 'text-blue-400';
      case 'testing': return 'text-yellow-400';
      case 'reviewing': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'generating': return <Brain className="h-4 w-4" />;
      case 'testing': return <TestTube className="h-4 w-4" />;
      case 'reviewing': return <Lightbulb className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI HDL Generator
            </h1>
            <p className="text-slate-400 mt-2">
              Generate Verilog code from natural language with AI-powered reflexion loop
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              <Sparkles className="h-3 w-3 mr-1" />
              LLM-Powered
            </Badge>
            {useSafeGeneration && (
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                <Shield className="h-3 w-3 mr-1" />
                Safe Generation
              </Badge>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Iteration:</span>
              <Badge variant="secondary">{iteration}</Badge>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={getStatusColor(status)}>
                  {getStatusIcon(status)}
                </div>
                <div>
                  <div className="font-medium text-slate-200">
                    {status === 'idle' && 'Ready to generate'}
                    {status === 'generating' && (useSafeGeneration ? 'AI generating HDL with validation...' : 'AI generating HDL code...')}
                    {status === 'testing' && 'Running test bench...'}
                    {status === 'reviewing' && 'Getting AI feedback...'}
                    {status === 'passed' && 'All tests passed! ✅'}
                    {status === 'failed' && 'Tests failed - Review feedback'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {safeHDLState.result && `Generation: ${safeHDLState.result.metadata.generationTime}ms`}
                    {testResult && safeHDLState.result && ' • '}
                    {testResult && `Simulation: ${testResult.simulationTime}ms`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verilog && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </>
                )}
              </div>
            </div>
            {(status === 'generating' || status === 'testing' || status === 'reviewing') && (
              <Progress value={75} className="mt-3" />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  Design Specification
                </CardTitle>
                <CardDescription>
                  Describe your module in natural language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moduleName">Module Name (Optional)</Label>
                  <Input
                    id="moduleName"
                    placeholder="e.g., counter, fsm, alu"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Module Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your HDL module (e.g., '8-bit synchronous counter with reset', 'FSM with 3 states for traffic light control', '4-bit ALU with arithmetic operations')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] bg-slate-900 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints">Constraints (Optional)</Label>
                  <Textarea
                    id="constraints"
                    placeholder="e.g., 'timing: 100MHz', 'area: minimize gates', 'IO: 8-bit data bus'"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    className="min-h-[80px] bg-slate-900 border-slate-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <div>
                      <Label htmlFor="safe-generation" className="text-sm font-medium">
                        Enhanced Safe Generation
                      </Label>
                      <p className="text-xs text-slate-400">
                        Multi-level validation, security checks, and retry logic
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="safe-generation"
                    checked={useSafeGeneration}
                    onCheckedChange={handleSafeGenerationToggle}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || status !== 'idle'}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    {useSafeGeneration ? (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Generate Safe HDL
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate HDL
                      </>
                    )}
                  </Button>
                  {status === 'failed' && advice && (
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="code" className="data-[state=active]:bg-slate-700">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="validation" className="data-[state=active]:bg-slate-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Validation
                </TabsTrigger>
                <TabsTrigger value="test" className="data-[state=active]:bg-slate-700">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Results
                </TabsTrigger>
                <TabsTrigger value="advice" className="data-[state=active]:bg-slate-700">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  AI Advice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-cyan-400" />
                        Generated Verilog
                      </CardTitle>
                      {verilog && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditToggle}
                        >
                          {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                          {isEditing ? 'View' : 'Edit'}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {verilog ? (
                      <div className="space-y-4">
                        {isEditing ? (
                          <Textarea
                            value={editableVerilog}
                            onChange={(e) => setEditableVerilog(e.target.value)}
                            className="min-h-[400px] bg-slate-900 border-slate-600 font-mono text-sm"
                            placeholder="Edit the generated Verilog code..."
                          />
                        ) : (
                          <div className="bg-slate-900 rounded p-4 overflow-auto max-h-96">
                            <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                              {editableVerilog || verilog}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No Verilog code generated yet</p>
                        <p className="text-sm">Describe your module and click Generate</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="validation" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-cyan-400" />
                      Code Validation Results
                    </CardTitle>
                    <CardDescription>
                      {safeHDLState.isUsingSafeGeneration 
                        ? 'Enhanced validation with security checks and performance analysis'
                        : 'Basic validation (enable Enhanced Safe Generation for full validation)'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {safeHDLState.validation ? (
                      <div className="space-y-6">
                        {/* Validation Status */}
                        <div className="flex items-center gap-3">
                          {safeHDLState.validation.isValid ? (
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-red-400" />
                          )}
                          <div>
                            <div className="font-medium text-slate-200">
                              {safeHDLState.validation.isValid ? 'Validation Passed' : 'Validation Failed'}
                            </div>
                            <div className="text-sm text-slate-400">
                              {safeHDLState.result?.metadata.generationTime}ms generation time
                            </div>
                          </div>
                        </div>

                        {/* Complexity Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-sm text-slate-400">Lines of Code</div>
                            <div className="text-lg font-semibold text-slate-200">
                              {safeHDLState.validation.complexity.lines}
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-sm text-slate-400">Estimated Gates</div>
                            <div className="text-lg font-semibold text-slate-200">
                              {safeHDLState.validation.complexity.estimatedGates}
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-sm text-slate-400">Signals</div>
                            <div className="text-lg font-semibold text-slate-200">
                              {safeHDLState.validation.complexity.signals}
                            </div>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-sm text-slate-400">Modules</div>
                            <div className="text-lg font-semibold text-slate-200">
                              {safeHDLState.validation.complexity.modules}
                            </div>
                          </div>
                        </div>

                        {/* Errors */}
                        {safeHDLState.validation.errors.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-400 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Validation Errors ({safeHDLState.validation.errors.length})
                            </h4>
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                              <ul className="space-y-1">
                                {safeHDLState.validation.errors.map((error, idx) => (
                                  <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                                    <span className="text-red-400">•</span>
                                    {error}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Security Issues */}
                        {safeHDLState.validation.securityIssues.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-orange-400 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Security Issues ({safeHDLState.validation.securityIssues.length})
                            </h4>
                            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-3">
                              <ul className="space-y-1">
                                {safeHDLState.validation.securityIssues.map((issue, idx) => (
                                  <li key={idx} className="text-sm text-orange-300 flex items-start gap-2">
                                    <span className="text-orange-400">•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {safeHDLState.validation.warnings.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-yellow-400 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Warnings ({safeHDLState.validation.warnings.length})
                            </h4>
                            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
                              <ul className="space-y-1">
                                {safeHDLState.validation.warnings.map((warning, idx) => (
                                  <li key={idx} className="text-sm text-yellow-300 flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        {safeHDLState.validation.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-cyan-400 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Suggestions ({safeHDLState.validation.suggestions.length})
                            </h4>
                            <div className="bg-cyan-900/20 border border-cyan-800 rounded-lg p-3">
                              <ul className="space-y-1">
                                {safeHDLState.validation.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="text-sm text-cyan-300 flex items-start gap-2">
                                    <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Generation Metadata */}
                        {safeHDLState.result && (
                          <div className="bg-slate-900/50 rounded-lg p-3">
                            <h4 className="font-medium text-slate-200 mb-2">Generation Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-slate-400">Module:</span>
                                <span className="text-slate-200 ml-2">{safeHDLState.result.metadata.moduleName}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Language:</span>
                                <span className="text-slate-200 ml-2">{safeHDLState.result.metadata.language}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Attempts:</span>
                                <span className="text-slate-200 ml-2">{safeHDLState.result.metadata.attempts}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Generated:</span>
                                <span className="text-slate-200 ml-2">
                                  {new Date(safeHDLState.result.metadata.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No validation results available</p>
                        <p className="text-sm">
                          {useSafeGeneration 
                            ? 'Run generation to see validation results'
                            : 'Enable Enhanced Safe Generation for validation'
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-cyan-400" />
                      Test Bench Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {testResult.passed ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          )}
                          <span className="font-medium">
                            {testResult.passed ? 'All Tests Passed' : 'Tests Failed'}
                          </span>
                        </div>
                        
                        <div className="bg-slate-900 rounded p-4">
                          <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                            {testResult.feedback}
                          </pre>
                        </div>

                        {testResult.errors.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-red-400">Errors:</h4>
                            <ul className="space-y-1">
                              {testResult.errors.map((error, idx) => (
                                <li key={idx} className="text-sm text-red-300">• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {testResult.warnings.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-yellow-400">Warnings:</h4>
                            <ul className="space-y-1">
                              {testResult.warnings.map((warning, idx) => (
                                <li key={idx} className="text-sm text-yellow-300">• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No test results available</p>
                        <p className="text-sm">Run generation to see test results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advice" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-cyan-400" />
                      AI Reflexion Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {advice ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            Confidence: {advice.confidence}%
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Code Review:</h4>
                            <div className="bg-slate-900 rounded p-3 text-sm text-slate-300">
                              {advice.codeReview}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Suggestions:</h4>
                            <ul className="space-y-1">
                              {advice.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-200 mb-2">Improvements:</h4>
                            <ul className="space-y-1">
                              {advice.improvements.map((improvement, idx) => (
                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                  <Sparkles className="h-3 w-3 mt-1 flex-shrink-0 text-cyan-400" />
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No AI advice available</p>
                        <p className="text-sm">AI feedback appears when tests fail</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 