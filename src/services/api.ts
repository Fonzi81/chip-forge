// File: src/services/api.ts
// Mock API service for HDL operations
// This can be easily replaced with real API calls when backend is ready

// Mock syntax check function
const checkVerilogSyntaxAsync = async (code: string) => {
  // Simple syntax validation
  const hasModule = /module\s+\w+/.test(code);
  const hasEndmodule = /endmodule/.test(code);
  const errors = [];
  const warnings = [];
  
  if (!hasModule) errors.push({ line: 1, column: 1, message: "Missing module declaration", severity: 'error' as const });
  if (!hasEndmodule) errors.push({ line: 1, column: 1, message: "Missing endmodule", severity: 'error' as const });
  
  return {
    errors,
    warnings,
    isValid: errors.length === 0,
    moduleInfo: hasModule ? { name: 'test_module', portCount: 3, signalCount: 5, alwaysBlockCount: 1, assignCount: 2 } : undefined
  };
};

export interface SyntaxCheckRequest {
  code: string;
}

export interface SyntaxCheckResponse {
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
    code?: string;
  }>;
  warnings: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
    code?: string;
  }>;
  isValid: boolean;
  moduleInfo?: {
    name: string;
    portCount: number;
    signalCount: number;
    alwaysBlockCount: number;
    assignCount: number;
  };
}

export interface HDLGenerationRequest {
  prompt: string;
  moduleName?: string;
  constraints?: {
    maxGates?: number;
    targetFrequency?: number;
    style?: 'behavioral' | 'structural' | 'rtl';
  };
}

export interface HDLGenerationResponse {
  code: string;
  metadata: {
    estimatedGates: number;
    estimatedFrequency: number;
    warnings: string[];
    suggestions: string[];
  };
}

// Mock API class that simulates backend calls
class MockAPIService {
  private baseURL = '/api'; // This would be your actual API base URL

  async syntaxCheck(request: SyntaxCheckRequest): Promise<SyntaxCheckResponse> {
    try {
      // Try to use the real API endpoint first
      const response = await fetch('/api/verilog-parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          errors: result.errors || [],
          warnings: result.warnings || [],
          isValid: result.errors?.length === 0,
          moduleInfo: result.moduleInfo
        };
      }
    } catch (error) {
      console.warn('API endpoint not available, falling back to local syntax check:', error);
    }
    
    // Fallback to local syntax checking
    const result = await checkVerilogSyntaxAsync(request.code);
    
    return {
      errors: result.errors,
      warnings: result.warnings,
      isValid: result.isValid,
      moduleInfo: result.moduleInfo
    };
  }

  async generateHDL(request: HDLGenerationRequest): Promise<HDLGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI generation based on prompt
    const generatedCode = this.generateMockHDL(request.prompt, request.moduleName);
    
    return {
      code: generatedCode,
      metadata: {
        estimatedGates: Math.floor(Math.random() * 1000) + 100,
        estimatedFrequency: Math.floor(Math.random() * 200) + 50,
        warnings: ['Generated using mock AI service'],
        suggestions: ['Consider adding more specific constraints for better optimization']
      }
    };
  }

  private generateMockHDL(prompt: string, moduleName?: string): string {
    const name = moduleName || 'generated_module';
    
    if (prompt.toLowerCase().includes('counter')) {
      return `// AI Generated: Counter module
module ${name} (
  input clk,
  input rst_n,
  input enable,
  input [7:0] load_value,
  input load_enable,
  output reg [7:0] count
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      count <= 8'h00;
    end else if (load_enable) begin
      count <= load_value;
    end else if (enable) begin
      count <= count + 1;
    end
  end

endmodule`;
    } else if (prompt.toLowerCase().includes('traffic') || prompt.toLowerCase().includes('fsm')) {
      return `// AI Generated: Traffic Light FSM
module ${name} (
  input clk,
  input rst_n,
  input enable,
  output reg [1:0] light_state
);

  // State encoding
  localparam RED    = 2'b00;
  localparam YELLOW = 2'b01;
  localparam GREEN  = 2'b10;

  // State register
  reg [1:0] current_state, next_state;

  // State transition logic
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      current_state <= RED;
    end else if (enable) begin
      current_state <= next_state;
    end
  end

  // Next state logic
  always @(*) begin
    case (current_state)
      RED:    next_state = GREEN;
      GREEN:  next_state = YELLOW;
      YELLOW: next_state = RED;
      default: next_state = RED;
    endcase
  end

  // Output logic
  always @(*) begin
    light_state = current_state;
  end

endmodule`;
    } else if (prompt.toLowerCase().includes('alu') || prompt.toLowerCase().includes('arithmetic')) {
      return `// AI Generated: ALU module
module ${name} (
  input [7:0] a,
  input [7:0] b,
  input [2:0] op,
  output reg [7:0] result,
  output reg carry_out
);

  always @(*) begin
    case (op)
      3'b000: {carry_out, result} = a + b;
      3'b001: {carry_out, result} = a - b;
      3'b010: begin result = a & b; carry_out = 0; end
      3'b011: begin result = a | b; carry_out = 0; end
      3'b100: begin result = a ^ b; carry_out = 0; end
      3'b101: begin result = a << 1; carry_out = a[7]; end
      3'b110: begin result = a >> 1; carry_out = a[0]; end
      default: begin result = 8'h00; carry_out = 0; end
    endcase
  end

endmodule`;
    } else {
      return `// AI Generated: Generic module
module ${name} (
  input clk,
  input rst_n,
  input [7:0] data_in,
  output reg [7:0] data_out
);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      data_out <= 8'h00;
    end else begin
      data_out <= data_in;
    end
  end

endmodule`;
    }
  }
}

// Export singleton instance
export const apiService = new MockAPIService();

// Real API service class (for when backend is ready)
export class RealAPIService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async syntaxCheck(request: SyntaxCheckRequest): Promise<SyntaxCheckResponse> {
    const response = await fetch(`${this.baseURL}/hdl/syntax-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async generateHDL(request: HDLGenerationRequest): Promise<HDLGenerationResponse> {
    const response = await fetch(`${this.baseURL}/hdl/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
} 