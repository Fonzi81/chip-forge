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
  Cpu,
  Box,
  TestTube,
  Layers
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";

export default function Dashboard() {
  const quickActions = [
    {
      title: "Advanced Chip Design",
      description: "Complete chip design flow with synthesis and P&R",
      icon: <Cpu className="h-6 w-6" />,
      link: "/advanced-chip-design",
      color: "from-green-700 to-blue-700"
    },
    {
      title: "Advanced Layout Designer",
      description: "Interactive layout design with 3D visualization",
      icon: <Layers className="h-6 w-6" />,
      link: "/advanced-layout-designer",
      color: "from-purple-700 to-indigo-700"
    },
    {
      title: "HDL Generator",
      description: "AI-powered Verilog generation with reflexion",
      icon: <Brain className="h-6 w-6" />,
      link: "/hdl-generator",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Test Native Simulator",
      description: "Test Phase 1 implementation of native Verilog simulation",
      icon: <TestTube className="h-6 w-6" />,
      link: "/test-native-simulator",
      color: "from-purple-700 to-pink-700"
    },
    {
      title: "3D Chip Viewer",
      description: "Interactive 3D chip layout visualization",
      icon: <Box className="h-6 w-6" />,
      link: "/chip3d-viewer",
      color: "from-cyan-700 to-blue-700"
    }
  ];

  const tools = [
    {
      title: "Advanced Chip Design",
      description: "Complete chip design flow with synthesis and P&R",
      icon: <Cpu className="h-5 w-5" />,
      link: "/advanced-chip-design",
      status: "Ready"
    },
    {
      title: "Advanced Layout Designer",
      description: "Interactive layout design with 3D visualization",
      icon: <Layers className="h-5 w-5" />,
      link: "/advanced-layout-designer",
      status: "Ready"
    },
    {
      title: "HDL Generator",
      description: "AI-powered Verilog generation with reflexion",
      icon: <Brain className="h-5 w-5" />,
      link: "/hdl-generator",
      status: "Ready"
    },
    {
      title: "Test Native Simulator",
      description: "Native Verilog simulation engine",
      icon: <TestTube className="h-5 w-5" />,
      link: "/test-native-simulator",
      status: "Beta"
    },
    {
      title: "3D Chip Viewer",
      description: "Interactive 3D chip layout visualization",
      icon: <Box className="h-5 w-5" />,
      link: "/chip3d-viewer",
      status: "Beta"
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
    <>
      <TopNav />
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
                    <p className="text-sm text-slate-400">Active Projects</p>
                    <p className="text-2xl font-bold text-emerald-400">5</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">AI Models</p>
                    <p className="text-2xl font-bold text-blue-400">3</p>
                  </div>
                  <Brain className="h-8 w-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Last Updated</p>
                    <p className="text-sm font-medium text-slate-200">
                      {new Date().toLocaleDateString()}
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
                    <li><Link to="/hdl-generator" className="text-blue-400 hover:text-blue-300 transition-colors">1. HDL Generation</Link></li>
                    <li><Link to="/test-native-simulator" className="text-blue-400 hover:text-blue-300 transition-colors">2. Simulation</Link></li>
                    <li><Link to="/advanced-chip-design" className="text-blue-400 hover:text-blue-300 transition-colors">3. Synthesis & P&R</Link></li>
                    <li><Link to="/advanced-layout-designer" className="text-blue-400 hover:text-blue-300 transition-colors">4. Layout Design</Link></li>
                    <li><Link to="/chip3d-viewer" className="text-blue-400 hover:text-blue-300 transition-colors">5. 3D Visualization</Link></li>
                    <li><Link to="/export" className="text-blue-400 hover:text-blue-300 transition-colors">6. Export & Fabrication</Link></li>
                  </ul>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to="/hdl-generator">
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
    </>
  );
}