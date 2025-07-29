import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TopNav from "../components/chipforge/TopNav";
import RegressionTestRunner from "../components/chipforge/RegressionTestRunner";

export default function TestNativeSimulator() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TopNav />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Native Verilog Simulator Test</h1>
          <p className="text-slate-400 mb-4">
            Comprehensive regression testing framework for Phase 1 implementation
          </p>
        </div>

        {/* Comprehensive Regression Test Runner */}
        <RegressionTestRunner />
      </div>
    </div>
  );
} 