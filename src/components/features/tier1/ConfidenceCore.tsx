'use client';

import React, { useState, useEffect } from 'react';
import { confidenceService } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Target,
  Sparkles,
  ChevronRight,
  Award,
  BarChart3,
  Plus
} from 'lucide-react';

interface DomainConfidence {
  domain: string;
  score: number;
  trend: 'rising' | 'stable' | 'declining';
  evidence: string[];
}

const DOMAINS = [
  { id: 'technical', name: 'Technical/Coding', icon: <Zap className="w-4 h-4" /> },
  { id: 'sales', name: 'Sales/Marketing', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'business', name: 'Business Strategy', icon: <Target className="w-4 h-4" /> },
  { id: 'creative', name: 'Creative/Design', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'communication', name: 'Communication', icon: <Award className="w-4 h-4" /> },
  { id: 'leadership', name: 'Leadership', icon: <Shield className="w-4 h-4" /> },
];

const ConfidenceCore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [overallCQ, setOverallCQ] = useState(60);
  const [domainScores, setDomainScores] = useState<Record<string, number>>({});
  const [recentEvidence, setRecentEvidence] = useState<string[]>([]);
  const [newEvidence, setNewEvidence] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [interventionHistory, setInterventionHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfidenceData();
  }, []);

  const loadConfidenceData = async () => {
    try {
      setIsLoading(true);
      const data = await confidenceService.getConfidenceData();
      
      if (data.cq) {
        setOverallCQ(data.cq.overallCq || 60);
        setDomainScores({
          technical: data.cq.technicalCq || 40,
          sales: data.cq.salesCq || 40,
          business: data.cq.strategyCq || 40,
          creative: data.cq.creativeCq || 50,
          communication: data.cq.communicationCq || 45,
          leadership: data.cq.leadershipCq || 35,
        });
      }
      
      setRecentEvidence((data.evidence || []).slice(0, 5).map((e: {description: string}) => e.description));
    } catch (error) {
      console.error('Error loading confidence data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestIntervention = async (domain: string) => {
    // Note: Would need a separate API endpoint for interventions
    console.log('Requesting intervention for', domain);
  };

  const addEvidence = async () => {
    if (!newEvidence.trim() || !selectedDomain) return;
    
    try {
      await confidenceService.addEvidence({
        layer: 1,
        evidenceType: 'micro_win',
        description: newEvidence,
        domain: selectedDomain as 'technical' | 'sales' | 'strategy' | 'creative' | 'communication' | 'leadership' | 'general',
        impactRating: 5,
      });
      
      setNewEvidence('');
      loadConfidenceData();
    } catch (error) {
      console.error('Error adding evidence:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Mini button
  if (!isOpen) {
    return (
      <div className="fixed bottom-88 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all ${
            overallCQ >= 70
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
              : overallCQ >= 50
                ? 'bg-blue-600'
                : 'bg-orange-600'
          }`}
        >
          <Trophy className="w-6 h-6" />
        </Button>
        {overallCQ < 60 && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500">!</Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-600" />
            <CardTitle>Confidence Core - Evidence Stack</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Overall CQ</div>
              <div className={`font-bold ${getScoreColor(overallCQ)}`}>
                {overallCQ}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Confidence */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Confidence Quotient (CQ)</h3>
              <Badge className={overallCQ >= 60 ? 'bg-green-500' : 'bg-yellow-500'}>
                {overallCQ >= 80 ? 'High' : overallCQ >= 60 ? 'Good' : overallCQ >= 40 ? 'Moderate' : 'Needs Attention'}
              </Badge>
            </div>
            <Progress value={overallCQ} className={`h-3 ${getScoreBg(overallCQ)}`} />
            <p className="text-sm text-muted-foreground mt-2">
              Based on {DOMAINS.length} capability domains • 
              {overallCQ >= 80 ? ' Unlock advanced challenges!' : 
               overallCQ < 60 ? ' Interventions recommended' : ' Steady growth'}
            </p>
          </div>

          {/* Domain-Specific Scores */}
          <div className="space-y-2">
            <h3 className="font-semibold">Domain-Specific Confidence</h3>
            <div className="grid grid-cols-2 gap-2">
              {DOMAINS.map((domain) => {
                const score = domainScores[domain.id] || 50;
                const isSelected = selectedDomain === domain.id;
                
                return (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(isSelected ? null : domain.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                        : 'border-gray-200 hover:border-gray-300 bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {domain.icon}
                        <span className="font-medium text-sm">{domain.name}</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                    </div>
                    <Progress value={score} className={`mt-2 h-1 ${getScoreBg(score)}`} />
                    {score < 60 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestIntervention(domain.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="w-full mt-1 text-xs text-orange-600"
                      >
                        Request Support
                      </Button>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Evidence */}
          {selectedDomain && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Evidence for {DOMAINS.find(d => d.id === selectedDomain)?.name}
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="I accomplished... / I learned... / I overcame..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button onClick={addEvidence} size="sm">
                  <Trophy className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Recent Evidence Stack */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Recent Evidence Stack
            </h3>
            <div className="space-y-1">
              {recentEvidence.map((evidence, idx) => (
                <div key={idx} className="text-sm p-2 bg-muted rounded flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="flex-1">{evidence}</span>
                </div>
              ))}
              {recentEvidence.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No evidence recorded yet. Start stacking proof of your capabilities!
                </div>
              )}
            </div>
          </div>

          {/* Intervention History */}
          {interventionHistory.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-sm">Recent Interventions</h3>
              <div className="flex flex-wrap gap-2">
                {interventionHistory.map((intervention, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-yellow-50">
                    {intervention}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfidenceCore;
