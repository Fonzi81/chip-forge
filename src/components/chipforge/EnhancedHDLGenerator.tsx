import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Code, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  BarChart3,
  Sparkles
} from "lucide-react";
import { hdlGenerator } from '../../backend/hdl-gen';
import { type ReflexionLoop } from '../../backend/hdl-gen/aiModel';

interface GenerationResult {
  code: string;
  metadata: {
    estimatedGates: number;
    estimatedFrequency: number;
    warnings: string[];
    suggestions: string[];
  };
  reflexionLoop?: ReflexionLoop;
}

export default function EnhancedHDLGenerator() {
  const [description, setDescription] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<'verilog' | 'vhdl' | 'systemverilog'>('verilog');
  const [style, setStyle] = useState<'behavioral' | 'structural' | 'rtl'>('rtl');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useReflexion, setUseReflexion] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const request = {
        description: description.trim(),
        targetLanguage,
        style,
        moduleName: moduleName || undefined,
        constraints: {
          maxGates: 1000,
          targetFrequency: 100,
          powerBudget: 100
        }
      };

      let generationResult;
      if (useReflexion) {
        generationResult = await hdlGenerator.generateHDLWithReflexion(request);
      } else {
        generationResult = await hdlGenerator.generateHDL(request);
      }

      setResult(generationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Enhanced AI HDL Generator
          </CardTitle>
          <CardDescription className="text-slate-400">
            Generate high-quality HDL code using advanced AI with reflexion loops
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="moduleName" className="text-slate-300">Module Name</Label>
              <Input
                id="moduleName"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="e.g., counter, alu, fifo"
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="targetLanguage" className="text-slate-300">Target Language</Label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as any)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
              >
                <option value="verilog">Verilog</option>
                <option value="vhdl">VHDL</option>
                <option value="systemverilog">SystemVerilog</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="style" className="text-slate-300">Design Style</Label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
            >
              <option value="rtl">RTL (Register Transfer Level)</option>
              <option value="behavioral">Behavioral</option>
              <option value="structural">Structural</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the HDL module you want to generate. Be specific about functionality, inputs, outputs, and requirements."
              className="bg-slate-700 border-slate-600 text-slate-100 min-h-[120px]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate HDL
                </>
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useReflexion"
                checked={useReflexion}
                onChange={(e) => setUseReflexion(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700"
              />
              <Label htmlFor="useReflexion" className="text-slate-300 flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Use Reflexion Loop
              </Label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated HDL Code
            </CardTitle>
            <CardDescription className="text-slate-400">
              AI-generated {targetLanguage.toUpperCase()} code with metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="code">Generated Code</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                {result.reflexionLoop && (
                  <TabsTrigger value="reflexion">Reflexion Loop</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="code" className="mt-4">
                <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                  <pre className="text-slate-100 text-sm overflow-x-auto">
                    <code>{result.code}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-100">{result.metadata.estimatedGates}</div>
                      <div className="text-sm text-slate-400">Estimated Gates</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-100">{result.metadata.estimatedFrequency} MHz</div>
                      <div className="text-sm text-slate-400">Target Frequency</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {result.metadata.warnings.length === 0 ? '✅' : '⚠️'}
                      </div>
                      <div className="text-sm text-slate-400">Status</div>
                    </div>
                  </div>

                  {result.metadata.warnings.length > 0 && (
                    <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                      <h3 className="text-yellow-400 font-semibold mb-2">Warnings</h3>
                      <ul className="text-yellow-300 text-sm space-y-1">
                        {result.metadata.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.metadata.suggestions.length > 0 && (
                    <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <h3 className="text-blue-400 font-semibold mb-2">Suggestions</h3>
                      <ul className="text-blue-300 text-sm space-y-1">
                        {result.metadata.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {result.reflexionLoop && (
                <TabsContent value="reflexion" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-slate-200 font-semibold">Reflexion Loop Results</h3>
                        <p className="text-slate-400 text-sm">
                          Iterations: {result.reflexionLoop.iterations} | 
                          Success: {result.reflexionLoop.success ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <Badge variant={result.reflexionLoop.success ? "default" : "destructive"}>
                        {result.reflexionLoop.success ? 'Success' : 'Incomplete'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {result.reflexionLoop.steps.map((step, index) => (
                        <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Step {step.step}
                              </Badge>
                              <span className="text-slate-200 font-medium capitalize">
                                {step.action}
                              </span>
                            </div>
                            <div className={`text-sm ${getConfidenceColor(step.confidence)}`}>
                              {getConfidenceText(step.confidence)} Confidence
                            </div>
                          </div>
                          
                          {step.action === 'generate' && (
                            <div className="text-sm text-slate-300">
                              <strong>Generated:</strong> {step.output.substring(0, 100)}...
                            </div>
                          )}
                          
                          {step.action === 'review' && step.feedback.length > 0 && (
                            <div className="text-sm text-slate-300">
                              <strong>Feedback:</strong>
                              <ul className="mt-1 space-y-1">
                                {step.feedback.map((feedback, idx) => (
                                  <li key={idx}>• {feedback}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 