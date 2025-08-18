import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { 
  Search, Star, ShoppingCart, Folder, Cloud, Settings,
  Eye, Cpu, Zap, FileText, CircuitBoard, Box, ChevronDown,
  Plus, CheckCircle, MessageSquare, Code, TestTube, Target,
  Brain, Send, AlertCircle, Sparkles, Clock, RefreshCw,
  Save, Download, ArrowRight, MousePointer, Move, RotateCw,
  ZoomIn, ZoomOut, Grid as GridIcon, Square, Circle, Triangle, Hexagon,
  Check, AlertTriangle, Shield, Package, Globe, Minus,
  X, RotateCcw, Wifi, Navigation, Compass, Satellite,
  Radio, Antenna, Microchip, Camera, Layers, CpuIcon,
  Calculator, Wrench, Gauge, Battery, RadioTower, Image as ImageIcon
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

// General Chip Design Component interface
interface Component {
  id: string;
  name: string;
  type: 'nmos' | 'pmos' | 'bjt' | 'nand' | 'nor' | 'and' | 'or' | 'xor' | 'not' | 
        'dff' | 'tff' | 'jkff' | 'srff' | 'dlatch' | 'srlatch' | 'register' | 'counter' | 'sram' | 'rom' | 'adder' | 'multiplier' | 'alu' | 'io_buffer' | 
        'level_shifter' | 'opamp' | 'adc' | 'dac' | 'pll' | 'vreg' | 'power_switch' |
        'uart' | 'spi' | 'i2c';
  description: string;
  creator: string;
  verified: boolean;
  usage: string;
  likes: number;
  icon: React.ReactNode;
  category: string;
  pins: string[];
  power: string;
  area: string;
  outputs?: string[];
  inputs?: string[];
}

// AI Chat Message interface
interface AIChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
} 

