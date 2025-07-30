import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Layers, 
  Play, 
  Pause, 
  RotateCw, 
  BarChart3, 
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Eye,
  Code,
  FileText,
  Download,
  Upload,
  Settings,
  Maximize,
  Minimize,
  Grid,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Save,
  MessageSquare,
  Lightbulb,
  Sparkles,
  GitBranch,
  History,
  RefreshCw,
  StopCircle,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  Filter,
  Search,
  Info,
  HelpCircle,
  Cpu,
  Thermometer,
  Gauge,
  Shield,
  Package,
  Globe,
  MousePointer,
  Move,
  RotateCw as RotateCwIcon,
  ZoomIn,
  ZoomOut,
  BookOpen,
  Cross,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Star,
  Heart,
  Diamond,
  Minus,
  X,
  Check,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  ShieldAlert
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";

// Layout data structures
interface LayoutLayer {
  name: string;
  type: 'metal' | 'poly' | 'diffusion' | 'well' | 'via' | 'contact';
  level: number;
  color: string;
  visible: boolean;
  opacity: number;
  shapes: LayoutShape[];
}

interface LayoutShape {
  id: string;
  type: 'rectangle' | 'polygon' | 'circle' | 'path';
  coordinates: number[][];
  properties: {
    width?: number;
    height?: number;
    area?: number;
    perimeter?: number;
    net?: string;
    component?: string;
  };
}

interface DRCRule {
  id: string;
  name: string;
  description: string;
  type: 'spacing' | 'width' | 'enclosure' | 'overlap' | 'density';
  layer1: string;
  layer2?: string;
  value: number;
  unit: string;
  severity: 'error' | 'warning' | 'info';
}

interface DRCViolation {
  id: string;
  rule: DRCRule;
  location: { x: number; y: number };
  description: string;
  severity: 'error' | 'warning' | 'info';
  fix: string;
}

interface LVSResult {
  netlistMatch: boolean;
  connectivityErrors: ConnectivityError[];
  propertyMismatches: PropertyMismatch[];
  summary: {
    totalNets: number;
    matchedNets: number;
    totalDevices: number;
    matchedDevices: number;
  };
}

interface ConnectivityError {
  id: string;
  type: 'missing_connection' | 'extra_connection' | 'wrong_connection';
  description: string;
  location: { x: number; y: number };
  severity: 'error' | 'warning';
}

interface PropertyMismatch {
  id: string;
  property: string;
  expected: any;
  actual: any;
  location: { x: number; y: number };
  severity: 'error' | 'warning';
}

interface GDSIIData {
  header: {
    version: number;
    modificationTime: string;
    accessTime: string;
  };
  units: {
    user: number;
    database: number;
  };
  structures: GDSIIStructure[];
}

interface GDSIIStructure {
  name: string;
  elements: GDSIIElement[];
  references: GDSIIReference[];
}

interface GDSIIElement {
  type: 'boundary' | 'path' | 'text' | 'box' | 'node';
  layer: number;
  dataType: number;
  coordinates: number[][];
  properties: Record<string, any>;
}

interface GDSIIReference {
  name: string;
  position: { x: number; y: number };
  rotation: number;
  magnification: number;
  reflection: boolean;
}

