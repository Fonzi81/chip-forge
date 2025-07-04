import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  FileCode, 
  Play, 
  Settings, 
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface HDLFile {
  id: string;
  name: string;
  type: 'verilog' | 'vhdl' | 'systemverilog' | 'testbench' | 'constraint';
  content: string;
  hasErrors: boolean;
  path: string;
}

interface FileExplorerProps {
  files: HDLFile[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (name: string, type: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
}

const FileExplorer = ({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename
}: FileExplorerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'tb', 'constraints']));

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'verilog':
      case 'systemverilog':
        return <FileCode className="h-4 w-4 text-emerald-400" />;
      case 'vhdl':
        return <FileCode className="h-4 w-4 text-blue-400" />;
      case 'testbench':
        return <Play className="h-4 w-4 text-purple-400" />;
      case 'constraint':
        return <Settings className="h-4 w-4 text-orange-400" />;
      default:
        return <File className="h-4 w-4 text-slate-400" />;
    }
  };

  const getFileExtension = (type: string) => {
    switch (type) {
      case 'verilog': return '.v';
      case 'systemverilog': return '.sv';
      case 'vhdl': return '.vhd';
      case 'testbench': return '_tb.v';
      case 'constraint': return '.xdc';
      default: return '.txt';
    }
  };

  const groupedFiles = {
    src: files.filter(f => f.type === 'verilog' || f.type === 'systemverilog' || f.type === 'vhdl'),
    tb: files.filter(f => f.type === 'testbench'),
    constraints: files.filter(f => f.type === 'constraint')
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const extension = getFileExtension('verilog');
      const fullName = newFileName.endsWith('.v') || newFileName.endsWith('.sv') || newFileName.endsWith('.vhd') 
        ? newFileName 
        : newFileName + extension;
      onFileCreate(fullName, 'verilog');
      setNewFileName("");
      setIsCreating(false);
    }
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileGroup = (title: string, files: HDLFile[], folderKey: string) => {
    const isExpanded = expandedFolders.has(folderKey);
    
    return (
      <div key={folderKey} className="mb-2">
        <div
          className="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-slate-800/50 group"
          onClick={() => toggleFolder(folderKey)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-slate-400" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-400" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-chipforge-accent" />
          ) : (
            <Folder className="h-4 w-4 text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-300">{title}</span>
          <Badge variant="outline" className="text-xs ml-auto opacity-60">
            {files.length}
          </Badge>
        </div>
        
        {isExpanded && (
          <div className="ml-6 mt-1 space-y-0.5">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => onFileSelect(file.id)}
                className={`
                  flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors group text-sm
                  ${activeFileId === file.id 
                    ? "bg-chipforge-waveform/20 text-chipforge-waveform border border-chipforge-waveform/30" 
                    : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                  }
                `}
              >
                {getFileIcon(file.type)}
                <span className="flex-1 truncate font-mono">{file.name}</span>
                {file.hasErrors && (
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileDelete(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-slate-900/30 border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-semibold text-slate-200">Project Files</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="h-6 w-6 p-0 text-chipforge-accent hover:text-chipforge-waveform"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {isCreating && (
          <div className="space-y-2">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.v"
              className="bg-slate-800/50 border-slate-600 text-slate-100 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFile();
                } else if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewFileName("");
                }
              }}
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleCreateFile}
                className="bg-chipforge-waveform text-slate-900 hover:bg-chipforge-waveform/80 text-xs h-7"
              >
                Create
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewFileName("");
                }}
                className="text-slate-400 hover:text-slate-200 text-xs h-7"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* File Tree */}
      <div className="flex-1 p-2 overflow-y-auto">
        {renderFileGroup("Source Files", groupedFiles.src, "src")}
        {renderFileGroup("Testbenches", groupedFiles.tb, "tb")}
        {renderFileGroup("Constraints", groupedFiles.constraints, "constraints")}
      </div>

      {/* Stats Footer */}
      <div className="p-2 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>{files.length} files</span>
          <span>{files.filter(f => f.hasErrors).length} errors</span>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;