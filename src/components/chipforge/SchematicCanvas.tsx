import React, { useRef, useEffect, useState } from "react";
import { useHDLDesignStore, HDLComponent, HDLWire } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  CircuitBoard, 
  Clock, 
  Zap, 
  Calculator, 
  MemoryStick,
  Lightbulb,
  Play
} from "lucide-react";

// Use the existing Component interface from the HDL tab
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
const getComponentRecommendations = (chipType: string, allComponents: Component[]): Component[] => {
  const recommendations: { [key: string]: Component['type'][] } = {
    "counter": ["dff", "and", "or", "not"],
    "alu": ["alu", "dff", "adder", "and", "or", "xor"],
    "memory": ["dff", "sram", "rom", "and"],
    "controller": ["dff", "and", "or", "register", "counter"],
    "multiplier": ["dff", "and", "multiplier", "adder"],
    "divider": ["dff", "adder", "register", "counter"]
  };
  
  const defaultComponents: Component['type'][] = ["dff", "and", "or", "not"];
  const selectedTypes = recommendations[chipType.toLowerCase()] || defaultComponents;
  
  // Return actual components from the existing library
  return allComponents.filter(comp => selectedTypes.includes(comp.type));
};

// Use the existing component library from the HDL tab
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
    icon: <Clock className="h-4 w-4" />,
    category: 'Memory Elements',
    pins: ['D', 'CLK', 'Q', 'Q_bar'],
    power: '0.5mW',
    area: '3.0μm²'
  },
  {
    id: 'tff_001',
    name: 'T-Flip Flop',
    type: 'tff',
    description: 'Toggle flip-flop',
    creator: 'TSMC',
    verified: true,
    usage: '8.9k',
    likes: 445,
    icon: <Clock className="h-4 w-4" />,
    category: 'Memory Elements',
    pins: ['T', 'CLK', 'Q', 'Q_bar'],
    power: '0.4mW',
    area: '2.8μm²'
  }
];



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
  } = useHDLDesignStore();
  
  const [dragging, setDragging] = useState<null | { id: string; offsetX: number; offsetY: number }>(null);
  const [dragPos, setDragPos] = useState<null | { x: number; y: number }>(null);
  const [hoveredPort, setHoveredPort] = useState<null | { nodeId: string; port: string; isInput: boolean }>(null);
  const [wiring, setWiring] = useState<null | { nodeId: string; port: string; isInput: boolean }>(null);
  const [selected, setSelected] = useState<{ type: 'component' | 'wire'; id: string; wire?: HDLWire } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);
  

  
  // Guided mode state
  const [guidedData, setGuidedData] = useState<{
    chipType: string;
    selectedComponents: string[];
    currentStep: number;
    recommendations: Component[];
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
      const recommendations = getComponentRecommendations(value, chipComponents);
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
  const handleAddComponent = (component: Component) => {
    console.log('handleAddComponent called with:', component);
    console.log('Current design state:', design);
    
    if (!design) {
      console.log('No design state, initializing...');
      // Initialize design if it doesn't exist
      const initialDesign = {
        moduleName: 'schematic_design',
        description: 'Schematic design created in canvas',
        io: [],
        verilog: '',
        components: [],
        wires: []
      };
      setDesign(initialDesign);
    }
    
    const id = `${component.type}-${Date.now()}`;
    const newComponent: HDLComponent = {
      id,
      type: component.type,
      label: component.name,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      inputs: component.pins.slice(0, -1),
      outputs: component.pins.slice(-1)
    };
    
    console.log('Creating new component:', newComponent);
    addComponent(newComponent);
    pushHistory();
    
    console.log('Component added, new design state:', design);
    
    // Complete guided step if active
    if (guidedMode.isActive) {
      completeGuidedStep(guidedData.currentStep);
      setGuidedData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      setGuidedStep(guidedData.currentStep + 1);
    }
  };

  // Add component from guided recommendations
  const handleAddGuidedComponent = (component: Component) => {
    if (!design) return;

    const id = `${component.type}-${Date.now()}`;
      const newComponent: HDLComponent = {
      id,
      type: component.type,
      label: component.name,
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      inputs: component.pins.slice(0, -1),
      outputs: component.pins.slice(-1)
      };

      addComponent(newComponent);
      pushHistory();

    // Complete guided step
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

  // Draw everything
  useEffect(() => {
    if (!design || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
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
  }, [design, dragging, dragPos, hoveredPort, wiring, selected]);

  // Helper function for port positioning
  function getPortPosition(comp: HDLComponent, port: string, isInput: boolean, idx: number, total: number) {
    const y = comp.y + ((idx + 1) * BLOCK_HEIGHT) / (total + 1);
    const x = isInput ? comp.x : comp.x + BLOCK_WIDTH;
    return { x, y };
  }

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
                        {comp.name}
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
        
        {/* Quick Add Components */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Quick Add</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent({
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
              })}
              className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            >
              <CircuitBoard className="h-4 w-4 mr-2" />
              AND Gate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent({
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
              })}
              className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            >
              <CircuitBoard className="h-4 w-4 mr-2" />
              OR Gate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent({
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
              })}
              className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            >
              <CircuitBoard className="h-4 w-4 mr-2" />
              NOT Gate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent({
                id: 'dff_001',
                name: 'D-Flip Flop',
                type: 'dff',
                description: 'Data flip-flop with clock',
                creator: 'TSMC',
                verified: true,
                usage: '14.7k',
                likes: 678,
                icon: <Clock className="h-4 w-4" />,
                category: 'Memory Elements',
                pins: ['D', 'CLK', 'Q', 'Q_bar'],
                power: '0.5mW',
                area: '3.0μm²'
              })}
              className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            >
              <Clock className="h-4 w-4 mr-2" />
              D-Flip Flop
            </Button>
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
          width={600}
          height={500}
          className="border border-slate-700 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          id="canvas"
        />
        
        {/* Canvas Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-slate-100"
          >
            Reset View
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
          {design?.components.length || 0} components | {design?.wires.length || 0} wires
        </div>
      </div>
    </div>
  );
}