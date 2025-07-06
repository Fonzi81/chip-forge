
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  ArrowLeft, 
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CoursesTab from "@/components/learning/CoursesTab";
import AIAssistantTab from "@/components/learning/AIAssistantTab";
import ResourcesTab from "@/components/learning/ResourcesTab";

const LearningPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">Learning Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Award className="h-3 w-3 mr-1" />
              2 Courses Completed
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="courses" className="data-[state=active]:bg-slate-700">Courses</TabsTrigger>
            <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-slate-700">AI Assistant</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-slate-700">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <CoursesTab />
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <AIAssistantTab />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourcesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningPanel;
