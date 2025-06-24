
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Shield, Building, GraduationCap } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "ChipForge reduced our ASIC development cycle from 18 months to 3 weeks. The AI-generated HDL quality exceeds our senior engineers' manual implementations.",
      author: "Dr. Sarah Chen",
      title: "Principal Engineer",
      company: "Singapore Semiconductor Institute",
      rating: 5,
      category: "Research",
      icon: GraduationCap,
      metrics: "94% faster time-to-silicon"
    },
    {
      quote: "Finally, a solution that addresses our sovereignty requirements while delivering cutting-edge AI capabilities. ChipForge is transforming our domestic semiconductor program.",
      author: "Director Chen Wei",
      title: "Technology Division",
      company: "SE Asia Defense Ministry",
      rating: 5,
      category: "Government",
      icon: Shield,
      metrics: "100% on-premises deployment"
    },
    {
      quote: "The automated verification capabilities are revolutionary. What required months of manual testing now completes in hours with higher accuracy than traditional methods.",
      author: "Marcus Weber",
      title: "CTO",
      company: "Bremen Quantum Systems",
      rating: 5,
      category: "Enterprise",
      icon: Building,
      metrics: "98.7% verification accuracy"
    }
  ];

  const industryPartners = [
    { name: "NTU Singapore", logo: "🏛️", sector: "Research University", status: "Active Partnership" },
    { name: "Bremen University", logo: "🎓", sector: "EU Research", status: "Joint Development" },
    { name: "NYU Tandon", logo: "🏫", sector: "US Academia", status: "Technology Transfer" },
    { name: "Singapore Gov", logo: "🏛️", sector: "Government", status: "Pilot Program" },
    { name: "Defense Consortium", logo: "🛡️", sector: "National Security", status: "Strategic Partnership" },
    { name: "RISC-V Foundation", logo: "💻", sector: "Industry Alliance", status: "Technical Advisor" }
  ];

  const performanceMetrics = [
    { metric: "2,400+", label: "Hours Saved", description: "Across pilot programs" },
    { metric: "24", label: "Enterprise Pilots", description: "Government & industry" },
    { metric: "98.7%", label: "Accuracy Rate", description: "HDL verification" },
    { metric: "100%", label: "Security Compliance", description: "SOC 2, FIPS 140-2" }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-emerald-500/20 rounded-full mb-6">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-slate-300 font-medium">Trusted by Leaders</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            Enterprise <span className="gradient-text">Validation</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Mission-critical deployments across government, defense, and leading semiconductor organizations
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-all duration-300 enterprise-hover"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <testimonial.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <Quote className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Performance metric */}
                <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="text-sm font-semibold text-emerald-400">{testimonial.metrics}</div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-100">{testimonial.author}</h4>
                      <p className="text-sm text-slate-400">{testimonial.title}</p>
                      <p className="text-sm text-cyan-400 font-medium">{testimonial.company}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-emerald-500/50 text-emerald-400"
                    >
                      {testimonial.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Partners */}
        <Card className="bg-slate-800/30 border-slate-700 mb-16">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-slate-100">
              Strategic Partners & Collaborators
            </h3>
            
            <div className="grid md:grid-cols-6 gap-6">
              {industryPartners.map((partner, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-slate-900/50 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:bg-slate-700/50 transition-all duration-300 border border-slate-700 group-hover:border-slate-600">
                    <span className="text-2xl">{partner.logo}</span>
                  </div>
                  <h4 className="font-medium text-slate-200 text-sm mb-1">{partner.name}</h4>
                  <p className="text-xs text-slate-400 mb-2">{partner.sector}</p>
                  <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                    {partner.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          {performanceMetrics.map((item, index) => (
            <Card key={index} className="bg-slate-800/30 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{item.metric}</div>
                <div className="font-semibold text-slate-200 mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security & Compliance */}
        <Card className="mt-16 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-emerald-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-6 gradient-text">Enterprise Security & Compliance</h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="font-semibold text-slate-200 mb-1">SOC 2 Type II</div>
                <div className="text-sm text-slate-400">Security Controls</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-cyan-400">F</span>
                </div>
                <div className="font-semibold text-slate-200 mb-1">FIPS 140-2</div>
                <div className="text-sm text-slate-400">Cryptographic Module</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-blue-400">ISO</span>
                </div>
                <div className="font-semibold text-slate-200 mb-1">ISO 27001</div>
                <div className="text-sm text-slate-400">Information Security</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-emerald-400">G</span>
                </div>
                <div className="font-semibold text-slate-200 mb-1">GDPR</div>
                <div className="text-sm text-slate-400">Data Protection</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Testimonials;
