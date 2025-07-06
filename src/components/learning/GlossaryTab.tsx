import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search,
  BookOpen,
  Cpu,
  Zap,
  Database,
  Network,
  Settings,
  Clock,
  Microscope
} from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  difficulty: string;
  examples?: string[];
  relatedTerms?: string[];
}

const GlossaryTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Categories", icon: BookOpen },
    { id: "digital-logic", name: "Digital Logic", icon: Zap },
    { id: "architecture", name: "Computer Architecture", icon: Cpu },
    { id: "protocols", name: "Communication Protocols", icon: Network },
    { id: "memory", name: "Memory Systems", icon: Database },
    { id: "fpga", name: "FPGA/ASIC", icon: Settings },
    { id: "timing", name: "Timing & Clocking", icon: Clock },
    { id: "methodology", name: "Design Methodology", icon: Microscope }
  ];

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "ALU",
      definition: "Arithmetic Logic Unit - A combinational digital circuit that performs arithmetic and bitwise operations on integer binary numbers. It's a fundamental building block of the CPU.",
      category: "architecture",
      difficulty: "Beginner",
      examples: ["8-bit ALU", "32-bit ALU with carry-lookahead"],
      relatedTerms: ["CPU", "Register", "Instruction Set"]
    },
    {
      term: "UART",
      definition: "Universal Asynchronous Receiver-Transmitter - A hardware communication protocol that translates data between parallel and serial forms for asynchronous serial communication.",
      category: "protocols",
      difficulty: "Beginner",
      examples: ["RS-232 communication", "Bluetooth modules", "GPS modules"],
      relatedTerms: ["SPI", "I2C", "Baud Rate"]
    },
    {
      term: "FPGA",
      definition: "Field-Programmable Gate Array - An integrated circuit designed to be configured by a customer or designer after manufacturing. Contains programmable logic blocks and interconnects.",
      category: "fpga",
      difficulty: "Intermediate",
      examples: ["Xilinx Zynq", "Intel Altera", "Lattice FPGAs"],
      relatedTerms: ["LUT", "CLB", "ASIC", "HDL"]
    },
    {
      term: "LUT",
      definition: "Look-Up Table - A fundamental building block in FPGAs that implements small combinational logic functions. Typically 4-6 input LUTs are common.",
      category: "fpga",
      difficulty: "Intermediate",
      examples: ["4-input LUT", "6-input LUT"],
      relatedTerms: ["FPGA", "CLB", "Logic Block"]
    },
    {
      term: "FSM",
      definition: "Finite State Machine - A computational model used to design sequential logic circuits. Consists of states, transitions, inputs, and outputs.",
      category: "digital-logic",
      difficulty: "Beginner",
      examples: ["Traffic light controller", "Vending machine", "Protocol controller"],
      relatedTerms: ["State Diagram", "Sequential Logic", "Mealy Machine", "Moore Machine"]
    },
    {
      term: "CDC",
      definition: "Clock Domain Crossing - The technique of transferring signals between different clock domains. Requires special consideration to avoid metastability.",
      category: "timing",
      difficulty: "Advanced",
      examples: ["Dual-clock FIFO", "Handshake synchronizer", "Gray code counter"],
      relatedTerms: ["Metastability", "Synchronizer", "Clock Domain"]
    },
    {
      term: "RTL",
      definition: "Register Transfer Level - A design abstraction which models a synchronous digital circuit in terms of the flow of digital signals between hardware registers.",
      category: "methodology",
      difficulty: "Intermediate",
      examples: ["Verilog RTL", "VHDL RTL", "SystemVerilog RTL"],
      relatedTerms: ["HDL", "Synthesis", "Behavioral Model"]
    },
    {
      term: "Setup Time",
      definition: "The minimum amount of time the data input must be stable before the clock edge for reliable operation of a flip-flop or latch.",
      category: "timing",
      difficulty: "Intermediate",
      examples: ["D flip-flop setup", "SRAM setup time"],
      relatedTerms: ["Hold Time", "Clock Skew", "Timing Violation"]
    },
    {
      term: "FIFO",
      definition: "First In, First Out - A data structure where the first element added is the first one to be removed. Commonly used for buffering between different clock domains.",
      category: "memory",
      difficulty: "Beginner",
      examples: ["Asynchronous FIFO", "Synchronous FIFO", "Dual-port FIFO"],
      relatedTerms: ["LIFO", "Buffer", "Queue", "CDC"]
    },
    {
      term: "SPI",
      definition: "Serial Peripheral Interface - A synchronous serial communication protocol used for short-distance communication between microcontrollers and peripheral devices.",
      category: "protocols",
      difficulty: "Beginner",
      examples: ["SD card interface", "Flash memory", "ADC communication"],
      relatedTerms: ["UART", "I2C", "MISO", "MOSI", "SCLK"]
    },
    {
      term: "I2C",
      definition: "Inter-Integrated Circuit - A multi-master, multi-slave, packet switched, single-ended, serial communication bus for connecting low-speed peripherals.",
      category: "protocols",
      difficulty: "Beginner",
      examples: ["Temperature sensors", "EEPROMs", "Real-time clocks"],
      relatedTerms: ["SPI", "UART", "SDA", "SCL"]
    },
    {
      term: "Pipeline",
      definition: "A technique where multiple instruction phases are overlapped during execution, increasing the instruction throughput of a processor.",
      category: "architecture",
      difficulty: "Intermediate",
      examples: ["5-stage pipeline", "Superscalar pipeline", "Out-of-order pipeline"],
      relatedTerms: ["CPU", "Hazard", "Stall", "Branch Prediction"]
    },
    {
      term: "Multiplexer",
      definition: "A combinational circuit that selects one of several input signals and forwards it to a single output line based on select signals.",
      category: "digital-logic",
      difficulty: "Beginner",
      examples: ["2:1 MUX", "4:1 MUX", "8:1 MUX"],
      relatedTerms: ["Demultiplexer", "Decoder", "Encoder"]
    },
    {
      term: "Metastability",
      definition: "An unstable condition where a flip-flop or latch cannot settle to a valid logic state within the required time, often occurring during clock domain crossings.",
      category: "timing",
      difficulty: "Advanced",
      examples: ["Asynchronous input capture", "Clock domain crossing"],
      relatedTerms: ["CDC", "Synchronizer", "MTBF"]
    },
    {
      term: "Testbench",
      definition: "A simulation environment used to verify the functionality of a digital design by applying test vectors and checking outputs.",
      category: "methodology",
      difficulty: "Beginner",
      examples: ["SystemVerilog testbench", "UVM testbench", "VHDL testbench"],
      relatedTerms: ["Verification", "Simulation", "Assertion"]
    }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search terms and definitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-slate-200"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                    }
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glossary Terms */}
      <div className="space-y-4">
        {filteredTerms.map((term, index) => {
          const IconComponent = getCategoryIcon(term.category);
          return (
            <Card key={index} className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-200">{term.term}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(term.difficulty)}>
                            {term.difficulty}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {categories.find(cat => cat.id === term.category)?.name || term.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{term.definition}</p>

                  {term.examples && term.examples.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Common Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {term.examples.map((example, i) => (
                          <Badge key={i} variant="outline" className="border-slate-600 text-slate-400">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Related Terms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.map((relatedTerm, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery(relatedTerm)}
                            className="h-auto py-1 px-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                          >
                            {relatedTerm}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No terms found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlossaryTab;