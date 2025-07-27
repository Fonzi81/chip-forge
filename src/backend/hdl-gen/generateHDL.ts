// File: src/backend/hdl-gen/generateHDL.ts

type HDLGenRequest = {
  moduleName: string;
  description: string;
  io: { name: string; direction: 'input' | 'output'; width: number }[];
  previousCode?: string;
  feedback?: string;
  advice?: string;
};

export function generateVerilog({ moduleName, description, io, previousCode, feedback, advice }: HDLGenRequest): string {
  // For conversational approach, we'll generate I/O ports based on the description
  // This is a simplified implementation - in a real system, this would use AI to parse the description
  
  let generatedIo = io;
  if (io.length === 0) {
    // Generate I/O ports based on description
    generatedIo = generateIOPortsFromDescription(description);
  }
  
  const portList = generatedIo.map(p => `${p.direction} [${p.width - 1}:0] ${p.name}`).join(';\n  ');
  const header = `// Module: ${moduleName}\n// Description: ${description}`;
  
  // Add improvement context if available
  let improvementComment = '';
  if (previousCode && feedback) {
    improvementComment = `\n// Previous version had issues: ${feedback}`;
  }
  if (advice) {
    improvementComment += `\n// AI suggestions: ${advice}`;
  }
  
  return `${header}${improvementComment}

module ${moduleName} (
  ${generatedIo.map(p => p.name).join(', ')}
);
  ${portList};

  // TODO: Implement logic here
  // Generated based on description: ${description}

endmodule
`;
}

function generateIOPortsFromDescription(description: string): { name: string; direction: 'input' | 'output'; width: number }[] {
  const ports: { name: string; direction: 'input' | 'output'; width: number }[] = [];
  
  // Simple keyword-based I/O generation
  const lowerDesc = description.toLowerCase();
  
  // Common input patterns
  if (lowerDesc.includes('clock') || lowerDesc.includes('clk')) {
    ports.push({ name: 'clk', direction: 'input', width: 1 });
  }
  if (lowerDesc.includes('reset') || lowerDesc.includes('rst')) {
    ports.push({ name: 'rst_n', direction: 'input', width: 1 });
  }
  if (lowerDesc.includes('enable') || lowerDesc.includes('en')) {
    ports.push({ name: 'enable', direction: 'input', width: 1 });
  }
  
  // Data inputs (look for bit-width patterns)
  const bitMatch = description.match(/(\d+)-bit/gi);
  if (bitMatch) {
    const bitWidth = parseInt(bitMatch[0].split('-')[0]);
    if (lowerDesc.includes('input') || lowerDesc.includes('data')) {
      ports.push({ name: 'data_in', direction: 'input', width: bitWidth });
    }
    if (lowerDesc.includes('output') || lowerDesc.includes('result')) {
      ports.push({ name: 'data_out', direction: 'output', width: bitWidth });
    }
  }
  
  // Default ports if none found
  if (ports.length === 0) {
    ports.push({ name: 'in', direction: 'input', width: 1 });
    ports.push({ name: 'out', direction: 'output', width: 1 });
  }
  
  return ports;
} 