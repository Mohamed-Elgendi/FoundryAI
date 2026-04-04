'use client';

import React, { useState, useEffect } from 'react';
import { beliefService } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Award,
  TrendingUp,
  Star,
  Crown,
  Gem,
  Plus,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BeliefLevel {
  level: number;
  name: string;
  timeframe: string;
  belief: string;
  requiredScore: number;
}

const BELIEF_LEVELS: BeliefLevel[] = [
  {
    level: 1,
    name: 'Micro-Proof Collection',
    timeframe: 'Daily',
    belief: 'I am someone who follows through',
    requiredScore: 20,
  },
  {
    level: 2,
    name: 'Pattern Recognition',
    timeframe: 'Weekly',
    belief: 'I am consistent, even when it is hard',
    requiredScore: 40,
  },
  {
    level: 3,
    name: 'Capability Amplification',
    timeframe: 'Monthly',
    belief: 'I am becoming exponentially more capable',
    requiredScore: 60,
  },
  {
    level: 4,
    name: 'Identity Crystallization',
    timeframe: 'Quarterly',
    belief: 'I am an entrepreneur',
    requiredScore: 80,
  },
  {
    level: 5,
    name: 'Legendary Conviction',
    timeframe: 'Annually',
    belief: 'I am inevitable',
    requiredScore: 95,
  },
];

const BeliefArchitecture: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [beliefScore, setBeliefScore] = useState(50);
  const [beliefLevel, setBeliefLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [evidenceCount, setEvidenceCount] = useState({
    micro: 0,
    pattern: 0,
    capability: 0,
    identity: 0,
    legendary: 0,
  });
  const [recentEvidence, setRecentEvidence] = useState<Array<{
    id: string;
    type: string;
    description: string;
    date: string;
  }>>([]);
  const [newEvidence, setNewEvidence] = useState('');
  const [morningIntention, setMorningIntention] = useState('');
  const [eveningReflection, setEveningReflection] = useState('');

  useEffect(() => {
    loadBeliefData();
  }, []);

  const loadBeliefData = async () => {
    try {
      setIsLoading(true);
      const data = await beliefService.getBeliefData();
      
      if (data.score) {
        setBeliefScore(data.score.overallScore || 50);
        setBeliefLevel(data.score.level || 1);
      }
      
      // Count evidence by type
      const counts = { micro: 0, pattern: 0, capability: 0, identity: 0, legendary: 0 };
      (data.evidence || []).forEach((e: {evidenceType: string}) => {
        if (e.evidenceType === 'micro_proof') counts.micro++;
        else if (e.evidenceType === 'pattern') counts.pattern++;
        else if (e.evidenceType === 'capability') counts.capability++;
        else if (e.evidenceType === 'identity') counts.identity++;
        else if (e.evidenceType === 'legendary') counts.legendary++;
      });
      setEvidenceCount(counts);
      
      setRecentEvidence((data.evidence || []).slice(0, 10).map((e: {id: string; evidenceType: string; description: string; dateRecorded: string}) => ({
        id: e.id,
        type: e.evidenceType,
        description: e.description,
        date: new Date(e.dateRecorded).toLocaleDateString(),
      })));
    } catch (error) {
      console.error('Error loading belief data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvidence = async () => {
    if (!newEvidence.trim()) return;
    
    try {
      await beliefService.addEvidence({
        evidenceType: 'micro_proof',
        description: newEvidence,
        impactScore: 5,
      });
      setNewEvidence('');
      loadBeliefData();
    } catch (error) {
      console.error('Error adding evidence:', error);
    }
  };

  const saveBeliefCalibration = async () => {
    try {
      const newLevel = BELIEF_LEVELS.findIndex(l => beliefScore < l.requiredScore) + 1;
      // Note: This would need a separate API endpoint for belief calibration
      setBeliefLevel(newLevel || 5);
    } catch (error) {
      console.error('Error saving calibration:', error);
    }
  };

  // Mini button
  if (!isOpen) {
    return (
      <div className="fixed bottom-72 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all ${
            beliefScore >= 80
              ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
              : beliefScore >= 50
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gray-600'
          }`}
        >
          <Target className="w-6 h-6" />
        </Button>
        {beliefScore < 50 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500">!</Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-600" />
            <CardTitle>Belief Architecture - Conviction Engine</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Belief Strength</div>
              <div className={`font-bold ${beliefScore >= 80 ? 'text-green-600' : beliefScore >= 50 ? 'text-blue-600' : 'text-orange-600'}`}>
                {beliefScore}/100
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Belief Pyramid */}
          <div className="space-y-2">
            {BELIEF_LEVELS.map((level, idx) => {
              const isActive = level.level === currentLevel;
              const isCompleted = level.level < currentLevel;
              
              return (
                <div
                  key={level.level}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                      : isCompleted
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : 'border-gray-200 bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-amber-500 text-white'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {level.level === 5 ? <Crown className="w-4 h-4" /> : 
                       level.level === 4 ? <Gem className="w-4 h-4" /> :
                       level.level === 3 ? <Star className="w-4 h-4" /> :
                       level.level === 2 ? <Award className="w-4 h-4" /> :
                       <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Level {level.level}: {level.name}</span>
                        <Badge variant={isActive ? 'default' : isCompleted ? 'outline' : 'secondary'}>
                          {isCompleted ? 'Achieved' : isActive ? 'Current' : 'Locked'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {level.timeframe} • &quot;{level.belief}&quot;
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Belief Calibration */}
          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily Belief Calibration (3 minutes)
            </h3>
            
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">1. Morning Intention (1 min)</label>
                <input
                  type="text"
                  value={morningIntention}
                  onChange={(e) => setMorningIntention(e.target.value)}
                  placeholder="Today I believe I can accomplish..."
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">2. Evening Reflection (1 min)</label>
                <input
                  type="text"
                  value={eveningReflection}
                  onChange={(e) => setEveningReflection(e.target.value)}
                  placeholder="Today I proved that I can..."
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium">3. Belief Strength Score</label>
                <div className="flex items-center gap-3 mt-1">
                  <Progress value={beliefScore} className="flex-1" />
                  <input
                    type="number"
                    value={beliefScore}
                    onChange={(e) => setBeliefScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 border rounded text-center"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <Button onClick={saveBeliefCalibration} className="w-full bg-amber-600 hover:bg-amber-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Save Daily Calibration
              </Button>
            </div>
          </div>

          {/* Evidence Stack */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Evidence Stack ({evidenceCount} items)
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newEvidence}
                onChange={(e) => setNewEvidence(e.target.value)}
                placeholder="Add new evidence of your capability..."
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              <Button onClick={addEvidence} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {recentEvidence.slice(0, 5).map((evidence, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted rounded flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Layer {evidence.layer}</Badge>
                  <span className="flex-1 truncate">{evidence.description}</span>
                  <span className="text-xs text-muted-foreground">{evidence.date}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeliefArchitecture;
