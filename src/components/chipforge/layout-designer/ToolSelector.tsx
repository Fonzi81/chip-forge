import React from 'react';
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';

const tools = ['select', 'place', 'move', 'delete'] as const;

export default function ToolSelector() {
  const { tool, setTool } = useLayoutEditorStore();
  return (
    <div className="flex gap-2 bg-slate-800 p-2 rounded">
      {tools.map((t) => (
        <button
          key={t}
          onClick={() => setTool(t)}
          className={`px-3 py-1 rounded text-sm ${
            tool === t ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
} 