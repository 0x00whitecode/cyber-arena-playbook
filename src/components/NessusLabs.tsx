import { Terminal, Scan, Target, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const nessusLabs = [
  {
    id: 1,
    title: "Vulnerability Assessment Basics",
    description: "Learn to configure and run your first Nessus scan on a test network",
    difficulty: "Beginner",
    duration: "45 minutes",
    status: "completed",
    vulnerabilities: 12,
    type: "Guided Lab"
  },
  {
    id: 2,
    title: "Web Application Scanning",
    description: "Advanced web app vulnerability detection using Nessus plugins",
    difficulty: "Intermediate", 
    duration: "90 minutes",
    status: "in-progress",
    vulnerabilities: 28,
    type: "Hands-on Lab"
  },
  {
    id: 3,
    title: "Network Infrastructure Assessment",
    description: "Comprehensive network scanning and vulnerability prioritization",
    difficulty: "Advanced",
    duration: "120 minutes", 
    status: "locked",
    vulnerabilities: 45,
    type: "Challenge Lab"
  },
  {
    id: 4,
    title: "Industrial Control Systems Scan",
    description: "Specialized scanning techniques for OT/ICS environments",
    difficulty: "Expert",
    duration: "150 minutes",
    status: "locked", 
    vulnerabilities: 67,
    type: "Expert Lab"
  }
];

export const NessusLabs = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Terminal className="h-6 w-6 text-primary" />
        Nessus Labs
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nessusLabs.map((lab) => (
          <Card key={lab.id} className="bg-gradient-secondary border-border shadow-card hover:shadow-cyber transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scan className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lab.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{lab.difficulty}</Badge>
                      <Badge variant="secondary">{lab.type}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {lab.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-cyber-green" />
                  )}
                  {lab.status === 'in-progress' && (
                    <div className="h-2 w-2 bg-cyber-orange rounded-full animate-pulse" />
                  )}
                  {lab.status === 'locked' && (
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{lab.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>Duration: {lab.duration}</span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {lab.vulnerabilities} vulnerabilities
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  variant={lab.status === 'locked' ? 'ghost' : 'default'}
                  disabled={lab.status === 'locked'}
                >
                  {lab.status === 'completed' ? 'Review Lab' : 
                   lab.status === 'in-progress' ? 'Continue Lab' : 
                   lab.status === 'locked' ? 'Locked' : 'Start Lab'}
                </Button>
                {lab.status !== 'locked' && (
                  <Button variant="ghost" size="sm">Info</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};