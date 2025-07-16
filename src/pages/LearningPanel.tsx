import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Code, 
  Layout, 
  Download, 
  Brain, 
  GraduationCap,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Video,
  Target,
  Users,
  Award
} from "lucide-react";
import TopNav from "../components/chipforge/TopNav";

export default function LearningPanel() {
  const [activeTab, setActiveTab] = useState("courses");
  const [completedLessons, setCompletedLessons] = useState<string[]>(["hdl-basics", "simulation-intro"]);

  const courses = [
    {
      id: "hdl-fundamentals",
      title: "HDL Fundamentals",
      description: "Learn the basics of Hardware Description Languages",
      icon: <Code className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      lessons: [
        { id: "hdl-basics", title: "Introduction to Verilog", duration: "15 min", completed: true },
        { id: "modules", title: "Module Structure", duration: "20 min", completed: true },
        { id: "signals", title: "Signals and Data Types", duration: "25 min", completed: false },
        { id: "operators", title: "Operators and Expressions", duration: "30 min", completed: false },
        { id: "control", title: "Control Structures", duration: "35 min", completed: false }
      ],
      progress: 40
    },
    {
      id: "simulation",
      title: "Simulation & Testing",
      description: "Master digital circuit simulation techniques",
      icon: <Play className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      lessons: [
        { id: "simulation-intro", title: "Simulation Basics", duration: "20 min", completed: true },
        { id: "testbenches", title: "Writing Testbenches", duration: "30 min", completed: false },
        { id: "waveforms", title: "Waveform Analysis", duration: "25 min", completed: false },
        { id: "debugging", title: "Debugging Techniques", duration: "40 min", completed: false }
      ],
      progress: 25
    },
    {
      id: "layout",
      title: "Physical Design",
      description: "Understanding place & route and layout",
      icon: <Layout className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      lessons: [
        { id: "layout-basics", title: "Layout Fundamentals", duration: "30 min", completed: false },
        { id: "place-route", title: "Place & Route", duration: "45 min", completed: false },
        { id: "timing", title: "Timing Analysis", duration: "35 min", completed: false },
        { id: "optimization", title: "Design Optimization", duration: "50 min", completed: false }
      ],
      progress: 0
    },
    {
      id: "ai-tools",
      title: "AI-Powered Design",
      description: "Leverage AI for faster chip design",
      icon: <Brain className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
      lessons: [
        { id: "ai-intro", title: "AI in Chip Design", duration: "20 min", completed: false },
        { id: "code-gen", title: "AI Code Generation", duration: "30 min", completed: false },
        { id: "optimization-ai", title: "AI Optimization", duration: "40 min", completed: false },
        { id: "best-practices", title: "Best Practices", duration: "25 min", completed: false }
      ],
      progress: 0
    }
  ];

  const resources = [
    {
      title: "Verilog Quick Reference",
      type: "PDF",
      icon: <FileText className="h-4 w-4" />,
      description: "Essential Verilog syntax and examples",
      link: "#"
    },
    {
      title: "Simulation Tutorial",
      type: "Video",
      icon: <Video className="h-4 w-4" />,
      description: "Step-by-step simulation guide",
      link: "#"
    },
    {
      title: "Layout Best Practices",
      type: "PDF",
      icon: <FileText className="h-4 w-4" />,
      description: "Physical design guidelines",
      link: "#"
    },
    {
      title: "AI Design Patterns",
      type: "Video",
      icon: <Video className="h-4 w-4" />,
      description: "Using AI effectively in design",
      link: "#"
    }
  ];

  const quickStart = [
    {
      title: "Create Your First Module",
      description: "Generate a simple Verilog module with AI",
      icon: <Brain className="h-5 w-5" />, 
      link: "/hdl-test",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Run a Simulation",
      description: "Test your design with waveform analysis",
      icon: <Play className="h-5 w-5" />, 
      link: "/chipforge-simulation",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "View Layout",
      description: "See your design in the interactive layout viewer",
      icon: <Layout className="h-5 w-5" />, 
      link: "/layout-viewer",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const totalProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Learning Hub
              </h1>
              <p className="text-slate-400 mt-2">
                Master chip design with interactive tutorials and AI assistance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                <GraduationCap className="h-3 w-3 mr-1" />
                {totalProgress}% Complete
              </Badge>
              <Button variant="outline" size="sm">
                <Award className="h-4 w-4 mr-2" />
                Certificates
              </Button>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Overall Progress</h3>
                  <p className="text-slate-400">Complete all courses to master chip design</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">{totalProgress}%</div>
                  <div className="text-sm text-slate-400">
                    {completedLessons.length} of {courses.reduce((sum, course) => sum + course.lessons.length, 0)} lessons
                  </div>
                </div>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Quick Start */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Quick Start
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStart.map((item, index) => (
                <Card 
                  key={index} 
                  className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
                >
                  <Link to={item.link}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {item.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="courses" className="data-[state=active]:bg-slate-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-slate-700">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-slate-700">
                <Users className="h-4 w-4 mr-2" />
                Community
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${course.color}`}>
                            {course.icon}
                          </div>
                          <div>
                            <CardTitle className="text-slate-200">{course.title}</CardTitle>
                            <CardDescription className="text-slate-400">
                              {course.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          {course.progress}%
                        </Badge>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {course.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                            onClick={() => handleLessonComplete(lesson.id)}
                          >
                            <div className="flex items-center gap-3">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-slate-500" />
                              )}
                              <div>
                                <div className="font-medium text-slate-200">{lesson.title}</div>
                                <div className="text-sm text-slate-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-slate-700">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-200">{resource.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{resource.description}</p>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
                    <p className="text-slate-400 mb-4">
                      Connect with other chip designers, share projects, and get help from experts.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline">
                        <Target className="h-4 w-4 mr-2" />
                        Discord
                      </Button>
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Forum
                      </Button>
                      <Button variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Office Hours
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Getting Help */}
          <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/20">
                  <GraduationCap className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Need Help Getting Started?
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Start with the HDL Fundamentals course to learn the basics, then practice with our AI-powered tools.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to="/hdl-test">
                        <Brain className="h-4 w-4 mr-2" />
                        Try AI Generator
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Ask Community
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
