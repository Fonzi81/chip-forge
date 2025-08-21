import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface WaveformSignal {
  name: string;
  type: 'clock' | 'reset' | 'data';
  values: Array<{
    time: number;
    value: number;
    annotation: string;
  }>;
  annotations: string[];
}

interface WaveformCanvasProps {
  signals: WaveformSignal[];
  timeResolution: string;
  simulationTime: number;
  clockPeriod: number;
  setupTime: number;
  holdTime: number;
  onExport: () => void;
}

export default function WaveformCanvas({
  signals,
  timeResolution,
  simulationTime,
  clockPeriod,
  setupTime,
  holdTime,
  onExport
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.5); // Add playback speed control

  // Canvas dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const SIGNAL_HEIGHT = 60;
  const TIMELINE_HEIGHT = 40;
  const MARGIN = 20;

  // Parse time resolution to get numeric value
  const parseTimeResolution = (resolution: string): number => {
    const match = resolution.match(/(\d+)(ns|ps|us|ms)/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case 'ps': return value * 0.001;
        case 'ns': return value;
        case 'us': return value * 1000;
        case 'ms': return value * 1000000;
        default: return value;
      }
    }
    return 10; // Default to 10ns if parsing fails
  };

  // Get time resolution in nanoseconds
  const timeResolutionNs = parseTimeResolution(timeResolution);

  // Animation frame for playback
  useEffect(() => {
    let animationId: number;
    
    if (isPlaying) {
      const animate = () => {
        setCurrentTime(prev => {
          // Slower, more reasonable playback speed
          const newTime = prev + (timeResolutionNs * playbackSpeed);
          if (newTime >= simulationTime) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying, timeResolutionNs, simulationTime, playbackSpeed]);

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || signals.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Set background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    drawGrid(ctx);

    // Draw signals
    signals.forEach((signal, index) => {
      drawSignal(ctx, signal, index);
    });

    // Draw timeline
    drawTimeline(ctx);

    // Draw current time indicator
    drawCurrentTimeIndicator(ctx);

  }, [signals, currentTime, zoomLevel, panOffset, timeResolution, simulationTime]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#334155'; // slate-600
    ctx.lineWidth = 0.5;

    // Vertical grid lines (time) - use clock period or time resolution
    const timeStep = Math.max(clockPeriod, timeResolutionNs) * zoomLevel;
    for (let x = 0; x < CANVAS_WIDTH; x += timeStep) {
      ctx.beginPath();
      ctx.moveTo(x + panOffset, 0);
      ctx.lineTo(x + panOffset, CANVAS_HEIGHT - TIMELINE_HEIGHT);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = 0; y < CANVAS_HEIGHT - TIMELINE_HEIGHT; y += SIGNAL_HEIGHT) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  };

  const drawSignal = (ctx: CanvasRenderingContext2D, signal: WaveformSignal, index: number) => {
    const y = index * SIGNAL_HEIGHT + MARGIN;
    const signalWidth = CANVAS_WIDTH - 2 * MARGIN;

    // Draw signal name
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.font = '12px monospace';
    ctx.fillText(signal.name, MARGIN, y + 15);

    // Draw signal type indicator
    const typeColors = {
      clock: '#3b82f6',    // blue-500
      reset: '#ef4444',    // red-500
      data: '#10b981'      // emerald-500
    };
    ctx.fillStyle = typeColors[signal.type];
    ctx.fillRect(CANVAS_WIDTH - 80, y, 60, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(signal.type, CANVAS_WIDTH - 75, y + 14);

    // Draw signal waveform
    ctx.strokeStyle = typeColors[signal.type];
    ctx.lineWidth = 2;

    if (signal.values.length > 1) {
      ctx.beginPath();
      signal.values.forEach((value, i) => {
        const x = (value.time / simulationTime) * signalWidth + MARGIN;
        const signalY = y + 30 + (value.value === 1 ? 0 : 20);
        
        if (i === 0) {
          ctx.moveTo(x, signalY);
        } else {
          ctx.lineTo(x, signalY);
        }
      });
      ctx.stroke();
    }

    // Draw signal values
    signal.values.forEach((value) => {
      const x = (value.time / simulationTime) * signalWidth + MARGIN;
      const signalY = y + 30 + (value.value === 1 ? 0 : 20);
      
      ctx.fillStyle = typeColors[signal.type];
      ctx.beginPath();
      ctx.arc(x, signalY, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Draw annotation on hover
      if (Math.abs(x - currentTime) < 10) {
        ctx.fillStyle = '#fbbf24'; // amber-400
        ctx.font = '10px monospace';
        ctx.fillText(value.annotation, x + 5, signalY - 5);
      }
    });
  };

  const drawTimeline = (ctx: CanvasRenderingContext2D) => {
    const y = CANVAS_HEIGHT - TIMELINE_HEIGHT;
    
    // Timeline background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, y, CANVAS_WIDTH, TIMELINE_HEIGHT);

    // Time markers
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.font = '10px monospace';
    
    const timeStep = Math.max(clockPeriod, timeResolutionNs) * zoomLevel;
    for (let t = 0; t <= simulationTime; t += timeStep) {
      const x = (t / simulationTime) * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
      ctx.fillText(`${t}ns`, x, y + 15);
    }

    // Current time indicator
    const currentX = (currentTime / simulationTime) * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
    ctx.strokeStyle = '#fbbf24'; // amber-400
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, y);
    ctx.lineTo(currentX, y + TIMELINE_HEIGHT);
    ctx.stroke();
  };

  const drawCurrentTimeIndicator = (ctx: CanvasRenderingContext2D) => {
    const currentX = (currentTime / simulationTime) * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
    
    // Draw vertical line across all signals
    ctx.strokeStyle = '#fbbf24'; // amber-400
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, CANVAS_HEIGHT - TIMELINE_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert click to time
    const clickTime = (x - MARGIN) / (CANVAS_WIDTH - 2 * MARGIN) * simulationTime;
    setCurrentTime(Math.max(0, Math.min(simulationTime, clickTime)));

    // Check if clicking on signal
    const signalIndex = Math.floor((y - MARGIN) / SIGNAL_HEIGHT);
    if (signalIndex >= 0 && signalIndex < signals.length) {
      setSelectedSignal(signals[signalIndex].name);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const stepBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - timeResolutionNs * 5));
  };

  const stepForward = () => {
    setCurrentTime(prev => Math.min(simulationTime, prev + timeResolutionNs * 5));
  };

  const reset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.1));
  };

  return (
    <Card className="bg-slate-800 border-slate-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-200">Waveform Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Waveform Canvas */}
        <div className="mb-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-slate-600 rounded cursor-crosshair"
            onClick={handleCanvasClick}
          />
        </div>

        {/* Timeline Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={togglePlayback}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              size="sm"
              onClick={stepBackward}
              className="bg-slate-600 hover:bg-slate-700 text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={stepForward}
              className="bg-slate-600 hover:bg-slate-700 text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={reset}
              className="bg-slate-600 hover:bg-slate-700 text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {/* Playback Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Speed:</span>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-20 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-slate-400 w-8">{playbackSpeed.toFixed(1)}x</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={zoomOut}
                className="bg-slate-600 hover:bg-slate-700 text-white"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-slate-400">Zoom: {zoomLevel.toFixed(1)}x</span>
              <Button
                size="sm"
                onClick={zoomIn}
                className="bg-slate-600 hover:bg-slate-700 text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>Current Time: {currentTime.toFixed(1)} ns</span>
          <span>Total Time: {simulationTime} ns</span>
          <span>Resolution: {timeResolution}</span>
        </div>

        {/* Signal Legend */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Clock Signals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-300">Reset Signals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span className="text-slate-300">Data Signals</span>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4">
          <Button
            onClick={onExport}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Export Waveform
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
