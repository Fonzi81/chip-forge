import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GitBranch, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Upload,
  Network,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Activity
} from "lucide-react";

interface SchematicNode {
  id: string;
  type: 'input' | 'output' | 'gate' | 'register' | 'wire';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: string[];
  outputs: string[];
  properties: { [key: string]: any };
}

interface SchematicConnection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
  signal: string;
  width: number;
}

interface SchematicData {
  nodes: SchematicNode[];
  connections: SchematicConnection[];
  metadata: {
    name: string;
    version: string;
    timestamp: Date;
  };
  statistics: {
    totalNodes: number;
    totalConnections: number;
    maxDepth: number;
    maxFanout: number;
  };
}

const SchematicViewer = () => {
  const [schematicData, setSchematicData] = useState<SchematicData | null>(null);
  const [activeTab, setActiveTab] = useState("viewer");
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSignals, setShowSignals] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.2));
  };

  const handleResetView = () => {
    setZoom(1);
    setSelectedNode(null);
    setHighlightedPath([]);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    // Find path to this node
    const path = findPathToNode(nodeId);
    setHighlightedPath(path);
  };

  const findPathToNode = (nodeId: string): string[] => {
    if (!schematicData) return [];
    
    // Simple path finding - find all nodes that lead to this node
    const path: string[] = [];
    const visited = new Set<string>();
    
    const dfs = (currentId: string, targetId: string): boolean => {
      if (currentId === targetId) return true;
      if (visited.has(currentId)) return false;
      
      visited.add(currentId);
      path.push(currentId);
      
      const node = schematicData.nodes.find(n => n.id === currentId);
      if (!node) return false;
      
      for (const output of node.outputs) {
        const connection = schematicData.connections.find(c => c.from === currentId && c.fromPort === output);
        if (connection && dfs(connection.to, targetId)) {
          return true;
        }
      }
      
      path.pop();
      return false;
    };
    
    // Start from inputs
    const inputs = schematicData.nodes.filter(n => n.type === 'input');
    for (const input of inputs) {
      if (dfs(input.id, nodeId)) {
        break;
      }
    }
    
    return path;
  };

  const handleSearch = () => {
    if (!searchTerm.trim() || !schematicData) return;
    
    const node = schematicData.nodes.find(n => 
      n.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (node) {
      handleNodeClick(node.id);
    }
  };

  const loadMockSchematic = () => {
    const mockData: SchematicData = {
      nodes: [
        {
          id: 'clk',
          type: 'input',
          label: 'CLK',
          x: 50,
          y: 100,
          width: 60,
          height: 30,
          inputs: [],
          outputs: ['clk_out'],
          properties: { signal: 'clk' }
        },
        {
          id: 'rst_n',
          type: 'input',
          label: 'RST_N',
          x: 50,
          y: 200,
          width: 60,
          height: 30,
          inputs: [],
          outputs: ['rst_out'],
          properties: { signal: 'rst_n' }
        },
        {
          id: 'data_in',
          type: 'input',
          label: 'DATA_IN[7:0]',
          x: 50,
          y: 300,
          width: 80,
          height: 30,
          inputs: [],
          outputs: ['data_out'],
          properties: { signal: 'data_in', width: 8 }
        },
        {
          id: 'reg1',
          type: 'register',
          label: 'REG1',
          x: 200,
          y: 100,
          width: 60,
          height: 40,
          inputs: ['clk_in', 'rst_in', 'data_in'],
          outputs: ['data_out'],
          properties: { width: 8 }
        },
        {
          id: 'and1',
          type: 'gate',
          label: 'AND',
          x: 350,
          y: 150,
          width: 50,
          height: 30,
          inputs: ['a', 'b'],
          outputs: ['y'],
          properties: { gate_type: 'and' }
        },
        {
          id: 'data_out',
          type: 'output',
          label: 'DATA_OUT[7:0]',
          x: 500,
          y: 150,
          width: 80,
          height: 30,
          inputs: ['data_in'],
          outputs: [],
          properties: { signal: 'data_out', width: 8 }
        }
      ],
      connections: [
        {
          id: 'conn1',
          from: 'clk',
          to: 'reg1',
          fromPort: 'clk_out',
          toPort: 'clk_in',
          signal: 'clk',
          width: 1
        },
        {
          id: 'conn2',
          from: 'rst_n',
          to: 'reg1',
          fromPort: 'rst_out',
          toPort: 'rst_in',
          signal: 'rst_n',
          width: 1
        },
        {
          id: 'conn3',
          from: 'data_in',
          to: 'reg1',
          fromPort: 'data_out',
          toPort: 'data_in',
          signal: 'data_in',
          width: 8
        },
        {
          id: 'conn4',
          from: 'reg1',
          to: 'and1',
          fromPort: 'data_out',
          toPort: 'a',
          signal: 'reg_data',
          width: 1
        },
        {
          id: 'conn5',
          from: 'and1',
          to: 'data_out',
          fromPort: 'y',
          toPort: 'data_in',
          signal: 'and_out',
          width: 1
        }
      ],
      metadata: {
        name: 'Example Schematic',
        version: '1.0',
        timestamp: new Date()
      },
      statistics: {
        totalNodes: 6,
        totalConnections: 5,
        maxDepth: 3,
        maxFanout: 2
      }
    };

    setSchematicData(mockData);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'input':
        return <Circle className="h-4 w-4" />;
      case 'output':
        return <Circle className="h-4 w-4" />;
      case 'gate':
        return <Triangle className="h-4 w-4" />;
      case 'register':
        return <Square className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'input':
        return '#4ecdc4';
      case 'output':
        return '#ff6b6b';
      case 'gate':
        return '#45b7d1';
      case 'register':
        return '#96ceb4';
      default:
        return '#feca57';
    }
  };

  useEffect(() => {
    loadMockSchematic();
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <GitBranch className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">Schematic Viewer</h2>
          <Badge variant="secondary" className="bg-blue-800 text-blue-200">
            Logic Flow
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {schematicData && (
            <>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                {schematicData.statistics.totalNodes} nodes
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {schematicData.statistics.totalConnections} connections
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={loadMockSchematic}
              >
                <Upload className="h-4 w-4 mr-2" />
                Load Schematic
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
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-cyan-400" />
                    View Controls
                  </CardTitle>
                  <CardDescription>
                    Control schematic visualization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Search Node</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900 border-slate-600"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSearch}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Zoom Controls</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.2}
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
                        disabled={zoom >= 5}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Display Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showSignals"
                          checked={showSignals}
                          onChange={(e) => setShowSignals(e.target.checked)}
                          className="rounded border-slate-600 bg-slate-900"
                        />
                        <Label htmlFor="showSignals" className="text-sm">Show Signals</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showLabels"
                          checked={showLabels}
                          onChange={(e) => setShowLabels(e.target.checked)}
                          className="rounded border-slate-600 bg-slate-900"
                        />
                        <Label htmlFor="showLabels" className="text-sm">Show Labels</Label>
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

                  {schematicData && (
                    <div className="space-y-2">
                      <Label>Statistics</Label>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Nodes</div>
                          <div className="font-mono">{schematicData.statistics.totalNodes}</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Connections</div>
                          <div className="font-mono">{schematicData.statistics.totalConnections}</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Max Depth</div>
                          <div className="font-mono">{schematicData.statistics.maxDepth}</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Max Fanout</div>
                          <div className="font-mono">{schematicData.statistics.maxFanout}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nodes" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Node List</CardTitle>
                  <CardDescription>
                    All nodes in the schematic
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schematicData?.nodes.map(node => (
                    <div
                      key={node.id}
                      className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                        selectedNode === node.id ? 'bg-cyan-900/30 border border-cyan-500' : 'hover:bg-slate-700'
                      }`}
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: getNodeColor(node.type) }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{node.label}</div>
                        <div className="text-xs text-slate-400">{node.type}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {node.inputs.length}→{node.outputs.length}
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
                <Network className="h-5 w-5 text-cyan-400" />
                Schematic Canvas
              </h3>
              {schematicData && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-slate-400">
                    Zoom: {Math.round(zoom * 100)}%
                  </Badge>
                  <Badge variant="outline" className="text-slate-400">
                    {highlightedPath.length > 0 ? `${highlightedPath.length} nodes in path` : 'No path selected'}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 relative overflow-hidden">
              {schematicData ? (
                <div className="h-full relative">
                  {/* Mock schematic canvas */}
                  <div 
                    className="w-full h-full bg-slate-800 rounded border border-slate-600 relative"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top left'
                    }}
                  >
                    {/* Render connections */}
                    {schematicData.connections.map(conn => {
                      const fromNode = schematicData.nodes.find(n => n.id === conn.from);
                      const toNode = schematicData.nodes.find(n => n.id === conn.to);
                      
                      if (!fromNode || !toNode) return null;
                      
                      const isHighlighted = highlightedPath.includes(conn.from) || highlightedPath.includes(conn.to);
                      
                      return (
                        <svg
                          key={conn.id}
                          className="absolute inset-0 pointer-events-none"
                          style={{ zIndex: isHighlighted ? 10 : 1 }}
                        >
                          <line
                            x1={fromNode.x + fromNode.width}
                            y1={fromNode.y + fromNode.height / 2}
                            x2={toNode.x}
                            y2={toNode.y + toNode.height / 2}
                            stroke={isHighlighted ? '#10b981' : '#6b7280'}
                            strokeWidth={isHighlighted ? 3 : 2}
                            markerEnd="url(#arrowhead)"
                            className="transition-all"
                          />
                          {showSignals && (
                            <text
                              x={(fromNode.x + fromNode.width + toNode.x) / 2}
                              y={fromNode.y + fromNode.height / 2 - 10}
                              fill="#9ca3af"
                              fontSize="10"
                              textAnchor="middle"
                              className="font-mono"
                            >
                              {conn.signal}
                            </text>
                          )}
                        </svg>
                      );
                    })}

                    {/* Arrow marker definition */}
                    <svg className="absolute inset-0 pointer-events-none">
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#6b7280"
                          />
                        </marker>
                      </defs>
                    </svg>

                    {/* Render nodes */}
                    {schematicData.nodes.map(node => {
                      const isSelected = selectedNode === node.id;
                      const isInPath = highlightedPath.includes(node.id);
                      
                      return (
                        <div
                          key={node.id}
                          className={`absolute border-2 rounded cursor-pointer transition-all ${
                            isSelected ? 'border-cyan-400 bg-cyan-900/20' :
                            isInPath ? 'border-emerald-400 bg-emerald-900/20' :
                            'border-slate-600 bg-slate-700 hover:border-slate-500'
                          }`}
                          style={{
                            left: node.x,
                            top: node.y,
                            width: node.width,
                            height: node.height,
                            zIndex: isSelected || isInPath ? 20 : 10
                          }}
                          onClick={() => handleNodeClick(node.id)}
                        >
                          <div className="flex items-center justify-center h-full p-1">
                            <div className="text-center">
                              {showLabels && (
                                <div className="text-xs font-mono text-slate-200">
                                  {node.label}
                                </div>
                              )}
                              <div className="text-xs text-slate-400">
                                {node.type}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overlay controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 5}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.2}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No schematic data available</p>
                    <p className="text-sm">Load a schematic to view logic flow</p>
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

export default SchematicViewer; 