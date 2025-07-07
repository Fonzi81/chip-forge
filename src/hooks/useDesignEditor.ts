import { useState } from "react";
import { DesignFile, CompileStatus, DesignMetrics } from "@/components/design-editor/types";
import { getDefaultFiles, getDefaultAISuggestions } from "@/utils/designEditorDefaults";

export const useDesignEditor = (initialHdlCode?: string) => {
  const [activeFileId, setActiveFileId] = useState("1");
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [compileStatus, setCompileStatus] = useState<CompileStatus>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [files, setFiles] = useState<DesignFile[]>(getDefaultFiles(initialHdlCode));
  const [aiSuggestions] = useState(getDefaultAISuggestions());

  const designMetrics: DesignMetrics = {
    linesOfCode: files.reduce((acc, file) => acc + file.content.split('\n').length, 0),
    estimatedGates: 145,
    complexityScore: 6,
    version: "v1.2.3",
    lastModified: new Date()
  };

  const activeFile = files.find(f => f.id === activeFileId);

  // Event handlers
  const handleSave = () => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const handleUndo = () => {
    setCanRedo(true);
    if (Math.random() > 0.5) setCanUndo(false);
  };

  const handleRedo = () => {
    setCanUndo(true);
    if (Math.random() > 0.5) setCanRedo(false);
  };

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => setSimulationRunning(false), 3000);
  };

  const handleExport = () => {
    console.log("Exporting design...");
  };

  const handleCodeChange = (content: string) => {
    if (activeFile) {
      setFiles(files.map(f => 
        f.id === activeFileId ? { ...f, content } : f
      ));
      setHasUnsavedChanges(true);
    }
  };

  const handleFileCreate = (name: string, type: string) => {
    const newFile: DesignFile = {
      id: Date.now().toString(),
      name,
      type: type as any,
      hasErrors: false,
      path: `src/${name}`,
      content: type === 'verilog' ? '// New Verilog module\nmodule new_module;\n\nendmodule' : ''
    };
    setFiles([...files, newFile]);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
    if (activeFileId === fileId && files.length > 1) {
      setActiveFileId(files.find(f => f.id !== fileId)?.id || "");
    }
  };

  const handleApplySuggestion = (suggestion: any) => {
    console.log("Applying suggestion:", suggestion);
  };

  const handleDismissSuggestion = (id: string) => {
    console.log("Dismissing suggestion:", id);
  };

  const handleGenerateCode = (prompt: string) => {
    console.log("Generating code for prompt:", prompt);
  };

  const handleExplainCode = (code: string) => {
    console.log("Explaining code:", code);
  };

  return {
    // State
    activeFileId,
    setActiveFileId,
    aiAssistEnabled,
    setAiAssistEnabled,
    compileStatus,
    hasUnsavedChanges,
    lastSaved,
    canUndo,
    canRedo,
    simulationRunning,
    files,
    aiSuggestions,
    designMetrics,
    activeFile,
    
    // Event handlers
    handleSave,
    handleUndo,
    handleRedo,
    handleRunSimulation,
    handleExport,
    handleCodeChange,
    handleFileCreate,
    handleFileDelete,
    handleApplySuggestion,
    handleDismissSuggestion,
    handleGenerateCode,
    handleExplainCode,
  };
};