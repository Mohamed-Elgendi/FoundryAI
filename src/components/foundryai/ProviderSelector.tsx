'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { AIProvider, PROVIDER_INFO } from '@/lib/ai/ai-types';
import { cn } from '@/lib/utils';

interface ProviderSelectorProps {
  selectedProvider: AIProvider;
  onSelect: (provider: AIProvider) => void;
  disabled?: boolean;
  quotaExceeded?: boolean;
}

export function ProviderSelector({
  selectedProvider,
  onSelect,
  disabled = false,
  quotaExceeded = false,
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedInfo = PROVIDER_INFO.find(p => p.id === selectedProvider) || PROVIDER_INFO[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          "border bg-white hover:bg-slate-50",
          disabled && "opacity-50 cursor-not-allowed",
          quotaExceeded && "border-red-300 bg-red-50",
          isOpen && "ring-2 ring-violet-200"
        )}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedInfo.color }} />
        <span className="text-slate-700">{selectedInfo.name}</span>
        {quotaExceeded && <AlertCircle className="w-4 h-4 text-red-500" />}
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] left-0 top-full mt-2 w-64 rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-50 border border-violet-200 shadow-[0_8px_32px_rgba(139,92,246,0.2)] max-h-80">
          {/* Glow header */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400" />
          <div className="p-2 overflow-y-auto max-h-[calc(20rem-0.25rem)] scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent">
            {PROVIDER_INFO.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => {
                  onSelect(provider.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2.5 flex items-center gap-3 text-left rounded-lg transition-all",
                  "hover:bg-violet-100/60 hover:scale-[1.02]",
                  selectedProvider === provider.id && "bg-violet-100 shadow-sm"
                )}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: provider.color }} />
                <div className="flex-1 min-w-0">
                  <span className={cn("text-sm font-medium", selectedProvider === provider.id ? "text-violet-700" : "text-slate-700")}>
                    {provider.name}
                  </span>
                </div>
                {selectedProvider === provider.id && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-500">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
