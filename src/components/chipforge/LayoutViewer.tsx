import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopNav from "./TopNav";
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Layers, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2,
  Grid3X3,
  Cpu,
  Info,
  Settings,
  Download
} from "lucide-react";

type Cell = { 
  name: string; 
  type: string; 
  x: number; 
  y: number;
  pins?: { name: string; x: number; y: number; direction: 'input' | 'output' }[];
  width?: number;
  height?: number;
  selected?: boolean;
};

type Wire = { 
  from: string; 
  to: string;
  layer?: 'metal1' | 'metal2' | 'metal3';
  net?: string;
  selected?: boolean;
};

type LayoutData = {
  cells: Cell[];
  wires: Wire[];
  layers: {
    metal1: boolean;
    metal2: boolean;
    metal3: boolean;
    poly: boolean;
    diffusion: boolean;
  };
};

const layoutData: LayoutData = {
  cells: [
    { 
      name: 'U1', 
      type: 'AND2_X1', 
      x: 2, 
      y: 2,
      width: 80,
      height: 60,
      pins: [
        { name: 'A', x: 0, y: 15, direction: 'input' },
        { name: 'B', x: 0, y: 45, direction: 'input' },
        { name: 'Z', x: 80, y: 30, direction: 'output' }
      ]
    },
    { 
      name: 'U2', 
      type: 'INV_X1', 
      x: 5, 
      y: 2,
      width: 60,
      height: 40,
      pins: [
        { name: 'A', x: 0, y: 20, direction: 'input' },
        { name: 'Z', x: 60, y: 20, direction: 'output' }
      ]
    },
    { 
      name: 'U3', 
      type: 'NAND2_X1', 
      x: 8, 
      y: 4,
      width: 80,
      height: 60,
      pins: [
        { name: 'A', x: 0, y: 15, direction: 'input' },
        { name: 'B', x: 0, y: 45, direction: 'input' },
        { name: 'Z', x: 80, y: 30, direction: 'output' }
      ]
    }
  ],
  wires: [
    { from: 'U1.Z', to: 'U2.A', layer: 'metal1', net: 'net1' },
    { from: 'U2.Z', to: 'U3.A', layer: 'metal2', net: 'net2' },
    { from: 'U1.A', to: 'U3.B', layer: 'metal1', net: 'net3' }
  ],
  layers: {
    metal1: true,
    metal2: true,
    metal3: true,
    poly: true,
    diffusion: true
  }
};

const CELL_WIDTH = 80;
const CELL_HEIGHT = 60;
const GRID_SIZE = 20;
const LAYER_COLORS = {
  metal1: '#ef4444',
  metal2: '#3b82f6',
  metal3: '#10b981',
  poly: '#f59e0b',
  diffusion: '#8b5cf6'
};

type LayoutViewerProps = {
  layoutString?: string;
};

