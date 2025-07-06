import { DesignFile, AISuggestion } from "@/components/design-editor/types";

export const getDefaultFiles = (initialHdlCode?: string): DesignFile[] => [
  { 
    id: "1", 
    name: "alu_4bit.v", 
    type: "verilog" as const, 
    hasErrors: false, 
    path: "src/alu_4bit.v",
    content: initialHdlCode || `module alu_4bit (
    input [3:0] a,
    input [3:0] b,
    input [2:0] op,
    output reg [3:0] result,
    output reg carry_out
);

always @(*) begin
    case (op)
        3'b000: {carry_out, result} = a + b;    // Addition
        3'b001: {carry_out, result} = a - b;    // Subtraction
        3'b010: begin result = a & b; carry_out = 0; end  // AND
        3'b011: begin result = a | b; carry_out = 0; end  // OR
        3'b100: begin result = a ^ b; carry_out = 0; end  // XOR
        3'b101: begin result = ~a; carry_out = 0; end     // NOT A
        3'b110: begin result = a << 1; carry_out = a[3]; end  // Shift Left
        3'b111: begin result = a >> 1; carry_out = a[0]; end  // Shift Right
        default: begin result = 4'b0000; carry_out = 0; end
    endcase
end

endmodule`
  },
  { 
    id: "2", 
    name: "alu_testbench.v", 
    type: "testbench" as const, 
    hasErrors: false, 
    path: "tb/alu_testbench.v",
    content: `module alu_testbench;
    reg [3:0] a, b;
    reg [2:0] op;
    wire [3:0] result;
    wire carry_out;
    
    alu_4bit uut (.a(a), .b(b), .op(op), .result(result), .carry_out(carry_out));
    
    initial begin
        $monitor("a=%b, b=%b, op=%b, result=%b, carry=%b", a, b, op, result, carry_out);
        
        a = 4'b0011; b = 4'b0001; op = 3'b000; #10; // Add
        a = 4'b0011; b = 4'b0001; op = 3'b001; #10; // Sub
        a = 4'b0011; b = 4'b0001; op = 3'b010; #10; // AND
        
        $finish;
    end
endmodule`
  },
  { 
    id: "3", 
    name: "constraints.xdc", 
    type: "constraint" as const, 
    hasErrors: false, 
    path: "constraints/constraints.xdc",
    content: `# Clock constraint
create_clock -period 10.0 [get_ports clk]

# Input/Output constraints
set_input_delay -clock clk 2.0 [get_ports {a[*] b[*] op[*]}]
set_output_delay -clock clk 2.0 [get_ports {result[*] carry_out}]`
  }
];

export const getDefaultAISuggestions = (): AISuggestion[] => [
  {
    id: "1",
    type: "optimization" as const,
    title: "Add Pipeline Registers",
    description: "Consider adding pipeline registers to improve timing closure for high-frequency operation.",
    code: "always_ff @(posedge clk) begin\n    result_reg <= result;\nend",
    confidence: 0.85,
    line: 15
  },
  {
    id: "2", 
    type: "completion" as const,
    title: "Add Reset Logic",
    description: "Adding a reset signal would improve design robustness and simulation.",
    confidence: 0.72
  }
];