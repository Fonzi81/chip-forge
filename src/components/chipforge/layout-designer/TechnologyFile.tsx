import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Layers,
  FileText,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";

export interface TechLayer {
  id: string;
  name: string;
  type: 'metal' | 'poly' | 'diffusion' | 'via' | 'well' | 'implant' | 'contact';
  color: string;
  visible: boolean;
  selectable: boolean;
  minWidth: number;
  minSpacing: number;
  minArea: number;
  maxWidth?: number;
  thickness?: number;
  resistivity?: number;
}

export interface TechRule {
  id: string;
  name: string;
  category: 'spacing' | 'width' | 'area' | 'overlap' | 'electrical' | 'density';
  layer1: string;
  layer2?: string;
  value: number;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

export interface TechnologyFile {
  name: string;
  version: string;
  process: string;
  description: string;
  layers: TechLayer[];
  rules: TechRule[];
  metadata: {
    manufacturer?: string;
    node?: string;
    date?: string;
    author?: string;
  };
}

// Default 180nm technology file
const DEFAULT_TECH_FILE: TechnologyFile = {
  name: "TSMC 180nm",
  version: "1.0",
  process: "180nm",
  description: "TSMC 180nm CMOS process technology",
  layers: [
    {
      id: "metal1",
      name: "Metal1",
      type: "metal",
      color: "#FFD700",
      visible: true,
      selectable: true,
      minWidth: 0.23,
      minSpacing: 0.28,
      minArea: 0.12,
      thickness: 0.5,
      resistivity: 0.03
    },
    {
      id: "metal2",
      name: "Metal2",
      type: "metal",
      color: "#FFA500",
      visible: true,
      selectable: true,
      minWidth: 0.23,
      minSpacing: 0.28,
      minArea: 0.12,
      thickness: 0.5,
      resistivity: 0.03
    },
    {
      id: "poly",
      name: "Poly",
      type: "poly",
      color: "#00FF00",
      visible: true,
      selectable: true,
      minWidth: 0.18,
      minSpacing: 0.24,
      minArea: 0.08,
      thickness: 0.2,
      resistivity: 10
    },
    {
      id: "diffusion",
      name: "Diffusion",
      type: "diffusion",
      color: "#FF69B4",
      visible: true,
      selectable: true,
      minWidth: 0.22,
      minSpacing: 0.27,
      minArea: 0.1,
      thickness: 0.15
    },
    {
      id: "via1",
      name: "Via1",
      type: "via",
      color: "#FF0000",
      visible: true,
      selectable: true,
      minWidth: 0.22,
      minSpacing: 0.28,
      minArea: 0.05
    },
    {
      id: "nwell",
      name: "N-Well",
      type: "well",
      color: "#8B4513",
      visible: false,
      selectable: true,
      minWidth: 0.6,
      minSpacing: 0.84,
      minArea: 0.8
    },
    {
      id: "pwell",
      name: "P-Well",
      type: "well",
      color: "#4B0082",
      visible: false,
      selectable: true,
      minWidth: 0.6,
      minSpacing: 0.84,
      minArea: 0.8
    }
  ],
  rules: [
    {
      id: "min_spacing_metal1",
      name: "Minimum Metal1 Spacing",
      category: "spacing",
      layer1: "metal1",
      value: 0.28,
      description: "Minimum spacing between Metal1 shapes",
      severity: "error"
    },
    {
      id: "min_width_metal1",
      name: "Minimum Metal1 Width",
      category: "width",
      layer1: "metal1",
      value: 0.23,
      description: "Minimum width for Metal1 shapes",
      severity: "error"
    },
    {
      id: "min_area_metal1",
      name: "Minimum Metal1 Area",
      category: "area",
      layer1: "metal1",
      value: 0.12,
      description: "Minimum area for Metal1 shapes",
      severity: "warning"
    },
    {
      id: "metal1_poly_overlap",
      name: "Metal1-Poly Overlap",
      category: "overlap",
      layer1: "metal1",
      layer2: "poly",
      value: 0.14,
      description: "Minimum overlap between Metal1 and Poly",
      severity: "error"
    }
  ],
  metadata: {
    manufacturer: "TSMC",
    node: "180nm",
    date: "2024-01-01",
    author: "ChipForge"
  }
};

interface TechnologyFileProps {
  onTechFileChange?: (techFile: TechnologyFile) => void;
  onLayerToggle?: (layerId: string, visible: boolean) => void;
}

export default function TechnologyFile({ onTechFileChange, onLayerToggle }: TechnologyFileProps) {
  const [techFile, setTechFile] = useState<TechnologyFile>(DEFAULT_TECH_FILE);
  const [selectedTab, setSelectedTab] = useState<'layers' | 'rules' | 'info'>('layers');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          setTechFile(content);
          onTechFileChange?.(content);
        } catch (error) {
          console.error('Error parsing technology file:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [onTechFileChange]);

  const exportTechFile = () => {
    const dataStr = JSON.stringify(techFile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${techFile.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = techFile.layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    const updatedTechFile = { ...techFile, layers: updatedLayers };
    setTechFile(updatedTechFile);
    onTechFileChange?.(updatedTechFile);
    onLayerToggle?.(layerId, !techFile.layers.find(l => l.id === layerId)?.visible || false);
  };

  const getLayerTypeColor = (type: string) => {
    switch (type) {
      case 'metal': return 'bg-yellow-500';
      case 'poly': return 'bg-green-500';
      case 'diffusion': return 'bg-pink-500';
      case 'via': return 'bg-red-500';
      case 'well': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">Technology File</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={exportTechFile}
            className="h-6 px-2 text-xs"
          >
            <Download className="w-3 h-3" />
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <Upload className="w-3 h-3" />
            </Button>
          </label>
        </div>
      </div>

      {/* Tech File Info */}
      <div className="mb-4 p-3 bg-slate-700 rounded">
        <div className="text-sm font-medium text-slate-200">{techFile.name}</div>
        <div className="text-xs text-slate-400">{techFile.process} • v{techFile.version}</div>
        <div className="text-xs text-slate-400 mt-1">{techFile.description}</div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
          <TabsTrigger value="rules" className="text-xs">Rules</TabsTrigger>
          <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="space-y-2 max-h-64 overflow-y-auto">
          {techFile.layers.map(layer => (
            <div
              key={layer.id}
              className="flex items-center gap-3 p-2 bg-slate-700 border border-slate-600 rounded"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-slate-500"
                  style={{ backgroundColor: layer.color }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="h-6 px-1"
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">
                  {layer.name}
                </div>
                <div className="text-xs text-slate-400">
                  {layer.minWidth}μm min width • {layer.minSpacing}μm min spacing
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getLayerTypeColor(layer.type)}`}
              >
                {layer.type}
              </Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="rules" className="space-y-2 max-h-64 overflow-y-auto">
          {techFile.rules.map(rule => (
            <div
              key={rule.id}
              className="p-2 bg-slate-700 border border-slate-600 rounded"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-slate-200">
                  {rule.name}
                </div>
                <Badge 
                  variant={rule.severity === 'error' ? 'destructive' : rule.severity === 'warning' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {rule.severity}
                </Badge>
              </div>
              <div className="text-xs text-slate-400">
                {rule.layer1} {rule.layer2 ? `→ ${rule.layer2}` : ''} • {rule.value}μm
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {rule.description}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="info" className="space-y-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Manufacturer:</span>
              <span className="text-slate-200">{techFile.metadata.manufacturer}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Process Node:</span>
              <span className="text-slate-200">{techFile.metadata.node}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Date:</span>
              <span className="text-slate-200">{techFile.metadata.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Author:</span>
              <span className="text-slate-200">{techFile.metadata.author}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Layers:</span>
              <span className="text-slate-200">{techFile.layers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Rules:</span>
              <span className="text-slate-200">{techFile.rules.length}</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 