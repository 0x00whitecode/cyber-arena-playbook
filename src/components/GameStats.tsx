import { Trophy, Target, Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const GameStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Zap className="h-4 w-4 text-cyber-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyber-blue">2,847</div>
          <p className="text-xs text-muted-foreground">
            +284 from last week
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rank</CardTitle>
          <Trophy className="h-4 w-4 text-cyber-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyber-green">#127</div>
          <p className="text-xs text-muted-foreground">
            Top 15% of learners
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges</CardTitle>
          <Award className="h-4 w-4 text-cyber-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyber-purple">12</div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">Web Security</Badge>
            <Badge variant="secondary" className="text-xs">Nessus Pro</Badge>
            <Badge variant="secondary" className="text-xs">+10 more</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <Target className="h-4 w-4 text-cyber-orange" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyber-orange">67%</div>
          <Progress value={67} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Current learning path
          </p>
        </CardContent>
      </Card>
    </div>
  );
};