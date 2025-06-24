
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Users, Building } from "lucide-react";

const MarketOpportunity = () => {
  const marketSegments = [
    { segment: "Engineers", value: 45, amount: "$7.9B", icon: Users, color: "neon-green" },
    { segment: "Startups", value: 25, amount: "$4.4B", icon: TrendingUp, color: "neon-purple" },
    { segment: "Governments", value: 20, amount: "$3.5B", icon: Building, color: "blue-400" },
    { segment: "Universities", value: 10, amount: "$1.7B", icon: Users, color: "yellow-400" }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Market <span className="gradient-text">Opportunity</span>
          </h2>
          <div className="text-6xl font-bold gradient-text mb-4">$17.5B</div>
          <p className="text-xl text-gray-300">Total Addressable Market</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* TAM Breakdown Chart */}
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <DollarSign className="h-8 w-8 text-neon-green mr-3" />
                <h3 className="text-2xl font-bold">TAM Breakdown</h3>
              </div>
              
              <div className="space-y-6">
                {marketSegments.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <segment.icon className={`h-5 w-5 mr-3 text-${segment.color}`} />
                        <span className="font-semibold">{segment.segment}</span>
                      </div>
                      <span className={`font-bold text-${segment.color}`}>{segment.amount}</span>
                    </div>
                    <Progress 
                      value={segment.value} 
                      className="h-3"
                    />
                    <div className="text-sm text-gray-400">{segment.value}% of market</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card className="bg-dark-surface border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-8 w-8 text-neon-purple mr-3" />
                <h3 className="text-2xl font-bold">Market Insights</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-neon-green">
                  <h4 className="font-semibold text-neon-green mb-2">Growth Rate</h4>
                  <p className="text-gray-300">23% CAGR driven by AI acceleration demand</p>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-neon-purple">
                  <h4 className="font-semibold text-neon-purple mb-2">Competition</h4>
                  <p className="text-gray-300">Fragmented market, no dominant automation player</p>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-400 mb-2">Timing</h4>
                  <p className="text-gray-300">Perfect storm: AI boom + supply chain shift</p>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-400 mb-2">Barriers</h4>
                  <p className="text-gray-300">High expertise requirements favor automation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Section */}
        <Card className="bg-gradient-to-r from-neon-green/10 to-neon-purple/10 border-neon-green">
          <CardContent className="p-8 text-center">
            <blockquote className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
              "$17.5B market, no dominant player. ChipForge leads the new stack."
            </blockquote>
            <cite className="text-gray-400">— Industry Analysis, 2024</cite>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOpportunity;
