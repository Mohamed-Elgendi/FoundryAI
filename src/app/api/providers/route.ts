import { NextResponse } from 'next/server';
import { getProviderStatus, getDefaultProvider } from '@/lib/ai/ai-router';
import { successResponse } from '@/lib/api/response';

export async function GET() {
  try {
    const providers = getProviderStatus();
    const defaultProvider = getDefaultProvider();
    
    return successResponse({
      providers,
      defaultProvider,
      total: providers.length,
      available: providers.filter(p => p.available).length,
    });
  } catch (error: any) {
    console.error('Provider status error:', error);
    return NextResponse.json(
      { error: 'Failed to get provider status' },
      { status: 500 }
    );
  }
}