export default function LayoutEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState<LayoutLayer[]>([
    {
      name: 'Metal1',
      type: 'metal',
      level: 1,
      color: '#3b82f6',
      visible: true,
      opacity: 1.0,
      shapes: []
    },
    {
      name: 'Metal2',
      type: 'metal',
      level: 2,
      color: '#10b981',
      visible: true,
      opacity: 1.0,
      shapes: []
    },
    {
      name: 'Poly',
      type: 'poly',
      level: 3,
      color: '#f59e0b',
      visible: true,
      opacity: 1.0,
      shapes: []
    },
    {
      name: 'Diffusion',
      type: 'diffusion',
      level: 4,
      color: '#ef4444',
      visible: true,
      opacity: 1.0,
      shapes: []
    },
    {
      name: 'Well',
      type: 'well',
      level: 5,
      color: '#8b5cf6',
      visible: true,
      opacity: 1.0,
      shapes: []
    }
  ]);

  const [drcRules, setDrcRules] = useState<DRCRule[]>([
    {
      id: 'rule_1',
      name: 'Metal1 Minimum Width',
      description: 'Minimum width for Metal1 layer',
      type: 'width',
      layer1: 'Metal1',
      value: 0.1,
      unit: 'μm',
      severity: 'error'
    },
    {
      id: 'rule_2',
      name: 'Metal1-Metal1 Spacing',
      description: 'Minimum spacing between Metal1 shapes',
      type: 'spacing',
      layer1: 'Metal1',
      layer2: 'Metal1',
      value: 0.1,
      unit: 'μm',
      severity: 'error'
    },
    {
      id: 'rule_3',
      name: 'Metal1-Poly Enclosure',
      description: 'Minimum enclosure of Poly by Metal1',
      type: 'enclosure',
      layer1: 'Metal1',
      layer2: 'Poly',
      value: 0.05,
      unit: 'μm',
      severity: 'warning'
    }
  ]);

  const [drcViolations, setDrcViolations] = useState<DRCViolation[]>([]);
  const [lvsResults, setLvsResults] = useState<LVSResult | null>(null);
  const [gdsiiData, setGdsiiData] = useState<GDSIIData | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayoutLayer | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'draw' | 'measure' | 'inspect'>('select');
  const [zoom, setZoom] = useState(1);
  const [isRunningDRC, setIsRunningDRC] = useState(false);
  const [isRunningLVS, setIsRunningLVS] = useState(false);

  // Run DRC
  const runDRC = async () => {
    setIsRunningDRC(true);
    
    // Simulate DRC execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const violations: DRCViolation[] = [
      {
        id: 'violation_1',
        rule: drcRules[0],
        location: { x: 150, y: 200 },
        description: 'Metal1 width below minimum (0.08μm < 0.1μm)',
        severity: 'error',
        fix: 'Increase Metal1 width to at least 0.1μm'
      },
      {
        id: 'violation_2',
        rule: drcRules[1],
        location: { x: 300, y: 150 },
        description: 'Metal1 spacing violation (0.08μm < 0.1μm)',
        severity: 'error',
        fix: 'Increase spacing between Metal1 shapes to at least 0.1μm'
      },
      {
        id: 'violation_3',
        rule: drcRules[2],
        location: { x: 250, y: 300 },
        description: 'Insufficient Metal1 enclosure of Poly (0.03μm < 0.05μm)',
        severity: 'warning',
        fix: 'Increase Metal1 enclosure of Poly to at least 0.05μm'
      }
    ];
    
    setDrcViolations(violations);
    setIsRunningDRC(false);
  };

  // Run LVS
  const runLVS = async () => {
    setIsRunningLVS(true);
    
    // Simulate LVS execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: LVSResult = {
      netlistMatch: false,
      connectivityErrors: [
        {
          id: 'conn_1',
          type: 'missing_connection',
          description: 'Missing connection between net1 and net2',
          location: { x: 200, y: 250 },
          severity: 'error'
        },
        {
          id: 'conn_2',
          type: 'extra_connection',
          description: 'Extra connection found on net3',
          location: { x: 350, y: 180 },
          severity: 'warning'
        }
      ],
      propertyMismatches: [
        {
          id: 'prop_1',
          property: 'width',
          expected: 0.1,
          actual: 0.08,
          location: { x: 150, y: 200 },
          severity: 'error'
        }
      ],
      summary: {
        totalNets: 45,
        matchedNets: 42,
        totalDevices: 128,
        matchedDevices: 125
      }
    };
    
    setLvsResults(results);
    setIsRunningLVS(false);
  };

  // Generate GDSII
  const generateGDSII = async () => {
    const gdsii: GDSIIData = {
      header: {
        version: 5,
        modificationTime: new Date().toISOString(),
        accessTime: new Date().toISOString()
      },
      units: {
        user: 1e-6, // 1μm
        database: 1e-9  // 1nm
      },
      structures: [
        {
          name: 'TOP',
          elements: [
            {
              type: 'boundary',
              layer: 1,
              dataType: 0,
              coordinates: [[0, 0], [100, 0], [100, 100], [0, 100]],
              properties: { net: 'VDD' }
            }
          ],
          references: []
        }
      ]
    };
    
    setGdsiiData(gdsii);
  };

  // Export GDSII
  const exportGDSII = () => {
    if (!gdsiiData) return;
    
    const blob = new Blob([JSON.stringify(gdsiiData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chipforge-layout.gds';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="flex h-screen">
          {/* Left Sidebar - Layers */}
          <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Layout Layers
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                TSMC 7nm Technology
              </p>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {layers.map((layer) => (
                  <Card 
                    key={layer.name}
                    className={`bg-slate-700 border-slate-600 cursor-pointer transition-colors ${
                      selectedLayer?.name === layer.name ? 'ring-2 ring-cyan-400' : ''
                    }`}
                    onClick={() => setSelectedLayer(layer)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded border border-slate-500"
                          style={{ backgroundColor: layer.color }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{layer.name}</div>
                          <div className="text-xs text-slate-400">
                            {layer.type} • Level {layer.level}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={(e) => {
                              setLayers(layers.map(l => 
                                l.name === layer.name ? { ...l, visible: e.target.checked } : l
                              ));
                            }}
                            className="w-4 h-4"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={layer.opacity}
                            onChange={(e) => {
                              setLayers(layers.map(l => 
                                l.name === layer.name ? { ...l, opacity: parseFloat(e.target.value) } : l
                              ));
                            }}
                            className="w-16"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Layout Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="bg-slate-800 border-b border-slate-700 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeTool === 'select' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTool('select')}
                  >
                    <MousePointer className="h-4 w-4 mr-1" />
                    Select
                  </Button>
                  <Button
                    variant={activeTool === 'draw' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTool('draw')}
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Draw
                  </Button>
                  <Button
                    variant={activeTool === 'measure' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTool('measure')}
                  >
                    <Gauge className="h-4 w-4 mr-1" />
                    Measure
                  </Button>
                  <Button
                    variant={activeTool === 'inspect' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTool('inspect')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Inspect
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runDRC}
                    disabled={isRunningDRC}
                  >
                    {isRunningDRC ? (
                      <>
                        <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                        Running DRC...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Run DRC
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runLVS}
                    disabled={isRunningLVS}
                  >
                    {isRunningLVS ? (
                      <>
                        <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                        Running LVS...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Run LVS
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-400 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Layout Canvas */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ transform: `scale(${zoom})` }}
              />
              
              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }} />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Analysis & Export */}
          <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
            <Tabs defaultValue="drc" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="drc">DRC</TabsTrigger>
                <TabsTrigger value="lvs">LVS</TabsTrigger>
                <TabsTrigger value="gdsii">GDSII</TabsTrigger>
              </TabsList>
              
              <TabsContent value="drc" className="flex-1 p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Design Rule Check</h3>
                      <Badge variant={drcViolations.length === 0 ? 'default' : 'destructive'}>
                        {drcViolations.length} violations
                      </Badge>
                    </div>
                    
                    {drcViolations.length > 0 ? (
                      <div className="space-y-2">
                        {drcViolations.map((violation) => (
                          <Card key={violation.id} className="bg-slate-700 border-slate-600">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                  violation.severity === 'error' ? 'text-red-400' : 'text-yellow-400'
                                }`} />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{violation.rule.name}</div>
                                  <div className="text-xs text-slate-400 mb-2">{violation.description}</div>
                                  <div className="text-xs text-cyan-400">Fix: {violation.fix}</div>
                                </div>
                                <Badge variant={violation.severity === 'error' ? 'destructive' : 'secondary'}>
                                  {violation.severity}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No DRC violations found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="lvs" className="flex-1 p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Layout vs Schematic</h3>
                    
                    {lvsResults ? (
                      <div className="space-y-4">
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-medium">Netlist Match</div>
                              <Badge variant={lvsResults.netlistMatch ? 'default' : 'destructive'}>
                                {lvsResults.netlistMatch ? 'PASS' : 'FAIL'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-slate-400">Total Nets</div>
                                <div className="font-medium">{lvsResults.summary.totalNets}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Matched Nets</div>
                                <div className="font-medium">{lvsResults.summary.matchedNets}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Total Devices</div>
                                <div className="font-medium">{lvsResults.summary.totalDevices}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Matched Devices</div>
                                <div className="font-medium">{lvsResults.summary.matchedDevices}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {lvsResults.connectivityErrors.length > 0 && (
                          <Card className="bg-slate-700 border-slate-600">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Connectivity Errors</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {lvsResults.connectivityErrors.map((error) => (
                                  <div key={error.id} className="flex items-start gap-2 p-2 bg-slate-600 rounded">
                                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium">{error.type.replace('_', ' ')}</div>
                                      <div className="text-xs text-slate-400">{error.description}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Run LVS to check layout vs schematic</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="gdsii" className="flex-1 p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">GDSII Export</h3>
                      <Button size="sm" onClick={generateGDSII}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                    
                    {gdsiiData ? (
                      <div className="space-y-4">
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs text-slate-400">Version</div>
                                <div className="text-sm font-medium">{gdsiiData.header.version}</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-400">User Units</div>
                                <div className="text-sm font-medium">{gdsiiData.units.user} m</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-400">Database Units</div>
                                <div className="text-sm font-medium">{gdsiiData.units.database} m</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-400">Structures</div>
                                <div className="text-sm font-medium">{gdsiiData.structures.length}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Button onClick={exportGDSII} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export GDSII
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Generate GDSII for fabrication</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
} 