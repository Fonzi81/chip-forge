# ChipForge Project Design & Context Log

This document defines the full architecture, workflow, module mapping, build phases, and Smeltr-based HDL generation pipeline for ChipForge. It is the single source of truth for all developers and Cursor. It must be updated with every new module, integration, or prompt created.

---

## 🚀 Project Vision

ChipForge is an AI-assisted chip design platform that enables schematic-first workflows for beginners and advanced engineers alike. The full stack supports:

- Drag-and-drop schematic capture
- Visual waveform planning
- AI Verilog generation (Smeltr)
- Testbench creation + simulation validation
- Reflexion loop for self-correcting code
- RTL to layout (GDSII) synthesis
- Drone chip use-case with modular subsystems

---

## 🧩 Full System Workflow

```
[User Input (Wizard, Template, or AI Chat)]
        ↓
[Schematic Canvas] ←→ [Component Library]
        ↓
[Waveform Planner]
        ↓
[Testbench Generator]
        ↓
[HDL Generator (Smeltr + Reflexion)]
        ↓
[Simulation (Verilog/VCD)]
        ↓
[Synthesis (Netlist + Constraints)]
        ↓
[Layout Engine + GDSII Export]
        ↓
[3D Viewer + Constraint Visualisation]
```

All modules use shared state via `hdlDesignStore.ts`. All design files are stored as:
- `design.json` (netlist, components, buses)
- `waveform.json` (signal timelines)
- `testbench.v` (generated logic)
- `module.v` (HDL output from Smeltr)

---

## 🧠 Smeltr Integration

- **Input:** `design.json`, `waveform.json`, `constraints.yaml`, and/or prompt
- **Process:**
  - Infer RTL style (behavioral/structural)
  - Generate synthesizable Verilog
  - Validate structure + syntax
- **Output:** `module.v`, `testbench.v`, `analysis.json`
- **Connected to Reflexion loop for improvement**

---

## 🔨 Modular Build Strategy

| Phase | Module                  | Outcome                                              |
|-------|-------------------------|------------------------------------------------------|
| 1.0   | Schematic Wizard        | New user onboarding wizard for template-driven designs|
| 1.1   | SchematicCanvas.tsx     | Interactive canvas for schematic creation             |
| 1.2   | ComponentLibrary.tsx    | Selectable, filterable component blocks               |
| 1.3   | design.json             | Live-exported netlist with full traceability          |
| 2.0   | WaveformPlanner.tsx     | Draw and edit signal behavior linked to schematic     |
| 2.1   | testbench.v             | Generated testbench linked to waveform & sim engine   |
| 3.0   | EnhancedHDLGenerator.tsx| Generate HDL via Smeltr + Reflexion                   |
| 4.0   | SimulationEnvironment.tsx| Render VCD, trace outputs, coverage feedback         |
| 5.0   | SynthesisEnvironment.tsx| RTL → Netlist + Constraint Checker                    |
| 6.0   | AdvancedLayoutDesigner.tsx| Layout planner, package view, export GDSII          |
| 7.0   | TemplatesLibrary.tsx    | Component and subsystem templates for reuse           |
| 8.0   | Cross-traceability engine| Signal ↔ HDL ↔ Schematic linking                     |

---

## ⚠️ Known Issues To Resolve

- Canvas drag-and-drop is unstable
- AI Copilot chat is non-functional
- 3D viewer is not realistic (placeholder)
- Modules don’t pass design state consistently
- HDL generation is not yet using schematic netlist

---

## 📦 Active Drone Use Case Design

- Navigation FSM (GPS/state engine)
- Obstacle IR pulse timing + decode FSM
- Stabilization loop (feedback register + PID placeholder)
- Shared ALU datapath module
- Modular block interface to be stored in TemplatesLibrary

---

## ✅ Milestone Tracker

| Step | Goal                                 | Output                  | Status  |
|------|--------------------------------------|-------------------------|---------|
| 0    | Define architecture + context        | chipforge.context.md    | ✅ Done |
| 1    | Build schematic creation wizard      | SchematicWizard.tsx     | 🔜      |
| 2    | Rebuild schematic canvas with snap + wire + ERC | SchematicCanvas.tsx | 🔜      |
| 3    | Link canvas → waveform               | WaveformPlanner.tsx     | 🔜      |
| 4    | HDL gen using schematic + waveform   | EnhancedHDLGenerator.tsx| 🔜      |
| 5    | Reflexion feedback loop              | SimulationEnvironment.tsx| 🔜     |
| 6    | Layout + export                      | AdvancedLayoutDesigner.tsx| 🔜    |

---

**This file must be updated after each module, milestone, or architectural decision.** 