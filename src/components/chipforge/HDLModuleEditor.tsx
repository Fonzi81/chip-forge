import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Code, 
  Save, 
  Download,
  Plus,
  X
} from "lucide-react";
import { generateVerilog } from '../../backend/hdl-gen/generateHDL';

export default function HDLModuleEditor() {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [io, setIo] = useState([{ name: '', direction: 'input' as 'input' | 'output', width: 1 }]);
  const [verilog, setVerilog] = useState('');

  const handleGenerate = () => {
    const code = generateVerilog({ moduleName, description, io });
    setVerilog(code);
  };

  const handleSave = () => {
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

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">AI HDL Generator</h2>
          <Badge variant="secondary" className="bg-emerald-800 text-emerald-200">
            Simplified
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {verilog && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 p-4 border-r border-slate-700">
          <Card className="h-full bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                Module Configuration
              </CardTitle>
              <CardDescription>
                Configure your HDL module parameters
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
                  className="bg-slate-900 border-slate-600 text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this module do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] bg-slate-900 border-slate-600 text-slate-100"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>I/O Ports</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPort}
                  >
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

              <Button
                onClick={handleGenerate}
                disabled={!moduleName.trim() || !description.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Verilog
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-5 w-5 text-cyan-400" />
                Generated Verilog
              </h3>
              {verilog && (
                <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                  Generated
                </Badge>
              )}
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4">
              {verilog ? (
                <div className="h-full bg-slate-800 rounded p-4 overflow-auto">
                  <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                    {verilog}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No Verilog code generated yet</p>
                    <p className="text-sm">Configure your module and click Generate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 