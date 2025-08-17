import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Lock, CheckCircle, Clock, Users, BookOpen } from 'lucide-react';

const PATH_DATA = {
  1: {
    title: "Healthcare Cybersecurity",
    description: "HIPAA compliance, medical device security, and patient data protection",
    level: "Intermediate",
    duration: "8 weeks",
    participants: 1247,
    progress: 45,
    modules: [
      {
        id: 1,
        title: "HIPAA Compliance Fundamentals",
        description: "Understanding healthcare privacy regulations and requirements",
        duration: "45 minutes",
        status: "completed",
        content: "Learn the basics of HIPAA regulations, covered entities, and business associate agreements."
      },
      {
        id: 2,
        title: "Medical Device Security",
        description: "Securing IoT medical devices and network infrastructure",
        duration: "60 minutes",
        status: "in-progress",
        content: "Explore vulnerabilities in medical IoT devices and implementation of security controls."
      },
      {
        id: 3,
        title: "Patient Data Protection",
        description: "Advanced data encryption and access controls",
        duration: "50 minutes",
        status: "locked",
        content: "Master advanced encryption techniques and role-based access control systems."
      },
      {
        id: 4,
        title: "Healthcare Incident Response",
        description: "Responding to security breaches in healthcare environments",
        duration: "75 minutes",
        status: "locked",
        content: "Develop incident response plans specific to healthcare data breaches."
      }
    ]
  },
  2: {
    title: "Industrial Control Systems",
    description: "SCADA security, OT/IT convergence, and critical infrastructure protection",
    level: "Advanced",
    duration: "10 weeks",
    participants: 892,
    progress: 23,
    modules: [
      {
        id: 1,
        title: "ICS Architecture Overview",
        description: "Understanding OT networks and industrial protocols",
        duration: "60 minutes",
        status: "completed",
        content: "Learn about SCADA, PLC, HMI systems and industrial communication protocols."
      },
      {
        id: 2,
        title: "OT/IT Network Segmentation",
        description: "Implementing secure network architecture",
        duration: "90 minutes",
        status: "in-progress",
        content: "Design and implement proper network segmentation between OT and IT systems."
      },
      {
        id: 3,
        title: "SCADA Security Assessment",
        description: "Vulnerability testing in industrial environments",
        duration: "120 minutes",
        status: "locked",
        content: "Conduct security assessments while maintaining operational continuity."
      }
    ]
  },
  3: {
    title: "Financial Services Security",
    description: "PCI DSS compliance, banking security, and financial threat landscape",
    level: "Intermediate",
    duration: "6 weeks",
    participants: 2103,
    progress: 78,
    modules: [
      {
        id: 1,
        title: "PCI DSS Compliance",
        description: "Payment card industry data security standards",
        duration: "55 minutes",
        status: "completed",
        content: "Master PCI DSS requirements and implementation strategies."
      },
      {
        id: 2,
        title: "Banking Security Controls",
        description: "Financial institution security frameworks",
        duration: "70 minutes",
        status: "completed",
        content: "Implement security controls specific to banking and financial services."
      },
      {
        id: 3,
        title: "Financial Threat Landscape",
        description: "Current threats targeting financial institutions",
        duration: "45 minutes",
        status: "in-progress",
        content: "Analyze current threat actors and attack vectors in financial services."
      }
    ]
  },
  4: {
    title: "Core Cybersecurity Fundamentals",
    description: "Essential security concepts, threat analysis, and defensive strategies",
    level: "Beginner",
    duration: "12 weeks",
    participants: 3456,
    progress: 12,
    modules: [
      {
        id: 1,
        title: "Security Fundamentals",
        description: "Basic cybersecurity concepts and principles",
        duration: "40 minutes",
        status: "completed",
        content: "Introduction to cybersecurity principles, CIA triad, and risk management."
      },
      {
        id: 2,
        title: "Threat Landscape Overview",
        description: "Understanding current cybersecurity threats",
        duration: "50 minutes",
        status: "in-progress",
        content: "Explore malware, social engineering, and advanced persistent threats."
      },
      {
        id: 3,
        title: "Network Security Basics",
        description: "Firewalls, IDS/IPS, and network monitoring",
        duration: "65 minutes",
        status: "locked",
        content: "Learn network security fundamentals and monitoring techniques."
      }
    ]
  }
};

export const LearningPath = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const path = PATH_DATA[parseInt(id!) as keyof typeof PATH_DATA];

  if (!path) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Learning Path Not Found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-cyber-green" />;
      case 'in-progress':
        return <div className="h-2 w-2 bg-cyber-orange rounded-full animate-pulse" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-cyber-green/30 bg-cyber-green/5';
      case 'in-progress':
        return 'border-cyber-orange/30 bg-cyber-orange/5';
      case 'locked':
        return 'border-border bg-muted/20';
      default:
        return 'border-border';
    }
  };

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
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{path.title}</h1>
              <p className="text-muted-foreground mb-4">{path.description}</p>
              <div className="flex gap-2">
                <Badge variant="outline">{path.level}</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {path.duration}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {path.participants.toLocaleString()}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{path.progress}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
          <Progress value={path.progress} className="mb-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Learning Modules
            </h2>
            
            <div className="space-y-4">
              {path.modules.map((module, index) => (
                <Card 
                  key={module.id}
                  className={`transition-all duration-300 cursor-pointer hover:shadow-cyber ${getStatusColor(module.status)} ${
                    selectedModule === module.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {module.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {getStatusIcon(module.status)}
                    </div>
                  </CardHeader>
                  
                  {selectedModule === module.id && (
                    <CardContent className="border-t">
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {module.content}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            variant={module.status === 'locked' ? 'ghost' : 'default'}
                            disabled={module.status === 'locked'}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {module.status === 'completed' ? 'Review Module' : 
                             module.status === 'in-progress' ? 'Continue Module' : 
                             module.status === 'locked' ? 'Locked' : 'Start Module'}
                          </Button>
                          {module.status !== 'locked' && (
                            <Button variant="ghost" size="sm">
                              Preview
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Path Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Modules</span>
                    <span className="text-sm font-medium">{path.modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">
                      {path.modules.filter(m => m.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">
                      {path.modules.filter(m => m.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Remaining</span>
                    <span className="text-sm font-medium">
                      {path.modules.filter(m => m.status === 'locked').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Learning Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">{path.participants.toLocaleString()} learners enrolled</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Join discussions, ask questions, and share knowledge with other professionals in this learning path.
                  </div>
                  <Button variant="outline" className="w-full">
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};