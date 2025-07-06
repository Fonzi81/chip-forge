import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Search
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  modules: number;
  duration: string;
  progress: number;
  level: string;
  enrolled: boolean;
}

interface Module {
  id: number;
  title: string;
  completed: boolean;
  duration: string;
  type: string;
  current?: boolean;
}

const CoursesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const courses: Course[] = [
    {
      id: 1,
      title: "Chip Design with No Experience",
      description: "Complete beginner's guide to digital chip design",
      modules: 12,
      duration: "8 hours",
      progress: 45,
      level: "Beginner",
      enrolled: true
    },
    {
      id: 2,
      title: "Advanced RTL Design Patterns",
      description: "Master complex RTL design techniques and best practices",
      modules: 15,
      duration: "12 hours",
      progress: 0,
      level: "Advanced",
      enrolled: false
    },
    {
      id: 3,
      title: "FPGA Implementation Fundamentals",
      description: "Learn FPGA architecture and implementation strategies",
      modules: 10,
      duration: "6 hours",
      progress: 80,
      level: "Intermediate",
      enrolled: true
    }
  ];

  const modules: Module[] = [
    {
      id: 1,
      title: "Introduction to Digital Logic",
      completed: true,
      duration: "45 min",
      type: "video"
    },
    {
      id: 2,
      title: "Understanding Logic Gates",
      completed: true,
      duration: "30 min",
      type: "interactive"
    },
    {
      id: 3,
      title: "Combinational Logic Design",
      completed: true,
      duration: "60 min",
      type: "video"
    },
    {
      id: 4,
      title: "Sequential Logic and Flip-Flops",
      completed: false,
      duration: "50 min",
      type: "video",
      current: true
    },
    {
      id: 5,
      title: "State Machines",
      completed: false,
      duration: "40 min",
      type: "hands-on"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Course */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-slate-900/50 to-slate-900/50 border-amber-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-200 mb-2">Featured Course</CardTitle>
              <CardDescription className="text-slate-400">
                Perfect for beginners starting their chip design journey
              </CardDescription>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              Featured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-200">Chip Design with No Experience</h3>
              <p className="text-slate-400">Learn digital design from the ground up</p>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Play className="h-4 w-4 mr-2" />
              Continue Learning
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-slate-400">45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-200">{course.title}</h3>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <p className="text-slate-400 mb-4">{course.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.modules} modules
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {course.enrolled ? (
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  ) : (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Enroll Now
                    </Button>
                  )}
                </div>
              </div>
              
              {course.enrolled && course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-slate-400">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Modules */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Current Course Modules</CardTitle>
          <CardDescription className="text-slate-400">
            Chip Design with No Experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                module.current 
                  ? 'border-amber-500/30 bg-amber-500/5' 
                  : 'border-slate-700 bg-slate-800/30'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    module.completed 
                      ? 'bg-emerald-500/20' 
                      : module.current 
                        ? 'bg-amber-500/20' 
                        : 'bg-slate-700'
                  }`}>
                    {module.completed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <span className="text-sm font-medium text-slate-300">{module.id}</span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-200">{module.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{module.duration}</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                        {module.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant={module.current ? "default" : "ghost"}
                  size="sm"
                  className={module.current ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  {module.completed ? "Review" : module.current ? "Continue" : "Start"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesTab;