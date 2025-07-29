import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDesignEditor } from "@/hooks/useDesignEditor";
import DesignEditorHeader from "@/components/design-editor/DesignEditorHeader";
import DesignEditorTabs from "@/components/design-editor/DesignEditorTabs";
import { useLocation } from "react-router-dom";

const DesignEditor = () => {
  const location = useLocation();
  const initialHdlCode = location.state?.hdlCode;
  
  const {
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
  } = useDesignEditor(initialHdlCode);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onRunSimulation: handleRunSimulation,
    onExportWaveform: handleExport,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DesignEditorHeader />

      <div className="flex flex-1">
        {/* Main Content */}
        <DesignEditorTabs
          activeFile={activeFile}
          aiAssistEnabled={aiAssistEnabled}
          aiSuggestions={aiSuggestions}
          designMetrics={designMetrics}
          onCodeChange={handleCodeChange}
          onSave={handleSave}
          onApplySuggestion={handleApplySuggestion}
          onDismissSuggestion={handleDismissSuggestion}
          onGenerateCode={handleGenerateCode}
          onExplainCode={handleExplainCode}
        />
      </div>
    </div>
  );
};

export default DesignEditor;
