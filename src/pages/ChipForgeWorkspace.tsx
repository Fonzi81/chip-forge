import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Star, ShoppingCart, Folder, Cloud, Settings,
  Eye, Cpu, Zap, FileText, CircuitBoard, Box, ChevronDown,
  Plus, CheckCircle, MessageSquare, Code, TestTube, Target,
  Brain, Send, AlertCircle, Sparkles, Clock, RefreshCw,
  Save, Download, ArrowRight, MousePointer, Move, RotateCw,
  ZoomIn, ZoomOut, Grid, Square, Circle, Triangle, Hexagon,
  Check, AlertTriangle, Shield, Package, Globe, Minus,
  X, RotateCcw, Wifi, Navigation, Compass, Satellite,
  Radio, Antenna, Microchip, Camera, Layers, CpuIcon,
  Calculator, Wrench, Gauge, Battery, RadioTower
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";

// General Chip Design Component interface
interface Component {
  id: string;
  name: string;
  type: 'nmos' | 'pmos' | 'bjt' | 'nand' | 'nor' | 'and' | 'or' | 'xor' | 'not' | 
        'dff' | 'sram' | 'rom' | 'adder' | 'multiplier' | 'alu' | 'io_buffer' | 
        'level_shifter' | 'opamp' | 'adc' | 'dac' | 'pll' | 'vreg' | 'power_switch' |
        'uart' | 'spi' | 'i2c';
  description: string;
  creator: string;
  verified: boolean;
  usage: string;
  likes: number;
  icon: React.ReactNode;
  category: string;
  pins: string[];
  power: string;
  area: string;
}

// AI Chat Message interface
interface AIChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
} 

// AI Copilot Component
function AICopilot({ messages, onSendMessage, onApplySuggestion }: {
  messages: AIChatMessage[];
  onSendMessage: (message: string) => void;
  onApplySuggestion: (suggestion: string) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          <h2 className="font-semibold text-slate-200">AI Copilot</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Analyze my chip design for timing violations")}
          >
            <AlertCircle className="h-3 w-3 mr-2" />
            Timing Analysis
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Optimize power consumption in my design")}
          >
            <Zap className="h-3 w-3 mr-2" />
            Power Optimization
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Generate testbench for my HDL module")}
          >
            <TestTube className="h-3 w-3 mr-2" />
            Generate Testbench
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
            onClick={() => onSendMessage("Check DRC violations in my layout")}
          >
            <Shield className="h-3 w-3 mr-2" />
            DRC Check
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-700 text-slate-200'
              }`}>
                <div className="text-sm">{message.content}</div>
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-auto p-1 text-slate-200 hover:bg-slate-600 hover:text-slate-100 bg-transparent"
                        onClick={() => onApplySuggestion(suggestion)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your chip design..."
            className="flex-1 bg-slate-700 border-slate-600 text-slate-100"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button size="sm" onClick={handleSend} className="bg-transparent border-slate-500 text-slate-300 hover:bg-slate-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 

// Schematic Design Tab with General Chip Components
function SchematicDesignTab() {
  const [components, setComponents] = useState<Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    connections: string[];
  }>>([]);
  const [wires, setWires] = useState<Array<{
    id: string;
    from: string;
    to: string;
    fromPin: string;
    toPin: string;
  }>>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add a default component (NAND gate) at click position
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: 'nand',
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      connections: []
    };
    
    setComponents(prev => [...prev, newComponent]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const componentType = e.dataTransfer.getData('text/plain');
    if (!componentType) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: componentType,
      x: Math.round(x / 20) * 20,
      y: Math.round(y / 20) * 20,
      connections: []
    };
    
    setComponents(prev => [...prev, newComponent]);
  };

  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const component = components.find(c => c.id === componentId);
    
    if (component) {
      setSelectedComponent(componentId);
      setIsDragging(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setDragOffset({
        x: e.clientX - rect.left - component.x,
        y: e.clientY - rect.top - component.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedComponent) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    const snappedX = Math.round(newX / 20) * 20;
    const snappedY = Math.round(newY / 20) * 20;
    
    setComponents(prev => prev.map(comp => 
      comp.id === selectedComponent 
        ? { ...comp, x: snappedX, y: snappedY }
        : comp
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedComponent(null);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!selectedComponent) return;
        
        const canvas = document.querySelector('.schematic-canvas') as HTMLElement;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const newX = e.clientX - rect.left - dragOffset.x;
          const newY = e.clientY - rect.top - dragOffset.y;
          
          const snappedX = Math.round(newX / 20) * 20;
          const snappedY = Math.round(newY / 20) * 20;
          
          setComponents(prev => prev.map(comp => 
            comp.id === selectedComponent 
              ? { ...comp, x: snappedX, y: snappedY }
              : comp
          ));
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setSelectedComponent(null);
        setDragOffset({ x: 0, y: 0 });
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, selectedComponent, dragOffset]);

  const getComponentSymbol = (type: string) => {
    switch (type) {
      case 'nmos':
        return (
          <div className="w-8 h-6 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-3 border border-slate-600 relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
              </div>
            </div>
          </div>
        );
      case 'pmos':
        return (
          <div className="w-8 h-6 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-3 border border-slate-600 relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-slate-600"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-slate-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'nand':
        return (
          <div className="w-10 h-8 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-4 border border-slate-600 rounded-l relative">
                <div className="absolute right-0 top-0 w-2 h-4 border-l border-slate-600 rounded-r"></div>
              </div>
            </div>
          </div>
        );
      case 'nor':
        return (
          <div className="w-10 h-8 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-4 border border-slate-600 rounded-l relative">
                <div className="absolute right-0 top-0 w-2 h-4 border-l border-slate-600 rounded-r"></div>
                <div className="absolute right-1 top-1/2 w-1 h-1 bg-slate-600 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'dff':
        return (
          <div className="w-12 h-10 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-6 border border-slate-600 rounded relative">
                <div className="absolute top-1 left-1 text-xs text-slate-600 font-bold">D</div>
                <div className="absolute bottom-1 left-1 text-xs text-slate-600 font-bold">Q</div>
                <div className="absolute top-1 right-1 text-xs text-slate-600">CLK</div>
              </div>
            </div>
          </div>
        );
      case 'adder':
        return (
          <div className="w-12 h-10 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-6 border border-slate-600 rounded relative">
                <div className="absolute top-1 left-1 text-xs text-slate-600 font-bold">+</div>
                <div className="absolute bottom-1 left-1 text-xs text-slate-600">A</div>
                <div className="absolute bottom-1 right-1 text-xs text-slate-600">B</div>
              </div>
            </div>
          </div>
        );
      case 'opamp':
        return (
          <div className="w-10 h-8 bg-slate-300 border border-slate-400 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-4 border border-slate-600 rounded relative">
                <div className="absolute top-1 left-1 text-xs text-slate-600">+</div>
                <div className="absolute bottom-1 left-1 text-xs text-slate-600">-</div>
                <div className="absolute top-1/2 right-1 text-xs text-slate-600 transform -translate-y-1/2">→</div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="w-6 h-4 bg-slate-300 border border-slate-400 rounded"></div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Schematic Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Schematic Design Area */}
        <div 
          className={`absolute inset-0 p-4 schematic-canvas transition-all duration-200 ${
            isDragOver ? 'bg-cyan-600/5 border-2 border-dashed border-cyan-400' : ''
          }`}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ 
            cursor: isDragging ? 'grabbing' : isDragOver ? 'copy' : 'crosshair'
          }}
        >
          {isDragOver && (
            <div className="absolute inset-0 bg-cyan-600/10 pointer-events-none rounded-lg flex items-center justify-center">
              <div className="text-center text-cyan-400">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm font-medium">Drop component here</div>
              </div>
            </div>
          )}
          {/* Placed Components */}
          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute cursor-move transition-transform ${
                selectedComponent === component.id ? 'ring-2 ring-cyan-400 z-10' : 'z-0'
              } ${isDragging && selectedComponent === component.id ? 'scale-105' : ''}`}
              style={{ 
                left: component.x, 
                top: component.y,
                transform: isDragging && selectedComponent === component.id ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseDown={(e) => handleMouseDown(e, component.id)}
            >
              {getComponentSymbol(component.type)}
              <div className="text-xs text-slate-400 mt-1 text-center">
                {component.type.toUpperCase()}
              </div>
            </div>
          ))}
          
          {/* Instructions */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <CircuitBoard className="h-12 w-12 mx-auto mb-2" />
                <div className="text-sm">Click anywhere to place chip components</div>
                <div className="text-xs">Drag components to move them</div>
                <div className="text-xs mt-2">Use the component library on the right</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-slate-800 border-t border-slate-700 p-2 flex items-center gap-2">
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <MousePointer className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <Move className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <Zap className="h-4 w-4" />
          Power Analysis
        </Button>
        <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
          <Eye className="h-4 w-4" />
          Signal Integrity
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="text-xs text-slate-400">
          Components: {components.length} | Wires: {wires.length}
        </div>
      </div>
    </div>
  );
} 

