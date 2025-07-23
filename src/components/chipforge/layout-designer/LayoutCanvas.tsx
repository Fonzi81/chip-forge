import React, { useRef, useEffect, useState } from 'react';
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';

export default function LayoutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 1200;
    canvas.height = 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#eee';
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw cells
    cells.forEach((cell) => {
      const isSelected = cell.id === selectedId;
      const isHovered = cell.id === hoveredCell;
      
      // Cell background
      if (isSelected) {
        ctx.fillStyle = '#3b82f6';
      } else if (isHovered) {
        ctx.fillStyle = '#60a5fa';
      } else {
        ctx.fillStyle = '#0074D9';
      }
      ctx.fillRect(cell.x, cell.y, 80, 60);
      
      // Cell border
      ctx.strokeStyle = isSelected ? '#1d4ed8' : '#333';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(cell.x, cell.y, 80, 60);
      
      // Cell text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(cell.type, cell.x + 5, cell.y + 20);
      
      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cell.x - 2, cell.y - 2, 84, 64);
        ctx.setLineDash([]);
      }
    });
  }, [cells, selectedId, hoveredCell]);

  const getCellAtPosition = (x: number, y: number) => {
    return cells.find(cell => 
      x >= cell.x && x <= cell.x + 80 && 
      y >= cell.y && y <= cell.y + 60
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'place') {
      const snappedX = Math.floor(x / 20) * 20;
      const snappedY = Math.floor(y / 20) * 20;
      const id = `cell-${Date.now()}`;
      addCell({ id, type: selectedCellType, x: snappedX, y: snappedY, rotation: 0 });
    } else if (tool === 'select') {
      const clickedCell = getCellAtPosition(x, y);
      setSelected(clickedCell?.id || null);
    } else if (tool === 'delete') {
      const clickedCell = getCellAtPosition(x, y);
      if (clickedCell) {
        deleteCell(clickedCell.id);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDragging && selectedId && tool === 'move') {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      const selectedCell = cells.find(c => c.id === selectedId);
      if (selectedCell) {
        const newX = Math.floor((selectedCell.x + deltaX) / 20) * 20;
        const newY = Math.floor((selectedCell.y + deltaY) / 20) * 20;
        moveCell(selectedId, newX, newY);
        setDragStart({ x, y });
      }
    } else {
      const hovered = getCellAtPosition(x, y);
      setHoveredCell(hovered?.id || null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'move' && selectedId) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selectedId) {
      deleteCell(selectedId);
    }
  };

  return (
    <div 
      className="border bg-white rounded shadow w-full h-[600px] relative"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-crosshair"
      />
      {tool === 'place' && (
        <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          Click to place {selectedCellType}
        </div>
      )}
      {tool === 'select' && (
        <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          Click to select cells
        </div>
      )}
      {tool === 'move' && (
        <div className="absolute top-2 left-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
          Drag to move selected cell
        </div>
      )}
      {tool === 'delete' && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
          Click to delete cells
        </div>
      )}
    </div>
  );
} 