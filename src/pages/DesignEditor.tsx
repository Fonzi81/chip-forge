import FileExplorer from "@/components/chipforge/FileExplorer";
import EditorToolbar from "@/components/chipforge/EditorToolbar";
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

      {/* Editor Toolbar */}
      <EditorToolbar
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRunSimulation={handleRunSimulation}
        onExport={handleExport}
        onOpenSettings={() => {
          // TODO: Implement settings functionality
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        compileStatus={compileStatus}
        aiAssistEnabled={aiAssistEnabled}
        onToggleAI={() => setAiAssistEnabled(!aiAssistEnabled)}
        simulationRunning={simulationRunning}
      />

      <div className="flex flex-1">
        {/* File Explorer */}
        <FileExplorer
          files={files}
          activeFileId={activeFileId}
          onFileSelect={setActiveFileId}
          onFileCreate={handleFileCreate}
          onFileDelete={handleFileDelete}
          onFileRename={(id, name) => {
            // TODO: Implement file rename functionality
          }}
        />

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
