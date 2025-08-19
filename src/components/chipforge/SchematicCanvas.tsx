import React, { useRef, useEffect, useState, useCallback } from "react";
import { useHDLDesignStore, HDLComponent, HDLWire } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Cpu, 
  CircuitBoard, 
  Clock, 
  Zap, 
  Calculator, 
  MemoryStick,
  Lightbulb,
  Play,
  Plus,
  Trash2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye
} from "lucide-react";

// Import the component library
import componentLibrary from "@/lib/component.library.json";
import { useNavigate } from 'react-router-dom';

// Component interface matching the library
interface ComponentBlock {
  id: string;
  type: string;
  label: string;
  ports: { name: string; width: number }[];
  description: string;
  verilog: string;
  category: string;
  symbol: string;
  hdl: string;
}

// Guided mode steps with actual circuit building guidance
const GUIDED_STEPS = [
  {
    id: 1,
    title: "Welcome to ChipForge!",
    description: "Let's build your first circuit. What type of chip are you designing?",
    action: "input",
    inputType: "chipType",
    placeholder: "e.g., 4-bit counter, ALU, memory controller...",
    hint: "This helps us recommend the right components and guide your design."
  },
  {
    id: 2,
    title: "Component Selection",
    description: "Based on your {chipType}, here are the recommended components:",
    action: "recommend",
    components: [] // Will be populated based on chip type
  },
  {
    id: 3,
    title: "Place Your First Component",
    description: "Drag and drop a {componentName} onto the canvas. This will be your starting point.",
    action: "place",
    targetComponent: "" // Will be set based on selection
  },
  {
    id: 4,
    title: "Connect Components",
    description: "Now connect the {componentName} to other components. Click on ports to create wires.",
    action: "connect",
    targetComponent: ""
  },
  {
    id: 5,
    title: "Add Power and Clock",
    description: "Every circuit needs power and timing. Add VDD, GND, and clock connections.",
    action: "power",
    targetComponent: ""
  },
  {
    id: 6,
    title: "Validate Connections",
    description: "Let's check if your circuit is properly connected and has no floating inputs.",
    action: "validate",
    targetComponent: ""
  },
  {
    id: 7,
    title: "Generate HDL & Test",
    description: "Great! Now let's generate the Verilog code and create a testbench.",
    action: "generate",
    targetComponent: ""
  }
];

// Component recommendations based on chip type - using existing component types
const getComponentRecommendations = (chipType: string, allComponents: ComponentBlock[]): ComponentBlock[] => {
  const recommendations: { [key: string]: string[] } = {
    "counter": ["dff", "and", "or", "not"],
    "alu": ["alu", "dff", "adder", "and", "or", "xor"],
    "memory": ["dff", "sram", "rom", "register"],
    "processor": ["alu", "dff", "register", "and", "or", "not"],
    "fifo": ["dff", "register", "counter"],
    "uart": ["dff", "register", "counter", "and", "or"],
    "spi": ["dff", "register", "counter", "and", "or"],
    "i2c": ["dff", "register", "and", "or", "not"]
  };
  
  const defaultComponents: string[] = ["dff", "and", "or", "not"];
  const selectedTypes = recommendations[chipType.toLowerCase()] || defaultComponents;
  
  return allComponents.filter(comp => 
    selectedTypes.some(type => comp.label.toLowerCase().includes(type.toLowerCase()))
  );
};

// Component library is imported from @/lib/component.library.json

const GRID_SIZE = 20;
const BLOCK_WIDTH = 120;
const BLOCK_HEIGHT = 80;
const PORT_RADIUS = 8;

