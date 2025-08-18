import React, { useState } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Mocked helpers — replace with real service interfaces
const smeltr = {
  generateHDL: async ({ design, waveform, testbench, prompt }: any) => {
    return {
      success: true,
      code: "// Verilog output\nmodule top(...);\nendmodule",
      score: 0.96,
    };
  },
};

const reflexion = {
  analyze: async ({ code, testbench }: any) => {
    return {
      code: "// Corrected Verilog\nmodule top(...);\nendmodule",
      score: 0.98,
    };
  },
};

export default function EnhancedHDLGenerator() {
  const { design, waveform, testbenchVerilog, setHDL, setHDLScore } = useHDLDesignStore();
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const generate = async () => {
    setStatus("generating");
    setLog(["🔄 Sending design + waveform to Smeltr..."]);

    try {
      const result = await smeltr.generateHDL({
        design,
        waveform,
        testbench: testbenchVerilog,
        prompt,
      });

      if (result.success) {
        setHDL(result.code);
        setHDLScore(result.score);
        setLog((prev) => [...prev, "✅ HDL Generated successfully. Score: " + result.score]);
        setStatus("done");
      } else {
        setLog((prev) => [...prev, "⚠️ Initial HDL failed. Launching Reflexion..."]);
        const corrected = await reflexion.analyze({ code: result.code, testbench: testbenchVerilog });
        setHDL(corrected.code);
        setHDLScore(corrected.score);
        setLog((prev) => [...prev, "✅ Reflexion fixed code. New Score: " + corrected.score]);
        setStatus("done");
      }
    } catch (e: any) {
      setLog((prev) => [...prev, "❌ HDL generation failed: " + e.message]);
      setStatus("error");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">HDL Generator (Smeltr + Reflexion)</h2>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Optional design prompt or goal (e.g., prioritize low latency)"
      />
      <Button onClick={generate} disabled={status === "generating"}>
        {status === "generating" ? "Generating..." : "Generate HDL"}
      </Button>

      <div className="bg-slate-900 p-3 rounded text-xs text-green-300 whitespace-pre-wrap">
        {log.join("\n")}
      </div>
    </div>
  );
} 