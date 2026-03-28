'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles, ArrowRight, Lightbulb, Code, Rocket, Zap, Command, Copy, Check } from 'lucide-react';
import { AIProvider } from '@/lib/ai/ai-types';
import { ProviderSelector } from './ProviderSelector';

interface IdeaInputProps {
  onGenerate: (input: string, provider: AIProvider) => void;
  isLoading: boolean;
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  quotaExceeded?: boolean;
  initialValue?: string;
}

export function IdeaInput({ 
  onGenerate, 
  isLoading, 
  selectedProvider, 
  onProviderChange,
  quotaExceeded = false,
  initialValue = '',
}: IdeaInputProps) {
  const [input, setInput] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update input when initialValue changes (e.g., from Opportunity Radar)
  useEffect(() => {
    if (initialValue && initialValue.trim()) {
      setInput(initialValue);
    }
  }, [initialValue]);

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
      text: "A productivity app that helps remote workers manage their energy levels throughout the day",
      color: "amber",
    },
    {
      icon: Code,
      text: "A subscription service delivering curated wellness products for busy professionals",
      color: "blue",
    },
    {
      icon: Rocket,
      text: "An AI assistant that automates customer support for small e-commerce businesses",
      color: "violet",
    },
    {
      icon: Zap,
      text: "A marketplace connecting freelance designers with early-stage startups",
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

  const handleCopy = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const progress = Math.min((charCount / 100) * 100, 100);

  return (
    <div className="space-y-6 scale-in">
      {/* Main Input Card */}
      <div 
        className={`
          relative rounded-2xl border-2 transition-all duration-300
          ${isFocused 
            ? 'border-violet-400 shadow-xl shadow-violet-100' 
            : 'border-slate-200 shadow-lg'
          }
          bg-white overflow-visible
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
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              Describe Your Business Idea
            </label>
            <span className={`text-xs ${charCount > 10 ? 'text-violet-600' : 'text-slate-400'}`}>
              {charCount} characters {charCount < 10 && '(min 10)'}
            </span>
          </div>

          {/* Textarea */}
          <div className="relative bg-white rounded-lg">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe the problem you're solving, who it's for, and what makes your solution unique..."
              className="
                min-h-[140px] text-base resize-none 
                border border-slate-200 rounded-lg
                bg-white text-slate-800
                focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:border-violet-400
                focus-visible:ring-offset-0
                placeholder:text-slate-400
                p-3 pr-12
              "
              disabled={isLoading}
            />
            
            {/* Copy Button */}
            {input && (
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-3 top-3 p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                title={copied ? 'Copied!' : 'Copy text'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            {/* Model Selector */}
            <div className="flex items-center gap-3">
              <ProviderSelector
                selectedProvider={selectedProvider}
                onSelect={onProviderChange}
                disabled={isLoading}
                quotaExceeded={quotaExceeded}
              />
              
              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                <span>AI Model</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`
                h-11 px-6 font-semibold rounded-lg transition-all duration-300
                ${isValid && !isLoading
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? 'Creating Blueprint...' : 'Generate Business Plan'}
            </button>
          </div>
        </form>
      </div>

      {/* Example Cards */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-violet-500" />
          Not sure where to start? Try these proven concepts:
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
                  <div className="p-2 rounded-lg bg-white/90 shadow-sm">
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

      {/* Tips - Marketing Focused */}
      <div className="flex items-center gap-4 text-xs text-slate-500 justify-center">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Define the problem clearly
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Identify your ideal customer
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Highlight your unique advantage
        </span>
      </div>
    </div>
  );
}
