import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles,
  Lightbulb,
  TestTube,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  Send
} from "lucide-react";
import { generateVerilog } from '../backend/hdl-gen/generateHDL';
import { runTestBench } from '../backend/sim/testBench';
import { getReflexionAdvice } from '../backend/reflexion/reviewer';
import { saveHDLDesign, HDLDesign } from '../utils/localStorage';
import TopNav from "../components/chipforge/TopNav";
import WorkflowNav from "../components/chipforge/WorkflowNav";
import { useWorkflowStore } from "../state/workflowState";
import { useHDLDesignStore } from '../state/hdlDesignStore';

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
  const { markComplete, setStage, getNextStage } = useWorkflowStore();
  const { setDesign, loadFromLocalStorage } = useHDLDesignStore();

  useEffect(() => {
    setStage('HDL');
    loadFromLocalStorage();
  }, [setStage, loadFromLocalStorage]);
  
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [verilog, setVerilog] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [advice, setAdvice] = useState<ReflexionAdvice | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'testing' | 'reviewing' | 'failed' | 'passed'>('idle');
  const [iteration, setIteration] = useState(0);
  const [activeTab, setActiveTab] = useState('design');
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!moduleName.trim() || !description.trim()) return;
    
    setStatus('generating');
    setIteration(prev => prev + 1);
    
    try {
      // Generate Verilog with AI-determined I/O ports
      const code = generateVerilog({ moduleName, description, io: [] });
      setVerilog(code);
      setDesign({ moduleName, description, io: [], verilog: code }); // <-- Save to store
      
      // Run test bench
      setStatus('testing');
      const result = await runTestBench(code);
      setTestResult(result);
      
      if (result.passed) {
        setStatus('passed');
        markComplete('HDL');
      } else {
        setStatus('failed');
        // Get AI advice for improvement
        setStatus('reviewing');
        const aiAdvice = await getReflexionAdvice(code, result.feedback);
        setAdvice(aiAdvice);
        setStatus('failed');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('failed');
    }
  };

  const handleRegenerate = async () => {
    if (!moduleName.trim() || !description.trim()) return;
    
    setStatus('generating');
    setIteration(prev => prev + 1);
    
    try {
      // Generate improved Verilog based on previous feedback
      const improvedCode = generateVerilog({ 
        moduleName, 
        description, 
        io: [],
        previousCode: verilog,
        feedback: testResult?.feedback || '',
        advice: advice?.suggestions.join('\n') || ''
      });
      setVerilog(improvedCode);
      setDesign({ moduleName, description, io: [], verilog: improvedCode });
      
      // Test the improved code
      setStatus('testing');
      const result = await runTestBench(improvedCode);
      setTestResult(result);
      
      if (result.passed) {
        setStatus('passed');
        markComplete('HDL');
      } else {
        setStatus('failed');
        // Get new AI advice
        setStatus('reviewing');
        const aiAdvice = await getReflexionAdvice(improvedCode, result.feedback);
        setAdvice(aiAdvice);
        setStatus('failed');
      }
    } catch (error) {
      console.error('Regeneration failed:', error);
      setStatus('failed');
    }
  };

  const handleSave = () => {
    if (!moduleName.trim() || !description.trim()) return;
    
    const design: HDLDesign = {
      id: currentDesignId || Date.now().toString(),
      name: moduleName,
      description,
      verilog,
      io: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveHDLDesign(design);
    setCurrentDesignId(design.id);
  };

  const handleExport = () => {
    if (!verilog) return;
    
    const blob = new Blob([verilog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${moduleName || 'module'}.v`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400';
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <WorkflowNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            <Brain className="inline h-8 w-8 mr-3 text-cyan-400" />
            AI-Powered HDL Design
          </h1>
          <p className="text-slate-400">
            Describe your digital circuit in natural language and let AI generate the Verilog code
          </p>
        </div>

        {/* Status Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="font-medium">
                {status === 'idle' && 'Ready to generate'}
                {status === 'generating' && 'Generating HDL code...'}
                {status === 'testing' && 'Running simulation...'}
                {status === 'reviewing' && 'Getting AI advice...'}
                {status === 'passed' && 'Design passed all tests!'}
                {status === 'failed' && 'Design needs improvement'}
              </span>
            </div>
            
            {status === 'generating' && (
              <Progress value={33} className="flex-1" />
            )}
            {status === 'testing' && (
              <Progress value={66} className="flex-1" />
            )}
            {status === 'reviewing' && (
              <Progress value={90} className="flex-1" />
            )}
            
            {iteration > 0 && (
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                Iteration {iteration}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Conversational Design Input */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                  Describe Your Circuit
                </CardTitle>
                <CardDescription>
                  Tell me what you want to build in natural language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moduleName">Module Name</Label>
                  <Input
                    id="moduleName"
                    placeholder="e.g., alu_4bit, counter_8bit, memory_controller"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="bg-slate-900 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Circuit Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your circuit in detail. For example: 'A 4-bit ALU that performs addition, subtraction, AND, and OR operations. It takes two 4-bit inputs A and B, a 2-bit operation code, and outputs a 4-bit result and a carry flag.'"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] bg-slate-900 border-slate-600"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!moduleName.trim() || !description.trim() || status !== 'idle'}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Generate Circuit
                  </Button>
                  {status === 'failed' && advice && (
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Improve
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
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-400" />
                        Generated Verilog
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleExport}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {verilog ? (
                      <pre className="bg-slate-900 p-4 rounded-lg text-sm font-mono text-slate-200 overflow-x-auto">
                        <code>{verilog}</code>
                      </pre>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Generated Verilog code will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-yellow-400" />
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResult ? (
                      <div className="space-y-4">
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${
                          testResult.passed 
                            ? 'bg-green-500/10 border border-green-500/20' 
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                          {testResult.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          )}
                          <span className="font-medium">
                            {testResult.passed ? 'All tests passed!' : 'Tests failed'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-200">Feedback:</h4>
                          <p className="text-slate-300 text-sm">{testResult.feedback}</p>
                        </div>
                        
                        {testResult.warnings.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-200">Warnings:</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                              {testResult.warnings.map((warning, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-yellow-400">⚠</span>
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {testResult.errors.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-200">Errors:</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                              {testResult.errors.map((error, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-red-400">✗</span>
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="text-sm text-slate-400">
                          Simulation time: {testResult.simulationTime}ms
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Test results will appear here after generation</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advice" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-purple-400" />
                      AI Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {advice ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <Sparkles className="h-5 w-5 text-purple-400" />
                          <span className="font-medium text-slate-200">
                            AI Confidence: {Math.round(advice.confidence * 100)}%
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-slate-200">Code Review:</h4>
                          <p className="text-slate-300 text-sm">{advice.codeReview}</p>
                        </div>
                        
                        {advice.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-200">Suggestions:</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                              {advice.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-purple-400">💡</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {advice.improvements.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-200">Improvements:</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                              {advice.improvements.map((improvement, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-green-400">✓</span>
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>AI advice will appear here when needed</p>
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