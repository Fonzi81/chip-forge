
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import DesignEditor from "./pages/DesignEditor";
import ChipForgeWorkspace from "./pages/ChipForgeWorkspace";
import AuditTrail from "./pages/AuditTrail";
import TemplatesLibrary from "./pages/TemplatesLibrary";
import Export from "./pages/Export";
import ConstraintEditor from "./pages/ConstraintEditor";
import UsageDashboard from "./pages/UsageDashboard";
import CollaboratorMode from "./pages/CollaboratorMode";
import LearningPanel from "./pages/LearningPanel";
import ChipForgeSimulation from "./pages/ChipForgeSimulation";
import Synthesis from "./pages/Synthesis";
import PlaceAndRoute from "./pages/PlaceAndRoute";
import LayoutViewer from "./components/chipforge/LayoutViewer";
import TestbenchEditor from "./components/chipforge/TestbenchEditor";
import HDLReflexionAgent from "./pages/HDLReflexionAgent";
import HDLTest from "./pages/HDLTest";
import NotFound from "./pages/NotFound";
import Chip3DViewer from "./components/chipforge/Chip3DViewer";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Play, 
  Code, 
  Layout, 
  Download, 
  Brain, 
  GraduationCap,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Video,
  Target,
  Users,
  Award,
  Search,
  ExternalLink,
  Book,
  Globe
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";
import GlossaryTab from "../components/learning/GlossaryTab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/landing" element={<Index />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/design-editor" element={<DesignEditor />} />
          <Route path="/workspace" element={<ChipForgeWorkspace />} />
          <Route path="/audit-trail" element={<AuditTrail />} />
          <Route path="/templates" element={<TemplatesLibrary />} />
          <Route path="/export" element={<Export />} />
          <Route path="/constraints" element={<ConstraintEditor />} />
          <Route path="/usage-dashboard" element={<UsageDashboard />} />
          <Route path="/collaborator-mode" element={<CollaboratorMode />} />
          <Route path="/learning-panel" element={<LearningPanel />} />
          <Route path="/chipforge-simulation" element={<ChipForgeSimulation />} />
          <Route path="/synthesis" element={<Synthesis />} />
          <Route path="/place-and-route" element={<PlaceAndRoute />} />
          <Route path="/layout-viewer" element={<LayoutViewer />} />
          <Route path="/testbench" element={<TestbenchEditor />} />
          <Route path="/hdl-reflexion-agent" element={<HDLReflexionAgent />} />
          <Route path="/hdl-test" element={<HDLTest />} />
          <Route path="/chip3d-viewer" element={<Chip3DViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
