'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Target, 
  Zap, 
  TrendingUp, 
  Calendar,
  Settings,
  Bell,
  User,
  Rocket,
  Brain,
  Sparkles
} from 'lucide-react';

// Import dashboard components
import Tier1DashboardSummary from '@/components/dashboard/Tier1DashboardSummary';
import OpportunityRadarDashboard from '@/components/dashboard/OpportunityRadarDashboard';
import IdeaExtractor from '@/components/dashboard/IdeaExtractor';
import FourteenDayLaunch from '@/components/dashboard/FourteenDayLaunch';
import RevenueDashboard from '@/components/dashboard/RevenueDashboard';

interface MainDashboardProps {
  userName?: string;
  businessArchetype?: string;
}

export function MainDashboard({ userName = 'Founder', businessArchetype = 'Digital Creator' }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showIdeaExtractor, setShowIdeaExtractor] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  FoundryAI
                </h1>
                <p className="text-xs text-muted-foreground">{businessArchetype}</p>
              </div>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Button 
                variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('overview')}
                className={activeTab === 'overview' ? 'bg-violet-600' : ''}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button 
                variant={activeTab === 'foundation' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('foundation')}
                className={activeTab === 'foundation' ? 'bg-violet-600' : ''}
              >
                <Brain className="w-4 h-4 mr-2" />
                Foundation
              </Button>
              <Button 
                variant={activeTab === 'radar' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('radar')}
                className={activeTab === 'radar' ? 'bg-violet-600' : ''}
              >
                <Target className="w-4 h-4 mr-2" />
                Radar
              </Button>
              <Button 
                variant={activeTab === 'launch' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('launch')}
                className={activeTab === 'launch' ? 'bg-violet-600' : ''}
              >
                <Zap className="w-4 h-4 mr-2" />
                Launch
              </Button>
              <Button 
                variant={activeTab === 'revenue' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('revenue')}
                className={activeTab === 'revenue' ? 'bg-violet-600' : ''}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Revenue
              </Button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowIdeaExtractor(!showIdeaExtractor)}
                className="hidden md:flex"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Extract Idea
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t">
          <div className="flex overflow-x-auto p-2 gap-1">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('overview')}
              className={`flex-shrink-0 ${activeTab === 'overview' ? 'bg-violet-600' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'foundation' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('foundation')}
              className={`flex-shrink-0 ${activeTab === 'foundation' ? 'bg-violet-600' : ''}`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Foundation
            </Button>
            <Button 
              variant={activeTab === 'radar' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('radar')}
              className={`flex-shrink-0 ${activeTab === 'radar' ? 'bg-violet-600' : ''}`}
            >
              <Target className="w-4 h-4 mr-2" />
              Radar
            </Button>
            <Button 
              variant={activeTab === 'launch' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('launch')}
              className={`flex-shrink-0 ${activeTab === 'launch' ? 'bg-violet-600' : ''}`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Launch
            </Button>
            <Button 
              variant={activeTab === 'revenue' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('revenue')}
              className={`flex-shrink-0 ${activeTab === 'revenue' ? 'bg-violet-600' : ''}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Revenue
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {userName}! 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Idea Extractor Modal */}
        {showIdeaExtractor && (
          <div className="mb-8">
            <IdeaExtractor onClose={() => setShowIdeaExtractor(false)} />
          </div>
        )}

        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickStatCard
                title="Foundation Health"
                value="85%"
                icon={Brain}
                color="text-violet-600"
                bgColor="bg-violet-100"
              />
              <QuickStatCard
                title="Opportunities"
                value="12"
                icon={Target}
                color="text-blue-600"
                bgColor="bg-blue-100"
              />
              <QuickStatCard
                title="Launch Day"
                value="Day 7"
                icon={Calendar}
                color="text-amber-600"
                bgColor="bg-amber-100"
              />
              <QuickStatCard
                title="MTD Revenue"
                value="$2,450"
                icon={TrendingUp}
                color="text-green-600"
                bgColor="bg-green-100"
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Foundation Summary */}
              <div className="lg:col-span-2 space-y-6">
                <Tier1DashboardSummary />
              </div>

              {/* Right Column - Quick Actions & Launch Status */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Brain className="w-4 h-4 mr-2" />
                      Morning Ritual
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      Check Radar
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      Focus Session
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setShowIdeaExtractor(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Extract Idea
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-violet-900">14-Day Launch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-violet-700">Current Day</span>
                        <Badge className="bg-violet-100 text-violet-800">Day 7</Badge>
                      </div>
                      <div className="w-full bg-violet-200 rounded-full h-2">
                        <div className="bg-violet-600 h-2 rounded-full" style={{ width: '50%' }} />
                      </div>
                      <p className="text-sm text-violet-700">
                        First Revenue Focus - DM 20 potential customers today!
                      </p>
                      <Button 
                        className="w-full bg-violet-600 hover:bg-violet-700"
                        onClick={() => setActiveTab('launch')}
                      >
                        Continue Launch
                        <Rocket className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="foundation">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Tier 1 Core Foundation</h3>
                  <p className="text-muted-foreground">Master your psychology, build unshakeable foundations</p>
                </div>
                <Badge variant="outline" className="text-sm">
                  8 Systems Active
                </Badge>
              </div>
              <Tier1DashboardSummary />
            </div>
          </TabsContent>

          <TabsContent value="radar">
            <OpportunityRadarDashboard />
          </TabsContent>

          <TabsContent value="launch">
            <FourteenDayLaunch />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function QuickStatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MainDashboard;
