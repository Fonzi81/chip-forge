
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, TrendingUp, Users, Clock, Shield } from "lucide-react";

const WhyNowWhyUs = () => {
  const timeline = [
    { year: "2020", event: "Supply Chain Vulnerabilities Exposed", status: "critical", description: "Global chip shortage reveals dependencies" },
    { year: "2022", event: "CHIPS Act & Sovereign Initiatives", status: "opportunity", description: "$280B+ global investment in domestic capabilities" },
    { year: "2023", event: "AI Acceleration Boom", status: "breakthrough", description: "Custom silicon demand explodes with AI/ML workloads" },
    { year: "2024", event: "ChipForge Production Launch", status: "launch", description: "First AI-native chip design platform deployed" }
  ];

  const teamCredentials = [
    { 
      institution: "NTU Singapore", 
      description: "Nanyang Technological University", 
      ranking: "#1 Engineering Asia",
      expertise: "AI/ML Systems",
      logo: "🏛️"
    },
    { 
      institution: "Google DeepMind", 
      description: "AI Research Division", 
      ranking: "Global AI Leader",
      expertise: "Neural Architecture",
      logo: "🧠"
    },
    { 
      institution: "University of Bremen", 
      description: "European Research Excellence", 
      ranking: "Top 3 EU Engineering",
      expertise: "Formal Verification",
      logo: "🎓"
    },
    { 
      institution: "NYU Tandon", 
      description: "New York University", 
      ranking: "US Tier 1 Research",
      expertise: "Computer Architecture",
      logo: "🏫"
    },
    { 
      institution: "DARPA Alumni", 
      description: "Defense Advanced Research", 
      ranking: "National Security R&D",
      expertise: "Critical Systems",
      logo: "🛡️"
    }
  ];

  const competitiveAdvantages = [
    {
      title: "First-Mover Advantage",
      description: "Only production-ready AI-native chip design platform",
      icon: "⚡",
      metrics: "2+ years ahead of competition"
    },
    {
      title: "Sovereign Technology",
      description: "On-premises deployment, zero external dependencies",
      icon: "🛡️",
      metrics: "100% data sovereignty"
    },
    {
      title: "Enterprise-Grade Security",
      description: "SOC 2 Type II, FIPS 140-2, ISO 27001 certified",
      icon: "🔒",
      metrics: "Government & defense ready"
    },
    {
      title: "Proven Performance",
      description: "500x faster development with 98.7% accuracy",
      icon: "📊",
      metrics: "Production validated"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-blue-500/20 rounded-full mb-6">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300 font-medium">Strategic Timing</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            Why <span className="text-cyan-400">Now</span> / Why <span className="text-blue-400">Us</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Perfect convergence of market need, technological capability, and geopolitical imperative
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Market Timeline */}
          <Card className="bg-slate-800/50 border-slate-700 enterprise-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Market Convergence</h3>
                  <p className="text-slate-400">Critical timing factors</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-emerald-400"></div>
                
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start mb-12 last:mb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold z-10 border-2 ${
                      item.status === 'critical' ? 'bg-amber-500/20 border-amber-500 text-amber-400' :
                      item.status === 'opportunity' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                      item.status === 'breakthrough' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                      'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    }`}>
                      {item.year.slice(-2)}
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="font-semibold text-lg text-slate-200 mb-2">{item.event}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.description}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.status === 'launch' ? 'border-cyan-500 text-cyan-400' : 
                          `border-${item.status === 'critical' ? 'amber' : item.status === 'opportunity' ? 'blue' : 'emerald'}-500 text-${item.status === 'critical' ? 'amber' : item.status === 'opportunity' ? 'blue' : 'emerald'}-400`
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitive Advantages */}
          <Card className="bg-slate-800/50 border-slate-700 enterprise-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Strategic Advantages</h3>
                  <p className="text-slate-400">Differentiation factors</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="p-6 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{advantage.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-200 mb-2">{advantage.title}</h4>
                        <p className="text-slate-400 text-sm mb-3 leading-relaxed">{advantage.description}</p>
                        <div className="text-xs text-cyan-400 font-medium">{advantage.metrics}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* World-Class Team */}
        <Card className="bg-slate-800/50 border-emerald-500/30 enterprise-shadow">
          <CardContent className="p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">World-Class Team</h3>
                <p className="text-slate-400">Elite institutions and proven track record</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {teamCredentials.map((cred, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-slate-900/50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-500/10 transition-all duration-300 border border-slate-700 group-hover:border-emerald-500/30">
                    <span className="text-3xl">{cred.logo}</span>
                  </div>
                  <h4 className="font-semibold text-slate-200 text-sm mb-1">{cred.institution}</h4>
                  <p className="text-xs text-slate-400 mb-2">{cred.description}</p>
                  <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-400 mb-1">
                    {cred.ranking}
                  </Badge>
                  <div className="text-xs text-slate-500">{cred.expertise}</div>
                </div>
              ))}
            </div>

            {/* Team metrics */}
            <div className="mt-12 grid md:grid-cols-4 gap-6 pt-8 border-t border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">12+</div>
                <div className="text-sm text-slate-400">Patents Filed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">50+</div>
                <div className="text-sm text-slate-400">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">8</div>
                <div className="text-sm text-slate-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">15+</div>
                <div className="text-sm text-slate-400">Years Combined</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyNowWhyUs;
