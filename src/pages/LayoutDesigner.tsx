import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopNav from "../components/chipforge/TopNav";
import WorkflowNav from "../components/chipforge/WorkflowNav";
import ProfessionalToolbar from "../components/chipforge/layout-designer/ProfessionalToolbar";
import AdvancedCanvas from "../components/chipforge/layout-designer/AdvancedCanvas";
import LayerPanel from "../components/chipforge/layout-designer/LayerPanel";
import ProfessionalCellLibrary from "../components/chipforge/layout-designer/ProfessionalCellLibrary";
import DRCEngine from "../components/chipforge/layout-designer/DRCEngine";
import LVSEngine from "../components/chipforge/layout-designer/LVSEngine";
import RoutingTools from "../components/chipforge/layout-designer/RoutingTools";
import TechnologyFile from "../components/chipforge/layout-designer/TechnologyFile";
import LayoutExportImport from "../components/chipforge/layout-designer/LayoutExportImport";
import { useWorkflowStore } from "../state/workflowState";
import { useLayoutEditorStore } from "../state/useLayoutEditorStore";
import { 
  Download, 
  Upload, 
  Trash2,
  Info,
  Layers,
  Zap,
  AlertTriangle,
  Settings,
  Grid3X3,
  FileText
} from "lucide-react";
import type { Cell } from "../components/chipforge/layout-designer/CellLibrary";

export default function LayoutDesigner() {
  const { markComplete, setStage } = useWorkflowStore();
  const { cells, selectedId, clearLayout, exportLayout, importLayout, routes } = useLayoutEditorStore();
  const [selectedTool, setSelectedTool] = React.useState<'library' | 'drc' | 'lvs' | 'routing' | 'tech' | 'export'>('library');
  const [drcViolations, setDrcViolations] = React.useState([]);
  const [lvsResults, setLvsResults] = React.useState([]);

  // Set current stage and mark Layout stage as complete when component loads
  React.useEffect(() => {
    setStage('Layout');
    markComplete('Layout');
  }, [setStage, markComplete]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all cells and routes?')) {
      clearLayout();
    }
  };

  const handleCellSelect = (cell: Cell) => {
    console.log('Selected cell:', cell);
  };

  const handleCellDragStart = (cell: Cell, event: React.DragEvent) => {
    console.log('Dragging cell:', cell);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <WorkflowNav />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Layout Designer</h1>
          <p className="text-slate-600">
            Professional CAD-like layout design with comprehensive tools for chip design
          </p>
        </div>

        {/* Professional Toolbar */}
        <div className="mb-4">
          <ProfessionalToolbar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Left Sidebar - Tools Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Design Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={selectedTool} onValueChange={(value) => setSelectedTool(value as 'library' | 'drc' | 'lvs' | 'routing' | 'tech' | 'export')}>
                  <TabsList className="grid w-full grid-cols-1 h-auto">
                    <TabsTrigger value="library" className="flex items-center gap-2 text-xs">
                      <Grid3X3 className="w-3 h-3" />
                      Cell Library
                    </TabsTrigger>
                    <TabsTrigger value="drc" className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      DRC
                    </TabsTrigger>
                    <TabsTrigger value="lvs" className="flex items-center gap-2 text-xs">
                      <Info className="w-3 h-3" />
                      LVS
                    </TabsTrigger>
                    <TabsTrigger value="routing" className="flex items-center gap-2 text-xs">
                      <Zap className="w-3 h-3" />
                      Routing
                    </TabsTrigger>
                    <TabsTrigger value="tech" className="flex items-center gap-2 text-xs">
                      <Settings className="w-3 h-3" />
                      Technology
                    </TabsTrigger>
                    <TabsTrigger value="export" className="flex items-center gap-2 text-xs">
                      <FileText className="w-3 h-3" />
                      Export/Import
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="library" className="p-4">
                    <ProfessionalCellLibrary />
                  </TabsContent>

                  <TabsContent value="drc" className="p-4">
                    <DRCEngine 
                      onViolationsChange={setDrcViolations}
                    />
                  </TabsContent>

                  <TabsContent value="lvs" className="p-4">
                    <LVSEngine 
                      onResultsChange={setLvsResults}
                    />
                  </TabsContent>

                  <TabsContent value="routing" className="p-4">
                    <RoutingTools 
                      onRouteComplete={(routes) => console.log('Routes updated:', routes)}
                    />
                  </TabsContent>

                  <TabsContent value="tech" className="p-4">
                    <TechnologyFile 
                      onTechFileChange={(techFile) => console.log('Tech file updated:', techFile)}
                    />
                  </TabsContent>

                  <TabsContent value="export" className="p-4">
                    <LayoutExportImport 
                      onExport={(data) => console.log('Export data:', data)}
                      onImport={(data) => console.log('Import data:', data)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Layout Canvas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <AdvancedCanvas />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Properties, Actions, and Layer Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Layer Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LayerPanel />
              </CardContent>
            </Card>

            {/* Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-500 py-8">
                  <p>Select an object to view properties</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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

            {/* Statistics */}
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
                    <span className="text-slate-600">Total Routes:</span>
                    <Badge variant="secondary">{routes.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">DRC Violations:</span>
                    <Badge variant={drcViolations.length > 0 ? "destructive" : "secondary"}>
                      {drcViolations.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">LVS Issues:</span>
                    <Badge variant={lvsResults.length > 0 ? "destructive" : "secondary"}>
                      {lvsResults.length}
                    </Badge>
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
        </div>
      </div>
    </div>
  );
} 