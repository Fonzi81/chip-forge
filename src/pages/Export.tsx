
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download,
  Cpu,
  CheckCircle,
  Clock,
  Zap,
  Target,
  FileCode,
  Settings,
  ChevronRight,
  Play,
  Pause,
  Grid3X3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/chipforge/TopNav";
import { useWorkflowStore } from "../state/workflowState";

const Export = () => {
  const navigate = useNavigate();
  const { markComplete, setStage } = useWorkflowStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPlatform, setTargetPlatform] = useState("FPGA");
  const [stepStatus, setStepStatus] = useState([
    "current", "pending", "pending", "pending", "pending"
  ]);

  // Set current stage when component loads
  useEffect(() => {
    setStage('Export');
  }, [setStage]);

  const steps = [
    {
      id: 0,
      name: "Synthesis",
      description: "Convert HDL to gate-level netlist",
      icon: <Cpu className="h-5 w-5" />,
      status: stepStatus[0]
    },
    {
      id: 1,
      name: "Place & Route",
      description: "Physical layout optimization",
      icon: <Target className="h-5 w-5" />,
      status: stepStatus[1]
    },
    {
      id: 2,
      name: "Verification",
      description: "Timing and functional checks",
      icon: <CheckCircle className="h-5 w-5" />,
      status: stepStatus[2]
    },
    {
      id: 3,
      name: "GDSII/Bitstream",
      description: "Generate final layout files",
      icon: <FileCode className="h-5 w-5" />,
      status: stepStatus[3]
    },
    {
      id: 4,
      name: "Submission",
      description: "Prepare for fabrication",
      icon: <Download className="h-5 w-5" />,
      status: stepStatus[4]
    }
  ];

  const reports = {
    gateCount: 1247,
    logicLevels: 8,
    criticalPath: "12.3 ns",
    clockFreq: "81.3 MHz",
    powerEst: "2.4 mW",
    area: "0.84 mm²"
  };

  const handleStepRun = () => {
    const newStatus = [...stepStatus];
    newStatus[currentStep] = "running";
    setStepStatus(newStatus);

    setTimeout(() => {
      const finalStatus = [...newStatus];
      finalStatus[currentStep] = "completed";
      setStepStatus(finalStatus);
      
      if (currentStep < steps.length - 1) {
        finalStatus[currentStep + 1] = "current";
        setCurrentStep(currentStep + 1);
        setStepStatus(finalStatus);
      } else {
        // Mark Export stage as complete when all steps are done
        markComplete('Export');
      }
    }, 2000);
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'current': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'running': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <>
      <TopNav />
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
              <span className="text-xl font-semibold">Export & Fabrication</span>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                4-bit ALU Project
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-slate-200 px-3 py-2 rounded"
              >
                <option value="FPGA">FPGA</option>
                <option value="ASIC">ASIC</option>
                <option value="Foundry">Foundry</option>
              </select>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Stepper & Controls */}
          <div className="w-1/2 border-r border-slate-800 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Fabrication Pipeline</h2>
              <p className="text-slate-400 text-sm">Target: {targetPlatform}</p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <Card
                  key={step.id}
                  className={`p-4 border cursor-pointer transition-all ${
                    step.status === "current"
                      ? "border-cyan-500 bg-cyan-500/5"
                      : step.status === "completed"
                      ? "border-emerald-500 bg-emerald-500/5"
                      : step.status === "running"
                      ? "border-purple-500 bg-purple-500/5"
                      : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                  }`}
                  onClick={() => step.status !== "pending" && setCurrentStep(step.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded border ${getStepColor(step.status)}`}>
                        {step.status === "running" ? (
                          <div className="animate-spin">
                            <Zap className="h-5 w-5" />
                          </div>
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">{step.name}</h3>
                        <p className="text-sm text-slate-400">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStepColor(step.status)}>
                        {step.status === "running" ? "Running..." : step.status}
                      </Badge>
                      {index < steps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Link to Interactive Layout Viewer */}
            <div className="my-6 flex justify-center">
              <Button variant="outline" size="lg" className="border-indigo-500 text-indigo-400 hover:bg-slate-800" asChild>
                <a href="/layout-viewer">
                  <Grid3X3 className="h-5 w-5 mr-2" />
                  Open Interactive Layout Viewer
                </a>
              </Button>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <Button
                onClick={handleStepRun}
                disabled={stepStatus[currentStep] === "running" || stepStatus[currentStep] === "completed"}
                className="w-full bg-cyan-500 text-slate-900 hover:bg-cyan-400"
              >
                {stepStatus[currentStep] === "running" ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run {steps[currentStep]?.name}
                  </>
                )}
              </Button>

              {/* Export Buttons */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                  disabled={stepStatus[0] !== "completed"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Netlist
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                  disabled={stepStatus[3] !== "completed"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Get GDSII
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                  disabled={stepStatus[4] !== "completed"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Submit to Fab
                </Button>
              </div>
            </div>
          </div>

          {/* Reports Panel */}
          <div className="w-1/2 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Implementation Reports</h2>
              <p className="text-slate-400 text-sm">Analysis and metrics from synthesis tools</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-slate-900/30 border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{reports.gateCount}</div>
                  <div className="text-sm text-slate-400">Gate Count</div>
                </div>
              </Card>
              <Card className="p-4 bg-slate-900/30 border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{reports.logicLevels}</div>
                  <div className="text-sm text-slate-400">Logic Levels</div>
                </div>
              </Card>
              <Card className="p-4 bg-slate-900/30 border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{reports.criticalPath}</div>
                  <div className="text-sm text-slate-400">Critical Path</div>
                </div>
              </Card>
              <Card className="p-4 bg-slate-900/30 border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{reports.clockFreq}</div>
                  <div className="text-sm text-slate-400">Max Frequency</div>
                </div>
              </Card>
            </div>

            {/* Detailed Reports */}
            <Tabs defaultValue="timing" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="timing" className="data-[state=active]:bg-slate-700">Timing</TabsTrigger>
                <TabsTrigger value="power" className="data-[state=active]:bg-slate-700">Power</TabsTrigger>
                <TabsTrigger value="area" className="data-[state=active]:bg-slate-700">Area</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timing" className="mt-4">
                <Card className="p-4 bg-slate-900/30 border-slate-700">
                  <h3 className="font-semibold mb-3">Timing Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Setup Time:</span>
                      <span className="text-slate-200">2.1 ns</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hold Time:</span>
                      <span className="text-slate-200">0.3 ns</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clock Skew:</span>
                      <span className="text-slate-200">0.12 ns</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Worst Slack:</span>
                      <span className="text-emerald-400">1.2 ns</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="power" className="mt-4">
                <Card className="p-4 bg-slate-900/30 border-slate-700">
                  <h3 className="font-semibold mb-3">Power Estimation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dynamic Power:</span>
                      <span className="text-slate-200">{reports.powerEst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Static Power:</span>
                      <span className="text-slate-200">0.1 mW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">I/O Power:</span>
                      <span className="text-slate-200">0.3 mW</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="area" className="mt-4">
                <Card className="p-4 bg-slate-900/30 border-slate-700">
                  <h3 className="font-semibold mb-3">Area Utilization</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Area:</span>
                      <span className="text-slate-200">{reports.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Logic Area:</span>
                      <span className="text-slate-200">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Routing Area:</span>
                      <span className="text-slate-200">35%</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Export;
