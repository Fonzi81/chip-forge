import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Grid3X3, 
  Play, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Code,
  Settings,
  Activity,
  ArrowRight,
  Sparkles,
  Target,
  Gauge,
  Layers,
  FileText,
  Database,
  Map,
  Ruler,
  Compass
} from "lucide-react";
import { loadDesign } from '../utils/localStorage';
// @ts-expect-error: performPlaceAndRoute module may not have type declarations
import { performPlaceAndRoute } from '../backend/place-route/placeAndRoute';
import LayoutViewer from "../components/chipforge/LayoutViewer";

interface PlaceRouteResult {
  layout: string;
  statistics: PlaceRouteStats;
  timing: TimingAnalysis;
  congestion: CongestionAnalysis;
  power: PowerAnalysis;
  warnings: string[];
  errors: string[];
}

interface PlaceRouteStats {
  totalCells: number;
  placedCells: number;
  routedNets: number;
  totalWirelength: number;
  maxFrequency: number;
  placementTime: number;
  routingTime: number;
}

interface TimingAnalysis {
  setupViolations: number;
  holdViolations: number;
  maxDelay: number;
  minDelay: number;
  slack: number;
  clockPeriod: number;
}

interface CongestionAnalysis {
  totalTracks: number;
  usedTracks: number;
  congestionRatio: number;
  hotSpots: number;
  overflowTracks: number;
}

interface PowerAnalysis {
  totalPower: number;
  dynamicPower: number;
  staticPower: number;
  switchingPower: number;
  leakagePower: number;
}

