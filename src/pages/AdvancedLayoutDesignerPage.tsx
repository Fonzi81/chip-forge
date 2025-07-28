import React from 'react';
import AdvancedLayoutDesigner from '../components/chipforge/AdvancedLayoutDesigner';
import TopNav from '../components/chipforge/TopNav';

export default function AdvancedLayoutDesignerPage() {
  return (
    <div className="h-screen bg-slate-50">
      <TopNav />
      <AdvancedLayoutDesigner />
    </div>
  );
} 