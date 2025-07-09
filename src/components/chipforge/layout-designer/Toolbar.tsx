import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Square, 
  Zap, 
  Hand, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Copy,
  Undo,
  Redo,
  Settings,
  Grid3X3,
  Eye,
  EyeOff
} from "lucide-react";
import { useLayoutStore } from './useLayoutStore';
import { CellType, CELL_TEMPLATES } from './CellLibrary';

export default function Toolbar() {
  const {
    currentTool,
    setCurrentTool,
    selectedCellType,
    setSelectedCellType,
    viewport,
    setViewport,
    resetViewport,
    cells,
    wires,
    clearSelection,
    removeCell,
    exportLayout
  } = useLayoutStore();

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select', description: 'Select and move cells' },
    { id: 'place', icon: Square, label: 'Place', description: 'Place cells on canvas' },
    { id: 'wire', icon: Zap, label: 'Wire', description: 'Connect cells with wires' },
    { id: 'pan', icon: Hand, label: 'Pan', description: 'Pan around the canvas' }
  ] as const;

  const cellTypes = Object.keys(CELL_TEMPLATES) as CellType[];

  const handleZoomIn = () => {
    const newZoom = Math.min(5, viewport.zoom * 1.2);
    setViewport({ ...viewport, zoom: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, viewport.zoom / 1.2);
    setViewport({ ...viewport, zoom: newZoom });
  };

  const handleExport = () => {
    const layout = exportLayout();
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteSelected = () => {
    // This would need to be implemented with selection tracking
    clearSelection();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-300 p-4 space-y-4 overflow-y-auto">
      {/* Tool Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tools.map(tool => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setCurrentTool(tool.id)}
            >
              <tool.icon className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs text-muted-foreground">{tool.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Cell Library */}
      {currentTool === 'place' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cell Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cellTypes.map(cellType => (
              <Button
                key={cellType}
                variant={selectedCellType === cellType ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedCellType(cellType)}
              >
                <Square className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{cellType}</div>
                  <div className="text-xs text-muted-foreground">
                    {CELL_TEMPLATES[cellType].pins.length} pins
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* View Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">View</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Zoom Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Zoom</span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Badge variant="outline" className="min-w-[60px] justify-center">
                {Math.round(viewport.zoom * 100)}%
              </Badge>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={resetViewport}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={handleDeleteSelected}>
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
            <Button size="sm" variant="outline">
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline">
              <Undo className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button size="sm" variant="outline">
              <Redo className="h-3 w-3 mr-1" />
              Redo
            </Button>
          </div>

          <Separator />

          <Button variant="outline" className="w-full" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Layout
          </Button>

          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Import Layout
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Cells:</span>
            <Badge variant="outline">{cells.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Total Wires:</span>
            <Badge variant="outline">{wires.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Selected:</span>
            <Badge variant="outline">0</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid Settings
          </Button>
          <Button variant="outline" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Options
          </Button>
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 