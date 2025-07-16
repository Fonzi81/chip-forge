import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Zap,
  Target,
  History,
  RefreshCw,
  Play,
  Square
} from "lucide-react";

interface ReflexionSuggestion {
  id: string;
  type: 'optimization' | 'bugfix' | 'improvement' | 'refactor';
  priority: 'high' | 'medium' | 'low';
  description: string;
  codeChange: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
  applied: boolean;
  userFeedback?: string;
}

interface ReflexionContext {
  code: string;
  errors: string[];
  warnings: string[];
  testResults: {
    name: string;
    passed: boolean;
    output: string;
    expected: string;
    executionTime: number;
  }[];
  performanceMetrics: {
    area: number;
    power: number;
    timing: number;
    coverage: number;
  };
  userFeedback?: string;
}

interface ReflexionResult {
  success: boolean;
  suggestions: ReflexionSuggestion[];
  correctedCode: string;
  improvements: {
    areaReduction: number;
    powerReduction: number;
    timingImprovement: number;
    coverageImprovement: number;
  };
  iterations: number;
  errors: string[];
  warnings: string[];
  executionTime: number;
}

const ReflexionConsole = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reflexionResult, setReflexionResult] = useState<ReflexionResult | null>(null);
  const [activeTab, setActiveTab] = useState("console");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'optimization' | 'bugfix' | 'improvement' | 'refactor'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleStartReflexion = async () => {
    setIsRunning(true);
    setProgress(0);
    setReflexionResult(null);

    // Simulate reflexion analysis
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          completeReflexion();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  };

  const completeReflexion = () => {
    // Generate mock reflexion result
    const mockSuggestions: ReflexionSuggestion[] = [
      {
        id: '1',
        type: 'optimization',
        priority: 'high',
        description: 'Optimize critical path for better timing',
        codeChange: `// Replace slow combinational logic with pipelined version
always @(posedge clk) begin
  if (rst_n) begin
    data_out <= data_in;
  end
end`,
        reasoning: 'Current implementation has timing violations. Pipelining will improve performance by 15.7%.',
        confidence: 0.85,
        timestamp: new Date(),
        applied: false
      },
      {
        id: '2',
        type: 'bugfix',
        priority: 'medium',
        description: 'Fix potential race condition in reset logic',
        codeChange: `// Add proper reset handling
always @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
    data_out <= 8'h00;
  end else begin
    data_out <= data_in;
  end
end`,
        reasoning: 'Missing reset condition could cause undefined behavior during power-up.',
        confidence: 0.92,
        timestamp: new Date(),
        applied: false
      },
      {
        id: '3',
        type: 'improvement',
        priority: 'low',
        description: 'Add parameter for configurable data width',
        codeChange: `// Add parameter for flexibility
parameter DATA_WIDTH = 8;
input [DATA_WIDTH-1:0] data_in,
output reg [DATA_WIDTH-1:0] data_out`,
        reasoning: 'Parameterizing the data width makes the module more reusable.',
        confidence: 0.78,
        timestamp: new Date(),
        applied: false
      }
    ];

    const result: ReflexionResult = {
      success: true,
      suggestions: mockSuggestions,
      correctedCode: `// Reflexion-corrected code
module corrected_module #(
  parameter DATA_WIDTH = 8
)(
  input clk,
  input rst_n,
  input [DATA_WIDTH-1:0] data_in,
  output reg [DATA_WIDTH-1:0] data_out
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      data_out <= {DATA_WIDTH{1'b0}};
    end else begin
      data_out <= data_in;
    end
  end

endmodule`,
      improvements: {
        areaReduction: 12.5,
        powerReduction: 8.3,
        timingImprovement: 15.7,
        coverageImprovement: 22.1
      },
      iterations: 3,
      errors: [],
      warnings: ['Reflexion engine not yet implemented - using mock data'],
      executionTime: 1.25
    };

    setReflexionResult(result);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    if (!reflexionResult) return;

    const updatedSuggestions = reflexionResult.suggestions.map(s => 
      s.id === suggestionId ? { ...s, applied: true } : s
    );

    setReflexionResult({
      ...reflexionResult,
      suggestions: updatedSuggestions
    });
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    if (!reflexionResult) return;

    const updatedSuggestions = reflexionResult.suggestions.map(s => 
      s.id === suggestionId ? { ...s, applied: false, userFeedback } : s
    );

    setReflexionResult({
      ...reflexionResult,
      suggestions: updatedSuggestions
    });

    setUserFeedback("");
  };

  const getFilteredSuggestions = () => {
    if (!reflexionResult) return [];
    
    return reflexionResult.suggestions.filter(s => {
      const typeMatch = filterType === 'all' || s.type === filterType;
      const priorityMatch = filterPriority === 'all' || s.priority === filterPriority;
      return typeMatch && priorityMatch;
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Zap className="h-4 w-4 text-blue-400" />;
      case 'bugfix':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'improvement':
        return <Target className="h-4 w-4 text-emerald-400" />;
      case 'refactor':
        return <RefreshCw className="h-4 w-4 text-amber-400" />;
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 border-red-400';
      case 'medium':
        return 'text-amber-400 border-amber-400';
      case 'low':
        return 'text-blue-400 border-blue-400';
      default:
        return 'text-slate-400 border-slate-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">Reflexion Console</h2>
          <Badge variant="secondary" className="bg-purple-800 text-purple-200">
            AI Feedback
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {reflexionResult && (
            <>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                {reflexionResult.suggestions.length} suggestions
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {reflexionResult.iterations} iterations
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartReflexion}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                                    <Square className="h-4 w-4 mr-2" />
                Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/3 p-4 border-r border-slate-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                    Reflexion Analysis
                  </CardTitle>
                  <CardDescription>
                    AI-powered code analysis and suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Analysis Controls</Label>
                    <Button
                      onClick={handleStartReflexion}
                      disabled={isRunning}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Start Reflexion Analysis
                        </>
                      )}
                    </Button>
                  </div>

                  {isRunning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {reflexionResult && (
                    <div className="space-y-3">
                      <Label>Improvements</Label>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Area</div>
                          <div className="font-mono text-emerald-400">-{reflexionResult.improvements.areaReduction.toFixed(1)}%</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Power</div>
                          <div className="font-mono text-emerald-400">-{reflexionResult.improvements.powerReduction.toFixed(1)}%</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Timing</div>
                          <div className="font-mono text-emerald-400">+{reflexionResult.improvements.timingImprovement.toFixed(1)}%</div>
                        </div>
                        <div className="bg-slate-700 p-2 rounded">
                          <div className="text-slate-400">Coverage</div>
                          <div className="font-mono text-emerald-400">+{reflexionResult.improvements.coverageImprovement.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Filters</Label>
                    <div className="space-y-2">
                      <Select value={filterType} onValueChange={(value: string) => setFilterType(value as typeof filterType)}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="optimization">Optimization</SelectItem>
                          <SelectItem value="bugfix">Bug Fix</SelectItem>
                          <SelectItem value="improvement">Improvement</SelectItem>
                          <SelectItem value="refactor">Refactor</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterPriority} onValueChange={(value: string) => setFilterPriority(value as typeof filterPriority)}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="h-full mt-4">
              <Card className="h-full bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-cyan-400" />
                    Analysis History
                  </CardTitle>
                  <CardDescription>
                    Previous reflexion analysis results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reflexionResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <div>
                          <div className="font-medium">Latest Analysis</div>
                          <div className="text-sm text-slate-400">
                            {reflexionResult.executionTime.toFixed(2)}s • {reflexionResult.iterations} iterations
                          </div>
                        </div>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          Success
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No analysis history</p>
                      <p className="text-sm">Run reflexion analysis to see history</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-2/3 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                AI Suggestions
              </h3>
              {reflexionResult && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    {getFilteredSuggestions().length} filtered
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {reflexionResult.suggestions.filter(s => s.applied).length} applied
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-auto">
              {reflexionResult ? (
                <div className="space-y-4">
                  {getFilteredSuggestions().map(suggestion => (
                    <Card key={suggestion.id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getSuggestionIcon(suggestion.type)}
                            <div>
                              <CardTitle className="text-base">{suggestion.description}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                                  {suggestion.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-slate-400">
                                  {suggestion.confidence * 100}% confidence
                                </Badge>
                                {suggestion.applied && (
                                  <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400">
                                    Applied
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400">
                            {suggestion.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Reasoning</Label>
                          <p className="text-sm text-slate-300 mt-1">{suggestion.reasoning}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Code Change</Label>
                          <div className="mt-1 p-3 bg-slate-900 rounded border border-slate-600">
                            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap">
                              {suggestion.codeChange}
                            </pre>
                          </div>
                        </div>

                        {!suggestion.applied && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApplySuggestion(suggestion.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSuggestion(suggestion.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {selectedSuggestion === suggestion.id && (
                          <div className="space-y-2">
                            <Label className="text-sm">Feedback (optional)</Label>
                            <Textarea
                              placeholder="Why are you rejecting this suggestion?"
                              value={userFeedback}
                              onChange={(e) => setUserFeedback(e.target.value)}
                              className="bg-slate-900 border-slate-600 text-sm"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRejectSuggestion(suggestion.id)}
                                variant="outline"
                              >
                                Confirm Rejection
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSuggestion(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No suggestions available</p>
                    <p className="text-sm">Start reflexion analysis to get AI suggestions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflexionConsole; 