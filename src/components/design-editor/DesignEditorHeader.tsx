import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesignEditorHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 py-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <div className="h-6 w-px bg-slate-700"></div>
        <span className="text-xl font-semibold">4-bit ALU Design</span>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          Compiled
        </Badge>
      </div>
    </header>
  );
};

export default DesignEditorHeader;