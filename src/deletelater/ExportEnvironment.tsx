import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Play, 
  Pause, 
  RotateCw, 
  BarChart3, 
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Eye,
  Code,
  FileText,
  Upload,
  Settings,
  Maximize,
  Minimize,
  Grid,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Save,
  MessageSquare,
  Lightbulb,
  Sparkles,
  GitBranch,
  History,
  RefreshCw,
  StopCircle,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  Filter,
  Search,
  Info,
  HelpCircle,
  Cpu,
  Thermometer,
  Gauge,
  Shield,
  Package,
  Globe,
  MousePointer,
  Move,
  RotateCw as RotateCwIcon,
  ZoomIn,
  ZoomOut,
  BookOpen,
  Cross,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Star,
  Heart,
  Diamond,
  Minus,
  X,
  Check,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  DollarSign,
  Truck,
  Factory,
  FileCheck,
  FileX,
  FileSearch,
  FilePlus,
  FileMinus,
  FileEdit,
  FileArchive,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileJson
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";

// Export data structures
interface TapeoutPackage {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'preparing' | 'ready' | 'submitted' | 'approved' | 'rejected';
  files: TapeoutFile[];
  metadata: TapeoutMetadata;
  cost: CostAnalysis;
  timeline: Timeline;
  foundry: FoundryInfo;
}

interface TapeoutFile {
  id: string;
  name: string;
  type: 'gdsii' | 'lef' | 'def' | 'verilog' | 'spice' | 'documentation' | 'constraints';
  size: number;
  checksum: string;
  status: 'generated' | 'validated' | 'approved' | 'rejected';
  path: string;
  description: string;
}

interface TapeoutMetadata {
  technology: string;
  designName: string;
  designer: string;
  company: string;
  project: string;
  revision: string;
  date: string;
  dieSize: { width: number; height: number };
  layers: number;
  transistors: number;
  gates: number;
  memory: number;
  io: number;
  power: number;
  area: number;
}

interface CostAnalysis {
  totalCost: number;
  maskCost: number;
  waferCost: number;
  packagingCost: number;
  testingCost: number;
  engineeringCost: number;
  currency: string;
  breakdown: CostBreakdown[];
}

interface CostBreakdown {
  category: string;
  cost: number;
  percentage: number;
  description: string;
}

interface Timeline {
  designComplete: string;
  tapeoutDate: string;
  maskFabrication: string;
  waferFabrication: string;
  packaging: string;
  testing: string;
  delivery: string;
  status: 'on_track' | 'delayed' | 'ahead';
}

interface FoundryInfo {
  name: string;
  technology: string;
  node: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  requirements: FoundryRequirement[];
}

interface FoundryRequirement {
  id: string;
  name: string;
  description: string;
  type: 'file' | 'format' | 'specification' | 'documentation';
  required: boolean;
  status: 'met' | 'missing' | 'pending';
  validation: string;
}

interface Documentation {
  id: string;
  name: string;
  type: 'datasheet' | 'user_guide' | 'technical_spec' | 'test_report' | 'compliance';
  status: 'draft' | 'review' | 'approved' | 'published';
  content: string;
  author: string;
  date: string;
  version: string;
}

