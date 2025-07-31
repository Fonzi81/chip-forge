import React, { useRef, useEffect, useState } from "react";
import { useHDLDesignStore, HDLComponent, HDLWire } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 60;
const PORT_RADIUS = 7;

const COMPONENT_LIBRARY: Omit<HDLComponent, 'id' | 'x' | 'y'>[] = [
  { type: "alu", label: "ALU", inputs: ["a", "b", "op"], outputs: ["result", "carry"] },
  { type: "dff", label: "DFF", inputs: ["d", "clk"], outputs: ["q"] },
  { type: "and", label: "AND", inputs: ["a", "b"], outputs: ["y"] },
  { type: "or", label: "OR", inputs: ["a", "b"], outputs: ["y"] },
  { type: "mux", label: "MUX", inputs: ["a", "b", "sel"], outputs: ["y"] },
  { type: "counter", label: "Counter", inputs: ["clk", "rst", "en"], outputs: ["count"] },
  { type: "decoder", label: "Decoder", inputs: ["in"], outputs: ["out0", "out1", "out2", "out3"] },
];

function getPortPosition(comp: HDLComponent, port: string, isInput: boolean, idx: number, total: number) {
  const y = comp.y + ((idx + 1) * BLOCK_HEIGHT) / (total + 1);
  const x = isInput ? comp.x : comp.x + BLOCK_WIDTH;
  return { x, y };
}

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
  } = useHDLDesignStore();
  const [dragging, setDragging] = useState<null | { id: string; offsetX: number; offsetY: number }>(null);
  const [dragPos, setDragPos] = useState<null | { x: number; y: number }>(null);
  const [hoveredPort, setHoveredPort] = useState<null | { nodeId: string; port: string; isInput: boolean }>(null);
  const [wiring, setWiring] = useState<null | { nodeId: string; port: string; isInput: boolean }>(null);
  const [selected, setSelected] = useState<{ type: 'component' | 'wire'; id: string; wire?: HDLWire } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

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

  // Add component from library
  const handleAddComponent = (libComp: typeof COMPONENT_LIBRARY[number]) => {
    console.log('handleAddComponent called', libComp);
    if (!design) return;
    const id = `${libComp.type}-${Date.now()}`;
    addComponent({
      ...libComp,
      id,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 200,
    });
    pushHistory();
  };

  // Mouse event handlers for drag, wiring, and selection
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handleMouseDown', e.clientX, e.clientY);
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
    // Check for wire selection
    for (const wire of design.wires) {
      const fromNode = design.components.find(c => c.id === wire.from.nodeId);
      const toNode = design.components.find(c => c.id === wire.to.nodeId);
      if (fromNode && toNode) {
        const fromIdx = fromNode.outputs.indexOf(wire.from.port);
        const toIdx = toNode.inputs.indexOf(wire.to.port);
        const fromPos = getPortPosition(fromNode, wire.from.port, false, fromIdx, fromNode.outputs.length);
        const toPos = getPortPosition(toNode, wire.to.port, true, toIdx, toNode.inputs.length);
        // Check if mouse is near the wire
        const dist = Math.abs((toPos.y - fromPos.y) * mx - (toPos.x - fromPos.x) * my + toPos.x * fromPos.y - toPos.y * fromPos.x) /
          Math.hypot(toPos.x - fromPos.x, toPos.y - fromPos.y);
        if (dist < 8) {
          setSelected({ type: 'wire', id: `${wire.from.nodeId}:${wire.from.port}->${wire.to.nodeId}:${wire.to.port}`, wire });
          return;
        }
      }
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
    ctx.strokeStyle = "#222";
    for (let x = 0; x < ctx.canvas.width; x += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.canvas.height); ctx.stroke();
    }
    for (let y = 0; y < ctx.canvas.height; y += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke();
    }
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
    design.components.forEach((comp) => {
      let drawX = comp.x;
      let drawY = comp.y;
      if (dragging && dragging.id === comp.id && dragPos) {
        drawX = dragPos.x;
        drawY = dragPos.y;
      }
      ctx.fillStyle = dragging && dragging.id === comp.id ? "#334155" : (selected && selected.type === 'component' && selected.id === comp.id ? "#fbbf24" : "#1e293b");
      ctx.fillRect(drawX, drawY, BLOCK_WIDTH, BLOCK_HEIGHT);
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX, drawY, BLOCK_WIDTH, BLOCK_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(comp.label, drawX + 10, drawY + 22);
      comp.inputs.forEach((port, idx) => {
        const { x, y } = getPortPosition({ ...comp, x: drawX, y: drawY }, port, true, idx, comp.inputs.length);
        ctx.beginPath();
        ctx.arc(x, y, PORT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = hoveredPort && hoveredPort.nodeId === comp.id && hoveredPort.port === port ? "#fbbf24" : "#0ea5e9";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.fillText(port, x - 40, y + 4);
      });
      comp.outputs.forEach((port, idx) => {
        const { x, y } = getPortPosition({ ...comp, x: drawX, y: drawY }, port, false, idx, comp.outputs.length);
        ctx.beginPath();
        ctx.arc(x, y, PORT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = hoveredPort && hoveredPort.nodeId === comp.id && hoveredPort.port === port ? "#fbbf24" : "#0ea5e9";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.fillText(port, x + 12, y + 4);
      });
    });
  }, [design, dragging, dragPos, hoveredPort, wiring, selected]);

  return (
    <div className="relative w-full h-[80vh] bg-slate-800 rounded flex">
      {/* Sidebar: Component Library */}
      <div className="w-56 bg-slate-900 border-r border-slate-700 p-3 flex flex-col gap-2">
        <div className="font-bold text-slate-200 mb-2">Component Library</div>
        {COMPONENT_LIBRARY.map((comp) => (
          <Button key={comp.type} variant="outline" className="mb-1" onClick={() => handleAddComponent(comp)}>
            {comp.label}
          </Button>
        ))}
        <div className="flex-1" />
        <Button variant="ghost" onClick={undo} className="mb-1">Undo</Button>
        <Button variant="ghost" onClick={redo}>Redo</Button>
      </div>
      {/* Main Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          className="border border-slate-700"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <div className="absolute bottom-4 right-4">
          <Button onClick={() => window.location.reload()}>Reset View</Button>
        </div>
      </div>
    </div>
  );
} 