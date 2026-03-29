'use client';

import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { ProviderSelector } from '@/components/foundryai/ProviderSelector';

interface PlanInputProps {
  initialValue?: string;
  provider: string;
  isGenerating: boolean;
  onProviderChange: (provider: string) => void;
  onGenerate: (input: string) => void;
  placeholder?: string;
}

export function PlanInput({
  initialValue = '',
  provider,
  isGenerating,
  onProviderChange,
  onGenerate,
  placeholder = "Describe your business idea or the opportunity you want to explore..."
}: PlanInputProps) {
  const [input, setInput] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onGenerate(input.trim());
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isGenerating}
            className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-white/50 
              focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 
              transition-all duration-200 resize-none
              disabled:opacity-50 disabled:cursor-not-allowed
              text-slate-900 placeholder:text-slate-400"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {input.length} chars
          </div>
        </div>

        <div className="flex items-center justify-between">
          <ProviderSelector
            selectedProvider={provider as any}
            onSelect={onProviderChange as any}
            disabled={isGenerating}
          />

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 
              text-white font-semibold rounded-xl
              hover:from-violet-700 hover:to-indigo-700 
              active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              shadow-lg shadow-violet-500/25"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
