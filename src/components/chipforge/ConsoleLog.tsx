import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Terminal, 
  Download, 
  Trash2, 
  Copy,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";

interface ConsoleLogProps {
  logs: string[];
  status: 'idle' | 'running' | 'success' | 'error';
}

const ConsoleLog = ({ logs, status }: ConsoleLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClearLogs = () => {
    // Implementation would clear logs
    console.log('Clear logs');
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_log.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (log: string) => {
    if (log.toLowerCase().includes('error') || log.toLowerCase().includes('failed')) {
      return <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />;
    } else if (log.toLowerCase().includes('warning')) {
      return <AlertCircle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />;
    } else if (log.toLowerCase().includes('success') || log.toLowerCase().includes('complete')) {
      return <CheckCircle2 className="h-3 w-3 text-chipforge-accent mt-0.5 flex-shrink-0" />;
    } else {
      return <Info className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />;
    }
  };

  const getLogStyle = (log: string) => {
    if (log.toLowerCase().includes('error') || log.toLowerCase().includes('failed')) {
      return 'text-red-400';
    } else if (log.toLowerCase().includes('warning')) {
      return 'text-amber-400';
    } else if (log.toLowerCase().includes('success') || log.toLowerCase().includes('complete')) {
      return 'text-chipforge-accent';
    } else {
      return 'text-slate-300';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <div className="animate-pulse w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
            Running
          </Badge>
        );
      case 'success':
        return (
          <Badge className="bg-chipforge-accent/20 text-chipforge-accent border-chipforge-accent/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-400">
            Idle
          </Badge>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-chipforge-console">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-chipforge-accent" />
          <span className="font-display font-semibold text-slate-200 text-sm">Console Output</span>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyLogs}
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownloadLogs}
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearLogs}
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="simulation" className="h-full flex flex-col">
          <TabsList className="bg-slate-800/50 border-b border-slate-700 rounded-none h-9 px-3">
            <TabsTrigger 
              value="simulation" 
              className="data-[state=active]:bg-slate-700 text-xs"
            >
              Simulation Log
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="data-[state=active]:bg-slate-700 text-xs"
            >
              System Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div ref={scrollRef} className="p-3 space-y-1">
                {logs.length === 0 ? (
                  <div className="text-slate-500 text-sm font-mono">
                    Waiting for simulation to start...
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs font-mono">
                      {getLogIcon(log)}
                      <span className="text-slate-500 min-w-[3rem]">
                        {new Date().toLocaleTimeString().split(' ')[0]}
                      </span>
                      <span className={getLogStyle(log)}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
                
                {/* Live cursor when running */}
                {status === 'running' && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="w-3 h-3 flex items-center justify-center">
                      <div className="w-1 h-3 bg-chipforge-accent animate-pulse"></div>
                    </div>
                    <span className="text-slate-500">Processing...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="system" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-1">
                <div className="flex items-start gap-2 text-xs font-mono">
                  <Info className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-500 min-w-[3rem]">
                    {new Date().toLocaleTimeString().split(' ')[0]}
                  </span>
                  <span className="text-slate-300">
                    ChipForge Simulation Engine v2.1.0 initialized
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs font-mono">
                  <Info className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-500 min-w-[3rem]">
                    {new Date().toLocaleTimeString().split(' ')[0]}
                  </span>
                  <span className="text-slate-300">
                    Icarus Verilog backend ready
                  </span>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsoleLog;