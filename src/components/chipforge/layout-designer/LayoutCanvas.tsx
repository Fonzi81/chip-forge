import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLayoutStore } from './useLayoutStore';
import { Cell, Wire, Point, CellType, getCellTemplate, findCellAtPosition, findPinAtPosition, validatePinConnection } from './CellLibrary';

interface CanvasState {
  isDragging: boolean;
  isPlacing: boolean;
  selectedCells: Set<string>;
  hoveredCell: string | null;
  dragStart: Point;
  currentTool: 'select' | 'place' | 'wire' | 'pan';
  wireStart: { cell: Cell; pin: string } | null;
  selectionBox: { start: Point; end: Point } | null;
  contextMenu: { x: number; y: number; visible: boolean };
}

const GRID_SIZE = 20;
const SNAP_THRESHOLD = 10;
const SELECTION_BOX_THRESHOLD = 5;

export default function LayoutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastRenderTime = useRef<number>(0);
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    isDragging: false,
    isPlacing: false,
    selectedCells: new Set(),
    hoveredCell: null,
    dragStart: { x: 0, y: 0 },
    currentTool: 'select',
    wireStart: null,
    selectionBox: null,
    contextMenu: { x: 0, y: 0, visible: false }
  });

  const {
    cells,
    wires,
    viewport,
    addCell,
    updateCell,
    removeCell,
    addWire,
    removeWire,
    setViewport,
    selectedCellType,
    setSelectedCellType,
    setCurrentTool,
    clearSelection
  } = useLayoutStore();

  // Performance optimization: Memoize visible cells and wires
  const visibleElements = useMemo(() => {
    const margin = 100; // Extra margin for smooth scrolling
    const visibleCells = cells.filter(cell => 
      cell.x + cell.width >= -viewport.pan.x / viewport.zoom - margin &&
      cell.x <= (-viewport.pan.x + window.innerWidth) / viewport.zoom + margin &&
      cell.y + cell.height >= -viewport.pan.y / viewport.zoom - margin &&
      cell.y <= (-viewport.pan.y + window.innerHeight) / viewport.zoom + margin
    );
    
    const visibleWires = wires.filter(wire => 
      wire.path.some(point => 
        point.x >= -viewport.pan.x / viewport.zoom - margin &&
        point.x <= (-viewport.pan.x + window.innerWidth) / viewport.zoom + margin &&
        point.y >= -viewport.pan.y / viewport.zoom - margin &&
        point.y <= (-viewport.pan.y + window.innerHeight) / viewport.zoom + margin
      )
    );
    
    return { cells: visibleCells, wires: visibleWires };
  }, [cells, wires, viewport]);

  // Optimized canvas rendering with requestAnimationFrame
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply viewport transform
    ctx.save();
    ctx.translate(viewport.pan.x, viewport.pan.y);
    ctx.scale(viewport.zoom, viewport.zoom);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw wires
    drawWires(ctx, visibleElements.wires);

    // Draw cells
    drawCells(ctx, visibleElements.cells, canvasState);

    // Draw selection box
    if (canvasState.selectionBox) {
      drawSelectionBox(ctx, canvasState.selectionBox);
    }

    // Draw placement preview
    if (canvasState.isPlacing && selectedCellType) {
      drawPlacementPreview(ctx, canvasState.dragStart, selectedCellType);
    }

    // Draw wire preview
    if (canvasState.currentTool === 'wire' && canvasState.wireStart) {
      drawWirePreview(ctx, canvasState.wireStart, canvasState.dragStart);
    }

    // Draw hover effects
    if (canvasState.hoveredCell) {
      drawHoverEffect(ctx, canvasState.hoveredCell);
    }

    ctx.restore();

    lastRenderTime.current = performance.now();
  }, [visibleElements, viewport, canvasState, selectedCellType]);

  // Throttled rendering for better performance
  useEffect(() => {
    const animate = () => {
      renderCanvas();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderCanvas]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = GRID_SIZE;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;

    // Calculate grid bounds
    const startX = Math.floor(-viewport.pan.x / viewport.zoom / gridSize) * gridSize;
    const endX = startX + width / viewport.zoom + gridSize;
    const startY = Math.floor(-viewport.pan.y / viewport.zoom / gridSize) * gridSize;
    const endY = startY + height / viewport.zoom + gridSize;

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

  const drawCells = (ctx: CanvasRenderingContext2D, cells: Cell[], state: CanvasState) => {
    cells.forEach(cell => {
      const isSelected = state.selectedCells.has(cell.id);
      const isHovered = state.hoveredCell === cell.id;

      // Cell background with gradient
      const gradient = ctx.createLinearGradient(cell.x, cell.y, cell.x, cell.y + cell.height);
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
      ctx.fillRect(cell.x, cell.y, cell.width, cell.height);

      // Cell border
      ctx.strokeStyle = isSelected ? '#1d4ed8' : '#1e3a8a';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);

      // Cell text with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cell.name, cell.x + cell.width / 2, cell.y + cell.height / 2 - 5);
      ctx.fillText(cell.type, cell.x + cell.width / 2, cell.y + cell.height / 2 + 10);
      ctx.shadowBlur = 0;

      // Draw pins with enhanced styling
      cell.pins.forEach(pin => {
        const pinX = cell.x + pin.x;
        const pinY = cell.y + pin.y;

        // Pin background
        ctx.fillStyle = pin.direction === 'input' ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(pinX, pinY, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Pin border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pin label
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(pin.name, pinX + 6, pinY + 3);
      });
    });
  };

  const drawWires = (ctx: CanvasRenderingContext2D, wires: Wire[]) => {
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    wires.forEach(wire => {
      if (wire.path.length < 2) return;

      // Wire shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.beginPath();
      ctx.moveTo(wire.path[0].x, wire.path[0].y);

      for (let i = 1; i < wire.path.length; i++) {
        ctx.lineTo(wire.path[i].x, wire.path[i].y);
      }

      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });
  };

  const drawSelectionBox = (ctx: CanvasRenderingContext2D, selectionBox: { start: Point; end: Point }) => {
    const { start, end } = selectionBox;
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(x, y, width, height);
  };

  const drawHoverEffect = (ctx: CanvasRenderingContext2D, cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell) return;

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(cell.x - 2, cell.y - 2, cell.width + 4, cell.height + 4);
    ctx.setLineDash([]);
  };

  const drawPlacementPreview = (ctx: CanvasRenderingContext2D, position: Point, cellType: CellType) => {
    const template = getCellTemplate(cellType);
    if (!template) return;

    ctx.fillStyle = '#3b82f6';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(position.x, position.y, template.width, template.height);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.strokeRect(position.x, position.y, template.width, template.height);
  };

  const drawWirePreview = (ctx: CanvasRenderingContext2D, wireStart: { cell: Cell; pin: string }, end: Point) => {
    const startPin = wireStart.cell.pins.find(p => p.name === wireStart.pin);
    if (!startPin) return;

    const startX = wireStart.cell.x + startPin.x;
    const startY = wireStart.cell.y + startPin.y;

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const snapToGrid = (point: Point): Point => {
    return {
      x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(point.y / GRID_SIZE) * GRID_SIZE
    };
  };

  const screenToWorld = (screenPoint: Point): Point => {
    return {
      x: (screenPoint.x - viewport.pan.x) / viewport.zoom,
      y: (screenPoint.y - viewport.pan.y) / viewport.zoom
    };
  };

  const worldToScreen = (worldPoint: Point): Point => {
    return {
      x: worldPoint.x * viewport.zoom + viewport.pan.x,
      y: worldPoint.y * viewport.zoom + viewport.pan.y
    };
  };

  const findCellAtPoint = (point: Point): Cell | null => {
    return findCellAtPosition(cells, point.x, point.y);
  };

  // Enhanced mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const screenPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const worldPoint = screenToWorld(screenPoint);

    setCanvasState(prev => ({ ...prev, contextMenu: { ...prev.contextMenu, visible: false } }));

    if (e.button === 0) { // Left click
      if (canvasState.currentTool === 'place' && selectedCellType) {
        const snappedPoint = snapToGrid(worldPoint);
        setCanvasState(prev => ({
          ...prev,
          isPlacing: true,
          dragStart: snappedPoint
        }));
      } else if (canvasState.currentTool === 'wire') {
        const pinResult = findPinAtPosition(cells, worldPoint.x, worldPoint.y);
        if (pinResult) {
          setCanvasState(prev => ({
            ...prev,
            wireStart: { cell: pinResult.cell, pin: pinResult.pin.name },
            dragStart: worldPoint
          }));
        }
      } else if (canvasState.currentTool === 'select') {
        const cell = findCellAtPoint(worldPoint);
        if (cell) {
          if (e.ctrlKey || e.metaKey) {
            // Multi-select
            setCanvasState(prev => ({
              ...prev,
              selectedCells: new Set([...prev.selectedCells, cell.id]),
              isDragging: true,
              dragStart: worldPoint
            }));
          } else {
            // Single select
            setCanvasState(prev => ({
              ...prev,
              selectedCells: new Set([cell.id]),
              isDragging: true,
              dragStart: worldPoint
            }));
          }
        } else {
          // Start selection box
          setCanvasState(prev => ({
            ...prev,
            selectedCells: new Set(),
            selectionBox: { start: worldPoint, end: worldPoint }
          }));
        }
      } else if (canvasState.currentTool === 'pan') {
        setCanvasState(prev => ({
          ...prev,
          isDragging: true,
          dragStart: screenPoint
        }));
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const screenPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const worldPoint = screenToWorld(screenPoint);

    if (canvasState.isDragging) {
      if (canvasState.currentTool === 'select' && canvasState.selectedCells.size > 0) {
        // Move selected cells
        const deltaX = worldPoint.x - canvasState.dragStart.x;
        const deltaY = worldPoint.y - canvasState.dragStart.y;
        
        canvasState.selectedCells.forEach(cellId => {
          const cell = cells.find(c => c.id === cellId);
          if (cell) {
            const snappedPoint = snapToGrid({ x: cell.x + deltaX, y: cell.y + deltaY });
            updateCell(cellId, { x: snappedPoint.x, y: snappedPoint.y });
          }
        });
        
        setCanvasState(prev => ({ ...prev, dragStart: worldPoint }));
      } else if (canvasState.currentTool === 'pan') {
        // Pan viewport
        const deltaX = screenPoint.x - canvasState.dragStart.x;
        const deltaY = screenPoint.y - canvasState.dragStart.y;
        setViewport({
          pan: { x: viewport.pan.x + deltaX, y: viewport.pan.y + deltaY },
          zoom: viewport.zoom
        });
        setCanvasState(prev => ({ ...prev, dragStart: screenPoint }));
      }
    } else if (canvasState.selectionBox) {
      // Update selection box
      setCanvasState(prev => ({
        ...prev,
        selectionBox: { ...prev.selectionBox!, end: worldPoint }
      }));
    } else if (canvasState.isPlacing && selectedCellType) {
      // Update placement preview
      const snappedPoint = snapToGrid(worldPoint);
      setCanvasState(prev => ({ ...prev, dragStart: snappedPoint }));
    } else if (canvasState.wireStart) {
      // Update wire preview
      setCanvasState(prev => ({ ...prev, dragStart: worldPoint }));
    } else {
      // Update hover state
      const cell = findCellAtPoint(worldPoint);
      setCanvasState(prev => ({ ...prev, hoveredCell: cell?.id || null }));
    }
  };

  const handleMouseUp = () => {
    if (canvasState.isPlacing && selectedCellType) {
      // Place cell
      const template = getCellTemplate(selectedCellType);
      if (template) {
        addCell({
          id: `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: `${selectedCellType}_${Date.now()}`,
          type: selectedCellType,
          x: canvasState.dragStart.x,
          y: canvasState.dragStart.y,
          width: template.width,
          height: template.height,
          pins: [...template.pins],
          category: template.category,
          description: template.description
        });
      }
    } else if (canvasState.wireStart) {
      // Complete wire connection
      const pinResult = findPinAtPosition(cells, canvasState.dragStart.x, canvasState.dragStart.y);
      if (pinResult && pinResult.cell.id !== canvasState.wireStart.cell.id) {
        const startPin = canvasState.wireStart.cell.pins.find(p => p.name === canvasState.wireStart!.pin);
        if (startPin && validatePinConnection(startPin, pinResult.pin)) {
          addWire({
            id: `wire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `wire_${Date.now()}`,
            path: [
              { x: canvasState.wireStart.cell.x + startPin.x, y: canvasState.wireStart.cell.y + startPin.y },
              { x: pinResult.cell.x + pinResult.pin.x, y: pinResult.cell.y + pinResult.pin.y }
            ],
            width: 2,
            netType: 'signal'
          });
        }
      }
    } else if (canvasState.selectionBox) {
      // Select cells in selection box
      const { start, end } = canvasState.selectionBox;
      const selectedCells = new Set<string>();
      
      cells.forEach(cell => {
        const cellCenter = { x: cell.x + cell.width / 2, y: cell.y + cell.height / 2 };
        if (cellCenter.x >= Math.min(start.x, end.x) && cellCenter.x <= Math.max(start.x, end.x) &&
            cellCenter.y >= Math.min(start.y, end.y) && cellCenter.y <= Math.max(start.y, end.y)) {
          selectedCells.add(cell.id);
        }
      });
      
      setCanvasState(prev => ({ ...prev, selectedCells, selectionBox: null }));
    }

    setCanvasState(prev => ({
      ...prev,
      isDragging: false,
      isPlacing: false,
      wireStart: null,
      selectionBox: null
    }));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * zoomFactor));

    const zoomRatio = newZoom / viewport.zoom;
    const newPanX = mouseX - (mouseX - viewport.pan.x) * zoomRatio;
    const newPanY = mouseY - (mouseY - viewport.pan.y) * zoomRatio;

    setViewport({ pan: { x: newPanX, y: newPanY }, zoom: newZoom });
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    setCanvasState(prev => ({
      ...prev,
      contextMenu: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true
      }
    }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== canvasRef.current) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (canvasState.selectedCells.size > 0) {
            canvasState.selectedCells.forEach(cellId => removeCell(cellId));
            setCanvasState(prev => ({ ...prev, selectedCells: new Set() }));
          }
          break;
        case 'Escape':
          setCanvasState(prev => ({
            ...prev,
            selectedCells: new Set(),
            selectionBox: null,
            wireStart: null,
            isPlacing: false
          }));
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCanvasState(prev => ({
              ...prev,
              selectedCells: new Set(cells.map(c => c.id))
            }));
          }
          break;
        case '1':
          setCurrentTool('select');
          break;
        case '2':
          setCurrentTool('place');
          break;
        case '3':
          setCurrentTool('wire');
          break;
        case '4':
          setCurrentTool('pan');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasState.selectedCells, cells, removeCell, setCurrentTool]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 cursor-crosshair w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        tabIndex={0}
      />
      
      {/* Context Menu */}
      {canvasState.contextMenu.visible && (
        <div
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg py-2 z-50"
          style={{
            left: canvasState.contextMenu.x,
            top: canvasState.contextMenu.y
          }}
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              if (canvasState.selectedCells.size > 0) {
                canvasState.selectedCells.forEach(cellId => removeCell(cellId));
                setCanvasState(prev => ({ 
                  ...prev, 
                  selectedCells: new Set(),
                  contextMenu: { ...prev.contextMenu, visible: false }
                }));
              }
            }}
          >
            Delete Selected
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setCanvasState(prev => ({ 
                ...prev, 
                contextMenu: { ...prev.contextMenu, visible: false }
              }));
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 text-sm">
        <div className="flex justify-between items-center">
          <div>
            Cells: {cells.length} | Wires: {wires.length} | Selected: {canvasState.selectedCells.size}
          </div>
          <div>
            Zoom: {Math.round(viewport.zoom * 100)}% | 
            Position: ({Math.round(viewport.pan.x)}, {Math.round(viewport.pan.y)})
          </div>
        </div>
      </div>
    </div>
  );
} 