
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "API Docs", "Roadmap"],
    Company: ["About", "Careers", "Press", "Contact"],
    Resources: ["Blog", "Documentation", "Support", "Community"],
    Legal: ["Privacy", "Terms", "Security", "Compliance"]
  };

  const pressLogos = [
    { name: "TechCrunch", logo: "📰" },
    { name: "IEEE", logo: "⚡" },
    { name: "EE Times", logo: "📊" },
    { name: "VentureBeat", logo: "🚀" }
  ];

  return (
    <footer className="bg-black border-t border-gray-800 relative overflow-hidden">
      {/* Subtle circuit pattern background */}
      <div className="absolute inset-0 opacity-5 circuit-pattern"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-neon-purple rounded-lg flex items-center justify-center mr-3">
                <span className="text-black font-bold text-lg">CF</span>
              </div>
              <span className="text-2xl font-bold gradient-text">ChipForge</span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-native chip design for a sovereign future.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center hover:bg-neon-green hover:text-black transition-all duration-300">
                <span className="text-lg">𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center hover:bg-neon-purple hover:text-white transition-all duration-300">
                <span className="text-lg">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center hover:bg-neon-green hover:text-black transition-all duration-300">
                <span className="text-lg">📧</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-neon-green transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Press Mentions */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-center mb-6">
            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-4">As Featured In</h4>
            <div className="flex justify-center items-center space-x-8">
              {pressLogos.map((press, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 transition-colors duration-300">
                  <span className="text-2xl">{press.logo}</span>
                  <span className="text-sm font-medium">{press.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2024 ChipForge. All rights reserved.
            </p>
            <Badge variant="outline" className="border-neon-green text-neon-green text-xs">
              Made in Singapore 🇸🇬
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-neon-purple text-neon-purple text-xs">
              ISO 27001 Certified
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
              SOC 2 Type II
            </Badge>
          </div>
        </div>

        {/* Neon Glow Effects */}
        <div className="absolute bottom-0 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50 blur-sm"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50 blur-sm"></div>
      </div>
    </footer>
  );
};

export default Footer;
