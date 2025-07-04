import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Activity,
  Download,
  Share,
  Bookmark
} from "lucide-react";

interface ResultsPanelProps {
  results: {
    pass: boolean;
    duration: string;
    gateCount: number;
    assertions: { passed: number; failed: number };
  };
  isComplete: boolean;
}

const ResultsPanel = ({ results, isComplete }: ResultsPanelProps) => {
  const assertionSuccessRate = results.assertions.passed + results.assertions.failed > 0 
    ? (results.assertions.passed / (results.assertions.passed + results.assertions.failed)) * 100
    : 0;

  const getStatusIcon = () => {
    if (!isComplete) return null;
    return results.pass ? (
      <CheckCircle2 className="h-5 w-5 text-chipforge-accent" />
    ) : (
      <XCircle className="h-5 w-5 text-red-400" />
    );
  };

  const getStatusText = () => {
    if (!isComplete) return 'Waiting for simulation...';
    return results.pass ? 'Simulation Passed' : 'Simulation Failed';
  };

  const getStatusColor = () => {
    if (!isComplete) return 'text-slate-400';
    return results.pass ? 'text-chipforge-accent' : 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border-l border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-5 w-5 text-chipforge-waveform" />
          <h2 className="text-lg font-display font-semibold text-slate-200">
            Results
          </h2>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Action Buttons */}
        {isComplete && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-chipforge-accent text-slate-900 hover:bg-chipforge-accent/90"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Share className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              <Bookmark className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Results Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isComplete ? (
          <>
            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Execution Time</span>
                  <span className="text-sm font-mono text-slate-200">{results.duration}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Gate Count</span>
                  <span className="text-sm font-mono text-slate-200">{results.gateCount}</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Resource Usage</span>
                    <span className="text-xs font-mono text-slate-300">
                      {Math.round((results.gateCount / 1000) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(results.gateCount / 1000) * 100} 
                    className="h-2 bg-slate-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timing Analysis */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
                  <Clock className="h-4 w-4 text-chipforge-waveform" />
                  Timing Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Max Frequency</span>
                  <span className="text-sm font-mono text-chipforge-accent">125 MHz</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Critical Path</span>
                  <span className="text-sm font-mono text-slate-200">8.0 ns</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Setup Slack</span>
                  <span className="text-sm font-mono text-chipforge-accent">+2.3 ns</span>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300">Test Assertions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Passed</span>
                  <Badge className="bg-chipforge-accent/20 text-chipforge-accent border-chipforge-accent/30">
                    {results.assertions.passed}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Failed</span>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {results.assertions.failed}
                  </Badge>
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Success Rate</span>
                    <span className="text-xs font-mono text-slate-300">
                      {Math.round(assertionSuccessRate)}%
                    </span>
                  </div>
                  <Progress 
                    value={assertionSuccessRate} 
                    className="h-2 bg-slate-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Simulation Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• HDL code compiled successfully</div>
                  <div>• Testbench executed without errors</div>
                  <div>• All timing constraints met</div>
                  <div>• Ready for synthesis</div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-32 text-slate-500">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Results will appear after simulation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;