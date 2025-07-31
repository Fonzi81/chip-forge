// File: src/components/chipforge/SchematicWizard.tsx
//
// Purpose:
// This component is the entry point for creating a new chip design in ChipForge.
// It provides a multi-step wizard that helps users scaffold a new schematic based on:
//
// - A selected design type (FSM, ALU, UART, etc.)
// - Number of inputs/outputs
// - Word size / bit width
// - Optional AI prompt or template starter
//
// This wizard will output an initial `design.json` that can be loaded into `SchematicCanvas.tsx`.
// The component will update `hdlDesignStore.ts` with the generated schematic state.

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useHDLDesignStore } from "@/state/hdlDesignStore";

export default function SchematicWizard() {
  const [step, setStep] = useState(1);
  const [designType, setDesignType] = useState("fsm");
  const [inputs, setInputs] = useState(2);
  const [outputs, setOutputs] = useState(1);
  const [bitWidth, setBitWidth] = useState(4);
  const [naturalPrompt, setNaturalPrompt] = useState("");
  const updateDesign = useHDLDesignStore((state) => state.setDesign);

  const generateDesign = () => {
    const io = [
      ...Array.from({ length: inputs }, (_, i) => ({
        name: `in${i}`,
        direction: 'input' as const,
        width: bitWidth
      })),
      ...Array.from({ length: outputs }, (_, i) => ({
        name: `out${i}`,
        direction: 'output' as const,
        width: bitWidth
      }))
    ];
    updateDesign({
      moduleName: `main_${designType}`,
      description: naturalPrompt || `A ${bitWidth}-bit ${designType.toUpperCase()} with ${inputs} inputs and ${outputs} outputs`,
      io,
      verilog: '',
      components: [],
      wires: []
    });
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Schematic Design Wizard</CardTitle>
          <CardDescription>Step {step} of 3: Define your base design</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <Tabs defaultValue="fsm" onValueChange={(v) => setDesignType(v)}>
              <TabsList>
                <TabsTrigger value="fsm">FSM</TabsTrigger>
                <TabsTrigger value="alu">ALU</TabsTrigger>
                <TabsTrigger value="uart">UART</TabsTrigger>
                <TabsTrigger value="counter">Counter</TabsTrigger>
              </TabsList>
              <TabsContent value="fsm">Finite state machine: control logic, traffic lights, etc.</TabsContent>
              <TabsContent value="alu">ALU: 4-bit arithmetic logic unit</TabsContent>
              <TabsContent value="uart">UART: serial comm logic</TabsContent>
              <TabsContent value="counter">Counter: up/down counter with enable</TabsContent>
              <Button className="mt-4" onClick={() => setStep(2)}>Next</Button>
            </Tabs>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Number of Inputs</label>
                <Input
                  type="number"
                  min={1}
                  value={inputs}
                  onChange={(e) => setInputs(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Number of Outputs</label>
                <Input
                  type="number"
                  min={1}
                  value={outputs}
                  onChange={(e) => setOutputs(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Word Size (bit width)</label>
                <Input
                  type="number"
                  min={1}
                  value={bitWidth}
                  onChange={(e) => setBitWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Optional AI Prompt</label>
                <Input
                  placeholder="e.g., Build a 4-bit ripple counter with reset"
                  value={naturalPrompt}
                  onChange={(e) => setNaturalPrompt(e.target.value)}
                />
              </div>
              <Button className="mt-4" onClick={generateDesign}>Generate Schematic</Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <p>Your base design has been created and saved to state.</p>
              <Button onClick={() => window.location.href = "/workspace"}>Launch Design Canvas</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 