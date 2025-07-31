import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HDLGenerator } from '@/backend/hdl-gen';
import { threeDVisualizationEngine } from '@/backend/visualization/threeDVisualizationEngine';

const kits = {
  fsm: {
    label: "FSM (Control Logic)",
    blocks: ["dff", "mux", "decoder"],
    description: "A Finite State Machine (FSM) is used for control logic, such as traffic lights, protocol engines, or sequencers.",
    ioExample: {
      inputs: [
        { name: "clk", desc: "Clock signal (for synchronous FSMs)" },
        { name: "rst", desc: "Reset signal" },
        { name: "in0", desc: "External input 0" },
        { name: "in1", desc: "External input 1" }
      ],
      outputs: [
        { name: "out0", desc: "Output signal 0" },
        { name: "out1", desc: "Output signal 1" }
      ]
    }
  },
  alu: {
    label: "4-bit ALU",
    blocks: ["alu_4bit", "mux", "reg"],
    description: "An Arithmetic Logic Unit (ALU) performs arithmetic and logic operations. Used in CPUs, DSPs, and controllers.",
    ioExample: {
      inputs: [
        { name: "a[3:0]", desc: "Operand A" },
        { name: "b[3:0]", desc: "Operand B" },
        { name: "op[2:0]", desc: "Operation select" }
      ],
      outputs: [
        { name: "result[3:0]", desc: "Result" },
        { name: "carry", desc: "Carry out" }
      ]
    }
  },
  uart: {
    label: "UART Transmitter",
    blocks: ["shiftreg", "fsm", "timer"],
    description: "A UART (Universal Asynchronous Receiver/Transmitter) is used for serial communication between chips or systems.",
    ioExample: {
      inputs: [
        { name: "clk", desc: "Clock" },
        { name: "rst", desc: "Reset" },
        { name: "tx_data[7:0]", desc: "Data to transmit" },
        { name: "tx_start", desc: "Start transmission" }
      ],
      outputs: [
        { name: "tx", desc: "Serial output" },
        { name: "tx_busy", desc: "Transmitter busy flag" }
      ]
    }
  },
  counter: {
    label: "Up/Down Counter",
    blocks: ["counter", "dff"],
    description: "A counter is used for counting events, clock cycles, or generating addresses. Can be up, down, or up/down.",
    ioExample: {
      inputs: [
        { name: "clk", desc: "Clock" },
        { name: "rst", desc: "Reset" },
        { name: "en", desc: "Enable counting" },
        { name: "up_down", desc: "Count direction" }
      ],
      outputs: [
        { name: "count[3:0]", desc: "Current count value" }
      ]
    }
  }
};

