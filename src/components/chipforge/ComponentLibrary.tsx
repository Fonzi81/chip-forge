import React, { useEffect, useState } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Code, 
  Zap, 
  Cpu, 
  HardDrive, 
  Calculator,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import componentLibrary from "@/lib/component.library.json";

// Enhanced type for a component block
interface ComponentBlock {
  id: string;
  type: string;
  label: string;
  ports: { name: string; width: number }[];
  description: string;
  verilog: string;
  category: string;
  symbol: string;
  hdl: string;
}

// Component Card with guided overlay and drag-and-drop
function ComponentCard({ block, onAdd }: { block: ComponentBlock; onAdd: () => void }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { guidedMode } = useHDLDesignStore();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'logic': return <Zap className="h-4 w-4" />;
      case 'memory': return <HardDrive className="h-4 w-4" />;
      case 'arithmetic': return <Calculator className="h-4 w-4" />;
      case 'io': return <ArrowRight className="h-4 w-4" />;
      case 'control': return <Cpu className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'logic': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'memory': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'arithmetic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'io': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'control': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: block.id,
      type: block.type,
      label: block.label,
      ports: block.ports,
      description: block.description,
      verilog: block.verilog,
      category: block.category,
      symbol: block.symbol,
      hdl: block.hdl
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <Card 
        className={`cursor-pointer hover:bg-slate-800 transition-colors border-slate-700 ${
          isDragging ? 'opacity-50 scale-95' : ''
        }`}
        onClick={onAdd}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getCategoryIcon(block.category)}
              <div className="font-medium text-sm text-slate-200">{block.label}</div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Add
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className={getCategoryColor(block.category)}>
              {block.category}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              className="text-slate-400 hover:text-slate-200 p-1 h-6 w-6"
            >
              <Info className="h-3 w-3" />
            </Button>
          </div>

          {/* Ports summary */}
          <div className="text-xs text-slate-400">
            {block.ports.length} port{block.ports.length !== 1 ? 's' : ''}
          </div>
          
          {/* Drag indicator */}
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Drag to canvas or click to add</span>
          </div>
        </CardContent>
      </Card>

      {/* Guided overlay for component info */}
      {showInfo && (
        <div className="absolute z-50 left-full ml-2 top-0 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              {block.label} Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Description */}
            <div>
              <h4 className="text-xs font-medium text-slate-300 mb-1">Description</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{block.description}</p>
            </div>

            {/* Ports */}
            <div>
              <h4 className="text-xs font-medium text-slate-300 mb-1">Ports</h4>
              <div className="space-y-1">
                {block.ports.map((port, idx) => (
                  <div key={port.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{port.name}</span>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      {port.width} bit{port.width !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Verilog Preview */}
            <div>
              <h4 className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Code className="h-3 w-3" />
                Verilog Preview
              </h4>
              <div className="bg-slate-900 border border-slate-600 rounded p-2">
                <code className="text-xs text-green-400 font-mono">{block.verilog}</code>
              </div>
            </div>

            {/* Guided Mode Tip */}
            {guidedMode.isActive && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2">
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <Lightbulb className="h-3 w-3" />
                  <span className="font-medium">Guided Tip:</span>
                </div>
                <p className="text-xs text-blue-200 mt-1">
                  This {block.label.toLowerCase()} is a {block.category} component. 
                  {block.category === 'logic' && ' Use it to combine or manipulate digital signals.'}
                  {block.category === 'memory' && ' Use it to store data or create sequential logic.'}
                  {block.category === 'arithmetic' && ' Use it to perform mathematical operations.'}
                  {block.category === 'io' && ' Use it to connect your design to external signals.'}
                  {block.category === 'control' && ' Use it to manage the flow of your design.'}
                </p>
              </div>
            )}
          </CardContent>
        </div>
      )}
    </div>
  );
}

export default function ComponentLibrary() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtered, setFiltered] = useState<ComponentBlock[]>([]);
  const [suggestedComponent, setSuggestedComponent] = useState<ComponentBlock | null>(null);
  const { addComponent, guidedMode, completeGuidedStep } = useHDLDesignStore();

  useEffect(() => {
    const query = search.toLowerCase();
    const results = (componentLibrary as ComponentBlock[]).filter((c) =>
      c.label.toLowerCase().includes(query) &&
      (selectedCategory === "all" || c.category === selectedCategory)
    );
    setFiltered(results);
  }, [search, selectedCategory]);

  const categories = ["all", "logic", "memory", "arithmetic", "io", "control"];

  const handleAdd = (block: ComponentBlock) => {
    // Convert ports to inputs/outputs based on position in the array
    // First ports are typically inputs, last port is typically output
    const inputPorts = block.ports.slice(0, -1);
    const outputPorts = block.ports.slice(-1);
    
    addComponent({
      id: `${block.id}-${Date.now()}`,
      type: block.id,
      label: block.label,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      inputs: inputPorts.map(p => p.name),
      outputs: outputPorts.map(p => p.name),
    });

    // Guided mode: suggest next component based on design process
    if (guidedMode.isActive) {
      suggestNextComponent(block);
    }
  };

  const suggestNextComponent = (currentBlock: ComponentBlock) => {
    let nextSuggestion: ComponentBlock | null = null;
    
    // Logic for suggesting next component based on design workflow
    if (currentBlock.category === 'logic') {
      // After logic gates, suggest more logic or memory
      nextSuggestion = componentLibrary.find(c => 
        c.category === 'logic' && c.id !== currentBlock.id
      ) || componentLibrary.find(c => c.category === 'memory');
    } else if (currentBlock.category === 'memory') {
      // After memory, suggest control or arithmetic
      nextSuggestion = componentLibrary.find(c => 
        c.category === 'control'
      ) || componentLibrary.find(c => c.category === 'arithmetic');
    } else if (currentBlock.category === 'arithmetic') {
      // After arithmetic, suggest IO or more logic
      nextSuggestion = componentLibrary.find(c => 
        c.category === 'io'
      ) || componentLibrary.find(c => c.category === 'logic');
    } else if (currentBlock.category === 'io') {
      // After IO, suggest control or logic
      nextSuggestion = componentLibrary.find(c => 
        c.category === 'control'
      ) || componentLibrary.find(c => c.category === 'logic');
    } else {
      // Default: suggest logic components
      nextSuggestion = componentLibrary.find(c => c.category === 'logic');
    }

    if (nextSuggestion) {
      setSuggestedComponent(nextSuggestion);
      // Auto-hide suggestion after 5 seconds
      setTimeout(() => setSuggestedComponent(null), 5000);
    }
  };

  return (
    <div className="p-4 w-full max-w-xs bg-slate-900 text-white">
      <h3 className="text-lg font-semibold mb-2">Chip Component Library</h3>
      
      {/* Guided Mode Suggestion */}
      {guidedMode.isActive && suggestedComponent && (
        <div className="mb-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-blue-300">Suggested Next Component</span>
          </div>
          <div className="text-xs text-blue-200 mb-2">
            Try adding a <strong>{suggestedComponent.label}</strong> to continue building your design.
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAdd(suggestedComponent)}
            className="w-full text-xs border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
          >
            Add {suggestedComponent.label}
          </Button>
        </div>
      )}
      
      <Input
        placeholder="Search components..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      <Tabs defaultValue="all" onValueChange={(v) => setSelectedCategory(v)}>
        <TabsList className="overflow-x-auto whitespace-nowrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filtered.map((block) => (
                <ComponentCard 
                  key={block.id} 
                  block={block} 
                  onAdd={() => handleAdd(block)} 
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 