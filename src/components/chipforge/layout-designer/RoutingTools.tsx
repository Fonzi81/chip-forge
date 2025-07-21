import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Settings, 
  Play,
  Pause,
  RefreshCw,
  Layers,
  Grid3X3,
  MousePointer,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { useLayoutEditorStore, type CellPin } from '../../../state/useLayoutEditorStore';
import type { Cell } from './CellLibrary';
import {
  autoRoute,
  type Net,
  type RoutingConfig,
  type Path,
  type RouteResult
} from '../../../backend/layout/routing';

export interface Route {
  id: string;
  startPin: string;
  endPin: string;
  path: Array<{ x: number; y: number; layer: string }>;
  width: number;
  layer: string;
  status: 'pending' | 'routed' | 'failed' | 'drc_violation';
  drcViolations?: string[];
}

const DEFAULT_ROUTING_CONFIG: RoutingConfig = {
  gridSize: 0.1,
  layers: ['metal1', 'metal2', 'metal3'],
  viaCost: 10,
  bendCost: 5,
  maxBends: 3,
  drcAware: true,
  gridSnap: true,
  preferredDirection: 'any'
};

interface RoutingToolsProps {
  onRouteComplete?: (routes: Route[]) => void;
  onDRCViolation?: (violations: string[]) => void;
}

