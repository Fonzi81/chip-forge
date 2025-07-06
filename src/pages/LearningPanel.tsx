
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  Lightbulb,
  Cpu,
  Zap,
  Code,
  Award,
  Search,
  Bot
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LearningPanel = () => {
  const navigate = useNavigate();
  const [aiQuestion, setAiQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: "Chip Design with No Experience",
      description: "Complete beginner's guide to digital chip design",
      modules: 12,
      duration: "8 hours",
      progress: 45,
      level: "Beginner",
      enrolled: true
    },
    {
      id: 2,
      title: "Advanced RTL Design Patterns",
      description: "Master complex RTL design techniques and best practices",
      modules: 15,
      duration: "12 hours",
      progress: 0,
      level: "Advanced",
      enrolled: false
    },
    {
      id: 3,
      title: "FPGA Implementation Fundamentals",
      description: "Learn FPGA architecture and implementation strategies",
      modules: 10,
      duration: "6 hours",
      progress: 80,
      level: "Intermediate",
      enrolled: true
    }
  ];

  const modules = [
    {
      id: 1,
      title: "Introduction to Digital Logic",
      completed: true,
      duration: "45 min",
      type: "video"
    },
    {
      id: 2,
      title: "Understanding Logic Gates",
      completed: true,
      duration: "30 min",
      type: "interactive"
    },
    {
      id: 3,
      title: "Combinational Logic Design",
      completed: true,
      duration: "60 min",
      type: "video"
    },
    {
      id: 4,
      title: "Sequential Logic and Flip-Flops",
      completed: false,
      duration: "50 min",
      type: "video",
      current: true
    },
    {
      id: 5,
      title: "State Machines",
      completed: false,
      duration: "40 min",
      type: "hands-on"
    }
  ];

  const aiResponses = [
    {
      question: "What is an FSM?",
      answer: "An FSM (Finite State Machine) is a computational model used to design sequential logic circuits. It consists of a finite number of states, transitions between those states, and actions. FSMs are fundamental in digital design for controlling sequence-dependent operations like protocols, controllers, and data processing units.",
      examples: ["Traffic light controller", "UART state machine", "CPU control unit"]
    },
    {
      question: "What is clock domain crossing?",
      answer: "Clock domain crossing (CDC) occurs when a signal generated in one clock domain is used in another clock domain. This can cause metastability and data corruption. Common solutions include synchronizers, FIFOs, and handshaking protocols.",
      examples: ["Dual-clock FIFO", "Two-flop synchronizer", "Handshake protocol"]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">Learning Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Award className="h-3 w-3 mr-1" />
              2 Courses Completed
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="courses" className="data-[state=active]:bg-slate-700">Courses</TabsTrigger>
            <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-slate-700">AI Assistant</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-slate-700">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Search */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-slate-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Course */}
            <Card className="bg-gradient-to-r from-amber-500/10 via-slate-900/50 to-slate-900/50 border-amber-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-200 mb-2">Featured Course</CardTitle>
                    <CardDescription className="text-slate-400">
                      Perfect for beginners starting their chip design journey
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    Featured
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-200">Chip Design with No Experience</h3>
                    <p className="text-slate-400">Learn digital design from the ground up</p>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-slate-400">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Course List */}
            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-200">{course.title}</h3>
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                        </div>
                        <p className="text-slate-400 mb-4">{course.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {course.modules} modules
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {course.enrolled ? (
                          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        ) : (
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Enroll Now
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {course.enrolled && course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-slate-400">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Course Modules (for enrolled course) */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Current Course Modules</CardTitle>
                <CardDescription className="text-slate-400">
                  Chip Design with No Experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                      module.current 
                        ? 'border-amber-500/30 bg-amber-500/5' 
                        : 'border-slate-700 bg-slate-800/30'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          module.completed 
                            ? 'bg-emerald-500/20' 
                            : module.current 
                              ? 'bg-amber-500/20' 
                              : 'bg-slate-700'
                        }`}>
                          {module.completed ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <span className="text-sm font-medium text-slate-300">{module.id}</span>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-slate-200">{module.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <span>{module.duration}</span>
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              {module.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant={module.current ? "default" : "ghost"}
                        size="sm"
                        className={module.current ? "bg-amber-600 hover:bg-amber-700" : ""}
                      >
                        {module.completed ? "Review" : module.current ? "Continue" : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            {/* AI Question Input */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Bot className="h-5 w-5 text-cyan-400" />
                  AI Learning Assistant
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ask any question about chip design and get instant, detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Ask a question... (e.g., What is an FSM?)"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-slate-200"
                  />
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Q&A */}
            <div className="space-y-4">
              {aiResponses.map((response, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-200 mb-2">{response.question}</h4>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300 mb-4">{response.answer}</p>
                          <div>
                            <h5 className="text-sm font-medium text-slate-400 mb-2">Common Examples:</h5>
                            <div className="flex flex-wrap gap-2">
                              {response.examples.map((example, i) => (
                                <Badge key={i} variant="outline" className="border-slate-600 text-slate-400">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Quick Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Cpu className="h-5 w-5 text-blue-400" />
                    RTL Quick Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Always block:</span>
                      <code className="text-cyan-400">always @(*)</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clock edge:</span>
                      <code className="text-cyan-400">posedge clk</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reset:</span>
                      <code className="text-cyan-400">negedge rst_n</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Blocking:</span>
                      <code className="text-cyan-400">=</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Non-blocking:</span>
                      <code className="text-cyan-400">{"<="}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Zap className="h-5 w-5 text-amber-400" />
                    Common Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-400">• Counter design patterns</div>
                    <div className="text-slate-400">• FSM templates (Moore/Mealy)</div>
                    <div className="text-slate-400">• FIFO implementations</div>
                    <div className="text-slate-400">• Clock domain crossing</div>
                    <div className="text-slate-400">• Pipeline design</div>
                    <div className="text-slate-400">• Memory interfaces</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Code className="h-5 w-5 text-emerald-400" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                      <span className="text-slate-400">Use meaningful names</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                      <span className="text-slate-400">Avoid latches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                      <span className="text-slate-400">Synchronous reset</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Documentation Sections */}
            <div className="space-y-6">
              {/* HDL Syntax Guide */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Code className="h-5 w-5 text-emerald-400" />
                    Complete HDL Syntax Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-300">Module Declaration</h4>
                      <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                        <div className="text-purple-400">module</div>
                        <div className="text-cyan-400 ml-2">counter</div>
                        <div className="text-slate-300 ml-1">#(parameter WIDTH = 8)</div>
                        <div className="text-slate-300 ml-1">(</div>
                        <div className="text-blue-400 ml-4">input</div>
                        <div className="text-slate-300 ml-1">clk, rst_n,</div>
                        <div className="text-red-400 ml-4">output reg</div>
                        <div className="text-slate-300 ml-1">[WIDTH-1:0] count</div>
                        <div className="text-slate-300">);</div>
                      </div>
                      
                      <h4 className="font-medium text-slate-300">Always Blocks</h4>
                      <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                        <div className="text-purple-400">always @(posedge clk or negedge rst_n)</div>
                        <div className="text-purple-400 ml-2">begin</div>
                        <div className="text-purple-400 ml-4">if (!rst_n)</div>
                        <div className="text-cyan-400 ml-6">count {"<="} 0;</div>
                        <div className="text-purple-400 ml-4">else</div>
                        <div className="text-cyan-400 ml-6">count {"<="} count + 1;</div>
                        <div className="text-purple-400 ml-2">end</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-300">State Machines</h4>
                        <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                          <div className="text-purple-400">{"typedef enum logic [1:0] {"}</div>
                          <div className="text-cyan-400 ml-4">IDLE = 2'b00,</div>
                          <div className="text-cyan-400 ml-4">START = 2'b01,</div>
                          <div className="text-cyan-400 ml-4">ACTIVE = 2'b10,</div>
                          <div className="text-cyan-400 ml-4">DONE = 2'b11</div>
                          <div className="text-purple-400">{"} state_t;"}</div>
                        </div>
                      
                      <h4 className="font-medium text-slate-300">Interface Declaration</h4>
                      <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                        <div className="text-purple-400">interface</div>
                        <div className="text-cyan-400 ml-1">bus_if</div>
                        <div className="text-slate-300 ml-1">#(parameter WIDTH = 32);</div>
                        <div className="text-blue-400 ml-2">logic</div>
                        <div className="text-slate-300 ml-1">[WIDTH-1:0] data;</div>
                        <div className="text-blue-400 ml-2">logic</div>
                        <div className="text-slate-300 ml-1">valid, ready;</div>
                        <div className="text-purple-400">endinterface</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Design Patterns */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    Common Design Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-slate-300 mb-3">Clock Domain Crossing</h4>
                      <div className="bg-slate-800/50 p-4 rounded">
                        <p className="text-slate-400 text-sm mb-3">Use synchronizer for single-bit signals:</p>
                        <div className="font-mono text-sm">
                          <div className="text-blue-400">reg</div>
                          <div className="text-slate-300 ml-1">[1:0] sync_ff;</div>
                          <div className="text-purple-400">always @(posedge clk_dest)</div>
                          <div className="text-cyan-400 ml-2">sync_ff {"<="} {"{sync_ff[0], signal_src}"};</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-300 mb-3">FIFO Implementation</h4>
                      <div className="bg-slate-800/50 p-4 rounded">
                        <p className="text-slate-400 text-sm mb-3">Asynchronous FIFO with Gray code pointers:</p>
                        <div className="font-mono text-sm">
                          <div className="text-blue-400">wire</div>
                          <div className="text-slate-300 ml-1">[ADDR_WIDTH:0] wptr_gray, rptr_gray;</div>
                          <div className="text-cyan-400">assign wptr_gray = (wptr {">> 1"}) ^ wptr;</div>
                          <div className="text-cyan-400">assign rptr_gray = (rptr {">> 1"}) ^ rptr;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Debugging Guide */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Zap className="h-5 w-5 text-red-400" />
                    Debugging & Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-300">Common Mistakes</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-slate-300 font-medium">Latch Inference</div>
                            <div className="text-slate-400">Always include else clause in combinational logic</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-slate-300 font-medium">Race Conditions</div>
                            <div className="text-slate-400">Use non-blocking assignments in sequential logic</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-slate-300 font-medium">Metastability</div>
                            <div className="text-slate-400">Synchronize asynchronous inputs properly</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-300">Testbench Best Practices</h4>
                      <div className="bg-slate-800/50 p-3 rounded font-mono text-sm">
                        <div className="text-purple-400">initial begin</div>
                        <div className="text-cyan-400 ml-2">$dumpfile("waveform.vcd");</div>
                        <div className="text-cyan-400 ml-2">$dumpvars(0, testbench);</div>
                        <div className="text-slate-300 ml-2">// Test cases here</div>
                        <div className="text-cyan-400 ml-2">$finish;</div>
                        <div className="text-purple-400">end</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* External Resources */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    External Documentation & Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-300">Language References</h4>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-blue-400 hover:text-blue-300">SystemVerilog LRM IEEE 1800</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Verilog IEEE 1364</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">VHDL IEEE 1076</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">UVM Methodology</a>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-300">FPGA Vendors</h4>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Xilinx Vivado Guide</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Intel Quartus Manual</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Lattice Design Tools</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Microsemi Libero</a>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-300">Online Tools</h4>
                      <div className="space-y-2 text-sm">
                        <a href="#" className="block text-blue-400 hover:text-blue-300">EDA Playground</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Timing Calculator</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">Logic Minimizer</a>
                        <a href="#" className="block text-blue-400 hover:text-blue-300">FSM Generator</a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningPanel;
