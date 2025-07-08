// File: src/backend/hdl-gen/generateHDL.ts

type HDLGenRequest = {
  moduleName: string;
  description: string;
  io: { name: string; direction: 'input' | 'output'; width: number }[];
};

export function generateVerilog({ moduleName, description, io }: HDLGenRequest): string {
  const portList = io.map(p => `${p.direction} [${p.width - 1}:0] ${p.name}`).join(';\n  ');
  const header = `// Module: ${moduleName}\n// Description: ${description}`;
  return `${header}

module ${moduleName} (
  ${io.map(p => p.name).join(', ')}
);
  ${portList};

  // TODO: Implement logic here

endmodule
`;
} 