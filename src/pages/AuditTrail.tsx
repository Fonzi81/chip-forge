
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  GitBranch, 
  GitCommit, 
  Clock, 
  User, 
  FileCode, 
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuditTrail = () => {
  const navigate = useNavigate();
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);

  const commits = [
    {
      id: "c1a2b3c",
      timestamp: "2024-01-15 14:30:22",
      author: "AI Assistant",
      prompt: "Add pipeline registers for better timing",
      status: "success",
      changes: {
        added: 23,
        removed: 8,
        files: ["main.v", "pipeline_regs.v"]
      },
      simulation: {
        status: "pass",
        gateCount: 156,
        timing: 95.2
      },
      aiNotes: "Added 2-stage pipeline to improve clock frequency. Timing analysis shows 15% improvement."
    },
    {
      id: "d4e5f6g",
      timestamp: "2024-01-15 13:45:10",
      author: "AI Assistant", 
      prompt: "Fix carry propagation in ALU",
      status: "success",
      changes: {
        added: 12,
        removed: 5,
        files: ["main.v"]
      },
      simulation: {
        status: "pass",
        gateCount: 133,
        timing: 89.1
      },
      aiNotes: "Corrected carry chain logic. All test vectors now pass successfully."
    },
    {
      id: "h7i8j9k",
      timestamp: "2024-01-15 12:20:45",
      author: "AI Assistant",
      prompt: "Create 4-bit ALU with carry-out",
      status: "success",
      changes: {
        added: 45,
        removed: 0,
        files: ["main.v", "testbench.v"]
      },
      simulation: {
        status: "pass",
        gateCount: 128,
        timing: 87.5
      },
      aiNotes: "Initial ALU implementation with 8 operations: ADD, SUB, AND, OR, XOR, NOT, SHL, SHR."
    }
  ];

  const selectedCommitData = commits.find(c => c.id === selectedCommit);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <span className="text-xl font-semibold">Design History</span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              4-bit ALU Project
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <GitBranch className="h-4 w-4 mr-2" />
              Create Branch
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Timeline */}
        <div className="w-1/2 border-r border-slate-800 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <GitCommit className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold">Commit Timeline</h2>
            </div>

            <div className="space-y-4">
              {commits.map((commit, index) => (
                <Card
                  key={commit.id}
                  className={`p-4 border cursor-pointer transition-all ${
                    selectedCommit === commit.id
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedCommit(commit.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="font-mono text-sm text-slate-400">#{commit.id}</span>
                      <Badge className={`${
                        commit.status === "success" 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {commit.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {commit.timestamp}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-slate-200 font-medium mb-1">{commit.prompt}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <User className="h-3 w-3" />
                      {commit.author}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-emerald-400">+{commit.changes.added}</span>
                      <span className="text-red-400">-{commit.changes.removed}</span>
                      <div className="flex items-center gap-1">
                        <FileCode className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400">{commit.changes.files.length} files</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {commit.simulation.status === "pass" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-xs text-slate-400">{commit.simulation.gateCount} gates</span>
                    </div>
                  </div>

                  {/* Timeline connector */}
                  {index < commits.length - 1 && (
                    <div className="absolute left-8 mt-4 w-px h-4 bg-slate-700"></div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Commit Details */}
        <div className="w-1/2 overflow-y-auto">
          {selectedCommitData ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <GitCommit className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold">Commit Details</h2>
                </div>
                <div className="text-sm text-slate-400">#{selectedCommitData.id}</div>
              </div>

              {/* Commit Info */}
              <Card className="p-4 bg-slate-900/30 border-slate-700 mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">{selectedCommitData.prompt}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Author:</span>
                    <span className="text-slate-200 ml-2">{selectedCommitData.author}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-200 ml-2">{selectedCommitData.timestamp}</span>
                  </div>
                </div>
              </Card>

              {/* HDL Diff */}
              <Card className="p-4 bg-slate-900/30 border-slate-700 mb-6">
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  HDL Changes
                </h3>
                <div className="bg-slate-900/50 border border-slate-700 rounded p-3 font-mono text-sm">
                  <div className="text-emerald-400 mb-1">+ Added pipeline registers</div>
                  <div className="text-emerald-400 mb-1">+ reg [3:0] stage1_a, stage1_b;</div>
                  <div className="text-emerald-400 mb-1">+ reg [2:0] stage1_op;</div>
                  <div className="text-red-400 mb-1">- always @(*) begin</div>
                  <div className="text-red-400 mb-1">-     result = a + b;</div>
                  <div className="text-emerald-400">+ always @(posedge clk) begin</div>
                  <div className="text-emerald-400">+     stage1_a <= a;</div>
                </div>
              </Card>

              {/* Simulation Summary */}
              <Card className="p-4 bg-slate-900/30 border-slate-700 mb-6">
                <h3 className="font-semibold text-slate-200 mb-3">Simulation Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{selectedCommitData.simulation.gateCount}</div>
                    <div className="text-xs text-slate-400">Gate Count</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{selectedCommitData.simulation.timing}%</div>
                    <div className="text-xs text-slate-400">Timing Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">PASS</div>
                    <div className="text-xs text-slate-400">Status</div>
                  </div>
                </div>
              </Card>

              {/* AI Notes */}
              <Card className="p-4 bg-slate-900/30 border-slate-700">
                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  AI Agent Notes
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedCommitData.aiNotes}
                </p>
              </Card>

              <div className="mt-6 flex gap-3">
                <Button className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
                  <Eye className="h-4 w-4 mr-2" />
                  View This Version
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Restore This Version
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <GitCommit className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a commit to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
