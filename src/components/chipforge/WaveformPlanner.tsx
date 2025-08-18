import { useState, useEffect } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_CYCLES = 16;

export default function WaveformPlanner() {
  const { design, waveform, setWaveformSignal, generateTestbench, testbenchVerilog } = useHDLDesignStore();
  const [cycles] = useState(MAX_CYCLES);
  const [showModal, setShowModal] = useState(false);

  const allSignals = [
    ...(design?.components.flatMap(c => c.inputs.map(i => `${c.id}.${i}`)) || []),
    ...(design?.components.flatMap(c => c.outputs.map(o => `${c.id}.${o}`)) || []),
  ];

  const toggle = (signal: string, cycle: number) => {
    const current = waveform[signal]?.[cycle] || 0;
    const updated = { ...waveform[signal], [cycle]: (current === 1 ? 0 : 1) as 0 | 1 } as Record<number, 0 | 1>;
    setWaveformSignal(signal, updated);
  };

  const handleGenerate = () => {
    generateTestbench();
    setShowModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testbenchVerilog);
  };

  const handleDownload = () => {
    const blob = new Blob([testbenchVerilog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testbench.v';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (showModal) {
      // Always show the latest testbenchVerilog
    }
  }, [testbenchVerilog, showModal]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Waveform Planner</h2>
      <ScrollArea className="border border-slate-700 rounded p-2 h-[400px]">
        <table className="w-full text-xs text-slate-300">
          <thead>
            <tr>
              <th className="text-left pr-4">Signal</th>
              {Array.from({ length: cycles }).map((_, i) => (
                <th key={i} className="px-1">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSignals.map((sig) => (
              <tr key={sig}>
                <td className="pr-4">{sig}</td>
                {Array.from({ length: cycles }).map((_, i) => (
                  <td key={i} className="text-center">
                    <button
                      className={`w-5 h-5 rounded ${waveform[sig]?.[i] ? "bg-emerald-400" : "bg-slate-600"}`}
                      onClick={() => toggle(sig, i)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>

      <Button className="mt-4" onClick={handleGenerate}>
        Generate Verilog Testbench
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-2">Generated Verilog Testbench</h3>
            <pre className="bg-slate-100 p-2 rounded text-xs max-h-96 overflow-auto mb-4">{testbenchVerilog}</pre>
            <div className="flex gap-2">
              <Button onClick={handleCopy}>Copy to Clipboard</Button>
              <Button onClick={handleDownload}>Download .v</Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 