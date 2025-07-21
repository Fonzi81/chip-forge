import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Upload,
  FileText,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
  Layers
} from "lucide-react";
import { useLayoutEditorStore, type CellInstance, type Route } from '../../../state/useLayoutEditorStore';

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  type: 'binary' | 'text' | 'open';
  supported: boolean;
}

// Base layout data structure
export interface LayoutData {
  cells: CellInstance[];
  routes: Route[];
}

// Export data structures for different formats
export interface GDSIIExportData {
  format: 'gdsii';
  version: string;
  units: string;
  data: LayoutData;
  timestamp: string;
}

export interface OASISExportData {
  format: 'oasis';
  version: string;
  units: string;
  data: LayoutData;
  timestamp: string;
}

export interface SVGExportData {
  format: 'svg';
  width: number;
  height: number;
  cells: CellInstance[];
  routes: Route[];
}

export interface JSONExportData {
  format: 'json';
  version: string;
  data: LayoutData;
  timestamp: string;
}

export type ExportData = GDSIIExportData | OASISExportData | SVGExportData | JSONExportData;

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'gdsii',
    name: 'GDSII',
    extension: '.gds',
    description: 'Industry standard binary format for IC layout',
    type: 'binary',
    supported: true
  },
  {
    id: 'oasis',
    name: 'OASIS',
    extension: '.oas',
    description: 'Modern compressed format for IC layout',
    type: 'binary',
    supported: true
  },
  {
    id: 'json',
    name: 'JSON',
    extension: '.json',
    description: 'Open format for data exchange',
    type: 'text',
    supported: true
  },
  {
    id: 'svg',
    name: 'SVG',
    extension: '.svg',
    description: 'Vector graphics format for visualization',
    type: 'text',
    supported: true
  },
  {
    id: 'dxf',
    name: 'DXF',
    extension: '.dxf',
    description: 'CAD format for 2D drawings',
    type: 'text',
    supported: false
  }
];

interface LayoutExportImportProps {
  onExport?: (data: ExportData, format: string) => void;
  onImport?: (data: LayoutData, format: string) => void;
}

export default function LayoutExportImport({ onExport, onImport }: LayoutExportImportProps) {
  const { cells, routes, exportLayout, importLayout } = useLayoutEditorStore();
  const [selectedFormat, setSelectedFormat] = useState<string>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportStatus('Preparing export...');

    try {
      const layoutData = exportLayout();
      
      // Simulate export processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let exportData: ExportData;
      let filename: string;
      
      switch (selectedFormat) {
        case 'gdsii': {
          const gdsiiData: GDSIIExportData = {
            format: 'gdsii',
            version: '6.0',
            units: 'microns',
            data: layoutData,
            timestamp: new Date().toISOString()
          };
          exportData = gdsiiData;
          filename = `layout_${Date.now()}.gds`;
          break;
        }
          
        case 'oasis': {
          const oasisData: OASISExportData = {
            format: 'oasis',
            version: '1.0',
            units: 'microns',
            data: layoutData,
            timestamp: new Date().toISOString()
          };
          exportData = oasisData;
          filename = `layout_${Date.now()}.oas`;
          break;
        }
          
        case 'svg': {
          const svgData: SVGExportData = {
            format: 'svg',
            width: 800,
            height: 600,
            cells: layoutData.cells.map((cell: CellInstance) => ({
              ...cell,
              x: cell.x * 10, // Scale for SVG
              y: cell.y * 10
            })),
            routes: layoutData.routes
          };
          exportData = svgData;
          filename = `layout_${Date.now()}.svg`;
          break;
        }
          
        default: { // json
          const jsonData: JSONExportData = {
            format: 'json',
            version: '1.0',
            data: layoutData,
            timestamp: new Date().toISOString()
          };
          exportData = jsonData;
          filename = `layout_${Date.now()}.json`;
        }
      }

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setExportStatus('Export completed successfully!');
      onExport?.(exportData, selectedFormat);
      
    } catch (error) {
      setExportStatus('Export failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsExporting(false);
    }
  }, [selectedFormat, exportLayout, onExport]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target?.result as string) as ExportData;
          
          // Simulate import processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          let layoutData: LayoutData;
          
          // Handle different export formats
          if (content.format === 'svg') {
            // SVG format has cells and routes directly
            layoutData = {
              cells: content.cells,
              routes: content.routes
            };
          } else if (content.format === 'json' || content.format === 'gdsii' || content.format === 'oasis') {
            // These formats have data property
            layoutData = content.data;
          } else {
            // Fallback: assume its a direct layout data structure
            layoutData = content as unknown as LayoutData;
          }
          
          importLayout(layoutData);
          onImport?.(layoutData, selectedFormat);
          
        } catch (error) {
          console.error('Failed to import layout:', error);
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Import failed:', error);
      setIsImporting(false);
    }
  }, [importLayout, onImport, selectedFormat]);

  const getFormatIcon = (format: ExportFormat) => {
    if (!format.supported) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    return <FileText className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-200">Export/Import</h3>
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-200 mb-2">Export Format</h4>
        <div className="space-y-2">
          {EXPORT_FORMATS.map((format) => (
            <div
              key={format.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${
                selectedFormat === format.id 
                  ? 'bg-slate-700 border-slate-500' 
                  : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
              } ${!format.supported ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => format.supported && setSelectedFormat(format.id)}
            >
              {getFormatIcon(format)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200">
                  {format.name}
                </div>
                <div className="text-xs text-slate-400">
                  {format.description}
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {format.extension}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-200 mb-2">Export Layout</h4>
        <div className="space-y-2">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
            size="sm"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export to {EXPORT_FORMATS.find(f => f.id === selectedFormat)?.name}
              </>
            )}
          </Button>
          {exportStatus && (
            <div className="text-xs text-slate-400 mt-2">
              {exportStatus}
            </div>
          )}
        </div>
      </div>

      {/* Import Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-200 mb-2">Import Layout</h4>
        <div className="space-y-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json,.gds,.oas,.svg"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              disabled={isImporting}
              className="w-full"
              size="sm"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Layout
                </>
              )}
            </Button>
          </label>
        </div>
      </div>

      {/* Statistics */}
      <div className="pt-4 border-t border-slate-700">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Cells to Export:</span>
            <span className="text-slate-200">{cells.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Routes to Export:</span>
            <span className="text-slate-200">{routes.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Format:</span>
            <span className="text-slate-200">
              {EXPORT_FORMATS.find(f => f.id === selectedFormat)?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 