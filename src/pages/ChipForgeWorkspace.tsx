import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Play, 
  Code, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Save,
  Download,
  Plus,
  X,
  Sparkles,
  Lightbulb,
  TestTube,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { generateVerilog } from '../backend/hdl-gen/generateHDL';
import { runTestBench } from '../backend/sim/testBench';
import { getReflexionAdvice } from '../backend/reflexion/reviewer';
import { saveHDLDesign, HDLDesign } from '../utils/localStorage';
import TopNav from "../components/chipforge/TopNav";

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

export default function ChipForgeWorkspace() {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [io, setIo] = useState([{ name: '', direction: 'input' as 'input' | 'output', width: 1 }]);
  const [verilog, setVerilog] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [advice, setAdvice] = useState<ReflexionAdvice | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'testing' | 'reviewing' | 'failed' | 'passed'>('idle');
  const [iteration, setIteration] = useState(0);
  const [activeTab, setActiveTab] = useState('design');
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);

  const addPort = () => {
    setIo([...io, { name: '', direction: 'input', width: 1 }]);
  };

  const removePort = (index: number) => {
    setIo(io.filter((_, i) => i !== index));
  };

  const updatePort = (index: number, field: 'name' | 'direction' | 'width', value: string | number) => {
    const newIo = [...io];
    newIo[index] = { ...newIo[index], [field]: value };
    setIo(newIo);
  };

  const handleGenerate = async () => {
    if (!moduleName.trim() || !description.trim()) return;
    
    setStatus('generating');
    setIteration(prev => prev + 1);
    
    try {
      // Generate Verilog
      const code = generateVerilog({ moduleName, description, io });
      setVerilog(code);
      
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
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('failed');
      setTestResult({
        passed: false,
        feedback: 'Generation failed. Please check your inputs.',
        warnings: [],
        errors: ['Generation error'],
        simulationTime: 0
      });
    }
  };

  const handleRegenerate = async () => {
    if (advice) {
      // Use advice to improve the description
      const improvedDescription = `${description}\n\nImprovements based on feedback:\n${advice.suggestions.join('\n')}`;
      setDescription(improvedDescription);
    }
    await handleGenerate();
  };

  const handleSave = () => {
    if (!moduleName.trim() || !verilog) return;
    
    const designId = currentDesignId || `workspace-${Date.now()}`;
    const design: HDLDesign = {
      id: designId,
      name: moduleName,
      description,
      verilog,
      io,
      createdAt: currentDesignId ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveHDLDesign(design);
    setCurrentDesignId(designId);
  };

  const handleExport = () => {
    if (verilog) {
      const blob = new Blob([verilog], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${moduleName || 'module'}.v`;
      a.click();
      URL.revokeObjectURL(url);
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
    <>
      <TopNav />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HDL Workspace
              </h1>
              <p className="text-slate-400 mt-2">
                AI-powered HDL generation with reflexion loop and automated testing
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                <Sparkles className="h-3 w-3 mr-1" />
                Reflexion Loop
              </Badge>
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
                      {status === 'generating' && 'Generating HDL code...'}
                      {status === 'testing' && 'Running test bench...'}
                      {status === 'reviewing' && 'Getting AI feedback...'}
                      {status === 'passed' && 'All tests passed! ✅'}
                      {status === 'failed' && 'Tests failed - Review feedback'}
                    </div>
                    <div className="text-sm text-slate-400">
                      {testResult && `Simulation time: ${testResult.simulationTime}ms`}
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
              {status === 'generating' || status === 'testing' || status === 'reviewing' && (
                <Progress value={75} className="mt-3" />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Design Input */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    Design Specification
                  </CardTitle>
                  <CardDescription>
                    Describe your module and configure I/O ports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="moduleName">Module Name</Label>
                    <Input
                      id="moduleName"
                      placeholder="Enter module name"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your module does..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px] bg-slate-900 border-slate-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>I/O Ports</Label>
                      <Button variant="outline" size="sm" onClick={addPort}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Port
                      </Button>
                    </div>
                    
                    {io.map((port, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-slate-700 rounded">
                        <Input
                          placeholder="Port name"
                          value={port.name}
                          onChange={(e) => updatePort(idx, 'name', e.target.value)}
                          className="flex-1 bg-slate-900 border-slate-600"
                        />
                        <Select 
                          value={port.direction} 
                          onValueChange={(value: 'input' | 'output') => updatePort(idx, 'direction', value)}
                        >
                          <SelectTrigger className="w-24 bg-slate-900 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="input">Input</SelectItem>
                            <SelectItem value="output">Output</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Width"
                          value={port.width}
                          onChange={(e) => updatePort(idx, 'width', parseInt(e.target.value) || 1)}
                          className="w-20 bg-slate-900 border-slate-600"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePort(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={!moduleName.trim() || !description.trim() || status !== 'idle'}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Generate & Test
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
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="code" className="data-[state=active]:bg-slate-700">
                    <Code className="h-4 w-4 mr-2" />
                    Code
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
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-cyan-400" />
                        Generated Verilog
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {verilog ? (
                        <div className="bg-slate-900 rounded p-4 overflow-auto max-h-96">
                          <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                            {verilog}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 py-8">
                          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No Verilog code generated yet</p>
                          <p className="text-sm">Configure your module and click Generate</p>
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
    </>
  );
}