export default function SchematicWizard() {
  const [step, setStep] = useState(1);
  const [promptInput, setPromptInput] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [designName, setDesignName] = useState("My First Design");
  const [selectedKit, setSelectedKit] = useState("fsm");
  const [customInputs, setCustomInputs] = useState(kits.fsm.ioExample.inputs.map(i => i.name));
  const [customOutputs, setCustomOutputs] = useState(kits.fsm.ioExample.outputs.map(o => o.name));
  const [bitWidth, setBitWidth] = useState(4);
  const [clocked, setClocked] = useState(true);
  const updateDesign = useHDLDesignStore((state) => state.setDesign);
  const navigate = useNavigate();

  useEffect(() => {
    setCustomInputs(kits[selectedKit].ioExample.inputs.map(i => i.name));
    setCustomOutputs(kits[selectedKit].ioExample.outputs.map(o => o.name));
  }, [selectedKit]);

  const generateSchematic = async () => {
    const baseBlocks = kits[selectedKit]?.blocks || [];
    const description = `${designName}: ${kits[selectedKit].description}\nBlocks: ${baseBlocks.join(", ")}` + (useAI && promptInput ? `\nPrompt: ${promptInput}` : "");
    const io = [
      ...customInputs.map(name => ({ name, direction: 'input' as const, width: bitWidth })),
      ...customOutputs.map(name => ({ name, direction: 'output' as const, width: bitWidth }))
    ];
    const components = baseBlocks.map((block, idx) => ({
      id: `${block}-${idx}`,
      type: block,
      label: kits[selectedKit].label + ' Block',
      x: 100 + idx * 120,
      y: 200,
      inputs: [],
      outputs: [],
    }));
    const wires = components.slice(1).map((comp, idx) => ({
      from: { nodeId: components[idx].id, port: 'out' },
      to: { nodeId: comp.id, port: 'in' },
    }));
    // Generate HDL code
    const hdlGen = new HDLGenerator();
    const hdlResult = await hdlGen.generateHDL({
      description,
      targetLanguage: 'verilog',
      style: 'rtl',
      moduleName: designName.replace(/\s+/g, '_').toLowerCase(),
      io
    });
    // Trigger 3D model build (stub: pass components as layoutData)
    await threeDVisualizationEngine.initializeVisualization({
      layoutData: { components, wires },
      viewport: { width: 800, height: 600 },
      camera: { position: { x: 0, y: 0, z: 100 }, target: { x: 0, y: 0, z: 0 }, fov: 45 },
      rendering: { quality: 'medium', shadows: false, antiAliasing: true, wireframe: false }
    });
    updateDesign({
      moduleName: designName.replace(/\s+/g, '_').toLowerCase(),
      description,
      io,
      components,
      wires,
      verilog: hdlResult.code
    });
    navigate("/workspace");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Schematic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {step === 1 && (
            <>
              <p className="text-sm text-slate-400">How would you like to begin?</p>
              <div className="flex flex-col gap-2">
                <Button variant={useAI ? "outline" : "default"} onClick={() => { setUseAI(false); setStep(2); }}>
                  Guided Subsystem Wizard
                </Button>
                <Button variant={useAI ? "default" : "outline"} onClick={() => { setUseAI(true); setStep(2); }}>
                  Natural Language Prompt (AI)
                </Button>
              </div>
            </>
          )}

          {step === 2 && !useAI && (
            <>
              <label className="text-sm font-medium">Design Name</label>
              <Input value={designName} onChange={(e) => setDesignName(e.target.value)} />

              <label className="text-sm font-medium">Select a Starter Kit</label>
              <TooltipProvider>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(kits).map((kitKey) => (
                    <Tooltip key={kitKey}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedKit === kitKey ? "default" : "outline"}
                          onClick={() => setSelectedKit(kitKey)}
                          className="w-full"
                        >
                          {kits[kitKey].label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <div className="mb-1 font-semibold">What is this?</div>
                        <div className="mb-2">{kits[kitKey].description}</div>
                        <div className="mb-1 font-semibold">Typical IO:</div>
                        <ul className="list-disc ml-4 mb-1">
                          {kits[kitKey].ioExample.inputs.map(i => (
                            <li key={i.name}><b>{i.name}</b>: {i.desc}</li>
                          ))}
                          {kits[kitKey].ioExample.outputs.map(o => (
                            <li key={o.name}><b>{o.name}</b>: {o.desc}</li>
                          ))}
                        </ul>
                        <div className="font-semibold">Blocks:</div> {kits[kitKey].blocks.join(", ")}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>

              <label className="text-sm font-medium">Inputs</label>
              <Textarea
                value={customInputs.join("\n")}
                onChange={e => setCustomInputs(e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                rows={kits[selectedKit].ioExample.inputs.length}
                className="font-mono"
                placeholder="One input per line (e.g., clk, rst, in0, ...)"
              />

              <label className="text-sm font-medium">Outputs</label>
              <Textarea
                value={customOutputs.join("\n")}
                onChange={e => setCustomOutputs(e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                rows={kits[selectedKit].ioExample.outputs.length}
                className="font-mono"
                placeholder="One output per line (e.g., out0, result, ...)"
              />

              <label className="text-sm font-medium">Word Size (bit width)</label>
              <Input type="number" value={bitWidth} onChange={(e) => setBitWidth(Number(e.target.value))} />

              <label className="text-sm font-medium">Clocked Design?</label>
              <Button onClick={() => setClocked(!clocked)} variant="outline">
                {clocked ? "Yes (synchronous)" : "No (combinational)"}
              </Button>

              <Button className="mt-4" onClick={generateSchematic}>Generate Schematic</Button>
            </>
          )}

          {step === 2 && useAI && (
            <>
              <label className="text-sm font-medium">Describe your design</label>
              <Textarea placeholder="Build a 4-bit pulse-width modulated motor controller with safety latch" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} />
              <Button className="mt-4" onClick={generateSchematic}>Generate with AI</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 