
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Library, Clock, Cpu, Zap, Settings, User, LogOut, BookOpen, Activity, Download, FileCode, BarChart3, Users, GraduationCap, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
              <span className="text-xl sm:text-2xl font-bold gradient-text">ChipForge</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-slate-700"></div>
            <span className="hidden sm:inline text-slate-400 text-sm">AI-Native Chip Design Platform</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800" onClick={() => navigate('/')}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="px-4 py-2 space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800" onClick={() => navigate('/')}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="p-4 sm:p-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Welcome back to ChipForge</h1>
          <p className="text-slate-400 text-base sm:text-lg">Design digital chips using plain English or HDL. Let AI handle the complexity.</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            onClick={() => navigate('/new-project')}
            variant="outline"
            size="lg"
            className="h-24 sm:h-32 bg-emerald-800 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-cyan-500 font-semibold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
          >
            <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs sm:text-base">New Design</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 sm:h-32 bg-emerald-800 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500 font-semibold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
          >
            <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs sm:text-base">Upload HDL</span>
          </Button>
          
          <Button
            onClick={() => navigate('/templates')}
            variant="outline"
            size="lg"
            className="h-24 sm:h-32 bg-emerald-800 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-emerald-500 font-semibold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
          >
            <Library className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs sm:text-base">Browse Templates</span>
          </Button>

          <Button
            onClick={() => navigate('/workspace')}
            variant="outline"
            size="lg"
            className="h-24 sm:h-32 bg-emerald-800 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-purple-500 font-semibold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1 sm:space-y-2"
          >
            <Activity className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xs sm:text-base">ChipForge IDE</span>
          </Button>
        </div>

        {/* Phase 4 Features */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-200">Collaboration & Learning</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('/usage-dashboard')}
              variant="outline"
              size="lg"
              className="h-20 sm:h-24 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-purple-500 font-semibold px-3 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1"
            >
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Usage Dashboard</span>
            </Button>

            <Button
              onClick={() => navigate('/collaborator-mode')}
              variant="outline"
              size="lg"
              className="h-20 sm:h-24 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500 font-semibold px-3 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1"
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Collaborator Mode</span>
            </Button>

            <Button
              onClick={() => navigate('/learning-panel')}
              variant="outline"
              size="lg"
              className="h-20 sm:h-24 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-amber-500 font-semibold px-3 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1"
            >
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Learning Center</span>
            </Button>

            <Button
              onClick={() => navigate('/constraints')}
              variant="outline"
              size="lg"
              className="h-20 sm:h-24 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-cyan-500 font-semibold px-3 sm:px-6 py-2 sm:py-3 transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-1"
            >
              <FileCode className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm">Constraints</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              Recent Activity
            </h2>
            <Button 
              onClick={() => navigate('/audit-trail')}
              variant="ghost" 
              size="sm"
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              View All
            </Button>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {recentProjects.map((project) => (
              <Card key={project.id} className="p-4 sm:p-6 bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-200">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 mb-3">{project.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
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
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-2 lg:flex-row">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs sm:text-sm">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Simulate
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-cyan-500 text-xs sm:text-sm">
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