export default function PlaceAndRoute() {
  const [netlist, setNetlist] = useState('');
  const [placeRouteResult, setPlaceRouteResult] = useState<PlaceRouteResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'placing' | 'routing' | 'done' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('overview');
  const [placeRouteOptions, setPlaceRouteOptions] = useState({
    targetFrequency: 100,
    optimizationMode: 'balanced',
    routingLayers: 6,
    enableTiming: true,
    enablePower: true,
    congestionAware: true
  });

  useEffect(() => {
    loadActiveNetlist();
  }, []);

  const loadActiveNetlist = () => {
    setStatus('loading');
    try {
      const net = loadDesign('netlist-active');
      if (net) {
        setNetlist(net);
        setStatus('idle');
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('Failed to load netlist:', error);
      setStatus('idle');
    }
  };

  const handlePlaceRoute = async () => {
    if (!netlist.trim()) return;
    
    setStatus('placing');
    
    try {
      // Simulate placement processing time
      const placementTime = Math.min(3000 + netlist.length * 2, 8000);
      await new Promise(resolve => setTimeout(resolve, placementTime));
      
      setStatus('routing');
      
      // Simulate routing processing time
      const routingTime = Math.min(4000 + netlist.length * 3, 10000);
      await new Promise(resolve => setTimeout(resolve, routingTime));
      
      const result = await performPlaceAndRoute(netlist, placeRouteOptions);
      
      // Generate comprehensive place & route results
      const fullResult: PlaceRouteResult = {
        layout: result,
        statistics: generatePlaceRouteStats(netlist),
        timing: generateTimingAnalysis(netlist),
        congestion: generateCongestionAnalysis(netlist),
        power: generatePowerAnalysis(netlist),
        warnings: generateWarnings(netlist),
        errors: []
      };
      
      setPlaceRouteResult(fullResult);
      setStatus('done');
    } catch (error) {
      console.error('Place & Route failed:', error);
      setStatus('error');
      setPlaceRouteResult({
        layout: '',
        statistics: generatePlaceRouteStats(''),
        timing: generateTimingAnalysis(''),
        congestion: generateCongestionAnalysis(''),
        power: generatePowerAnalysis(''),
        warnings: [],
        errors: ['Place & Route failed. Please check your netlist.']
      });
    }
  };

  const generatePlaceRouteStats = (netlist: string): PlaceRouteStats => {
    const lines = netlist.split('\n').length;
    const complexity = Math.min(lines / 30, 1);
    
    return {
      totalCells: Math.floor(50 + Math.random() * 450 * complexity),
      placedCells: Math.floor(45 + Math.random() * 405 * complexity),
      routedNets: Math.floor(100 + Math.random() * 900 * complexity),
      totalWirelength: Math.floor(1000 + Math.random() * 9000 * complexity),
      maxFrequency: Math.floor(50 + Math.random() * 450),
      placementTime: Math.floor(1000 + Math.random() * 4000),
      routingTime: Math.floor(2000 + Math.random() * 6000)
    };
  };

  const generateTimingAnalysis = (netlist: string): TimingAnalysis => {
    const complexity = netlist.split('\n').length / 40;
    
    return {
      setupViolations: Math.floor(Math.random() * 2),
      holdViolations: Math.floor(Math.random() * 1),
      maxDelay: Math.floor(8 + Math.random() * 12),
      minDelay: Math.floor(1 + Math.random() * 3),
      slack: Math.floor(-1 + Math.random() * 6),
      clockPeriod: Math.floor(8 + Math.random() * 12)
    };
  };

  const generateCongestionAnalysis = (netlist: string): CongestionAnalysis => {
    const complexity = netlist.split('\n').length / 35;
    
    return {
      totalTracks: Math.floor(1000 + Math.random() * 2000),
      usedTracks: Math.floor(800 + Math.random() * 1200 * complexity),
      congestionRatio: Math.min(85 + Math.random() * 15, 100),
      hotSpots: Math.floor(Math.random() * 5),
      overflowTracks: Math.floor(Math.random() * 10)
    };
  };

  const generatePowerAnalysis = (netlist: string): PowerAnalysis => {
    const complexity = netlist.split('\n').length / 45;
    
    return {
      totalPower: Math.floor(15 + Math.random() * 85 * complexity),
      dynamicPower: Math.floor(12 + Math.random() * 68 * complexity),
      staticPower: Math.floor(3 + Math.random() * 17 * complexity),
      switchingPower: Math.floor(9 + Math.random() * 51 * complexity),
      leakagePower: Math.floor(1 + Math.random() * 9 * complexity)
    };
  };

  const generateWarnings = (netlist: string): string[] => {
    const warnings = [];
    if (netlist.includes('wire')) {
      warnings.push('Long wire detected - consider buffering');
    }
    if (netlist.length > 2000) {
      warnings.push('Large design detected - routing may be congested');
    }
    if (Math.random() > 0.7) {
      warnings.push('Timing constraints may be tight');
    }
    return warnings;
  };

  const exportLayout = () => {
    if (!placeRouteResult?.layout) return;
    
    const blob = new Blob([placeRouteResult.layout], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chip_layout.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportReport = () => {
    if (!placeRouteResult) return;
    
    const report = `Place & Route Report
====================

Statistics:
- Total Cells: ${placeRouteResult.statistics.totalCells}
- Placed Cells: ${placeRouteResult.statistics.placedCells}
- Routed Nets: ${placeRouteResult.statistics.routedNets}
- Total Wirelength: ${placeRouteResult.statistics.totalWirelength} μm
- Max Frequency: ${placeRouteResult.statistics.maxFrequency} MHz

Timing Analysis:
- Setup Violations: ${placeRouteResult.timing.setupViolations}
- Hold Violations: ${placeRouteResult.timing.holdViolations}
- Slack: ${placeRouteResult.timing.slack} ns

Congestion Analysis:
- Total Tracks: ${placeRouteResult.congestion.totalTracks}
- Used Tracks: ${placeRouteResult.congestion.usedTracks}
- Congestion Ratio: ${placeRouteResult.congestion.congestionRatio}%
- Hot Spots: ${placeRouteResult.congestion.hotSpots}

Power Analysis:
- Total Power: ${placeRouteResult.power.totalPower} mW
- Dynamic Power: ${placeRouteResult.power.dynamicPower} mW
- Static Power: ${placeRouteResult.power.staticPower} mW

Warnings:
${placeRouteResult.warnings.map(w => `- ${w}`).join('\n')}
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'place_route_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderLayoutVisualization = () => {
    if (!placeRouteResult?.layout) return null;
    
    // Generate a simple ASCII layout visualization
    const layout = placeRouteResult.layout;
    const lines = layout.split('\n').slice(0, 20); // Limit to first 20 lines
    
    return (
      <div className="bg-slate-900 rounded p-4 overflow-auto max-h-96">
        <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap">
          {lines.join('\n')}
        </pre>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'placing': return 'text-blue-400';
      case 'routing': return 'text-purple-400';
      case 'loading': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'placing': return <Grid3X3 className="h-4 w-4" />;
      case 'routing': return <Map className="h-4 w-4" />;
      case 'loading': return <Clock className="h-4 w-4" />;
      default: return <Grid3X3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Place & Route Engine
            </h1>
            <p className="text-slate-400 mt-2">
              Transform netlists into physical chip layouts with automated placement and routing
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-indigo-400 border-indigo-400">
              <Grid3X3 className="h-3 w-3 mr-1" />
              Physical Design
            </Badge>
            {netlist && (
              <Badge variant="secondary">
                Netlist Loaded
              </Badge>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={getStatusColor(status)}>
                  {getStatusIcon(status)}
                </div>
                <div>
                  <div className="font-medium text-slate-200">
                    {status === 'idle' && 'Ready to place & route'}
                    {status === 'loading' && 'Loading netlist...'}
                    {status === 'placing' && 'Placing cells...'}
                    {status === 'routing' && 'Routing nets...'}
                    {status === 'done' && 'Place & Route completed! ✅'}
                    {status === 'error' && 'Place & Route failed - Review errors'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {placeRouteResult && `Total time: ${placeRouteResult.statistics.placementTime + placeRouteResult.statistics.routingTime}ms`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePlaceRoute}
                  disabled={!netlist.trim() || status === 'placing' || status === 'routing'}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Place & Route
                </Button>
                {placeRouteResult && (
                  <>
                    <Button variant="outline" size="sm" onClick={exportLayout}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Layout
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportReport}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </>
                )}
              </div>
            </div>
            {(status === 'placing' || status === 'routing') && (
              <Progress value={75} className="mt-3" />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Netlist */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-400" />
                  Input Netlist
                </CardTitle>
                <CardDescription>
                  Synthesized netlist for placement and routing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {netlist ? (
                  <div className="bg-slate-900 rounded p-4 overflow-auto max-h-96">
                    <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap">
                      {netlist}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No netlist loaded</p>
                    <p className="text-sm">Run synthesis first to generate netlist</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="layout" className="data-[state=active]:bg-slate-700">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="timing" className="data-[state=active]:bg-slate-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Timing
                </TabsTrigger>
                <TabsTrigger value="congestion" className="data-[state=active]:bg-slate-700">
                  <Map className="h-4 w-4 mr-2" />
                  Congestion
                </TabsTrigger>
                <TabsTrigger value="power" className="data-[state=active]:bg-slate-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Power
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-400" />
                      Place & Route Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {placeRouteResult ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-emerald-400">
                            {placeRouteResult.statistics.placedCells}
                          </div>
                          <div className="text-sm text-slate-400">Placed Cells</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-blue-400">
                            {placeRouteResult.statistics.routedNets}
                          </div>
                          <div className="text-sm text-slate-400">Routed Nets</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-purple-400">
                            {placeRouteResult.statistics.totalWirelength}μm
                          </div>
                          <div className="text-sm text-slate-400">Wirelength</div>
                        </div>
                        <div className="text-center p-4 bg-slate-700 rounded">
                          <div className="text-2xl font-bold text-pink-400">
                            {placeRouteResult.power.totalPower}mW
                          </div>
                          <div className="text-sm text-slate-400">Total Power</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No place & route data available</p>
                        <p className="text-sm">Run place & route to see overview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3X3 className="h-5 w-5 text-indigo-400" />
                      Chip Layout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {placeRouteResult?.layout ? (
                      <LayoutViewer layoutString={placeRouteResult.layout} />
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No layout available</p>
                        <p className="text-sm">Run place & route to generate layout</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timing" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-400" />
                      Timing Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {placeRouteResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-blue-400">
                              {placeRouteResult.timing.maxDelay}ns
                            </div>
                            <div className="text-sm text-slate-400">Max Delay</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-green-400">
                              {placeRouteResult.timing.slack}ns
                            </div>
                            <div className="text-sm text-slate-400">Slack</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-yellow-400">
                              {placeRouteResult.timing.setupViolations}
                            </div>
                            <div className="text-sm text-slate-400">Setup Violations</div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900 rounded p-4">
                          <h4 className="font-medium text-slate-200 mb-2">Timing Summary:</h4>
                          <ul className="space-y-1 text-sm text-slate-300">
                            <li>• Clock Period: {placeRouteResult.timing.clockPeriod}ns</li>
                            <li>• Hold Violations: {placeRouteResult.timing.holdViolations}</li>
                            <li>• Min Delay: {placeRouteResult.timing.minDelay}ns</li>
                            <li>• Max Frequency: {placeRouteResult.statistics.maxFrequency}MHz</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No timing data available</p>
                        <p className="text-sm">Run place & route to see timing analysis</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="congestion" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-indigo-400" />
                      Congestion Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {placeRouteResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-emerald-400">
                              {placeRouteResult.congestion.totalTracks}
                            </div>
                            <div className="text-sm text-slate-400">Total Tracks</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-blue-400">
                              {placeRouteResult.congestion.usedTracks}
                            </div>
                            <div className="text-sm text-slate-400">Used Tracks</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-purple-400">
                              {placeRouteResult.congestion.congestionRatio}%
                            </div>
                            <div className="text-sm text-slate-400">Congestion</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-pink-400">
                              {placeRouteResult.congestion.hotSpots}
                            </div>
                            <div className="text-sm text-slate-400">Hot Spots</div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900 rounded p-4">
                          <h4 className="font-medium text-slate-200 mb-2">Congestion Details:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-300">Track Utilization:</span>
                              <span className="text-slate-200">{Math.round(placeRouteResult.congestion.usedTracks / placeRouteResult.congestion.totalTracks * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Overflow Tracks:</span>
                              <span className="text-slate-200">{placeRouteResult.congestion.overflowTracks}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Congestion Status:</span>
                              <span className={`${placeRouteResult.congestion.congestionRatio > 90 ? 'text-red-400' : placeRouteResult.congestion.congestionRatio > 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {placeRouteResult.congestion.congestionRatio > 90 ? 'High' : placeRouteResult.congestion.congestionRatio > 80 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No congestion data available</p>
                        <p className="text-sm">Run place & route to see congestion analysis</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="power" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-indigo-400" />
                      Power Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {placeRouteResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-yellow-400">
                              {placeRouteResult.power.totalPower}mW
                            </div>
                            <div className="text-sm text-slate-400">Total Power</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-blue-400">
                              {placeRouteResult.power.dynamicPower}mW
                            </div>
                            <div className="text-sm text-slate-400">Dynamic</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-purple-400">
                              {placeRouteResult.power.staticPower}mW
                            </div>
                            <div className="text-sm text-slate-400">Static</div>
                          </div>
                          <div className="text-center p-4 bg-slate-700 rounded">
                            <div className="text-xl font-bold text-green-400">
                              {placeRouteResult.power.switchingPower}mW
                            </div>
                            <div className="text-sm text-slate-400">Switching</div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-900 rounded p-4">
                          <h4 className="font-medium text-slate-200 mb-2">Power Breakdown:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-300">Dynamic Power:</span>
                              <span className="text-slate-200">{Math.round(placeRouteResult.power.dynamicPower / placeRouteResult.power.totalPower * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Static Power:</span>
                              <span className="text-slate-200">{Math.round(placeRouteResult.power.staticPower / placeRouteResult.power.totalPower * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Leakage Power:</span>
                              <span className="text-slate-200">{placeRouteResult.power.leakagePower}mW</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No power data available</p>
                        <p className="text-sm">Run place & route to see power analysis</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 