import React from "react";

// Example set of professional chip design cells
const cellCategories = [
  {
    name: "Logic Gates",
    cells: ["AND", "OR", "NAND", "NOR", "XOR", "XNOR", "NOT"],
  },
  {
    name: "Flip-Flops & Latches",
    cells: ["D Flip-Flop", "T Flip-Flop", "SR Latch", "JK Flip-Flop"],
  },
  {
    name: "Memory",
    cells: ["SRAM Cell", "DRAM Cell", "ROM Cell", "Register File"],
  },
  {
    name: "Analog & Mixed-Signal",
    cells: ["Op-Amp", "Comparator", "ADC", "DAC", "PLL"],
  },
  {
    name: "I/O & Pad Cells",
    cells: ["Input Pad", "Output Pad", "Bidirectional Pad", "ESD Protection"],
  },
  {
    name: "Power Management",
    cells: ["VDD Pad", "VSS Pad", "Voltage Regulator", "Charge Pump"],
  },
  {
    name: "Specialty",
    cells: ["Clock Buffer", "Level Shifter", "Sense Amp", "Bandgap Ref"],
  },
];

const ProfessionalCellLibrary: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <h2>Professional Cell Library</h2>
      {cellCategories.map((cat) => (
        <div key={cat.name} style={{ marginBottom: 16 }}>
          <h3>{cat.name}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cat.cells.map((cell) => (
              <div
                key={cell}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  padding: "8px 12px",
                  background: "#f9f9f9",
                  cursor: "pointer",
                }}
                title={cell}
              >
                {cell}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfessionalCellLibrary; 