
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  Activity, 
  Cpu, 
  Clock, 
  Download, 
  Users, 
  Zap, 
  Crown,
  ArrowLeft,
  TrendingUp,
  Calendar,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsageDashboard = () => {
  const navigate = useNavigate();

  const usageData = [
    { month: 'Jan', designs: 12, simulations: 45, exports: 8 },
    { month: 'Feb', designs: 19, simulations: 62, exports: 15 },
    { month: 'Mar', designs: 8, simulations: 28, exports: 5 },
    { month: 'Apr', designs: 25, simulations: 89, exports: 22 },
    { month: 'May', designs: 32, simulations: 125, exports: 31 },
    { month: 'Jun', designs: 28, simulations: 98, exports: 26 }
  ];

  const apiUsageData = [
    { date: '06-25', requests: 1200 },
    { date: '06-26', requests: 1800 },
    { date: '06-27', requests: 2100 },
    { date: '06-28', requests: 1650 },
    { date: '06-29', requests: 2300 },
    { date: '06-30', requests: 1900 }
  ];

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
              <Activity className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold">Usage Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Crown className="h-3 w-3 mr-1" />
              Pro Plan
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Designs Created</CardTitle>
              <Cpu className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">124</div>
              <p className="text-xs text-emerald-400">+18% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Simulation Hours</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">347</div>
              <p className="text-xs text-emerald-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Export Events</CardTitle>
              <Download className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">97</div>
              <p className="text-xs text-emerald-400">+24% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">API Calls</CardTitle>
              <Database className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">12.4K</div>
              <p className="text-xs text-emerald-400">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-slate-700">API Usage</TabsTrigger>
            <TabsTrigger value="plan" className="data-[state=active]:bg-slate-700">Plan Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Usage Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Monthly Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Designs, simulations, and exports over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="designs" fill="#06b6d4" />
                      <Bar dataKey="simulations" fill="#3b82f6" />
                      <Bar dataKey="exports" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    Daily API Usage
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    API requests over the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={apiUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">API Quota Usage</CardTitle>
                  <CardDescription className="text-slate-400">
                    Current month usage vs limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Synthesis API</span>
                      <span className="text-slate-400">1,240 / 5,000</span>
                    </div>
                    <Progress value={24.8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Simulation API</span>
                      <span className="text-slate-400">847 / 2,000</span>
                    </div>
                    <Progress value={42.35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Export API</span>
                      <span className="text-slate-400">234 / 1,000</span>
                    </div>
                    <Progress value={23.4} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Rate Limits</CardTitle>
                  <CardDescription className="text-slate-400">
                    Current rate limit status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Requests per minute</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      45 / 100
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Concurrent simulations</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      3 / 10
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Export queue</span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      1 / 5
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Crown className="h-5 w-5 text-emerald-400" />
                    Current Plan: Pro
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Active since March 2024
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-100">$49</div>
                      <div className="text-sm text-slate-400">per month</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-100">Unlimited</div>
                      <div className="text-sm text-slate-400">designs</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      Priority simulation queue
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Users className="h-4 w-4 text-emerald-400" />
                      Team collaboration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Download className="h-4 w-4 text-emerald-400" />
                      Advanced export formats
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Plan Comparison</CardTitle>
                  <CardDescription className="text-slate-400">
                    See what's included in each plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-slate-700 rounded-lg p-4">
                      <div className="font-semibold text-slate-200 mb-2">Free Plan</div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <div>• 5 designs per month</div>
                        <div>• 10 simulation hours</div>
                        <div>• Basic export formats</div>
                      </div>
                    </div>
                    <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-4">
                      <div className="font-semibold text-emerald-400 mb-2">Pro Plan (Current)</div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <div>• Unlimited designs</div>
                        <div>• 500 simulation hours</div>
                        <div>• All export formats</div>
                        <div>• Team collaboration</div>
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

export default UsageDashboard;
