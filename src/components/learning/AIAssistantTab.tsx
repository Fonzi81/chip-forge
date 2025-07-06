import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle,
  Bot
} from "lucide-react";

interface AIResponse {
  question: string;
  answer: string;
  examples: string[];
}

const AIAssistantTab = () => {
  const [aiQuestion, setAiQuestion] = useState("");

  const aiResponses: AIResponse[] = [
    {
      question: "What is an FSM?",
      answer: "An FSM (Finite State Machine) is a computational model used to design sequential logic circuits. It consists of a finite number of states, transitions between those states, and actions. FSMs are fundamental in digital design for controlling sequence-dependent operations like protocols, controllers, and data processing units.",
      examples: ["Traffic light controller", "UART state machine", "CPU control unit"]
    },
    {
      question: "What is clock domain crossing?",
      answer: "Clock domain crossing (CDC) occurs when a signal generated in one clock domain is used in another clock domain. This can cause metastability and data corruption. Common solutions include synchronizers, FIFOs, and handshaking protocols.",
      examples: ["Dual-clock FIFO", "Two-flop synchronizer", "Handshake protocol"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Question Input */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Bot className="h-5 w-5 text-cyan-400" />
            AI Learning Assistant
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ask any question about chip design and get instant, detailed explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Ask a question... (e.g., What is an FSM?)"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-200"
            />
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Q&A */}
      <div className="space-y-4">
        {aiResponses.map((response, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-2">{response.question}</h4>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-300 mb-4">{response.answer}</p>
                    <div>
                      <h5 className="text-sm font-medium text-slate-400 mb-2">Common Examples:</h5>
                      <div className="flex flex-wrap gap-2">
                        {response.examples.map((example, i) => (
                          <Badge key={i} variant="outline" className="border-slate-600 text-slate-400">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIAssistantTab;