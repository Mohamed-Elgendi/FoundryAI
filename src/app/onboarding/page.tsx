'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// ==========================================
// SELF-DISCOVERY QUIZ
// ==========================================

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What's your current situation?",
    options: [
      { value: 'employee', label: 'Full-time employee', icon: '👔' },
      { value: 'freelancer', label: 'Freelancer/Contractor', icon: '💼' },
      { value: 'student', label: 'Student', icon: '🎓' },
      { value: 'unemployed', label: 'Between opportunities', icon: '🌱' },
      { value: 'founder', label: 'Already building', icon: '🚀' }
    ]
  },
  {
    id: 2,
    question: "How much time can you dedicate?",
    options: [
      { value: 'minimal', label: '5-10 hours/week', icon: '⏰' },
      { value: 'part-time', label: '10-20 hours/week', icon: '🌅' },
      { value: 'serious', label: '20-40 hours/week', icon: '💪' },
      { value: 'all-in', label: '40+ hours/week', icon: '🔥' }
    ]
  },
  {
    id: 3,
    question: "What's your primary goal?",
    options: [
      { value: 'side-income', label: '$1K-5K/month side income', icon: '💵' },
      { value: 'replace-job', label: 'Replace my full-time income', icon: '🎯' },
      { value: 'financial-freedom', label: 'Financial freedom ($10K+/month)', icon: '🏖️' },
      { value: 'build-empire', label: 'Build a multi-million business', icon: '🏢' }
    ]
  },
  {
    id: 4,
    question: "What's your biggest strength?",
    options: [
      { value: 'technical', label: 'Technical/Coding', icon: '💻' },
      { value: 'creative', label: 'Creative/Design', icon: '🎨' },
      { value: 'sales', label: 'Sales/Marketing', icon: '📢' },
      { value: 'operations', label: 'Operations/Management', icon: '⚙️' },
      { value: 'domain', label: 'Industry expertise', icon: '🧠' }
    ]
  },
  {
    id: 5,
    question: "Preferred business model?",
    options: [
      { value: 'saas', label: 'SaaS/Product', icon: '☁️' },
      { value: 'content', label: 'Content/Creator', icon: '✍️' },
      { value: 'service', label: 'Service/Agency', icon: '🤝' },
      { value: 'marketplace', label: 'Marketplace/Platform', icon: '🏪' },
      { value: 'ecommerce', label: 'E-commerce/Product', icon: '📦' }
    ]
  }
];

// ==========================================
// ARCHETYPE DEFINITIONS
// ==========================================

const ARCHETYPES = {
  'side-hustler': {
    name: 'The Side Hustler',
    tagline: 'Build while you work',
    description: 'You\'re strategic about building something on the side while maintaining income security.',
    characteristics: ['Time-optimized', 'Risk-averse', 'Patient builder'],
    recommendedPath: 'Start with content or micro-SaaS opportunities',
    color: 'bg-blue-100 text-blue-700'
  },
  'moonlighter': {
    name: 'The Moonlighter',
    tagline: 'Nights and weekends warrior',
    description: 'You burn the candle at both ends, building your future after hours.',
    characteristics: ['Highly motivated', 'Disciplined', 'Resourceful'],
    recommendedPath: 'Focus on opportunities with 10-20 hour weekly commitment',
    color: 'bg-violet-100 text-violet-700'
  },
  'solo-founder': {
    name: 'The Solo Founder',
    tagline: 'One person, big vision',
    description: 'You\'re all-in on building something meaningful, ready to wear every hat.',
    characteristics: ['Self-reliant', 'Fast learner', 'Determined'],
    recommendedPath: 'SaaS or service-based opportunities with your skill stack',
    color: 'bg-emerald-100 text-emerald-700'
  },
  'career-pivoter': {
    name: 'The Career Pivoter',
    tagline: 'New direction, new future',
    description: 'You\'re transitioning from employment to entrepreneurship.',
    characteristics: ['Experienced', 'Transferable skills', 'Strategic'],
    recommendedPath: 'Leverage your industry expertise for consulting or digital products',
    color: 'bg-amber-100 text-amber-700'
  },
  'empire-builder': {
    name: 'The Empire Builder',
    tagline: 'Think big, build bigger',
    description: 'You\'re not just building a business—you\'re building a legacy.',
    characteristics: ['Visionary', 'Ambitious', 'Scalable thinker'],
    recommendedPath: 'Platform or marketplace opportunities with network effects',
    color: 'bg-purple-100 text-purple-700'
  }
};

