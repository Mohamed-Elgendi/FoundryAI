'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorCodeParam = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    if (errorCodeParam === 'redirect_uri_mismatch') {
      setError('Google OAuth redirect URI mismatch. This needs to be configured in Google Cloud Console.');
      setErrorCode('redirect_uri_mismatch');
    } else if (errorParam) {
      setError(errorDescription || errorParam);
      setErrorCode(errorParam);
    }
  }, [searchParams]);

  const getErrorSolution = () => {
    if (errorCode === 'redirect_uri_mismatch') {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">How to Fix:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
            <li>Find your OAuth 2.0 Client ID</li>
            <li>Add these Authorized Redirect URIs:
              <ul className="list-disc list-inside ml-6 mt-1 text-xs bg-gray-100 p-2 rounded">
                <li><code>https://foundryai-seven.vercel.app/auth/callback</code></li>
                <li><code>https://foundryai-seven.vercel.app/auth/callback?</code></li>
              </ul>
            </li>
            <li>Save changes and wait 2-3 minutes</li>
            <li>Try signing in again</li>
          </ol>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Authentication Error</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
          {errorCode && (
            <p className="text-red-600 text-xs mt-2">Error Code: {errorCode}</p>
          )}
        </div>

        {getErrorSolution()}

        <div className="flex gap-3 mt-8">
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Authentication Error</h1>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
