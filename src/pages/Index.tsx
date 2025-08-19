import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { GameStats } from "@/components/GameStats";
import { LearningPaths } from "@/components/LearningPaths";
import { NessusLabs } from "@/components/NessusLabs";
import { RecentActivity } from "@/components/RecentActivity";
import { AdvancedNessusLab } from "@/components/AdvancedNessusLab";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Play, TrendingUp, Terminal, Zap, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/cyber-hero.jpg";

const Index = () => {
  const [showAdvancedLab, setShowAdvancedLab] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is not logged in, show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/80">
            <div className="container mx-auto px-4 py-8 flex flex-col justify-center min-h-screen">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-sm">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                    CyberSecure Learning
                  </h1>
                </div>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  Master cybersecurity through hands-on Nessus labs, gamified learning paths, 
                  and real-world vulnerability assessment training.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6"
                    onClick={() => navigate('/auth')}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Learning
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-6"
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-background/80 backdrop-blur-sm border-border shadow-card">
                    <CardContent className="p-6 text-center">
                      <Terminal className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nessus Labs</h3>
                      <p className="text-sm text-muted-foreground">
                        Hands-on vulnerability scanning with real Nessus terminal simulation
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/80 backdrop-blur-sm border-border shadow-card">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-12 w-12 text-cyber-green mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Gamification</h3>
                      <p className="text-sm text-muted-foreground">
                        Earn points, badges, and climb leaderboards while learning
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/80 backdrop-blur-sm border-border shadow-card">
                    <CardContent className="p-6 text-center">
                      <Shield className="h-12 w-12 text-cyber-blue mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Industry Paths</h3>
                      <p className="text-sm text-muted-foreground">
                        Specialized training for healthcare, industrial, and financial sectors
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Main Dashboard */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="mb-8">
            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Terminal className="h-6 w-6 text-primary" />
                  Advanced Nessus Training Sandbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access our advanced Nessus vulnerability assessment sandbox with real-world scenarios, 
                  comprehensive reporting, and hands-on security training exercises.
                </p>
                <Dialog open={showAdvancedLab} onOpenChange={setShowAdvancedLab}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Launch Advanced Sandbox
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
                    <AdvancedNessusLab />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <GameStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <LearningPaths />
              <NessusLabs />
            </div>
            
            <div className="space-y-6">
              <RecentActivity />
              
              <Card className="bg-gradient-secondary border-border shadow-card">
                <CardContent className="p-6 text-center space-y-4">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">Weekly Challenge</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete 3 Nessus labs this week to earn the Scanner Expert badge
                  </p>
                  <div className="text-2xl font-bold text-primary">2/3 Complete</div>
                  <Button className="w-full" variant="outline">
                    View Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;