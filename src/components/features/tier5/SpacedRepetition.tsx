'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Clock, 
  RotateCcw,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Zap,
  Calendar,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardReview {
  id: string;
  cardId: string;
  frontContent: string;
  backContent: string;
  category: string;
  difficulty: number;
  interval: number;
  streak: number;
  totalReviews: number;
  correctReviews: number;
}

export default function SpacedRepetition() {
  const [currentCard, setCurrentCard] = useState<CardReview | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<CardReview[]>([]);
  const [stats, setStats] = useState({
    dueToday: 0,
    completedToday: 0,
    streakDays: 0,
    totalCards: 0,
    retentionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviewData();
  }, []);

  const loadReviewData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockCards: CardReview[] = [
        {
          id: '1',
          cardId: 'c1',
          frontContent: 'What is the primary metric for SaaS success?',
          backContent: 'Monthly Recurring Revenue (MRR) - The predictable revenue stream from subscriptions.',
          category: 'SaaS',
          difficulty: 3,
          interval: 3,
          streak: 5,
          totalReviews: 12,
          correctReviews: 10,
        },
        {
          id: '2',
          cardId: 'c2',
          frontContent: 'What is the Rule of 40 in SaaS?',
          backContent: 'Growth rate + Profit margin should equal or exceed 40%. A healthy SaaS balances growth and profitability.',
          category: 'SaaS',
          difficulty: 4,
          interval: 7,
          streak: 3,
          totalReviews: 8,
          correctReviews: 7,
        },
        {
          id: '3',
          cardId: 'c3',
          frontContent: 'What is Product-Market Fit?',
          backContent: 'When your product satisfies strong market demand. Signs: 40%+ of users would be "very disappointed" without it.',
          category: 'Product',
          difficulty: 2,
          interval: 1,
          streak: 1,
          totalReviews: 3,
          correctReviews: 2,
        },
        {
          id: '4',
          cardId: 'c4',
          frontContent: 'What is Customer Acquisition Cost (CAC)?',
          backContent: 'Total cost of acquiring a new customer (marketing + sales) divided by number of new customers.',
          category: 'Marketing',
          difficulty: 2,
          interval: 2,
          streak: 4,
          totalReviews: 6,
          correctReviews: 6,
        },
      ];
      
      setReviewQueue(mockCards);
      setCurrentCard(mockCards[0]);
      setStats({
        dueToday: mockCards.length,
        completedToday: 0,
        streakDays: 7,
        totalCards: 156,
        retentionRate: 87,
      });
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = (rating: number) => {
    // Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
    const updatedQueue = reviewQueue.slice(1);
    setReviewQueue(updatedQueue);
    setCurrentCard(updatedQueue[0] || null);
    setShowAnswer(false);
    
    setStats(prev => ({
      ...prev,
      dueToday: updatedQueue.length,
      completedToday: prev.completedToday + 1,
    }));
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['bg-green-100 text-green-800', 'bg-blue-100 text-blue-800', 'bg-amber-100 text-amber-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
    return colors[difficulty - 1] || colors[2];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-violet-600" />
            Knowledge Retention
          </h1>
          <p className="text-slate-600">Spaced repetition for long-term learning</p>
        </div>

        <Card className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">All Caught Up!</h2>
            <p className="text-emerald-700 mb-4">
              You've completed all reviews for today. Great job maintaining your learning streak!
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {stats.streakDays} day streak
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {stats.totalCards} total cards
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {stats.retentionRate}% retention
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-violet-600" />
          Knowledge Retention
        </h1>
        <p className="text-slate-600">Spaced repetition system based on SM-2 algorithm</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" />
            <span className="font-medium">{stats.completedToday} / {stats.dueToday + stats.completedToday} completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-medium">{stats.streakDays} day streak</span>
          </div>
        </div>
        <div className="w-32">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 transition-all duration-300"
              style={{ width: `${(stats.completedToday / (stats.dueToday + stats.completedToday)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        {currentCard && (
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="min-h-[300px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{currentCard.category}</Badge>
                  <Badge className={getDifficultyColor(currentCard.difficulty)}>
                    Difficulty {currentCard.difficulty}/5
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="text-center space-y-6">
                  <div>
                    <div className="text-sm text-slate-500 mb-2">Question</div>
                    <div className="text-xl font-medium">{currentCard.frontContent}</div>
                  </div>

                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-6 border-t"
                    >
                      <div className="text-sm text-slate-500 mb-2">Answer</div>
                      <div className="text-lg">{currentCard.backContent}</div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {!showAnswer ? (
        <Button 
          className="w-full h-16 text-lg"
          onClick={() => setShowAnswer(true)}
        >
          Show Answer
        </Button>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-16 border-red-300 hover:bg-red-50"
            onClick={() => handleReview(1)}
          >
            <div className="text-center">
              <div className="text-sm font-medium">Again</div>
              <div className="text-xs text-slate-500">&lt; 1 min</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-16 border-amber-300 hover:bg-amber-50"
            onClick={() => handleReview(2)}
          >
            <div className="text-center">
              <div className="text-sm font-medium">Hard</div>
              <div className="text-xs text-slate-500">2 days</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-16 border-emerald-300 hover:bg-emerald-50"
            onClick={() => handleReview(3)}
          >
            <div className="text-center">
              <div className="text-sm font-medium">Good</div>
              <div className="text-xs text-slate-500">4 days</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-16 border-blue-300 hover:bg-blue-50"
            onClick={() => handleReview(4)}
          >
            <div className="text-center">
              <div className="text-sm font-medium">Easy</div>
              <div className="text-xs text-slate-500">7 days</div>
            </div>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold">{stats.totalCards}</div>
          <div className="text-sm text-slate-600">Total Cards</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold">{stats.retentionRate}%</div>
          <div className="text-sm text-slate-600">Retention Rate</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold">{currentCard?.streak || 0}</div>
          <div className="text-sm text-slate-600">Current Streak</div>
        </Card>
      </div>
    </div>
  );
}
