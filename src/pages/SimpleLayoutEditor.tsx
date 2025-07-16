import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TopNav from "../components/chipforge/TopNav";
import WorkflowNav from "../components/chipforge/WorkflowNav";
import ToolSelector from "../components/chipforge/layout-designer/ToolSelector";
import ComponentPalette from "../components/chipforge/layout-designer/ComponentPalette";
import LayoutCanvas from "../components/chipforge/layout-designer/LayoutCanvas";
import CellPropertiesPanel from "../components/chipforge/layout-designer/CellPropertiesPanel";
import { useWorkflowStore } from "../state/workflowState";
import { useLayoutEditorStore } from "../state/useLayoutEditorStore";
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Grid3X3, 
  Info,
  Save,
  Trash2,
  Copy,
  Undo,
  Redo
} from "lucide-react";

export default function SimpleLayoutEditor() {
  const { markComplete, setStage } = useWorkflowStore();
  const { cells, selectedId, clearLayout, exportLayout, importLayout } = useLayoutEditorStore();

  // Set current stage and mark Layout stage as complete when component loads
  React.useEffect(() => {
    setStage('Layout');
    markComplete('Layout');
  }, [setStage, markComplete]);

  const handleExport = () => {
    const layoutData = exportLayout();
    const dataStr = JSON.stringify(layoutData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'layout.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const layoutData = JSON.parse(e.target?.result as string);
          importLayout(layoutData);
        } catch (error) {
          console.error('Failed to import layout:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all cells?')) {
      clearLayout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <WorkflowNav />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Simple Layout Editor</h1>
          <p className="text-slate-600">
            Create and edit chip layouts with a simple, intuitive interface
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Tools and Components */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ToolSelector />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent>
                <ComponentPalette />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExport}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => document.getElementById('import-input')?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
                <input
                  id="import-input"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClear}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Cells:</span>
                    <Badge variant="secondary">{cells.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Selected:</span>
                    <Badge variant={selectedId ? "default" : "secondary"}>
                      {selectedId ? "1" : "0"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Layout Canvas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LayoutCanvas />
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Cell Properties */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Cell Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CellPropertiesPanel />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 