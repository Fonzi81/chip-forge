
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

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
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/design-editor" element={<DesignEditor />} />
          <Route path="/audit-trail" element={<AuditTrail />} />
          <Route path="/templates" element={<TemplatesLibrary />} />
          <Route path="/export" element={<Export />} />
          <Route path="/constraints" element={<ConstraintEditor />} />
          <Route path="/usage-dashboard" element={<UsageDashboard />} />
          <Route path="/collaborator-mode" element={<CollaboratorMode />} />
          <Route path="/learning-panel" element={<LearningPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
