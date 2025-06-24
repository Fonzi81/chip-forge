
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "ChipForge transformed our prototyping pipeline. What took months now takes hours.",
      author: "Dr. Sarah Chen",
      title: "Lead Engineer",
      company: "Singapore Semiconductor Institute",
      rating: 5,
      category: "University"
    },
    {
      quote: "The agentic approach to HDL generation is revolutionary. We're seeing 10x faster iteration cycles.",
      author: "Marcus Weber",
      title: "CTO",
      company: "Bremen AI Ventures",
      rating: 5,
      category: "Startup"
    },
    {
      quote: "Finally, a solution that addresses our sovereignty concerns while delivering cutting-edge capabilities.",
      author: "Ministry Contact",
      title: "Technology Division",
      company: "SE Asia Government",
      rating: 5,
      category: "Government"
    }
  ];

  const partners = [
    { name: "NTU", logo: "🏛️" },
    { name: "Bremen Uni", logo: "🎓" },
    { name: "NYU Tandon", logo: "🏫" },
    { name: "Singapore Gov", logo: "🏛️" },
    { name: "AI Research Lab", logo: "🔬" },
    { name: "Chip Alliance", logo: "💻" }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by <span className="gradient-text">Innovators</span>
          </h2>
          <p className="text-xl text-gray-300">
            Early adopters across universities, startups, and governments
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-dark-surface border-gray-700 hover:border-neon-green hover:glow-green transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-neon-green mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.author}</h4>
                      <p className="text-sm text-gray-400">{testimonial.title}</p>
                      <p className="text-sm text-neon-green">{testimonial.company}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        testimonial.category === 'University' ? 'border-neon-purple text-neon-purple' :
                        testimonial.category === 'Startup' ? 'border-neon-green text-neon-green' :
                        'border-blue-400 text-blue-400'
                      }`}
                    >
                      {testimonial.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partner Logos */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8 text-gray-300">
            Research & Development Partners
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-4 bg-dark-surface rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl mb-2">{partner.logo}</div>
                <div className="text-sm font-medium text-gray-300">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-green">500+</div>
            <div className="text-gray-400">Hours Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-purple">12</div>
            <div className="text-gray-400">Active Pilots</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-green">98%</div>
            <div className="text-gray-400">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-purple">24/7</div>
            <div className="text-gray-400">AI Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
