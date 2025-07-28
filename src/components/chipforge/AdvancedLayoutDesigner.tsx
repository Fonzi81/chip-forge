import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Layers, 
  Eye, 
  Edit3, 
  Move, 
  Copy, 
  Trash2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Camera,
  Download,
  Settings,
  Play,
  Square,
  Box,
  Factory,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Minus,
  Grid,
  Palette,
  EyeOff,
  Lock,
  Unlock
} from "lucide-react";
import { advancedLayoutEngine } from '../../backend/layout/advancedLayoutEngine';
import { threeDVisualizationEngine } from '../../backend/visualization/threeDVisualizationEngine';
import { tapeoutEngine } from '../../backend/manufacturing/tapeoutEngine';

interface LayoutTool {
  name: string;
  icon: React.ReactNode;
  active: boolean;
  description: string;
}

interface LayerInfo {
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  opacity: number;
  shapeCount: number;
}

export default function AdvancedLayoutDesigner() {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isTapeoutMode, setIsTapeoutMode] = useState(false);
  const [layoutData, setLayoutData] = useState<any>(null);
  const [visualizationData, setVisualizationData] = useState<any>(null);
  const [tapeoutData, setTapeoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tools: LayoutTool[] = [
    { name: 'select', icon: <Eye className="h-4 w-4" />, active: activeTool === 'select', description: 'Select shapes' },
    { name: 'draw', icon: <Edit3 className="h-4 w-4" />, active: activeTool === 'draw', description: 'Draw shapes' },
    { name: 'move', icon: <Move className="h-4 w-4" />, active: activeTool === 'move', description: 'Move shapes' },
    { name: 'copy', icon: <Copy className="h-4 w-4" />, active: activeTool === 'copy', description: 'Copy shapes' },
    { name: 'delete', icon: <Trash2 className="h-4 w-4" />, active: activeTool === 'delete', description: 'Delete shapes' }
  ];

  useEffect(() => {
    initializeLayout();
  }, []);

  const initializeLayout = async () => {
    setIsLoading(true);
    try {
      const result = await advancedLayoutEngine.createLayout({
        designName: 'Advanced Design',
        technology: 'tsmc28',
        dieSize: { width: 1000, height: 1000 },
        layers: [],
        constraints: {
          minWidth: { M1: 0.065, M2: 0.065, M3: 0.065 },
          minSpacing: { M1: 0.065, M2: 0.065, M3: 0.065 },
          minArea: { M1: 0.042, M2: 0.042, M3: 0.042 },
          maxDensity: { M1: 0.85, M2: 0.85, M3: 0.85 }
        }
      });

      setLayoutData(result);
      setLayers(initializeLayers(result));
    } catch (error) {
      console.error('Failed to initialize layout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeLayers = (layoutData: any): LayerInfo[] => {
    const layerNames = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471', '#F1948A', '#C39BD3', '#A9CCE3'];
    
    return layerNames.map((name, index) => ({
      name,
      visible: true,
      locked: false,
      color: colors[index],
      opacity: 1.0,
      shapeCount: layoutData.shapes.filter((s: any) => s.layer === name).length
    }));
  };

  const handleToolSelect = (toolName: string) => {
    setActiveTool(toolName);
  };

  const toggleLayerVisibility = (layerName: string) => {
    setLayers(prev => prev.map(layer => 
      layer.name === layerName ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (layerName: string) => {
    setLayers(prev => prev.map(layer => 
      layer.name === layerName ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const setLayerOpacity = (layerName: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.name === layerName ? { ...layer, opacity } : layer
    ));
  };

  const setLayerColor = (layerName: string, color: string) => {
    setLayers(prev => prev.map(layer => 
      layer.name === layerName ? { ...layer, color } : layer
    ));
  };

  const handle3DMode = async () => {
    if (!is3DMode) {
      setIsLoading(true);
      try {
        const result = await threeDVisualizationEngine.initializeVisualization({
          layoutData,
          viewport: { width: 800, height: 600 },
          camera: { position: { x: 0, y: 0, z: 100 }, target: { x: 0, y: 0, z: 0 }, fov: 60 },
          rendering: { quality: 'high', shadows: true, antiAliasing: true, wireframe: false }
        });
        setVisualizationData(result);
        setIs3DMode(true);
      } catch (error) {
        console.error('Failed to initialize 3D visualization:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIs3DMode(false);
      setVisualizationData(null);
    }
  };

  const handleTapeoutMode = async () => {
    if (!isTapeoutMode) {
      setIsLoading(true);
      try {
        const result = await tapeoutEngine.prepareTapeout({
          designName: 'Advanced Design',
          technology: 'tsmc28',
          foundry: 'tsmc',
          process: 'logic',
          layoutData,
          constraints: {
            maxDensity: 0.85,
            minFeatureSize: 0.065,
            maxAspectRatio: 10,
            minSpacing: 0.065
          },
          options: {
            generateMasks: true,
            generateTestStructures: true,
            generateDummyFill: true,
            performLVS: true,
            performDRC: true
          }
        });
        setTapeoutData(result);
        setIsTapeoutMode(true);
      } catch (error) {
        console.error('Failed to prepare tapeout:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsTapeoutMode(false);
      setTapeoutData(null);
    }
  };

  const handleUndo = () => {
    // Implement undo functionality
    console.log('Undo action');
  };

  const handleRedo = () => {
    // Implement redo functionality
    console.log('Redo action');
  };

  const handleZoomIn = () => {
    // Implement zoom in
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Implement zoom out
    console.log('Zoom out');
  };

  const handleZoomFit = () => {
    // Implement zoom to fit
    console.log('Zoom to fit');
  };

  const handleScreenshot = () => {
    // Implement screenshot functionality
    console.log('Take screenshot');
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export design');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-900">Advanced Layout Designer</h1>
            <Badge variant={is3DMode ? "default" : "secondary"}>
              {is3DMode ? "3D Mode" : "2D Mode"}
            </Badge>
            {isTapeoutMode && (
              <Badge variant="destructive">Tapeout Mode</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handle3DMode}
              disabled={isLoading}
            >
                             <Box className="h-4 w-4 mr-2" />
              {is3DMode ? "Exit 3D" : "3D View"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTapeoutMode}
              disabled={isLoading}
            >
              <Factory className="h-4 w-4 mr-2" />
              {isTapeoutMode ? "Exit Tapeout" : "Tapeout"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Tools */}
        <div className="w-64 bg-white border-r border-slate-200 p-4">
          <div className="space-y-6">
            {/* Tools */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Tools</h3>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => handleToolSelect(tool.name)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                      tool.active
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title={tool.description}
                  >
                    {tool.icon}
                    <span className="text-sm font-medium capitalize">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">History</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleUndo}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRedo}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* View Controls */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">View</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomFit}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={handleScreenshot} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Screenshot
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-slate-200 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Active Tool:</span>
                <Badge variant="outline" className="capitalize">
                  {activeTool}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Selected:</span>
                <Badge variant="outline">
                  {selectedShapes.length} shapes
                </Badge>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative bg-slate-100">
            <canvas
              ref={canvasRef}
              className="w-full h-full border border-slate-300"
              style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-600">Loading...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Layers & Properties */}
        <div className="w-80 bg-white border-l border-slate-200 p-4">
          <Tabs defaultValue="layers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="mt-4">
              <div className="space-y-3">
                {layers.map((layer) => (
                  <div key={layer.name} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleLayerVisibility(layer.name)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                                                     {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => toggleLayerLock(layer.name)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          {layer.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <span className="text-sm font-medium">{layer.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {layer.shapeCount}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-600">Color:</span>
                        <input
                          type="color"
                          value={layer.color}
                          onChange={(e) => setLayerColor(layer.name, e.target.value)}
                          className="w-6 h-6 rounded border border-slate-300"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-600">Opacity:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={layer.opacity}
                          onChange={(e) => setLayerOpacity(layer.name, parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-600 w-8">
                          {Math.round(layer.opacity * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="properties" className="mt-4">
              <div className="space-y-4">
                {selectedShapes.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Selected Shapes</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        Count: {selectedShapes.length}
                      </p>
                      <p className="text-sm text-slate-600">
                        Layer: {layoutData?.shapes?.find((s: any) => s.id === selectedShapes[0])?.layer || 'Unknown'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Grid className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No shapes selected</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-slate-200 p-2">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-4">
            <span>Ready</span>
            <span>•</span>
            <span>Zoom: 100%</span>
            <span>•</span>
            <span>Position: (0, 0)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Total Shapes: {layoutData?.shapes?.length || 0}</span>
            <span>•</span>
            <span>Layers: {layers.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 