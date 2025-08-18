import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  AlertTriangle,
  Target,
  BookOpen,
  Trophy
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

interface AssessmentProps {
  category?: string;
  onComplete?: (score: number, results: any) => void;
}

export const SecurityAssessment: React.FC<AssessmentProps> = ({ category = 'General', onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isComplete, setIsComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary purpose of a vulnerability scanner like Nessus?",
      options: [
        "To fix vulnerabilities automatically",
        "To identify and report security vulnerabilities",
        "To prevent all cyber attacks",
        "To monitor network traffic in real-time"
      ],
      correctAnswer: 1,
      explanation: "Nessus is primarily designed to identify and report security vulnerabilities in systems, networks, and applications. It doesn't fix vulnerabilities automatically but provides detailed reports to help security teams prioritize and remediate issues.",
      difficulty: 'Easy',
      category: 'Nessus Basics'
    },
    {
      id: 2,
      question: "Which CVSS score range indicates a 'High' severity vulnerability?",
      options: [
        "0.1 - 3.9",
        "4.0 - 6.9", 
        "7.0 - 8.9",
        "9.0 - 10.0"
      ],
      correctAnswer: 2,
      explanation: "According to CVSS v3.1, High severity vulnerabilities have a base score of 7.0 - 8.9. Critical is 9.0-10.0, Medium is 4.0-6.9, and Low is 0.1-3.9.",
      difficulty: 'Medium',
      category: 'Vulnerability Assessment'
    },
    {
      id: 3,
      question: "What does RCE stand for in cybersecurity?",
      options: [
        "Remote Code Execution",
        "Rapid Cyber Exploitation",
        "Resource Control Error",
        "Restricted Command Environment"
      ],
      correctAnswer: 0,
      explanation: "RCE stands for Remote Code Execution, which is a type of vulnerability that allows an attacker to execute arbitrary code on a target system remotely, often considered one of the most critical security issues.",
      difficulty: 'Easy',
      category: 'Security Fundamentals'
    },
    {
      id: 4,
      question: "In a Nessus scan policy, what is the difference between credentialed and non-credentialed scans?",
      options: [
        "Credentialed scans are faster but less accurate",
        "Non-credentialed scans require administrator privileges",
        "Credentialed scans use authentication to access systems for deeper analysis",
        "There is no difference between the two scan types"
      ],
      correctAnswer: 2,
      explanation: "Credentialed scans use valid authentication credentials (username/password, SSH keys, etc.) to log into target systems and perform deeper, more accurate vulnerability assessments by examining system internals, patch levels, and configurations.",
      difficulty: 'Medium',
      category: 'Nessus Advanced'
    },
    {
      id: 5,
      question: "Which of the following is NOT typically considered a healthcare-specific cybersecurity regulation?",
      options: [
        "HIPAA",
        "HITECH Act",
        "PCI DSS",
        "FDA Cybersecurity Guidelines"
      ],
      correctAnswer: 2,
      explanation: "PCI DSS (Payment Card Industry Data Security Standard) is specifically for organizations that handle credit card transactions, not healthcare. HIPAA, HITECH Act, and FDA Cybersecurity Guidelines are all healthcare-specific regulations.",
      difficulty: 'Hard',
      category: 'Healthcare Security'
    },
    {
      id: 6,
      question: "What is the primary security concern with Industrial Control Systems (ICS)?",
      options: [
        "High bandwidth usage",
        "Expensive maintenance costs",
        "Integration of IT and OT networks increasing attack surface",
        "Complex user interfaces"
      ],
      correctAnswer: 2,
      explanation: "The convergence of Information Technology (IT) and Operational Technology (OT) networks has significantly increased the attack surface for industrial systems, making them vulnerable to cyber attacks that could affect critical infrastructure and safety systems.",
      difficulty: 'Hard',
      category: 'Industrial Security'
    },
    {
      id: 7,
      question: "When conducting vulnerability assessments in OT environments, what is the most important consideration?",
      options: [
        "Scanning as quickly as possible",
        "Using the highest intensity scan settings",
        "Ensuring scans don't disrupt operational systems",
        "Focusing only on network vulnerabilities"
      ],
      correctAnswer: 2,
      explanation: "In OT environments, operational continuity and safety are paramount. Vulnerability scans must be carefully planned and executed to avoid disrupting critical operational systems or causing safety incidents.",
      difficulty: 'Medium',
      category: 'OT Security'
    },
    {
      id: 8,
      question: "What does the 'false positive' term mean in vulnerability scanning?",
      options: [
        "A vulnerability that has been successfully exploited",
        "A reported vulnerability that doesn't actually exist",
        "A vulnerability with a low CVSS score",
        "A vulnerability that has been patched"
      ],
      correctAnswer: 1,
      explanation: "A false positive occurs when a vulnerability scanner reports a vulnerability that doesn't actually exist on the target system. This can happen due to scanner limitations, misconfigurations, or overly aggressive detection rules.",
      difficulty: 'Easy',
      category: 'Vulnerability Assessment'
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleComplete = () => {
    const correctAnswers = questions.reduce((acc, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? acc + 1 : acc;
    }, 0);
    
    const finalScore = (correctAnswers / questions.length) * 100;
    setScore(finalScore);
    setIsComplete(true);
    onComplete?.(finalScore, { correctAnswers, totalQuestions: questions.length });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-cyber-green';
    if (score >= 80) return 'text-cyber-blue';
    if (score >= 70) return 'text-cyber-orange';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-cyber-green/10 text-cyber-green border-cyber-green/20' };
    if (score >= 80) return { text: 'Good', color: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20' };
    if (score >= 70) return { text: 'Fair', color: 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/20' };
    return { text: 'Needs Improvement', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
  };

  if (isComplete) {
    const badge = getScoreBadge(score);
    const correctAnswers = questions.reduce((acc, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? acc + 1 : acc;
    }, 0);

    return (
      <Card className="bg-gradient-secondary border-border shadow-card max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Trophy className="h-16 w-16 text-cyber-orange mx-auto mb-2" />
          </div>
          <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {Math.round(score)}%
            </div>
            <Badge className={badge.color} variant="outline">
              {badge.text}
            </Badge>
            <div className="text-lg text-muted-foreground">
              {correctAnswers} out of {questions.length} questions correct
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="text-center p-4">
              <CheckCircle className="h-8 w-8 text-cyber-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyber-green">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </Card>
            <Card className="text-center p-4">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-500">{questions.length - correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </Card>
            <Card className="text-center p-4">
              <Clock className="h-8 w-8 text-cyber-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyber-blue">{formatTime(1800 - timeLeft)}</div>
              <div className="text-sm text-muted-foreground">Time Used</div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Review Your Answers
            </h3>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-cyber-green" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className={isCorrect ? 'text-cyber-green' : 'text-red-500'}>
                          Your answer: {question.options[userAnswer]}
                        </div>
                        {!isCorrect && (
                          <div className="text-cyber-green">
                            Correct answer: {question.options[question.correctAnswer]}
                          </div>
                        )}
                        <div className="text-muted-foreground bg-background/50 p-2 rounded mt-2">
                          {question.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              Retake Assessment
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="bg-gradient-secondary border-border shadow-card max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            {category} Security Assessment
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="secondary">
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={currentQ.difficulty === 'Easy' ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/20' :
                            currentQ.difficulty === 'Medium' ? 'bg-cyber-orange/10 text-cyber-orange border-cyber-orange/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'}>
              {currentQ.difficulty}
            </Badge>
            <Badge variant="outline">{currentQ.category}</Badge>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">
            {currentQ.question}
          </h3>
          
          <RadioGroup 
            value={selectedAnswers[currentQ.id]?.toString()} 
            onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
          >
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer p-3 rounded-lg border border-border hover:bg-background/50">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {showExplanation && (
          <Card className="p-4 bg-background/50">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-cyber-blue mt-1" />
              <div>
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {selectedAnswers[currentQ.id] !== undefined && !showExplanation && (
              <Button 
                variant="outline"
                onClick={() => setShowExplanation(true)}
              >
                Show Explanation
              </Button>
            )}
            
            <Button 
              onClick={currentQuestion === questions.length - 1 ? handleComplete : handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};