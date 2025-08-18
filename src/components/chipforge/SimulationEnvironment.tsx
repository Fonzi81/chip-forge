import React, { useState } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// MOCK: Replace with real simulation engine API
const simulator = {
  run: async ({ hdl, testbench }: { hdl: string; testbench: string }) => {
    return {
      success: true,
      results: {
        "comp1.out": [0, 0, 1, 1, 0, 1],
        "comp2.out": [1, 1, 0, 1, 0, 1],
      },
    };
  },
};

// MOCK: Reflexion fallback
const reflexion = {
  analyze: async ({ code, testbench }: any) => {
    return {
      code: "// Corrected Verilog\nmodule top(...);\nendmodule",
      score: 0.98,
    };
  },
};

export default function SimulationEnvironment() {
  const {
    hdlOutput,
    testbenchVerilog,
    waveform,
    simResults,
    setSimResults,
    simulationScore,
    setSimulationScore,
    setHDL,
    setHDLScore,
  } = useHDLDesignStore();
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [log, setLog] = useState<string[]>([]);
  const [reflexionStatus, setReflexionStatus] = useState<"idle" | "running" | "done">("idle");

  const runSim = async () => {
    setStatus("running");
    setLog(["🔬 Running simulation..."]);
    try {
      const result = await simulator.run({
        hdl: hdlOutput,
        testbench: testbenchVerilog,
      });

      setSimResults(result.results);
      setLog((prev) => [...prev, "✅ Simulation complete"]);
      setStatus("done");

      // Score: compare waveform vs result
      let matches = 0;
      let total = 0;
      for (let sig in result.results) {
        const actual = result.results[sig];
        const expected = waveform[sig];
        if (!expected) continue;
        total += actual.length;
        actual.forEach((v, i) => {
          if (expected[i] === v) matches += 1;
        });
      }
      const score = total ? matches / total : 0;
      setSimulationScore(score);
      setLog((prev) => [...prev, `✔️ Match score: ${(score * 100).toFixed(1)}%`]);
    } catch (e: any) {
      setLog((prev) => [...prev, `❌ Simulation failed: ${e.message}`]);
    }
  };

  const runReflexion = async () => {
    setReflexionStatus("running");
    setLog((prev) => [...prev, "🤖 Launching Reflexion for repair..."]);
    try {
      const result = await reflexion.analyze({ code: hdlOutput, testbench: testbenchVerilog });
      setHDL(result.code);
      setHDLScore(result.score);
      setLog((prev) => [...prev, `✅ Reflexion updated HDL. New Score: ${result.score}`]);
      setReflexionStatus("done");
    } catch (e: any) {
      setLog((prev) => [...prev, `❌ Reflexion failed: ${e.message}`]);
      setReflexionStatus("idle");
    }
  };

  // Timeline rendering helper
  const renderTimeline = (actual: number[], expected?: Record<number, 0 | 1>) => {
    const maxCycles = actual.length;
    return (
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex gap-1 text-xs text-slate-400">
          <span className="w-24">Actual</span>
          {actual.map((v, i) => (
            <span key={i} className={`w-6 text-center rounded ${expected && expected[i] === v ? "bg-emerald-700" : "bg-red-700"}`}>{v}</span>
          ))}
        </div>
        {expected && (
          <div className="flex gap-1 text-xs text-slate-400">
            <span className="w-24">Expected</span>
            {Array.from({ length: maxCycles }).map((_, i) => (
              <span key={i} className="w-6 text-center">{expected[i] ?? "-"}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Simulation Results</h2>
      <Button onClick={runSim} disabled={status === "running"}>
        {status === "running" ? "Running..." : "Run Simulation"}
      </Button>
      <div className="text-green-300 text-sm">Simulation Score: {(simulationScore * 100).toFixed(1)}%</div>
      <ScrollArea className="border border-slate-700 rounded p-3 h-[200px] text-sm font-mono text-green-300 whitespace-pre-wrap mb-4">
        {log.join("\n")}
      </ScrollArea>
      <div className="space-y-4">
        {Object.keys(simResults).length === 0 && <div className="text-slate-400">No simulation results yet.</div>}
        {Object.entries(simResults).map(([sig, actual]) => (
          <div key={sig} className="mb-2">
            <div className="font-semibold text-slate-200 mb-1">{sig}</div>
            {renderTimeline(actual, waveform[sig])}
          </div>
        ))}
      </div>
      {status === "done" && simulationScore < 1 && (
        <Button onClick={runReflexion} disabled={reflexionStatus === "running"} variant="outline">
          {reflexionStatus === "running" ? "Reflexion Running..." : "Run Reflexion Repair"}
        </Button>
      )}
    </div>
  );
} 