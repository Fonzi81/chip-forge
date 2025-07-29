
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
import AuditTrail from "./pages/AuditTrail";
import TemplatesLibrary from "./pages/TemplatesLibrary";
import Export from "./pages/Export";
import ConstraintEditor from "./pages/ConstraintEditor";
import UsageDashboard from "./pages/UsageDashboard";
import CollaboratorMode from "./pages/CollaboratorMode";
import LearningPanel from "./pages/LearningPanel";
import HDLGeneratorPage from "./pages/HDLGeneratorPage";
import TestNativeSimulator from "./pages/TestNativeSimulator";
import AdvancedChipDesign from "./pages/AdvancedChipDesign";
import AdvancedLayoutDesigner from "./pages/AdvancedLayoutDesignerPage";
import LayoutEditorPage from "./pages/LayoutEditorPage";
import CrossSectionViewerPage from "./pages/CrossSectionViewerPage";
import NotFound from "./pages/NotFound";
import ProfessionalChip3DViewer from "./components/chipforge/ProfessionalChip3DViewer";

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
          <Route path="/audit-trail" element={<AuditTrail />} />
          <Route path="/templates" element={<TemplatesLibrary />} />
          <Route path="/constraints" element={<ConstraintEditor />} />
          <Route path="/usage-dashboard" element={<UsageDashboard />} />
          <Route path="/collaborator-mode" element={<CollaboratorMode />} />
          <Route path="/learning-panel" element={<LearningPanel />} />
          <Route path="/export" element={<Export />} />
          {/* Phase 1-3 Development Pages */}
          <Route path="/hdl-generator" element={<HDLGeneratorPage />} />
          <Route path="/test-native-simulator" element={<TestNativeSimulator />} />
          <Route path="/advanced-chip-design" element={<AdvancedChipDesign />} />
          <Route path="/advanced-layout-designer" element={<AdvancedLayoutDesigner />} />
          <Route path="/layout-editor" element={<LayoutEditorPage />} />
          <Route path="/cross-section-viewer" element={<CrossSectionViewerPage />} />
          <Route path="/chip3d-viewer" element={<ProfessionalChip3DViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
