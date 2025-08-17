import { Header } from "@/components/Header";
import { GameStats } from "@/components/GameStats";
import { LearningPaths } from "@/components/LearningPaths";
import { NessusLabs } from "@/components/NessusLabs";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Play, TrendingUp } from "lucide-react";
import heroImage from "@/assets/cyber-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-cyber opacity-10" />
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Master Cybersecurity Through
              <br />
              Real-World Simulation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Train with industry-leading tools like Nessus, compete in challenges, 
              and advance your cybersecurity career with gamified learning paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-primary hover:shadow-cyber">
                <Play className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline">
                <Shield className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8 space-y-8">
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
  );
};

export default Index;
