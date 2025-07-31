import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const FAQSection = () => {
  const faqs = [
    {
      question: "Can ChipForge handle complex FSMs and multi-module designs?",
      answer: "Yes, ChipForge excels at complex designs. Our Smeltr engine can generate hierarchical modules, complex finite state machines, and multi-clock domain designs. The reflexion loop ensures even the most intricate logic passes verification on the first try."
    },
    {
      question: "How is this different from Cadence or Synopsys tools?",
      answer: "Traditional EDA tools require manual HDL coding and separate verification flows. ChipForge is AI-native from the ground up - you describe functionality in natural language, and we generate syntactically perfect, verified HDL. No manual coding, debugging, or toolchain juggling required."
    },
    {
      question: "Is simulation built-in or do I need external tools?",
      answer: "ChipForge includes a complete simulation engine with waveform visualization. Our reflexion loop automatically runs simulations and fixes any logic errors. For advanced verification, we also integrate with industry-standard simulators like ModelSim and VCS."
    },
    {
      question: "What language models power ChipForge?",
      answer: "ChipForge uses a hybrid approach: Smeltr employs grammar-constrained decoding with specialized HDL language models, while our reflexion system uses advanced LLMs fine-tuned on millions of chip designs. The combination ensures both syntax correctness and logical accuracy."
    },
    {
      question: "Can I deploy ChipForge in air-gapped environments?",
      answer: "Absolutely. ChipForge Enterprise supports fully offline, air-gapped deployment with zero cloud dependencies. All AI models run locally, with cryptographic audit trails and NIST-compliant security for sensitive government and defense applications."
    },
    {
      question: "What's the learning curve compared to traditional EDA flows?",
      answer: "ChipForge dramatically reduces the learning curve. Instead of mastering complex HDL syntax and debugging flows, you describe what you want in plain English. Most users are productive within hours, not months."
    },
    {
      question: "How does ChipForge ensure design quality and optimization?",
      answer: "Our AI continuously learns from successful designs and applies optimization patterns automatically. The reflexion loop includes timing analysis, area optimization, and power considerations. Generated HDL often outperforms manually coded designs."
    },
    {
      question: "What file formats and standards does ChipForge support?",
      answer: "ChipForge generates standard Verilog/SystemVerilog and VHDL. We support industry formats including GDSII for layout, SDC for timing constraints, and standard testbench formats. Full compatibility with existing toolchains is guaranteed."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-slate-400">
            Get answers to common questions about ChipForge's AI-native chip design platform
          </p>
        </div>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-slate-700"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-semibold text-slate-200 pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Additional help */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            Still have questions? Our technical team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@chipforge.ai" 
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              support@chipforge.ai
            </a>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a 
              href="#" 
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Schedule a Technical Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;