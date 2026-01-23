import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateScenarios } from '@/lib/generation';
import { Project } from '@/types/project';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/projects/[id]/generate - Regenerate scenarios for a project
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, fetch the project to get its prompt_text
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: 500 }
      );
    }

    // Optionally accept a new prompt_text from request body
    let promptText = project.prompt_text;
    try {
      const body = await request.json();
      if (body.prompt_text && typeof body.prompt_text === 'string') {
        promptText = body.prompt_text.trim();
      }
    } catch {
      // No body provided, use existing prompt_text
    }

    // Generate new scenarios
    const result = await generateScenarios(promptText);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update the project with new scenarios and prompt
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        prompt_text: promptText,
        scenarios: result.data.scenarios,
        extracted_requirements: result.data.extracted_requirements,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating project with scenarios:', updateError);
      return NextResponse.json(
        { error: 'Failed to save generated scenarios' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: updatedProject as Project });
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/generate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
