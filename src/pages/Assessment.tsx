import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SecurityAssessment } from '@/components/SecurityAssessment';
import { ArrowLeft } from 'lucide-react';

export const Assessment = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const handleAssessmentComplete = (score: number, results: any) => {
    console.log('Assessment completed:', { score, results });
    // Here you could save the results to Supabase or show additional feedback
  };

  const categoryNames: Record<string, string> = {
    'general': 'General Cybersecurity',
    'nessus': 'Nessus & Vulnerability Assessment',
    'healthcare': 'Healthcare Security',
    'industrial': 'Industrial Control Systems',
    'financial': 'Financial Services Security'
  };

  const categoryName = categoryNames[category || 'general'] || 'General Cybersecurity';

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
        </div>

        <SecurityAssessment 
          category={categoryName}
          onComplete={handleAssessmentComplete}
        />
      </div>
    </div>
  );
};