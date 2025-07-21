import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';

interface Viewport {
  pan: { x: number; y: number };
  zoom: number;
  gridSize: number;
}

interface CanvasState {
  isDragging: boolean;
  isPanning: boolean;
  dragStart: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  selectedCells: Set<string>;
  hoveredCell: string | null;
}

const GRID_SIZES = [5, 10, 20, 50, 100, 200, 500, 1000];
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 100;
const ZOOM_FACTOR = 1.2;

export default function AdvancedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  
  const { 
    cells, 
    addCell, 
    tool, 
    selectedCellType, 
    selectedId, 
    setSelected, 
    moveCell, 
    deleteCell 
  } = useLayoutEditorStore();

  const [viewport, setViewport] = useState<Viewport>({
    pan: { x: 0, y: 0 },
    zoom: 1,
    gridSize: 20
  });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    isDragging: false,
    isPanning: false,
    dragStart: { x: 0, y: 0 },
    lastMousePos: { x: 0, y: 0 },
    selectedCells: new Set(),
    hoveredCell: null
  });

  const [showRulers, setShowRulers] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);

  // Canvas rendering with requestAnimationFrame for smooth performance
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply viewport transform
    ctx.save();
    ctx.translate(viewport.pan.x, viewport.pan.y);
    ctx.scale(viewport.zoom, viewport.zoom);

    // Draw background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-viewport.pan.x / viewport.zoom, -viewport.pan.y / viewport.zoom, 
                 canvas.width / viewport.zoom, canvas.height / viewport.zoom);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw cells
    drawCells(ctx);

    // Draw measurements
    if (showMeasurements) {
      drawMeasurements(ctx);
    }

    ctx.restore();

    // Draw rulers
    if (showRulers) {
      drawRulers(ctx, canvas.width, canvas.height);
    }

    // Draw status overlay
    drawStatusOverlay(ctx, canvas.width, canvas.height);

    animationFrameRef.current = requestAnimationFrame(renderCanvas);
  }, [viewport, cells, selectedId, canvasState.hoveredCell, showGrid, showRulers, showMeasurements]);

  // Start rendering loop
  useEffect(() => {
    renderCanvas();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderCanvas]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = viewport.gridSize;
    const startX = Math.floor(-viewport.pan.x / viewport.zoom / gridSize) * gridSize;
    const endX = startX + width / viewport.zoom + gridSize;
    const startY = Math.floor(-viewport.pan.y / viewport.zoom / gridSize) * gridSize;
    const endY = startY + height / viewport.zoom + gridSize;

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  };

  const drawCells = (ctx: CanvasRenderingContext2D) => {
    cells.forEach((cell) => {
      const isSelected = cell.id === selectedId;
      const isHovered = cell.id === canvasState.hoveredCell;
      
      // Apply rotation
      ctx.save();
      ctx.translate(cell.x + 40, cell.y + 30);
      ctx.rotate((cell.rotation * Math.PI) / 180);
      ctx.translate(-40, -30);

      // Cell background with gradient
      const gradient = ctx.createLinearGradient(cell.x, cell.y, cell.x, cell.y + 60);
      if (isSelected) {
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1d4ed8');
      } else if (isHovered) {
        gradient.addColorStop(0, '#60a5fa');
        gradient.addColorStop(1, '#3b82f6');
      } else {
        gradient.addColorStop(0, '#1e40af');
        gradient.addColorStop(1, '#1e3a8a');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 80, 60);

      // Cell border
      ctx.strokeStyle = isSelected ? '#1d4ed8' : '#1e3a8a';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(0, 0, 80, 60);

      // Cell text
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cell.type, 40, 35);

      ctx.restore();

      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cell.x - 2, cell.y - 2, 84, 64);
        ctx.setLineDash([]);
      }
    });
  };

  const drawRulers = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rulerSize = 20;
    
    // Horizontal ruler
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 0, width, rulerSize);
    
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    
    for (let x = 0; x < width; x += 50) {
      const worldX = (x - viewport.pan.x) / viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rulerSize);
      ctx.stroke();
      ctx.fillText(Math.round(worldX).toString(), x + 2, 12);
    }

    // Vertical ruler
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 0, rulerSize, height);
    
    for (let y = 0; y < height; y += 50) {
      const worldY = (y - viewport.pan.y) / viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rulerSize, y);
      ctx.stroke();
      ctx.save();
      ctx.translate(12, y + 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(Math.round(worldY).toString(), 0, 0);
      ctx.restore();
    }
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    // Draw distance measurements between selected cells
    if (selectedId) {
      const selectedCell = cells.find(c => c.id === selectedId);
      if (selectedCell && canvasState.hoveredCell) {
        const hoveredCell = cells.find(c => c.id === canvasState.hoveredCell);
        if (hoveredCell) {
          const dx = hoveredCell.x - selectedCell.x;
          const dy = hoveredCell.y - selectedCell.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(selectedCell.x + 40, selectedCell.y + 30);
          ctx.lineTo(hoveredCell.x + 40, hoveredCell.y + 30);
          ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.fillStyle = '#fbbf24';
          ctx.font = '12px Arial';
          ctx.fillText(`${Math.round(distance)}px`, 
                       (selectedCell.x + hoveredCell.x) / 2 + 40, 
                       (selectedCell.y + hoveredCell.y) / 2 + 30);
        }
      }
    }
  };

  const drawStatusOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, height - 40, 300, 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`Zoom: ${Math.round(viewport.zoom * 100)}% | Grid: ${viewport.gridSize}px | Cells: ${cells.length}`, 15, height - 20);
  };

  // Coordinate conversion utilities
  const screenToWorld = (screenPoint: { x: number; y: number }) => ({
    x: (screenPoint.x - viewport.pan.x) / viewport.zoom,
    y: (screenPoint.y - viewport.pan.y) / viewport.zoom
  });

  const worldToScreen = (worldPoint: { x: number; y: number }) => ({
    x: worldPoint.x * viewport.zoom + viewport.pan.x,
    y: worldPoint.y * viewport.zoom + viewport.pan.y
  });

  const snapToGrid = (point: { x: number; y: number }) => ({
    x: Math.round(point.x / viewport.gridSize) * viewport.gridSize,
    y: Math.round(point.y / viewport.gridSize) * viewport.gridSize
  });

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left
      setCanvasState(prev => ({
        ...prev,
        isPanning: true,
        dragStart: { x, y }
      }));
    } else if (e.button === 0) { // Left mouse
      const worldPoint = screenToWorld({ x, y });
      
      if (tool === 'place') {
        const snappedPoint = snapToGrid(worldPoint);
        const id = `cell-${Date.now()}`;
        addCell({ id, type: selectedCellType, x: snappedPoint.x, y: snappedPoint.y, rotation: 0 });
      } else if (tool === 'select') {
        const clickedCell = cells.find(cell => 
          worldPoint.x >= cell.x && worldPoint.x <= cell.x + 80 && 
          worldPoint.y >= cell.y && worldPoint.y <= cell.y + 60
        );
        setSelected(clickedCell?.id || null);
        
        if (clickedCell) {
          setCanvasState(prev => ({
            ...prev,
            isDragging: true,
            dragStart: worldPoint
          }));
        }
      } else if (tool === 'delete') {
        const clickedCell = cells.find(cell => 
          worldPoint.x >= cell.x && worldPoint.x <= cell.x + 80 && 
          worldPoint.y >= cell.y && worldPoint.y <= cell.y + 60
        );
        if (clickedCell) {
          deleteCell(clickedCell.id);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (canvasState.isPanning) {
      const deltaX = x - canvasState.dragStart.x;
      const deltaY = y - canvasState.dragStart.y;
      setViewport(prev => ({
        ...prev,
        pan: { x: prev.pan.x + deltaX, y: prev.pan.y + deltaY }
      }));
      setCanvasState(prev => ({ ...prev, dragStart: { x, y } }));
    } else if (canvasState.isDragging && selectedId) {
      const worldPoint = screenToWorld({ x, y });
      const snappedPoint = snapToGrid(worldPoint);
      moveCell(selectedId, snappedPoint.x, snappedPoint.y);
    } else {
      const worldPoint = screenToWorld({ x, y });
      const hovered = cells.find(cell => 
        worldPoint.x >= cell.x && worldPoint.x <= cell.x + 80 && 
        worldPoint.y >= cell.y && worldPoint.y <= cell.y + 60
      );
      setCanvasState(prev => ({ ...prev, hoveredCell: hovered?.id || null }));
    }
  };

  const handleMouseUp = () => {
    setCanvasState(prev => ({ ...prev, isDragging: false, isPanning: false }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewport.zoom * zoomFactor));
    
    const zoomRatio = newZoom / viewport.zoom;
    const newPanX = mouseX - (mouseX - viewport.pan.x) * zoomRatio;
    const newPanY = mouseY - (mouseY - viewport.pan.y) * zoomRatio;
    
    setViewport(prev => ({
      ...prev,
      zoom: newZoom,
      pan: { x: newPanX, y: newPanY }
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selectedId) {
      deleteCell(selectedId);
    } else if (e.key === 'g') {
      setShowGrid(prev => !prev);
    } else if (e.key === 'r') {
      setShowRulers(prev => !prev);
    } else if (e.key === 'm') {
      setShowMeasurements(prev => !prev);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-slate-900"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-crosshair"
      />
      
      {/* Tool status overlay */}
      <div className="absolute top-2 left-2 bg-slate-800 text-slate-200 px-3 py-1 rounded text-sm">
        {tool === 'place' && `Place ${selectedCellType}`}
        {tool === 'select' && 'Select cells'}
        {tool === 'move' && 'Move selected cell'}
        {tool === 'delete' && 'Delete cells'}
      </div>

      {/* Viewport controls */}
      <div className="absolute top-2 right-2 bg-slate-800 text-slate-200 p-2 rounded">
        <div className="text-xs mb-1">Grid: {viewport.gridSize}px</div>
        <div className="text-xs">Zoom: {Math.round(viewport.zoom * 100)}%</div>
      </div>
    </div>
  );
} 