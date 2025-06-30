
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  ArrowLeft, 
  Plus, 
  MessageSquare, 
  GitCommit,
  Clock,
  Eye,
  Edit,
  Send,
  MoreHorizontal,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CollaboratorMode = () => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const collaborators = [
    {
      id: 1,
      name: "Alice Chen",
      email: "alice@chipforge.dev",
      avatar: "",
      role: "Lead Designer",
      status: "online",
      lastActive: "2 minutes ago",
      contributions: 42
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@chipforge.dev",
      avatar: "",
      role: "Verification Engineer",
      status: "away",
      lastActive: "1 hour ago",
      contributions: 28
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@chipforge.dev",
      avatar: "",
      role: "RTL Designer",
      status: "offline",
      lastActive: "3 hours ago",
      contributions: 35
    }
  ];

  const comments = [
    {
      id: 1,
      author: "Alice Chen",
      avatar: "",
      content: "The clock domain crossing looks good, but we should add a synchronizer here.",
      file: "uart_controller.v",
      line: 127,
      timestamp: "2 hours ago",
      resolved: false
    },
    {
      id: 2,
      author: "Bob Wilson",
      avatar: "",
      content: "Added constraint for maximum delay on this path. Please review.",
      file: "constraints.sdc",
      line: 45,
      timestamp: "4 hours ago",
      resolved: true
    },
    {
      id: 3,
      author: "Carol Davis",
      avatar: "",
      content: "Should we consider pipelining this multiplier for better timing?",
      file: "alu_core.v",
      line: 89,
      timestamp: "1 day ago",
      resolved: false
    }
  ];

  const changelog = [
    {
      id: 1,
      author: "Alice Chen",
      action: "Modified",
      file: "uart_controller.v",
      description: "Fixed timing violations in UART receive logic",
      timestamp: "2 hours ago",
      linesAdded: 15,
      linesRemoved: 8
    },
    {
      id: 2,
      author: "Bob Wilson",
      action: "Added",
      file: "tb_uart.sv",
      description: "Added comprehensive testbench for UART controller",
      timestamp: "5 hours ago",
      linesAdded: 234,
      linesRemoved: 0
    },
    {
      id: 3,
      author: "Carol Davis",
      action: "Modified",
      file: "alu_core.v",
      description: "Optimized multiplier implementation",
      timestamp: "1 day ago",
      linesAdded: 42,
      linesRemoved: 28
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">Collaboration</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              3 Active Collaborators
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="team" className="data-[state=active]:bg-slate-700">Team</TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-slate-700">Comments</TabsTrigger>
            <TabsTrigger value="changelog" className="data-[state=active]:bg-slate-700">Changelog</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            {/* Invite Section */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <UserPlus className="h-5 w-5 text-emerald-400" />
                  Invite Collaborators
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Add team members to work on this project together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-slate-200"
                  />
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <div className="grid gap-4">
              {collaborators.map((collaborator) => (
                <Card key={collaborator.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback className="bg-slate-700 text-slate-200">
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(collaborator.status)} rounded-full border-2 border-slate-900`}></div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-slate-200">{collaborator.name}</h3>
                          <p className="text-sm text-slate-400">{collaborator.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {collaborator.role}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Last active: {collaborator.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-200">
                          {collaborator.contributions}
                        </div>
                        <div className="text-sm text-slate-400">contributions</div>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            {/* Add Comment */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  Add Comment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Leave a comment on the code..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-slate-200 min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-400">
                      Commenting on line 127 in uart_controller.v
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Send className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback className="bg-slate-700 text-slate-200">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-200">{comment.author}</span>
                          <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            {comment.file}:{comment.line}
                          </Badge>
                          <span className="text-sm text-slate-500">{comment.timestamp}</span>
                          {comment.resolved && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-300 mb-3">{comment.content}</p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                            Reply
                          </Button>
                          {!comment.resolved && (
                            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="changelog" className="space-y-6">
            <div className="space-y-4">
              {changelog.map((entry) => (
                <Card key={entry.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-cyan-500/20 rounded-full">
                        <GitCommit className="h-5 w-5 text-cyan-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-200">{entry.author}</span>
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {entry.action}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {entry.file}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Clock className="h-4 w-4" />
                            {entry.timestamp}
                          </div>
                        </div>
                        
                        <p className="text-slate-300 mb-3">{entry.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-emerald-400">
                            <Plus className="h-4 w-4" />
                            {entry.linesAdded} additions
                          </div>
                          <div className="flex items-center gap-1 text-red-400">
                            <span>−</span>
                            {entry.linesRemoved} deletions
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollaboratorMode;
