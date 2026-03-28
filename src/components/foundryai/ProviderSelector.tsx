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
        <div 
          className="absolute z-[9999] left-0 top-full mt-2 w-64 rounded-2xl max-h-80 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(16px) saturate(200%)',
            WebkitBackdropFilter: 'blur(16px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
          }}
        >
          {/* Top glow line */}
          <div 
            className="absolute top-0 left-4 right-4 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)',
            }}
          />
          <div className="p-2">
            {PROVIDER_INFO.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => {
                  onSelect(provider.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-colors",
                  "hover:bg-slate-50",
                  selectedProvider === provider.id && "bg-violet-50"
                )}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: provider.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-sm font-medium", selectedProvider === provider.id ? "text-violet-700" : "text-slate-700")}>
                      {provider.name}
                    </span>
                  </div>
                </div>
                {selectedProvider === provider.id && <Check className="w-4 h-4 text-violet-600 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
