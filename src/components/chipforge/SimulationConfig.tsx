import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Play, Square, RotateCcw, Settings, Clock, Zap } from "lucide-react";

interface SimulationConfigProps {
  onRunSimulation: (config: any) => void;
  onCancelSimulation?: () => void;
  isRunning: boolean;
  initialHdlCode?: string;
}

const SimulationConfig = ({ onRunSimulation, onCancelSimulation, isRunning, initialHdlCode }: SimulationConfigProps) => {
  const [config, setConfig] = useState({
    clockFreq: "100",
    simulationTime: "1000",
    inputVectors: `// Input test vectors
a = 4'b0000; b = 4'b0001;
a = 4'b0010; b = 4'b0011;
a = 4'b0100; b = 4'b0101;
a = 4'b1111; b = 4'b0001;`,
    hdlCode: initialHdlCode || `module alu_4bit (
  input [3:0] a,
  input [3:0] b,
  input [2:0] op,
  output reg [3:0] result,
  output reg carry_out
);

always @(*) begin
  case (op)
    3'b000: {carry_out, result} = a + b;
    3'b001: {carry_out, result} = a - b;
    3'b010: begin result = a & b; carry_out = 0; end
    3'b011: begin result = a | b; carry_out = 0; end
    default: begin result = 4'b0000; carry_out = 0; end
  endcase
end

endmodule`
  });

  const handleSubmit = () => {
    onRunSimulation(config);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-chipforge-accent" />
          <h2 className="text-lg font-display font-semibold text-slate-200">
            Simulation Configuration
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isRunning}
            className="flex-1 bg-chipforge-accent text-slate-900 hover:bg-chipforge-accent/90 font-medium"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            disabled={!isRunning}
            onClick={onCancelSimulation}
            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
            title="Stop Simulation"
          >
            <Square className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Timing Configuration */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="h-4 w-4 text-chipforge-waveform" />
              Timing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="clock-freq" className="text-slate-300 text-xs">
                Clock Frequency (MHz)
              </Label>
              <Input
                id="clock-freq"
                value={config.clockFreq}
                onChange={(e) => setConfig({ ...config, clockFreq: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-slate-100 font-mono text-sm mt-1"
                placeholder="100"
              />
            </div>
            
            <div>
              <Label htmlFor="sim-time" className="text-slate-300 text-xs">
                Simulation Time (ns)
              </Label>
              <Input
                id="sim-time"
                value={config.simulationTime}
                onChange={(e) => setConfig({ ...config, simulationTime: e.target.value })}
                className="bg-slate-900/50 border-slate-600 text-slate-100 font-mono text-sm mt-1"
                placeholder="1000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Input Vectors */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Zap className="h-4 w-4 text-amber-400" />
              Input Test Vectors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config.inputVectors}
              onChange={(e) => setConfig({ ...config, inputVectors: e.target.value })}
              className="bg-slate-900/50 border-slate-600 text-slate-100 font-mono text-xs resize-none h-24"
              placeholder="a=4'b0000; b=4'b0001;"
            />
          </CardContent>
        </Card>

        {/* HDL Code */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300">HDL Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config.hdlCode}
              onChange={(e) => setConfig({ ...config, hdlCode: e.target.value })}
              className="bg-slate-900/50 border-slate-600 text-slate-100 font-mono text-xs resize-none h-64"
              placeholder="Enter your Verilog/VHDL code here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimulationConfig;