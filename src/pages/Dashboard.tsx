import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Library, Clock, Cpu, Zap, Settings, User, LogOut, BookOpen, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const recentProjects = [
    {
      id: 1,
      name: "4-bit ALU Design",
      status: "completed",
      tags: ["ALU", "Arithmetic"],
      lastModified: "2 hours ago",
      description: "Basic arithmetic logic unit with carry-out"
    },
    {
      id: 2,
      name: "UART Controller",
      status: "simulation",
      tags: ["Communication", "Serial"],
      lastModified: "1 day ago",
      description: "Universal asynchronous receiver-transmitter"
    },
    {
      id: 3,
      name: "Memory Controller",
      status: "design",
      tags: ["Memory", "DDR"],
      lastModified: "3 days ago",
      description: "DDR3 memory interface controller"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'simulation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'design': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold gradient-text">ChipForge</span>
            </div>
            <div className="h-6 w-px bg-slate-700"></div>
            <span className="text-slate-400">AI-Native Chip Design Platform</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200" onClick={() => navigate('/')}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back to ChipForge</h1>
          <p className="text-slate-400 text-lg">Design digital chips using plain English or HDL. Let AI handle the complexity.</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            onClick={() => navigate('/new-project')}
            className="h-32 bg-emerald-500 text-slate-900 hover:bg-emerald-400 flex flex-col items-center justify-center space-y-2 text-lg font-semibold"
          >
            <Zap className="h-8 w-8" />
            New Design
          </Button>
          
          <Button
            variant="outline"
            className="h-32 border-slate-600 text-slate-300 hover:bg-slate-800 flex flex-col items-center justify-center space-y-2 text-lg font-semibold"
          >
            <Upload className="h-8 w-8" />
            Upload HDL
          </Button>
          
          <Button
            onClick={() => navigate('/templates')}
            variant="outline"
            className="h-32 border-slate-600 text-slate-300 hover:bg-slate-800 flex flex-col items-center justify-center space-y-2 text-lg font-semibold"
          >
            <BookOpen className="h-8 w-8" />
            Explore Templates
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              Recent Activity
            </h2>
            <Button 
              onClick={() => navigate('/audit-trail')}
              variant="ghost" 
              className="text-slate-400 hover:text-slate-200"
            >
              View All
            </Button>
          </div>

          <div className="grid gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="p-6 bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-200">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 mb-3">{project.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        {project.lastModified}
                      </div>
                      <div className="flex gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                      <Zap className="h-4 w-4 mr-2" />
                      Simulate
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
