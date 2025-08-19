import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  CircuitBoard, 
  Code, 
  TestTube, 
  Cpu, 
  Layers, 
  Download,
  Home,
  FileText,
  BookOpen,
  Monitor,
  Settings,
  Users,
  GitBranch,
  BarChart3,
  Zap,
  Thermometer,
  Eye,
  Shield,
  Package,
  Globe,
  MessageSquare,
  Play,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Main navigation structure - simplified without Design Flow dropdown
const MAIN_NAVIGATION = [
  {
    label: "Tools",
    icon: Settings,
    items: [
      { 
        label: "Templates", 
        path: "/templates", 
        icon: FileText,
        description: "Pre-built design templates"
      },
      { 
        label: "Learning", 
        path: "/learning", 
        icon: BookOpen,
        description: "Tutorials and documentation"
      },
      { 
        label: "Workspace", 
        path: "/workspace", 
        icon: Monitor,
        description: "Integrated design environment"
      },
      {
        label: "Waveform Planner",
        path: "/waveform",
        icon: TestTube,
        description: "Define signal waveforms and generate testbenches"
      },
      {
        label: "New Project",
        path: "/new-project",
        icon: Layers,
        description: "Start a new chip design project"
      },
      {
        label: "Test Error Boundaries",
        path: "/test-error-boundaries",
        icon: AlertCircle,
        description: "Test error handling and boundaries"
      }
    ]
  }
];

// Workflow progress tracking
const WORKFLOW_STAGES = [
  { id: 'schematic', label: 'Schematic Design', path: '/workspace', status: 'pending' },
  { id: 'waveform', label: 'Waveform Planning', path: '/waveform', status: 'pending' },
  { id: 'hdl', label: 'HDL Code', path: '/hdl-generator', status: 'pending' },
  { id: 'simulation', label: 'Simulation', path: '/test-native-simulator', status: 'pending' },
  { id: 'synthesis', label: 'Synthesis', path: '/advanced-chip-design', status: 'pending' },
  { id: 'layout', label: 'Layout', path: '/advanced-layout-designer', status: 'pending' },
  { id: 'export', label: 'Export', path: '/export', status: 'pending' }
];

export default function TopNav() {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { guidedMode, setGuidedMode } = useHDLDesignStore();

  // Determine current workflow stage
  const getCurrentStage = () => {
    const currentPath = location.pathname;
    return WORKFLOW_STAGES.find(stage => currentPath.startsWith(stage.path)) || WORKFLOW_STAGES[0];
  };

  const currentStage = getCurrentStage();

  // Get workflow progress
  const getWorkflowProgress = () => {
    const currentIndex = WORKFLOW_STAGES.findIndex(stage => stage.id === currentStage.id);
    return Math.max(0, currentIndex);
  };

  const progress = getWorkflowProgress();

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between z-50 sticky top-0">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-slate-200 hover:text-cyan-400 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <CircuitBoard className="h-4 w-4 text-slate-900" />
          </div>
          <span className="font-bold text-lg">ChipForge</span>
        </Link>
        
        <div className="h-6 w-px bg-slate-700"></div>
        
        {/* Workflow Progress */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Chip Design Workflow:</span>
          <div className="flex items-center gap-1">
            {WORKFLOW_STAGES.map((stage, index) => (
              <React.Fragment key={stage.id}>
                <Link
                  to={stage.path}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    index <= progress 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {stage.label}
                </Link>
                {index < WORKFLOW_STAGES.length - 1 && (
                  <div className="w-2 h-px bg-slate-600"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center gap-2">
        {MAIN_NAVIGATION.map((section) => (
          <DropdownMenu key={section.label} open={activeDropdown === section.label} onOpenChange={(open) => setActiveDropdown(open ? section.label : null)}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeDropdown === section.label 
                    ? 'bg-slate-800 text-cyan-400' 
                    : 'text-slate-200 hover:bg-slate-800 hover:text-cyan-400'
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 bg-slate-800 border-slate-700">
              <div className="p-2">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">{section.label}</h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 text-slate-200 hover:text-cyan-400 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-slate-400">{item.description}</div>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Guided Mode Toggle */}
        <Button
          variant={guidedMode.isActive ? "default" : "outline"}
          size="sm"
          onClick={() => setGuidedMode(!guidedMode.isActive)}
          className={`flex items-center gap-2 ${
            guidedMode.isActive 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'text-slate-400 hover:text-slate-200 border-slate-600'
          }`}
          title={guidedMode.isActive ? "Disable Guided Mode" : "Enable Guided Mode"}
        >
          <Lightbulb className="h-4 w-4" />
          {guidedMode.isActive ? "ON" : "OFF"}
        </Button>
        
        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
        
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
} 