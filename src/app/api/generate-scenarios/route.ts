import { NextRequest, NextResponse } from 'next/server';
import { generateScenarios } from '@/lib/generation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    const result = await generateScenarios(input);

    if (!result.success) {
      const status = result.error === 'Input is required' ? 400 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error generating scenarios:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate scenarios' },
      { status: 500 }
    );
  }
}
