import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  MousePointer, 
  Square, 
  Move, 
  Trash2, 
  RotateCcw,
  Copy,
  Scissors,
  Ruler,
  Eye,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Settings,
  Search,
  Command,
  Undo,
  Redo,
  Save,
  Download,
  Upload
} from "lucide-react";
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';

export type ToolMode = 'select' | 'place' | 'move' | 'delete' | 'measure' | 'route' | 'via' | 'text';

interface Tool {
  id: ToolMode;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  shortcut: string;
  category: 'selection' | 'placement' | 'editing' | 'measurement' | 'view';
}

const tools: Tool[] = [
  // Selection tools
  { id: 'select', icon: MousePointer, label: 'Select', description: 'Select and manipulate objects', shortcut: 'S', category: 'selection' },
  
  // Placement tools
  { id: 'place', icon: Square, label: 'Place', description: 'Place cells and components', shortcut: 'P', category: 'placement' },
  { id: 'route', icon: Scissors, label: 'Route', description: 'Create wire connections', shortcut: 'R', category: 'placement' },
  { id: 'via', icon: Layers, label: 'Via', description: 'Create via connections', shortcut: 'V', category: 'placement' },
  { id: 'text', icon: Command, label: 'Text', description: 'Add text annotations', shortcut: 'T', category: 'placement' },
  
  // Editing tools
  { id: 'move', icon: Move, label: 'Move', description: 'Move selected objects', shortcut: 'M', category: 'editing' },
  { id: 'delete', icon: Trash2, label: 'Delete', description: 'Delete selected objects', shortcut: 'Del', category: 'editing' },
  
  // Measurement tools
  { id: 'measure', icon: Ruler, label: 'Measure', description: 'Measure distances and areas', shortcut: 'D', category: 'measurement' },
];

const viewTools = [
  { id: 'zoom-in', icon: ZoomIn, label: 'Zoom In', shortcut: 'Ctrl++' },
  { id: 'zoom-out', icon: ZoomOut, label: 'Zoom Out', shortcut: 'Ctrl+-' },
  { id: 'fit-view', icon: Maximize2, label: 'Fit View', shortcut: 'F' },
  { id: 'grid', icon: Grid3X3, label: 'Toggle Grid', shortcut: 'G' },
  { id: 'layers', icon: Layers, label: 'Layer Panel', shortcut: 'L' },
];

export default function ProfessionalToolbar() {
  const { tool, setTool, selectedCellType, setSelectedCellType } = useLayoutEditorStore();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  const handleToolSelect = (toolId: ToolMode) => {
    setTool(toolId);
  };

  const handleKeyboardShortcut = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'p':
          e.preventDefault();
          setShowCommandPalette(true);
          break;
        case 'z':
          e.preventDefault();
          // TODO: Implement undo
          break;
        case 'y':
          e.preventDefault();
          // TODO: Implement redo
          break;
        case 's':
          e.preventDefault();
          // TODO: Implement save
          break;
      }
    } else {
      switch (e.key.toLowerCase()) {
        case 's':
          handleToolSelect('select');
          break;
        case 'p':
          handleToolSelect('place');
          break;
        case 'm':
          handleToolSelect('move');
          break;
        case 'r':
          handleToolSelect('route');
          break;
        case 'v':
          handleToolSelect('via');
          break;
        case 't':
          handleToolSelect('text');
          break;
        case 'd':
          handleToolSelect('measure');
          break;
        case 'g':
          // TODO: Toggle grid
          break;
        case 'f':
          // TODO: Fit to view
          break;
      }
    }
  };

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-2">
      {/* Main toolbar */}
      <div className="flex items-center gap-2 mb-2">
        {/* Tool groups */}
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category} className="flex items-center gap-1">
            {categoryTools.map((t) => (
              <Button
                key={t.id}
                variant={tool === t.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolSelect(t.id)}
                className="h-8 px-2 text-xs"
                title={`${t.description} (${t.shortcut})`}
              >
                <t.icon className="w-4 h-4 mr-1" />
                {t.label}
              </Button>
            ))}
            <Separator orientation="vertical" className="h-6" />
          </div>
        ))}

        {/* View tools */}
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          {viewTools.map((t) => (
            <Button
              key={t.id}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              title={`${t.label} (${t.shortcut})`}
            >
              <t.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        {/* Action buttons */}
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Undo (Ctrl+Z)">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Redo (Ctrl+Y)">
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Save (Ctrl+S)">
            <Save className="w-4 h-4" />
          </Button>
        </div>

        {/* Command palette trigger */}
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCommandPalette(true)}
          className="h-8 px-2 text-xs"
          title="Command Palette (Ctrl+P)"
        >
          <Search className="w-4 h-4 mr-1" />
          Ctrl+P
        </Button>
      </div>

      {/* Secondary toolbar - Cell type selection */}
      {tool === 'place' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Cell Type:</span>
          <div className="flex gap-1">
            {['AND2_X1', 'INV_X1', 'OR2_X1', 'DFF', 'NAND2_X1', 'NOR2_X1'].map((type) => (
              <Button
                key={type}
                variant={selectedCellType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCellType(type)}
                className="h-6 px-2 text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Command palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 w-96">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search commands..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommandPalette(false)}
              >
                Esc
              </Button>
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {tools
                .filter(t => t.label.toLowerCase().includes(commandQuery.toLowerCase()))
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 hover:bg-slate-700 rounded cursor-pointer"
                    onClick={() => {
                      handleToolSelect(t.id);
                      setShowCommandPalette(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <t.icon className="w-4 h-4" />
                      <span className="text-sm">{t.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {t.shortcut}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard event listener */}
      <div tabIndex={0} onKeyDown={handleKeyboardShortcut} className="sr-only" />
    </div>
  );
} 