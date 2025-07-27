// File: src/components/chipforge/HDLGenerator.tsx

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Play,
  Save,
  Download,
  AlertTriangle
} from 'lucide-react';
import { apiService, type SyntaxCheckResponse } from '@/services/api';

export default function HDLGenerator() {
  const [code, setCode] = useState(`// Write Verilog here...
module example (
  input clk,
  input rst_n,
  input enable,
  output reg [7:0] count
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= 8'h00;
    end else if (enable) begin
      count <= count + 1;
    end
  end

endmodule`);
  const [errors, setErrors] = useState<SyntaxCheckResponse['errors']>([]);
  const [warnings, setWarnings] = useState<SyntaxCheckResponse['warnings']>([]);
  const [moduleInfo, setModuleInfo] = useState<SyntaxCheckResponse['moduleInfo']>();
  const [aiLoading, setAiLoading] = useState(false);
  const [syntaxLoading, setSyntaxLoading] = useState(false);
  const [moduleName, setModuleName] = useState('example');

  // Call backend to check syntax whenever code changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      checkSyntax(code);
    }, 800); // debounce

    return () => clearTimeout(timeout);
  }, [code]);

  const checkSyntax = async (verilogCode: string) => {
    setSyntaxLoading(true);
    try {
      const result = await apiService.syntaxCheck({ code: verilogCode });
      setErrors(result.errors);
      setWarnings(result.warnings);
      setModuleInfo(result.moduleInfo);
    } catch (err) {
      setErrors([{
        line: 1,
        column: 1,
        message: 'Syntax check failed',
        severity: 'error'
      }]);
    } finally {
      setSyntaxLoading(false);
    }
  };

  const generateHDL = async () => {
    setAiLoading(true);
    try {
      const result = await apiService.generateHDL({
        prompt: 'Design a simple 3-state traffic light FSM in Verilog',
        moduleName: moduleName || 'traffic_light_fsm'
      });
      setCode(result.code);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${moduleName}.v`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    // This would integrate with your simulation backend
    console.log('Running simulation for:', code);
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="shadow-xl bg-slate-900 border-slate-700">
        <CardContent className="space-y-4 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Code className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-slate-100">HDL Generator</h2>
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                Monaco Editor
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={generateHDL} 
                disabled={aiLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
              <Button 
                onClick={handleRunSimulation}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Simulate
              </Button>
              <Button 
                onClick={handleSave}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Module Name</label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
              placeholder="Enter module name"
            />
          </div>

          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="verilog"
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                tabSize: 2,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {syntaxLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking syntax...</span>
              </div>
            ) : errors.length > 0 || warnings.length > 0 ? (
              <div className="space-y-2 w-full">
                {errors.length > 0 && (
                  <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-red-400">Syntax Errors ({errors.length})</AlertTitle>
                    <AlertDescription className="text-red-300">
                      <ul className="list-disc ml-4 space-y-1">
                        {errors.map((err, i) => (
                          <li key={i}>
                            <span className="font-mono text-xs">Line {err.line}:{err.column}</span> - {err.message}
                            {err.code && (
                              <Badge variant="outline" className="ml-2 text-xs border-red-400 text-red-300">
                                {err.code}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                {warnings.length > 0 && (
                  <Alert className="border-yellow-500/20 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertTitle className="text-yellow-400">Warnings ({warnings.length})</AlertTitle>
                    <AlertDescription className="text-yellow-300">
                      <ul className="list-disc ml-4 space-y-1">
                        {warnings.map((warning, i) => (
                          <li key={i}>
                            <span className="font-mono text-xs">Line {warning.line}:{warning.column}</span> - {warning.message}
                            {warning.code && (
                              <Badge variant="outline" className="ml-2 text-xs border-yellow-400 text-yellow-300">
                                {warning.code}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>✔️ No syntax errors</span>
                </div>
                {moduleInfo && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Module Analysis</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-300">
                        <span className="text-slate-400">Name:</span> {moduleInfo.name}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Ports:</span> {moduleInfo.portCount}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Signals:</span> {moduleInfo.signalCount}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Always Blocks:</span> {moduleInfo.alwaysBlockCount}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Assignments:</span> {moduleInfo.assignCount}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 