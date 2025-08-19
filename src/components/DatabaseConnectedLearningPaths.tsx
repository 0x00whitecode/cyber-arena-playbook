import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Target, CheckCircle, PlayCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  objectives: string[];
  modules: any;
}

interface UserProgress {
  progress_percentage: number;
  status: string;
  completed_objectives: number;
  total_objectives: number;
}

export const DatabaseConnectedLearningPaths = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPaths();
  }, [user]);

  const fetchLearningPaths = async () => {
    try {
      // Fetch learning paths
      const { data: paths, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .order('difficulty', { ascending: true });

      if (pathsError) throw pathsError;
      setLearningPaths(paths || []);

      // Fetch user progress if logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_type', 'path');

        if (progressError) throw progressError;
        
        const progressMap = (progressData || []).reduce((acc, progress) => {
          acc[progress.item_id] = progress;
          return acc;
        }, {} as Record<string, UserProgress>);
        
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-cyber-green/10 text-cyber-green border-cyber-green/20';
      case 'intermediate': return 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'healthcare': return '🏥';
      case 'industrial': return '🏭';
      case 'financial': return '🏦';
      default: return '🛡️';
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-secondary border-border shadow-card animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="w-3/4 h-6 bg-muted rounded" />
                <div className="w-full h-4 bg-muted rounded" />
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-muted rounded" />
                  <div className="w-20 h-6 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        Learning Paths
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map((path) => {
          const progress = userProgress[path.id];
          const isStarted = progress?.status === 'in_progress';
          const isCompleted = progress?.status === 'completed';
          
          return (
            <Card key={path.id} className="bg-gradient-secondary border-border shadow-card hover:shadow-cyber transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getCategoryIcon(path.category)}</div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {path.title}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <Badge variant="outline">{path.category}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <CheckCircle className="h-5 w-5 text-cyber-green" />
                  )}
                  {isStarted && (
                    <PlayCircle className="h-5 w-5 text-cyber-orange" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {path.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.floor(path.duration_minutes / 60)}h {path.duration_minutes % 60}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {path.objectives?.length || 0} objectives
                    </span>
                  </div>
                </div>
                
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress.progress_percentage)}%</span>
                    </div>
                    <Progress value={progress.progress_percentage} />
                    <div className="text-xs text-muted-foreground">
                      {progress.completed_objectives} of {progress.total_objectives} objectives completed
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => navigate(`/path/${path.id}`)}
                    variant={isCompleted ? 'outline' : 'default'}
                  >
                    {isCompleted ? 'Review Path' : isStarted ? 'Continue Path' : 'Start Path'}
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