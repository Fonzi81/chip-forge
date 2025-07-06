import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play, RotateCcw, FileCode } from "lucide-react";

interface ReflexionInputProps {
  onStartReflexion: (description: string, testbench: string) => void;
  isRunning: boolean;
  onReset: () => void;
}

const testbenchTemplates = {
  'shift_register': `module shift_register_tb;
    reg clk, reset, enable, serial_in;
    wire [2:0] parallel_out;
    wire serial_out;
    
    shift_register uut (
        .clk(clk),
        .reset(reset),
        .enable(enable),
        .serial_in(serial_in),
        .parallel_out(parallel_out),
        .serial_out(serial_out)
    );
    
    initial begin
        clk = 0;
        forever #5 clk = ~clk;
    end
    
    initial begin
        reset = 1; enable = 0; serial_in = 0;
        #10 reset = 0; enable = 1;
        #10 serial_in = 1;
        #10 serial_in = 0;
        #10 serial_in = 1;
        #10 serial_in = 1;
        #50 $finish;
    end
endmodule`,
  
  'counter': `module counter_tb;
    reg clk, reset, enable;
    wire [3:0] count;
    wire overflow;
    
    counter uut (
        .clk(clk),
        .reset(reset),
        .enable(enable),
        .count(count),
        .overflow(overflow)
    );
    
    initial begin
        clk = 0;
        forever #5 clk = ~clk;
    end
    
    initial begin
        reset = 1; enable = 0;
        #10 reset = 0; enable = 1;
        #200 enable = 0;
        #20 $finish;
    end
endmodule`,
  
  'alu': `module alu_tb;
    reg [3:0] a, b;
    reg [2:0] op;
    wire [3:0] result;
    wire carry_out, zero_flag;
    
    alu uut (
        .a(a), .b(b), .op(op),
        .result(result),
        .carry_out(carry_out),
        .zero_flag(zero_flag)
    );
    
    initial begin
        a = 4'b0011; b = 4'b0001;
        op = 3'b000; #10; // ADD
        op = 3'b001; #10; // SUB
        op = 3'b010; #10; // AND
        op = 3'b011; #10; // OR
        $finish;
    end
endmodule`
};

const ReflexionInput = ({ onStartReflexion, isRunning, onReset }: ReflexionInputProps) => {
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customTestbench, setCustomTestbench] = useState("");
  const [testbenchMode, setTestbenchMode] = useState<'template' | 'custom'>('template');

  const handleStart = () => {
    if (!description.trim()) return;

    const testbench = testbenchMode === 'template' && selectedTemplate
      ? testbenchTemplates[selectedTemplate as keyof typeof testbenchTemplates]
      : customTestbench;

    if (!testbench.trim()) return;

    onStartReflexion(description, testbench);
  };

  const handleReset = () => {
    setDescription("");
    setSelectedTemplate("");
    setCustomTestbench("");
    onReset();
  };

  const isReadyToStart = description.trim() && (
    (testbenchMode === 'template' && selectedTemplate) ||
    (testbenchMode === 'custom' && customTestbench.trim())
  );

  return (
    <div className="space-y-6">
      {/* Description Input */}
      <Card className="p-4 bg-card border-border">
        <div className="space-y-3">
          <Label className="text-sm font-medium">HDL Module Description</Label>
          <Textarea
            placeholder="Describe the RTL module you want to create (e.g., 'Create a 3-bit shift register with enable and reset')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] resize-none bg-background border-border"
            disabled={isRunning}
          />
        </div>
      </Card>

      {/* Testbench Configuration */}
      <Card className="p-4 bg-card border-border">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Testbench Configuration</Label>
          
          <Tabs value={testbenchMode} onValueChange={(v) => setTestbenchMode(v as 'template' | 'custom')}>
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="template" disabled={isRunning}>
                <FileCode className="h-4 w-4 mr-2" />
                Template
              </TabsTrigger>
              <TabsTrigger value="custom" disabled={isRunning}>
                <Upload className="h-4 w-4 mr-2" />
                Custom
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-3">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isRunning}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a testbench template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shift_register">Shift Register</SelectItem>
                  <SelectItem value="counter">Counter</SelectItem>
                  <SelectItem value="alu">ALU (Arithmetic Logic Unit)</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-3">
              <Textarea
                placeholder="Paste your custom Verilog testbench here..."
                value={customTestbench}
                onChange={(e) => setCustomTestbench(e.target.value)}
                className="min-h-[120px] resize-none bg-background border-border font-mono text-sm"
                disabled={isRunning}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleStart}
          disabled={!isReadyToStart || isRunning}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running...' : 'Start Reflexion'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isRunning}
          className="border-border hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Status */}
      {!isReadyToStart && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          {!description.trim() && "Please provide a module description. "}
          {description.trim() && testbenchMode === 'template' && !selectedTemplate && "Please select a testbench template. "}
          {description.trim() && testbenchMode === 'custom' && !customTestbench.trim() && "Please provide a custom testbench. "}
        </div>
      )}
    </div>
  );
};

export default ReflexionInput;