import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Terminal } from '@/components/Terminal';
import { ArrowLeft, CheckCircle, Target, Clock, Users } from 'lucide-react';

const LAB_DATA = {
  1: {
    title: "Vulnerability Assessment Basics",
    description: "Learn to configure and run your first Nessus scan on a test network",
    difficulty: "Beginner",
    duration: "45 minutes",
    objectives: [
      "Understanding Nessus interface and basic navigation",
      "Configure a basic network scan",
      "Execute vulnerability scan on test network",
      "Interpret scan results and vulnerability ratings",
      "Generate basic vulnerability report"
    ],
    instructions: [
      "Start by typing 'help' to see available commands",
      "Create a new scan using 'nessus --scan-new'",
      "List all scans with 'nessus --scan-list'",
      "Run your scan using 'nessus --scan-run scan_001'",
      "View results with 'nessus --results scan_001'"
    ]
  },
  2: {
    title: "Web Application Scanning",
    description: "Advanced web app vulnerability detection using Nessus plugins",
    difficulty: "Intermediate",
    duration: "90 minutes",
    objectives: [
      "Configure web application scan templates",
      "Identify common web vulnerabilities (OWASP Top 10)",
      "Analyze web application scan results",
      "Understand false positives in web scanning",
      "Prioritize web application vulnerabilities"
    ],
    instructions: [
      "Configure a web application scan targeting port 80/443",
      "Enable web application plugins in scan policy",
      "Execute comprehensive web app scan",
      "Analyze results for SQL injection, XSS, and other web vulns",
      "Generate detailed web application security report"
    ]
  },
  3: {
    title: "Network Infrastructure Assessment",
    description: "Comprehensive network scanning and vulnerability prioritization",
    difficulty: "Advanced",
    duration: "120 minutes",
    objectives: [
      "Design comprehensive network scan strategy",
      "Configure advanced scan policies",
      "Analyze network topology and services",
      "Prioritize vulnerabilities by business impact",
      "Create executive-level vulnerability reports"
    ],
    instructions: [
      "Plan multi-subnet network reconnaissance",
      "Configure credentialed vs non-credentialed scans",
      "Execute full network infrastructure assessment",
      "Correlate vulnerabilities across network segments",
      "Develop remediation timeline and priorities"
    ]
  },
  4: {
    title: "Industrial Control Systems Scan",
    description: "Specialized scanning techniques for OT/ICS environments",
    difficulty: "Expert",
    duration: "150 minutes",
    objectives: [
      "Understand OT/ICS network architecture",
      "Configure safe scanning for industrial systems",
      "Identify ICS-specific vulnerabilities",
      "Assess SCADA and HMI security",
      "Develop OT-aware vulnerability management"
    ],
    instructions: [
      "Review ICS network topology and protocols",
      "Configure low-impact scanning for operational systems",
      "Execute specialized ICS vulnerability assessment",
      "Analyze results for operational vs security impact",
      "Create OT-specific remediation recommendations"
    ]
  }
};

export const NessusLab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);
  const [commandsExecuted, setCommandsExecuted] = useState<string[]>([]);

  const lab = LAB_DATA[parseInt(id!) as keyof typeof LAB_DATA];

  useEffect(() => {
    // Simulate progress based on commands executed
    const progressPercentage = (commandsExecuted.length / 5) * 100;
    setProgress(Math.min(progressPercentage, 100));
  }, [commandsExecuted]);

  const handleCommand = (command: string) => {
    if (!commandsExecuted.includes(command)) {
      setCommandsExecuted(prev => [...prev, command]);
    }

    // Mark objectives as complete based on commands
    if (command.includes('--scan-new') && !completedObjectives.includes(0)) {
      setCompletedObjectives(prev => [...prev, 0]);
    }
    if (command.includes('--scan-run') && !completedObjectives.includes(1)) {
      setCompletedObjectives(prev => [...prev, 1]);
    }
    if (command.includes('--results') && !completedObjectives.includes(2)) {
      setCompletedObjectives(prev => [...prev, 2]);
    }
  };

  if (!lab) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Lab Not Found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{lab.title}</h1>
              <p className="text-muted-foreground mb-4">{lab.description}</p>
              <div className="flex gap-2">
                <Badge variant="outline">{lab.difficulty}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lab.duration}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
          <Progress value={progress} className="mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Terminal labId={parseInt(id!)} onCommand={handleCommand} />
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lab.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle 
                        className={`h-4 w-4 mt-0.5 ${
                          completedObjectives.includes(index) 
                            ? 'text-cyber-green' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                      <span className={`text-sm ${
                        completedObjectives.includes(index) 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      }`}>
                        {objective}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lab.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="bg-primary/20 text-primary text-xs font-mono rounded px-1.5 py-0.5 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm">{instruction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Progress Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Commands Executed</span>
                    <span className="text-sm font-medium">{commandsExecuted.length}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Objectives Complete</span>
                    <span className="text-sm font-medium">{completedObjectives.length}/{lab.objectives.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Overall Progress</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};