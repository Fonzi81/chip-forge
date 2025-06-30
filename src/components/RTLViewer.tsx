
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Download, 
  Layers, 
  Eye,
  RotateCcw
} from "lucide-react";

const RTLViewer = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<"netlist" | "logic-cone" | "io-map">("netlist");

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));
  const handleReset = () => setZoomLevel(100);

  return (
    <div className="h-full flex flex-col">
      {/* RTL Viewer Controls */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">RTL Diagram</span>
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant={viewMode === "netlist" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("netlist")}
              className={viewMode === "netlist" ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-slate-200"}
            >
              Netlist
            </Button>
            <Button
              variant={viewMode === "logic-cone" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("logic-cone")}
              className={viewMode === "logic-cone" ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-slate-200"}
            >
              Logic Cone
            </Button>
            <Button
              variant={viewMode === "io-map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("io-map")}
              className={viewMode === "io-map" ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-slate-200"}
            >
              I/O Map
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{zoomLevel}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-slate-400 hover:text-slate-200">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-slate-400 hover:text-slate-200">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-slate-200">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
            <Move className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* RTL Canvas */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/50">
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Mock RTL Diagram */}
          <svg width="600" height="400" className="border border-slate-700 rounded-lg bg-slate-800/50">
            {/* ALU Block */}
            <rect x="250" y="150" width="100" height="100" fill="none" stroke="#10b981" strokeWidth="2" rx="8" />
            <text x="300" y="175" textAnchor="middle" fill="#10b981" className="text-sm font-mono">ALU</text>
            <text x="300" y="195" textAnchor="middle" fill="#10b981" className="text-xs">4-bit</text>
            
            {/* Input A */}
            <rect x="50" y="160" width="80" height="30" fill="none" stroke="#06b6d4" strokeWidth="1" rx="4" />
            <text x="90" y="180" textAnchor="middle" fill="#06b6d4" className="text-xs">A[3:0]</text>
            <line x1="130" y1="175" x2="250" y2="175" stroke="#06b6d4" strokeWidth="2" />
            
            {/* Input B */}
            <rect x="50" y="210" width="80" height="30" fill="none" stroke="#06b6d4" strokeWidth="1" rx="4" />
            <text x="90" y="230" textAnchor="middle" fill="#06b6d4" className="text-xs">B[3:0]</text>
            <line x1="130" y1="225" x2="250" y2="225" stroke="#06b6d4" strokeWidth="2" />
            
            {/* Operation Input */}
            <rect x="150" y="90" width="80" height="30" fill="none" stroke="#8b5cf6" strokeWidth="1" rx="4" />
            <text x="190" y="110" textAnchor="middle" fill="#8b5cf6" className="text-xs">OP[2:0]</text>
            <line x1="190" y1="120" x2="300" y2="150" stroke="#8b5cf6" strokeWidth="2" />
            
            {/* Result Output */}
            <rect x="470" y="160" width="80" height="30" fill="none" stroke="#f59e0b" strokeWidth="1" rx="4" />
            <text x="510" y="180" textAnchor="middle" fill="#f59e0b" className="text-xs">Result[3:0]</text>
            <line x1="350" y1="175" x2="470" y2="175" stroke="#f59e0b" strokeWidth="2" />
            
            {/* Carry Output */}
            <rect x="470" y="210" width="80" height="30" fill="none" stroke="#f59e0b" strokeWidth="1" rx="4" />
            <text x="510" y="230" textAnchor="middle" fill="#f59e0b" className="text-xs">Carry</text>
            <line x1="350" y1="225" x2="470" y2="225" stroke="#f59e0b" strokeWidth="2" />
            
            {/* Connection dots */}
            <circle cx="250" cy="175" r="3" fill="#10b981" />
            <circle cx="250" cy="225" r="3" fill="#10b981" />
            <circle cx="350" cy="175" r="3" fill="#10b981" />
            <circle cx="350" cy="225" r="3" fill="#10b981" />
          </svg>
        </div>

        {/* Net Trace Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm font-medium text-slate-300">Net Trace</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>Signal: result[3:0]</div>
            <div>Driver: alu_4bit.result</div>
            <div>Fanout: 1</div>
          </div>
        </div>

        {/* Block Info Panel */}
        <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">Block Info</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>Module: alu_4bit</div>
            <div>Inputs: 11</div>
            <div>Outputs: 5</div>
            <div>Logic Gates: 24</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTLViewer;