export default function RoutingTools({ onRouteComplete, onDRCViolation }: RoutingToolsProps) {
  const { cells, addRoute, updateRoute, deleteRoute } = useLayoutEditorStore();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [config, setConfig] = useState<RoutingConfig>(DEFAULT_ROUTING_CONFIG);
  const [isRouting, setIsRouting] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'route' | 'via' | 'delete'>('select');
  const [selectedLayer, setSelectedLayer] = useState('metal1');
  const [routingStats, setRoutingStats] = useState<RouteResult['statistics'] | null>(null);

  // Generate nets from cells
  const generateNets = (): Net[] => {
    const nets: Net[] = [];
    const allPins = cells.flatMap(cell => 
      (cell.pins || []).map((pin: CellPin) => ({ 
        ...pin, 
        cellId: cell.id,
        x: pin.position.x + cell.x,
        y: pin.position.y + cell.y
      }))
    );

    const inputPins = allPins.filter(pin => pin.direction === 'input');
    const outputPins = allPins.filter(pin => pin.direction === 'output');
    
    // Simple net generation: connect each output to nearest input
    for (const outputPin of outputPins) {
      let bestInput = null;
      let bestDistance = Infinity;

      for (const inputPin of inputPins) {
        const distance = Math.sqrt(
          Math.pow(outputPin.x - inputPin.x, 2) + Math.pow(outputPin.y - inputPin.y, 2)
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          bestInput = inputPin;
        }
      }

      if (bestInput) {
        nets.push({
          id: `net_${outputPin.id}_${bestInput.id}`,
          name: `${outputPin.name}_to_${bestInput.name}`,
          startPin: outputPin.id,
          endPin: bestInput.id,
          priority: 1,
          width: 0.1,
          preferredLayer: selectedLayer
        });
      }
    }

    return nets;
  };

  // Convert backend Path to Route
  const convertPathToRoute = (path: Path, net: Net): Route => {
    return {
      id: net.id,
      startPin: net.startPin,
      endPin: net.endPin,
      path: path.points.map(p => ({ x: p.x, y: p.y, layer: p.layer || 'metal1' })),
      width: path.width,
      layer: path.layer,
      status: 'routed',
      drcViolations: [] // Initialize empty array
    };
  };

  const runAutoRouting = useCallback(async () => {
    setIsRouting(true);
    
    try {
      const nets = generateNets();
      const result = await autoRoute(nets, cells, config);
      
      // Convert backend routes to UI routes
      const newRoutes = result.routes.map((path, index) => 
        convertPathToRoute(path, nets[index])
      );
      
      setRoutes(newRoutes);
      setRoutingStats(result.statistics);
      onRouteComplete?.(newRoutes);
      
      if (result.errors.length > 0) {
        onDRCViolation?.(result.errors);
      }
      
    } catch (error) {
      console.error('Auto-routing failed:', error);
      onDRCViolation?.([`Routing failed: ${error}`]);
    } finally {
      setIsRouting(false);
    }
  }, [cells, config, selectedLayer, onRouteComplete, onDRCViolation]);

  const clearRoutes = () => {
    setRoutes([]);
    setRoutingStats(null);
    onRouteComplete?.([]);
  };

  const exportRoutes = () => {
    const routeData = {
      timestamp: new Date().toISOString(),
      config,
      routes,
      statistics: routingStats,
      summary: {
        total: routes.length,
        routed: routes.filter(r => r.status === 'routed').length,
        failed: routes.filter(r => r.status === 'failed').length,
        violations: routes.filter(r => r.status === 'drc_violation').length
      }
    };
    
    const dataStr = JSON.stringify(routeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'routes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const routeCounts = {
    total: routes.length,
    routed: routes.filter(r => r.status === 'routed').length,
    failed: routes.filter(r => r.status === 'failed').length,
    violations: routes.filter(r => r.status === 'drc_violation').length
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">Advanced Routing</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={runAutoRouting}
            disabled={isRouting}
            className="h-6 px-2 text-xs"
          >
            {isRouting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRoutes}
            className="h-6 px-2 text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Status:</span>
          <span>{isRouting ? 'Routing...' : 'Ready'}</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {routeCounts.total} Total
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {routeCounts.routed} Routed
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {routeCounts.failed} Failed
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      {routingStats && (
        <div className="mb-4 bg-slate-700 rounded p-2">
          <h4 className="text-sm font-medium text-slate-200 mb-2">Routing Statistics</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>Total Length: {routingStats.totalLength.toFixed(2)}μm</div>
            <div>Vias: {routingStats.viaCount}</div>
            <div>Bends: {routingStats.bendCount}</div>
            <div>DRC Violations: {routingStats.drcViolations}</div>
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-200 mb-2">Configuration</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Grid Size:</span>
            <span>{config.gridSize}μm</span>
          </div>
          <div className="flex justify-between">
            <span>Layers:</span>
            <span>{config.layers.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>DRC Aware:</span>
            <span>{config.drcAware ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span>Via Cost:</span>
            <span>{config.viaCost}</span>
          </div>
          <div className="flex justify-between">
            <span>Bend Cost:</span>
            <span>{config.bendCost}</span>
          </div>
          <div className="flex justify-between">
            <span>Max Bends:</span>
            <span>{config.maxBends}</span>
          </div>
          <div className="flex justify-between">
            <span>Grid Snap:</span>
            <span>{config.gridSnap ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span>Direction:</span>
            <span>{config.preferredDirection}</span>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-200 mb-2">Routes</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {routes.length === 0 ? (
            <div className="text-center text-slate-500 py-4">
              <ArrowRight className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm">No routes yet</p>
            </div>
          ) : (
            routes.map(route => (
              <div
                key={route.id}
                className={`p-2 rounded text-xs border ${
                  route.status === 'routed' 
                    ? 'bg-green-900/20 border-green-500 text-green-200'
                    : route.status === 'failed'
                    ? 'bg-red-900/20 border-red-500 text-red-200'
                    : 'bg-yellow-900/20 border-yellow-500 text-yellow-200'
                }`}
              >
                <div className="font-medium">{route.startPin} → {route.endPin}</div>
                <div className="text-slate-400">Layer: {route.layer}</div>
                <div className="text-slate-500">Status: {route.status}</div>
                {route.drcViolations && route.drcViolations.length > 0 && (
                  <div className="text-red-300 text-xs mt-1">
                    DRC Violations: {route.drcViolations.join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <Button
          variant="outline"
          size="sm"
          onClick={exportRoutes}
          className="w-full text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          Export Routes
        </Button>
      </div>
    </div>
  );
} 