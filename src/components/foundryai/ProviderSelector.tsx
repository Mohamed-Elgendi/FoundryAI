'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Bot, Zap, Sparkles, Check, AlertCircle, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedInfo = PROVIDER_INFO.find(p => p.id === selectedProvider) || PROVIDER_INFO[0];

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return PROVIDER_INFO;
    const query = searchQuery.toLowerCase();
    return PROVIDER_INFO.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered providers by category
  const groupedProviders = useMemo(() => ({
    premium: filteredProviders.filter(p => p.category === 'premium'),
    fast: filteredProviders.filter(p => p.category === 'fast'),
    free: filteredProviders.filter(p => p.category === 'free'),
    experimental: filteredProviders.filter(p => p.category === 'experimental'),
  }), [filteredProviders]);

  // Check if we have any results
  const hasResults = Object.values(groupedProviders).some(group => group.length > 0);

  // Always include selected provider info even if not in filtered results
  const showSelectedAtTop = searchQuery && selectedInfo && !filteredProviders.find(p => p.id === selectedProvider);

  // Flatten all visible providers for keyboard navigation
  const allVisibleProviders = useMemo(() => {
    const providers: ProviderInfo[] = [];
    if (showSelectedAtTop) providers.push(selectedInfo);
    providers.push(...groupedProviders.premium);
    providers.push(...groupedProviders.fast);
    providers.push(...groupedProviders.free);
    providers.push(...groupedProviders.experimental);
    return providers;
  }, [groupedProviders, selectedInfo, showSelectedAtTop]);

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

      {/* Dropdown Menu - Opens downward with fixed positioning */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[360px] max-w-[95vw] max-h-[400px] bg-popover border rounded-xl shadow-2xl z-[100] overflow-hidden flex flex-col">
          {/* Header with Search */}
          <div className="px-3 py-2 border-b bg-muted/50 space-y-2 flex-shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Select AI Model ({PROVIDER_INFO.length} available)
            </p>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Provider Groups - Scrollable area with forced scrollbar */}
          <div 
            ref={scrollableRef}
            className="flex-1 overflow-y-auto" 
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--muted)) transparent' }}
          >
            {/* Show selected provider at top when searching */}
            {showSelectedAtTop && (
              <div className="py-1 bg-primary/5 border-b">
                <div className="px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                  Currently Selected
                </div>
                <ProviderItem
                  ref={el => { itemRefs.current[0] = el; }}
                  provider={selectedInfo}
                  isSelected={true}
                  isFocused={focusedIndex === 0}
                  onClick={() => {
                    onSelect(selectedInfo.id);
                    setIsOpen(false);
                    setSearchQuery('');
                    setFocusedIndex(-1);
                  }}
                />
              </div>
            )}

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

            {/* No results message */}
            {!hasResults && searchQuery && (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No models found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Premium Providers */}
            {groupedProviders.premium.length > 0 && (
              <div className="py-1">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-popover z-10">
                  <Sparkles className="w-3 h-3" />
                  Premium ({groupedProviders.premium.length})
                </div>
                {groupedProviders.premium.map((provider, idx) => {
                  const globalIndex = (showSelectedAtTop ? 1 : 0) + idx;
                  return (
                    <ProviderItem
                      key={provider.id}
                      ref={el => { itemRefs.current[globalIndex] = el; }}
                      provider={provider}
                      isSelected={selectedProvider === provider.id}
                      isFocused={focusedIndex === globalIndex}
                      onClick={() => {
                        onSelect(provider.id);
                        setIsOpen(false);
                        setSearchQuery('');
                        setFocusedIndex(-1);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Fast Providers */}
            {groupedProviders.fast.length > 0 && (
              <div className="py-1 border-t">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-popover z-10">
                  <Zap className="w-3 h-3" />
                  Fast ({groupedProviders.fast.length})
                </div>
                {groupedProviders.fast.map((provider, idx) => {
                  const globalIndex = (showSelectedAtTop ? 1 : 0) + groupedProviders.premium.length + idx;
                  return (
                    <ProviderItem
                      key={provider.id}
                      ref={el => { itemRefs.current[globalIndex] = el; }}
                      provider={provider}
                      isSelected={selectedProvider === provider.id}
                      isFocused={focusedIndex === globalIndex}
                      onClick={() => {
                        onSelect(provider.id);
                        setIsOpen(false);
                        setSearchQuery('');
                        setFocusedIndex(-1);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Free Providers */}
            {groupedProviders.free.length > 0 && (
              <div className="py-1 border-t">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-popover z-10">
                  <Bot className="w-3 h-3" />
                  Free Tier ({groupedProviders.free.length})
                </div>
                {groupedProviders.free.map((provider, idx) => {
                  const globalIndex = (showSelectedAtTop ? 1 : 0) + groupedProviders.premium.length + groupedProviders.fast.length + idx;
                  return (
                    <ProviderItem
                      key={provider.id}
                      ref={el => { itemRefs.current[globalIndex] = el; }}
                      provider={provider}
                      isSelected={selectedProvider === provider.id}
                      isFocused={focusedIndex === globalIndex}
                      onClick={() => {
                        onSelect(provider.id);
                        setIsOpen(false);
                        setSearchQuery('');
                        setFocusedIndex(-1);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Experimental Providers */}
            {groupedProviders.experimental.length > 0 && (
              <div className="py-1 border-t">
                <div className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-popover z-10">
                  <Bot className="w-3 h-3" />
                  Experimental ({groupedProviders.experimental.length})
                </div>
                {groupedProviders.experimental.map((provider, idx) => {
                  const globalIndex = (showSelectedAtTop ? 1 : 0) + groupedProviders.premium.length + groupedProviders.fast.length + groupedProviders.free.length + idx;
                  return (
                    <ProviderItem
                      key={provider.id}
                      ref={el => { itemRefs.current[globalIndex] = el; }}
                      provider={provider}
                      isSelected={selectedProvider === provider.id}
                      isFocused={focusedIndex === globalIndex}
                      onClick={() => {
                        onSelect(provider.id);
                        setIsOpen(false);
                        setSearchQuery('');
                        setFocusedIndex(-1);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex-shrink-0">
            <p>All {PROVIDER_INFO.length} AI models available • Scroll to see more</p>
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
  isFocused?: boolean;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

const ProviderItem = ({ provider, isSelected, isFocused = false, onClick, ref }: ProviderItemProps) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        "w-full px-3 py-2 flex items-center gap-3 text-left transition-colors",
        "hover:bg-accent focus:bg-accent focus:outline-none",
        isSelected && "bg-accent",
        isFocused && "ring-2 ring-primary ring-inset bg-accent/50"
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
      {isFocused && !isSelected && (
        <span className="w-4 h-4 flex-shrink-0 text-xs text-primary">↵</span>
      )}
    </button>
  );
};
