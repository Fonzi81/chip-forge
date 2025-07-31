import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Building, Globe, Users } from "lucide-react";

const EnterpriseCTA = () => {
  const features = [
    {
      icon: Shield,
      title: "Air-Gapped Security",
      description: "Complete offline operation with cryptographic audit trails"
    },
    {
      icon: Building,
      title: "Enterprise Integration",
      description: "Seamless integration with existing EDA workflows and toolchains"
    },
    {
      icon: Globe,
      title: "Sovereign Deployment",
      description: "National-scale deployments with full data sovereignty"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 technical support with dedicated solution architects"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight text-slate-100">
                Deploy at <span className="gradient-text">Enterprise</span> or <span className="gradient-text">Sovereign</span> Scale
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                ChipForge supports air-gapped environments, comprehensive audit trails, and national-scale deployments. 
                Build critical infrastructure with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-700/50 mb-4">
                    <feature.icon className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Enterprise metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400 mb-1">SOC2</div>
                <div className="text-sm text-slate-400">Compliance Ready</div>
              </div>
              <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-emerald-400 mb-1">99.9%</div>
                <div className="text-sm text-slate-400">Uptime SLA</div>
              </div>
              <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                <div className="text-sm text-slate-400">Expert Support</div>
              </div>
              <div className="text-center p-6 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400 mb-1">NIST</div>
                <div className="text-sm text-slate-400">Security Standards</div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-emerald-500 text-slate-900 hover:bg-emerald-400 font-semibold px-8 py-4 text-lg enterprise-shadow-lg transition-all duration-200 hover:scale-105 mr-4"
              >
                <Shield className="mr-2 h-5 w-5" />
                Request Enterprise Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-emerald-500 font-semibold px-8 py-4 text-lg transition-all duration-200 hover:scale-105"
              >
                Download Security Whitepaper
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-slate-700">
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Trusted by</div>
                <div className="text-slate-300 font-medium">Fortune 500 Companies</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Deployed in</div>
                <div className="text-slate-300 font-medium">15+ Countries</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Processing</div>
                <div className="text-slate-300 font-medium">1M+ Designs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EnterpriseCTA;