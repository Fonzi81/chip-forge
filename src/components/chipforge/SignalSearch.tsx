import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  X, 
  Eye, 
  EyeOff, 
  Filter,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen
} from "lucide-react";

interface SignalGroup {
  name: string;
  signals: string[];
  expanded: boolean;
}

interface SignalSearchProps {
  signals: string[];
  selectedSignals: string[];
  highlightedSignals: Set<string>;
  visibleSignals: Set<string>;
  onSignalSelect: (signal: string) => void;
  onSignalHighlight: (signal: string) => void;
  onSignalVisibilityToggle: (signal: string) => void;
}

const SignalSearch = ({
  signals,
  selectedSignals,
  highlightedSignals,
  visibleSignals,
  onSignalSelect,
  onSignalHighlight,
  onSignalVisibilityToggle
}: SignalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [signalGroups, setSignalGroups] = useState<SignalGroup[]>([]);

  // Group signals by prefix (e.g., "cpu_", "memory_")
  const groupedSignals = useMemo(() => {
    const groups: { [key: string]: string[] } = {};
    
    signals.forEach(signal => {
      // eslint-disable-next-line no-useless-escape
      const parts = signal.split(/[_.\[\]]/); // Only escape [ and ] if needed
      const prefix = parts[0] || 'misc';
      
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(signal);
    });

    return Object.entries(groups).map(([name, signals]) => ({
      name,
      signals: signals.sort(),
      expanded: true
    }));
  }, [signals]);

  // Filter signals based on search term
  const filteredSignals = useMemo(() => {
    if (!searchTerm) return signals;
    return signals.filter(signal => 
      signal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [signals, searchTerm]);

  const toggleGroup = (groupName: string) => {
    setSignalGroups(prev => 
      prev.map(group => 
        group.name === groupName 
          ? { ...group, expanded: !group.expanded }
          : group
      )
    );
  };

  const getSignalIcon = (signal: string) => {
    if (!visibleSignals.has(signal)) {
      return <EyeOff className="h-3 w-3 text-slate-500" />;
    }
    return <Eye className="h-3 w-3 text-slate-400" />;
  };

  const getSignalStyle = (signal: string) => {
    if (selectedSignals.includes(signal)) {
      return "bg-chipforge-waveform/20 text-chipforge-waveform border border-chipforge-waveform/30";
    }
    if (highlightedSignals.has(signal)) {
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    }
    return "text-slate-300 hover:bg-slate-700/50";
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border-r border-slate-800">
      {/* Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-chipforge-accent" />
          <span className="font-display font-semibold text-slate-200 text-sm">Signal Explorer</span>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search signals..."
            className="bg-slate-800/50 border-slate-600 text-slate-100 text-sm pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-0 top-0 h-full px-2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-slate-400 hover:text-slate-200 text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            Filters
            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {filteredSignals.length} / {signals.length}
            </Badge>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-2 p-2 bg-slate-800/30 rounded border border-slate-700">
            <div className="flex flex-wrap gap-1">
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-slate-700"
                onClick={() => {/* Filter by type */}}
              >
                Clock
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-slate-700"
                onClick={() => {/* Filter by type */}}
              >
                Bus
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-slate-700"
                onClick={() => {/* Filter by type */}}
              >
                Signal
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Signal List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {searchTerm ? (
            // Flat filtered list when searching
            filteredSignals.map(signal => (
              <div
                key={signal}
                className={`
                  flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-xs font-mono
                  ${getSignalStyle(signal)}
                `}
                onClick={() => onSignalSelect(signal)}
                onDoubleClick={() => onSignalHighlight(signal)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSignalVisibilityToggle(signal);
                  }}
                  className="p-0.5 hover:bg-slate-600 rounded"
                >
                  {getSignalIcon(signal)}
                </button>
                <span className="flex-1 truncate">{signal}</span>
                {highlightedSignals.has(signal) && (
                  <Eye className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                )}
              </div>
            ))
          ) : (
            // Grouped view when not searching
            groupedSignals.map(group => (
              <div key={group.name} className="space-y-1">
                <div
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-slate-700/50 text-xs"
                >
                  {group.expanded ? (
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  )}
                  {group.expanded ? (
                    <FolderOpen className="h-3 w-3 text-chipforge-accent" />
                  ) : (
                    <Folder className="h-3 w-3 text-slate-400" />
                  )}
                  <span className="font-medium text-slate-300">{group.name}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {group.signals.length}
                  </Badge>
                </div>
                
                {group.expanded && (
                  <div className="ml-4 space-y-0.5">
                    {group.signals.map(signal => (
                      <div
                        key={signal}
                        className={`
                          flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors text-xs font-mono
                          ${getSignalStyle(signal)}
                        `}
                        onClick={() => onSignalSelect(signal)}
                        onDoubleClick={() => onSignalHighlight(signal)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSignalVisibilityToggle(signal);
                          }}
                          className="p-0.5 hover:bg-slate-600 rounded"
                        >
                          {getSignalIcon(signal)}
                        </button>
                        <span className="flex-1 truncate">{signal}</span>
                        {highlightedSignals.has(signal) && (
                          <Eye className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-2 border-t border-slate-800">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {
              // Show all signals
              signals.forEach(signal => {
                if (!visibleSignals.has(signal)) {
                  onSignalVisibilityToggle(signal);
                }
              });
            }}
          >
            Show All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {
              // Hide all signals
              signals.forEach(signal => {
                if (visibleSignals.has(signal)) {
                  onSignalVisibilityToggle(signal);
                }
              });
            }}
          >
            Hide All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignalSearch;