import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import { WaveformData, WaveformTrace } from '@/components/design-editor/types';

interface WaveformCanvasProps {
  waveformData: WaveformData;
  zoomLevel: number;
  timeOffset: number;
  selectedSignal: string | null;
  timeCursor: number | null;
  measurementStart: number | null;
  measurementEnd: number | null;
  highlightedSignals: Set<string>;
  onSignalSelect: (signal: string | null) => void;
  onTimeOffsetChange: (offset: number) => void;
  onTimeCursorChange: (time: number | null) => void;
  onMeasurementStart: (time: number | null) => void;
  onMeasurementEnd: (time: number | null) => void;
  onSignalHighlight: (signal: string) => void;
}

const WaveformCanvas = React.memo(({ 
  waveformData, 
  zoomLevel, 
  timeOffset, 
  selectedSignal,
  timeCursor,
  measurementStart,
  measurementEnd,
  highlightedSignals,
  onSignalSelect,
  onTimeOffsetChange,
  onTimeCursorChange,
  onMeasurementStart,
  onMeasurementEnd,
  onSignalHighlight
}: WaveformCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [hoveredSignal, setHoveredSignal] = useState<string | null>(null);

  const SIGNAL_HEIGHT = 40;
  const SIGNAL_SPACING = 50;
  const LABEL_WIDTH = 120;
  const TIME_SCALE = 100; // pixels per time unit

  // Memoize expensive calculations
  const processedData = useMemo(() => {
    if (!waveformData) return [];
    return waveformData.traces.map(trace => ({
      ...trace,
      values: trace.values.filter((_, index) => index % Math.max(1, Math.floor(1 / zoomLevel)) === 0)
    }));
  }, [waveformData, zoomLevel]);

  useEffect(() => {
    drawWaveforms();
  }, [waveformData, zoomLevel, timeOffset, timeCursor, measurementStart, measurementEnd, highlightedSignals, selectedSignal]);

  const drawWaveforms = () => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const scaledTimeScale = TIME_SCALE * zoomLevel;
    
    // Clear canvas
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Draw signals with highlighting
    processedData.forEach((trace: WaveformTrace, index: number) => {
      const y = index * SIGNAL_SPACING + 30;
      const isHighlighted = highlightedSignals.has(trace.name);
      const isSelected = selectedSignal === trace.name;
      
      // Draw background highlight for selected/highlighted signals
      if (isSelected || isHighlighted) {
        ctx.fillStyle = isSelected ? '#8b5cf6' : '#059669'; // purple or emerald
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, y - SIGNAL_HEIGHT/2 - 5, width, SIGNAL_HEIGHT + 10);
        ctx.globalAlpha = 1;
      }
      
      if (trace.type === 'clock') {
        drawClockSignal(ctx, trace, y, scaledTimeScale, timeOffset, isHighlighted || isSelected);
      } else if (trace.type === 'bus') {
        drawBusSignal(ctx, trace, y, scaledTimeScale, timeOffset, isHighlighted || isSelected);
      } else {
        drawDigitalSignal(ctx, trace, y, scaledTimeScale, timeOffset, isHighlighted || isSelected);
      }
    });

    // Draw measurement area
    if (measurementStart !== null && measurementEnd !== null) {
      const startX = (measurementStart - timeOffset) * scaledTimeScale;
      const endX = (measurementEnd - timeOffset) * scaledTimeScale;
      
      ctx.fillStyle = '#f59e0b'; // amber-500
      ctx.globalAlpha = 0.2;
      ctx.fillRect(Math.min(startX, endX), 0, Math.abs(endX - startX), height);
      ctx.globalAlpha = 1;
      
      // Draw measurement lines
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      [startX, endX].forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });
      
      // Draw measurement value
      const midX = (startX + endX) / 2;
      const duration = Math.abs(measurementEnd - measurementStart);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '14px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`Δt: ${duration.toFixed(1)}ns`, midX, 20);
    }

    // Draw time cursor (persistent)
    if (timeCursor !== null) {
      const x = (timeCursor - timeOffset) * scaledTimeScale;
      ctx.strokeStyle = '#10b981'; // emerald-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      // Time value at cursor
      ctx.fillStyle = '#10b981';
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`${timeCursor.toFixed(1)}ns`, x, height - 10);
    }

    // Draw time cursor if hovering (temporary)
    if (hoveredTime !== null) {
      const x = (hoveredTime - timeOffset) * scaledTimeScale;
      ctx.strokeStyle = '#94a3b8'; // slate-400
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const drawClockSignal = (ctx: CanvasRenderingContext2D, trace: WaveformTrace, y: number, timeScale: number, offset: number, highlighted = false) => {
    ctx.strokeStyle = highlighted ? '#14f195' : '#10b981'; // brighter if highlighted
    ctx.lineWidth = highlighted ? 3 : 2;
    
    const period = 10; // 10ns period
    const startTime = Math.max(0, offset);
    const endTime = startTime + (ctx.canvas.width / timeScale);
    
    ctx.beginPath();
    for (let t = startTime; t <= endTime; t += 0.5) {
      const x = (t - offset) * timeScale;
      const high = Math.floor(t / period) % 2 === 0;
      const signalY = y + (high ? -SIGNAL_HEIGHT/2 : SIGNAL_HEIGHT/2);
      
      if (t === startTime) {
        ctx.moveTo(x, signalY);
      } else {
        ctx.lineTo(x, signalY);
      }
    }
    ctx.stroke();
  };

  const drawBusSignal = (ctx: CanvasRenderingContext2D, trace: WaveformTrace, y: number, timeScale: number, offset: number, highlighted = false) => {
    ctx.strokeStyle = highlighted ? '#a855f7' : '#8b5cf6'; // brighter if highlighted
    ctx.fillStyle = highlighted ? '#a855f7' : '#8b5cf6';
    ctx.lineWidth = highlighted ? 3 : 2;
    
    const values = trace.values || ['0000', '0001', '0010', '0011'];
    const transitionTime = 100; // ns between transitions
    
    values.forEach((value: string, index: number) => {
      const startX = (index * transitionTime - offset) * timeScale;
      const endX = ((index + 1) * transitionTime - offset) * timeScale;
      
      if (endX > 0 && startX < ctx.canvas.width) {
        // Draw bus representation (trapezoid)
        ctx.beginPath();
        ctx.moveTo(Math.max(0, startX), y - SIGNAL_HEIGHT/3);
        ctx.lineTo(Math.min(ctx.canvas.width, endX - 5), y - SIGNAL_HEIGHT/3);
        ctx.lineTo(Math.min(ctx.canvas.width, endX), y);
        ctx.lineTo(Math.min(ctx.canvas.width, endX - 5), y + SIGNAL_HEIGHT/3);
        ctx.lineTo(Math.max(0, startX), y + SIGNAL_HEIGHT/3);
        ctx.lineTo(Math.max(0, startX + 5), y);
        ctx.closePath();
        ctx.stroke();
        
        // Draw value text
        const textX = (startX + endX) / 2;
        if (textX > 20 && textX < ctx.canvas.width - 20) {
          ctx.fillStyle = '#e2e8f0'; // slate-200
          ctx.font = '12px JetBrains Mono';
          ctx.textAlign = 'center';
          ctx.fillText(value, textX, y + 4);
        }
      }
    });
  };

  const drawDigitalSignal = (ctx: CanvasRenderingContext2D, trace: WaveformTrace, y: number, timeScale: number, offset: number, highlighted = false) => {
    ctx.strokeStyle = highlighted ? '#22d3ee' : '#06b6d4'; // brighter if highlighted
    ctx.lineWidth = highlighted ? 3 : 2;
    
    const values = trace.values || ['0', '1', '0', '1'];
    const transitionTime = 100; // ns between transitions
    
    ctx.beginPath();
    values.forEach((value: string, index: number) => {
      const startX = (index * transitionTime - offset) * timeScale;
      const endX = ((index + 1) * transitionTime - offset) * timeScale;
      const signalY = y + (value === '1' ? -SIGNAL_HEIGHT/2 : SIGNAL_HEIGHT/2);
      
      if (index === 0) {
        ctx.moveTo(Math.max(0, startX), signalY);
      }
      
      ctx.lineTo(Math.min(ctx.canvas.width, endX), signalY);
      
      // Vertical transition
      if (index < values.length - 1) {
        const nextValue = values[index + 1];
        const nextY = y + (nextValue === '1' ? -SIGNAL_HEIGHT/2 : SIGNAL_HEIGHT/2);
        ctx.lineTo(Math.min(ctx.canvas.width, endX), nextY);
      }
    });
    ctx.stroke();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate time position
    const time = timeOffset + (x / (TIME_SCALE * zoomLevel));
    setHoveredTime(time);

    // Determine hovered signal
    const signalIndex = Math.floor(y / SIGNAL_SPACING);
    const signal = waveformData?.traces[signalIndex]?.name || null;
    setHoveredSignal(signal);
  };

  const handleMouseLeave = () => {
    setHoveredTime(null);
    setHoveredSignal(null);
  };

  const handleSignalClick = (signalName: string) => {
    onSignalSelect(signalName === selectedSignal ? null : signalName);
  };

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = timeOffset + (x / (TIME_SCALE * zoomLevel));

    if (event.ctrlKey || event.metaKey) {
      // Set time cursor on Ctrl/Cmd + click
      onTimeCursorChange(time);
    } else if (event.shiftKey) {
      // Measurement mode with Shift + click
      if (measurementStart === null) {
        onMeasurementStart(time);
      } else if (measurementEnd === null) {
        onMeasurementEnd(time);
      } else {
        // Reset and start new measurement
        onMeasurementStart(time);
        onMeasurementEnd(null);
      }
    }
  }, [onSignalSelect, timeOffset, zoomLevel, timeCursor, measurementStart, measurementEnd, onTimeCursorChange, onMeasurementStart, onMeasurementEnd]);

  const handleSignalDoubleClick = (signalName: string) => {
    onSignalHighlight(signalName);
  };

  return (
    <div className="h-full flex" ref={containerRef}>
      {/* Signal Labels */}
      <div 
        className="bg-slate-800/50 border-r border-slate-700" 
        style={{ width: LABEL_WIDTH }}
      >
        <div className="p-2 border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono">Signals</span>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {waveformData?.traces.map((trace: WaveformTrace, index: number) => (
              <div
                key={trace.name}
                onClick={() => handleSignalClick(trace.name)}
                onDoubleClick={() => handleSignalDoubleClick(trace.name)}
                className={`
                  p-2 rounded cursor-pointer transition-colors font-mono text-sm relative
                  ${selectedSignal === trace.name 
                    ? 'bg-chipforge-waveform/20 text-chipforge-waveform border border-chipforge-waveform/30' 
                    : highlightedSignals.has(trace.name)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50'
                  }
                `}
                style={{ height: SIGNAL_HEIGHT }}
                title="Click to select, double-click to highlight"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{trace.name}</span>
                  <div className="flex items-center gap-1">
                    {highlightedSignals.has(trace.name) && (
                      <Eye className="h-3 w-3 text-emerald-400" />
                    )}
                    {trace.type === 'bus' && (
                      <span className="text-xs text-slate-500">[{trace.width-1}:0]</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Waveform Canvas */}
      <div className="flex-1 overflow-auto">
        <canvas
          ref={canvasRef}
          width={1200}
          height={waveformData?.traces.length * SIGNAL_SPACING + 50 || 400}
          className="block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
        />
      </div>

      {/* Tooltip */}
      {hoveredTime !== null && hoveredSignal && (
        <div className="absolute pointer-events-none bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs font-mono text-slate-200 z-10">
          <div>{hoveredSignal}</div>
          <div>{Math.round(hoveredTime)}ns</div>
        </div>
      )}
    </div>
  );
});

export default WaveformCanvas;