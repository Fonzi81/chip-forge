import React, { useState, useEffect, useCallback } from 'react';
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
  Pause,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';
import type { Cell } from './CellLibrary';

export interface DRCRule {
  id: string;
  name: string;
  category: DRCRuleCategory;
  description: string;
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  parameters: {
    minSpacing?: number;
    minWidth?: number;
    minArea?: number;
    maxWidth?: number;
    layer1?: string;
    layer2?: string;
  };
}

export type DRCRuleCategory = 
  | 'spacing' 
  | 'width' 
  | 'area' 
  | 'overlap' 
  | 'electrical' 
  | 'density' 
  | 'antenna';

export interface DRCViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  objects: string[]; // Cell IDs involved
  timestamp: Date;
}

// Default DRC rules for a typical 180nm process
const DEFAULT_DRC_RULES: DRCRule[] = [
  // Spacing rules
  {
    id: 'min_spacing_metal1',
    name: 'Minimum Metal1 Spacing',
    category: 'spacing',
    description: 'Minimum spacing between Metal1 shapes',
    severity: 'error',
    enabled: true,
    parameters: { minSpacing: 0.28, layer1: 'metal1' }
  },
  {
    id: 'min_spacing_metal2',
    name: 'Minimum Metal2 Spacing',
    category: 'spacing',
    description: 'Minimum spacing between Metal2 shapes',
    severity: 'error',
    enabled: true,
    parameters: { minSpacing: 0.28, layer1: 'metal2' }
  },
  {
    id: 'min_spacing_poly',
    name: 'Minimum Poly Spacing',
    category: 'spacing',
    description: 'Minimum spacing between Poly shapes',
    severity: 'error',
    enabled: true,
    parameters: { minSpacing: 0.24, layer1: 'poly' }
  },
  {
    id: 'min_spacing_diffusion',
    name: 'Minimum Diffusion Spacing',
    category: 'spacing',
    description: 'Minimum spacing between Diffusion shapes',
    severity: 'error',
    enabled: true,
    parameters: { minSpacing: 0.27, layer1: 'diffusion' }
  },

  // Width rules
  {
    id: 'min_width_metal1',
    name: 'Minimum Metal1 Width',
    category: 'width',
    description: 'Minimum width for Metal1 shapes',
    severity: 'error',
    enabled: true,
    parameters: { minWidth: 0.23, layer1: 'metal1' }
  },
  {
    id: 'min_width_metal2',
    name: 'Minimum Metal2 Width',
    category: 'width',
    description: 'Minimum width for Metal2 shapes',
    severity: 'error',
    enabled: true,
    parameters: { minWidth: 0.23, layer1: 'metal2' }
  },
  {
    id: 'min_width_poly',
    name: 'Minimum Poly Width',
    category: 'width',
    description: 'Minimum width for Poly shapes',
    severity: 'error',
    enabled: true,
    parameters: { minWidth: 0.18, layer1: 'poly' }
  },
  {
    id: 'min_width_diffusion',
    name: 'Minimum Diffusion Width',
    category: 'width',
    description: 'Minimum width for Diffusion shapes',
    severity: 'error',
    enabled: true,
    parameters: { minWidth: 0.22, layer1: 'diffusion' }
  },

  // Area rules
  {
    id: 'min_area_metal1',
    name: 'Minimum Metal1 Area',
    category: 'area',
    description: 'Minimum area for Metal1 shapes',
    severity: 'warning',
    enabled: true,
    parameters: { minArea: 0.12, layer1: 'metal1' }
  },
  {
    id: 'min_area_poly',
    name: 'Minimum Poly Area',
    category: 'area',
    description: 'Minimum area for Poly shapes',
    severity: 'warning',
    enabled: true,
    parameters: { minArea: 0.08, layer1: 'poly' }
  },

  // Overlap rules
  {
    id: 'metal1_poly_overlap',
    name: 'Metal1-Poly Overlap',
    category: 'overlap',
    description: 'Minimum overlap between Metal1 and Poly',
    severity: 'error',
    enabled: true,
    parameters: { minSpacing: 0.14, layer1: 'metal1', layer2: 'poly' }
  },

  // Electrical rules
  {
    id: 'floating_poly',
    name: 'Floating Poly Check',
    category: 'electrical',
    description: 'Check for floating Poly shapes',
    severity: 'warning',
    enabled: true,
    parameters: { layer1: 'poly' }
  },
  {
    id: 'floating_metal1',
    name: 'Floating Metal1 Check',
    category: 'electrical',
    description: 'Check for floating Metal1 shapes',
    severity: 'warning',
    enabled: true,
    parameters: { layer1: 'metal1' }
  },

  // Density rules
  {
    id: 'metal1_density',
    name: 'Metal1 Density Check',
    category: 'density',
    description: 'Check Metal1 density within specified area',
    severity: 'info',
    enabled: false,
    parameters: { layer1: 'metal1' }
  }
];

interface DRCEngineProps {
  onViolationsChange?: (violations: DRCViolation[]) => void;
  onRuleToggle?: (ruleId: string, enabled: boolean) => void;
}

export default function DRCEngine({ onViolationsChange, onRuleToggle }: DRCEngineProps) {
  const { cells } = useLayoutEditorStore();
  const [rules, setRules] = useState<DRCRule[]>(DEFAULT_DRC_RULES);
  const [violations, setViolations] = useState<DRCViolation[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DRCRuleCategory>('spacing');
  const [showViolations, setShowViolations] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  // DRC Engine core functions
  const checkSpacingRules = useCallback((cells: Cell[], rules: DRCRule[]): DRCViolation[] => {
    const violations: DRCViolation[] = [];
    
    rules.filter(rule => rule.category === 'spacing' && rule.enabled).forEach(rule => {
      const minSpacing = rule.parameters.minSpacing || 0;
      
      // Check spacing between all cells
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          const cell1 = cells[i];
          const cell2 = cells[j];
          
          const distance = Math.sqrt(
            Math.pow(cell1.x - cell2.x, 2) + Math.pow(cell1.y - cell2.y, 2)
          );
          
          if (distance < minSpacing) {
            violations.push({
              id: `violation_${Date.now()}_${Math.random()}`,
              ruleId: rule.id,
              ruleName: rule.name,
              severity: rule.severity,
              message: `${rule.name}: Distance ${distance.toFixed(2)} < ${minSpacing}`,
              location: {
                x: (cell1.x + cell2.x) / 2,
                y: (cell1.y + cell2.y) / 2,
                width: Math.abs(cell1.x - cell2.x),
                height: Math.abs(cell1.y - cell2.y)
              },
              objects: [cell1.id, cell2.id],
              timestamp: new Date()
            });
          }
        }
      }
    });
    
    return violations;
  }, []);

  const checkWidthRules = useCallback((cells: Cell[], rules: DRCRule[]): DRCViolation[] => {
    const violations: DRCViolation[] = [];
    
    rules.filter(rule => rule.category === 'width' && rule.enabled).forEach(rule => {
      const minWidth = rule.parameters.minWidth || 0;
      
      cells.forEach(cell => {
        if (cell.width < minWidth) {
          violations.push({
            id: `violation_${Date.now()}_${Math.random()}`,
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            message: `${rule.name}: Width ${cell.width} < ${minWidth}`,
            location: {
              x: cell.x,
              y: cell.y,
              width: cell.width,
              height: cell.height
            },
            objects: [cell.id],
            timestamp: new Date()
          });
        }
      });
    });
    
    return violations;
  }, []);

  const checkAreaRules = useCallback((cells: Cell[], rules: DRCRule[]): DRCViolation[] => {
    const violations: DRCViolation[] = [];
    
    rules.filter(rule => rule.category === 'area' && rule.enabled).forEach(rule => {
      const minArea = rule.parameters.minArea || 0;
      
      cells.forEach(cell => {
        const area = cell.width * cell.height;
        if (area < minArea) {
          violations.push({
            id: `violation_${Date.now()}_${Math.random()}`,
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            message: `${rule.name}: Area ${area} < ${minArea}`,
            location: {
              x: cell.x,
              y: cell.y,
              width: cell.width,
              height: cell.height
            },
            objects: [cell.id],
            timestamp: new Date()
          });
        }
      });
    });
    
    return violations;
  }, []);

  const runDRC = useCallback(async () => {
    setIsRunning(true);
    
    // Simulate DRC processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allViolations: DRCViolation[] = [
      ...checkSpacingRules(cells, rules),
      ...checkWidthRules(cells, rules),
      ...checkAreaRules(cells, rules)
    ];
    
    setViolations(allViolations);
    onViolationsChange?.(allViolations);
    setIsRunning(false);
  }, [cells, rules, checkSpacingRules, checkWidthRules, checkAreaRules, onViolationsChange]);

  const toggleRule = (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
    onRuleToggle?.(ruleId, enabled);
  };

  const clearViolations = () => {
    setViolations([]);
    onViolationsChange?.([]);
  };

  const exportDRCReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      rules: rules.filter(r => r.enabled),
      violations: violations,
      summary: {
        total: violations.length,
        errors: violations.filter(v => v.severity === 'error').length,
        warnings: violations.filter(v => v.severity === 'warning').length,
        info: violations.filter(v => v.severity === 'info').length
      }
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drc_report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredViolations = violations.filter(v => 
    filterSeverity === 'all' || v.severity === filterSeverity
  );

  const violationCounts = {
    error: violations.filter(v => v.severity === 'error').length,
    warning: violations.filter(v => v.severity === 'warning').length,
    info: violations.filter(v => v.severity === 'info').length
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">DRC Engine</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={runDRC}
            disabled={isRunning}
            className="h-6 px-2 text-xs"
          >
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearViolations}
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
            {violationCounts.error} Errors
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {violationCounts.warning} Warnings
          </Badge>
          <Badge variant="outline" className="text-xs">
            {violationCounts.info} Info
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as DRCRuleCategory)}>
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="spacing" className="text-xs">Spacing</TabsTrigger>
          <TabsTrigger value="width" className="text-xs">Width</TabsTrigger>
          <TabsTrigger value="area" className="text-xs">Area</TabsTrigger>
        </TabsList>

        {/* Rules */}
        <TabsContent value={selectedCategory} className="space-y-2 max-h-48 overflow-y-auto">
          {rules
            .filter(rule => rule.category === selectedCategory)
            .map(rule => (
              <div
                key={rule.id}
                className="flex items-center gap-2 p-2 bg-slate-700 border border-slate-600 rounded"
              >
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) => toggleRule(rule.id, e.target.checked)}
                  className="w-3 h-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {rule.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {rule.description}
                  </div>
                </div>
                <Badge 
                  variant={rule.severity === 'error' ? 'destructive' : rule.severity === 'warning' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {rule.severity}
                </Badge>
              </div>
            ))}
        </TabsContent>
      </Tabs>

      {/* Violations */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-200">Violations</h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowViolations(!showViolations)}
              className="h-6 px-2 text-xs"
            >
              {showViolations ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportDRCReport}
              className="h-6 px-2 text-xs"
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {showViolations && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filteredViolations.length === 0 ? (
              <div className="text-center text-slate-500 py-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No violations found</p>
              </div>
            ) : (
              filteredViolations.map(violation => (
                <div
                  key={violation.id}
                  className={`p-2 rounded text-xs border-l-4 ${
                    violation.severity === 'error' 
                      ? 'bg-red-900/20 border-red-500 text-red-200'
                      : violation.severity === 'warning'
                      ? 'bg-yellow-900/20 border-yellow-500 text-yellow-200'
                      : 'bg-blue-900/20 border-blue-500 text-blue-200'
                  }`}
                >
                  <div className="font-medium">{violation.ruleName}</div>
                  <div className="text-slate-400">{violation.message}</div>
                  <div className="text-slate-500 mt-1">
                    At ({violation.location.x.toFixed(1)}, {violation.location.y.toFixed(1)})
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 