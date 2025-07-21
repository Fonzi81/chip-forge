import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Plus,
  Settings,
  Info,
  Zap,
  Cpu,
  Database,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import DRCEngine from "@/components/chipforge/layout-designer/DRCEngine";

export interface CellPin {
  id: string;
  name: string;
  direction: 'input' | 'output' | 'inout' | 'power' | 'ground';
  position: { x: number; y: number };
  signalType?: 'data' | 'clock' | 'reset' | 'enable' | 'power' | 'ground';
  width?: number;
  layer?: string;
}

export interface CellTemplate {
  id: string;
  name: string;
  category: CellCategory;
  description: string;
  width: number;
  height: number;
  pins: CellPin[];
  properties: {
    driveStrength?: number;
    delay?: number;
    power?: number;
    area?: number;
  };
  symbol?: string;
  color: string;
  technology?: string;
  version?: string;
}

export type CellCategory = 
  | 'logic' 
  | 'sequential' 
  | 'memory' 
  | 'io' 
  | 'analog' 
  | 'power' 
  | 'custom';

const CELL_CATEGORIES: { id: CellCategory; name: string; icon: React.ComponentType<any>; color: string }[] = [
  { id: 'logic', name: 'Logic Gates', icon: Zap, color: '#3b82f6' },
  { id: 'sequential', name: 'Sequential', icon: Cpu, color: '#10b981' },
  { id: 'memory', name: 'Memory', icon: Database, color: '#f59e0b' },
  { id: 'io', name: 'I/O', icon: ArrowRight, color: '#ef4444' },
  { id: 'analog', name: 'Analog', icon: Settings, color: '#8b5cf6' },
  { id: 'power', name: 'Power', icon: Zap, color: '#06b6d4' },
  { id: 'custom', name: 'Custom', icon: Plus, color: '#84cc16' },
];

// Comprehensive cell library
const CELL_LIBRARY: CellTemplate[] = [
  // Logic Gates
  {
    id: 'AND2_X1',
    name: 'AND2_X1',
    category: 'logic',
    description: '2-input AND gate with 1x drive strength',
    width: 80,
    height: 60,
    color: '#3b82f6',
    pins: [
      { id: 'A', name: 'A', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'B', name: 'B', direction: 'input', position: { x: 0, y: 40 }, signalType: 'data' },
      { id: 'Z', name: 'Z', direction: 'output', position: { x: 80, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.5, power: 0.1, area: 4800 },
    symbol: '&'
  },
  {
    id: 'NAND2_X1',
    name: 'NAND2_X1',
    category: 'logic',
    description: '2-input NAND gate with 1x drive strength',
    width: 80,
    height: 60,
    color: '#3b82f6',
    pins: [
      { id: 'A', name: 'A', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'B', name: 'B', direction: 'input', position: { x: 0, y: 40 }, signalType: 'data' },
      { id: 'Z', name: 'Z', direction: 'output', position: { x: 80, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.3, power: 0.08, area: 4800 },
    symbol: '⊼'
  },
  {
    id: 'OR2_X1',
    name: 'OR2_X1',
    category: 'logic',
    description: '2-input OR gate with 1x drive strength',
    width: 80,
    height: 60,
    color: '#3b82f6',
    pins: [
      { id: 'A', name: 'A', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'B', name: 'B', direction: 'input', position: { x: 0, y: 40 }, signalType: 'data' },
      { id: 'Z', name: 'Z', direction: 'output', position: { x: 80, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.6, power: 0.12, area: 4800 },
    symbol: '≥1'
  },
  {
    id: 'INV_X1',
    name: 'INV_X1',
    category: 'logic',
    description: 'Inverter with 1x drive strength',
    width: 60,
    height: 40,
    color: '#3b82f6',
    pins: [
      { id: 'A', name: 'A', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'Z', name: 'Z', direction: 'output', position: { x: 60, y: 20 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.2, power: 0.05, area: 2400 },
    symbol: '1'
  },
  {
    id: 'XOR2_X1',
    name: 'XOR2_X1',
    category: 'logic',
    description: '2-input XOR gate with 1x drive strength',
    width: 80,
    height: 60,
    color: '#3b82f6',
    pins: [
      { id: 'A', name: 'A', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'B', name: 'B', direction: 'input', position: { x: 0, y: 40 }, signalType: 'data' },
      { id: 'Z', name: 'Z', direction: 'output', position: { x: 80, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.8, power: 0.15, area: 4800 },
    symbol: '=1'
  },

  // Sequential Elements
  {
    id: 'DFF_X1',
    name: 'DFF_X1',
    category: 'sequential',
    description: 'D Flip-Flop with 1x drive strength',
    width: 100,
    height: 80,
    color: '#10b981',
    pins: [
      { id: 'D', name: 'D', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'CLK', name: 'CLK', direction: 'input', position: { x: 0, y: 40 }, signalType: 'clock' },
      { id: 'Q', name: 'Q', direction: 'output', position: { x: 100, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 1.2, power: 0.25, area: 8000 },
    symbol: 'D'
  },
  {
    id: 'DFF_R_X1',
    name: 'DFF_R_X1',
    category: 'sequential',
    description: 'D Flip-Flop with reset',
    width: 100,
    height: 100,
    color: '#10b981',
    pins: [
      { id: 'D', name: 'D', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'CLK', name: 'CLK', direction: 'input', position: { x: 0, y: 35 }, signalType: 'clock' },
      { id: 'RST', name: 'RST', direction: 'input', position: { x: 0, y: 50 }, signalType: 'reset' },
      { id: 'Q', name: 'Q', direction: 'output', position: { x: 100, y: 35 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 1.3, power: 0.28, area: 10000 },
    symbol: 'D'
  },
  {
    id: 'LATCH_X1',
    name: 'LATCH_X1',
    category: 'sequential',
    description: 'D Latch with enable',
    width: 100,
    height: 80,
    color: '#10b981',
    pins: [
      { id: 'D', name: 'D', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'EN', name: 'EN', direction: 'input', position: { x: 0, y: 40 }, signalType: 'enable' },
      { id: 'Q', name: 'Q', direction: 'output', position: { x: 100, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.8, power: 0.18, area: 8000 },
    symbol: 'D'
  },

  // Memory Elements
  {
    id: 'SRAM_1KX8',
    name: 'SRAM_1KX8',
    category: 'memory',
    description: '1K x 8-bit SRAM',
    width: 200,
    height: 150,
    color: '#f59e0b',
    pins: [
      { id: 'A0', name: 'A0', direction: 'input', position: { x: 0, y: 20 }, signalType: 'data' },
      { id: 'A1', name: 'A1', direction: 'input', position: { x: 0, y: 35 }, signalType: 'data' },
      { id: 'A2', name: 'A2', direction: 'input', position: { x: 0, y: 50 }, signalType: 'data' },
      { id: 'A3', name: 'A3', direction: 'input', position: { x: 0, y: 65 }, signalType: 'data' },
      { id: 'A4', name: 'A4', direction: 'input', position: { x: 0, y: 80 }, signalType: 'data' },
      { id: 'A5', name: 'A5', direction: 'input', position: { x: 0, y: 95 }, signalType: 'data' },
      { id: 'A6', name: 'A6', direction: 'input', position: { x: 0, y: 110 }, signalType: 'data' },
      { id: 'A7', name: 'A7', direction: 'input', position: { x: 0, y: 125 }, signalType: 'data' },
      { id: 'A8', name: 'A8', direction: 'input', position: { x: 0, y: 140 }, signalType: 'data' },
      { id: 'A9', name: 'A9', direction: 'input', position: { x: 0, y: 155 }, signalType: 'data' },
      { id: 'WE', name: 'WE', direction: 'input', position: { x: 0, y: 170 }, signalType: 'enable' },
      { id: 'OE', name: 'OE', direction: 'input', position: { x: 0, y: 185 }, signalType: 'enable' },
      { id: 'D0', name: 'D0', direction: 'inout', position: { x: 200, y: 20 }, signalType: 'data' },
      { id: 'D1', name: 'D1', direction: 'inout', position: { x: 200, y: 35 }, signalType: 'data' },
      { id: 'D2', name: 'D2', direction: 'inout', position: { x: 200, y: 50 }, signalType: 'data' },
      { id: 'D3', name: 'D3', direction: 'inout', position: { x: 200, y: 65 }, signalType: 'data' },
      { id: 'D4', name: 'D4', direction: 'inout', position: { x: 200, y: 80 }, signalType: 'data' },
      { id: 'D5', name: 'D5', direction: 'inout', position: { x: 200, y: 95 }, signalType: 'data' },
      { id: 'D6', name: 'D6', direction: 'inout', position: { x: 200, y: 110 }, signalType: 'data' },
      { id: 'D7', name: 'D7', direction: 'inout', position: { x: 200, y: 125 }, signalType: 'data' }
    ],
    properties: { driveStrength: 4, delay: 2.5, power: 1.2, area: 30000 },
    symbol: 'RAM'
  },

  // I/O Cells
  {
    id: 'INBUF_X1',
    name: 'INBUF_X1',
    category: 'io',
    description: 'Input buffer with 1x drive strength',
    width: 80,
    height: 60,
    color: '#ef4444',
    pins: [
      { id: 'PAD', name: 'PAD', direction: 'input', position: { x: 0, y: 30 }, signalType: 'data' },
      { id: 'Z', name: 'Z', direction: 'output', position: { x: 80, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.3, power: 0.1, area: 4800 },
    symbol: 'IN'
  },
  {
    id: 'OUTBUF_X1',
    name: 'OUTBUF_X1',
    category: 'io',
    description: 'Output buffer with 1x drive strength',
    width: 80,
    height: 60,
    color: '#ef4444',
    pins: [
      { id: 'A', name: 'A', direction: 'input', position: { x: 0, y: 30 }, signalType: 'data' },
      { id: 'PAD', name: 'PAD', direction: 'output', position: { x: 80, y: 30 }, signalType: 'data' }
    ],
    properties: { driveStrength: 1, delay: 0.4, power: 0.15, area: 4800 },
    symbol: 'OUT'
  },

  // Power Cells
  {
    id: 'VDD',
    name: 'VDD',
    category: 'power',
    description: 'Power supply connection',
    width: 60,
    height: 40,
    color: '#06b6d4',
    pins: [
      { id: 'VDD', name: 'VDD', direction: 'inout', position: { x: 30, y: 0 }, signalType: 'power' }
    ],
    properties: { driveStrength: 0, delay: 0, power: 0, area: 2400 },
    symbol: 'VDD'
  },
  {
    id: 'VSS',
    name: 'VSS',
    category: 'power',
    description: 'Ground connection',
    width: 60,
    height: 40,
    color: '#06b6d4',
    pins: [
      { id: 'VSS', name: 'VSS', direction: 'inout', position: { x: 30, y: 40 }, signalType: 'ground' }
    ],
    properties: { driveStrength: 0, delay: 0, power: 0, area: 2400 },
    symbol: 'VSS'
  }
];

interface CellLibraryProps {
  onCellSelect?: (cell: CellTemplate) => void;
  onCellDragStart?: (cell: CellTemplate, event: React.DragEvent) => void;
}

export default function CellLibrary({ onCellSelect, onCellDragStart }: CellLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CellCategory>('logic');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCells = CELL_LIBRARY.filter(cell => {
    const matchesSearch = cell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cell.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = cell.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCellDragStart = (cell: CellTemplate, event: React.DragEvent) => {
    event.dataTransfer.setData('application/json', JSON.stringify(cell));
    event.dataTransfer.effectAllowed = 'copy';
    onCellDragStart?.(cell, event);
  };

  const handleCellClick = (cell: CellTemplate) => {
    onCellSelect?.(cell);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">Cell Library</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`h-6 px-2 ${viewMode === 'grid' ? 'bg-slate-700' : ''}`}
          >
            <Grid3X3 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`h-6 px-2 ${viewMode === 'list' ? 'bg-slate-700' : ''}`}
          >
            <List className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search cells..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CellCategory)}>
        <TabsList className="grid grid-cols-4 w-full mb-4">
          {CELL_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs p-2"
                title={category.name}
              >
                <Icon className="w-3 h-3 mr-1" style={{ color: category.color }} />
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Cell List */}
        <div className="max-h-96 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredCells.map((cell) => (
                <div
                  key={cell.id}
                  draggable
                  onDragStart={(e) => handleCellDragStart(cell, e)}
                  onClick={() => handleCellClick(cell)}
                  className="bg-slate-700 border border-slate-600 rounded p-2 cursor-pointer hover:bg-slate-600 transition-colors"
                  title={cell.description}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {cell.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {cell.properties.driveStrength}x
                    </Badge>
                  </div>
                  <div 
                    className="w-full h-8 rounded border border-slate-500 flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: cell.color + '20' }}
                  >
                    {cell.symbol || cell.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {cell.pins.length} pins
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCells.map((cell) => (
                <div
                  key={cell.id}
                  draggable
                  onDragStart={(e) => handleCellDragStart(cell, e)}
                  onClick={() => handleCellClick(cell)}
                  className="flex items-center gap-3 p-2 bg-slate-700 border border-slate-600 rounded cursor-pointer hover:bg-slate-600 transition-colors"
                  title={cell.description}
                >
                  <div 
                    className="w-8 h-6 rounded border border-slate-500 flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: cell.color + '20' }}
                  >
                    {cell.symbol || cell.name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">
                      {cell.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {cell.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {cell.properties.driveStrength}x
                    </Badge>
                    <div className="text-xs text-slate-400 mt-1">
                      {cell.pins.length} pins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      {/* Statistics */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Showing: {filteredCells.length}</span>
          <span>Total: {CELL_LIBRARY.length}</span>
        </div>
      </div>
    </div>
  );
} 