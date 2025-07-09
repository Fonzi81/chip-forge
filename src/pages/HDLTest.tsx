import React from 'react';
import HDLModuleEditor from '../components/chipforge/HDLModuleEditor';
import { listHDLDesigns, deleteHDLDesign } from '../utils/localStorage';

export default function HDLTest() {
  const handleClearAll = () => {
    const designs = listHDLDesigns();
    designs.forEach(design => deleteHDLDesign(design.id));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">HDL Generator Test</h1>
          <p className="text-slate-400 mb-4">
            Test the AI-powered HDL generator with localStorage persistence
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear All Saved Designs
            </button>
            <div className="px-4 py-2 bg-slate-700 text-slate-300 rounded">
              {listHDLDesigns().length} saved designs
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-200px)]">
          <HDLModuleEditor />
        </div>
      </div>
    </div>
  );
} 