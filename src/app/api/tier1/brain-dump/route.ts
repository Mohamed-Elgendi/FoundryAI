/**
 * Tier 1 Foundation API Routes - Brain Dump
 * Brain Dump System endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/brain-dump - Get recent brain dumps
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const includeItems = searchParams.get('items') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    const dumps = await tier1Repositories.brainDump.getRecentByUserId(user.id, limit);

    let result: { dumps: unknown[]; items?: Record<string, unknown[]> } = { dumps };

    if (includeItems && dumps.length > 0) {
      const items: Record<string, unknown[]> = {};
      for (const dump of dumps) {
        const dumpItems = await tier1Repositories.brainDumpItem.getByDumpId(dump.id);
        items[dump.id] = dumpItems;
      }
      result.items = items;
    }

    // Get pending items for action
    const pendingItems = await tier1Repositories.brainDumpItem.getPendingByUserId(user.id);

    // Get latest cognitive load reading
    const { data: loadData } = await supabase
      .from('cognitive_load_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('reading_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      ...result,
      pendingItems,
      cognitiveLoad: loadData,
    });
  } catch (error) {
    console.error('Error fetching brain dumps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brain dumps' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/brain-dump - Create brain dump with AI categorization
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const today = new Date().toISOString().split('T')[0];

    // Create brain dump
    const dump = await tier1Repositories.brainDump.create({
      userId: user.id,
      rawContent: body.rawContent,
      durationSeconds: body.durationSeconds,
      wordCount: body.rawContent.split(/\s+/).length,
      cognitiveLoadBefore: body.cognitiveLoadBefore,
      cognitiveLoadAfter: body.cognitiveLoadAfter,
      dumpDate: today,
    });

    if (!dump) {
      throw new Error('Failed to create brain dump');
    }

    // Create categorized items
    const items: unknown[] = [];
    if (body.categorizedItems) {
      for (const item of body.categorizedItems) {
        const createdItem = await tier1Repositories.brainDumpItem.create({
          userId: user.id,
          dumpId: dump.id,
          itemContent: item.content,
          category: item.category,
          priority: item.priority || 'medium',
          isActionable: ['urgent', 'scheduled', 'delegate'].includes(item.category),
          scheduledDate: item.scheduledDate,
          aiSuggestedAction: item.aiSuggestedAction,
          completed: false,
        });
        if (createdItem) items.push(createdItem);
      }
    }

    // Record cognitive load reading
    if (body.cognitiveLoadAfter !== undefined) {
      await supabase.from('cognitive_load_readings').insert({
        user_id: user.id,
        load_percentage: body.cognitiveLoadAfter,
        source: 'brain_dump',
        factors: body.cognitiveFactors || [],
        reading_date: new Date().toISOString(),
      });
    }

    return NextResponse.json({ dump, items, success: true });
  } catch (error) {
    console.error('Error creating brain dump:', error);
    return NextResponse.json(
      { error: 'Failed to create brain dump' },
      { status: 500 }
    );
  }
}

// PATCH /api/tier1/brain-dump/item - Update brain dump item
export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { itemId, ...updates } = body;

    const updated = await tier1Repositories.brainDumpItem.update(itemId, updates);

    return NextResponse.json({ item: updated, success: true });
  } catch (error) {
    console.error('Error updating brain dump item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}
