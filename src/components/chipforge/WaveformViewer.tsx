import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Maximize2,
  RotateCcw,
  Ruler,
  Target,
  Eye,
  FileImage
} from "lucide-react";
import WaveformCanvas from "./WaveformCanvas";

interface WaveformViewerProps {
  waveformData: any;
  isComplete: boolean;
}

const WaveformViewer = ({ waveformData, isComplete }: WaveformViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [timeOffset, setTimeOffset] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [timeCursor, setTimeCursor] = useState<number | null>(null);
  const [measurementStart, setMeasurementStart] = useState<number | null>(null);
  const [measurementEnd, setMeasurementEnd] = useState<number | null>(null);
  const [highlightedSignals, setHighlightedSignals] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.1));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setTimeOffset(0);
  };

  const handleDownloadVCD = () => {
    // Mock VCD download - replace with actual implementation
    const blob = new Blob(['// Mock VCD file content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waveform.vcd';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    // Export waveform as PNG
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'waveform.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const toggleMeasurement = () => {
    if (measurementStart && measurementEnd) {
      setMeasurementStart(null);
      setMeasurementEnd(null);
    } else {
      // Start measurement mode
    }
  };

  const toggleSignalHighlight = (signal: string) => {
    setHighlightedSignals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(signal)) {
        newSet.delete(signal);
      } else {
        newSet.add(signal);
      }
      return newSet;
    });
  };

  const getMeasurementDuration = () => {
    if (measurementStart !== null && measurementEnd !== null) {
      return Math.abs(measurementEnd - measurementStart);
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-chipforge-waveform" />
          <span className="font-display font-semibold text-slate-200">Waveform Viewer</span>
          {isComplete && (
            <Badge className="bg-chipforge-accent/20 text-chipforge-accent border-chipforge-accent/30 ml-2">
              Simulation Complete
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-md p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomOut}
              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <div className="px-2 text-xs text-slate-300 font-mono min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomIn}
              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-200"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMeasurement}
            className={`text-slate-400 hover:text-slate-200 ${
              measurementStart !== null || measurementEnd !== null ? 'bg-chipforge-accent/20' : ''
            }`}
            title="Measurement Tool"
          >
            <Ruler className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-slate-200"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-md p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownloadVCD}
              className="h-7 px-2 text-slate-400 hover:text-slate-200 text-xs"
              title="Download VCD"
            >
              <Download className="h-3 w-3 mr-1" />
              VCD
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownloadPNG}
              className="h-7 px-2 text-slate-400 hover:text-slate-200 text-xs"
              title="Export as PNG"
            >
              <FileImage className="h-3 w-3 mr-1" />
              PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Waveform Display */}
      <div className="flex-1 overflow-hidden">
        {isComplete && waveformData ? (
          <WaveformCanvas 
            waveformData={waveformData}
            zoomLevel={zoomLevel}
            timeOffset={timeOffset}
            selectedSignal={selectedSignal}
            timeCursor={timeCursor}
            measurementStart={measurementStart}
            measurementEnd={measurementEnd}
            highlightedSignals={highlightedSignals}
            onSignalSelect={setSelectedSignal}
            onTimeOffsetChange={setTimeOffset}
            onTimeCursorChange={setTimeCursor}
            onMeasurementStart={setMeasurementStart}
            onMeasurementEnd={setMeasurementEnd}
            onSignalHighlight={toggleSignalHighlight}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="mb-2 text-slate-400">Waveforms will appear here after simulation</p>
              <p className="text-sm">Configure your inputs and click "Run Simulation"</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {isComplete && waveformData && (
        <div className="border-t border-slate-700 bg-slate-800/50 p-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span>0 ns</span>
              <span>Time Scale: {waveformData.timeScale}</span>
              <span>{waveformData.duration} ns</span>
            </div>
            
            <div className="flex items-center gap-4">
              {getMeasurementDuration() !== null && (
                <div className="flex items-center gap-2 text-amber-400">
                  <Ruler className="h-3 w-3" />
                  <span>Δt: {getMeasurementDuration()?.toFixed(1)}ns</span>
                </div>
              )}
              
              {timeCursor !== null && (
                <div className="flex items-center gap-2 text-chipforge-accent">
                  <Target className="h-3 w-3" />
                  <span>Cursor: {timeCursor.toFixed(1)}ns</span>
                </div>
              )}
              
              <div className="text-slate-500 text-xs">
                Ctrl+Click: Cursor | Shift+Click: Measure | Double-click: Highlight
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaveformViewer;