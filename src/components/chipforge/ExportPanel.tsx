import React, { useMemo, useState } from "react";
import { useHDLDesignStore } from "@/state/hdlDesignStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, FileJson, FileCode, Lightbulb, Info, FileText } from "lucide-react";

export default function ExportPanel() {
	const {
		design,
		exportNetlist,
		generateWaveformJSON,
		testbenchVerilog,
		hdlOutput,
		guidedMode,
		waveform,
		generateTestbench,
	} = useHDLDesignStore();

	const [openExplain, setOpenExplain] = useState(false);

	const designJSON = useMemo(() => {
		try {
			const net = exportNetlist();
			return JSON.stringify(net ?? {}, null, 2);
		} catch {
			return JSON.stringify({}, null, 2);
		}
	}, [exportNetlist]);

	const waveformJSON = useMemo(() => {
		try {
			return generateWaveformJSON();
		} catch {
			return JSON.stringify({ signals: [], cycles: 0, metadata: {} }, null, 2);
		}
	}, [generateWaveformJSON]);

	const layoutJSON = useMemo(() => {
		if (!design) return JSON.stringify({ components: [], wires: [] }, null, 2);
		const layout = {
			components: design.components.map(c => ({ id: c.id, label: c.label, x: c.x, y: c.y })),
			wires: design.wires,
		};
		return JSON.stringify(layout, null, 2);
	}, [design]);

	const verilogHDL = useMemo(() => {
		return (hdlOutput && hdlOutput.trim().length > 0) ? hdlOutput : "// No HDL has been generated yet. Use the HDL Generator to produce code.";
	}, [hdlOutput]);

	const verilogTestbench = useMemo(() => {
		// Generate testbench if it doesn't exist yet
		if (!testbenchVerilog || testbenchVerilog.trim().length === 0) {
			generateTestbench();
		}
		return (testbenchVerilog && testbenchVerilog.trim().length > 0) ? testbenchVerilog : "// No testbench yet. Use Waveform Planner → Generate Testbench.";
	}, [testbenchVerilog, generateTestbench]);

	const download = (filename: string, content: string, type: string) => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const explainItems = useMemo(() => {
		return [
			{
				name: "design.json",
				desc: "This JSON is your schematic netlist. It lists components, their IO, and how wires connect them.",
			},
			{
				name: "waveform.json",
				desc: "This JSON captures your planned signal patterns (e.g., clock, reset, inputs) used for simulation and verification.",
			},
			{
				name: "hdl.v",
				desc: "This Verilog file is the HDL that can be simulated or synthesized to hardware.",
			},
			{
				name: "testbench.v",
				desc: "This testbench drives your HDL with stimuli and checks expected behavior during simulation.",
			},
			{
				name: "layout.json",
				desc: "This JSON records the visual placement (x,y) of components and the logical wires connecting them.",
			},
		];
	}, []);

	const guidedTip = (text: string) => (
		<div className="text-xs text-blue-200 flex items-center gap-2">
			<Lightbulb className="h-3 w-3" />
			<span>{text}</span>
		</div>
	);

	return (
		<div className="p-4 bg-slate-900 text-white">
			<Card className="border border-slate-700">
				<CardHeader className="pb-2">
					<CardTitle className="text-sm flex items-center gap-2">
						<FileText className="h-4 w-4" />
						Export Project Artifacts
					</CardTitle>
				</CardHeader>
				<CardContent>
					<TooltipProvider>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{/* design.json */}
							<div className="border border-slate-700 rounded p-3 bg-slate-800">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<FileJson className="h-4 w-4 text-emerald-400" />
										<span className="text-sm">design.json</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-4 w-4 text-slate-400" />
										</TooltipTrigger>
										<TooltipContent className="bg-slate-800 text-slate-200 border-slate-600">
											<div className="text-xs">This JSON is your schematic netlist.</div>
										</TooltipContent>
									</Tooltip>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => download("design.json", designJSON, "application/json")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
										<Download className="h-4 w-4" /> Download
									</Button>
									<Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setOpenExplain(true)}>Explain</Button>
								</div>
								{guidedMode?.isActive && guidedTip("This JSON is your schematic netlist.")}
							</div>

							{/* waveform.json */}
							<div className="border border-slate-700 rounded p-3 bg-slate-800">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<FileJson className="h-4 w-4 text-amber-400" />
										<span className="text-sm">waveform.json</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-4 w-4 text-slate-400" />
										</TooltipTrigger>
										<TooltipContent className="bg-slate-800 text-slate-200 border-slate-600">
											<div className="text-xs">This JSON defines your signal patterns for simulation.</div>
										</TooltipContent>
									</Tooltip>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => download("waveform.json", waveformJSON, "application/json")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
										<Download className="h-4 w-4" /> Download
									</Button>
									<Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setOpenExplain(true)}>Explain</Button>
								</div>
								{guidedMode?.isActive && guidedTip("This JSON captures planned signal patterns.")}
							</div>

							{/* hdl.v */}
							<div className="border border-slate-700 rounded p-3 bg-slate-800">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<FileCode className="h-4 w-4 text-green-400" />
										<span className="text-sm">hdl.v</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-4 w-4 text-slate-400" />
										</TooltipTrigger>
										<TooltipContent className="bg-slate-800 text-slate-200 border-slate-600">
											<div className="text-xs">This Verilog file is the HDL that can be simulated or synthesized.</div>
										</TooltipContent>
									</Tooltip>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => download("hdl.v", verilogHDL, "text/plain")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
										<Download className="h-4 w-4" /> Download
									</Button>
									<Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setOpenExplain(true)}>Explain</Button>
								</div>
								{guidedMode?.isActive && guidedTip("This Verilog file is the HDL that can be simulated or synthesized.")}
							</div>

							{/* testbench.v */}
							<div className="border border-slate-700 rounded p-3 bg-slate-800">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<FileCode className="h-4 w-4 text-cyan-400" />
										<span className="text-sm">testbench.v</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-4 w-4 text-slate-400" />
										</TooltipTrigger>
										<TooltipContent className="bg-slate-800 text-slate-200 border-slate-600">
											<div className="text-xs">This testbench verifies your design.</div>
										</TooltipContent>
									</Tooltip>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => download("testbench.v", verilogTestbench, "text/plain")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
										<Download className="h-4 w-4" /> Download
									</Button>
									<Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setOpenExplain(true)}>Explain</Button>
								</div>
								{guidedMode?.isActive && guidedTip("This testbench verifies your design.")}
							</div>

							{/* layout.json */}
							<div className="border border-slate-700 rounded p-3 bg-slate-800">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<FileJson className="h-4 w-4 text-purple-400" />
										<span className="text-sm">layout.json</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-4 w-4 text-slate-400" />
										</TooltipTrigger>
										<TooltipContent className="bg-slate-800 text-slate-200 border-slate-600">
											<div className="text-xs">This JSON records the visual placement of components and their connections.</div>
										</TooltipContent>
									</Tooltip>
								</div>
								<div className="flex gap-2">
									<Button onClick={() => download("layout.json", layoutJSON, "application/json")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
										<Download className="h-4 w-4" /> Download
									</Button>
									<Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setOpenExplain(true)}>Explain</Button>
								</div>
							</div>
						</div>
					</TooltipProvider>

					<div className="mt-4">
						<Button variant="outline" className="border-slate-600 text-slate-200" onClick={() => setOpenExplain(true)}>
							<Lightbulb className="h-4 w-4 mr-2" /> Explain Each File
						</Button>
					</div>
				</CardContent>
			</Card>

			<Dialog open={openExplain} onOpenChange={setOpenExplain}>
				<DialogContent className="bg-slate-900 text-slate-100 border-slate-700">
					<DialogHeader>
						<DialogTitle>What do these files do?</DialogTitle>
						<DialogDescription className="text-slate-400">Plain-English explanations to help you understand each export.</DialogDescription>
					</DialogHeader>
					<ScrollArea className="h-72 mt-2 border border-slate-700 rounded p-3">
						<div className="space-y-3 text-sm">
							{explainItems.map(item => (
								<div key={item.name}>
									<div className="font-semibold text-slate-200 flex items-center gap-2">
										<FileText className="h-4 w-4" /> {item.name}
									</div>
									<p className="text-slate-300 mt-1">{item.desc}</p>
								</div>
							))}

							{/* Contextual, helpful note if reset looks wrong */}
							{(() => {
								const wfSignals = Object.keys(waveform || {});
								const resetSignals = wfSignals.filter(s => /rst|reset/i.test(s));
								const anyResetNeverHigh = resetSignals.some(sig => !Object.values(waveform[sig] || {}).some(v => v === 1));
								if (anyResetNeverHigh) {
									return (
										<div className="mt-3 text-amber-300">
											Note: Simulation shows a reset signal may never assert. Ensure your reset waveform drives the design as expected.
										</div>
									);
								}
								return null;
							})()}
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	);
} 