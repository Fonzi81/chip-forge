
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Building, GraduationCap, DollarSign, BarChart3 } from "lucide-react";

const MarketOpportunity = () => {
  const marketSegments = [
    { segment: "Enterprise R&D", value: 45, amount: "$7.9B", icon: Building, color: "cyan-400", description: "Corporate semiconductor teams" },
    { segment: "Government/Defense", value: 25, amount: "$4.4B", icon: Users, color: "blue-400", description: "National security applications" },
    { segment: "Academic Research", value: 20, amount: "$3.5B", icon: GraduationCap, color: "emerald-400", description: "Universities and institutes" },
    { segment: "Emerging Markets", value: 10, amount: "$1.7B", icon: TrendingUp, color: "amber-400", description: "Startups and new entrants" }
  ];

  const marketDrivers = [
    {
      title: "AI Acceleration Demand",
      metric: "34% CAGR",
      description: "Custom silicon for AI workloads driving chip design automation needs",
      color: "cyan-400"
    },
    {
      title: "Supply Chain Sovereignty",
      metric: "$52B Investment",
      description: "Government initiatives for domestic semiconductor capabilities",
      color: "blue-400"
    },
    {
      title: "Design Complexity Growth",
      metric: "8x Increase",
      description: "Modern SoCs require exponentially more design and verification effort",
      color: "emerald-400"
    },
    {
      title: "Skills Gap Crisis",
      metric: "1M Shortage",
      description: "Critical shortage of experienced HDL engineers worldwide",
      color: "amber-400"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-emerald-500/20 rounded-full mb-6">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-slate-300 font-medium">Market Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            Market <span className="gradient-text">Opportunity</span>
          </h2>
          <div className="text-7xl md:text-8xl font-bold gradient-text mb-4">$17.5B</div>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Total Addressable Market for AI-Native Chip Design Automation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* TAM Breakdown */}
          <Card className="bg-slate-800/50 border-slate-700 enterprise-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Market Segmentation</h3>
                  <p className="text-slate-400">Total Addressable Market Analysis</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {marketSegments.map((segment, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${segment.color}/20 rounded-lg flex items-center justify-center`}>
                          <segment.icon className={`h-5 w-5 text-${segment.color}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{segment.segment}</div>
                          <div className="text-sm text-slate-400">{segment.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-${segment.color} text-lg`}>{segment.amount}</div>
                        <div className="text-sm text-slate-400">{segment.value}% share</div>
                      </div>
                    </div>
                    <Progress 
                      value={segment.value} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Drivers */}
          <Card className="bg-slate-800/50 border-slate-700 enterprise-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Market Drivers</h3>
                  <p className="text-slate-400">Key growth factors and trends</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {marketDrivers.map((driver, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-200">{driver.title}</h4>
                      <div className={`text-lg font-bold text-${driver.color}`}>{driver.metric}</div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{driver.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitive Landscape */}
        <Card className="bg-slate-800/30 border-slate-700 mb-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-100 mb-8 text-center">Competitive Landscape Analysis</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏭</span>
                </div>
                <h4 className="font-semibold text-amber-400 mb-2">Legacy EDA Tools</h4>
                <p className="text-slate-400 text-sm">Manual workflows, expensive licenses, limited AI integration</p>
                <div className="mt-3 text-xs text-slate-500">Synopsys, Cadence, Mentor</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h4 className="font-semibold text-blue-400 mb-2">Research Projects</h4>
                <p className="text-slate-400 text-sm">Academic tools, limited commercial readiness, narrow scope</p>
                <div className="mt-3 text-xs text-slate-500">University labs, DARPA initiatives</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-cyan-400 mb-2">ChipForge</h4>
                <p className="text-slate-400 text-sm">AI-native, end-to-end automation, sovereign deployment</p>
                <div className="mt-3 text-xs text-slate-500">Production-ready, enterprise-grade</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Thesis */}
        <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-6 gradient-text">Investment Thesis</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">$17.5B</div>
                <div className="text-slate-400 font-medium">Addressable Market</div>
                <div className="text-sm text-slate-500 mt-1">Fragmented, ready for disruption</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">500x</div>
                <div className="text-slate-400 font-medium">Efficiency Gain</div>
                <div className="text-sm text-slate-500 mt-1">Months to hours transformation</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">Zero</div>
                <div className="text-slate-400 font-medium">Direct Competitors</div>
                <div className="text-sm text-slate-500 mt-1">First-mover advantage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOpportunity;
