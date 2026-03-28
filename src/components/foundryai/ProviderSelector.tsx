'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Bot, Zap, Sparkles, Check, AlertCircle } from 'lucide-react';
import { AIProvider, ProviderInfo, PROVIDER_INFO, getDefaultProvider } from '@/lib/ai/ai-types';
import { cn } from '@/lib/utils';

interface ProviderSelectorProps {
  selectedProvider: AIProvider;
  onSelect: (provider: AIProvider) => void;
  disabled?: boolean;
  quotaExceeded?: boolean;
  availableProviders?: AIProvider[];
}

export function ProviderSelector({
  selectedProvider,
  onSelect,
  disabled = false,
  quotaExceeded = false,
  availableProviders = []
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedInfo = PROVIDER_INFO.find(p => p.id === selectedProvider) || PROVIDER_INFO[0];

  // Group providers by category
  const groupedProviders = {
    premium: PROVIDER_INFO.filter(p => p.category === 'premium'),
    fast: PROVIDER_INFO.filter(p => p.category === 'fast'),
    free: PROVIDER_INFO.filter(p => p.category === 'free'),
    experimental: PROVIDER_INFO.filter(p => p.category === 'experimental'),
  };

  const getCategoryIcon = (category: ProviderInfo['category']) => {
    switch (category) {
      case 'premium':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'fast':
        return <Zap className="w-3.5 h-3.5" />;
      case 'free':
        return <Bot className="w-3.5 h-3.5" />;
      default:
        return <Bot className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (category: ProviderInfo['category']) => {
    switch (category) {
      case 'premium':
        return 'Premium';
      case 'fast':
        return 'Fast';
      case 'free':
        return 'Free Tier';
      case 'experimental':
        return 'Experimental';
      default:
        return category;
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected Provider Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          "border bg-background hover:bg-accent",
          disabled && "opacity-50 cursor-not-allowed",
          quotaExceeded && "border-red-300 bg-red-50",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: selectedInfo.color }}
        />
        <span className="hidden sm:inline">{selectedInfo.name}</span>
        <span className="sm:hidden">
          {selectedInfo.name.split(' ')[0]}
        </span>
        {quotaExceeded && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-[320px] max-w-[90vw] bg-popover border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Header */}
          <div className="px-3 py-2 border-b bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Select AI Model
            </p>
          </div>

          {/* Provider Groups */}
          <div className="max-h-[400px] overflow-y-auto">
            {/* Show quota warning if applicable */}
            {quotaExceeded && (
              <div className="px-3 py-2 bg-red-50 border-b">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-700">
                      Claude quota exceeded
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Please select another provider
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Providers */}
            {groupedProviders.premium.length > 0 && (
              <div className="py-1">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Premium
                </div>
                {groupedProviders.premium.map((provider) => (
                  <ProviderItem
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedProvider === provider.id}
                    onClick={() => {
                      onSelect(provider.id);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Fast Providers */}
            {groupedProviders.fast.length > 0 && (
              <div className="py-1 border-t">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Zap className="w-3 h-3" />
                  Fast
                </div>
                {groupedProviders.fast.map((provider) => (
                  <ProviderItem
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedProvider === provider.id}
                    onClick={() => {
                      onSelect(provider.id);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Free Providers */}
            {groupedProviders.free.length > 0 && (
              <div className="py-1 border-t">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Bot className="w-3 h-3" />
                  Free Tier
                </div>
                {groupedProviders.free.map((provider) => (
                  <ProviderItem
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedProvider === provider.id}
                    onClick={() => {
                      onSelect(provider.id);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Experimental Providers */}
            {groupedProviders.experimental.length > 0 && (
              <div className="py-1 border-t">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Bot className="w-3 h-3" />
                  Experimental
                </div>
                {groupedProviders.experimental.map((provider) => (
                  <ProviderItem
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedProvider === provider.id}
                    onClick={() => {
                      onSelect(provider.id);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
            <p>Select a model to generate your business plan</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual provider item component
interface ProviderItemProps {
  provider: ProviderInfo;
  isSelected: boolean;
  onClick: () => void;
}

function ProviderItem({ provider, isSelected, onClick }: ProviderItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full px-3 py-2 flex items-center gap-3 text-left transition-colors",
        "hover:bg-accent focus:bg-accent focus:outline-none",
        isSelected && "bg-accent"
      )}
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: provider.color }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-sm font-medium truncate",
            isSelected && "text-foreground"
          )}>
            {provider.name}
          </span>
          {provider.recommended && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
              Best
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {provider.description}
        </p>
      </div>

      {isSelected && (
        <Check className="w-4 h-4 text-primary flex-shrink-0" />
      )}
    </button>
  );
}
