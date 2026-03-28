'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles, ArrowRight, Lightbulb, Code, Rocket, Zap, Command } from 'lucide-react';
import { AIProvider } from '@/lib/ai/ai-types';
import { ProviderSelector } from './ProviderSelector';

interface IdeaInputProps {
  onGenerate: (input: string, provider: AIProvider) => void;
  isLoading: boolean;
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  quotaExceeded?: boolean;
  availableProviders?: AIProvider[];
}

export function IdeaInput({ 
  onGenerate, 
  isLoading, 
  selectedProvider, 
  onProviderChange,
  quotaExceeded = false,
  availableProviders = []
}: IdeaInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  const isValid = input.trim().length > 10;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to generate
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValid && !isLoading) {
        e.preventDefault();
        onGenerate(input.trim(), selectedProvider);
      }
      // Escape to clear
      if (e.key === 'Escape' && input) {
        e.preventDefault();
        setInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, isValid, isLoading, onGenerate, selectedProvider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', { input: input.trim(), isValid, isLoading, selectedProvider });
    if (input.trim() && !isLoading) {
      onGenerate(input.trim(), selectedProvider);
    } else {
      console.log('Submit blocked:', { hasInput: !!input.trim(), isLoading });
    }
  };

  const examples = [
  {
    icon: Lightbulb,
    text: "I want to build a tool that helps freelancers track their income and expenses",
    color: "amber",
  },
  {
    icon: Code,
    text: "An app that reminds people to drink water based on their activity level",
    color: "blue",
  },
  {
    icon: Rocket,
    text: "A simple SaaS that generates AI prompts for marketers",
    color: "violet",
  },
  {
    icon: Zap,
    text: "A website where developers can share their side project journeys",
    color: "emerald",
  },
];

const colorMap: Record<string, string> = {
  amber: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200 hover:border-amber-300',
  blue: 'from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-200 hover:border-blue-300',
  violet: 'from-violet-500/10 to-fuchsia-500/10 text-violet-600 border-violet-200 hover:border-violet-300',
  emerald: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200 hover:border-emerald-300',
};

  const handleExampleClick = (example: string) => {
    setInput(example);
    textareaRef.current?.focus();
  };

  const progress = Math.min((charCount / 100) * 100, 100);

  return (
    <div className="space-y-6 scale-in">
      {/* Main Input Card */}
      <div 
        className={`
          relative rounded-2xl border-2 transition-all duration-300
          ${isFocused 
            ? 'border-primary/50 shadow-xl shadow-primary/10' 
            : 'border-border/50 shadow-lg'
          }
          bg-white/80 backdrop-blur-xl overflow-hidden
        `}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative">
          {/* Label */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Describe Your Idea
            </label>
            <span className={`text-xs ${charCount > 10 ? 'text-primary' : 'text-muted-foreground'}`}>
              {charCount} chars {charCount < 10 && '(min 10)'}
            </span>
          </div>

          {/* Textarea */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your idea in detail... What problem does it solve? Who is it for? What makes it unique?"
              className="
                min-h-[160px] text-base resize-none 
                border-0 bg-transparent 
                focus-visible:ring-0 focus-visible:ring-offset-0
                placeholder:text-muted-foreground/60
              "
              disabled={isLoading}
            />
            
            {/* Animated Border Effect - ensure pointer events don't block */}
            <div className={`
              absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 z-0
              ${isFocused ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-sm" />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            {/* Provider Selector - Under Input Box */}
            <div className="flex items-center gap-3">
              <ProviderSelector
                selectedProvider={selectedProvider}
                onSelect={onProviderChange}
                disabled={isLoading}
                quotaExceeded={quotaExceeded}
                availableProviders={availableProviders}
              />
              
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                <Command className="w-3 h-3" />
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↵</kbd>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              onClick={(e) => {
                console.log('Button clicked directly');
                if (isValid && !isLoading) {
                  handleSubmit(e);
                }
              }}
              className={`
                h-11 px-6 font-semibold transition-all duration-300 relative z-10
                ${isValid && !isLoading
                  ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Plan
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Example Cards */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Need inspiration? Try these:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <button
                key={index}
                onClick={() => handleExampleClick(example.text)}
                disabled={isLoading}
                className={`
                  group relative p-4 rounded-xl border text-left transition-all duration-300
                  bg-gradient-to-br ${colorMap[example.color]}
                  hover:shadow-lg hover:-translate-y-0.5
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/80 shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed line-clamp-2">
                    {example.text}
                  </p>
                </div>
                
                {/* Hover Arrow */}
                <ArrowRight className="
                  absolute bottom-3 right-3 w-4 h-4 opacity-0 
                  group-hover:opacity-100 transition-all duration-300
                  group-hover:translate-x-1
                " />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Be specific about the problem
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Mention target users
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          Include unique features
        </span>
      </div>
    </div>
  );
}
