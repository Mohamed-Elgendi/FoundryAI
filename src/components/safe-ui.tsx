'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Safe Loading Component - Shows skeleton that never crashes
 */
export function SafeLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          </div>
          <div>
            <CardTitle className="text-lg">{message}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Safe Error Display - Shows error in non-crashing way
 */
interface SafeErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export function SafeError({ 
  title = 'Something went wrong', 
  message, 
  onRetry,
  onDismiss,
  showDetails = false 
}: SafeErrorProps) {
  return (
    <Card className="w-full border-destructive/50">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base text-destructive">{title}</CardTitle>
            <CardDescription className="mt-1">
              {message}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {(onRetry || onDismiss) && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRetry}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            )}
          </div>
        </CardContent>
      )}
      {showDetails && process.env.NODE_ENV === 'development' && (
        <CardContent className="pt-0">
          <div className="bg-muted p-3 rounded text-xs font-mono overflow-auto max-h-32">
            {message}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Safe Info Display - Non-intrusive information display
 */
interface SafeInfoProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SafeInfo({ title = 'Info', message, action }: SafeInfoProps) {
  return (
    <Card className="w-full border-blue-500/50">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm text-blue-600">{title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {message}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {action && (
        <CardContent className="pt-0">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Empty State Component - Safe display when no data
 */
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  title = 'No data available', 
  description = 'Start by creating something new.',
  icon,
  action 
}: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          {icon || <Info className="w-8 h-8 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-4">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Safe Image Component - Handles image load failures
 */
interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function SafeImage({ src, alt, className, fallback }: SafeImageProps) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        {fallback || <span className="text-muted-foreground text-sm">Failed to load image</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      onError={() => setError(true)}
      onLoad={() => setLoaded(true)}
    />
  );
}

/**
 * Safe Async Render - Wraps async components safely
 */
interface SafeAsyncRenderProps<T> {
  data: T | null | undefined;
  loading: boolean;
  error: Error | null;
  onRetry?: () => void;
  render: (data: T) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export function SafeAsyncRender<T>({
  data,
  loading,
  error,
  onRetry,
  render,
  loadingComponent,
  emptyComponent,
}: SafeAsyncRenderProps<T>) {
  if (loading) {
    return loadingComponent || <SafeLoading />;
  }

  if (error) {
    return (
      <SafeError
        title="Failed to load data"
        message={error.message}
        onRetry={onRetry}
      />
    );
  }

  if (!data) {
    return emptyComponent || <EmptyState />;
  }

  return <>{render(data)}</>;
}

/**
 * Offline Banner - Shows when connection is lost
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-950 py-2 px-4 text-center text-sm font-medium z-50">
      You're offline. Some features may not work until you reconnect.
    </div>
  );
}