export default function SchematicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    design,
    updateComponentPosition,
    addWire,
    addComponent,
    removeComponent,
    removeWire,
    setDesign,
    guidedMode,
    setGuidedMode,
    setGuidedStep,
    completeGuidedStep,
    resetGuidedMode,
    waveform,
    setWaveformSignal,
  } = useHDLDesignStore();
  
  const [dragging, setDragging] = useState<null | { id: string; offsetX: number; offsetY: number }>(null);
  const [dragPos, setDragPos] = useState<null | { x: number; y: number }>(null);
  const [hoveredPort, setHoveredPort] = useState<null | { nodeId: string; port: string; isInput: boolean }>(null);
  const [wiring, setWiring] = useState<null | { nodeId: string; port: string; isInput: boolean }>(null);
  const [selected, setSelected] = useState<{ type: 'component' | 'wire'; id: string; wire?: HDLWire } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1);
  

  
  // Guided mode state
  const [guidedData, setGuidedData] = useState<{
    chipType: string;
    selectedComponents: string[];
    currentStep: number;
    recommendations: ComponentBlock[];
  }>({
    chipType: '',
    selectedComponents: [],
    currentStep: 1,
    recommendations: []
  });

  // Undo/redo helpers
  const pushHistory = () => {
    setHistory(h => [...h, JSON.stringify(design)]);
    setFuture([]);
  };
  
  const undo = () => {
    if (history.length === 0) return;
    setFuture(f => [JSON.stringify(design), ...f]);
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setDesign(JSON.parse(prev));
  };
  
  const redo = () => {
    if (future.length === 0) return;
    setHistory(h => [...h, JSON.stringify(design)]);
    const next = future[0];
    setFuture(f => f.slice(1));
    setDesign(JSON.parse(next));
  };

  // Handle guided mode input
  const handleGuidedInput = (value: string) => {
    if (guidedData.currentStep === 1) {
      const recommendations = getComponentRecommendations(value, componentLibrary);
      setGuidedData(prev => ({
        ...prev,
        chipType: value,
        recommendations,
        currentStep: 2
      }));
      setGuidedStep(2);
    }
  };

  // Handle guided mode component selection
  const handleComponentSelection = (componentId: string) => {
    setGuidedData(prev => ({
      ...prev,
      selectedComponents: [...prev.selectedComponents, componentId],
      currentStep: 3
    }));
    setGuidedStep(3);
  };

  // Add component from library
  const handleAddComponent = (component: ComponentBlock) => {
    console.log('handleAddComponent called with:', component);
    console.log('Current design state:', design);
    
    if (!design) {
      console.log('No design state, initializing...');
      // Initialize design if none exists
      const newDesign = {
        moduleName: 'NewDesign',
        description: 'Design created from component library',
        io: [],
        verilog: '',
        components: [],
        wires: []
      };
      setDesign(newDesign);
    }
    
    const id = `${component.type}-${Date.now()}`;
    const newComponent: HDLComponent = {
      id,
      type: component.type,
      label: component.label,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      inputs: component.ports.slice(0, -1).map(p => p.name),
      outputs: component.ports.slice(-1).map(p => p.name)
    };
    
    addComponent(newComponent);
    pushHistory();
    
    // Complete guided step if active
    if (guidedMode.isActive) {
      completeGuidedStep(guidedData.currentStep);
      setGuidedData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      setGuidedStep(guidedData.currentStep + 1);
    }
    
    console.log('Component added:', newComponent);
  };

  // Add component from guided recommendations
  const handleAddGuidedComponent = (component: ComponentBlock) => {
    if (!design) return;

    const id = `${component.type}-${Date.now()}`;
    const newComponent: HDLComponent = {
      id,
      type: component.type,
      label: component.label,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      inputs: component.ports.slice(0, -1).map(p => p.name),
      outputs: component.ports.slice(-1).map(p => p.name)
    };

    addComponent(newComponent);
    pushHistory();
    
    // Complete guided step if active
    if (guidedMode.isActive) {
      completeGuidedStep(guidedData.currentStep);
      setGuidedData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      setGuidedStep(guidedData.currentStep + 1);
    }
  };

  // Mouse event handlers for drag, wiring, and selection
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!design) return;
    
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Check for block drag or selection
    for (const comp of design.components) {
      if (
        mx >= comp.x &&
        mx <= comp.x + BLOCK_WIDTH &&
        my >= comp.y &&
        my <= comp.y + BLOCK_HEIGHT
      ) {
        setDragging({ id: comp.id, offsetX: mx - comp.x, offsetY: my - comp.y });
        setDragPos({ x: comp.x, y: comp.y });
        setSelected({ type: 'component', id: comp.id });
        return;
      }
    }
    
    // Check for port click (for wiring)
    for (const comp of design.components) {
      comp.inputs.forEach((port, idx) => {
        const { x, y } = getPortPosition(comp, port, true, idx, comp.inputs.length);
        if (Math.hypot(mx - x, my - y) < PORT_RADIUS) {
          if (wiring) {
            if (wiring.nodeId !== comp.id || wiring.port !== port) {
              if (wiring.isInput !== true) {
                addWire({ from: { nodeId: wiring.nodeId, port: wiring.port }, to: { nodeId: comp.id, port } });
                pushHistory();
              }
            }
            setWiring(null);
          } else {
            setWiring({ nodeId: comp.id, port, isInput: true });
          }
        }
      });
      
      comp.outputs.forEach((port, idx) => {
        const { x, y } = getPortPosition(comp, port, false, idx, comp.outputs.length);
        if (Math.hypot(mx - x, my - y) < PORT_RADIUS) {
          if (wiring) {
            if (wiring.nodeId !== comp.id || wiring.port !== port) {
              if (wiring.isInput !== false) {
                addWire({ from: { nodeId: comp.id, port }, to: { nodeId: wiring.nodeId, port: wiring.port } });
                pushHistory();
              }
            }
            setWiring(null);
          } else {
            setWiring({ nodeId: comp.id, port, isInput: false });
          }
        }
      });
    }
    
    setSelected(null);
  };

  // Drag and drop handlers for component library integration
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!design) return;

    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;
      
      // Snap to grid
      const gridX = Math.round(dropX / GRID_SIZE) * GRID_SIZE;
      const gridY = Math.round(dropY / GRID_SIZE) * GRID_SIZE;
      
      const newComponent: HDLComponent = {
        id: `${componentData.type}-${Date.now()}`,
        type: componentData.type,
        label: componentData.label,
        x: gridX,
        y: gridY,
        inputs: componentData.ports.slice(0, -1).map((p: any) => p.name),
        outputs: componentData.ports.slice(-1).map((p: any) => p.name)
      };
      
      addComponent(newComponent);
      pushHistory();
      
      // Complete guided step if active
      if (guidedMode.isActive) {
        completeGuidedStep(guidedData.currentStep);
        setGuidedData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
        setGuidedStep(guidedData.currentStep + 1);
      }
      
      console.log('Component dropped:', newComponent);
    } catch (error) {
      console.error('Failed to parse dropped component data:', error);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!design) return;
    
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    if (dragging) {
      const nx = Math.round((mx - dragging.offsetX) / GRID_SIZE) * GRID_SIZE;
      const ny = Math.round((my - dragging.offsetY) / GRID_SIZE) * GRID_SIZE;
      setDragPos({ x: nx, y: ny });
    } else {
      let found = null;
      for (const comp of design.components) {
        comp.inputs.forEach((port, idx) => {
          const { x, y } = getPortPosition(comp, port, true, idx, comp.inputs.length);
          if (Math.hypot(mx - x, my - y) < PORT_RADIUS) found = { nodeId: comp.id, port, isInput: true };
        });
        comp.outputs.forEach((port, idx) => {
          const { x, y } = getPortPosition(comp, port, false, idx, comp.outputs.length);
          if (Math.hypot(mx - x, my - y) < PORT_RADIUS) found = { nodeId: comp.id, port, isInput: false };
        });
      }
      setHoveredPort(found);
    }
  };

  const handleMouseUp = () => {
    if (dragging && dragPos) {
      updateComponentPosition(dragging.id, dragPos.x, dragPos.y);
    }
    setDragging(null);
    setDragPos(null);
  };

  // Keyboard delete/undo/redo
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selected.type === "component") {
          removeComponent(selected.id);
          pushHistory();
        } else if (selected.type === "wire" && selected.wire) {
          removeWire(selected.wire);
          pushHistory();
        }
        setSelected(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        redo();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Update canvas size to use full available space
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !design) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom transformation
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw grid
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    for (let x = 0; x < ctx.canvas.width; x += GRID_SIZE) {
      ctx.beginPath(); 
      ctx.moveTo(x, 0); 
      ctx.lineTo(x, ctx.canvas.height); 
      ctx.stroke();
    }
    for (let y = 0; y < ctx.canvas.height; y += GRID_SIZE) {
      ctx.beginPath(); 
      ctx.moveTo(0, y); 
      ctx.lineTo(ctx.canvas.width, y); 
      ctx.stroke();
    }
    
    // Draw wires
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    design.wires.forEach((wire) => {
      const fromNode = design.components.find(c => c.id === wire.from.nodeId);
      const toNode = design.components.find(c => c.id === wire.to.nodeId);
      if (fromNode && toNode) {
        const fromIdx = fromNode.outputs.indexOf(wire.from.port);
        const toIdx = toNode.inputs.indexOf(wire.to.port);
        const fromPos = getPortPosition(fromNode, wire.from.port, false, fromIdx, fromNode.outputs.length);
        const toPos = getPortPosition(toNode, wire.to.port, true, toIdx, toNode.inputs.length);
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
        
        // Highlight selected wire
        if (selected && selected.type === 'wire' && selected.wire && selected.wire === wire) {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
        }
      }
    });
    
    // Draw wiring preview
    if (wiring && hoveredPort && wiring.nodeId !== hoveredPort.nodeId) {
      const fromNode = design.components.find(c => c.id === wiring.nodeId);
      if (fromNode) {
        const idx = wiring.isInput ? fromNode.inputs.indexOf(wiring.port) : fromNode.outputs.indexOf(wiring.port);
        const fromPos = getPortPosition(fromNode, wiring.port, wiring.isInput, idx, wiring.isInput ? fromNode.inputs.length : fromNode.outputs.length);
        const toPos = getPortPosition(
          design.components.find(c => c.id === hoveredPort.nodeId)!,
          hoveredPort.port,
          hoveredPort.isInput,
          hoveredPort.isInput ? design.components.find(c => c.id === hoveredPort.nodeId)!.inputs.indexOf(hoveredPort.port) : design.components.find(c => c.id === hoveredPort.nodeId)!.outputs.indexOf(hoveredPort.port),
          hoveredPort.isInput ? design.components.find(c => c.id === hoveredPort.nodeId)!.inputs.length : design.components.find(c => c.id === hoveredPort.nodeId)!.outputs.length
        );
        
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    
    // Draw components
    design.components.forEach((comp) => {
      let drawX = comp.x;
      let drawY = comp.y;
      if (dragging && dragging.id === comp.id && dragPos) {
        drawX = dragPos.x;
        drawY = dragPos.y;
      }
      
      // Component body
      ctx.fillStyle = dragging && dragging.id === comp.id ? "#475569" : 
                     (selected && selected.type === 'component' && selected.id === comp.id ? "#fbbf24" : "#1e293b");
      ctx.fillRect(drawX, drawY, BLOCK_WIDTH, BLOCK_HEIGHT);
      
      // Component border
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX, drawY, BLOCK_WIDTH, BLOCK_HEIGHT);
      
      // Component label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(comp.label, drawX + 10, drawY + 25);
      
      // Draw input ports
      comp.inputs.forEach((port, idx) => {
        const { x, y } = getPortPosition({ ...comp, x: drawX, y: drawY }, port, true, idx, comp.inputs.length);
        ctx.beginPath();
        ctx.arc(x, y, PORT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = hoveredPort && hoveredPort.nodeId === comp.id && hoveredPort.port === port ? "#fbbf24" : "#0ea5e9";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        
        // Port label
        ctx.fillStyle = "#fff";
        ctx.font = "11px monospace";
        ctx.fillText(port, x - 35, y + 4);
      });
      
      // Draw output ports
      comp.outputs.forEach((port, idx) => {
        const { x, y } = getPortPosition({ ...comp, x: drawX, y: drawY }, port, false, idx, comp.outputs.length);
        ctx.beginPath();
        ctx.arc(x, y, PORT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = hoveredPort && hoveredPort.nodeId === comp.id && hoveredPort.port === port ? "#fbbf24" : "#0ea5e9";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        
        // Port label
        ctx.fillStyle = "#fff";
        ctx.font = "11px monospace";
        ctx.fillText(port, x + 12, y + 4);
      });
    });
    ctx.restore();
  }, [design, dragging, dragPos, hoveredPort, wiring, selected, zoom]);

  // Helper function for port positioning
  function getPortPosition(comp: HDLComponent, port: string, isInput: boolean, idx: number, total: number) {
    const y = comp.y + ((idx + 1) * BLOCK_HEIGHT) / (total + 1);
    const x = isInput ? comp.x : comp.x + BLOCK_WIDTH;
    return { x, y };
  }

  const navigate = useNavigate();
  
  // NEW: Navigate to waveform planner
  const goToWaveform = () => {
    navigate('/waveform');
  };

  // NEW: Auto-populate waveform signals from schematic
  const autoPopulateWaveformSignals = () => {
    if (!design || design.components.length === 0) return;
    
    // Generate all signal names from components
    const allSignals = [
      ...design.components.flatMap(c => c.inputs.map(i => `${c.label}.${i}`)),
      ...design.components.flatMap(c => c.outputs.map(o => `${c.label}.${o}`)),
    ];
    
    // Auto-populate waveform with default patterns
    allSignals.forEach(signal => {
      if (!waveform[signal]) {
        let defaultPattern: Record<number, 0 | 1> = {};
        
        // Smart default patterns based on signal names
        if (signal.toLowerCase().includes('clk') || signal.toLowerCase().includes('clock')) {
          // Clock pattern: alternating 0,1
          for (let i = 0; i < 16; i++) {
            defaultPattern[i] = (i % 2) as 0 | 1;
          }
        } else if (signal.toLowerCase().includes('reset') || signal.toLowerCase().includes('rst')) {
          // Reset pattern: 1 at start, 0 after
          for (let i = 0; i < 16; i++) {
            defaultPattern[i] = (i === 0 ? 1 : 0) as 0 | 1;
          }
        } else if (signal.toLowerCase().includes('enable') || signal.toLowerCase().includes('en')) {
          // Enable pattern: 1 for first few cycles
          for (let i = 0; i < 16; i++) {
            defaultPattern[i] = (i < 4 ? 1 : 0) as 0 | 1;
          }
        } else {
          // Default pattern: all 0 for inputs, alternating for outputs
          const isOutput = design.components.some(c => c.outputs.some(o => `${c.label}.${o}` === signal));
          for (let i = 0; i < 16; i++) {
            defaultPattern[i] = isOutput ? (i % 2) as 0 | 1 : 0;
          }
        }
        
        setWaveformSignal(signal, defaultPattern);
      }
    });
  };

  // NEW: Auto-populate signals when components are added
  useEffect(() => {
    if (design && design.components.length > 0) {
      autoPopulateWaveformSignals();
    }
  }, [design?.components.length]);

  return (
    <div className="relative w-full h-[80vh] bg-slate-800 rounded flex">
      {/* Left Sidebar: Component Library & Guided Mode */}
      <div className="w-80 bg-slate-900 border-r border-slate-700 p-4 flex flex-col gap-4">
        {/* Guided Mode Section */}
        {guidedMode.isActive && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Guided Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {guidedData.currentStep === 1 && (
                <div>
                  <Label className="text-slate-200 text-sm">What type of chip are you designing?</Label>
                  <Input
                    placeholder="e.g., 4-bit counter, ALU, memory controller..."
                    value={guidedData.chipType}
                    onChange={(e) => setGuidedData(prev => ({ ...prev, chipType: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                  <Button 
                    onClick={() => handleGuidedInput(guidedData.chipType)}
                    className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled={!guidedData.chipType.trim()}
                  >
                    Continue
                  </Button>
                </div>
              )}
              
              {guidedData.currentStep === 2 && guidedData.recommendations.length > 0 && (
                <div>
                  <Label className="text-slate-200 text-sm">Recommended components for {guidedData.chipType}:</Label>
                  <div className="space-y-2 mt-2">
                    {guidedData.recommendations.map((comp) => (
                      <Button
                        key={comp.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleComponentSelection(comp.id)}
                        className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                      >
                        <CircuitBoard className="h-4 w-4 mr-2" />
                        {comp.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {guidedData.currentStep >= 3 && (
                <div className="text-slate-300 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-4 w-4 text-cyan-400" />
                    Step {guidedData.currentStep} of 7
                  </div>
                  <p>{GUIDED_STEPS[guidedData.currentStep - 1]?.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Component Library */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Component Library</h3>
            <Input
              placeholder="Search components..."
              className="bg-slate-700 border-slate-600 text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Component Categories */}
          <Tabs defaultValue="logic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="logic" className="text-xs">Logic</TabsTrigger>
              <TabsTrigger value="memory" className="text-xs">Memory</TabsTrigger>
              <TabsTrigger value="arithmetic" className="text-xs">Math</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logic" className="mt-4 space-y-2">
              {componentLibrary
                .filter(comp => comp.category === 'logic' && comp.label.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((component) => (
                  <Button
                    key={component.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddComponent(component)}
                    className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                  >
                    <CircuitBoard className="h-4 w-4 mr-2" />
                    {component.label}
                  </Button>
                ))}
            </TabsContent>
            
            <TabsContent value="memory" className="mt-4 space-y-2">
              {componentLibrary
                .filter(comp => comp.category === 'memory' && comp.label.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((component) => (
                  <Button
                    key={component.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddComponent(component)}
                    className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                  >
                    <MemoryStick className="h-4 w-4 mr-2" />
                    {component.label}
                  </Button>
                ))}
            </TabsContent>
            
            <TabsContent value="arithmetic" className="mt-4 space-y-2">
              {componentLibrary
                .filter(comp => comp.category === 'arithmetic' && comp.label.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((component) => (
                  <Button
                    key={component.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddComponent(component)}
                    className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {component.label}
                  </Button>
                ))}
            </TabsContent>
          </Tabs>

          {/* Quick Add Buttons for Common Components */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Add</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent(componentLibrary.find(c => c.type === 'logic' && c.label.includes('AND'))!)}
                className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
              >
                <CircuitBoard className="h-4 w-4 mr-2" />
                AND Gate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent(componentLibrary.find(c => c.type === 'logic' && c.label.includes('OR'))!)}
                className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
              >
                <CircuitBoard className="h-4 w-4 mr-2" />
                OR Gate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent(componentLibrary.find(c => c.type === 'logic' && c.label.includes('NOT'))!)}
                className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
              >
                <CircuitBoard className="h-4 w-4 mr-2" />
                NOT Gate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddComponent(componentLibrary.find(c => c.type === 'memory' && c.label.includes('D Flip-Flop'))!)}
                className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
              >
                <Clock className="h-4 w-4 mr-2" />
                D-Flip Flop
              </Button>
            </div>
          </div>
        </div>
        
        {/* Guided Mode Toggle */}
        <div className="mt-auto pt-4 border-t border-slate-700">
          <Button 
            variant={guidedMode.isActive ? "default" : "outline"}
            size="sm"
            onClick={() => setGuidedMode(!guidedMode.isActive)}
            className={`w-full mb-2 ${
              guidedMode.isActive 
                ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                : "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
            }`}
          >
            {guidedMode.isActive ? "Disable" : "Enable"} Guided Mode
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={undo} 
              className="flex-1 text-slate-300 hover:text-slate-100 hover:bg-slate-700"
            >
              Undo
            </Button>
            <Button 
              variant="ghost" 
              onClick={redo}
              className="flex-1 text-slate-300 hover:text-slate-100 hover:bg-slate-700"
            >
              Redo
            </Button>
          </div>
        </div>
        </div>
        
      {/* Main Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full border border-slate-700 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onWheel={(e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            setZoom(prev => Math.max(0.1, Math.min(5, prev * zoomFactor)));
          }}
          id="canvas"
        />
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            onClick={() => setZoom(prev => Math.min(5, prev * 1.2))}
            size="sm"
            className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setZoom(prev => Math.max(0.1, prev / 1.2))}
            size="sm"
            className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Canvas Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
          >
            Reset View
          </Button>
          <Button 
            onClick={goToWaveform}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!design || design.components.length === 0}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Waveforms
          </Button>
          <Button 
            onClick={() => {/* TODO: Generate HDL */}}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Generate HDL
          </Button>
        </div>
        
        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 text-sm text-slate-400">
          {design?.components.length || 0} components | {design?.wires.length || 0} wires | Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}