import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import RTLViewer from "@/components/RTLViewer";
import SimulationPanel from "@/components/SimulationPanel";
import CodeEditor from "@/components/chipforge/CodeEditor";
import AIAssistant from "@/components/chipforge/AIAssistant";
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
                <CodeEditor
                  content={activeFile.content}
                  language={activeFile.type === 'constraint' ? 'verilog' : activeFile.type === 'testbench' ? 'verilog' : 'verilog'}
                  onChange={onCodeChange}
                  errors={activeFile.hasErrors ? [
                    { line: 5, column: 10, message: "Syntax error: Missing semicolon", severity: "error" }
                  ] : []}
                  onSave={onSave}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Select a file to start editing
                </div>
              )}
            </div>
            
            {/* AI Assistant Sidebar */}
            <AIAssistant
              isVisible={aiAssistEnabled}
              suggestions={aiSuggestions}
              designMetrics={designMetrics}
              onApplySuggestion={onApplySuggestion}
              onDismissSuggestion={onDismissSuggestion}
              onGenerateCode={onGenerateCode}
              onExplainCode={onExplainCode}
            />
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