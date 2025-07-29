import React from 'react';
import AdvancedChipDesign from '../components/chipforge/AdvancedChipDesign';
import TopNav from '../components/chipforge/TopNav';

export default function AdvancedChipDesignPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Advanced Chip Design - Phase 2
          </h1>
          <p className="text-slate-600">
            Complete chip design flow from RTL to GDS with synthesis, place & route, and verification
          </p>
        </div>
        <AdvancedChipDesign />
      </div>
    </div>
  );
} 