export default function ExportEnvironment() {
  const [tapeoutPackage, setTapeoutPackage] = useState<TapeoutPackage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<TapeoutFile | null>(null);
  const [activeTab, setActiveTab] = useState('files');

  // Foundry options
  const foundries = [
    {
      name: 'TSMC',
      technology: 'TSMC 7nm',
      node: '7nm',
      contact: 'Dr. John Smith',
      email: 'tapeout@tsmc.com',
      phone: '+886-3-563-6688',
      address: 'Hsinchu Science Park, Taiwan'
    },
    {
      name: 'Samsung Foundry',
      technology: 'Samsung 5nm',
      node: '5nm',
      contact: 'Dr. Kim Lee',
      email: 'tapeout@samsung.com',
      phone: '+82-2-2255-0114',
      address: 'Giheung-gu, Yongin-si, South Korea'
    },
    {
      name: 'Intel Foundry',
      technology: 'Intel 7',
      node: '7nm',
      contact: 'Dr. Sarah Johnson',
      email: 'tapeout@intel.com',
      phone: '+1-408-765-8080',
      address: 'Santa Clara, CA, USA'
    }
  ];

  // Generate tapeout package
  const generateTapeoutPackage = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation steps
    const steps = [
      'Validating design files...',
      'Generating GDSII...',
      'Creating LEF/DEF files...',
      'Running final DRC/LVS...',
      'Preparing documentation...',
      'Calculating costs...',
      'Creating tapeout package...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }
    
    // Create tapeout package
    const tapeoutPackage: TapeoutPackage = {
      id: 'tapeout_001',
      name: 'ChipForge_Processor_v1.0',
      version: '1.0.0',
      description: 'Advanced processor design for AI applications',
      status: 'ready',
      files: [
        {
          id: 'file_1',
          name: 'design.gds',
          type: 'gdsii',
          size: 1567890,
          checksum: 'a1b2c3d4e5f6...',
          status: 'validated',
          path: '/exports/design.gds',
          description: 'Main GDSII layout file'
        },
        {
          id: 'file_2',
          name: 'design.lef',
          type: 'lef',
          size: 234567,
          checksum: 'b2c3d4e5f6a1...',
          status: 'validated',
          path: '/exports/design.lef',
          description: 'Library Exchange Format file'
        },
        {
          id: 'file_3',
          name: 'design.def',
          type: 'def',
          size: 345678,
          checksum: 'c3d4e5f6a1b2...',
          status: 'validated',
          path: '/exports/design.def',
          description: 'Design Exchange Format file'
        },
        {
          id: 'file_4',
          name: 'design.v',
          type: 'verilog',
          size: 456789,
          checksum: 'd4e5f6a1b2c3...',
          status: 'validated',
          path: '/exports/design.v',
          description: 'Verilog netlist'
        },
        {
          id: 'file_5',
          name: 'constraints.sdc',
          type: 'constraints',
          size: 12345,
          checksum: 'e5f6a1b2c3d4...',
          status: 'validated',
          path: '/exports/constraints.sdc',
          description: 'Timing constraints'
        }
      ],
      metadata: {
        technology: 'TSMC 7nm',
        designName: 'ChipForge_Processor',
        designer: 'ChipForge Team',
        company: 'ChipForge Inc.',
        project: 'AI Processor v1.0',
        revision: '1.0',
        date: new Date().toISOString(),
        dieSize: { width: 5.0, height: 5.0 },
        layers: 12,
        transistors: 2500000,
        gates: 500000,
        memory: 1024,
        io: 256,
        power: 7.5,
        area: 25.0
      },
      cost: {
        totalCost: 1250000,
        maskCost: 800000,
        waferCost: 300000,
        packagingCost: 80000,
        testingCost: 40000,
        engineeringCost: 30000,
        currency: 'USD',
        breakdown: [
          {
            category: 'Mask Set',
            cost: 800000,
            percentage: 64,
            description: 'Photomask fabrication for all layers'
          },
          {
            category: 'Wafer Processing',
            cost: 300000,
            percentage: 24,
            description: 'Silicon wafer fabrication and processing'
          },
          {
            category: 'Packaging',
            cost: 80000,
            percentage: 6.4,
            description: 'Die packaging and assembly'
          },
          {
            category: 'Testing',
            cost: 40000,
            percentage: 3.2,
            description: 'Wafer and package testing'
          },
          {
            category: 'Engineering',
            cost: 30000,
            percentage: 2.4,
            description: 'Engineering support and validation'
          }
        ]
      },
      timeline: {
        designComplete: '2024-01-15',
        tapeoutDate: '2024-01-20',
        maskFabrication: '2024-02-15',
        waferFabrication: '2024-03-15',
        packaging: '2024-04-15',
        testing: '2024-04-30',
        delivery: '2024-05-15',
        status: 'on_track'
      },
      foundry: {
        name: 'TSMC',
        technology: 'TSMC 7nm',
        node: '7nm',
        contact: 'Dr. John Smith',
        email: 'tapeout@tsmc.com',
        phone: '+886-3-563-6688',
        address: 'Hsinchu Science Park, Taiwan',
        requirements: [
          {
            id: 'req_1',
            name: 'GDSII File',
            description: 'Main layout file in GDSII format',
            type: 'file',
            required: true,
            status: 'met',
            validation: 'File format verified, DRC clean'
          },
          {
            id: 'req_2',
            name: 'LEF File',
            description: 'Library Exchange Format file',
            type: 'file',
            required: true,
            status: 'met',
            validation: 'File format verified'
          },
          {
            id: 'req_3',
            name: 'Design Rules',
            description: 'Compliance with TSMC 7nm design rules',
            type: 'specification',
            required: true,
            status: 'met',
            validation: 'All DRC rules passed'
          }
        ]
      }
    };
    
    setTapeoutPackage(tapeoutPackage);
    setIsGenerating(false);
  };

  // Submit to foundry
  const submitToFoundry = async () => {
    if (!tapeoutPackage) return;
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTapeoutPackage(prev => prev ? { ...prev, status: 'submitted' } : null);
  };

  // Export package
  const exportPackage = () => {
    if (!tapeoutPackage) return;
    
    const data = {
      tapeoutPackage,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tapeoutPackage.name}_tapeout_package.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="flex h-screen">
          {/* Main Export Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="bg-slate-800 border-b border-slate-700 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={generateTapeoutPackage}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Generate Package
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={submitToFoundry}
                    disabled={!tapeoutPackage || tapeoutPackage.status !== 'ready'}
                  >
                    <Factory className="h-4 w-4 mr-2" />
                    Submit to Foundry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportPackage}
                    disabled={!tapeoutPackage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Package
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {isGenerating && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                      {Math.round(generationProgress)}%
                    </Badge>
                  )}
                  {tapeoutPackage && (
                    <Badge variant={tapeoutPackage.status === 'ready' ? 'default' : 'secondary'}>
                      {tapeoutPackage.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Export Content */}
            <div className="flex-1 p-4">
              {!tapeoutPackage ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold mb-2">Tapeout Export</h3>
                    <p className="text-slate-400 mb-4">
                      Prepare design for silicon fabrication
                    </p>
                    <Button onClick={generateTapeoutPackage} disabled={isGenerating}>
                      <Package className="h-4 w-4 mr-2" />
                      Generate Tapeout Package
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="cost">Cost</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="foundry">Foundry</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="files" className="flex-1">
                    <Card className="h-full bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle>Tapeout Files</CardTitle>
                        <CardDescription>
                          {tapeoutPackage.files.length} files ready for submission
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-full">
                        <ScrollArea className="h-full">
                          <div className="space-y-2">
                            {tapeoutPackage.files.map((file) => (
                              <Card 
                                key={file.id} 
                                className="bg-slate-700 border-slate-600 cursor-pointer hover:bg-slate-600"
                                onClick={() => setSelectedFile(file)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <FileText className="h-5 w-5" />
                                      <div>
                                        <div className="font-medium">{file.name}</div>
                                        <div className="text-sm text-slate-400">{file.description}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                                      <Badge variant={file.status === 'validated' ? 'default' : 'secondary'}>
                                        {file.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-xs text-slate-400">
                                    Size: {(file.size / 1024).toFixed(1)} KB | Checksum: {file.checksum}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="cost" className="flex-1">
                    <Card className="h-full bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle>Cost Analysis</CardTitle>
                        <CardDescription>
                          Total: {tapeoutPackage.cost.currency} {tapeoutPackage.cost.totalCost.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div className="grid grid-cols-2 gap-4 h-full">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Cost Breakdown</h4>
                            <div className="space-y-2">
                              {tapeoutPackage.cost.breakdown.map((item) => (
                                <div key={item.category} className="p-3 bg-slate-700 rounded border border-slate-600">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium">{item.category}</div>
                                    <div className="font-bold">
                                      {tapeoutPackage.cost.currency} {item.cost.toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="text-sm text-slate-400">{item.description}</div>
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                      <span>Percentage</span>
                                      <span>{item.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                      <div 
                                        className="bg-cyan-400 h-2 rounded-full" 
                                        style={{ width: `${item.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-semibold">Cost Summary</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-slate-700 rounded">
                                <span>Total Cost</span>
                                <span className="font-bold">
                                  {tapeoutPackage.cost.currency} {tapeoutPackage.cost.totalCost.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between p-2 bg-slate-700 rounded">
                                <span>Mask Cost</span>
                                <span>{tapeoutPackage.cost.currency} {tapeoutPackage.cost.maskCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-slate-700 rounded">
                                <span>Wafer Cost</span>
                                <span>{tapeoutPackage.cost.currency} {tapeoutPackage.cost.waferCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-slate-700 rounded">
                                <span>Packaging Cost</span>
                                <span>{tapeoutPackage.cost.currency} {tapeoutPackage.cost.packagingCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-slate-700 rounded">
                                <span>Testing Cost</span>
                                <span>{tapeoutPackage.cost.currency} {tapeoutPackage.cost.testingCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-slate-700 rounded">
                                <span>Engineering Cost</span>
                                <span>{tapeoutPackage.cost.currency} {tapeoutPackage.cost.engineeringCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="flex-1">
                    <Card className="h-full bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle>Project Timeline</CardTitle>
                        <CardDescription>
                          Status: {tapeoutPackage.timeline.status.replace('_', ' ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(tapeoutPackage.timeline).map(([key, value]) => {
                              if (key === 'status') return null;
                              return (
                                <div key={key} className="p-3 bg-slate-700 rounded border border-slate-600">
                                  <div className="text-sm font-medium capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                  <div className="text-sm text-slate-400">{value}</div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">Timeline Visualization</h4>
                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-600"></div>
                              {Object.entries(tapeoutPackage.timeline).map(([key, value], index) => {
                                if (key === 'status') return null;
                                return (
                                  <div key={key} className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center mr-4 z-10">
                                      <Check className="h-4 w-4 text-slate-900" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </div>
                                      <div className="text-sm text-slate-400">{value}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="foundry" className="flex-1">
                    <Card className="h-full bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle>Foundry Information</CardTitle>
                        <CardDescription>
                          {tapeoutPackage.foundry.name} - {tapeoutPackage.foundry.technology}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div className="grid grid-cols-2 gap-4 h-full">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Foundry Details</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium">Name</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.name}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Technology</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.technology}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Node</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.node}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Contact</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.contact}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Email</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.email}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Phone</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.phone}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Address</div>
                                <div className="text-sm text-slate-400">{tapeoutPackage.foundry.address}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-semibold">Requirements</h4>
                            <ScrollArea className="h-64">
                              <div className="space-y-2">
                                {tapeoutPackage.foundry.requirements.map((req) => (
                                  <div key={req.id} className="p-3 bg-slate-700 rounded border border-slate-600">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="font-medium">{req.name}</div>
                                      <Badge variant={req.status === 'met' ? 'default' : 'destructive'}>
                                        {req.status}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-slate-400 mb-2">{req.description}</div>
                                    <div className="text-xs text-cyan-400">{req.validation}</div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>

          {/* Right Sidebar - File Details */}
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold">File Details</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {selectedFile ? (
                <div className="space-y-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{selectedFile.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400">Type</label>
                        <div className="text-sm font-medium">{selectedFile.type.toUpperCase()}</div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Size</label>
                        <div className="text-sm font-medium">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Status</label>
                        <div className="text-sm font-medium">{selectedFile.status}</div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Checksum</label>
                        <div className="text-sm font-mono text-slate-400">{selectedFile.checksum}</div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Description</label>
                        <div className="text-sm text-slate-400">{selectedFile.description}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a file to view details</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
} 