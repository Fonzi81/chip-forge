import { callLLMHDLGenerator } from '../hdl-gen/llmHDLGen';

export async function runReflexionIteration(
  description: string,
  prevCode: string,
  feedback: string,
  advice: string
): Promise<string> {
  const prompt = `
You are a hardware design expert. Based on the following module description, previous HDL code, simulation feedback, and review advice, regenerate a corrected Verilog module.

--- Description ---
${description}

--- Previous Code ---
\`\`\`verilog
${prevCode}
\`\`\`

--- Simulation Feedback ---
${feedback}

--- AI Review Advice ---
${advice}

Only output valid Verilog code between \`\`\`verilog and \`\`\` markers.
  `.trim();

  const response = await callLLMHDLGenerator(prompt, '');
  const match = response.match(/```verilog\n([\s\S]*?)```/);
  return match ? match[1].trim() : '// Failed to regenerate HDL';
} 