export default function LayoutViewer({ layoutString }: LayoutViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState(layoutData.layers);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [showMinimap, setShowMinimap] = useState(true);
  const [activeTab, setActiveTab] = useState('viewer');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parse layoutString if provided, otherwise use default
  let parsedLayout: LayoutData = layoutData;
  if (layoutString) {
    try {
      parsedLayout = JSON.parse(layoutString);
    } catch (e) {
      // fallback to default if parsing fails
      parsedLayout = layoutData;
    }
  }

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const drawLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear and set background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan transforms
    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);

    // Draw grid
    if (layers.poly) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = -2000; x < 2000; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, -2000);
        ctx.lineTo(x, 2000);
        ctx.stroke();
      }
      for (let y = -2000; y < 2000; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(-2000, y);
        ctx.lineTo(2000, y);
        ctx.stroke();
      }
    }

    // Draw cells
    parsedLayout.cells.forEach(cell => {
      const px = cell.x * CELL_WIDTH;
      const py = cell.y * CELL_HEIGHT;
      const cellWidth = cell.width || CELL_WIDTH;
      const cellHeight = cell.height || CELL_HEIGHT;

      // Cell background
      if (cell.selected) {
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
      } else if (cell === hoveredCell) {
        ctx.fillStyle = '#1e40af';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
      }

      ctx.fillRect(px, py, cellWidth, cellHeight);
      ctx.strokeRect(px, py, cellWidth, cellHeight);

      // Cell text
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(cell.name, px + 8, py + 20);
      ctx.fillText(cell.type, px + 8, py + 38);

      // Draw pins
      if (cell.pins) {
        cell.pins.forEach(pin => {
          const pinX = px + pin.x;
          const pinY = py + pin.y;
          
          ctx.fillStyle = pin.direction === 'input' ? '#10b981' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(pinX, pinY, 3, 0, 2 * Math.PI);
          ctx.fill();
          
          // Pin label
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillText(pin.name, pinX + 5, pinY - 5);
        });
      }
    });

    // Draw wires
    parsedLayout.wires.forEach(wire => {
      const [fromCellName, fromPin] = wire.from.split('.');
      const [toCellName, toPin] = wire.to.split('.');

      const fromCell = parsedLayout.cells.find(c => c.name === fromCellName);
      const toCell = parsedLayout.cells.find(c => c.name === toCellName);
      if (!fromCell || !toCell) return;

      const fromPinData = fromCell.pins?.find(p => p.name === fromPin);
      const toPinData = toCell.pins?.find(p => p.name === toPin);

      if (!fromPinData || !toPinData) return;

      const fx = fromCell.x * CELL_WIDTH + fromPinData.x;
      const fy = fromCell.y * CELL_HEIGHT + fromPinData.y;
      const tx = toCell.x * CELL_WIDTH + toPinData.x;
      const ty = toCell.y * CELL_HEIGHT + toPinData.y;

      // Wire color based on layer
      const wireColor = wire.layer ? LAYER_COLORS[wire.layer] : '#f59e0b';
      ctx.strokeStyle = wire.selected ? '#60a5fa' : wireColor;
      ctx.lineWidth = wire.selected ? 4 : 3;

      // Orthogonal wire routing
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      
      // Horizontal then vertical routing
      const midX = (fx + tx) / 2;
      ctx.lineTo(midX, fy);
      ctx.lineTo(midX, ty);
      ctx.lineTo(tx, ty);
      
      ctx.stroke();

      // Wire label
      if (wire.net) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(wire.net, midX + 5, (fy + ty) / 2 - 5);
      }
    });

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [zoom, pan, layers, selectedCell, hoveredCell, dimensions]);

  const drawMinimap = useCallback(() => {
    const canvas = minimapRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 200;
    canvas.height = 150;

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale factor for minimap
    const scaleX = canvas.width / 1200;
    const scaleY = canvas.height / 800;

    // Draw cells in minimap
    ctx.fillStyle = '#475569';
    parsedLayout.cells.forEach(cell => {
      const px = cell.x * CELL_WIDTH * scaleX;
      const py = cell.y * CELL_HEIGHT * scaleY;
      const cellWidth = (cell.width || CELL_WIDTH) * scaleX;
      const cellHeight = (cell.height || CELL_HEIGHT) * scaleY;

      ctx.fillRect(px, py, cellWidth, cellHeight);
    });

    // Draw viewport rectangle
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    const viewportX = (-pan.x / zoom) * scaleX;
    const viewportY = (-pan.y / zoom) * scaleY;
    const viewportWidth = (1200 / zoom) * scaleX;
    const viewportHeight = (800 / zoom) * scaleY;
    ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight);
  }, [pan, zoom]);

  useEffect(() => {
    drawLayout();
    drawMinimap();
  }, [drawLayout, drawMinimap]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked on a cell
    const clickedCell = parsedLayout.cells.find(cell => {
      const px = cell.x * CELL_WIDTH;
      const py = cell.y * CELL_HEIGHT;
      const cellWidth = cell.width || CELL_WIDTH;
      const cellHeight = cell.height || CELL_HEIGHT;
      
      return x >= px && x <= px + cellWidth && y >= py && y <= py + cellHeight;
    });

    setSelectedCell(clickedCell || null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    setMousePos({ x, y });

    // Check if hovering over a cell
    const hovered = parsedLayout.cells.find(cell => {
      const px = cell.x * CELL_WIDTH;
      const py = cell.y * CELL_HEIGHT;
      const cellWidth = cell.width || CELL_WIDTH;
      const cellHeight = cell.height || CELL_HEIGHT;
      
      return x >= px && x <= px + cellWidth && y >= py && y <= py + cellHeight;
    });

    setHoveredCell(hovered || null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(z => Math.max(0.5, Math.min(3, z + (e.deltaY < 0 ? 0.1 : -0.1))));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) { // Left click
      const startX = e.clientX;
      const startY = e.clientY;
      const startPan = { ...pan };
      
      const onMove = (ev: MouseEvent) => {
        setPan({
          x: startPan.x + ev.clientX - startX,
          y: startPan.y + ev.clientY - startY
        });
      };
      
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Layout Viewer
            </h1>
            <p className="text-slate-400 mt-2">
              Interactive 2D chip layout visualization with multi-layer support
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              <Cpu className="h-3 w-3 mr-1" />
              Interactive
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="viewer" className="data-[state=active]:bg-slate-700">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Layout Viewer
            </TabsTrigger>
            <TabsTrigger value="layers" className="data-[state=active]:bg-slate-700">
              <Layers className="h-4 w-4 mr-2" />
              Layer Control
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-slate-700">
              <Info className="h-4 w-4 mr-2" />
              Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="viewer" className="space-y-4">
            {/* Toolbar */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                      title="Zoom In"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                      title="Reset View"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-slate-600 mx-2"></div>
                    <span className="text-sm text-slate-400">
                      Zoom: {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMinimap(!showMinimap)}
                    >
                      {showMinimap ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      {showMinimap ? 'Hide' : 'Show'} Minimap
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Layout Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Canvas */}
              <div className="lg:col-span-3">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="relative">
                      <div className="layout-viewer-container" ref={containerRef}>
                        <canvas
                          ref={canvasRef}
                          className="layout-viewer-canvas border border-slate-600 rounded bg-slate-900 cursor-crosshair"
                          width={dimensions.width}
                          height={dimensions.height}
                          style={{ cursor: selectedCell ? "pointer" : "grab" }}
                          onWheel={handleWheel}
                          onMouseDown={handleMouseDown}
                          onClick={handleCanvasClick}
                          onMouseMove={handleCanvasMouseMove}
                        />
                        
                        {/* Tooltip */}
                        {hoveredCell && (
                          <div 
                            className="absolute bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg z-10"
                            style={{
                              left: mousePos.x + 10,
                              top: mousePos.y - 10,
                              pointerEvents: 'none'
                            }}
                          >
                            <div className="text-sm font-medium text-slate-200">{hoveredCell.name}</div>
                            <div className="text-xs text-slate-400">{hoveredCell.type}</div>
                            <div className="text-xs text-slate-400">
                              Position: ({hoveredCell.x}, {hoveredCell.y})
                            </div>
                            {hoveredCell.pins && (
                              <div className="text-xs text-slate-400">
                                Pins: {hoveredCell.pins.length}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Minimap */}
                {showMinimap && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Minimap</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <canvas
                        ref={minimapRef}
                        className="border border-slate-600 rounded bg-slate-900 w-full"
                        style={{ height: '150px' }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Selected Cell Info */}
                {selectedCell && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Selected Cell</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-slate-400">Name:</span>
                          <div className="text-sm font-medium text-slate-200">{selectedCell.name}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400">Type:</span>
                          <div className="text-sm font-medium text-slate-200">{selectedCell.type}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400">Position:</span>
                          <div className="text-sm font-medium text-slate-200">
                            ({selectedCell.x}, {selectedCell.y})
                          </div>
                        </div>
                        {selectedCell.pins && (
                          <div>
                            <span className="text-xs text-slate-400">Pins:</span>
                            <div className="space-y-1 mt-1">
                              {selectedCell.pins.map((pin, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    pin.direction === 'input' ? 'bg-green-400' : 'bg-yellow-400'
                                  }`} />
                                  <span className="text-xs text-slate-300">{pin.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Layer Legend */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Layer Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {Object.entries(LAYER_COLORS).map(([layer, color]) => (
                        <div key={layer} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-slate-300 capitalize">{layer}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-cyan-400" />
                  Layer Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(layers).map(([layer, visible]) => (
                    <div key={layer} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: LAYER_COLORS[layer as keyof typeof LAYER_COLORS] }}
                        />
                        <span className="text-sm font-medium capitalize">{layer}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLayers(l => ({ ...l, [layer]: !l[layer as keyof typeof l] }))}
                      >
                        {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-cyan-400" />
                  Layout Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-200 mb-3">Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Total Cells:</span>
                        <span className="text-sm font-medium">{parsedLayout.cells.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Total Wires:</span>
                        <span className="text-sm font-medium">{parsedLayout.wires.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Active Layers:</span>
                        <span className="text-sm font-medium">
                          {Object.values(layers).filter(Boolean).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200 mb-3">Controls</h4>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div>• Mouse wheel: Zoom in/out</div>
                      <div>• Left click + drag: Pan view</div>
                      <div>• Click cell: Select for details</div>
                      <div>• Hover cell: Show tooltip</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
} 