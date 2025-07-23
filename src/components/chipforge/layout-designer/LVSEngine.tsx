import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Play,
  RefreshCw,
  Download,
  Upload
} from "lucide-react";
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';
import type { Cell, Pin } from './CellLibrary';
import {
  extractNetlistFromSchematic,
  extractNetlistFromLayout,
  compareNetlists,
  LVSResult
} from '../../../backend/layout/lvs';
import { CELL_TEMPLATES } from './CellLibrary';

interface LVSEngineProps {
  schematicVerilog?: string; // Verilog code for schematic
  onResultsChange?: (results: LVSResult[]) => void;
}

export default function LVSEngine({ schematicVerilog, onResultsChange }: LVSEngineProps) {
  const { cells } = useLayoutEditorStore();
  const [results, setResults] = useState<LVSResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Map CellInstance[] to Cell[]
  const getCellsForLVS = () => {
    return cells.map(instance => {
      const template = CELL_TEMPLATES[instance.type];
      return {
        id: instance.id,
        name: instance.type,
        type: instance.type,
        x: instance.x,
        y: instance.y,
        width: template?.width || 80,
        height: template?.height || 60,
        pins: template?.pins || [],
        category: template?.category,
        description: template?.description,
      };
    });
  };

  const runLVS = useCallback(async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const layoutNetlist = extractNetlistFromLayout(getCellsForLVS());
    let schematicNetlist = undefined;
    if (schematicVerilog) {
      schematicNetlist = extractNetlistFromSchematic(schematicVerilog);
    }
    let lvsResults: LVSResult[] = [];
    if (schematicNetlist) {
      lvsResults = compareNetlists(schematicNetlist, layoutNetlist);
    } else {
      lvsResults.push({
        type: 'info',
        message: 'No schematic netlist provided. Only layout netlist extracted.'
      });
    }
    setResults(lvsResults);
    onResultsChange?.(lvsResults);
    setIsRunning(false);
  }, [cells, schematicVerilog, onResultsChange]);

  const clearResults = () => {
    setResults([]);
    onResultsChange?.([]);
  };

  const exportLVSReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      results,
      summary: {
        total: results.length,
        errors: results.filter(r => r.type === 'error').length,
        warnings: results.filter(r => r.type === 'warning').length,
        info: results.filter(r => r.type === 'info').length
      }
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lvs_report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resultCounts = {
    error: results.filter(r => r.type === 'error').length,
    warning: results.filter(r => r.type === 'warning').length,
    info: results.filter(r => r.type === 'info').length
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">LVS Engine</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={runLVS}
            disabled={isRunning}
            className="h-6 px-2 text-xs"
          >
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearResults}
            className="h-6 px-2 text-xs"
          >
            <XCircle className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Status:</span>
          <span>{isRunning ? 'Running...' : 'Ready'}</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="text-xs">
            {resultCounts.error} Errors
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {resultCounts.warning} Warnings
          </Badge>
          <Badge variant="outline" className="text-xs">
            {resultCounts.info} Info
          </Badge>
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-200">Results</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportLVSReport}
            className="h-6 px-2 text-xs"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center text-slate-500 py-4">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm">No LVS issues found</p>
            </div>
          ) : (
            results.map((result, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-xs border-l-4 ${
                  result.type === 'error' 
                    ? 'bg-red-900/20 border-red-500 text-red-200'
                    : result.type === 'warning'
                    ? 'bg-yellow-900/20 border-yellow-500 text-yellow-200'
                    : 'bg-blue-900/20 border-blue-500 text-blue-200'
                }`}
              >
                <div className="font-medium">{result.message}</div>
                {result.net && <div className="text-slate-400">Net: {result.net}</div>}
                {result.cellIds && <div className="text-slate-500 mt-1">Cells: {result.cellIds.join(', ')}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 