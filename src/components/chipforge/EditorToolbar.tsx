import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Undo, 
  Redo, 
  Play, 
  Download,
  Settings,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface EditorToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onRunSimulation: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
  compileStatus: 'idle' | 'compiling' | 'success' | 'error';
  aiAssistEnabled: boolean;
  onToggleAI: () => void;
  simulationRunning?: boolean;
}

const EditorToolbar = ({
  onSave,
  onUndo,
  onRedo,
  onRunSimulation,
  onExport,
  onOpenSettings,
  canUndo,
  canRedo,
  hasUnsavedChanges,
  lastSaved,
  compileStatus,
  aiAssistEnabled,
  onToggleAI,
  simulationRunning = false
}: EditorToolbarProps) => {
  const getCompileStatusBadge = () => {
    switch (compileStatus) {
      case 'compiling':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Compiling
          </Badge>
        );
      case 'success':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Compiled
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const getLastSavedText = () => {
    if (!lastSaved) return "Never saved";
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return "Saved just now";
    if (diffMinutes === 1) return "Saved 1 minute ago";
    if (diffMinutes < 60) return `Saved ${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return "Saved 1 hour ago";
    if (diffHours < 24) return `Saved ${diffHours} hours ago`;
    
    return `Saved ${lastSaved.toLocaleDateString()}`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm">
      {/* Left Side - Main Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant={hasUnsavedChanges ? "default" : "ghost"}
          size="sm"
          onClick={onSave}
          className={hasUnsavedChanges 
            ? "bg-chipforge-waveform text-slate-900 hover:bg-chipforge-waveform/80" 
            : "text-slate-400 hover:text-slate-200"
          }
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        <div className="h-6 w-px bg-slate-700"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="text-slate-400 hover:text-slate-200 disabled:opacity-30"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="text-slate-400 hover:text-slate-200 disabled:opacity-30"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-slate-700"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRunSimulation}
          disabled={simulationRunning || compileStatus === 'error'}
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-30"
        >
          {simulationRunning ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {simulationRunning ? 'Running...' : 'Simulate'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="text-slate-400 hover:text-slate-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Center - Status */}
      <div className="flex items-center gap-3">
        {getCompileStatusBadge()}
        
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{getLastSavedText()}</span>
          {hasUnsavedChanges && (
            <span className="text-yellow-400">• Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Right Side - Settings & AI */}
      <div className="flex items-center gap-2">
        <Button
          variant={aiAssistEnabled ? "default" : "ghost"}
          size="sm"
          onClick={onToggleAI}
          className={aiAssistEnabled 
            ? "bg-purple-500 text-white hover:bg-purple-400" 
            : "text-slate-400 hover:text-slate-200"
          }
        >
          <Zap className="h-4 w-4 mr-2" />
          AI Assist
        </Button>
        
        <div className="h-6 w-px bg-slate-700"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="text-slate-400 hover:text-slate-200"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;