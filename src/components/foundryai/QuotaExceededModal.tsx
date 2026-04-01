'use client';

import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { AIProvider, PROVIDER_INFO } from '@/layer-2-ai/router/ai-types';
import { cn } from '@/lib/utils';

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: AIProvider;
  onSelectProvider: (provider: AIProvider) => void;
}

export function QuotaExceededModal({
  isOpen,
  onClose,
  currentProvider,
  onSelectProvider,
}: QuotaExceededModalProps) {
  if (!isOpen) return null;

  const currentInfo = PROVIDER_INFO.find(p => p.id === currentProvider);

  // Filter providers that don't require API keys or have free tiers
  const alternativeProviders = PROVIDER_INFO.filter(p => 
    p.id !== currentProvider && 
    p.id !== 'fallback' &&
    (p.category === 'primary' || p.category === 'specialist')
  );

  const handleProviderSelect = (providerId: AIProvider) => {
    onSelectProvider(providerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 animate-in fade-in zoom-in duration-200">
        {/* Header with red gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-t-2xl" />
        
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                API Quota Exceeded
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentInfo?.name} has reached its limit
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
            Your current AI provider has run out of credits or hit its rate limit. 
            You can either switch to a different provider below or upgrade your API key.
          </p>

          {/* Alternative Providers */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Switch to Alternative Provider
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alternativeProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-3 text-left rounded-xl transition-all",
                    "border border-slate-200 dark:border-slate-700",
                    "hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20",
                    "hover:shadow-md"
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: provider.color }} 
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {provider.name}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {provider.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium",
                "border border-slate-200 dark:border-slate-700",
                "text-slate-600 dark:text-slate-300",
                "hover:bg-slate-50 dark:hover:bg-slate-800",
                "transition-colors"
              )}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Open provider settings or documentation
                window.open('/settings/ai-providers', '_blank');
              }}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium",
                "bg-gradient-to-r from-violet-600 to-indigo-600",
                "text-white hover:shadow-lg",
                "transition-all"
              )}
            >
              Manage API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
