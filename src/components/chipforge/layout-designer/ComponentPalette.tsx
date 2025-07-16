import React from 'react';
import { useLayoutEditorStore } from '../../../state/useLayoutEditorStore';

const types = ['AND2_X1', 'INV_X1', 'OR2_X1', 'DFF'];

export default function ComponentPalette() {
  const { selectedCellType, setSelectedCellType } = useLayoutEditorStore();

  return (
    <div className="flex gap-2 bg-slate-800 p-2 rounded mt-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => setSelectedCellType(type)}
          className={`px-3 py-1 rounded text-sm ${
            selectedCellType === type
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
} 