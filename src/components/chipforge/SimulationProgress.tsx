import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Cpu,
  FileText,
  Zap
} from "lucide-react";

interface SimulationProgressProps {
  stage: 'idle' | 'compiling' | 'running' | 'processing' | 'complete';
  progress: number;
  message: string;
  isRunning: boolean;
}

const SimulationProgress = ({ stage, progress, message, isRunning }: SimulationProgressProps) => {
  const getStageIcon = (stageName: string, isActive: boolean, isComplete: boolean) => {
    const baseClasses = "h-4 w-4 transition-colors duration-300";
    
    if (isComplete) {
      return <CheckCircle2 className={`${baseClasses} text-chipforge-accent`} />;
    } else if (isActive) {
      return <Loader2 className={`${baseClasses} text-chipforge-waveform animate-spin`} />;
    } else {
      const iconMap = {
        compiling: <FileText className={`${baseClasses} text-slate-500`} />,
        running: <Zap className={`${baseClasses} text-slate-500`} />,
        processing: <Cpu className={`${baseClasses} text-slate-500`} />,
        complete: <CheckCircle2 className={`${baseClasses} text-slate-500`} />
      };
      return iconMap[stageName as keyof typeof iconMap] || <Clock className={`${baseClasses} text-slate-500`} />;
    }
  };

  const getStageProgress = (stageName: string) => {
    const stageOrder = ['compiling', 'running', 'processing', 'complete'];
    const currentIndex = stageOrder.indexOf(stage);
    const stageIndex = stageOrder.indexOf(stageName);
    
    if (stageIndex < currentIndex) return 100;
    if (stageIndex > currentIndex) return 0;
    return progress;
  };

  const stages = [
    { name: 'compiling', label: 'Compilation', description: 'Parsing HDL & generating model' },
    { name: 'running', label: 'Simulation', description: 'Running test vectors' },
    { name: 'processing', label: 'Processing', description: 'Generating waveforms' },
    { name: 'complete', label: 'Complete', description: 'Results ready' }
  ];

  if (!isRunning && stage === 'idle') {
    return (
      <Card className="bg-slate-800/30 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-300">Ready to Simulate</p>
              <p className="text-xs text-slate-500">Configure your HDL and click "Run Simulation"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardContent className="p-4 space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Simulation Progress
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                stage === 'complete' 
                  ? 'border-chipforge-accent text-chipforge-accent' 
                  : 'border-chipforge-waveform text-chipforge-waveform'
              }`}
            >
              {stage === 'complete' ? 'Complete' : `${Math.round(progress)}%`}
            </Badge>
          </div>
          
          <Progress 
            value={progress} 
            className="h-2 bg-slate-700"
          />
          
          <p className="text-xs text-slate-400 font-mono">{message}</p>
        </div>

        {/* Stage Indicators */}
        <div className="space-y-3">
          {stages.map((stageInfo, index) => {
            const isActive = stage === stageInfo.name;
            const isComplete = getStageProgress(stageInfo.name) === 100;
            const stageProgress = getStageProgress(stageInfo.name);
            
            return (
              <div key={stageInfo.name} className="space-y-1">
                <div className="flex items-center gap-3">
                  {getStageIcon(stageInfo.name, isActive, isComplete)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-chipforge-waveform' : 
                        isComplete ? 'text-chipforge-accent' : 'text-slate-400'
                      }`}>
                        {stageInfo.label}
                      </span>
                      {isActive && (
                        <span className="text-xs text-chipforge-waveform font-mono">
                          {Math.round(stageProgress)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{stageInfo.description}</p>
                  </div>
                </div>
                
                {/* Individual stage progress bar */}
                {(isActive || isComplete) && (
                  <div className="ml-7">
                    <Progress 
                      value={stageProgress} 
                      className="h-1 bg-slate-700"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Estimation */}
        {isRunning && (
          <div className="pt-2 border-t border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Estimated completion: ~{Math.max(1, Math.ceil((100 - progress) / 20))}s</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationProgress;