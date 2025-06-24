
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, TrendingUp, Users } from "lucide-react";

const WhyNowWhyUs = () => {
  const timeline = [
    { year: "2020", event: "China Trade Dependencies", status: "critical" },
    { year: "2022", event: "SE Asia Manufacturing Shift", status: "opportunity" },
    { year: "2023", event: "NTU AI Breakthroughs", status: "breakthrough" },
    { year: "2024", event: "ChipForge Founded", status: "launch" }
  ];

  const credentials = [
    { name: "NTU", desc: "Nanyang Technological University", rank: "#1 in SE Asia" },
    { name: "Google", desc: "AI Research Alumni", rank: "DeepMind Team" },
    { name: "CSRankings", desc: "Computer Science Rankings", rank: "#2 in AI" },
    { name: "Bremen", desc: "University of Bremen", rank: "EU Research" },
    { name: "NYU", desc: "New York University", rank: "Tandon School" }
  ];

  return (
    <section className="py-20 px-6 bg-dark-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why <span className="text-neon-green">Now</span> / Why <span className="text-neon-purple">Us</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Timeline */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-8 w-8 text-neon-green mr-3" />
                <h3 className="text-2xl font-bold">Market Timeline</h3>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-green to-neon-purple"></div>
                
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-center mb-8 last:mb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                      item.status === 'critical' ? 'bg-red-500 text-white' :
                      item.status === 'opportunity' ? 'bg-yellow-500 text-black' :
                      item.status === 'breakthrough' ? 'bg-neon-purple text-white' :
                      'bg-neon-green text-black'
                    }`}>
                      {item.year.slice(-2)}
                    </div>
                    <div className="ml-6">
                      <h4 className="font-semibold text-lg">{item.event}</h4>
                      <Badge variant={item.status === 'launch' ? 'default' : 'secondary'} className="mt-1">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* World Map & Patents */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <MapPin className="h-8 w-8 text-neon-purple mr-3" />
                <h3 className="text-2xl font-bold">Global IP Coverage</h3>
              </div>
              
              <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden mb-6">
                {/* Simplified world map visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-20">🗺️</div>
                </div>
                
                {/* Patent markers */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-neon-green rounded-full animate-pulse-glow"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-neon-purple rounded-full animate-pulse-glow"></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-neon-green rounded-full animate-pulse-glow"></div>
                
                <div className="absolute bottom-4 left-4 text-sm text-gray-400">
                  <span className="text-neon-green">●</span> Active Patents<br/>
                  <span className="text-neon-purple">●</span> Pending Applications
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-green">12</div>
                  <div className="text-sm text-gray-400">Active Patents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-purple">8</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credentials */}
        <Card className="bg-gray-900 border-neon-green">
          <CardContent className="p-8">
            <div className="flex items-center mb-8">
              <Award className="h-8 w-8 text-neon-green mr-3" />
              <h3 className="text-2xl font-bold">World-Class Team</h3>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {credentials.map((cred, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-dark-surface rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:bg-neon-green/20 transition-all duration-300">
                    <span className="text-2xl font-bold gradient-text">{cred.name}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{cred.desc}</h4>
                  <Badge variant="outline" className="text-xs border-neon-green text-neon-green">
                    {cred.rank}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyNowWhyUs;
