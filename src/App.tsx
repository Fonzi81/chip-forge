

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
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
import SynthesisPage from "./pages/SynthesisPage";
import ProfessionalChip3DViewer from "./components/chipforge/ProfessionalChip3DViewer";
import ChipForgeWorkspace from "./pages/ChipForgeWorkspace";
import SimulationEnvironment from "./pages/SimulationEnvironment";
import LayoutEnvironment from "./pages/LayoutEnvironment";
import ChipForgeSimulation from "./pages/ChipForgeSimulation";
import WaveformPlanner from "@/components/chipforge/WaveformPlanner";
import ErrorBoundaryTest from "./pages/ErrorBoundaryTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspace" element={<ChipForgeWorkspace />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/templates" element={<TemplatesLibrary />} />
            <Route path="/constraints" element={<ConstraintEditor />} />
            <Route path="/usage-dashboard" element={<UsageDashboard />} />
            <Route path="/collaborator-mode" element={<CollaboratorMode />} />
            <Route path="/learning-panel" element={<LearningPanel />} />
            <Route path="/export" element={<Export />} />
            
            {/* ChipForge Design Flow Routes */}
            <Route path="/simulation" element={<SimulationEnvironment />} />
            <Route path="/chipforge-simulation" element={<ChipForgeSimulation />} />
            <Route path="/place-and-route" element={<LayoutEnvironment />} />
            <Route path="/layout" element={<LayoutEnvironment />} />
            
            {/* Phase 1-3 Development Pages */}
            <Route path="/hdl-generator" element={<HDLGeneratorPage />} />
            <Route path="/synthesis" element={<SynthesisPage />} />
            <Route path="/test-native-simulator" element={<TestNativeSimulator />} />
            <Route path="/advanced-chip-design" element={<AdvancedChipDesign />} />
            <Route path="/advanced-layout-designer" element={<AdvancedLayoutDesigner />} />
            <Route path="/layout-editor" element={<LayoutEditorPage />} />
            <Route path="/cross-section-viewer" element={<CrossSectionViewerPage />} />
            <Route path="/chip3d-viewer" element={<ProfessionalChip3DViewer />} />
            <Route path="/waveform" element={<WaveformPlanner />} />
            
            {/* Testing Routes */}
            <Route path="/test-error-boundaries" element={<ErrorBoundaryTest />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
