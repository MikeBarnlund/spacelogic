import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ScenarioFinancials, FinancialInputs, MarketOverrides } from '@/types/financial-model';
import { WorkstylePreset, ProjectKitOverrides, KitOfParts } from '@/types/kit-of-parts';
import { calculateFinancialModel, getMarketRates, applyMarketOverrides } from '@/lib/financial-modeling';
import { applyKitOverrides } from '@/lib/kit-of-parts';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/projects/[id]/financials - Get financial models for a project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('financial_models, scenarios, market_overrides')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching financial models:', error);
      return NextResponse.json(
        { error: 'Failed to fetch financial models' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      financial_models: project.financial_models || null,
      scenarios: project.scenarios || [],
      market_overrides: project.market_overrides || null,
    });
  } catch (error) {
    console.error('Error in GET /api/projects/[id]/financials:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/financials - Calculate and save financial model for a scenario
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scenario_type, inputs } = body as {
      scenario_type: WorkstylePreset;
      inputs: FinancialInputs;
    };

    // Validate inputs
    if (!scenario_type || !inputs) {
      return NextResponse.json(
        { error: 'Missing scenario_type or inputs' },
        { status: 400 }
      );
    }

    // Get the project to find the scenario sqft, market overrides, and kit overrides
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('scenarios, financial_models, market_overrides, kit_overrides')
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

    // Find the scenario to get sqft
    const scenario = project.scenarios?.find(
      (s: { scenario_type: string }) => s.scenario_type === scenario_type
    );

    if (!scenario) {
      return NextResponse.json(
        { error: `Scenario '${scenario_type}' not found` },
        { status: 404 }
      );
    }

    // Calculate effective sqft (apply kit overrides if present)
    let effectiveSqft = scenario.total_sqft;
    const kitOverrides = project.kit_overrides as ProjectKitOverrides | null;
    if (kitOverrides?.[scenario_type] && scenario.kit_of_parts) {
      const effectiveKit = applyKitOverrides(
        scenario.kit_of_parts as KitOfParts,
        kitOverrides[scenario_type]
      );
      effectiveSqft = effectiveKit.total_usable_sqft;
    }

    // Get market rates, apply any project overrides, and calculate financial model
    const baseMarketRates = getMarketRates(inputs.market_key);
    const overrides = project.market_overrides as MarketOverrides | null;
    const marketRates = applyMarketOverrides(baseMarketRates, overrides);
    const model = calculateFinancialModel(effectiveSqft, inputs, marketRates, overrides);

    // Prepare the updated financial models
    const currentModels = project.financial_models || {};
    const updatedModels: Record<WorkstylePreset, ScenarioFinancials> = {
      ...currentModels,
      [scenario_type]: {
        scenario_type,
        model,
        last_updated: new Date().toISOString(),
      },
    };

    // Save to database
    const { error: updateError } = await supabase
      .from('projects')
      .update({ financial_models: updatedModels })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error saving financial model:', updateError);
      return NextResponse.json(
        { error: 'Failed to save financial model' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      model,
      financial_models: updatedModels,
    });
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/financials:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/financials - Clear all financial models
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for optional scenario_type query param to clear just one
    const url = new URL(request.url);
    const scenarioType = url.searchParams.get('scenario_type') as WorkstylePreset | null;

    if (scenarioType) {
      // Clear just one scenario's financial model
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('financial_models')
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

      const currentModels = project.financial_models || {};
      delete currentModels[scenarioType];

      const { error: updateError } = await supabase
        .from('projects')
        .update({ financial_models: Object.keys(currentModels).length > 0 ? currentModels : null })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error clearing financial model:', updateError);
        return NextResponse.json(
          { error: 'Failed to clear financial model' },
          { status: 500 }
        );
      }
    } else {
      // Clear all financial models
      const { error } = await supabase
        .from('projects')
        .update({ financial_models: null })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing financial models:', error);
        return NextResponse.json(
          { error: 'Failed to clear financial models' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[id]/financials:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
