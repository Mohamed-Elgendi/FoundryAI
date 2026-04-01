'use client';

import { useState } from 'react';
import { useWorkflow, FOURTEEN_DAY_PROTOCOL, BRAIN_DUMP_CATEGORIES } from '@/layer-4-logic/workflows/14-day-launch';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  MessageCircle, 
  Sparkles,
  Lightbulb,
  Trophy,
  Flame,
  ChevronRight,
  Plus
} from 'lucide-react';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, category: string) => void;
}

function BrainDumpModal({ isOpen, onClose, onSubmit }: BrainDumpModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('idea');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Brain Dump</h3>
        <p className="text-slate-600 mb-4">Capture your thoughts before they disappear...</p>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Ideas, tasks, concerns, wins..."
          className="w-full h-32 p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        
        <div className="flex gap-2 mt-4 flex-wrap">
          {BRAIN_DUMP_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.value ? cat.color : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (content.trim()) {
                onSubmit(content, category);
                setContent('');
                onClose();
              }
            }}
            className="flex-1 bg-violet-600 hover:bg-violet-700"
          >
            Save Thought
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DailyCheckInProps {
  day: number;
  step: typeof FOURTEEN_DAY_PROTOCOL[0];
  progress: { completedTasks: string[]; checkInCompleted: boolean };
  onCompleteTask: (task: string) => void;
  onCompleteCheckIn: (notes: string) => void;
}

function DailyCheckIn({ day, step, progress, onCompleteTask, onCompleteCheckIn }: DailyCheckInProps) {
  const [notes, setNotes] = useState('');
  const [showCheckIn, setShowCheckIn] = useState(false);

  const completedCount = progress?.completedTasks?.length || 0;
  const totalTasks = step.tasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-violet-50 text-violet-700 border-violet-200">
              Day {day} of 14
            </Badge>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {step.estimatedHours} hours estimated
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
          <p className="text-slate-600 mt-1">{step.description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-violet-600">{progressPercent}%</div>
          <div className="text-sm text-slate-500">{completedCount}/{totalTasks} tasks</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
        <div 
          className="bg-violet-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Tasks */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-violet-600" />
          Today's Tasks
        </h3>
        {step.tasks.map((task, index) => {
          const isCompleted = progress?.completedTasks?.includes(task);
          return (
            <button
              key={index}
              onClick={() => onCompleteTask(task)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-slate-200 hover:border-violet-300'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              )}
              <span className={isCompleted ? 'text-green-700 line-through' : 'text-slate-700'}>
                {task}
              </span>
            </button>
          );
        })}
      </div>

      {/* Milestone */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 mb-6 border border-violet-100">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-violet-600" />
          <span className="font-semibold text-violet-900">Milestone: {step.milestone}</span>
        </div>
        <p className="text-sm text-violet-700">
          Complete all tasks to unlock this milestone and advance to the next day.
        </p>
      </div>

      {/* Check-in Section */}
      {!progress?.checkInCompleted ? (
        <div className="border-t border-slate-200 pt-6">
          {!showCheckIn ? (
            <Button 
              onClick={() => setShowCheckIn(true)}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Complete Daily Check-in
            </Button>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Daily Check-in</h4>
              {step.checkInQuestions.map((question, idx) => (
                <p key={idx} className="text-sm text-slate-600">• {question}</p>
              ))}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your progress, blockers, and insights..."
                className="w-full h-24 p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-violet-500"
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCheckIn(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => onCompleteCheckIn(notes)}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                >
                  Submit Check-in
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-slate-200 pt-6">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Check-in Complete
          </Badge>
          {notes && (
            <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN BUILD PAGE
// ==========================================

export default function BuildPage() {
  const [showBrainDump, setShowBrainDump] = useState(false);
  const [userId] = useState('temp-user-id'); // Replace with actual auth
  
  const {
    state,
    currentStep,
    allSteps,
    progress,
    start,
    completeTask,
    completeCheckIn,
    addBrainDump
  } = useWorkflow(userId);

  if (!state.isActive) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-violet-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              14-Day Launch Protocol
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Ready to transform your opportunity into a launched product? 
              Follow our proven 14-day system to go from idea to live product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={start}
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 px-8"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">14</div>
                <div className="text-sm text-slate-500">Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">56</div>
                <div className="text-sm text-slate-500">Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">1</div>
                <div className="text-sm text-slate-500">Launched Product</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dayProgress = state.progress.find(p => p.day === state.currentDay);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">Build</h1>
            <Badge className="bg-violet-100 text-violet-700">
              Day {state.currentDay} of 14
            </Badge>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Momentum Score */}
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-slate-900">{state.momentumScore}</span>
              <span className="text-sm text-slate-500">momentum</span>
            </div>
            
            {/* Streak */}
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-slate-900">{state.streakDays}</span>
              <span className="text-sm text-slate-500">day streak</span>
            </div>
            
            {/* Brain Dump Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBrainDump(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Brain Dump
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100">
          <div 
            className="h-full bg-violet-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Daily Check-in */}
          <div className="lg:col-span-2">
            {currentStep && (
              <DailyCheckIn
                day={state.currentDay}
                step={currentStep}
                progress={dayProgress || { completedTasks: [], checkInCompleted: false }}
                onCompleteTask={(task) => completeTask(state.currentDay, task)}
                onCompleteCheckIn={(notes) => completeCheckIn(state.currentDay, notes, '')}
              />
            )}
          </div>

          {/* Right: Overview & Resources */}
          <div className="space-y-6">
            {/* Protocol Overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Protocol Overview
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allSteps.map((step, idx) => {
                  const isActive = idx + 1 === state.currentDay;
                  const isCompleted = idx + 1 < state.currentDay;
                  return (
                    <div 
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                        isActive ? 'bg-violet-50 border border-violet-200' : 
                        isCompleted ? 'bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-violet-600 text-white' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={isActive ? 'font-medium text-violet-900' : 'text-slate-600'}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources */}
            {currentStep && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Today's Resources</h3>
                <ul className="space-y-2">
                  {currentStep.resources.map((resource, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Brain Dumps */}
            {state.brainDumps.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Recent Brain Dumps</h3>
                <div className="space-y-3">
                  {state.brainDumps.slice(-3).map((dump) => (
                    <div key={dump.id} className="text-sm">
                      <Badge 
                        className={BRAIN_DUMP_CATEGORIES.find(c => c.value === dump.category)?.color}
                      >
                        {BRAIN_DUMP_CATEGORIES.find(c => c.value === dump.category)?.label}
                      </Badge>
                      <p className="mt-1 text-slate-600 line-clamp-2">{dump.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Brain Dump Modal */}
      <BrainDumpModal
        isOpen={showBrainDump}
        onClose={() => setShowBrainDump(false)}
        onSubmit={(content, category) => addBrainDump(content, category as any)}
      />
    </div>
  );
}
