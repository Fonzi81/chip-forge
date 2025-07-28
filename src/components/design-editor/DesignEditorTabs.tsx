import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import RTLViewer from "@/components/RTLViewer";
import SimulationPanel from "@/components/SimulationPanel";
import { 
  FileCode, 
  Play, 
  Eye
} from "lucide-react";
import { DesignFile, AISuggestion, DesignMetrics } from "./types";

interface DesignEditorTabsProps {
  activeFile: DesignFile | undefined;
  aiAssistEnabled: boolean;
  aiSuggestions: AISuggestion[];
  designMetrics: DesignMetrics;
  onCodeChange: (content: string) => void;
  onSave: () => void;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismissSuggestion: (id: string) => void;
  onGenerateCode: (prompt: string) => void;
  onExplainCode: (code: string) => void;
}

const DesignEditorTabs = ({
  activeFile,
  aiAssistEnabled,
  aiSuggestions,
  designMetrics,
  onCodeChange,
  onSave,
  onApplySuggestion,
  onDismissSuggestion,
  onGenerateCode,
  onExplainCode,
}: DesignEditorTabsProps) => {
  return (
    <div className="flex-1 flex flex-col">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="bg-slate-900/50 border-b border-slate-800 rounded-none justify-start h-12 px-6">
          <TabsTrigger value="code" className="data-[state=active]:bg-slate-800">
            <FileCode className="h-4 w-4 mr-2" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="rtl" className="data-[state=active]:bg-slate-800">
            <Eye className="h-4 w-4 mr-2" />
            RTL Diagram
          </TabsTrigger>
          <TabsTrigger value="simulation" className="data-[state=active]:bg-slate-800">
            <Play className="h-4 w-4 mr-2" />
            Simulation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0">
          <div className="h-full flex">
            <div className="flex-1">
              {activeFile ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Select a file to start editing
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Select a file to start editing
                </div>
              )}
            </div>
            
            {/* AI Assistant Sidebar */}
            <div className="w-64 p-4 border-l border-slate-700">
              <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
              <p className="text-sm text-slate-400 mb-4">
                Powered by ChipForge AI
              </p>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-slate-800/50 p-3 rounded-md flex justify-between items-center"
                  >
                    <span>{suggestion.description}</span>
                    <button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rtl" className="flex-1 m-0">
          <div className="h-full p-6">
            <Card className="h-full bg-slate-900/50 border-slate-700 flex items-center justify-center">
              <RTLViewer />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="flex-1 m-0">
          <SimulationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignEditorTabs;