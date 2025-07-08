import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Upload,
  Grid3X3,
  Ruler,
  Palette,
  Info
} from "lucide-react";

interface LayerMapping {
  name: string;
  number: number;
  dataType: number;
  color: string;
  visible: boolean;
}

interface GDSIIElement {
  type: 'boundary' | 'path' | 'text' | 'box' | 'node';
  layer: number;
  dataType: number;
  coordinates: Point[];
  properties?: { [key: string]: any };
}

interface Point {
  x: number;
  y: number;
}

interface LayoutData {
  structures: {
    name: string;
    elements: GDSIIElement[];
  }[];
  metadata: {
    version: number;
    unit: number;
    precision: number;
    timestamp: Date;
  };
  statistics: {
    totalElements: number;
    totalArea: number;
    layerCount: number;
    fileSize: number;
  };
}

const LayoutViewer = () => {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [activeTab, setActiveTab] = useState("viewer");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedLayers, setSelectedLayers] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [activeStructure, setActiveStructure] = useState<string>('TOP');

  const defaultLayers: LayerMapping[] = [
    { name: 'Metal1', number: 1, dataType: 0, color: '#ff6b6b', visible: true },
    { name: 'Metal2', number: 2, dataType: 0, color: '#4ecdc4', visible: true },
    { name: 'Metal3', number: 3, dataType: 0, color: '#45b7d1', visible: true },
    { name: 'Poly', number: 4, dataType: 0, color: '#96ceb4', visible: true },
    { name: 'Diffusion', number: 5, dataType: 0, color: '#feca57', visible: true },
    { name: 'Via1', number: 6, dataType: 0, color: '#ff9ff3', visible: true },
    { name: 'Via2', number: 7, dataType: 0, color: '#54a0ff', visible: true },
    { name: 'Text', number: 8, dataType: 0, color: '#ffffff', visible: true }
  ];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleLayer = (layerNumber: number) => {
    setSelectedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerNumber)) {
        newSet.delete(layerNumber);
      } else {
        newSet.add(layerNumber);
      }
      return newSet;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate loading GDSII file
      const mockLayoutData: LayoutData = {
        structures: [
          {
            name: 'TOP',
            elements: [
              {
                type: 'boundary',
                layer: 1,
                dataType: 0,
                coordinates: [
                  { x: 0, y: 0 },
                  { x: 100, y: 0 },
                  { x: 100, y: 100 },
                  { x: 0, y: 100 }
                ]
              },
              {
                type: 'path',
                layer: 2,
                dataType: 0,
                coordinates: [
                  { x: 10, y: 10 },
                  { x: 90, y: 10 },
                  { x: 90, y: 90 },
                  { x: 10, y: 90 }
                ]
              },
              {
                type: 'text',
                layer: 8,
                dataType: 0,
                coordinates: [{ x: 50, y: 50 }],
                properties: { text: 'TOP' }
              }
            ]
          }
        ],
        metadata: {
          version: 3,
          unit: 1e-6,
          precision: 1e-9,
          timestamp: new Date()
        },
        statistics: {
          totalElements: 3,
          totalArea: 10000,
          layerCount: 8,
          fileSize: 1024
        }
      };

      setLayoutData(mockLayoutData);
    }
  };

  const handleDownloadGDSII = () => {
    if (layoutData) {
      // Simulate GDSII file download
      const blob = new Blob(['Mock GDSII data'], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'layout.gds';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getLayerColor = (layerNumber: number) => {
    const layer = defaultLayers.find(l => l.number === layerNumber);
    return layer?.color || '#ffffff';
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">Layout Viewer</h2>
          <Badge variant="secondary" className="bg-purple-800 text-purple-200">
            GDSII Viewer
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {layoutData && (
            <>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                {layoutData.statistics.totalElements} elements
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {layoutData.statistics.totalArea.toLocaleString()} μm²
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadGDSII}
              >
                <Download className="h-4 w-4 mr-2" />
                Export GDSII
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/4 p-4 border-r border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="viewer">Viewer</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-400" />
                    View Controls
                  </CardTitle>
                  <CardDescription>
                    Control layout visualization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Zoom Level</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.1}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center text-sm font-mono">
                        {Math.round(zoom * 100)}%
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomIn}
                        disabled={zoom >= 10}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                    <Slider
                      value={[zoom]}
                      onValueChange={([value]) => setZoom(value)}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>View Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showGrid"
                          checked={showGrid}
                          onChange={(e) => setShowGrid(e.target.checked)}
                          className="rounded border-slate-600 bg-slate-900"
                        />
                        <Label htmlFor="showGrid" className="text-sm">Show Grid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showRulers"
                          checked={showRulers}
                          onChange={(e) => setShowRulers(e.target.checked)}
                          className="rounded border-slate-600 bg-slate-900"
                        />
                        <Label htmlFor="showRulers" className="text-sm">Show Rulers</Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleResetView}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset View
                  </Button>

                  <div className="space-y-2">
                    <Label>File Operations</Label>
                    <Button variant="outline" className="w-full" asChild>
                      <label>
                        <Upload className="h-4 w-4 mr-2" />
                        Load GDSII
                        <input
                          type="file"
                          accept=".gds,.gdsii"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>

                  {layoutData && (
                    <div className="space-y-2">
                      <Label>Statistics</Label>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Elements</div>
                          <div className="font-mono">{layoutData.statistics.totalElements}</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Layers</div>
                          <div className="font-mono">{layoutData.statistics.layerCount}</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Area</div>
                          <div className="font-mono">{layoutData.statistics.totalArea.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">File Size</div>
                          <div className="font-mono">{layoutData.statistics.fileSize} KB</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layers" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-cyan-400" />
                    Layer Control
                  </CardTitle>
                  <CardDescription>
                    Toggle layer visibility and colors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {defaultLayers.map(layer => (
                    <div
                      key={layer.number}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-slate-700 cursor-pointer"
                      onClick={() => toggleLayer(layer.number)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLayers.has(layer.number)}
                        onChange={() => {}}
                        className="rounded border-slate-600 bg-slate-900"
                      />
                      <div
                        className="w-4 h-4 rounded border border-slate-600"
                        style={{ backgroundColor: layer.color }}
                      />
                      <Label className="flex-1 cursor-pointer text-sm">{layer.name}</Label>
                      <Badge variant="outline" className="text-xs">
                        {layer.number}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-3/4 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-cyan-400" />
                Layout Canvas
              </h3>
              {layoutData && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-slate-400">
                    Zoom: {Math.round(zoom * 100)}%
                  </Badge>
                  <Badge variant="outline" className="text-slate-400">
                    {selectedLayers.size} layers visible
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 relative overflow-hidden">
              {layoutData ? (
                <div className="h-full relative">
                  {/* Mock layout canvas */}
                  <div 
                    className="w-full h-full bg-slate-800 rounded border border-slate-600 relative"
                    style={{
                      transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                      transformOrigin: 'center'
                    }}
                  >
                    {showGrid && (
                      <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full">
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4a5568" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>
                    )}

                    {/* Render layout elements */}
                    {layoutData.structures
                      .find(s => s.name === activeStructure)
                      ?.elements.map((element, index) => {
                        if (!selectedLayers.has(element.layer)) return null;

                        const color = getLayerColor(element.layer);
                        
                        switch (element.type) {
                          case 'boundary':
                            return (
                              <polygon
                                key={index}
                                points={element.coordinates.map(p => `${p.x},${p.y}`).join(' ')}
                                fill={color}
                                fillOpacity="0.3"
                                stroke={color}
                                strokeWidth="1"
                                className="hover:fill-opacity-50 transition-all"
                              />
                            );
                          case 'path':
                            return (
                              <polyline
                                key={index}
                                points={element.coordinates.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke={color}
                                strokeWidth="2"
                                className="hover:stroke-width-3 transition-all"
                              />
                            );
                          case 'text':
                            return (
                              <text
                                key={index}
                                x={element.coordinates[0].x}
                                y={element.coordinates[0].y}
                                fill={color}
                                fontSize="12"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="font-mono"
                              >
                                {element.properties?.text || 'TEXT'}
                              </text>
                            );
                          default:
                            return null;
                        }
                      })}

                    {/* Rulers */}
                    {showRulers && (
                      <>
                        <div className="absolute top-0 left-0 w-full h-6 bg-slate-700 border-b border-slate-600 flex items-center justify-center text-xs">
                          <Ruler className="h-3 w-3 mr-1" />
                          Scale: 1μm = {Math.round(20 / zoom)}px
                        </div>
                        <div className="absolute top-0 left-0 w-6 h-full bg-slate-700 border-r border-slate-600 flex items-center justify-center text-xs rotate-90">
                          <Ruler className="h-3 w-3 mr-1" />
                          Scale: 1μm = {Math.round(20 / zoom)}px
                        </div>
                      </>
                    )}
                  </div>

                  {/* Overlay controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 10}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.1}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No layout data available</p>
                    <p className="text-sm">Load a GDSII file to view layout</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutViewer; 