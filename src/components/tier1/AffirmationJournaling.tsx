'use client';

import { useState, useEffect } from 'react';
import { journalService } from '@/layer-3-data/services/tier1-service';
import { 
  Sunrise, 
  Sunset, 
  Heart, 
  Sparkles, 
  PenLine,
  Quote,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Lock,
  Save,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JournalEntry {
  id: string;
  date: string;
  type: 'morning' | 'evening';
  content: string;
  mood: string;
  completed: boolean;
}

interface Affirmation {
  id: string;
  text: string;
  category: string;
  completed: boolean;
}

export default function AffirmationJournaling() {
  const [activeTab, setActiveTab] = useState('morning');
  const [morningAffirmations, setMorningAffirmations] = useState<Affirmation[]>([
    { id: '1', text: 'I am capable of achieving anything I set my mind to', category: 'Capability', completed: false },
    { id: '2', text: 'Today is filled with endless possibilities and opportunities', category: 'Abundance', completed: false },
    { id: '3', text: 'I choose to approach challenges with confidence and grace', category: 'Resilience', completed: false },
    { id: '4', text: 'My actions create constant prosperity', category: 'Success', completed: false },
    { id: '5', text: 'I am aligned with my purpose and passion', category: 'Purpose', completed: false }
  ]);
  
  const [eveningReflection, setEveningReflection] = useState('');
  const [gratitudeList, setGratitudeList] = useState(['', '', '']);
  const [streak, setStreak] = useState(7);
  const [totalEntries, setTotalEntries] = useState(23);
  const [morningCompleted, setMorningCompleted] = useState(false);
  const [eveningCompleted, setEveningCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJournalData();
  }, []);

  const loadJournalData = async () => {
    try {
      setIsLoading(true);
      const data = await journalService.getJournalData();
      
      if (data.streak) {
        setStreak(data.streak.currentStreak || 0);
        setTotalEntries(data.streak.totalEntries || 0);
      }
      
      // Check if morning/evening already completed today
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = data.entries?.filter((e: {createdAt: string, entryType: string}) => {
        const entryDate = new Date(e.createdAt).toISOString().split('T')[0];
        return entryDate === today;
      });
      
      setMorningCompleted(todayEntries?.some((e: {entryType: string}) => e.entryType === 'morning_affirmations') || false);
      setEveningCompleted(todayEntries?.some((e: {entryType: string}) => e.entryType === 'evening_reflection') || false);
    } catch (error) {
      console.error('Error loading journal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAffirmation = (id: string) => {
    setMorningAffirmations(prev => 
      prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    );
  };

  const completeMorningRitual = async () => {
    try {
      const completedAffirmations = morningAffirmations.filter(a => a.completed).map(a => a.text);
      
      await journalService.createEntry({
        entryType: 'morning_affirmations',
        content: `Completed morning affirmations: ${completedAffirmations.join(', ')}`,
        mood: 'empowered',
        affirmationsUsed: completedAffirmations,
        mindAlignmentScore: 8,
        bodyAlignmentScore: 7,
        soulAlignmentScore: 8
      });
      
      setMorningCompleted(true);
      setStreak(s => s + 1);
      setTotalEntries(t => t + 1);
    } catch (error) {
      console.error('Error saving morning ritual:', error);
    }
  };

  const completeEveningRitual = async () => {
    try {
      await journalService.createEntry({
        entryType: 'evening_reflection',
        content: eveningReflection,
        mood: 'grateful',
        gratitudeItems: gratitudeList.filter(g => g.trim()),
        mindAlignmentScore: 7,
        bodyAlignmentScore: 8,
        soulAlignmentScore: 9
      });
      
      setEveningCompleted(true);
      setStreak(s => s + 1);
      setTotalEntries(t => t + 1);
    } catch (error) {
      console.error('Error saving evening ritual:', error);
    }
  };

  const getCompletionPercentage = () => {
    const completed = morningAffirmations.filter(a => a.completed).length;
    return (completed / morningAffirmations.length) * 100;
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-rose-500" />
          Affirmation & Journaling
        </h1>
        <p className="text-slate-600">
          Start your day with powerful affirmations. End with reflection and gratitude.
          Build unshakeable self-belief through daily practice.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">{streak}</div>
            <div className="text-sm text-slate-600">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-emerald-600">{totalEntries}</div>
            <div className="text-sm text-slate-600">Total Entries</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-violet-600">
              {morningCompleted && eveningCompleted ? '100%' : morningCompleted || eveningCompleted ? '50%' : '0%'}
            </div>
            <div className="text-sm text-slate-600">Today's Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning" className="flex items-center gap-2">
            <Sunrise className="w-4 h-4" />
            Morning Ritual (5 min)
            {morningCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex items-center gap-2">
            <Sunset className="w-4 h-4" />
            Evening Ritual (5 min)
            {eveningCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </TabsTrigger>
        </TabsList>

        {/* Morning Ritual */}
        <TabsContent value="morning" className="space-y-4">
          <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-amber-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Sunrise className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Morning Affirmation Ceremony</CardTitle>
                    <CardDescription>Begin your day with empowering declarations</CardDescription>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800">
                  {getCompletionPercentage().toFixed(0)}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={getCompletionPercentage()} className="h-2" />
              
              <div className="space-y-3">
                {morningAffirmations.map((affirmation) => (
                  <div
                    key={affirmation.id}
                    onClick={() => toggleAffirmation(affirmation.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      affirmation.completed 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${affirmation.completed ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {affirmation.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${affirmation.completed ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>
                          "{affirmation.text}"
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {affirmation.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!morningCompleted ? (
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={completeMorningRitual}
                  disabled={getCompletionPercentage() < 100}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Morning Ritual
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">Morning ritual completed!</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setMorningCompleted(false)}
                    className="ml-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proof-Based Affirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Quote className="w-5 h-5 text-violet-500" />
                Evidence-Based Affirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Write one affirmation with proof from your life:
              </p>
              <Textarea 
                placeholder="I am [affirmation] because [specific evidence from my life]..."
                className="min-h-[100px]"
              />
              <Button variant="outline" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save to Evidence Stack
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evening Ritual */}
        <TabsContent value="evening" className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-50 border-indigo-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Sunset className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>Evening Reflection & Gratitude</CardTitle>
                  <CardDescription>Close your day with wisdom and appreciation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Daily Reflection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <PenLine className="w-4 h-4" />
                  Today's Reflection
                </label>
                <Textarea
                  placeholder="What did I learn today? What am I proud of? What would I do differently?"
                  value={eveningReflection}
                  onChange={(e) => setEveningReflection(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Gratitude List */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Three Things I'm Grateful For
                </label>
                <div className="space-y-2">
                  {gratitudeList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 w-6">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newList = [...gratitudeList];
                          newList[idx] = e.target.value;
                          setGratitudeList(newList);
                        }}
                        placeholder={`Gratitude ${idx + 1}...`}
                        className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mind-Body-Soul Alignment */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">Mind-Body-Soul Check</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="p-2 bg-violet-100 rounded-lg w-fit mx-auto">
                      <Brain className="w-4 h-4 text-violet-600" />
                    </div>
                    <p className="text-xs text-slate-600">Mind</p>
                    <Badge variant="outline" className="text-xs">At Peace</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="p-2 bg-rose-100 rounded-lg w-fit mx-auto">
                      <Heart className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-xs text-slate-600">Body</p>
                    <Badge variant="outline" className="text-xs">Rested</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="p-2 bg-amber-100 rounded-lg w-fit mx-auto">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-xs text-slate-600">Soul</p>
                    <Badge variant="outline" className="text-xs">Fulfilled</Badge>
                  </div>
                </div>
              </div>

              {!eveningCompleted ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={completeEveningRitual}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Complete Evening Ritual
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">Evening ritual completed!</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEveningCompleted(false)}
                    className="ml-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journal History Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  Recent Entries
                </div>
                <Button variant="ghost" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Yesterday - Morning & Evening</span>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">2 days ago - Morning & Evening</span>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for the circle icon
function Circle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
}
