import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Award, TrendingUp, Clock } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export const DatabaseConnectedGameStats = () => {
  const { profile, badges, loading } = useProfile();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-secondary border-border shadow-card animate-pulse">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto" />
              <div className="w-16 h-8 bg-muted rounded mx-auto" />
              <div className="w-20 h-4 bg-muted rounded mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentLevel = Math.floor((profile?.points || 0) / 100) + 1;
  const pointsToNextLevel = (currentLevel * 100) - (profile?.points || 0);
  const progressToNextLevel = ((profile?.points || 0) % 100);

  const stats = [
    {
      icon: Trophy,
      label: "Total Points",
      value: profile?.points || 0,
      color: "text-cyber-orange",
      bgColor: "bg-cyber-orange/10"
    },
    {
      icon: Target,
      label: "Current Level",
      value: currentLevel,
      color: "text-cyber-green",
      bgColor: "bg-cyber-green/10",
      subtitle: `${pointsToNextLevel} to next level`
    },
    {
      icon: Award,
      label: "Badges Earned",
      value: badges.length,
      color: "text-cyber-blue",
      bgColor: "bg-cyber-blue/10"
    },
    {
      icon: Zap,
      label: "Learning Streak",
      value: `${profile?.streak_days || 0} days`,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Your Progress
        </h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Rank #{profile?.rank || 0}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-secondary border-border shadow-card hover:shadow-cyber transition-all duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className={`p-3 rounded-full mx-auto w-fit ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                {stat.subtitle && (
                  <div className="text-xs text-muted-foreground mt-1">{stat.subtitle}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Level {currentLevel} Progress
            <Badge variant="secondary">{progressToNextLevel}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressToNextLevel} className="mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{profile?.points || 0} points</span>
            <span>{currentLevel * 100} points</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Badges */}
      {badges.length > 0 && (
        <Card className="bg-gradient-secondary border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-cyber-orange" />
              Recent Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.slice(0, 4).map((badge, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-background/50 border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-xs font-medium">{badge.name}</div>
                  <Badge variant="outline" className="text-xs mt-1">{badge.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};