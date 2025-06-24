
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Monitor, FileText, Cpu, Play, CheckCircle, AlertCircle } from "lucide-react";

const ProductPreviews = () => {
  const [activeFeature, setActiveFeature] = useState<string>("text-to-hdl");

  const features = [
    {
      id: "text-to-hdl",
      title: "AI HDL Synthesis",
      icon: Code,
      category: "Core Engine",
      description: "Natural language specifications automatically converted to production-ready HDL",
      preview: `// ChipForge AI Synthesis Engine
> Specification: "32-bit RISC-V ALU with overflow detection and IEEE 754 floating point support"

🔄 AI Analysis Pipeline:
├── Requirements parsing: COMPLETE
├── Architecture selection: RISC-V RV32I base
├── Optimization target: Area/power balanced
└── Verification strategy: Formal + simulation

📋 Generated HDL Summary:
module riscv_alu_32bit (
    input  [31:0] operand_a,
    input  [31:0] operand_b,
    input  [3:0]  alu_op,
    input         fp_enable,
    output [31:0] result,
    output        overflow,
    output        zero_flag
);

⚡ Performance Metrics:
├── Max Frequency: 187 MHz @ 1.8V
├── Area: 0.42 mm² (28nm)
├── Power: 23.7 mW @ 100MHz
└── Critical Path: 5.34ns

✅ Verification: 99.2% coverage, 0 violations`
    },
    {
      id: "simulation",
      title: "Real-Time Verification",
      icon: Monitor,
      category: "Validation",
      description: "Comprehensive verification with formal methods and simulation",
      preview: `🧪 ChipForge Verification Suite
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Test Results Dashboard:
┌─────────────────┬─────────┬──────────┐
│ Test Category   │ Status  │ Coverage │
├─────────────────┼─────────┼──────────┤
│ Functional      │ ✅ PASS │  99.2%   │
│ Formal Props    │ ✅ PASS │  100%    │
│ Corner Cases    │ ✅ PASS │  97.8%   │
│ Power Analysis  │ ✅ PASS │  95.4%   │
│ Timing          │ ✅ PASS │  100%    │
└─────────────────┴─────────┴──────────┘

⚡ Performance Analysis:
┌─────────────────┬─────────────────────┐
│ Max Frequency   │ 187.3 MHz          │
│ Setup Slack     │ +0.23ns (MET)      │
│ Hold Slack      │ +0.07ns (MET)      │
│ Power Est.      │ 23.7mW @ 100MHz    │
│ Leakage         │ 2.1µW              │
└─────────────────┴─────────────────────┘

🔍 Critical Path Analysis:
operand_a[31] → alu_core/add_unit/cla[7] → result[31]
Delay: 5.34ns | Slack: +0.23ns | TIMING MET

📈 Quality Score: 94.7/100`
    },
    {
      id: "audit-trail",
      title: "Enterprise Audit Trail",
      icon: FileText,
      category: "Compliance",
      description: "Complete decision transparency and compliance documentation",
      preview: `📋 ChipForge Decision Audit Log
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕐 Session: 2024-06-24T14:32:15Z
👤 Engineer: john.doe@company.com
🎯 Project: RISC-V_ALU_v2.1

┌── Requirements Analysis ────────────────
│ [14:32:15] Input specification parsed
│ ├─ Architecture: 32-bit RISC-V ALU
│ ├─ Features: Overflow detection, FP support
│ ├─ Constraints: Area optimized, < 25mW
│ └─ Standards: IEEE 754, RISC-V spec v2.2
│
├── AI Decision Tree ────────────────────
│ [14:32:16] Architecture selection
│ ├─ Evaluated: Ripple-carry vs CLA vs Hybrid
│ ├─ Selected: Carry Look-Ahead (CLA)
│ ├─ Rationale: Timing critical, area acceptable
│ └─ Trade-off: +15% area for 3x speed
│
├── HDL Generation ──────────────────────
│ [14:32:17] Code synthesis initiated
│ ├─ Template: riscv_alu_optimized_v3.hdl
│ ├─ Optimizations: 7 transformations applied
│ ├─ Clock gating: 12 domains identified
│ └─ Pipeline stages: 2 (input/output regs)
│
└── Verification Plan ───────────────────
  [14:32:18] Test generation complete
  ├─ Directed tests: 127 vectors
  ├─ Random tests: 10,000 vectors  
  ├─ Formal props: 23 assertions
  └─ Coverage goals: 99% line, 95% toggle

🏛️ Compliance Checkpoints:
✅ ISO 26262 (Automotive)
✅ DO-254 (Aerospace) 
✅ IEC 61508 (Functional Safety)
✅ FIPS 140-2 (Cryptographic)

🔐 Security & IP Protection:
├─ Local processing: ✅ No cloud dependencies
├─ Audit logging: ✅ Tamper-evident
├─ Access control: ✅ Role-based permissions
└─ Data sovereignty: ✅ On-premises deployment`
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-blue-500/20 rounded-full mb-6">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300 font-medium">Platform Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            Enterprise <span className="gradient-text">Platform</span> Preview
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
            Professional-grade AI chipset design tools built for semiconductor teams, government agencies, and enterprise R&D
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature selector */}
          <div className="lg:col-span-1 space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id 
                    ? 'bg-slate-800 border-cyan-500/50 enterprise-shadow-lg' 
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      activeFeature === feature.id 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-200">{feature.title}</h3>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {feature.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature preview */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <activeFeatureData.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100">{activeFeatureData.title}</h3>
                      <p className="text-slate-400">{activeFeatureData.category} Module</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-data-pulse"></div>
                    <span className="text-sm text-slate-400">Live System</span>
                  </div>
                </div>

                {/* Professional code preview */}
                <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-500/60 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-500/60 rounded-full"></div>
                        <div className="w-3 h-3 bg-emerald-500/60 rounded-full"></div>
                      </div>
                      <span className="text-sm text-slate-400 font-mono">chipforge-terminal</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                      Production Ready
                    </Badge>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {activeFeatureData.preview}
                    </pre>
                  </div>
                </div>

                {/* Professional status indicators */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">Verified & Tested</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <Cpu className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Production Grade</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Full Documentation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 border-cyan-500/30 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Enterprise Platform Access
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Join leading semiconductor teams, government agencies, and research institutions using ChipForge for mission-critical chip design
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
                  SOC 2 Type II Certified
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 px-4 py-2">
                  On-Premises Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviews;
