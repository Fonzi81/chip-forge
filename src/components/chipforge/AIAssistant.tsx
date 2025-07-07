import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Lightbulb, 
  Code, 
  Bug, 
  Wand2,
  Send,
  Trash2,
  Copy,
  Check
} from "lucide-react";

interface AISuggestion {
  id: string;
  type: 'optimization' | 'completion' | 'fix' | 'explanation';
  title: string;
  description: string;
  code?: string;
  confidence: number;
  line?: number;
}

interface DesignMetrics {
  linesOfCode: number;
  estimatedGates: number;
  complexityScore: number;
  version: string;
  lastModified: Date;
}

interface AIAssistantProps {
  isVisible: boolean;
  suggestions: AISuggestion[];
  designMetrics: DesignMetrics;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismissSuggestion: (id: string) => void;
  onGenerateCode: (prompt: string) => void;
  onExplainCode: (code: string) => void;
  isLoading?: boolean;
}

const AIAssistant = ({
  isVisible,
  suggestions,
  designMetrics,
  onApplySuggestion,
  onDismissSuggestion,
  onGenerateCode,
  onExplainCode,
  isLoading = false
}: AIAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  if (!isVisible) return null;

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'optimization':
        return <Wand2 className="h-4 w-4 text-emerald-400" />;
      case 'completion':
        return <Code className="h-4 w-4 text-blue-400" />;
      case 'fix':
        return <Bug className="h-4 w-4 text-red-400" />;
      case 'explanation':
        return <Lightbulb className="h-4 w-4 text-yellow-400" />;
      default:
        return <Zap className="h-4 w-4 text-purple-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-emerald-400 border-emerald-500/30";
    if (confidence >= 0.6) return "text-yellow-400 border-yellow-500/30";
    return "text-red-400 border-red-500/30";
  };

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast({
        title: "Code copied",
        description: "Code has been copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (copiedId) {
        setCopiedId(null);
      }
    };
  }, [copiedId]);

  const handleSubmitPrompt = () => {
    if (prompt.trim()) {
      onGenerateCode(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="w-80 bg-slate-900/30 border-l border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-purple-400" />
          <span className="font-display font-semibold text-slate-200">AI Assistant</span>
        </div>
        
        {/* Design Metrics */}
        <Card className="bg-slate-800/50 border-slate-700 p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400">Lines:</span>
              <div className="font-mono text-chipforge-waveform">{designMetrics.linesOfCode}</div>
            </div>
            <div>
              <span className="text-slate-400">Est. Gates:</span>
              <div className="font-mono text-chipforge-waveform">{designMetrics.estimatedGates}</div>
            </div>
            <div>
              <span className="text-slate-400">Complexity:</span>
              <div className="font-mono text-chipforge-waveform">{designMetrics.complexityScore}/10</div>
            </div>
            <div>
              <span className="text-slate-400">Version:</span>
              <div className="font-mono text-chipforge-waveform">{designMetrics.version}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Prompt */}
      <div className="p-3 border-b border-slate-800">
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to generate, optimize, or explain code..."
            className="bg-slate-800/50 border-slate-600 text-slate-100 text-sm resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmitPrompt();
              }
            }}
          />
          <Button
            onClick={handleSubmitPrompt}
            disabled={!prompt.trim() || isLoading}
            className="w-full bg-purple-500 text-white hover:bg-purple-400 disabled:opacity-50 text-sm py-1.5"
          >
            {isLoading ? (
              <>
                <div className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-3 w-3 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-300">Suggestions</span>
          <Badge className="ml-2 text-xs">
            {suggestions.length}
          </Badge>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {suggestions.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No suggestions yet.<br />
                Start coding to get AI recommendations.
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="bg-slate-800/30 border-slate-700 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="text-sm font-medium text-slate-200">{suggestion.title}</span>
                    </div>
                    <Badge
                      className={`text-xs ${getConfidenceColor(suggestion.confidence)} border border-slate-600`}
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-slate-300 mb-3">{suggestion.description}</p>
                  
                  {suggestion.code && (
                    <div className="bg-slate-900/50 border border-slate-700 rounded p-2 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Suggested Code:</span>
                        <Button
                          onClick={() => handleCopyCode(suggestion.code!, suggestion.id)}
                          className="h-5 w-5 p-0 text-slate-400 hover:text-slate-200"
                          aria-label={`Copy code for ${suggestion.title}`}
                        >
                          {copiedId === suggestion.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <pre className="text-xs text-slate-100 font-mono overflow-x-auto">
                        {suggestion.code}
                      </pre>
                    </div>
                  )}
                  
                  <div className="flex gap-1">
                    <Button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 text-xs h-6"
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={() => onDismissSuggestion(suggestion.id)}
                      className="text-slate-400 hover:text-slate-200 text-xs h-6"
                      aria-label={`Dismiss suggestion: ${suggestion.title}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AIAssistant;