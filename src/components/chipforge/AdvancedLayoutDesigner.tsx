import React, { useEffect, useRef, useState } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";

export default function AdvancedLayoutDesigner() {
  const { design, updateComponentPosition } = useHDLDesignStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<null | { idx: number; offsetX: number; offsetY: number }>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const gridSize = 16;
  const width = 1200;
  const height = 600;
  const compWidth = 96;
  const compHeight = 64;

  // Helper: get component at mouse position
  const getComponentAt = (mx: number, my: number) => {
    return design.components.findIndex(
      (comp) =>
        mx >= comp.x &&
        mx <= comp.x + compWidth &&
        my >= comp.y &&
        my <= comp.y + compHeight
    );
  };

  // Draw the layout
  const drawLayout = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw constraint layers (example: color-coded zones)
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#f59e42"; // Example: orange for power
    ctx.fillRect(0, 0, ctx.canvas.width, 80);
    ctx.fillStyle = "#38bdf8"; // Example: blue for I/O
    ctx.fillRect(0, ctx.canvas.height - 80, ctx.canvas.width, 80);
    ctx.globalAlpha = 1;

    // Draw background grid
    ctx.strokeStyle = "#1f2937";
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }

    // Draw net connections (wires)
    if (design.wires) {
      ctx.strokeStyle = "#f472b6"; // pink for nets
      ctx.lineWidth = 2;
      design.wires.forEach((wire) => {
        const fromComp = design.components.find((c) => c.id === wire.from.nodeId);
        const toComp = design.components.find((c) => c.id === wire.to.nodeId);
        if (fromComp && toComp) {
          const fromX = fromComp.x + compWidth;
          const fromY = fromComp.y + compHeight / 2;
          const toX = toComp.x;
          const toY = toComp.y + compHeight / 2;
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
        }
      });
      ctx.lineWidth = 1;
    }

    // Draw blocks (components)
    design.components.forEach((comp, idx) => {
      const { x, y, label } = comp;
      ctx.fillStyle = hovered === idx ? "#334155" : "#0f172a";
      ctx.strokeStyle = hovered === idx ? "#fbbf24" : "#22d3ee";
      ctx.fillRect(x, y, compWidth, compHeight);
      ctx.strokeRect(x, y, compWidth, compHeight);
      ctx.fillStyle = "#fff";
      ctx.font = "10px monospace";
      ctx.fillText(label || comp.type, x + 6, y + 20);
    });

    // Draw I/O edges (left/right sides)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    design.components.forEach((comp) => {
      if (comp.type.toLowerCase().includes("input")) {
        ctx.beginPath();
        ctx.moveTo(comp.x, comp.y + compHeight / 2);
        ctx.lineTo(0, comp.y + compHeight / 2);
        ctx.stroke();
      }
      if (comp.type.toLowerCase().includes("output")) {
        ctx.beginPath();
        ctx.moveTo(comp.x + compWidth, comp.y + compHeight / 2);
        ctx.lineTo(width, comp.y + compHeight / 2);
        ctx.stroke();
      }
    });
    ctx.lineWidth = 1;
  };

  // Mouse event handlers for drag
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) drawLayout(ctx);
  }, [design, dragging, hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const idx = getComponentAt(mx, my);
      if (idx !== -1) {
        setDragging({ idx, offsetX: mx - design.components[idx].x, offsetY: my - design.components[idx].y });
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (dragging) {
        // Snap to grid
        const newX = Math.round((mx - dragging.offsetX) / gridSize) * gridSize;
        const newY = Math.round((my - dragging.offsetY) / gridSize) * gridSize;
        updateComponentPosition(design.components[dragging.idx].id, newX, newY);
      } else {
        const idx = getComponentAt(mx, my);
        setHovered(idx !== -1 ? idx : null);
      }
    };
    const handleMouseUp = () => {
      setDragging(null);
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [design, dragging]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Chip Layout View</h2>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded border border-slate-600 cursor-pointer"
        style={{ background: "#020617" }}
      />
      <div className="text-xs text-slate-400 mt-2">
        <span className="mr-4"><span className="inline-block w-3 h-3 bg-[#22d3ee] mr-1 align-middle" />Component</span>
        <span className="mr-4"><span className="inline-block w-3 h-3 bg-[#f472b6] mr-1 align-middle" />Net</span>
        <span className="mr-4"><span className="inline-block w-3 h-3 bg-[#38bdf8] mr-1 align-middle" />I/O Edge</span>
        <span><span className="inline-block w-3 h-3 bg-[#f59e42] mr-1 align-middle" />Constraint Layer</span>
      </div>
    </div>
  );
} 