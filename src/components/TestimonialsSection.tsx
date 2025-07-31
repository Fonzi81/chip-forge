import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "ChipForge cut our HDL debug time by 70%. The AI-generated code is cleaner than what our senior engineers write manually.",
      author: "Dr. Sarah Chen",
      title: "PhD Student, Digital Systems",
      organization: "NTU Singapore",
      rating: 5,
      metric: "70% faster debug"
    },
    {
      quote: "The reflexion loop is revolutionary. Instead of spending weeks debugging syntax errors, we focus on architecture and innovation.",
      author: "Prof. Michael Schmidt",
      title: "VLSI Research Group Lead",
      organization: "University of Bremen",
      rating: 5,
      metric: "500x productivity gain"
    },
    {
      quote: "Smeltr's syntax guarantee changed everything. We've had zero compilation errors in production for 6 months.",
      author: "Alex Rivera",
      title: "Senior Design Engineer",
      organization: "NYU Tandon",
      rating: 5,
      metric: "0 syntax errors"
    }
  ];

  const partners = [
    "NTU Singapore",
    "NYU Tandon",
    "University of Bremen",
    "TU Delft",
    "Stanford EE",
    "MIT CSAIL"
  ];

  return (
    <section className="py-24 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Trusted by <span className="gradient-text">Leading</span> Institutions
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Universities and research institutions worldwide rely on ChipForge for cutting-edge chip design education and research
          </p>
        </div>

        {/* Partner logos/names */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60">
          {partners.map((partner, index) => (
            <div key={index} className="text-slate-400 font-medium text-sm">
              {partner}
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 transition-all duration-300 enterprise-hover">
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-slate-300 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="border-t border-slate-700 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">{testimonial.author}</div>
                      <div className="text-sm text-slate-400">{testimonial.title}</div>
                      <div className="text-sm text-cyan-400 font-medium">{testimonial.organization}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">Impact</div>
                      <div className="text-emerald-400 font-bold text-sm">{testimonial.metric}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats summary */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-cyan-500/20">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">15+</div>
                <div className="text-sm text-slate-400">Partner Universities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">500+</div>
                <div className="text-sm text-slate-400">Student Researchers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">10k+</div>
                <div className="text-sm text-slate-400">Designs Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">95%</div>
                <div className="text-sm text-slate-400">First-Pass Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TestimonialsSection;