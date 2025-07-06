import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Target,
  TrendingUp,
  Code
} from "lucide-react";
import { ReflexionMetrics, ReflexionIteration } from "@/hooks/useReflexion";

interface ReflexionResultsProps {
  finalCode: string | null;
  metrics: ReflexionMetrics | null;
  iterations: ReflexionIteration[];
  isComplete: boolean;
}

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  description, 
  variant = "default" 
}: {
  icon: any;
  label: string;
  value: string;
  description: string;
  variant?: "default" | "success" | "destructive";
}) => (
  <Card className="p-3 bg-card border-border">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`h-4 w-4 ${
        variant === "success" ? "text-green-500" : 
        variant === "destructive" ? "text-red-500" : 
        "text-primary"
      }`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="space-y-1">
      <div className={`text-lg font-bold ${
        variant === "success" ? "text-green-600 dark:text-green-400" : 
        variant === "destructive" ? "text-red-600 dark:text-red-400" : 
        "text-foreground"
      }`}>
        {value}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </Card>
);

const ReflexionResults = ({ finalCode, metrics, iterations, isComplete }: ReflexionResultsProps) => {
  const handleDownloadCode = () => {
    if (!finalCode) return;
    
    const blob = new Blob([finalCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_module.v';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    if (!metrics || iterations.length === 0) return;

    const report = `HDL Reflexion Agent - Session Report
Generated: ${new Date().toLocaleString()}

=== METRICS ===
Total Iterations: ${metrics.totalIterations}
Pass@1: ${metrics.passAt1 ? 'YES' : 'NO'}
Pass@3: ${metrics.passAt3 ? 'YES' : 'NO'}
Pass@5: ${metrics.passAt5 ? 'YES' : 'NO'}
Total Tokens Used: ${metrics.totalTokensUsed}
Total Time: ${(metrics.totalTime / 1000).toFixed(1)}s
Final Success: ${metrics.finalSuccess ? 'YES' : 'NO'}

=== ITERATION HISTORY ===
${iterations.map(iter => `
Iteration ${iter.iteration}:
Status: ${iter.testResult.passed ? 'PASSED' : 'FAILED'}
Errors: ${iter.testResult.errors.join('; ') || 'None'}
Reviewer Feedback: ${iter.reviewerFeedback || 'None'}
Tokens Used: ${iter.tokensUsed}
---
`).join('')}

${finalCode ? `=== FINAL CODE ===
${finalCode}` : '=== NO FINAL CODE GENERATED ==='}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reflexion_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Session Status</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isComplete ? (
            metrics?.finalSuccess ? (
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Success
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30">
                <XCircle className="h-3 w-3 mr-1" />
                Failed
              </Badge>
            )
          ) : iterations.length > 0 ? (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
              <Clock className="h-3 w-3 mr-1" />
              In Progress
            </Badge>
          ) : (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
      </Card>

      {/* Metrics */}
      {metrics && (
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Performance Metrics</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={TrendingUp}
              label="Pass@1"
              value={metrics.passAt1 ? "YES" : "NO"}
              description="Succeeded on first try"
              variant={metrics.passAt1 ? "success" : "destructive"}
            />
            
            <MetricCard
              icon={Target}
              label="Pass@5"
              value={metrics.passAt5 ? "YES" : "NO"}
              description="Succeeded within 5 tries"
              variant={metrics.passAt5 ? "success" : "destructive"}
            />
            
            <MetricCard
              icon={Clock}
              label="Time"
              value={`${(metrics.totalTime / 1000).toFixed(1)}s`}
              description="Total execution time"
            />
            
            <MetricCard
              icon={Zap}
              label="Tokens"
              value={metrics.totalTokensUsed.toString()}
              description="LLM tokens consumed"
            />
          </div>
        </div>
      )}

      {/* Final Code */}
      {finalCode && (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Final Generated Code</span>
            </div>
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
              Ready
            </Badge>
          </div>
          
          <ScrollArea className="h-48 w-full rounded border bg-background">
            <pre className="p-3 text-xs font-mono">
              {finalCode}
            </pre>
          </ScrollArea>
        </Card>
      )}

      {/* No Results Message */}
      {!finalCode && !metrics && iterations.length === 0 && (
        <Card className="p-8 text-center border-dashed border-muted-foreground/20">
          <Target className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No results yet</p>
          <p className="text-sm text-muted-foreground">
            Start the reflexion process to see metrics and generated code here.
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      {(finalCode || metrics) && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Export Options</h3>
            
            <div className="grid grid-cols-1 gap-2">
              {finalCode && (
                <Button
                  onClick={handleDownloadCode}
                  variant="outline"
                  className="justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Verilog Code
                </Button>
              )}
              
              {metrics && (
                <Button
                  onClick={handleDownloadReport}
                  variant="outline"
                  className="justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReflexionResults;