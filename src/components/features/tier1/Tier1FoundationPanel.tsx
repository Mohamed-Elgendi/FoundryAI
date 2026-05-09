'use client';
 
import React, { useState, useEffect } from 'react';
import { tier1Service } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BrainDumpSystem from './BrainDumpSystem';
import DistractionsKiller from './DistractionsKiller';
import EmotionController from './EmotionController';
import MomentumBuilder from './MomentumBuilder';
import BeliefArchitecture from './BeliefArchitecture';
import ConfidenceCore from './ConfidenceCore';
import {
  Shield,
  Brain,
  Wind,
  RotateCcw,
  Target,
  Trophy,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
 
interface FoundationStatus {
  foundationHealth: number;
  activeSystems: number;
  totalSystems: number;
  lastAssessment: string;
}
 
export function Tier1FoundationPanel() {
  const [status, setStatus] = useState<FoundationStatus>({
    foundationHealth: 85,
    activeSystems: 6,
    totalSystems: 6,
    lastAssessment: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['brain-dump']);

  // Fetch real data from APIs using service layer
  useEffect(() => {
    const fetchFoundationData = async () => {
      try {
        setLoading(true);
        
        // Fetch all Tier 1 data using the composite service
        const data = await tier1Service.getAllFoundationData();
        
        // Calculate foundation health based on actual data
        const systems = [
          { name: 'brain-dump', active: true },
          { name: 'distractions', active: (data.focus?.score?.currentScore || 0) > 50 },
          { name: 'emotion', active: (data.emotion?.checkins?.length || 0) > 0 },
          { name: 'momentum', active: (data.momentum?.stats?.averageScore || 0) > 30 },
          { name: 'belief', active: (data.belief?.evidence?.length || 0) > 0 },
          { name: 'confidence', active: (data.confidence?.cq?.overallCq || 0) > 50 }
        ];

        const activeCount = systems.filter(s => s.active).length;
        const health = Math.round(
          ((data.focus?.score?.currentScore || 50) + 
           (data.momentum?.stats?.averageScore || 50) + 
           (data.confidence?.cq?.overallCq || 50) + 
           (data.belief?.score?.overallScore || 50)) / 4
        );

        setStatus({
          foundationHealth: health,
          activeSystems: activeCount,
          totalSystems: 6,
          lastAssessment: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching foundation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoundationData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchFoundationData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
 
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Foundation Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              {loading ? (
                <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold">{status.foundationHealth}%</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-500" />
              {loading ? (
                <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold">{status.activeSystems}/{status.totalSystems}</span>
              )}
            </div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Momentum Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              {loading ? (
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold">
                  {status.foundationHealth > 80 ? 'High' : status.foundationHealth > 50 ? 'Medium' : 'Low'}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Belief Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold">92%</span>
            </div>
          </CardContent>
        </Card>
      </div>
 
      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Brain Dump System */}
        <Card>
          <button 
            onClick={() => toggleSection('brain-dump')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/20">
                <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Brain Dump System</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Capture and organize your ideas</p>
              </div>
            </div>
            {expandedSections.includes('brain-dump') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {expandedSections.includes('brain-dump') && (
            <CardContent className="pt-0">
              <BrainDumpSystem />
            </CardContent>
          )}
        </Card>
 
        {/* Confidence Core */}
        <Card>
          <button 
            onClick={() => toggleSection('confidence')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Confidence Core</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Build unshakeable confidence</p>
              </div>
            </div>
            {expandedSections.includes('confidence') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {expandedSections.includes('confidence') && (
            <CardContent className="pt-0">
              <ConfidenceCore />
            </CardContent>
          )}
        </Card>
 
        {/* Distractions Killer */}
        <Card>
          <button 
            onClick={() => toggleSection('focus')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Distractions Killer</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Eliminate focus disruptors</p>
              </div>
            </div>
            {expandedSections.includes('focus') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {expandedSections.includes('focus') && (
            <CardContent className="pt-0">
              <DistractionsKiller />
            </CardContent>
          )}
        </Card>
 
        {/* Emotion Controller */}
        <Card>
          <button 
            onClick={() => toggleSection('emotion')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                <Wind className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Emotion Controller</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Master emotional regulation</p>
              </div>
            </div>
            {expandedSections.includes('emotion') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {expandedSections.includes('emotion') && (
            <CardContent className="pt-0">
              <EmotionController />
            </CardContent>
          )}
        </Card>
 
        {/* Momentum Builder */}
        <Card>
          <button 
            onClick={() => toggleSection('momentum')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Momentum Builder</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Maintain consistent progress</p>
              </div>
            </div>
            {expandedSections.includes('momentum') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {expandedSections.includes('momentum') && (
            <CardContent className="pt-0">
              <MomentumBuilder />
            </CardContent>
          )}
        </Card>
 
        {/* Belief Architecture */}
        <Card>
          <button 
            onClick={() => toggleSection('belief')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Belief Architecture</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Align beliefs with success</p>
              </div>
            </div>
            {expandedSections.includes('belief') ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {expandedSections.includes('belief') && (
            <CardContent className="pt-0">
              <BeliefArchitecture />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
 
export default Tier1FoundationPanel;
