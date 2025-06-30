
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Clock,
  Settings,
  RotateCcw,
  Save,
  Code,
  Eye,
  Plus,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConstraintEditor = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"visual" | "text">("visual");
  const [clockDomains, setClockDomains] = useState([
    { id: 1, name: "clk_main", frequency: "100", period: "10.0", source: "External" },
    { id: 2, name: "clk_mem", frequency: "200", period: "5.0", source: "PLL" }
  ]);
  const [ioConstraints, setIoConstraints] = useState([
    { id: 1, signal: "data_in[7:0]", inputDelay: "2.0", outputDelay: "", type: "input" },
    { id: 2, signal: "data_out[7:0]", inputDelay: "", outputDelay: "1.5", type: "output" },
    { id: 3, signal: "enable", inputDelay: "1.0", outputDelay: "", type: "input" }
  ]);
  const [resetSignals, setResetSignals] = useState([
    { id: 1, name: "rst_n", polarity: "active_low", synchronous: true, recovery: "5.0" },
    { id: 2, name: "por_rst", polarity: "active_high", synchronous: false, recovery: "10.0" }
  ]);

  const yamlConstraints = `# Clock Constraints
clocks:
  - name: clk_main
    frequency: 100MHz
    period: 10.0ns
    source: external
  - name: clk_mem
    frequency: 200MHz
    period: 5.0ns
    source: pll

# I/O Timing Constraints
input_delays:
  - signal: data_in[7:0]
    delay: 2.0ns
    clock: clk_main
  - signal: enable
    delay: 1.0ns
    clock: clk_main

output_delays:
  - signal: data_out[7:0]
    delay: 1.5ns
    clock: clk_main

# Reset Constraints
resets:
  - name: rst_n
    polarity: active_low
    synchronous: true
    recovery_time: 5.0ns
  - name: por_rst
    polarity: active_high
    synchronous: false
    recovery_time: 10.0ns`;

  const addClockDomain = () => {
    const newId = Math.max(...clockDomains.map(c => c.id)) + 1;
    setClockDomains([...clockDomains, {
      id: newId,
      name: `clk_${newId}`,
      frequency: "100",
      period: "10.0",
      source: "External"
    }]);
  };

  const removeClockDomain = (id: number) => {
    setClockDomains(clockDomains.filter(c => c.id !== id));
  };

  const addIoConstraint = () => {
    const newId = Math.max(...ioConstraints.map(c => c.id)) + 1;
    setIoConstraints([...ioConstraints, {
      id: newId,
      signal: `signal_${newId}`,
      inputDelay: "",
      outputDelay: "",
      type: "input"
    }]);
  };

  const removeIoConstraint = (id: number) => {
    setIoConstraints(ioConstraints.filter(c => c.id !== id));
  };

  const addResetSignal = () => {
    const newId = Math.max(...resetSignals.map(r => r.id)) + 1;
    setResetSignals([...resetSignals, {
      id: newId,
      name: `rst_${newId}`,
      polarity: "active_low",
      synchronous: true,
      recovery: "5.0"
    }]);
  };

  const removeResetSignal = (id: number) => {
    setResetSignals(resetSignals.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <span className="text-xl font-semibold">Constraint Editor</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border border-slate-600 rounded">
              <Button
                variant={viewMode === "visual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("visual")}
                className="rounded-r-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visual
              </Button>
              <Button
                variant={viewMode === "text" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("text")}
                className="rounded-l-none"
              >
                <Code className="h-4 w-4 mr-2" />
                YAML
              </Button>
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {viewMode === "visual" ? (
          <Tabs defaultValue="clocks" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-6">
              <TabsTrigger value="clocks" className="data-[state=active]:bg-slate-700">Clock Domains</TabsTrigger>
              <TabsTrigger value="io" className="data-[state=active]:bg-slate-700">I/O Timing</TabsTrigger>
              <TabsTrigger value="resets" className="data-[state=active]:bg-slate-700">Reset Signals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clocks">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    Clock Domain Constraints
                  </h2>
                  <Button onClick={addClockDomain} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Clock
                  </Button>
                </div>

                {clockDomains.map((clock) => (
                  <Card key={clock.id} className="p-4 bg-slate-900/30 border-slate-700">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Clock Name</label>
                        <input
                          type="text"
                          value={clock.name}
                          onChange={(e) => {
                            const updated = clockDomains.map(c => 
                              c.id === clock.id ? { ...c, name: e.target.value } : c
                            );
                            setClockDomains(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Frequency (MHz)</label>
                        <input
                          type="number"
                          value={clock.frequency}
                          onChange={(e) => {
                            const updated = clockDomains.map(c => 
                              c.id === clock.id ? { ...c, frequency: e.target.value } : c
                            );
                            setClockDomains(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Period (ns)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={clock.period}
                          onChange={(e) => {
                            const updated = clockDomains.map(c => 
                              c.id === clock.id ? { ...c, period: e.target.value } : c
                            );
                            setClockDomains(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Source</label>
                        <select
                          value={clock.source}
                          onChange={(e) => {
                            const updated = clockDomains.map(c => 
                              c.id === clock.id ? { ...c, source: e.target.value } : c
                            );
                            setClockDomains(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        >
                          <option value="External">External</option>
                          <option value="PLL">PLL</option>
                          <option value="Generated">Generated</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removeClockDomain(clock.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="io">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    I/O Timing Constraints
                  </h2>
                  <Button onClick={addIoConstraint} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add I/O
                  </Button>
                </div>

                {ioConstraints.map((io) => (
                  <Card key={io.id} className="p-4 bg-slate-900/30 border-slate-700">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Signal Name</label>
                        <input
                          type="text"
                          value={io.signal}
                          onChange={(e) => {
                            const updated = ioConstraints.map(c => 
                              c.id === io.id ? { ...c, signal: e.target.value } : c
                            );
                            setIoConstraints(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Input Delay (ns)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={io.inputDelay}
                          onChange={(e) => {
                            const updated = ioConstraints.map(c => 
                              c.id === io.id ? { ...c, inputDelay: e.target.value } : c
                            );
                            setIoConstraints(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Output Delay (ns)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={io.outputDelay}
                          onChange={(e) => {
                            const updated = ioConstraints.map(c => 
                              c.id === io.id ? { ...c, outputDelay: e.target.value } : c
                            );
                            setIoConstraints(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Type</label>
                        <select
                          value={io.type}
                          onChange={(e) => {
                            const updated = ioConstraints.map(c => 
                              c.id === io.id ? { ...c, type: e.target.value } : c
                            );
                            setIoConstraints(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        >
                          <option value="input">Input</option>
                          <option value="output">Output</option>
                          <option value="inout">Bidirectional</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removeIoConstraint(io.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="resets">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-emerald-400" />
                    Reset Signal Constraints
                  </h2>
                  <Button onClick={addResetSignal} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reset
                  </Button>
                </div>

                {resetSignals.map((reset) => (
                  <Card key={reset.id} className="p-4 bg-slate-900/30 border-slate-700">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Reset Name</label>
                        <input
                          type="text"
                          value={reset.name}
                          onChange={(e) => {
                            const updated = resetSignals.map(r => 
                              r.id === reset.id ? { ...r, name: e.target.value } : r
                            );
                            setResetSignals(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Polarity</label>
                        <select
                          value={reset.polarity}
                          onChange={(e) => {
                            const updated = resetSignals.map(r => 
                              r.id === reset.id ? { ...r, polarity: e.target.value } : r
                            );
                            setResetSignals(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        >
                          <option value="active_low">Active Low</option>
                          <option value="active_high">Active High</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Type</label>
                        <select
                          value={reset.synchronous ? "synchronous" : "asynchronous"}
                          onChange={(e) => {
                            const updated = resetSignals.map(r => 
                              r.id === reset.id ? { ...r, synchronous: e.target.value === "synchronous" } : r
                            );
                            setResetSignals(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        >
                          <option value="synchronous">Synchronous</option>
                          <option value="asynchronous">Asynchronous</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">Recovery (ns)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={reset.recovery}
                          onChange={(e) => {
                            const updated = resetSignals.map(r => 
                              r.id === reset.id ? { ...r, recovery: e.target.value } : r
                            );
                            setResetSignals(updated);
                          }}
                          className="w-full bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded text-sm"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removeResetSignal(reset.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">YAML/Text Mode</h2>
              <div className="text-sm text-slate-400">
                Edit constraints directly in YAML format
              </div>
            </div>
            <Card className="p-4 bg-slate-900/30 border-slate-700">
              <textarea
                value={yamlConstraints}
                className="w-full h-96 bg-slate-800 border border-slate-600 text-slate-200 p-4 rounded font-mono text-sm resize-none"
                spellCheck={false}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstraintEditor;
