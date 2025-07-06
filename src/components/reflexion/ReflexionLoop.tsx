import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, 
  ChevronRight, 
  Code, 
  TestTube, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap
} from "lucide-react";
import { ReflexionIteration } from "@/hooks/useReflexion";

interface ReflexionLoopProps {
  iterations: ReflexionIteration[];
  currentIteration: number;
  isRunning: boolean;
  currentStage: string;
}

const StageIcon = ({ stage }: { stage: string }) => {
  switch (stage) {
    case 'generating':
      return <Code className="h-4 w-4 text-blue-500" />;
    case 'testing':
      return <TestTube className="h-4 w-4 text-yellow-500" />;
    case 'reviewing':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const IterationCard = ({ iteration, isActive }: { iteration: ReflexionIteration; isActive: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`p-4 border transition-all duration-200 ${
      isActive ? 'border-primary bg-primary/5' : 'border-border bg-card'
    }`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full p-0 h-auto justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Iteration {iteration.iteration}</span>
                {iteration.testResult.passed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Badge variant={iteration.testResult.passed ? "default" : "destructive"} className="text-xs">
                {iteration.testResult.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Generated Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Generated Code</span>
            </div>
            <ScrollArea className="h-32 w-full rounded border bg-background">
              <pre className="p-3 text-xs font-mono">
                {iteration.generatedCode}
              </pre>
            </ScrollArea>
          </div>

          {/* Test Results */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Test Results</span>
            </div>
            {iteration.testResult.errors.length > 0 && (
              <ScrollArea className="h-24 w-full rounded border bg-red-50 dark:bg-red-950/20">
                <div className="p-3 text-xs text-red-700 dark:text-red-300">
                  {iteration.testResult.errors.map((error, idx) => (
                    <div key={idx}>{error}</div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Reviewer Feedback */}
          {iteration.reviewerFeedback && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">AI Reviewer Feedback</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded border text-sm text-purple-700 dark:text-purple-300">
                {iteration.reviewerFeedback}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Tokens: {iteration.tokensUsed}</span>
            <span>Time: {iteration.timestamp.toLocaleTimeString()}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const ReflexionLoop = ({ iterations, currentIteration, isRunning, currentStage }: ReflexionLoopProps) => {
  // Show current iteration indicator when running
  const showCurrentIndicator = isRunning && currentIteration > 0;

  return (
    <div className="space-y-4">
      {/* Process Overview */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Reflexion Process</h3>
              <p className="text-sm text-muted-foreground">
                Generate → Test → Review → Refine
              </p>
            </div>
          </div>
          
          {showCurrentIndicator && (
            <div className="flex items-center gap-2">
              <StageIcon stage={currentStage} />
              <span className="text-sm capitalize">{currentStage}...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Current Stage Indicator */}
      {showCurrentIndicator && (
        <Card className="p-4 border-primary bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{currentIteration}</span>
              </div>
              <span className="font-medium">Iteration {currentIteration} in progress</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <StageIcon stage={currentStage} />
              <span className="text-sm capitalize">{currentStage}...</span>
            </div>
          </div>
        </Card>
      )}

      {/* Iterations List */}
      <div className="space-y-3">
        {iterations.length === 0 && !isRunning && (
          <Card className="p-8 text-center border-dashed border-muted-foreground/20">
            <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No iterations yet. Start the reflexion process to see results here.
            </p>
          </Card>
        )}

        {iterations.map((iteration) => (
          <IterationCard
            key={iteration.id}
            iteration={iteration}
            isActive={isRunning && iteration.iteration === currentIteration}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      {iterations.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{iterations.length}/5 iterations completed</span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(iterations.length / 5) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflexionLoop;