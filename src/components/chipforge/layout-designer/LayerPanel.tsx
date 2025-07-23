import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Layers, 
  Plus, 
  Trash2,
  Settings,
  Palette
} from "lucide-react";

export interface Layer {
  id: string;
  name: string;
  type: 'metal' | 'poly' | 'diffusion' | 'via' | 'text' | 'cell';
  color: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
  description?: string;
}

interface LayerPanelProps {
  layers: Layer[];
  onLayerToggle: (layerId: string, visible: boolean) => void;
  onLayerLock: (layerId: string, locked: boolean) => void;
  onLayerSelect: (layerId: string) => void;
  selectedLayer?: string;
}

const DEFAULT_LAYERS: Layer[] = [
  {
    id: 'metal1',
    name: 'Metal 1',
    type: 'metal',
    color: '#ef4444',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 1,
    description: 'First metal layer for routing'
  },
  {
    id: 'metal2',
    name: 'Metal 2',
    type: 'metal',
    color: '#3b82f6',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 2,
    description: 'Second metal layer for routing'
  },
  {
    id: 'metal3',
    name: 'Metal 3',
    type: 'metal',
    color: '#10b981',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 3,
    description: 'Third metal layer for routing'
  },
  {
    id: 'poly',
    name: 'Poly',
    type: 'poly',
    color: '#f59e0b',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 4,
    description: 'Polysilicon layer for gates'
  },
  {
    id: 'ndiff',
    name: 'N+ Diffusion',
    type: 'diffusion',
    color: '#8b5cf6',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 5,
    description: 'N-type diffusion layer'
  },
  {
    id: 'pdiff',
    name: 'P+ Diffusion',
    type: 'diffusion',
    color: '#ec4899',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 6,
    description: 'P-type diffusion layer'
  },
  {
    id: 'via1',
    name: 'Via 1',
    type: 'via',
    color: '#f97316',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 7,
    description: 'Via between Metal 1 and Metal 2'
  },
  {
    id: 'via2',
    name: 'Via 2',
    type: 'via',
    color: '#84cc16',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 8,
    description: 'Via between Metal 2 and Metal 3'
  },
  {
    id: 'cells',
    name: 'Cells',
    type: 'cell',
    color: '#06b6d4',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 9,
    description: 'Standard cells and components'
  },
  {
    id: 'text',
    name: 'Text',
    type: 'text',
    color: '#ffffff',
    visible: true,
    locked: false,
    opacity: 1.0,
    order: 10,
    description: 'Text annotations and labels'
  }
];

const LAYER_TYPE_ICONS = {
  metal: '🔴',
  poly: '🟡',
  diffusion: '🟣',
  via: '🟠',
  text: '⚪',
  cell: '🔵'
};

export default function LayerPanel() {
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
  const [selectedLayer, setSelectedLayer] = useState<string>('cells');
  const [showLayerProperties, setShowLayerProperties] = useState(false);

  const handleLayerToggle = (layerId: string, visible: boolean) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible } : layer
    ));
  };

  const handleLayerLock = (layerId: string, locked: boolean) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, locked } : layer
    ));
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayer(layerId);
  };

  const handleLayerOpacityChange = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  const handleLayerColorChange = (layerId: string, color: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, color } : layer
    ));
  };

  const toggleAllLayers = (visible: boolean) => {
    setLayers(prev => prev.map(layer => ({ ...layer, visible })));
  };

  const lockAllLayers = (locked: boolean) => {
    setLayers(prev => prev.map(layer => ({ ...layer, locked })));
  };

  const selectedLayerData = layers.find(l => l.id === selectedLayer);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">Layers</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAllLayers(true)}
            className="h-6 px-2 text-xs"
            title="Show all layers"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAllLayers(false)}
            className="h-6 px-2 text-xs"
            title="Hide all layers"
          >
            <EyeOff className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => lockAllLayers(false)}
            className="h-6 px-2 text-xs"
            title="Unlock all layers"
          >
            <Unlock className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Layer list */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
              selectedLayer === layer.id 
                ? 'bg-slate-700 border border-slate-500' 
                : 'hover:bg-slate-700'
            }`}
            onClick={() => handleLayerSelect(layer.id)}
          >
            {/* Layer color indicator */}
            <div 
              className="w-4 h-4 rounded border border-slate-600"
              style={{ backgroundColor: layer.color }}
            />
            
            {/* Layer info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-slate-200 truncate">
                  {layer.name}
                </span>
                {layer.locked && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {layer.description}
              </div>
            </div>

            {/* Layer controls */}
            <div className="flex items-center gap-1">
              <Switch
                checked={layer.visible}
                onCheckedChange={(checked) => handleLayerToggle(layer.id, checked)}
                className="scale-75"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLayerLock(layer.id, !layer.locked);
                }}
                className="h-6 w-6 p-0"
              >
                {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Layer properties */}
      {selectedLayerData && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-200">Properties</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLayerProperties(!showLayerProperties)}
              className="h-6 px-2 text-xs"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-slate-400">Opacity</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedLayerData.opacity}
                onChange={(e) => handleLayerOpacityChange(selectedLayerData.id, parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-400">{Math.round(selectedLayerData.opacity * 100)}%</div>
            </div>
            
            <div>
              <Label className="text-xs text-slate-400">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedLayerData.color}
                  onChange={(e) => handleLayerColorChange(selectedLayerData.id, e.target.value)}
                  className="w-8 h-6 rounded border border-slate-600"
                />
                <span className="text-xs text-slate-400">{selectedLayerData.color}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layer statistics */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Visible: {layers.filter(l => l.visible).length}</span>
          <span>Locked: {layers.filter(l => l.locked).length}</span>
          <span>Total: {layers.length}</span>
        </div>
      </div>
    </div>
  );
} 