// ==========================================
// QUIZ COMPONENT
// ==========================================

function SelfDiscoveryQuiz({ onComplete }: { onComplete: (archetype: string) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [QUIZ_QUESTIONS[currentQuestion].id]: value });
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate archetype
      const archetype = calculateArchetype({ ...answers, [QUIZ_QUESTIONS[currentQuestion].id]: value });
      onComplete(archetype);
    }
  };

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-2xl font-bold text-slate-900 mb-6">{question.question}</h3>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-violet-500 hover:bg-violet-50 transition-all text-left"
          >
            <span className="text-2xl">{option.icon}</span>
            <span className="font-medium text-slate-900">{option.label}</span>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}

function calculateArchetype(answers: Record<number, string>): string {
  // Simple algorithm to determine archetype based on answers
  const situation = answers[1];
  const time = answers[2];
  const goal = answers[3];
  const strength = answers[4];
  
  if (situation === 'employee' && time === 'minimal') return 'side-hustler';
  if (situation === 'employee' && (time === 'part-time' || time === 'serious')) return 'moonlighter';
  if (situation === 'founder' || time === 'all-in') return 'solo-founder';
  if (situation === 'unemployed' || goal === 'replace-job') return 'career-pivoter';
  if (goal === 'build-empire' || goal === 'financial-freedom') return 'empire-builder';
  
  return 'side-hustler'; // Default
}

// ==========================================
// ONBOARDING PAGES
// ==========================================

export default function OnboardingPage() {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'archetype' | 'complete'>('welcome');
  const [archetype, setArchetype] = useState<string>('');
  const router = useRouter();

  const handleQuizComplete = (result: string) => {
    setArchetype(result);
    setStep('archetype');
  };

  const handleGetStarted = () => {
    router.push('/radar');
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">FoundryAI</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The platform that transforms your 15-hour doom-scrolling habit into 
            a 14-day product launch reality.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold">14 Days</div>
              <div className="text-slate-400 text-sm">From idea to launch</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <Target className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold">50+</div>
              <div className="text-slate-400 text-sm">AI-validated opportunities</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold">$0</div>
              <div className="text-slate-400 text-sm">Start free, scale up</div>
            </div>
          </div>

          <Button 
            onClick={() => setStep('quiz')}
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 text-lg"
          >
            Discover Your Path
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (step === 'quiz') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setStep('welcome')}
            className="text-slate-500 hover:text-slate-700 mb-8 flex items-center gap-2"
          >
            ← Back
          </button>
          <SelfDiscoveryQuiz onComplete={handleQuizComplete} />
        </div>
      </div>
    );
  }

  // Archetype Result Screen
  if (step === 'archetype') {
    const archetypeData = ARCHETYPES[archetype as keyof typeof ARCHETYPES] || ARCHETYPES['side-hustler'];
    
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-20 h-20 ${archetypeData.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Sparkles className="w-10 h-10" />
            </div>
            
            <Badge className={`${archetypeData.color} mb-4`}>
              Your Archetype
            </Badge>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {archetypeData.name}
            </h2>
            <p className="text-lg text-violet-600 font-medium mb-4">
              {archetypeData.tagline}
            </p>
            <p className="text-slate-600 mb-8">
              {archetypeData.description}
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
              <h4 className="font-semibold text-slate-900 mb-3">Your Characteristics</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {archetypeData.characteristics.map((char) => (
                  <Badge key={char} className="bg-white border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                    {char}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Recommended Path:</span> {archetypeData.recommendedPath}
              </p>
            </div>

            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 px-8"
            >
              Find Your Opportunity
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
