
import { Badge } from "@/components/ui/badge";
import { Shield, Globe, Award } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Platform: ["Features", "Pricing", "API Documentation", "Technical Specifications"],
    Company: ["About", "Leadership", "Careers", "Press Kit"],
    Enterprise: ["Government Solutions", "Partner Program", "Professional Services", "Support"],
    Compliance: ["Security", "Privacy Policy", "Terms of Service", "Audit Reports"]
  };

  const certifications = [
    { name: "SOC 2 Type II", icon: "🛡️", description: "Security & Availability" },
    { name: "FIPS 140-2", icon: "🔒", description: "Cryptographic Security" },
    { name: "ISO 27001", icon: "📋", description: "Information Security" },
    { name: "GDPR Compliant", icon: "🌍", description: "Data Protection" }
  ];

  const globalPresence = [
    { region: "Singapore", flag: "🇸🇬", status: "HQ & Engineering" },
    { region: "United States", flag: "🇺🇸", status: "Enterprise Sales" },
    { region: "European Union", flag: "🇪🇺", status: "Research & Compliance" },
    { region: "Japan", flag: "🇯🇵", status: "Strategic Partnerships" }
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle technical background */}
      <div className="absolute inset-0 opacity-3 circuit-pattern"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-xl flex items-center justify-center mr-4">
                <span className="text-slate-900 font-bold text-lg">CF</span>
              </div>
              <span className="text-2xl font-bold gradient-text">ChipForge</span>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              AI-native semiconductor design platform for sovereign technology development.
            </p>
            
            {/* Professional social links */}
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-300 group">
                <span className="text-lg group-hover:scale-110 transition-transform">𝕏</span>
              </a>
              <a href="#" className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 group">
                <span className="text-lg group-hover:scale-110 transition-transform">in</span>
              </a>
              <a href="#" className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 group">
                <span className="text-lg group-hover:scale-110 transition-transform">📧</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-slate-100 font-semibold mb-6 text-lg">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications & Compliance */}
        <div className="border-t border-slate-800 pt-12 mb-12">
          <h4 className="text-slate-100 font-semibold text-center mb-8 text-lg">
            Enterprise Security & Compliance
          </h4>
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
                <span className="text-3xl mb-3">{cert.icon}</span>
                <h5 className="font-semibold text-slate-200 text-sm mb-1">{cert.name}</h5>
                <p className="text-xs text-slate-400 text-center">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Presence */}
        <div className="border-t border-slate-800 pt-12 mb-12">
          <h4 className="text-slate-100 font-semibold text-center mb-8 text-lg">
            Global Operations
          </h4>
          <div className="grid md:grid-cols-4 gap-6">
            {globalPresence.map((location, index) => (
              <div key={index} className="text-center p-4 bg-slate-800/20 rounded-lg border border-slate-700">
                <span className="text-2xl mb-2 block">{location.flag}</span>
                <h5 className="font-medium text-slate-200 mb-1">{location.region}</h5>
                <p className="text-xs text-slate-400">{location.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-6 lg:mb-0">
            <p className="text-slate-400 text-sm">
              © 2024 ChipForge Pte Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Made in Singapore
              </Badge>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Enterprise Grade
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              <Award className="h-3 w-3 mr-1" />
              Y Combinator S24
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              CHIPS Act Qualified
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              Venture Backed
            </Badge>
          </div>
        </div>

        {/* Technical excellence indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-8 opacity-30">
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <div className="text-xs text-slate-500 font-mono">AI • SOVEREIGN • SECURE</div>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
