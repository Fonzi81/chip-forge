import React from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WaveformViewer() {
  const { waveform, simResults } = useHDLDesignStore();
  const maxCycles = 16;

  const allSignals = Array.from(
    new Set([
      ...Object.keys(waveform || {}),
      ...Object.keys(simResults || {}),
    ])
  );

  const renderSignalRow = (sig: string) => {
    const expected = waveform[sig] || {};
    const actual = simResults[sig] || [];
    // Calculate match score
    let matches = 0, total = 0;
    for (let i = 0; i < maxCycles; i++) {
      if (expected[i] !== undefined && actual[i] !== undefined) {
        total++;
        if (expected[i] === actual[i]) matches++;
      }
    }
    const score = total ? (matches / total) : 1;
    const hasMismatch = score < 1;

    return (
      <tr key={sig}>
        <td className="pr-2 font-mono text-slate-400 whitespace-nowrap">
          {sig}
          {hasMismatch && (
            <span className="ml-2 text-xs text-red-400">{(score * 100).toFixed(0)}%</span>
          )}
        </td>
        {Array.from({ length: maxCycles }).map((_, i) => {
          const e = expected[i];
          const a = actual[i];
          const match = e === undefined || a === undefined || e === a;
          return (
            <td
              key={i}
              className={`w-6 h-6 text-center rounded ${match ? "bg-slate-700" : "bg-red-600"}`}
            >
              <span className="text-xs text-white">{a ?? "-"}</span>
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Waveform Viewer</h2>
      <ScrollArea className="border border-slate-700 rounded p-2 max-h-[500px] max-w-full overflow-auto">
        <table className="text-sm text-white min-w-max">
          <thead>
            <tr>
              <th className="text-left pr-4">Signal</th>
              {Array.from({ length: maxCycles }).map((_, i) => (
                <th key={i} className="w-6 text-xs text-center">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>{allSignals.map(renderSignalRow)}</tbody>
        </table>
      </ScrollArea>
    </div>
  );
} 