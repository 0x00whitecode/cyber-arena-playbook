import { Shield, Server, Heart, Building2, Play, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const learningPaths = [
  {
    id: 1,
    title: "Healthcare Cybersecurity",
    description: "HIPAA compliance, medical device security, and patient data protection",
    icon: Heart,
    progress: 45,
    modules: 12,
    duration: "8 weeks",
    participants: 1247,
    level: "Intermediate",
    color: "cyber-red"
  },
  {
    id: 2,
    title: "Industrial Control Systems",
    description: "SCADA security, OT/IT convergence, and critical infrastructure protection",
    icon: Server,
    progress: 23,
    modules: 15,
    duration: "10 weeks", 
    participants: 892,
    level: "Advanced",
    color: "cyber-green"
  },
  {
    id: 3,
    title: "Financial Services Security",
    description: "PCI DSS compliance, banking security, and financial threat landscape",
    icon: Building2,
    progress: 78,
    modules: 10,
    duration: "6 weeks",
    participants: 2103,
    level: "Intermediate",
    color: "cyber-blue"
  },
  {
    id: 4,
    title: "Core Cybersecurity Fundamentals",
    description: "Essential security concepts, threat analysis, and defensive strategies",
    icon: Shield,
    progress: 12,
    modules: 18,
    duration: "12 weeks",
    participants: 3456,
    level: "Beginner",
    color: "cyber-purple"
  }
];

export const LearningPaths = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        Learning Paths
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningPaths.map((path) => {
          const IconComponent = path.icon;
          return (
            <Card key={path.id} className="bg-gradient-secondary border-border shadow-card hover:shadow-cyber transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${path.color}/10`}>
                      <IconComponent className={`h-6 w-6 text-${path.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">{path.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{path.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {path.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {path.duration}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {path.participants.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    variant={path.progress > 0 ? "default" : "outline"}
                    onClick={() => window.location.href = `/path/${path.id}`}
                  >
                    {path.progress > 0 ? "Continue" : "Start Learning"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.href = `/path/${path.id}`}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};