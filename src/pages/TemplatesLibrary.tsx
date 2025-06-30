import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Cpu, 
  Zap, 
  Clock, 
  Calculator,
  RotateCcw,
  Shuffle,
  Binary,
  Activity,
  Star,
  Download,
  Eye,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TemplatesLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: "all", name: "All Templates", count: 24 },
    { id: "arithmetic", name: "Arithmetic", count: 8 },
    { id: "memory", name: "Memory", count: 6 },
    { id: "control", name: "Control Logic", count: 5 },
    { id: "interface", name: "Interfaces", count: 3 },
    { id: "dsp", name: "DSP", count: 2 }
  ];

  const templates = [
    {
      id: "alu-4bit",
      name: "4-bit ALU",
      description: "Arithmetic Logic Unit with 8 operations including ADD, SUB, AND, OR, XOR",
      category: "arithmetic",
      complexity: "Medium",
      gateCount: 128,
      popularity: 95,
      tags: ["arithmetic", "combinational", "basic"],
      icon: Calculator,
      color: "emerald"
    },
    {
      id: "counter-8bit",
      name: "8-bit Counter",
      description: "Synchronous counter with reset, enable, and configurable direction",
      category: "control",
      complexity: "Easy",
      gateCount: 64,
      popularity: 89,
      tags: ["sequential", "counter", "basic"],
      icon: RotateCcw,
      color: "blue"
    },
    {
      id: "priority-encoder",
      name: "Priority Encoder",
      description: "8-input priority encoder with valid output and cascading support",
      category: "control",
      complexity: "Medium",
      gateCount: 45,
      popularity: 76,
      tags: ["encoder", "priority", "combinational"],
      icon: Shuffle,
      color: "purple"
    },
    {
      id: "uart-tx",
      name: "UART Transmitter",
      description: "Configurable baud rate UART transmitter with ready/valid handshake",
      category: "interface",
      complexity: "Hard",
      gateCount: 256,
      popularity: 84,
      tags: ["communication", "serial", "interface"],
      icon: Activity,
      color: "cyan"
    },
    {
      id: "fsm-traffic",
      name: "Traffic Light FSM",
      description: "Finite state machine for traffic light control with pedestrian crossing",
      category: "control",
      complexity: "Medium",
      gateCount: 92,
      popularity: 71,
      tags: ["fsm", "sequential", "control"],
      icon: Clock,
      color: "amber"
    },
    {
      id: "binary-multiplier",
      name: "Binary Multiplier",
      description: "4x4 bit binary multiplier using shift-add algorithm",
      category: "arithmetic",
      complexity: "Hard",
      gateCount: 312,
      popularity: 68,
      tags: ["arithmetic", "multiplier", "advanced"],
      icon: Binary,
      color: "pink"
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Easy": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getIconColor = (color: string) => {
    const colors = {
      emerald: "text-emerald-400",
      blue: "text-blue-400",
      purple: "text-purple-400",
      cyan: "text-cyan-400",
      amber: "text-amber-400",
      pink: "text-pink-400"
    };
    return colors[color as keyof typeof colors] || "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200 p-1 sm:p-2">
              <ArrowLeft className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <div className="hidden sm:block h-6 w-px bg-slate-700"></div>
            <span className="text-lg sm:text-xl font-semibold">Templates</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs sm:text-sm">
              {filteredTemplates.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Desktop filter button */}
            <Button variant="outline" className="hidden sm:flex border-slate-600 text-slate-300 hover:bg-slate-800">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-slate-900 border-r border-slate-800">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <span className="font-semibold">Filters & Search</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4">
                {/* Mobile Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>

                {/* Mobile Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                          selectedCategory === category.id
                            ? "bg-slate-800 text-slate-100"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                      >
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden sm:block w-64 border-r border-slate-800 bg-slate-900/30 overflow-y-auto">
          <div className="p-4">
            {/* Desktop Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100"
                />
              </div>
            </div>

            {/* Desktop Categories */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      selectedCategory === category.id
                        ? "bg-slate-800 text-slate-100"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card key={template.id} className="p-4 sm:p-6 bg-slate-900/30 border-slate-700 hover:border-slate-600 transition-all group">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-slate-800/50 rounded-lg">
                          <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${getIconColor(template.color)}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-200 text-sm sm:text-base">{template.name}</h3>
                          <Badge className={`${getComplexityColor(template.complexity)} text-xs`}>
                            {template.complexity}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                        <span className="text-xs sm:text-sm">{template.popularity}</span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      {template.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Cpu className="h-3 w-3" />
                        {template.gateCount} gates
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-emerald-500 text-slate-900 hover:bg-emerald-400 text-xs sm:text-sm"
                        onClick={() => navigate('/new-project')}
                      >
                        Use Template
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600 text-slate-300 hover:bg-slate-800 px-2 sm:px-3"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600 text-slate-300 hover:bg-slate-800 px-2 sm:px-3"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-400 mb-2">No templates found</h3>
                <p className="text-sm sm:text-base text-slate-500">Try adjusting your search terms or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesLibrary;