// AI Copilot Component
function AICopilot({ messages, onSendMessage, onApplySuggestion }: {
  messages: AIChatMessage[];
  onSendMessage: (message: string) => void;
  onApplySuggestion: (suggestion: string) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          <h2 className="font-semibold text-slate-200">AI Copilot</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Analyze my chip design for timing violations")}
          >
            <AlertCircle className="h-3 w-3 mr-2" />
            Timing Analysis
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Optimize power consumption in my design")}
          >
            <Zap className="h-3 w-3 mr-2" />
            Power Optimization
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Generate testbench for my HDL module")}
          >
            <TestTube className="h-3 w-3 mr-2" />
            Generate Testbench
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Check DRC violations in my layout")}
          >
            <Shield className="h-3 w-3 mr-2" />
            DRC Check
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-700 text-slate-200'
              }`}>
                <div className="text-sm">{message.content}</div>
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-auto p-1 text-slate-200 hover:bg-slate-600 hover:text-slate-100 bg-transparent"
                        onClick={() => onApplySuggestion(suggestion)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your chip design..."
            className="flex-1 bg-slate-700 border-slate-600 text-slate-100"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button size="sm" onClick={handleSend} className="bg-transparent border-slate-500 text-slate-300 hover:bg-slate-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 

// Schematic Design Tab with General Chip Components
function SchematicDesignTab() {
  // Always use global store for design state
  const design = useHDLDesignStore((state) => state.design);
  const setDesign = useHDLDesignStore((state) => state.setDesign);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state mirrors global store, always kept in sync
  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);

  // On mount and whenever design changes, sync local state
  useEffect(() => {
    if (design) {
      setComponents(design.components || []);
      setWires(design.wires || []);
    }
  }, [design]);

  // On any schematic change, update global store
  const updateDesign = (newComponents, newWires) => {
    setComponents(newComponents);
    setWires(newWires);
    setDesign({ ...design, components: newComponents, wires: newWires });
  };

  // Example: Add component
  const handleAddComponent = (newComponent) => {
    const updated = [...components, newComponent];
    updateDesign(updated, wires);
  };
  // Example: Add wire
  const handleAddWire = (newWire) => {
    const updated = [...wires, newWire];
    updateDesign(components, updated);
  };
  // Example: Move component
  const handleMoveComponent = (id, x, y) => {
    const updated = components.map(c => c.id === id ? { ...c, x, y } : c);
    updateDesign(updated, wires);
  };
  // Example: Delete component
  const handleDeleteComponent = (id) => {
    const updated = components.filter(c => c.id !== id);
    const updatedWires = wires.filter(w => w.from.blockId !== id && w.to.blockId !== id);
    updateDesign(updated, updatedWires);
  };

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [justDragged, setJustDragged] = useState(false);
  const [wiring, setWiring] = useState<null | { blockId: string; port: string; type: 'output' | 'input'; x: number; y: number }>(null);
  const [hoveredPort, setHoveredPort] = useState<null | { blockId: string; port: string; type: 'output' | 'input' }>(null);

  // Define block size constants
  const BLOCK_WIDTH = 140;
  const BLOCK_HEIGHT = 90;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDragging || justDragged) {
      setJustDragged(false);
      return;
    }
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: 'nand',
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      connections: [],
      inputs: ['A', 'B'],
      outputs: ['Y'],
    };
    handleAddComponent(newComponent);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const componentType = e.dataTransfer.getData('text/plain');
    if (!componentType) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: componentType,
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      connections: [],
      inputs: ['A', 'B'],
      outputs: ['Y'],
    };
    
    handleAddComponent(newComponent);
  };

  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    const rect = canvasRef.current!.getBoundingClientRect();
    const component = components.find(c => c.id === componentId);
    
    if (component) {
      setSelectedComponent(componentId);
      setIsDragging(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setDragOffset({
        x: e.clientX - rect.left - component.x,
        y: e.clientY - rect.top - component.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedComponent) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    const snappedX = Math.round(newX / 20) * 20;
    const snappedY = Math.round(newY / 20) * 20;
    
    handleMoveComponent(selectedComponent, snappedX, snappedY);
  };

  const handleMouseUp = () => {
    if (isDragging) setJustDragged(true);
    setIsDragging(false);
    setSelectedComponent(null);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!selectedComponent) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        
        const snappedX = Math.round(newX / 20) * 20;
        const snappedY = Math.round(newY / 20) * 20;
        
        handleMoveComponent(selectedComponent, snappedX, snappedY);
      };

      const handleGlobalMouseUp = () => {
        setJustDragged(true);
        setIsDragging(false);
        setSelectedComponent(null);
        setDragOffset({ x: 0, y: 0 });
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, selectedComponent, dragOffset]);

  const getComponentSymbol = (type: string) => {
    switch (type) {
      case 'nmos':
        return (
          <div className="w-8 h-6 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-3 border border-slate-600 relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
              </div>
            </div>
          </div>
        );
      case 'pmos':
        return (
          <div className="w-8 h-6 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-3 border border-slate-600 relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-slate-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'nand':
        return (
          <div className="w-10 h-8 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-4 border border-slate-600 rounded-l relative">
                <div className="absolute right-0 top-0 w-2 h-4 border-l border-slate-600 rounded-r"></div>
              </div>
            </div>
          </div>
        );
      case 'nor':
        return (
          <div className="w-10 h-8 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-4 border border-slate-600 rounded-l relative">
                <div className="absolute right-0 top-0 w-2 h-4 border-l border-slate-600 rounded-r"></div>
                <div className="absolute right-1 top-1/2 w-1 h-1 bg-slate-600 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'dff':
        return (
          <div className="w-12 h-10 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-6 border border-slate-600 rounded relative">
                <div className="absolute top-1 left-1 text-xs text-slate-600 font-bold">D</div>
                <div className="absolute bottom-1 left-1 text-xs text-slate-600 font-bold">Q</div>
                <div className="absolute top-1 right-1 text-xs text-slate-600">CLK</div>
              </div>
            </div>
          </div>
        );
      case 'adder':
        return (
          <div className="w-12 h-10 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-6 border border-slate-600 rounded relative">
                <div className="absolute top-1 left-1 text-xs text-slate-600 font-bold">+</div>
                <div className="absolute bottom-1 left-1 text-xs text-slate-600">A</div>
                <div className="absolute bottom-1 right-1 text-xs text-slate-600">B</div>
              </div>
            </div>
          </div>
        );
      case 'opamp':
        return (
          <div className="w-10 h-8 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-4 border border-slate-600 rounded relative">
                <div className="absolute top-1 left-1 text-xs text-slate-600">+</div>
                <div className="absolute bottom-1 left-1 text-xs text-slate-600">-</div>
                <div className="absolute top-1/2 right-1 text-xs text-slate-600 transform -translate-y-1/2">→</div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="w-6 h-4 bg-slate-300 border border-slate-400 rounded"></div>;
    }
  };

  // Helper to get port positions
  const getPortPosition = (block, port, type) => {
    const idx = (type === 'input' ? block.inputs : block.outputs).indexOf(port);
    const total = (type === 'input' ? block.inputs : block.outputs).length;
    const y = block.y + ((idx + 1) * BLOCK_HEIGHT) / (total + 1);
    const x = type === 'input' ? block.x : block.x + BLOCK_WIDTH;
    return { x, y };
  };

  // Port click handler
  const handlePortClick = (blockId, port, type, e) => {
    e.stopPropagation();
    const block = components.find(c => c.id === blockId);
    if (!block) return;
    const { x, y } = getPortPosition(block, port, type);
    if (!wiring) {
      if (type === 'output') {
        setWiring({ blockId, port, type, x, y });
      }
    } else {
      if (type === 'input' && wiring.type === 'output' && wiring.blockId !== blockId) {
        handleAddWire({
          id: `wire_${Date.now()}`,
          from: { blockId: wiring.blockId, port: wiring.port, type: 'output' },
          to: { blockId, port, type: 'input' }
        });
        setWiring(null); // Reset wiring so user can start a new wire
      } else if (type === 'output') {
        setWiring({ blockId, port, type, x, y }); // Allow starting a new wire from another output
      } else {
        setWiring(null);
      }
    }
  };

  // Image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Ignore the actual file, always set dummy schematic
    setDesign({
      moduleName: "uploaded_schematic",
      description: "Schematic generated from image upload (dummy)",
      io: [],
      components: [
        { id: "block1", type: "and", label: "AND", x: 100, y: 100, inputs: ["A", "B"], outputs: ["Y"] },
        { id: "block2", type: "dff", label: "DFF", x: 300, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] }
      ],
      wires: [
        { from: { nodeId: "block1", port: "Y" }, to: { nodeId: "block2", port: "D" } }
      ],
      verilog: "// HDL will be generated after schematic is processed."
    });
  };

  // Add demo schematic button
  const handleDemoSchematic = () => {
    setDesign({
      moduleName: "counter4",
      description: "4-bit counter demo schematic",
      io: [
        { name: "clk", direction: "input", width: 1 },
        { name: "en", direction: "input", width: 1 },
        { name: "rst", direction: "input", width: 1 },
        { name: "q", direction: "output", width: 4 }
      ],
      verilog: "",
      components: [
        { id: "clk_in", type: "input_port", label: "clk", x: 50, y: 100, inputs: [], outputs: ["IN"] },
        { id: "en_in", type: "input_port", label: "en", x: 50, y: 200, inputs: [], outputs: ["IN"] },
        { id: "rst_in", type: "input_port", label: "rst", x: 50, y: 300, inputs: [], outputs: ["IN"] },
        { id: "dff0", type: "dff", label: "DFF0", x: 200, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "dff1", type: "dff", label: "DFF1", x: 300, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "dff2", type: "dff", label: "DFF2", x: 400, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "dff3", type: "dff", label: "DFF3", x: 500, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "and0", type: "and_gate", label: "AND0", x: 150, y: 200, inputs: ["A", "B"], outputs: ["Y"] },
        { id: "or0", type: "or_gate", label: "OR0", x: 150, y: 300, inputs: ["A", "B"], outputs: ["Y"] },
        { id: "q_out", type: "output_port", label: "q", x: 600, y: 100, inputs: ["OUT"], outputs: [] }
      ],
      wires: [
        { from: { nodeId: "clk_in", port: "IN" }, to: { nodeId: "dff0", port: "CLK" } },
        { from: { nodeId: "dff0", port: "Q" }, to: { nodeId: "dff1", port: "D" } },
        { from: { nodeId: "dff1", port: "Q" }, to: { nodeId: "dff2", port: "D" } },
        { from: { nodeId: "dff2", port: "Q" }, to: { nodeId: "dff3", port: "D" } },
        { from: { nodeId: "dff3", port: "Q" }, to: { nodeId: "q_out", port: "OUT" } },
        { from: { nodeId: "en_in", port: "IN" }, to: { nodeId: "and0", port: "A" } },
        { from: { nodeId: "clk_in", port: "IN" }, to: { nodeId: "and0", port: "B" } },
        { from: { nodeId: "and0", port: "Y" }, to: { nodeId: "dff0", port: "D" } },
        { from: { nodeId: "rst_in", port: "IN" }, to: { nodeId: "or0", port: "A" } },
        { from: { nodeId: "dff3", port: "Q" }, to: { nodeId: "or0", port: "B" } },
        { from: { nodeId: "or0", port: "Y" }, to: { nodeId: "dff0", port: "CLK" } }
      ]
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Schematic Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {/* Small Upload Icon Button */}
        <button
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            zIndex: 20,
          }}
          title="Upload Schematic Image"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <ImageIcon size={20} color="#38bdf8" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Schematic Design Area */}
        <div 
          className={`absolute inset-0 p-4 schematic-canvas transition-all duration-200 ${
            isDragOver ? 'bg-cyan-600/5 border-2 border-dashed border-cyan-400' : ''
          }`}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ 
            cursor: isDragging ? 'grabbing' : isDragOver ? 'copy' : 'crosshair'
          }}
          ref={canvasRef}
        >
          {/* SVG wires */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {wires.map(wire => {
              const fromBlock = components.find(c => c.id === wire.from.blockId);
              const toBlock = components.find(c => c.id === wire.to.blockId);
              if (!fromBlock || !toBlock) return null;
              const fromPos = getPortPosition(fromBlock, wire.from.port, 'output');
              const toPos = getPortPosition(toBlock, wire.to.port, 'input');
              return <line key={wire.id} x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y} stroke="#10b981" strokeWidth={3} />;
            })}
            {wiring && hoveredPort && hoveredPort.type === 'input' && (() => {
              const toBlock = components.find(c => c.id === hoveredPort.blockId);
              if (!toBlock) return null;
              const toPos = getPortPosition(toBlock, hoveredPort.port, 'input');
              return <line x1={wiring.x} y1={wiring.y} x2={toPos.x} y2={toPos.y} stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 2" />;
            })()}
          </svg>
          {/* Placed Components */}
          {components.map((component) => {
            const safeComponent = {
              ...component,
              inputs: Array.isArray(component.inputs) ? component.inputs : [],
              outputs: Array.isArray(component.outputs) ? component.outputs : [],
            };
            return (
              <div
                key={safeComponent.id}
                className={`absolute schematic-block cursor-move transition-transform ${
                  selectedComponent === safeComponent.id ? 'ring-2 ring-cyan-400 z-10' : 'z-0'
                } ${isDragging && selectedComponent === safeComponent.id ? 'scale-105' : ''}`}
                style={{
                  left: safeComponent.x,
                  top: safeComponent.y,
                  width: BLOCK_WIDTH,
                  height: BLOCK_HEIGHT,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1e293b',
                  border: '2px solid #0ea5e9',
                  borderRadius: 8,
                  boxSizing: 'border-box',
                  padding: 0,
                  margin: 0,
                  overflow: 'visible',
                  zIndex: selectedComponent === safeComponent.id ? 10 : 1,
                  transform: isDragging && selectedComponent === safeComponent.id ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseDown={(e) => handleMouseDown(e, safeComponent.id)}
              >
                {/* Output ports */}
                {safeComponent.outputs.map((port, idx) => {
                  const isHovered = hoveredPort && hoveredPort.blockId === safeComponent.id && hoveredPort.port === port && hoveredPort.type === 'output';
                  return <svg key={port} style={{ position: 'absolute', left: BLOCK_WIDTH - 8, top: ((idx + 1) * BLOCK_HEIGHT) / (safeComponent.outputs.length + 1) - 8, zIndex: 2 }} width={16} height={16}>
                    <circle cx={8} cy={8} r={8} fill={isHovered ? '#fbbf24' : '#0ea5e9'} stroke="#fff" strokeWidth={2}
                      onMouseEnter={() => setHoveredPort({ blockId: safeComponent.id, port, type: 'output' })}
                      onMouseLeave={() => setHoveredPort(null)}
                      onClick={e => handlePortClick(safeComponent.id, port, 'output', e)}
                      style={{ cursor: 'pointer' }}
                    />
                  </svg>;
                })}
                {/* Input ports */}
                {safeComponent.inputs.map((port, idx) => {
                  const isHovered = hoveredPort && hoveredPort.blockId === safeComponent.id && hoveredPort.port === port && hoveredPort.type === 'input';
                  return <svg key={port} style={{ position: 'absolute', left: -8, top: ((idx + 1) * BLOCK_HEIGHT) / (safeComponent.inputs.length + 1) - 8, zIndex: 2 }} width={16} height={16}>
                    <circle cx={8} cy={8} r={8} fill={isHovered ? '#fbbf24' : '#0ea5e9'} stroke="#fff" strokeWidth={2}
                      onMouseEnter={() => setHoveredPort({ blockId: safeComponent.id, port, type: 'input' })}
                      onMouseLeave={() => setHoveredPort(null)}
                      onClick={e => handlePortClick(safeComponent.id, port, 'input', e)}
                      style={{ cursor: 'pointer' }}
                    />
                  </svg>;
                })}
                {/* Block content: icon and label centered */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', height: '100%' }}>
                  {getComponentSymbol(safeComponent.type)}
                  <div className="text-xs text-slate-400 mt-1 text-center">
                    {safeComponent.type.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Instructions */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <CircuitBoard className="h-12 w-12 mx-auto mb-2" />
                <div className="text-sm">Click anywhere to place chip components</div>
                <div className="text-xs">Drag components to move them</div>
                <div className="text-xs mt-2">Use the component library on the right</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-slate-800 border-t border-slate-700 p-2 flex items-center gap-2">
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <MousePointer className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <Move className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <Zap className="h-4 w-4" />
          Power Analysis
        </Button>
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <Eye className="h-4 w-4" />
          Signal Integrity
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="text-xs text-slate-400">
          Components: {components.length} | Wires: {wires.length}
        </div>
      </div>
    </div>
  );
} 

// HDL Design Tab with General Chip Design Code
function HDLDesignTab() {
  const design = useHDLDesignStore((state) => state.design);
  const verilogCode = design?.verilog || "// No HDL generated for this schematic yet.";

  return (
    <div className="p-4 h-full overflow-auto bg-slate-900">
      <h3 className="text-lg font-semibold mb-2 text-cyan-400">Generated HDL (Verilog)</h3>
      <pre className="bg-slate-800 p-4 rounded text-xs overflow-x-auto">{verilogCode}</pre>
    </div>
  );
} 

// Component Library for General Chip Design
function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);

  const chipComponents: Component[] = [
    // Transistors
    {
      id: 'nmos_001',
      name: 'NMOS Transistor',
      type: 'nmos',
      description: 'N-channel MOSFET for digital logic',
      creator: 'TSMC',
      verified: true,
      usage: '15.2k',
      likes: 892,
      icon: <Cpu className="h-4 w-4" />,
      category: 'Transistors',
      pins: ['Source', 'Drain', 'Gate', 'Bulk'],
      power: '0.1mW',
      area: '0.5μm²'
    },
    {
      id: 'pmos_001',
      name: 'PMOS Transistor',
      type: 'pmos',
      description: 'P-channel MOSFET for complementary logic',
      creator: 'TSMC',
      verified: true,
      usage: '12.8k',
      likes: 756,
      icon: <Cpu className="h-4 w-4" />,
      category: 'Transistors',
      pins: ['Source', 'Drain', 'Gate', 'Bulk'],
      power: '0.1mW',
      area: '1.0μm²'
    },
    {
      id: 'bjt_001',
      name: 'BJT Transistor',
      type: 'bjt',
      description: 'Bipolar Junction Transistor for analog circuits',
      creator: 'TSMC',
      verified: true,
      usage: '3.4k',
      likes: 234,
      icon: <Cpu className="h-4 w-4" />,
      category: 'Transistors',
      pins: ['Emitter', 'Base', 'Collector'],
      power: '1.0mW',
      area: '2.0μm²'
    },
    // Logic Gates
    {
      id: 'nand_001',
      name: 'NAND Gate',
      type: 'nand',
      description: 'Universal logic gate (NOT-AND)',
      creator: 'TSMC',
      verified: true,
      usage: '25.6k',
      likes: 1245,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.2mW',
      area: '1.5μm²'
    },
    {
      id: 'nor_001',
      name: 'NOR Gate',
      type: 'nor',
      description: 'Universal logic gate (NOT-OR)',
      creator: 'TSMC',
      verified: true,
      usage: '18.9k',
      likes: 987,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.2mW',
      area: '1.5μm²'
    },
    {
      id: 'and_001',
      name: 'AND Gate',
      type: 'and',
      description: 'Logical AND operation',
      creator: 'TSMC',
      verified: true,
      usage: '22.1k',
      likes: 1102,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.15mW',
      area: '1.2μm²'
    },
    {
      id: 'or_001',
      name: 'OR Gate',
      type: 'or',
      description: 'Logical OR operation',
      creator: 'TSMC',
      verified: true,
      usage: '19.7k',
      likes: 876,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.15mW',
      area: '1.2μm²'
    },
    {
      id: 'xor_001',
      name: 'XOR Gate',
      type: 'xor',
      description: 'Exclusive OR operation',
      creator: 'TSMC',
      verified: true,
      usage: '8.3k',
      likes: 445,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.3mW',
      area: '2.5μm²'
    },
    {
      id: 'not_001',
      name: 'NOT Gate',
      type: 'not',
      description: 'Logical inversion',
      creator: 'TSMC',
      verified: true,
      usage: '31.2k',
      likes: 1567,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'Y'],
      power: '0.1mW',
      area: '0.8μm²'
    },
    // Memory Elements
    {
      id: 'dff_001',
      name: 'D-Flip Flop',
      type: 'dff',
      description: 'Data flip-flop with clock',
      creator: 'TSMC',
      verified: true,
      usage: '14.7k',
      likes: 678,
      icon: <Clock className="h-4 w-4" />, // Use clock icon for flip-flops
      category: 'Memory Elements',
      pins: ['D', 'CLK', 'Q', 'Q_bar'],
      power: '0.5mW',
      area: '3.0μm²'
    },
    {
      id: 'tff_001',
      name: 'T-Flip Flop',
      type: 'tff',
      description: 'Toggle flip-flop with clock',
      creator: 'TSMC',
      verified: true,
      usage: '8.2k',
      likes: 412,
      icon: <RotateCw className="h-4 w-4" />, // Toggle icon
      category: 'Memory Elements',
      pins: ['T', 'CLK', 'Q', 'Q_bar'],
      power: '0.5mW',
      area: '3.0μm²'
    },
    {
      id: 'jkff_001',
      name: 'JK-Flip Flop',
      type: 'jkff',
      description: 'JK flip-flop with clock',
      creator: 'TSMC',
      verified: true,
      usage: '6.1k',
      likes: 301,
      icon: <Cpu className="h-4 w-4" />, // Use CPU icon for JK
      category: 'Memory Elements',
      pins: ['J', 'K', 'CLK', 'Q', 'Q_bar'],
      power: '0.5mW',
      area: '3.0μm²'
    },
    {
      id: 'srff_001',
      name: 'SR-Flip Flop',
      type: 'srff',
      description: 'Set-Reset flip-flop with clock',
      creator: 'TSMC',
      verified: true,
      usage: '5.4k',
      likes: 250,
      icon: <Cpu className="h-4 w-4" />, // Use CPU icon for SR
      category: 'Memory Elements',
      pins: ['S', 'R', 'CLK', 'Q', 'Q_bar'],
      power: '0.5mW',
      area: '3.0μm²'
    },
    {
      id: 'dlatch_001',
      name: 'D Latch',
      type: 'dlatch',
      description: 'Transparent D latch',
      creator: 'TSMC',
      verified: true,
      usage: '4.2k',
      likes: 200,
      icon: <Square className="h-4 w-4" />, // Use square icon for latches
      category: 'Memory Elements',
      pins: ['D', 'EN', 'Q', 'Q_bar'],
      power: '0.3mW',
      area: '2.5μm²'
    },
    {
      id: 'srlatch_001',
      name: 'SR Latch',
      type: 'srlatch',
      description: 'Set-Reset latch',
      creator: 'TSMC',
      verified: true,
      usage: '3.8k',
      likes: 180,
      icon: <Square className="h-4 w-4" />, // Use square icon for latches
      category: 'Memory Elements',
      pins: ['S', 'R', 'Q', 'Q_bar'],
      power: '0.3mW',
      area: '2.5μm²'
    },
    {
      id: 'register_001',
      name: 'Register (8-bit)',
      type: 'register',
      description: '8-bit parallel register',
      creator: 'TSMC',
      verified: true,
      usage: '10.5k',
      likes: 500,
      icon: <Layers className="h-4 w-4" />, // Use layers icon for register
      category: 'Memory Elements',
      pins: ['D[7:0]', 'CLK', 'Q[7:0]'],
      power: '1.0mW',
      area: '8.0μm²'
    },
    {
      id: 'counter_001',
      name: 'Counter (4-bit)',
      type: 'counter',
      description: '4-bit synchronous counter',
      creator: 'TSMC',
      verified: true,
      usage: '7.3k',
      likes: 350,
      icon: <RotateCcw className="h-4 w-4" />, // Use rotate icon for counter
      category: 'Memory Elements',
      pins: ['CLK', 'RST', 'Q[3:0]'],
      power: '0.8mW',
      area: '4.0μm²'
    },
    {
      id: 'sram_001',
      name: 'SRAM Cell',
      type: 'sram',
      description: '6T Static RAM cell',
      creator: 'TSMC',
      verified: true,
      usage: '9.2k',
      likes: 523,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Memory Elements',
      pins: ['BL', 'BL_bar', 'WL', 'VDD', 'GND'],
      power: '0.1μW',
      area: '1.2μm²'
    },
    {
      id: 'rom_001',
      name: 'ROM Cell',
      type: 'rom',
      description: 'Read-Only Memory cell',
      creator: 'TSMC',
      verified: true,
      usage: '5.8k',
      likes: 312,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Memory Elements',
      pins: ['BL', 'WL', 'VDD'],
      power: '0.05μW',
      area: '0.8μm²'
    },
    // Arithmetic Units
    {
      id: 'adder_001',
      name: 'Full Adder',
      type: 'adder',
      description: '1-bit full adder with carry',
      creator: 'TSMC',
      verified: true,
      usage: '11.3k',
      likes: 567,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Arithmetic Units',
      pins: ['A', 'B', 'Cin', 'Sum', 'Cout'],
      power: '0.4mW',
      area: '2.8μm²'
    },
    {
      id: 'multiplier_001',
      name: 'Multiplier',
      type: 'multiplier',
      description: '8x8 bit multiplier',
      creator: 'TSMC',
      verified: true,
      usage: '6.7k',
      likes: 389,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Arithmetic Units',
      pins: ['A[7:0]', 'B[7:0]', 'Result[15:0]'],
      power: '2.5mW',
      area: '45.0μm²'
    },
    {
      id: 'alu_001',
      name: 'ALU',
      type: 'alu',
      description: '8-bit Arithmetic Logic Unit',
      creator: 'TSMC',
      verified: true,
      usage: '8.9k',
      likes: 456,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Arithmetic Units',
      pins: ['A[7:0]', 'B[7:0]', 'Op[2:0]', 'Result[7:0]', 'Flags'],
      power: '1.8mW',
      area: '25.0μm²'
    },
    // Interface Circuits
    {
      id: 'io_buffer_001',
      name: 'I/O Buffer',
      type: 'io_buffer',
      description: 'Input/Output buffer with ESD protection',
      creator: 'TSMC',
      verified: true,
      usage: '7.4k',
      likes: 298,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Interface Circuits',
      pins: ['Pad', 'Core', 'VDD', 'GND'],
      power: '0.8mW',
      area: '8.0μm²'
    },
    {
      id: 'level_shifter_001',
      name: 'Level Shifter',
      type: 'level_shifter',
      description: 'Voltage level converter',
      creator: 'TSMC',
      verified: true,
      usage: '4.2k',
      likes: 234,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Interface Circuits',
      pins: ['In', 'Out', 'VDD_L', 'VDD_H'],
      power: '0.3mW',
      area: '3.5μm²'
    },
    // Analog Circuits
    {
      id: 'opamp_001',
      name: 'Op-Amp',
      type: 'opamp',
      description: 'Operational amplifier',
      creator: 'TSMC',
      verified: true,
      usage: '3.8k',
      likes: 187,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['V+', 'V-', 'Vout', 'VDD', 'GND'],
      power: '1.2mW',
      area: '15.0μm²'
    },
    {
      id: 'adc_001',
      name: 'ADC',
      type: 'adc',
      description: '8-bit Analog-to-Digital Converter',
      creator: 'TSMC',
      verified: true,
      usage: '2.1k',
      likes: 145,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['Vin', 'Clk', 'Dout[7:0]', 'VDD', 'GND'],
      power: '3.5mW',
      area: '35.0μm²'
    },
    {
      id: 'dac_001',
      name: 'DAC',
      type: 'dac',
      description: '8-bit Digital-to-Analog Converter',
      creator: 'TSMC',
      verified: true,
      usage: '1.9k',
      likes: 123,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['Din[7:0]', 'Clk', 'Vout', 'VDD', 'GND'],
      power: '2.8mW',
      area: '28.0μm²'
    },
    {
      id: 'pll_001',
      name: 'PLL',
      type: 'pll',
      description: 'Phase-Locked Loop',
      creator: 'TSMC',
      verified: true,
      usage: '1.5k',
      likes: 98,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['Clk_in', 'Clk_out', 'Lock', 'VDD', 'GND'],
      power: '5.0mW',
      area: '50.0μm²'
    },
    // Power Management
    {
      id: 'vreg_001',
      name: 'Voltage Regulator',
      type: 'vreg',
      description: 'Low-dropout voltage regulator',
      creator: 'TSMC',
      verified: true,
      usage: '6.3k',
      likes: 345,
      icon: <Battery className="h-4 w-4" />,
      category: 'Power Management',
      pins: ['Vin', 'Vout', 'Enable', 'GND'],
      power: '0.5mW',
      area: '12.0μm²'
    },
    {
      id: 'power_switch_001',
      name: 'Power Switch',
      type: 'power_switch',
      description: 'Power gating switch',
      creator: 'TSMC',
      verified: true,
      usage: '4.7k',
      likes: 267,
      icon: <Battery className="h-4 w-4" />,
      category: 'Power Management',
      pins: ['VDD_in', 'VDD_out', 'Enable', 'GND'],
      power: '0.1mW',
      area: '5.0μm²'
    },
    // Communication
    {
      id: 'uart_001',
      name: 'UART',
      type: 'uart',
      description: 'Universal Asynchronous Receiver/Transmitter',
      creator: 'TSMC',
      verified: true,
      usage: '3.2k',
      likes: 189,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Communication',
      pins: ['Tx', 'Rx', 'Clk', 'Data[7:0]'],
      power: '1.5mW',
      area: '18.0μm²'
    },
    {
      id: 'spi_001',
      name: 'SPI Interface',
      type: 'spi',
      description: 'Serial Peripheral Interface',
      creator: 'TSMC',
      verified: true,
      usage: '2.8k',
      likes: 156,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Communication',
      pins: ['MOSI', 'MISO', 'SCK', 'CS', 'Data[7:0]'],
      power: '1.2mW',
      area: '15.0μm²'
    },
    {
      id: 'i2c_001',
      name: 'I2C Interface',
      type: 'i2c',
      description: 'Inter-Integrated Circuit',
      creator: 'TSMC',
      verified: true,
      usage: '2.4k',
      likes: 134,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Communication',
      pins: ['SDA', 'SCL', 'Data[7:0]', 'Addr[6:0]'],
      power: '0.8mW',
      area: '12.0μm²'
    }
  ];

  const categories = ['all', 'Transistors', 'Logic Gates', 'Memory Elements', 'Arithmetic Units', 'Interface Circuits', 'Analog Circuits', 'Power Management', 'Communication'];

  const filteredComponents = chipComponents.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    setDraggedComponent(component);
    e.dataTransfer.setData('text/plain', component.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
  };

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-cyan-400" />
          <h2 className="font-semibold text-slate-200">Chip Component Library</h2>
        </div>
        <Input
          placeholder="Search chip components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-700 border-slate-600 text-slate-100"
        />
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={`text-xs ${
                selectedCategory === category 
                  ? 'bg-cyan-600 text-white' 
                  : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-3">
          {filteredComponents.map((component) => (
            <Card 
              key={component.id} 
              className={`bg-slate-700 border-slate-600 hover:bg-slate-600 cursor-grab active:cursor-grabbing transition-all ${
                draggedComponent?.id === component.id ? 'ring-2 ring-cyan-400 scale-105' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-600 rounded-lg">
                    {component.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-200 truncate">
                        {component.name}
                      </h3>
                      {component.verified && (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                      {component.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>by {component.creator}</span>
                      <div className="flex items-center gap-2">
                        <span>{component.usage}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{component.likes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Power: {component.power}</span>
                      <span>Area: {component.area}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 

function Connector3D({ x, y, label }) {
  return (
    <group>
      <mesh position={[x, y, 24]} castShadow>
        <boxGeometry args={[30, 30, 40]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <Html position={[x, y, 48]} center>
        <div style={{
          color: '#222',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: 12,
          fontWeight: 600
        }}>{label}</div>
      </Html>
    </group>
  );
}

function SMD3D({ x, y, label }) {
  return (
    <group>
      <mesh position={[x, y, 12]} castShadow>
        <boxGeometry args={[20, 10, 8]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <Html position={[x, y, 18]} center>
        <div style={{
          color: '#fff',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: 10,
          fontWeight: 600
        }}>{label}</div>
      </Html>
    </group>
  );
}

function Wire3D({ from, to, components }) {
  const fromComp = components.find(c => c.id === from.nodeId);
  const toComp = components.find(c => c.id === to.nodeId);
  if (!fromComp || !toComp) return null;
  const ref = useRef<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.setFromPoints([
        new THREE.Vector3(fromComp.x, fromComp.y, 12),
        new THREE.Vector3(toComp.x, toComp.y, 12)
      ]);
    }
  }, [fromComp, toComp]);
  return (
    <line>
      <bufferGeometry ref={ref} />
      <lineBasicMaterial color="#d97706" linewidth={3} />
    </line>
  );
}

function ModelDesignTab() {
  const design = useHDLDesignStore((state) => state.design);
  // Fallback dummy schematic if design is empty
  const fallback = {
    components: [
      { id: "conn1", type: "connector", label: "J1", x: -120, y: 0 },
      { id: "smd1", type: "smd", label: "U1", x: 40, y: 0 }
    ],
    wires: [
      { from: { nodeId: "conn1" }, to: { nodeId: "smd1" } }
    ]
  };
  const schematic = (design && design.components && design.components.length > 0) ? design : fallback;

  return (
    <div className="h-full w-full bg-slate-900">
      <Canvas
        camera={{ position: [0, 0, 300], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[100, 200, 400]} intensity={0.7} castShadow />
        {/* 3D Grid */}
        <Grid
          args={[1000, 1000]}
          cellColor="#222"
          sectionColor="#38bdf8"
          cellThickness={1}
          sectionThickness={2}
          fadeDistance={800}
          fadeStrength={1}
          infiniteGrid
        />
        {/* Board */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[300, 100, 6]} />
          <meshStandardMaterial color="#15803d" opacity={0.95} transparent />
        </mesh>
        {/* Silkscreen Text */}
        <Text position={[-140, 45, 8]} fontSize={10} color="#fff" anchorX="left" anchorY="top">GND</Text>
        <Text position={[140, 45, 8]} fontSize={10} color="#fff" anchorX="right" anchorY="top">3V3</Text>
        {/* Components */}
        {schematic.components.map((comp) => {
          if (comp.type === "connector") {
            return <Connector3D key={comp.id} x={comp.x} y={comp.y} label={comp.label} />;
          }
          if (comp.type === "smd" || comp.type === "ic" || comp.type === "dff" || comp.type === "and") {
            return <SMD3D key={comp.id} x={comp.x} y={comp.y} label={comp.label} />;
          }
          // fallback: generic block
          return <SMD3D key={comp.id} x={comp.x} y={comp.y} label={comp.label || comp.type} />;
        })}
        {/* Wires */}
        {schematic.wires && schematic.wires.map((wire, idx) => {
          const from = schematic.components.find(c => c.id === (wire.from?.nodeId));
          const to = schematic.components.find(c => c.id === (wire.to?.nodeId));
          if (!from || !to) return null;
          return <Wire3D key={idx} from={from} to={to} components={schematic.components} />;
        })}
        <OrbitControls />
      </Canvas>
    </div>
  );
} 

// Main Workspace Component
export default function ChipForgeWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('schematic');
  const [activeSidebarTab, setActiveSidebarTab] = useState('components');
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to ChipForge! I can help you design your chip. What would you like to start with?',
      timestamp: new Date(),
      suggestions: [
        'Create a logic gate schematic',
        'Generate Verilog for ALU',
        'Design 3D chip layout'
      ]
    }
  ]);

  const setDesign = useHDLDesignStore((state) => state.setDesign);

  // Handle URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    const tool = searchParams.get('tool');
    
    if (tab) {
      setActiveTab(tab);
    }
    if (tool) {
      setActiveSidebarTab(tool);
    }
  }, [searchParams]);

  const handleSendMessage = (message: string) => {
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're working on chip design. For "${message}", I recommend starting with the logic gates in the schematic tab, then generating the corresponding Verilog code.`,
        timestamp: new Date(),
        suggestions: [
          'Add memory elements to schematic',
          'Generate testbench for ALU',
          'Optimize power consumption'
        ]
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleApplySuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleDemoSchematic = () => {
    setDesign({
      moduleName: "counter4",
      description: "4-bit counter demo schematic",
      io: [
        { name: "clk", direction: "input", width: 1 },
        { name: "en", direction: "input", width: 1 },
        { name: "rst", direction: "input", width: 1 },
        { name: "q", direction: "output", width: 4 }
      ],
      verilog: "",
      components: [
        { id: "clk_in", type: "input_port", label: "clk", x: 50, y: 100, inputs: [], outputs: ["IN"] },
        { id: "en_in", type: "input_port", label: "en", x: 50, y: 200, inputs: [], outputs: ["IN"] },
        { id: "rst_in", type: "input_port", label: "rst", x: 50, y: 300, inputs: [], outputs: ["IN"] },
        { id: "dff0", type: "dff", label: "DFF0", x: 200, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "dff1", type: "dff", label: "DFF1", x: 300, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "dff2", type: "dff", label: "DFF2", x: 400, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "dff3", type: "dff", label: "DFF3", x: 500, y: 100, inputs: ["D", "CLK"], outputs: ["Q"] },
        { id: "and0", type: "and_gate", label: "AND0", x: 150, y: 200, inputs: ["A", "B"], outputs: ["Y"] },
        { id: "or0", type: "or_gate", label: "OR0", x: 150, y: 300, inputs: ["A", "B"], outputs: ["Y"] },
        { id: "q_out", type: "output_port", label: "q", x: 600, y: 100, inputs: ["OUT"], outputs: [] }
      ],
      wires: [
        { from: { nodeId: "clk_in", port: "IN" }, to: { nodeId: "dff0", port: "CLK" } },
        { from: { nodeId: "dff0", port: "Q" }, to: { nodeId: "dff1", port: "D" } },
        { from: { nodeId: "dff1", port: "Q" }, to: { nodeId: "dff2", port: "D" } },
        { from: { nodeId: "dff2", port: "Q" }, to: { nodeId: "dff3", port: "D" } },
        { from: { nodeId: "dff3", port: "Q" }, to: { nodeId: "q_out", port: "OUT" } },
        { from: { nodeId: "en_in", port: "IN" }, to: { nodeId: "and0", port: "A" } },
        { from: { nodeId: "clk_in", port: "IN" }, to: { nodeId: "and0", port: "B" } },
        { from: { nodeId: "and0", port: "Y" }, to: { nodeId: "dff0", port: "D" } },
        { from: { nodeId: "rst_in", port: "IN" }, to: { nodeId: "or0", port: "A" } },
        { from: { nodeId: "dff3", port: "Q" }, to: { nodeId: "or0", port: "B" } },
        { from: { nodeId: "or0", port: "Y" }, to: { nodeId: "dff0", port: "CLK" } }
      ]
    });
  };

  return (
    <>
      <TopNav />
      <div className="h-[calc(100vh-56px)] bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
        {/* Main Workspace Area */}
        <div className="flex-1 flex min-h-0">
          {/* Left Side - AI Copilot */}
          <ErrorBoundary>
            <AICopilot 
              messages={aiMessages}
              onSendMessage={handleSendMessage}
              onApplySuggestion={handleApplySuggestion}
            />
          </ErrorBoundary>
          
          {/* Center - Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="bg-slate-900 border-b border-slate-700 p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger 
                    value="schematic" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                  >
                    <CircuitBoard className="h-4 w-4 mr-2" />
                    Schematic Design
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hdl" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    HDL Code
                  </TabsTrigger>
                  <TabsTrigger 
                    value="model" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                  >
                    <Box className="h-4 w-4 mr-2" />
                    3D Model
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
              {activeTab === 'schematic' && (
                <div className="p-4">
                  <Button onClick={handleDemoSchematic} className="mb-2">Load 4-bit Counter Demo</Button>
                  <ErrorBoundary>
                    <SchematicDesignTab />
                  </ErrorBoundary>
                </div>
              )}
              {activeTab === 'hdl' && (
                <ErrorBoundary>
                  <HDLDesignTab />
                </ErrorBoundary>
              )}
              {activeTab === 'model' && (
                <ErrorBoundary>
                  <ModelDesignTab />
                </ErrorBoundary>
              )}
            </div>
          </div>

          {/* Right Side - Component Library */}
          <ErrorBoundary>
            <ComponentLibrary />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}