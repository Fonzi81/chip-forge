import { parseVerilog } from '../src/core/hdl-gen/verilogParser.js';

export async function POST({ request }) {
  try {
    const { code } = await request.json();

    if (typeof code !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = parseVerilog(code);

    return new Response(JSON.stringify({ 
      success: true,
      errors: result.errors,
      warnings: result.warnings,
      moduleInfo: result.moduleInfo
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verilog parsing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 