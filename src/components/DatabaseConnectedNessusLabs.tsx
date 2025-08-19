import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Terminal, Target, CheckCircle, AlertTriangle, PlayCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface NessusLab {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  objectives: string[];
  vulnerabilities: number;
  lab_type: string;
}

interface UserProgress {
  progress_percentage: number;
  status: string;
  completed_objectives: number;
  total_objectives: number;
}

export const DatabaseConnectedNessusLabs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nessusLabs, setNessusLabs] = useState<NessusLab[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNessusLabs();
  }, [user]);

  const fetchNessusLabs = async () => {
    try {
      // Fetch Nessus labs
      const { data: labs, error: labsError } = await supabase
        .from('nessus_labs')
        .select('*')
        .order('difficulty', { ascending: true });

      if (labsError) throw labsError;
      setNessusLabs(labs || []);

      // Fetch user progress if logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_type', 'lab');

        if (progressError) throw progressError;
        
        const progressMap = (progressData || []).reduce((acc, progress) => {
          acc[progress.item_id] = progress;
          return acc;
        }, {} as Record<string, UserProgress>);
        
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching Nessus labs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-cyber-green/10 text-cyber-green border-cyber-green/20';
      case 'intermediate': return 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'expert': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          Nessus Labs
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
        <Terminal className="h-6 w-6 text-primary" />
        Nessus Labs
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nessusLabs.map((lab, index) => {
          const progress = userProgress[lab.id];
          const isStarted = progress?.status === 'in_progress';
          const isCompleted = progress?.status === 'completed';
          const isLocked = index > 0 && !userProgress[nessusLabs[index - 1]?.id]?.status;
          
          return (
            <Card key={lab.id} className="bg-gradient-secondary border-border shadow-card hover:shadow-cyber transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Terminal className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {lab.title}
                      </CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getDifficultyColor(lab.difficulty)}>
                          {lab.difficulty}
                        </Badge>
                        <Badge variant="secondary">{lab.lab_type}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-cyber-green" />
                    )}
                    {isStarted && (
                      <div className="h-2 w-2 bg-cyber-orange rounded-full animate-pulse" />
                    )}
                    {isLocked && (
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{lab.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lab.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {lab.vulnerabilities} vulnerabilities
                    </span>
                  </div>
                </div>
                
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress.progress_percentage)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    variant={isLocked ? 'ghost' : 'default'}
                    disabled={isLocked}
                    onClick={() => navigate(`/lab/${lab.id}`)}
                  >
                    {isCompleted ? 'Review Lab' : 
                     isStarted ? 'Continue Lab' : 
                     isLocked ? 'Locked' : 'Start Lab'}
                  </Button>
                  {!isLocked && (
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/lab/${lab.id}`)}>
                      Info
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};