import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Play, 
  Layout, 
  Download, 
  BookOpen, 
  Plus, 
  Clock, 
  Code,
  Settings,
  BarChart3,
  FolderOpen,
  Sparkles,
  Home,
  Cpu
} from "lucide-react";
import { listHDLDesigns, HDLDesign } from '../utils/localStorage';

export default function Dashboard() {
  const [recentDesigns, setRecentDesigns] = useState<HDLDesign[]>([]);
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalModules: 0,
    lastUpdated: null as string | null
  });

  useEffect(() => {
    const designs = listHDLDesigns();
    setRecentDesigns(designs.slice(0, 3)); // Show last 3 designs
    setStats({
      totalDesigns: designs.length,
      totalModules: designs.reduce((sum, design) => sum + design.io.length, 0),
      lastUpdated: designs.length > 0 ? designs[0].updatedAt : null
    });
  }, []);

  const quickActions = [
    {
      title: "Create New HDL Module",
      description: "Generate Verilog code with AI assistance",
      icon: <Brain className="h-6 w-6" />,
      link: "/hdl-test",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Open Workspace",
      description: "Full-featured chip design environment",
      icon: <Code className="h-6 w-6" />,
      link: "/workspace",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Run Simulation",
      description: "Test your designs with waveform analysis",
      icon: <Play className="h-6 w-6" />,
      link: "/chipforge-simulation",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Synthesis",
      description: "Convert HDL to gate-level netlist",
      icon: <Layout className="h-6 w-6" />,
      link: "/synthesis",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Place & Route",
      description: "Physical layout and routing tools",
      icon: <Layout className="h-6 w-6" />,
      link: "/place-and-route",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Layout Viewer",
      description: "Interactive 2D chip layout visualization",
      icon: <Layout className="h-6 w-6" />,
      link: "/layout-viewer",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const tools = [
    {
      title: "HDL Editor",
      description: "AI-powered Verilog generation",
      icon: <Brain className="h-5 w-5" />,
      link: "/hdl-test",
      status: "Ready"
    },
    {
      title: "Simulation",
      description: "Waveform analysis and testing",
      icon: <Play className="h-5 w-5" />,
      link: "/chipforge-simulation",
      status: "Ready"
    },
    {
      title: "Synthesis",
      description: "Gate-level netlist generation",
      icon: <Layout className="h-5 w-5" />,
      link: "/synthesis",
      status: "Ready"
    },
    {
      title: "Place & Route",
      description: "Physical layout optimization",
      icon: <Layout className="h-5 w-5" />,
      link: "/place-and-route",
      status: "Ready"
    },
    {
      title: "Layout Viewer",
      description: "Interactive 2D layout visualization",
      icon: <Layout className="h-5 w-5" />,
      link: "/layout-viewer",
      status: "Ready"
    },
    {
      title: "Learning Hub",
      description: "Tutorials and documentation",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/learning-panel",
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/landing" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Cpu className="h-4 w-4 text-slate-900" />
              </div>
              <span className="text-xl font-bold">ChipForge</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Chip Forge Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Complete chip design toolchain with AI assistance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Designs</p>
                  <p className="text-2xl font-bold text-cyan-400">{stats.totalDesigns}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Modules</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalModules}</p>
                </div>
                <Code className="h-8 w-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Last Updated</p>
                  <p className="text-sm font-medium text-slate-200">
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-cyan-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
              >
                <Link to={action.link}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                        {action.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {action.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Designs */}
        {recentDesigns.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-cyan-400" />
              Recent Designs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDesigns.map((design) => (
                <Card key={design.id} className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-200">{design.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {design.io.length} ports
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">
                      {design.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>Updated: {new Date(design.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/hdl-test?load=${design.id}`}>
                          <FolderOpen className="h-3 w-3 mr-1" />
                          Open
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Simulate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tool Chain */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Design Toolchain
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-700">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">{tool.title}</h3>
                        <p className="text-sm text-slate-400">{tool.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                      {tool.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={tool.link}>
                      Open {tool.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Design Workflow */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <Sparkles className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">
                  Complete Design Workflow
                </h3>
                <p className="text-slate-400 mb-4">
                  Follow these steps to create, simulate, synthesize, and visualize your chip design:
                </p>
                <ul className="space-y-2 mb-4">
                  <li><Link to="/workspace" className="text-blue-400 hover:text-blue-300 transition-colors">1. HDL Editor</Link></li>
                  <li><Link to="/chipforge-simulation" className="text-blue-400 hover:text-blue-300 transition-colors">2. Simulate</Link></li>
                  <li><Link to="/synthesis" className="text-blue-400 hover:text-blue-300 transition-colors">3. Synthesis</Link></li>
                  <li><Link to="/place-and-route" className="text-blue-400 hover:text-blue-300 transition-colors">4. Place & Route</Link></li>
                  <li><Link to="/layout-viewer" className="text-blue-400 hover:text-blue-300 transition-colors">5. Layout Viewer</Link></li>
                  <li><Link to="/testbench" className="text-blue-400 hover:text-blue-300 transition-colors">🧪 Testbench Generator</Link></li>
                </ul>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to="/hdl-test">
                      <Brain className="h-4 w-4 mr-2" />
                      Start Design
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/learning-panel">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}