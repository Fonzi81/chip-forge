import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Settings,
  Play,
  FileText,
  Target,
  Shield,
  Zap,
  BarChart3
} from "lucide-react";
import { generateTestbench, TestbenchResult, TestbenchConfig } from '../../backend/testbench/generateTestbench';
import { loadDesign, saveDesign } from '../../utils/localStorage';

interface TestbenchEditorProps {
  onTestbenchGenerated?: (testbench: TestbenchResult) => void;
  initialHdlCode?: string;
}

export default function TestbenchEditor({ onTestbenchGenerated, initialHdlCode }: TestbenchEditorProps) {
  const [description, setDescription] = useState('');
  const [testbenchResult, setTestbenchResult] = useState<TestbenchResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('description');
  const [config, setConfig] = useState<Partial<TestbenchConfig>>({
    clockPeriod: 10,
    simulationTime: 1000
  });
  const [moduleType, setModuleType] = useState<'auto' | 'alu' | 'counter' | 'memory' | 'multiplexer' | 'fsm' | 'generic'>('auto');
  const [enableCoverage, setEnableCoverage] = useState(true);
  const [enableAssertions, setEnableAssertions] = useState(true);
  const [enableWaveform, setEnableWaveform] = useState(true);

  // Load HDL code from localStorage or use provided code
  const [hdlCode, setHdlCode] = useState(initialHdlCode || '');

  useEffect(() => {
    if (!initialHdlCode) {
      const savedHdl = loadDesign('active') || '';
      setHdlCode(savedHdl);
    }
  }, [initialHdlCode]);

  const handleGenerate = async () => {
    if (!hdlCode.trim()) {
      setStatus('error');
      return;
    }

    setStatus('generating');
    
    try {
      const result = await generateTestbench(hdlCode, description, config);
      setTestbenchResult(result);
      onTestbenchGenerated?.(result);
      setStatus('idle');
    } catch (error) {
      console.error('Testbench generation failed:', error);
      setStatus('error');
    }
  };

  const handleSave = () => {
    if (testbenchResult) {
      saveDesign('testbench-active', testbenchResult.testbenchCode);
    }
  };

  const handleDownload = () => {
    if (testbenchResult) {
      const blob = new Blob([testbenchResult.testbenchCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${testbenchResult.metadata.moduleName}_tb.v`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getModuleTypeFromHdl = (code: string): string => {
    if (code.toLowerCase().includes('alu') || code.toLowerCase().includes('arithmetic')) return 'alu';
    if (code.toLowerCase().includes('counter')) return 'counter';
    if (code.toLowerCase().includes('memory') || code.toLowerCase().includes('ram')) return 'memory';
    if (code.toLowerCase().includes('multiplexer') || code.toLowerCase().includes('mux')) return 'multiplexer';
    if (code.toLowerCase().includes('state') || code.toLowerCase().includes('fsm')) return 'fsm';
    return 'generic';
  };

  const detectedModuleType = getModuleTypeFromHdl(hdlCode);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Testbench Generator
            </h1>
            <p className="text-slate-400 mt-2">
              Generate comprehensive testbenches with AI assistance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            {testbenchResult && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Generated
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* HDL Code Preview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-cyan-400" />
                  HDL Module
                </CardTitle>
                <CardDescription>
                  {hdlCode ? 'Module loaded successfully' : 'No HDL module found'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hdlCode ? (
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-blue-400">
                      {detectedModuleType.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-slate-400">
                      {hdlCode.split('\n').length} lines of code
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Please load an HDL module first</p>
                )}
              </CardContent>
            </Card>

            {/* Testbench Configuration */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Module Type</Label>
                  <Select value={moduleType} onValueChange={(value: any) => setModuleType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect ({detectedModuleType})</SelectItem>
                      <SelectItem value="alu">ALU</SelectItem>
                      <SelectItem value="counter">Counter</SelectItem>
                      <SelectItem value="memory">Memory</SelectItem>
                      <SelectItem value="multiplexer">Multiplexer</SelectItem>
                      <SelectItem value="fsm">Finite State Machine</SelectItem>
                      <SelectItem value="generic">Generic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Clock Period (ns)</Label>
                  <Input
                    type="number"
                    value={config.clockPeriod}
                    onChange={(e) => setConfig({ ...config, clockPeriod: parseInt(e.target.value) || 10 })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Simulation Time (ns)</Label>
                  <Input
                    type="number"
                    value={config.simulationTime}
                    onChange={(e) => setConfig({ ...config, simulationTime: parseInt(e.target.value) || 1000 })}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Coverage</Label>
                    <Switch
                      checked={enableCoverage}
                      onCheckedChange={setEnableCoverage}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Assertions</Label>
                    <Switch
                      checked={enableAssertions}
                      onCheckedChange={setEnableAssertions}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Waveform Dump</Label>
                    <Switch
                      checked={enableWaveform}
                      onCheckedChange={setEnableWaveform}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={status === 'generating' || !hdlCode.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {status === 'generating' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Testbench
                </>
              )}
            </Button>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Input */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-cyan-400" />
                  Test Description
                </CardTitle>
                <CardDescription>
                  Describe how you want to test the module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the test scenarios you want to cover (e.g., 'Test all ALU operations with edge cases, verify reset behavior, check overflow conditions')"
                  className="min-h-[120px] resize-none bg-slate-700 border-slate-600 text-slate-100"
                />
              </CardContent>
            </Card>

            {/* Results Tabs */}
            {testbenchResult && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-cyan-400" />
                      Generated Testbench
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="vectors">Test Vectors</TabsTrigger>
                      <TabsTrigger value="coverage">Coverage</TabsTrigger>
                      <TabsTrigger value="assertions">Assertions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="code" className="mt-4">
                      <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                        <pre className="text-sm text-slate-200 overflow-auto max-h-96">
                          <code>{testbenchResult.testbenchCode}</code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="vectors" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {testbenchResult.testVectors.map((vector, index) => (
                            <Card key={index} className="bg-slate-700 border-slate-600">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-slate-200 mb-2">{vector.name}</h4>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm text-slate-400">Inputs:</span>
                                    <div className="text-sm text-slate-300">
                                      {Object.entries(vector.inputs).map(([key, value]) => (
                                        <div key={key}>{key}: {value}</div>
                                      ))}
                                    </div>
                                  </div>
                                  {vector.expectedOutputs && (
                                    <div>
                                      <span className="text-sm text-slate-400">Expected:</span>
                                      <div className="text-sm text-slate-300">
                                        {Object.entries(vector.expectedOutputs).map(([key, value]) => (
                                          <div key={key}>{key}: {value}</div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-sm text-slate-400">
                                    Delay: {vector.delay}ns
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="coverage" className="mt-4">
                      <div className="space-y-4">
                        {testbenchResult.coverageGoals.map((goal, index) => (
                          <Card key={index} className="bg-slate-700 border-slate-600">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-slate-200 capitalize">{goal.type} Coverage</h4>
                                  <p className="text-sm text-slate-400">{goal.description}</p>
                                </div>
                                <Badge variant="outline" className="text-blue-400">
                                  {goal.target}%
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="assertions" className="mt-4">
                      <div className="space-y-4">
                        {testbenchResult.assertions.map((assertion, index) => (
                          <Card key={index} className="bg-slate-700 border-slate-600">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-200">{assertion.message}</h4>
                                  <p className="text-sm text-slate-400 font-mono mt-1">
                                    {assertion.condition}
                                  </p>
                                </div>
                                <Badge 
                                  variant={assertion.severity === 'error' ? 'destructive' : 'secondary'}
                                  className={assertion.severity === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}
                                >
                                  {assertion.severity}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {status === 'error' && (
              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div>
                      <h4 className="font-semibold text-red-400">Generation Failed</h4>
                      <p className="text-sm text-red-300">
                        Please check your HDL code and try again.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Metadata */}
        {testbenchResult && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{testbenchResult.testVectors.length}</div>
                  <div className="text-sm text-slate-400">Test Vectors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{testbenchResult.coverageGoals.length}</div>
                  <div className="text-sm text-slate-400">Coverage Goals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{testbenchResult.assertions.length}</div>
                  <div className="text-sm text-slate-400">Assertions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{testbenchResult.metadata.simulationTime}ns</div>
                  <div className="text-sm text-slate-400">Simulation Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 