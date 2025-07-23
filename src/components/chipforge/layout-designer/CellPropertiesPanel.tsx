import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';
import { RotateCcw, Trash2, Copy } from "lucide-react";

export default function CellPropertiesPanel() {
  const { 
    cells, 
    selectedId, 
    moveCell, 
    rotateCell, 
    deleteCell, 
    duplicateCell,
    setSelected 
  } = useLayoutEditorStore();

  const selectedCell = cells.find(cell => cell.id === selectedId);

  if (!selectedCell) {
    return (
      <div className="text-center text-slate-500 py-8">
        <p>No cell selected</p>
        <p className="text-sm">Click on a cell to view its properties</p>
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseInt(value) || 0;
    const snappedValue = Math.floor(numValue / 20) * 20; // Snap to grid
    moveCell(selectedCell.id, 
      axis === 'x' ? snappedValue : selectedCell.x,
      axis === 'y' ? snappedValue : selectedCell.y
    );
  };

  const handleRotate = () => {
    rotateCell(selectedCell.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this cell?')) {
      deleteCell(selectedCell.id);
    }
  };

  const handleDuplicate = () => {
    duplicateCell(selectedCell.id);
  };

  return (
    <div className="space-y-4">
      {/* Cell Info */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Cell ID</Label>
        <div className="text-sm text-slate-600 font-mono bg-slate-100 p-2 rounded">
          {selectedCell.id}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Type</Label>
        <Badge variant="secondary" className="w-full justify-center">
          {selectedCell.type}
        </Badge>
      </div>

      {/* Position Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-slate-500">X</Label>
            <Input
              type="number"
              value={selectedCell.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Y</Label>
            <Input
              type="number"
              value={selectedCell.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rotation</Label>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex-1 justify-center">
            {selectedCell.rotation}°
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="px-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t">
        <Label className="text-sm font-medium">Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Grid Info */}
      <div className="pt-4 border-t">
        <div className="text-xs text-slate-500 space-y-1">
          <p>Grid: 20px × 20px</p>
          <p>Position snapped to grid</p>
        </div>
      </div>
    </div>
  );
} 