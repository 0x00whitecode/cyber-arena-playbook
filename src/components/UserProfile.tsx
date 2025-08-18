import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Award, 
  Shield, 
  Target, 
  Calendar, 
  Trophy,
  BookOpen,
  Clock
} from 'lucide-react';

interface UserProfileProps {
  onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [userInfo, setUserInfo] = useState({
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    role: 'IT Security Specialist',
    department: 'Information Technology',
    joinDate: 'January 2024',
    specialization: 'Healthcare Security'
  });

  const [stats] = useState({
    totalPoints: 2750,
    rank: 12,
    completedLabs: 8,
    badges: 15,
    hoursLearned: 47,
    streak: 12
  });

  const [badges] = useState([
    { name: 'Nessus Expert', category: 'Technical', earned: '2024-01-15', description: 'Completed all Nessus labs' },
    { name: 'Healthcare Specialist', category: 'Industry', earned: '2024-01-20', description: 'HIPAA compliance expert' },
    { name: 'Vulnerability Hunter', category: 'Achievement', earned: '2024-02-01', description: 'Found 50+ vulnerabilities' },
    { name: 'Team Player', category: 'Social', earned: '2024-02-10', description: 'Helped 10 teammates' },
    { name: 'Speed Demon', category: 'Performance', earned: '2024-02-15', description: 'Completed lab in record time' }
  ]);

  const [recentActivity] = useState([
    { action: 'Completed', target: 'Web Application Scanning Lab', points: 150, time: '2 hours ago' },
    { action: 'Earned', target: 'Vulnerability Hunter Badge', points: 200, time: '1 day ago' },
    { action: 'Started', target: 'Network Infrastructure Assessment', points: 0, time: '2 days ago' },
    { action: 'Completed', target: 'Healthcare Security Quiz', points: 75, time: '3 days ago' }
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/api/placeholder/80/80" alt={userInfo.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{userInfo.name}</h1>
              <p className="text-muted-foreground">{userInfo.role}</p>
              <p className="text-sm text-muted-foreground">{userInfo.department}</p>
              <Badge variant="outline" className="mt-2">{userInfo.specialization}</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-lg font-semibold text-cyber-green">#{stats.rank}</div>
              <div className="text-xs text-muted-foreground">Global Rank</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cyber-orange" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Labs Completed</span>
                  <span className="font-medium">{stats.completedLabs}/12</span>
                </div>
                <Progress value={(stats.completedLabs / 12) * 100} />
                
                <div className="flex justify-between">
                  <span className="text-sm">Learning Streak</span>
                  <span className="font-medium">{stats.streak} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Total Hours</span>
                  <span className="font-medium">{stats.hoursLearned}h</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-cyber-blue" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.badges}</div>
                    <div className="text-xs text-muted-foreground">Badges Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyber-green">85%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyber-green" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Network Assessment</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HIPAA Certification</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <Card key={index} className="bg-gradient-secondary border-border shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{badge.name}</h3>
                      <Badge variant="outline" className="text-xs mb-1">{badge.category}</Badge>
                      <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(badge.earned).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-gradient-secondary border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                    <div className="p-2 rounded-full bg-primary/10">
                      {activity.action === 'Completed' && <BookOpen className="h-4 w-4 text-cyber-green" />}
                      {activity.action === 'Earned' && <Award className="h-4 w-4 text-cyber-orange" />}
                      {activity.action === 'Started' && <Target className="h-4 w-4 text-cyber-blue" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {activity.action} {activity.target}
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                    {activity.points > 0 && (
                      <div className="text-sm font-medium text-primary">
                        +{activity.points} pts
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gradient-secondary border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    value={userInfo.role}
                    onChange={(e) => setUserInfo({...userInfo, role: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={userInfo.department}
                    onChange={(e) => setUserInfo({...userInfo, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};