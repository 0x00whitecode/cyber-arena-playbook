import { Activity, Award, Target, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    type: "badge",
    title: "Earned Web Security Specialist Badge",
    description: "Completed advanced web application security assessment",
    time: "2 hours ago",
    icon: Award,
    color: "cyber-green"
  },
  {
    id: 2,
    type: "lab",
    title: "Completed Nessus Lab: Network Scanning",
    description: "Found 23 vulnerabilities, scored 95%",
    time: "5 hours ago", 
    icon: Target,
    color: "cyber-blue"
  },
  {
    id: 3,
    type: "competition",
    title: "Monthly CTF Competition",
    description: "Ranked #45 out of 1,247 participants",
    time: "1 day ago",
    icon: Users,
    color: "cyber-purple"
  },
  {
    id: 4,
    type: "course",
    title: "Started Healthcare Security Path",
    description: "Beginning HIPAA compliance fundamentals",
    time: "2 days ago",
    icon: Activity,
    color: "cyber-orange"
  }
];

export const RecentActivity = () => {
  return (
    <Card className="bg-gradient-secondary border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-lg bg-${activity.color}/10`}>
                <IconComponent className={`h-4 w-4 text-${activity.color}`} />
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="text-center pt-2">
          <button className="text-sm text-primary hover:underline">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
};