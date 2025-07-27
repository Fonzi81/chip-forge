import React from 'react';
import HDLGenerator from '../components/chipforge/HDLGenerator';
import TopNav from '../components/chipforge/TopNav';

const HDLGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            <span className="text-cyan-400">HDL</span> Generator
          </h1>
          <p className="text-slate-400">
            Advanced Verilog editor with AI-powered code generation and real-time syntax checking
          </p>
        </div>
        <HDLGenerator />
      </div>
    </div>
  );
};

export default HDLGeneratorPage; 