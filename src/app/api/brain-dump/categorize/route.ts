import { NextRequest, NextResponse } from 'next/server';

interface CategorizationResult {
  urgent: string[];
  scheduled: string[];
  ideas: string[];
  trash: string[];
  delegate: string[];
  release: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Parse lines from content
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const result: CategorizationResult = {
      urgent: [],
      scheduled: [],
      ideas: [],
      trash: [],
      delegate: [],
      release: [],
    };

    // AI-like categorization rules
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Urgent keywords
      if (
        lowerLine.includes('urgent') ||
        lowerLine.includes('asap') ||
        lowerLine.includes('deadline') ||
        lowerLine.includes('emergency') ||
        lowerLine.includes('critical') ||
        lowerLine.includes('must') ||
        lowerLine.includes('due today') ||
        lowerLine.includes('overdue')
      ) {
        result.urgent.push(line);
        continue;
      }

      // Scheduled/Calendar keywords
      if (
        lowerLine.includes('meeting') ||
        lowerLine.includes('call') ||
        lowerLine.includes('appointment') ||
        lowerLine.includes('schedule') ||
        lowerLine.includes('tomorrow') ||
        lowerLine.includes('next week') ||
        lowerLine.includes('on monday') ||
        lowerLine.includes('on tuesday') ||
        lowerLine.includes('on wednesday') ||
        lowerLine.includes('on thursday') ||
        lowerLine.includes('on friday') ||
        lowerLine.includes('at ') ||
        lowerLine.match(/\d{1,2}:\d{2}/) ||
        lowerLine.match(/\d{1,2}\/\d{1,2}/)
      ) {
        result.scheduled.push(line);
        continue;
      }

      // Delegate keywords
      if (
        lowerLine.includes('ask ') ||
        lowerLine.includes('get someone') ||
        lowerLine.includes('delegate') ||
        lowerLine.includes('outsource') ||
        lowerLine.includes('hire') ||
        lowerLine.includes('vendor') ||
        lowerLine.includes('contractor')
      ) {
        result.delegate.push(line);
        continue;
      }

      // Release/Let go keywords
      if (
        lowerLine.includes('worry') ||
        lowerLine.includes('anxious') ||
        lowerLine.includes('stress') ||
        lowerLine.includes('fear') ||
        lowerLine.includes('maybe') ||
        lowerLine.includes('perhaps') ||
        lowerLine.includes('not sure if') ||
        lowerLine.includes("can't control") ||
        lowerLine.includes("out of my control")
      ) {
        result.release.push(line);
        continue;
      }

      // Trash keywords (noise, complaints without action)
      if (
        lowerLine.includes('ugh') ||
        lowerLine.includes('annoying') ||
        lowerLine.includes('hate') ||
        lowerLine.match(/^\s*\w+\s*$/) || // single words
        lowerLine.length < 5
      ) {
        result.trash.push(line);
        continue;
      }

      // Ideas (future, possibilities, creative)
      if (
        lowerLine.includes('idea') ||
        lowerLine.includes('could') ||
        lowerLine.includes('would be nice') ||
        lowerLine.includes('someday') ||
        lowerLine.includes('eventually') ||
        lowerLine.includes('consider') ||
        lowerLine.includes('think about') ||
        lowerLine.includes('explore') ||
        lowerLine.includes('opportunity') ||
        lowerLine.includes('potential')
      ) {
        result.ideas.push(line);
        continue;
      }

      // Default to ideas or urgent based on urgency indicators
      if (
        lowerLine.includes('need to') ||
        lowerLine.includes('should') ||
        lowerLine.includes('have to') ||
        lowerLine.includes('todo') ||
        lowerLine.includes('to do') ||
        lowerLine.includes('task')
      ) {
        result.urgent.push(line);
      } else {
        result.ideas.push(line);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Brain dump categorization error:', error);
    return NextResponse.json(
      { error: 'Failed to categorize brain dump' },
      { status: 500 }
    );
  }
}