// HDL Design Tab with General Chip Design Code
function HDLDesignTab() {
  const [verilogCode, setVerilogCode] = useState(`// General Chip Design - Verilog Code
// Basic Logic Gates and Memory Elements

module basic_logic_gates (
  input wire a,
  input wire b,
  output wire and_out,
  output wire or_out,
  output wire nand_out,
  output wire nor_out,
  output wire xor_out,
  output wire not_out
);

  // Basic logic gate implementations
  assign and_out = a & b;
  assign or_out = a | b;
  assign nand_out = ~(a & b);
  assign nor_out = ~(a | b);
  assign xor_out = a ^ b;
  assign not_out = ~a;

endmodule

// D-Flip Flop with asynchronous reset
module d_flip_flop (
  input wire clk,
  input wire rst_n,
  input wire d,
  output reg q,
  output reg q_bar
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      q <= 1'b0;
      q_bar <= 1'b1;
    end else begin
      q <= d;
      q_bar <= ~d;
    end
  end

endmodule

// 4-bit Adder
module four_bit_adder (
  input wire [3:0] a,
  input wire [3:0] b,
  input wire cin,
  output wire [3:0] sum,
  output wire cout
);

  wire [4:0] carry;
  assign carry[0] = cin;
  
  genvar i;
  generate
    for (i = 0; i < 4; i = i + 1) begin : adder_loop
      assign sum[i] = a[i] ^ b[i] ^ carry[i];
      assign carry[i + 1] = (a[i] & b[i]) | (a[i] & carry[i]) | (b[i] & carry[i]);
    end
  endgenerate
  
  assign cout = carry[4];

endmodule

// Simple SRAM Cell
module sram_cell (
  input wire clk,
  input wire we,
  input wire [7:0] addr,
  input wire [7:0] data_in,
  output reg [7:0] data_out
);

  reg [7:0] memory [0:255]; // 256 x 8-bit memory
  
  always @(posedge clk) begin
    if (we) begin
      memory[addr] <= data_in;
    end
    data_out <= memory[addr];
  end

endmodule

// 8-bit ALU
module alu_8bit (
  input wire [7:0] a,
  input wire [7:0] b,
  input wire [2:0] op,
  output reg [7:0] result,
  output reg zero_flag,
  output reg carry_flag
);

  always @(*) begin
    case (op)
      3'b000: result = a + b;      // ADD
      3'b001: result = a - b;      // SUB
      3'b010: result = a & b;      // AND
      3'b011: result = a | b;      // OR
      3'b100: result = a ^ b;      // XOR
      3'b101: result = ~a;         // NOT
      3'b110: result = a << 1;     // SHIFT LEFT
      3'b111: result = a >> 1;     // SHIFT RIGHT
    endcase
    
    zero_flag = (result == 8'h00);
    carry_flag = (op == 3'b000) && (a + b > 8'hFF);
  end

endmodule

// Clock Divider
module clock_divider (
  input wire clk_in,
  input wire rst_n,
  output reg clk_out
);

  reg [31:0] counter;
  
  always @(posedge clk_in or negedge rst_n) begin
    if (!rst_n) begin
      counter <= 32'h00000000;
      clk_out <= 1'b0;
    end else begin
      if (counter >= 32'h0000000F) begin // Divide by 32
        counter <= 32'h00000000;
        clk_out <= ~clk_out;
      end else begin
        counter <= counter + 1;
      end
    end
  end

endmodule

// Top Level Module
module chip_design_top (
  input wire clk,
  input wire rst_n,
  input wire [7:0] input_data,
  input wire [7:0] input_addr,
  input wire write_enable,
  input wire [2:0] alu_op,
  output wire [7:0] output_data,
  output wire [7:0] alu_result
);

  wire [7:0] memory_data;
  wire [7:0] logic_result;
  
  // Instantiate modules
  sram_cell memory (
    .clk(clk),
    .we(write_enable),
    .addr(input_addr),
    .data_in(input_data),
    .data_out(memory_data)
  );
  
  alu_8bit alu (
    .a(input_data),
    .b(memory_data),
    .op(alu_op),
    .result(alu_result),
    .zero_flag(),
    .carry_flag()
  );
  
  basic_logic_gates logic_gates (
    .a(input_data[0]),
    .b(input_data[1]),
    .and_out(),
    .or_out(),
    .nand_out(),
    .nor_out(),
    .xor_out(),
    .not_out()
  );
  
  assign output_data = memory_data;

endmodule

// Testbench
module chip_design_tb;
  reg clk;
  reg rst_n;
  reg [7:0] input_data;
  reg [7:0] input_addr;
  reg write_enable;
  reg [2:0] alu_op;
  wire [7:0] output_data;
  wire [7:0] alu_result;
  
  // Instantiate the design under test
  chip_design_top dut (
    .clk(clk),
    .rst_n(rst_n),
    .input_data(input_data),
    .input_addr(input_addr),
    .write_enable(write_enable),
    .alu_op(alu_op),
    .output_data(output_data),
    .alu_result(alu_result)
  );
  
  // Clock generation
  initial begin
    clk = 0;
    forever #5 clk = ~clk;
  end
  
  // Test stimulus
  initial begin
    // Initialize
    rst_n = 0;
    input_data = 8'h00;
    input_addr = 8'h00;
    write_enable = 0;
    alu_op = 3'b000;
    
    // Release reset
    #10 rst_n = 1;
    
    // Write data to memory
    #10 write_enable = 1;
    input_addr = 8'h01;
    input_data = 8'hAA;
    
    #10 input_addr = 8'h02;
    input_data = 8'h55;
    
    #10 write_enable = 0;
    
    // Test ALU operations
    #10 alu_op = 3'b000; // ADD
    input_data = 8'h10;
    
    #10 alu_op = 3'b010; // AND
    input_data = 8'h0F;
    
    #10 alu_op = 3'b100; // XOR
    input_data = 8'hFF;
    
    #100 $finish;
  end
  
  // Monitor outputs
  initial begin
    $monitor("Time=%0t rst_n=%b addr=%h data_in=%h alu_op=%b alu_result=%h", 
             $time, rst_n, input_addr, input_data, alu_op, alu_result);
  end

endmodule`);

  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVerilogFromSchematic = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCode = `// AI-Generated Verilog from Schematic
module ai_generated_design (
  input wire clk,
  input wire rst_n,
  input wire [7:0] data_in,
  output wire [7:0] data_out
);

  // Generated from schematic components
  wire [7:0] processed_data;
  wire [7:0] memory_data;
  wire [7:0] alu_result;
  
  // Component instantiations based on schematic
  sram_cell memory1 (.clk(clk), .we(1'b1), .addr(data_in[7:0]), .data_in(data_in), .data_out(memory_data));
  alu_8bit alu1 (.a(data_in), .b(memory_data), .op(3'b000), .result(alu_result));
  d_flip_flop dff1 (.clk(clk), .rst_n(rst_n), .d(alu_result[0]), .q(processed_data[0]));
  
  assign data_out = processed_data;

endmodule`;
      
      setVerilogCode(newCode);
      setIsGenerating(false);
    }, 2000);
  };

  const validateSyntax = () => {
    const errors: string[] = [];
    
    if (!verilogCode.includes('module')) {
      errors.push('Missing module declaration');
    }
    
    if (!verilogCode.includes('endmodule')) {
      errors.push('Missing endmodule');
    }
    
    if (verilogCode.includes('wire') && !verilogCode.includes('assign')) {
      errors.push('Wire declared but not assigned');
    }
    
    if (verilogCode.includes('reg') && !verilogCode.includes('always')) {
      errors.push('Register declared but not used in always block');
    }
    
    setSyntaxErrors(errors);
  };

  return (
    <div className="h-full flex flex-col">
      {/* HDL Editor Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-slate-200">Chip Design HDL Editor</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
              onClick={generateVerilogFromSchematic}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-2" />
                  Generate from Schematic
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent"
              onClick={validateSyntax}
            >
              <Check className="h-3 w-3 mr-2" />
              Validate Syntax
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Verilog-2001
          </Badge>
          <Badge variant="outline" className="text-xs">
            {verilogCode.split('\n').length} lines
          </Badge>
        </div>
      </div>

      {/* Syntax Errors */}
      {syntaxErrors.length > 0 && (
        <div className="bg-red-900/20 border-b border-red-700 p-2">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Syntax Errors:</span>
          </div>
          <ul className="text-xs text-red-300 mt-1 ml-6">
            {syntaxErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 relative">
        <textarea
          value={verilogCode}
          onChange={(e) => setVerilogCode(e.target.value)}
          className="w-full h-full bg-slate-900 text-slate-200 p-4 font-mono text-sm resize-none border-none outline-none"
          placeholder="Enter chip design Verilog code here..."
          spellCheck={false}
        />
        
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 w-12 h-full bg-slate-800 border-r border-slate-700 p-4 font-mono text-xs text-slate-500 select-none">
          {verilogCode.split('\n').map((_, index) => (
            <div key={index} className="text-right">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-slate-800 border-t border-slate-700 p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
            <Save className="h-3 w-3 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
            <Download className="h-3 w-3 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
            <TestTube className="h-3 w-3 mr-2" />
            Generate Testbench
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>AI Suggestions: 3</span>
          <span>•</span>
          <span>Syntax: {syntaxErrors.length > 0 ? 'Error' : 'Valid'}</span>
        </div>
      </div>
    </div>
  );
} 

// Component Library for General Chip Design
function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);

  const chipComponents: Component[] = [
    // Transistors
    {
      id: 'nmos_001',
      name: 'NMOS Transistor',
      type: 'nmos',
      description: 'N-channel MOSFET for digital logic',
      creator: 'TSMC',
      verified: true,
      usage: '15.2k',
      likes: 892,
      icon: <Cpu className="h-4 w-4" />,
      category: 'Transistors',
      pins: ['Source', 'Drain', 'Gate', 'Bulk'],
      power: '0.1mW',
      area: '0.5μm²'
    },
    {
      id: 'pmos_001',
      name: 'PMOS Transistor',
      type: 'pmos',
      description: 'P-channel MOSFET for complementary logic',
      creator: 'TSMC',
      verified: true,
      usage: '12.8k',
      likes: 756,
      icon: <Cpu className="h-4 w-4" />,
      category: 'Transistors',
      pins: ['Source', 'Drain', 'Gate', 'Bulk'],
      power: '0.1mW',
      area: '1.0μm²'
    },
    {
      id: 'bjt_001',
      name: 'BJT Transistor',
      type: 'bjt',
      description: 'Bipolar Junction Transistor for analog circuits',
      creator: 'TSMC',
      verified: true,
      usage: '3.4k',
      likes: 234,
      icon: <Cpu className="h-4 w-4" />,
      category: 'Transistors',
      pins: ['Emitter', 'Base', 'Collector'],
      power: '1.0mW',
      area: '2.0μm²'
    },
    // Logic Gates
    {
      id: 'nand_001',
      name: 'NAND Gate',
      type: 'nand',
      description: 'Universal logic gate (NOT-AND)',
      creator: 'TSMC',
      verified: true,
      usage: '25.6k',
      likes: 1245,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.2mW',
      area: '1.5μm²'
    },
    {
      id: 'nor_001',
      name: 'NOR Gate',
      type: 'nor',
      description: 'Universal logic gate (NOT-OR)',
      creator: 'TSMC',
      verified: true,
      usage: '18.9k',
      likes: 987,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.2mW',
      area: '1.5μm²'
    },
    {
      id: 'and_001',
      name: 'AND Gate',
      type: 'and',
      description: 'Logical AND operation',
      creator: 'TSMC',
      verified: true,
      usage: '22.1k',
      likes: 1102,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.15mW',
      area: '1.2μm²'
    },
    {
      id: 'or_001',
      name: 'OR Gate',
      type: 'or',
      description: 'Logical OR operation',
      creator: 'TSMC',
      verified: true,
      usage: '19.7k',
      likes: 876,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.15mW',
      area: '1.2μm²'
    },
    {
      id: 'xor_001',
      name: 'XOR Gate',
      type: 'xor',
      description: 'Exclusive OR operation',
      creator: 'TSMC',
      verified: true,
      usage: '8.3k',
      likes: 445,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'B', 'Y'],
      power: '0.3mW',
      area: '2.5μm²'
    },
    {
      id: 'not_001',
      name: 'NOT Gate',
      type: 'not',
      description: 'Logical inversion',
      creator: 'TSMC',
      verified: true,
      usage: '31.2k',
      likes: 1567,
      icon: <CircuitBoard className="h-4 w-4" />,
      category: 'Logic Gates',
      pins: ['A', 'Y'],
      power: '0.1mW',
      area: '0.8μm²'
    },
    // Memory Elements
    {
      id: 'dff_001',
      name: 'D-Flip Flop',
      type: 'dff',
      description: 'Data flip-flop with clock',
      creator: 'TSMC',
      verified: true,
      usage: '14.7k',
      likes: 678,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Memory Elements',
      pins: ['D', 'CLK', 'Q', 'Q_bar'],
      power: '0.5mW',
      area: '3.0μm²'
    },
    {
      id: 'sram_001',
      name: 'SRAM Cell',
      type: 'sram',
      description: '6T Static RAM cell',
      creator: 'TSMC',
      verified: true,
      usage: '9.2k',
      likes: 523,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Memory Elements',
      pins: ['BL', 'BL_bar', 'WL', 'VDD', 'GND'],
      power: '0.1μW',
      area: '1.2μm²'
    },
    {
      id: 'rom_001',
      name: 'ROM Cell',
      type: 'rom',
      description: 'Read-Only Memory cell',
      creator: 'TSMC',
      verified: true,
      usage: '5.8k',
      likes: 312,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Memory Elements',
      pins: ['BL', 'WL', 'VDD'],
      power: '0.05μW',
      area: '0.8μm²'
    },
    // Arithmetic Units
    {
      id: 'adder_001',
      name: 'Full Adder',
      type: 'adder',
      description: '1-bit full adder with carry',
      creator: 'TSMC',
      verified: true,
      usage: '11.3k',
      likes: 567,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Arithmetic Units',
      pins: ['A', 'B', 'Cin', 'Sum', 'Cout'],
      power: '0.4mW',
      area: '2.8μm²'
    },
    {
      id: 'multiplier_001',
      name: 'Multiplier',
      type: 'multiplier',
      description: '8x8 bit multiplier',
      creator: 'TSMC',
      verified: true,
      usage: '6.7k',
      likes: 389,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Arithmetic Units',
      pins: ['A[7:0]', 'B[7:0]', 'Result[15:0]'],
      power: '2.5mW',
      area: '45.0μm²'
    },
    {
      id: 'alu_001',
      name: 'ALU',
      type: 'alu',
      description: '8-bit Arithmetic Logic Unit',
      creator: 'TSMC',
      verified: true,
      usage: '8.9k',
      likes: 456,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Arithmetic Units',
      pins: ['A[7:0]', 'B[7:0]', 'Op[2:0]', 'Result[7:0]', 'Flags'],
      power: '1.8mW',
      area: '25.0μm²'
    },
    // Interface Circuits
    {
      id: 'io_buffer_001',
      name: 'I/O Buffer',
      type: 'io_buffer',
      description: 'Input/Output buffer with ESD protection',
      creator: 'TSMC',
      verified: true,
      usage: '7.4k',
      likes: 298,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Interface Circuits',
      pins: ['Pad', 'Core', 'VDD', 'GND'],
      power: '0.8mW',
      area: '8.0μm²'
    },
    {
      id: 'level_shifter_001',
      name: 'Level Shifter',
      type: 'level_shifter',
      description: 'Voltage level converter',
      creator: 'TSMC',
      verified: true,
      usage: '4.2k',
      likes: 234,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Interface Circuits',
      pins: ['In', 'Out', 'VDD_L', 'VDD_H'],
      power: '0.3mW',
      area: '3.5μm²'
    },
    // Analog Circuits
    {
      id: 'opamp_001',
      name: 'Op-Amp',
      type: 'opamp',
      description: 'Operational amplifier',
      creator: 'TSMC',
      verified: true,
      usage: '3.8k',
      likes: 187,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['V+', 'V-', 'Vout', 'VDD', 'GND'],
      power: '1.2mW',
      area: '15.0μm²'
    },
    {
      id: 'adc_001',
      name: 'ADC',
      type: 'adc',
      description: '8-bit Analog-to-Digital Converter',
      creator: 'TSMC',
      verified: true,
      usage: '2.1k',
      likes: 145,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['Vin', 'Clk', 'Dout[7:0]', 'VDD', 'GND'],
      power: '3.5mW',
      area: '35.0μm²'
    },
    {
      id: 'dac_001',
      name: 'DAC',
      type: 'dac',
      description: '8-bit Digital-to-Analog Converter',
      creator: 'TSMC',
      verified: true,
      usage: '1.9k',
      likes: 123,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['Din[7:0]', 'Clk', 'Vout', 'VDD', 'GND'],
      power: '2.8mW',
      area: '28.0μm²'
    },
    {
      id: 'pll_001',
      name: 'PLL',
      type: 'pll',
      description: 'Phase-Locked Loop',
      creator: 'TSMC',
      verified: true,
      usage: '1.5k',
      likes: 98,
      icon: <Gauge className="h-4 w-4" />,
      category: 'Analog Circuits',
      pins: ['Clk_in', 'Clk_out', 'Lock', 'VDD', 'GND'],
      power: '5.0mW',
      area: '50.0μm²'
    },
    // Power Management
    {
      id: 'vreg_001',
      name: 'Voltage Regulator',
      type: 'vreg',
      description: 'Low-dropout voltage regulator',
      creator: 'TSMC',
      verified: true,
      usage: '6.3k',
      likes: 345,
      icon: <Battery className="h-4 w-4" />,
      category: 'Power Management',
      pins: ['Vin', 'Vout', 'Enable', 'GND'],
      power: '0.5mW',
      area: '12.0μm²'
    },
    {
      id: 'power_switch_001',
      name: 'Power Switch',
      type: 'power_switch',
      description: 'Power gating switch',
      creator: 'TSMC',
      verified: true,
      usage: '4.7k',
      likes: 267,
      icon: <Battery className="h-4 w-4" />,
      category: 'Power Management',
      pins: ['VDD_in', 'VDD_out', 'Enable', 'GND'],
      power: '0.1mW',
      area: '5.0μm²'
    },
    // Communication
    {
      id: 'uart_001',
      name: 'UART',
      type: 'uart',
      description: 'Universal Asynchronous Receiver/Transmitter',
      creator: 'TSMC',
      verified: true,
      usage: '3.2k',
      likes: 189,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Communication',
      pins: ['Tx', 'Rx', 'Clk', 'Data[7:0]'],
      power: '1.5mW',
      area: '18.0μm²'
    },
    {
      id: 'spi_001',
      name: 'SPI Interface',
      type: 'spi',
      description: 'Serial Peripheral Interface',
      creator: 'TSMC',
      verified: true,
      usage: '2.8k',
      likes: 156,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Communication',
      pins: ['MOSI', 'MISO', 'SCK', 'CS', 'Data[7:0]'],
      power: '1.2mW',
      area: '15.0μm²'
    },
    {
      id: 'i2c_001',
      name: 'I2C Interface',
      type: 'i2c',
      description: 'Inter-Integrated Circuit',
      creator: 'TSMC',
      verified: true,
      usage: '2.4k',
      likes: 134,
      icon: <RadioTower className="h-4 w-4" />,
      category: 'Communication',
      pins: ['SDA', 'SCL', 'Data[7:0]', 'Addr[6:0]'],
      power: '0.8mW',
      area: '12.0μm²'
    }
  ];

  const categories = ['all', 'Transistors', 'Logic Gates', 'Memory Elements', 'Arithmetic Units', 'Interface Circuits', 'Analog Circuits', 'Power Management', 'Communication'];

  const filteredComponents = chipComponents.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    setDraggedComponent(component);
    e.dataTransfer.setData('text/plain', component.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
  };

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col min-h-0">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-cyan-400" />
          <h2 className="font-semibold text-slate-200">Chip Component Library</h2>
        </div>
        <Input
          placeholder="Search chip components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-700 border-slate-600 text-slate-100"
        />
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={`text-xs ${
                selectedCategory === category 
                  ? 'bg-cyan-600 text-white' 
                  : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-3">
          {filteredComponents.map((component) => (
            <Card 
              key={component.id} 
              className={`bg-slate-700 border-slate-600 hover:bg-slate-600 cursor-grab active:cursor-grabbing transition-all ${
                draggedComponent?.id === component.id ? 'ring-2 ring-cyan-400 scale-105' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-600 rounded-lg">
                    {component.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-slate-200 truncate">
                        {component.name}
                      </h3>
                      {component.verified && (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                      {component.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>by {component.creator}</span>
                      <div className="flex items-center gap-2">
                        <span>{component.usage}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{component.likes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Power: {component.power}</span>
                      <span>Area: {component.area}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 

// 3D Model Design Tab with Realistic Chip Visualization
function ModelDesignTab() {
  const [viewMode, setViewMode] = useState<'3d' | 'top' | 'side' | 'cross'>('3d');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string>('Metal 3');

  const chipLayers = [
    { name: 'Metal 3', color: '#FFD700', thickness: 2, material: 'Copper', resistivity: '1.68 μΩ·cm' },
    { name: 'Via 2-3', color: '#FFA500', thickness: 1, material: 'Tungsten', resistivity: '5.6 μΩ·cm' },
    { name: 'Metal 2', color: '#FF6347', thickness: 2, material: 'Copper', resistivity: '1.68 μΩ·cm' },
    { name: 'Via 1-2', color: '#FF4500', thickness: 1, material: 'Tungsten', resistivity: '5.6 μΩ·cm' },
    { name: 'Metal 1', color: '#DC143C', thickness: 2, material: 'Copper', resistivity: '1.68 μΩ·cm' },
    { name: 'Via 0-1', color: '#B22222', thickness: 1, material: 'Tungsten', resistivity: '5.6 μΩ·cm' },
    { name: 'Poly', color: '#32CD32', thickness: 1, material: 'Polysilicon', resistivity: '1000 μΩ·cm' },
    { name: 'Active', color: '#4169E1', thickness: 1, material: 'Silicon', resistivity: '2300 μΩ·cm' },
    { name: 'Substrate', color: '#8B4513', thickness: 10, material: 'P-Silicon', resistivity: '100000 μΩ·cm' }
  ];

  const transistorStructures = [
    { id: 't1', x: 50, y: 30, type: 'NMOS', width: 2, length: 0.5, gateVoltage: '1.2V' },
    { id: 't2', x: 120, y: 30, type: 'PMOS', width: 4, length: 0.5, gateVoltage: '0V' },
    { id: 't3', x: 190, y: 30, type: 'NMOS', width: 1.5, length: 0.3, gateVoltage: '1.2V' },
    { id: 't4', x: 50, y: 100, type: 'PMOS', width: 3, length: 0.5, gateVoltage: '0V' },
    { id: 't5', x: 120, y: 100, type: 'NMOS', width: 2.5, length: 0.4, gateVoltage: '1.2V' }
  ];

  const renderChip3D = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      {/* 3D Chip Visualization */}
      <div 
        className="relative transform-gpu"
        style={{
          transform: `scale(${zoom}) rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Chip Die with Realistic Materials */}
        <div className="w-80 h-80 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg shadow-2xl relative">
          {/* Die Surface with Actual Chip Features */}
          <div className="absolute inset-4 bg-slate-800 rounded-md">
            {/* Metal Interconnects (Realistic Pattern) */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 288 288">
              {/* Metal 3 Layer - Power Distribution */}
              <path d="M 20 20 L 268 20" stroke="#FFD700" strokeWidth="3" fill="none"/>
              <path d="M 20 268 L 268 268" stroke="#FFD700" strokeWidth="3" fill="none"/>
              <path d="M 20 20 L 20 268" stroke="#FFD700" strokeWidth="3" fill="none"/>
              <path d="M 268 20 L 268 268" stroke="#FFD700" strokeWidth="3" fill="none"/>
              
              {/* Metal 2 Layer - Signal Routing */}
              <path d="M 40 60 L 120 60" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 160 60 L 248 60" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 40 120 L 80 120" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 120 120 L 200 120" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 220 120 L 248 120" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 40 180 L 100 180" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 140 180 L 248 180" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 40 240 L 60 240" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 80 240 L 160 240" stroke="#FF6347" strokeWidth="2" fill="none"/>
              <path d="M 180 240 L 248 240" stroke="#FF6347" strokeWidth="2" fill="none"/>
              
              {/* Metal 1 Layer - Local Interconnects */}
              <path d="M 50 80 L 70 80" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 90 80 L 110 80" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 130 80 L 150 80" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 170 80 L 190 80" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 210 80 L 230 80" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 50 140 L 70 140" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 90 140 L 110 140" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 130 140 L 150 140" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 170 140 L 190 140" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 210 140 L 230 140" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 50 200 L 70 200" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 90 200 L 110 200" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 130 200 L 150 200" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 170 200 L 190 200" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              <path d="M 210 200 L 230 200" stroke="#DC143C" strokeWidth="1.5" fill="none"/>
              
              {/* Vias (Vertical Connections) */}
              <circle cx="60" cy="60" r="2" fill="#FFA500"/>
              <circle cx="120" cy="60" r="2" fill="#FFA500"/>
              <circle cx="180" cy="60" r="2" fill="#FFA500"/>
              <circle cx="60" cy="120" r="2" fill="#FFA500"/>
              <circle cx="120" cy="120" r="2" fill="#FFA500"/>
              <circle cx="180" cy="120" r="2" fill="#FFA500"/>
              <circle cx="60" cy="180" r="2" fill="#FFA500"/>
              <circle cx="120" cy="180" r="2" fill="#FFA500"/>
              <circle cx="180" cy="180" r="2" fill="#FFA500"/>
              
              {/* Transistor Outlines */}
              <rect x="45" y="25" width="30" height="20" fill="none" stroke="#32CD32" strokeWidth="1" strokeDasharray="2,2"/>
              <rect x="115" y="25" width="30" height="20" fill="none" stroke="#32CD32" strokeWidth="1" strokeDasharray="2,2"/>
              <rect x="185" y="25" width="30" height="20" fill="none" stroke="#32CD32" strokeWidth="1" strokeDasharray="2,2"/>
              <rect x="45" y="95" width="30" height="20" fill="none" stroke="#32CD32" strokeWidth="1" strokeDasharray="2,2"/>
              <rect x="115" y="95" width="30" height="20" fill="none" stroke="#32CD32" strokeWidth="1" strokeDasharray="2,2"/>
              <rect x="185" y="95" width="30" height="20" fill="none" stroke="#32CD32" strokeWidth="1" strokeDasharray="2,2"/>
              
              {/* Bonding Pads */}
              <circle cx="20" cy="20" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="268" cy="20" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="20" cy="268" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="268" cy="268" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="144" cy="20" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="144" cy="268" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="20" cy="144" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
              <circle cx="268" cy="144" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
            </svg>
            
            {/* Component Labels */}
            <div className="absolute top-8 left-8 text-xs text-slate-300 font-mono">
              <div>ALU</div>
              <div className="text-xs text-slate-400">8-bit</div>
            </div>
            <div className="absolute top-8 right-8 text-xs text-slate-300 font-mono">
              <div>SRAM</div>
              <div className="text-xs text-slate-400">256x8</div>
            </div>
            <div className="absolute bottom-8 left-8 text-xs text-slate-300 font-mono">
              <div>CLK</div>
              <div className="text-xs text-slate-400">DIV</div>
            </div>
            <div className="absolute bottom-8 right-8 text-xs text-slate-300 font-mono">
              <div>I/O</div>
              <div className="text-xs text-slate-400">BUF</div>
            </div>
          </div>
          
          {/* Layer Stack Visualization */}
          <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-b-lg">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
              LAYER STACK
            </div>
          </div>
        </div>
        
        {/* Package with Realistic Materials */}
        <div className="absolute -inset-6 bg-gradient-to-br from-slate-500 to-slate-400 rounded-xl opacity-30 shadow-lg">
          <div className="absolute inset-2 bg-gradient-to-br from-slate-600 to-slate-500 rounded-lg opacity-50"></div>
        </div>
      </div>
      
      {/* Layer Information Panel */}
      <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h4 className="text-sm font-medium text-slate-200 mb-3">Chip Layers</h4>
        <div className="space-y-2">
          {chipLayers.map((layer) => (
            <div 
              key={layer.name}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedLayer === layer.name ? 'bg-slate-700' : 'hover:bg-slate-700/50'
              }`}
              onClick={() => setSelectedLayer(layer.name)}
            >
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: layer.color }}
              ></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-200">{layer.name}</div>
                <div className="text-xs text-slate-400">{layer.material}</div>
              </div>
              <div className="text-xs text-slate-500">{layer.thickness}μm</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-slate-300" />
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-20"
            />
            <ZoomOut className="h-4 w-4 text-slate-300" />
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-slate-300" />
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-20"
            />
            <RotateCw className="h-4 w-4 text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTopView = () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="w-96 h-96 bg-slate-800 rounded-lg relative">
        {/* Top View Layout with Realistic Chip Features */}
        <svg className="w-full h-full" viewBox="0 0 384 384">
          {/* Die Outline */}
          <rect x="32" y="32" width="320" height="320" fill="none" stroke="#FFD700" strokeWidth="4" rx="8"/>
          
          {/* Metal 3 Layer - Power Grid */}
          <rect x="48" y="48" width="288" height="288" fill="none" stroke="#FFD700" strokeWidth="3"/>
          <path d="M 144 48 L 144 336" stroke="#FFD700" strokeWidth="2"/>
          <path d="M 240 48 L 240 336" stroke="#FFD700" strokeWidth="2"/>
          <path d="M 48 144 L 336 144" stroke="#FFD700" strokeWidth="2"/>
          <path d="M 48 240 L 336 240" stroke="#FFD700" strokeWidth="2"/>
          
          {/* Metal 2 Layer - Signal Routing */}
          <path d="M 64 80 L 160 80" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 224 80 L 320 80" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 64 128 L 128 128" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 160 128 L 256 128" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 64 176 L 96 176" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 128 176 L 224 176" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 256 176 L 320 176" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 64 224 L 112 224" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 144 224 L 240 224" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 272 224 L 320 224" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 64 272 L 80 272" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 96 272 L 192 272" stroke="#FF6347" strokeWidth="2"/>
          <path d="M 224 272 L 320 272" stroke="#FF6347" strokeWidth="2"/>
          
          {/* Functional Blocks */}
          <rect x="64" y="64" width="64" height="48" fill="#4ade80" stroke="#22c55e" strokeWidth="2" rx="4"/>
          <text x="96" y="92" textAnchor="middle" fill="white" fontSize="10">ALU</text>
          
          <rect x="256" y="64" width="64" height="48" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" rx="4"/>
          <text x="288" y="92" textAnchor="middle" fill="white" fontSize="10">SRAM</text>
          
          <rect x="64" y="128" width="64" height="48" fill="#f59e0b" stroke="#d97706" strokeWidth="2" rx="4"/>
          <text x="96" y="156" textAnchor="middle" fill="white" fontSize="10">CLK</text>
          
          <rect x="256" y="128" width="64" height="48" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" rx="4"/>
          <text x="288" y="156" textAnchor="middle" fill="white" fontSize="10">I/O</text>
          
          <rect x="64" y="192" width="64" height="48" fill="#ec4899" stroke="#db2777" strokeWidth="2" rx="4"/>
          <text x="96" y="220" textAnchor="middle" fill="white" fontSize="10">CTRL</text>
          
          <rect x="256" y="192" width="64" height="48" fill="#10b981" stroke="#059669" strokeWidth="2" rx="4"/>
          <text x="288" y="220" textAnchor="middle" fill="white" fontSize="10">PLL</text>
          
          {/* Transistor Arrays */}
          <g stroke="#32CD32" strokeWidth="1" fill="none">
            <rect x="144" y="64" width="96" height="48" strokeDasharray="2,2"/>
            <rect x="144" y="128" width="96" height="48" strokeDasharray="2,2"/>
            <rect x="144" y="192" width="96" height="48" strokeDasharray="2,2"/>
          </g>
          
          {/* Bonding Pads */}
          <circle cx="32" cy="32" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="352" cy="32" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="32" cy="352" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="352" cy="352" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="192" cy="32" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="192" cy="352" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="32" cy="192" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
          <circle cx="352" cy="192" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );

  const renderSideView = () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="w-96 h-96 bg-slate-800 rounded-lg relative">
        {/* Side View - Detailed Layer Stack */}
        <div className="absolute inset-8 flex flex-col justify-center">
          {chipLayers.map((layer, index) => (
            <div
              key={layer.name}
              className="flex items-center mb-1"
              style={{ height: `${layer.thickness * 3}px` }}
            >
              <div 
                className="w-full h-full rounded"
                style={{ backgroundColor: layer.color }}
              ></div>
              <div className="ml-3 text-xs text-slate-300 w-20">{layer.name}</div>
              <div className="ml-2 text-xs text-slate-400 w-16">{layer.material}</div>
              <div className="ml-2 text-xs text-slate-500 w-12">{layer.thickness}μm</div>
            </div>
          ))}
        </div>
        
        {/* Layer Details */}
        <div className="absolute right-8 top-8 text-xs text-slate-400">
          <div className="font-medium mb-2">Layer Properties</div>
          <div className="space-y-1">
            {chipLayers.map((layer) => (
              <div key={layer.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: layer.color }}
                ></div>
                <span>{layer.name}:</span>
                <span className="text-slate-500">{layer.resistivity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCrossSection = () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="w-96 h-96 bg-slate-800 rounded-lg relative">
        {/* Cross Section View - Transistor Structures */}
        <svg className="w-full h-full" viewBox="0 0 384 384">
          {/* Substrate */}
          <rect x="32" y="320" width="320" height="32" fill="#8B4513"/>
          
          {/* Active Regions */}
          <rect x="64" y="304" width="48" height="16" fill="#4169E1"/>
          <rect x="144" y="304" width="48" height="16" fill="#4169E1"/>
          <rect x="224" y="304" width="48" height="16" fill="#4169E1"/>
          <rect x="304" y="304" width="48" height="16" fill="#4169E1"/>
          
          {/* Gate Oxide */}
          <rect x="64" y="296" width="48" height="8" fill="#32CD32" opacity="0.7"/>
          <rect x="144" y="296" width="48" height="8" fill="#32CD32" opacity="0.7"/>
          <rect x="224" y="296" width="48" height="8" fill="#32CD32" opacity="0.7"/>
          <rect x="304" y="296" width="48" height="8" fill="#32CD32" opacity="0.7"/>
          
          {/* Polysilicon Gates */}
          <rect x="80" y="280" width="16" height="24" fill="#32CD32"/>
          <rect x="160" y="280" width="16" height="24" fill="#32CD32"/>
          <rect x="240" y="280" width="16" height="24" fill="#32CD32"/>
          <rect x="320" y="280" width="16" height="24" fill="#32CD32"/>
          
          {/* Metal 1 Interconnects */}
          <rect x="64" y="264" width="48" height="8" fill="#DC143C"/>
          <rect x="144" y="264" width="48" height="8" fill="#DC143C"/>
          <rect x="224" y="264" width="48" height="8" fill="#DC143C"/>
          <rect x="304" y="264" width="48" height="8" fill="#DC143C"/>
          
          {/* Metal 2 Interconnects */}
          <rect x="64" y="248" width="48" height="8" fill="#FF6347"/>
          <rect x="144" y="248" width="48" height="8" fill="#FF6347"/>
          <rect x="224" y="248" width="48" height="8" fill="#FF6347"/>
          <rect x="304" y="248" width="48" height="8" fill="#FF6347"/>
          
          {/* Metal 3 Power Rails */}
          <rect x="32" y="232" width="320" height="8" fill="#FFD700"/>
          <rect x="32" y="216" width="320" height="8" fill="#FFD700"/>
          
          {/* Vias */}
          <circle cx="88" cy="272" r="2" fill="#FFA500"/>
          <circle cx="168" cy="272" r="2" fill="#FFA500"/>
          <circle cx="248" cy="272" r="2" fill="#FFA500"/>
          <circle cx="328" cy="272" r="2" fill="#FFA500"/>
          <circle cx="88" cy="256" r="2" fill="#FF4500"/>
          <circle cx="168" cy="256" r="2" fill="#FF4500"/>
          <circle cx="248" cy="256" r="2" fill="#FF4500"/>
          <circle cx="328" cy="256" r="2" fill="#FF4500"/>
          
          {/* Labels */}
          <text x="192" y="340" textAnchor="middle" fill="white" fontSize="10">Substrate (P-Silicon)</text>
          <text x="192" y="310" textAnchor="middle" fill="white" fontSize="8">Active Regions</text>
          <text x="192" y="300" textAnchor="middle" fill="white" fontSize="8">Gate Oxide</text>
          <text x="192" y="290" textAnchor="middle" fill="white" fontSize="8">Polysilicon Gates</text>
          <text x="192" y="270" textAnchor="middle" fill="white" fontSize="8">Metal 1</text>
          <text x="192" y="254" textAnchor="middle" fill="white" fontSize="8">Metal 2</text>
          <text x="192" y="238" textAnchor="middle" fill="white" fontSize="8">Metal 3 (Power)</text>
        </svg>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* 3D Model Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-slate-200">Realistic Chip 3D Model</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === '3d' ? 'default' : 'outline'}
              size="sm" 
              className={viewMode === '3d' ? 'bg-cyan-600 text-white' : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent'}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </Button>
            <Button 
              variant={viewMode === 'top' ? 'default' : 'outline'}
              size="sm" 
              className={viewMode === 'top' ? 'bg-cyan-600 text-white' : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent'}
              onClick={() => setViewMode('top')}
            >
              Top View
            </Button>
            <Button 
              variant={viewMode === 'side' ? 'default' : 'outline'}
              size="sm" 
              className={viewMode === 'side' ? 'bg-cyan-600 text-white' : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent'}
              onClick={() => setViewMode('side')}
            >
              Side View
            </Button>
            <Button 
              variant={viewMode === 'cross' ? 'default' : 'outline'}
              size="sm" 
              className={viewMode === 'cross' ? 'bg-cyan-600 text-white' : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent'}
              onClick={() => setViewMode('cross')}
            >
              Cross Section
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {viewMode.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {Math.round(zoom * 100)}% Zoom
          </Badge>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 relative">
        {viewMode === '3d' && renderChip3D()}
        {viewMode === 'top' && renderTopView()}
        {viewMode === 'side' && renderSideView()}
        {viewMode === 'cross' && renderCrossSection()}
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-slate-800 border-t border-slate-700 p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
            <Download className="h-3 w-3 mr-2" />
            Export STL
          </Button>
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
            <Eye className="h-3 w-3 mr-2" />
            Cross Section
          </Button>
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 bg-transparent">
            <Target className="h-3 w-3 mr-2" />
            Measure
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Layers: {chipLayers.length}</span>
          <span>•</span>
          <span>Transistors: {transistorStructures.length}</span>
          <span>•</span>
          <span>View: {viewMode}</span>
        </div>
      </div>
    </div>
  );
} 

// Main Workspace Component
export default function ChipForgeWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('schematic');
  const [activeSidebarTab, setActiveSidebarTab] = useState('components');
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to ChipForge! I can help you design your chip. What would you like to start with?',
      timestamp: new Date(),
      suggestions: [
        'Create a logic gate schematic',
        'Generate Verilog for ALU',
        'Design 3D chip layout'
      ]
    }
  ]);

  // Handle URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    const tool = searchParams.get('tool');
    
    if (tab) {
      setActiveTab(tab);
    }
    if (tool) {
      setActiveSidebarTab(tool);
    }
  }, [searchParams]);

  const handleSendMessage = (message: string) => {
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're working on chip design. For "${message}", I recommend starting with the logic gates in the schematic tab, then generating the corresponding Verilog code.`,
        timestamp: new Date(),
        suggestions: [
          'Add memory elements to schematic',
          'Generate testbench for ALU',
          'Optimize power consumption'
        ]
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleApplySuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      <TopNav />
      <div className="h-[calc(100vh-56px)] bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
        {/* Main Workspace Area */}
        <div className="flex-1 flex min-h-0">
          {/* Left Side - AI Copilot */}
          <AICopilot 
            messages={aiMessages}
            onSendMessage={handleSendMessage}
            onApplySuggestion={handleApplySuggestion}
          />
          
          {/* Center - Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="bg-slate-900 border-b border-slate-700 p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger 
                    value="schematic" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                  >
                    <CircuitBoard className="h-4 w-4 mr-2" />
                    Schematic Design
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hdl" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    HDL Code
                  </TabsTrigger>
                  <TabsTrigger 
                    value="model" 
                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                  >
                    <Box className="h-4 w-4 mr-2" />
                    3D Model
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
              {activeTab === 'schematic' && <SchematicDesignTab />}
              {activeTab === 'hdl' && <HDLDesignTab />}
              {activeTab === 'model' && <ModelDesignTab />}
            </div>
          </div>

          {/* Right Side - Component Library */}
          <ComponentLibrary />
        </div>
      </div>
    </>
  );
}