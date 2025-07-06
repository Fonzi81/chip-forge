import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cpu,
  Zap,
  Code,
  CheckCircle,
  Lightbulb,
  BookOpen
} from "lucide-react";

const ResourcesTab = () => {
  return (
    <div className="space-y-6">
      {/* Quick Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Cpu className="h-5 w-5 text-blue-400" />
              RTL Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Always block:</span>
                <code className="text-cyan-400">always @(*)</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clock edge:</span>
                <code className="text-cyan-400">posedge clk</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reset:</span>
                <code className="text-cyan-400">negedge rst_n</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blocking:</span>
                <code className="text-cyan-400">=</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Non-blocking:</span>
                <code className="text-cyan-400">{"<="}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Zap className="h-5 w-5 text-amber-400" />
              Common Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-slate-400">• Counter design patterns</div>
              <div className="text-slate-400">• FSM templates (Moore/Mealy)</div>
              <div className="text-slate-400">• FIFO implementations</div>
              <div className="text-slate-400">• Clock domain crossing</div>
              <div className="text-slate-400">• Pipeline design</div>
              <div className="text-slate-400">• Memory interfaces</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Code className="h-5 w-5 text-emerald-400" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span className="text-slate-400">Use meaningful names</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span className="text-slate-400">Avoid latches</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span className="text-slate-400">Synchronous reset</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Documentation Sections */}
      <div className="space-y-6">
        {/* HDL Syntax Guide */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Code className="h-5 w-5 text-emerald-400" />
              Complete HDL Syntax Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-300">Module Declaration</h4>
                <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                  <div className="text-purple-400">module</div>
                  <div className="text-cyan-400 ml-2">counter</div>
                  <div className="text-slate-300 ml-1">#(parameter WIDTH = 8)</div>
                  <div className="text-slate-300 ml-1">(</div>
                  <div className="text-blue-400 ml-4">input</div>
                  <div className="text-slate-300 ml-1">clk, rst_n,</div>
                  <div className="text-red-400 ml-4">output reg</div>
                  <div className="text-slate-300 ml-1">[WIDTH-1:0] count</div>
                  <div className="text-slate-300">);</div>
                </div>
                
                <h4 className="font-medium text-slate-300">Always Blocks</h4>
                <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                  <div className="text-purple-400">always @(posedge clk or negedge rst_n)</div>
                  <div className="text-purple-400 ml-2">begin</div>
                  <div className="text-purple-400 ml-4">if (!rst_n)</div>
                  <div className="text-cyan-400 ml-6">count {"<="} 0;</div>
                  <div className="text-purple-400 ml-4">else</div>
                  <div className="text-cyan-400 ml-6">count {"<="} count + 1;</div>
                  <div className="text-purple-400 ml-2">end</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-slate-300">State Machines</h4>
                <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                  <div className="text-purple-400">{"typedef enum logic [1:0] {"}</div>
                  <div className="text-cyan-400 ml-4">IDLE = 2'b00,</div>
                  <div className="text-cyan-400 ml-4">START = 2'b01,</div>
                  <div className="text-cyan-400 ml-4">ACTIVE = 2'b10,</div>
                  <div className="text-cyan-400 ml-4">DONE = 2'b11</div>
                  <div className="text-purple-400">{"} state_t;"}</div>
                </div>
                
                <h4 className="font-medium text-slate-300">Interface Declaration</h4>
                <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                  <div className="text-purple-400">interface</div>
                  <div className="text-cyan-400 ml-1">bus_if</div>
                  <div className="text-slate-300 ml-1">#(parameter WIDTH = 32);</div>
                  <div className="text-blue-400 ml-2">logic</div>
                  <div className="text-slate-300 ml-1">[WIDTH-1:0] data;</div>
                  <div className="text-blue-400 ml-2">logic</div>
                  <div className="text-slate-300 ml-1">valid, ready;</div>
                  <div className="text-purple-400">endinterface</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Patterns */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Common Design Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-slate-300 mb-3">Clock Domain Crossing</h4>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-slate-400 text-sm mb-3">Use synchronizer for single-bit signals:</p>
                  <div className="font-mono text-sm">
                    <div className="text-blue-400">reg</div>
                    <div className="text-slate-300 ml-1">[1:0] sync_ff;</div>
                    <div className="text-purple-400">always @(posedge clk_dest)</div>
                    <div className="text-cyan-400 ml-2">sync_ff {"<="} {"{sync_ff[0], signal_src}"};</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-300 mb-3">FIFO Implementation</h4>
                <div className="bg-slate-800/50 p-4 rounded">
                  <p className="text-slate-400 text-sm mb-3">Asynchronous FIFO with Gray code pointers:</p>
                  <div className="font-mono text-sm">
                    <div className="text-blue-400">wire</div>
                    <div className="text-slate-300 ml-1">[ADDR_WIDTH:0] wptr_gray, rptr_gray;</div>
                    <div className="text-cyan-400">assign wptr_gray = (wptr {">> 1"}) ^ wptr;</div>
                    <div className="text-cyan-400">assign rptr_gray = (rptr {">> 1"}) ^ rptr;</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debugging Guide */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <Zap className="h-5 w-5 text-red-400" />
              Debugging & Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-300">Common Mistakes</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <div className="text-slate-300 font-medium">Latch Inference</div>
                      <div className="text-slate-400">Always include else clause in combinational logic</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <div className="text-slate-300 font-medium">Race Conditions</div>
                      <div className="text-slate-400">Use non-blocking assignments in sequential logic</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <div className="text-slate-300 font-medium">Metastability</div>
                      <div className="text-slate-400">Synchronize asynchronous inputs properly</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-slate-300">Testbench Best Practices</h4>
                <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                  <div className="text-purple-400">initial begin</div>
                  <div className="text-cyan-400 ml-2">$dumpfile("waveform.vcd");</div>
                  <div className="text-cyan-400 ml-2">$dumpvars(0, testbench);</div>
                  <div className="text-slate-300 ml-2">// Test cases here</div>
                  <div className="text-cyan-400 ml-2">$finish;</div>
                  <div className="text-purple-400">end</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Resources */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200">
              <BookOpen className="h-5 w-5 text-purple-400" />
              External Documentation & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-300">Language References</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-blue-400 hover:text-blue-300">SystemVerilog LRM IEEE 1800</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Verilog IEEE 1364</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">VHDL IEEE 1076</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">UVM Methodology</a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-300">FPGA Vendors</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Xilinx Vivado Guide</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Intel Quartus Manual</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Lattice Design Tools</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Microsemi Libero</a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-300">Online Tools</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-blue-400 hover:text-blue-300">EDA Playground</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Timing Calculator</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Logic Minimizer</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">FSM Generator</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesTab;